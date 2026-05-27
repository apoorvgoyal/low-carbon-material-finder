#!/usr/bin/env node
/**
 * sync-ec3.js — Fetch EC3 plant + EPD data globally and upsert to Supabase.
 *
 * Usage:
 *   node scripts/sync-ec3.js [--dry-run]
 *
 * Required env vars (or .env.local):
 *   EC3_API_KEY          Bearer token — buildingtransparency.org → Settings → API & Integrations
 *   SUPABASE_URL         https://<project>.supabase.co
 *   SUPABASE_SERVICE_KEY service_role key (NOT the anon key)
 *
 * --dry-run: fetch and normalise but do not write to Supabase
 *
 * Run the SQL migration first:
 *   Supabase Dashboard → SQL Editor → paste supabase/migrations/002_ec3_plants.sql
 */

'use strict';

const path = require('path');
const fs   = require('fs');

// Load .env.local if present (dev convenience)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .forEach(l => {
      const [k, ...rest] = l.split('=');
      if (k && rest.length) process.env[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    });
}

const { createClient } = require('@supabase/supabase-js');

const EC3_API_KEY         = process.env.EC3_API_KEY;
const SUPABASE_URL        = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DRY_RUN             = process.argv.includes('--dry-run');

if (!EC3_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required env vars: EC3_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const BASE    = 'https://buildingtransparency.org/api';
const HEADERS = { Authorization: `Bearer ${EC3_API_KEY}`, Accept: 'application/json' };

const EC3_CATEGORIES = {
  concrete: 'Concrete >> ReadyMix',
  steel:    'Steel >> StructuralSteel',
};

// ── GWP parsing ───────────────────────────────────────────────────────────────
// EC3/openEPD encodes GWP in several shapes: plain number, Pint string
// ("250 kgCO2e"), or object ({qty/mean/value}).

function parseGwp(v) {
  if (v == null) return null;
  if (typeof v === 'number') return isFinite(v) && v > 0 ? Math.round(v * 10) / 10 : null;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
    return isFinite(n) && n > 0 ? Math.round(n * 10) / 10 : null;
  }
  if (typeof v === 'object') {
    return parseGwp(v.qty ?? v.mean ?? v.value ?? v.declared ?? null);
  }
  return null;
}

function extractGwp(item) {
  return parseGwp(item.gwp_a1a3)
      ?? parseGwp(item.gwp_A1A3)
      ?? parseGwp(item.declared_gwp)
      ?? parseGwp(item.gwp)
      ?? parseGwp(item.impacts?.gwp?.A1A3)
      ?? parseGwp(item.impacts?.GWP?.A1A3)
      ?? parseGwp(item.impacts?.gwp?.a1a3)
      ?? parseGwp(item.kg_co2e_per_m3)
      ?? null;
}

// ── Location extraction ───────────────────────────────────────────────────────
// Handles: top-level lat/lng, nested location.latlng, and Group (plants[])

function extractLocations(item, category) {
  const results = [];
  const gwp     = extractGwp(item);
  const name    = item.name ?? item.plant_name ?? null;
  const epdUrl  = item.external_validation_url ?? item.epd_url ?? item.link ?? null;

  function tryNode(node) {
    if (!node) return;

    const lat1 = node.latitude  ?? node.lat  ?? null;
    const lng1 = node.longitude ?? node.lng  ?? null;
    if (lat1 != null && lng1 != null && isFinite(+lat1) && isFinite(+lng1)) {
      results.push({
        id:           node.id ?? null,
        plant_name:   node.name ?? node.plant_name ?? null,
        latitude:     +lat1,
        longitude:    +lng1,
        address:      node.address ?? null,
        city:         node.city    ?? null,
        country:      node.country ?? null,
        gwp_a1a3:     gwp,
        product_name: name,
        category,
        epd_url:      node.epd_url ?? epdUrl ?? null,
      });
      return;
    }

    const lat2 = node.location?.latlng?.lat ?? null;
    const lng2 = node.location?.latlng?.lng ?? null;
    if (lat2 != null && lng2 != null && isFinite(+lat2) && isFinite(+lng2)) {
      results.push({
        id:           node.id ?? null,
        plant_name:   node.name ?? node.plant_name ?? null,
        latitude:     +lat2,
        longitude:    +lng2,
        address:      node.address ?? node.location?.address ?? null,
        city:         node.city    ?? node.location?.city    ?? null,
        country:      node.country ?? node.location?.country ?? null,
        gwp_a1a3:     gwp,
        product_name: name,
        category,
        epd_url:      node.epd_url ?? epdUrl ?? null,
      });
      return;
    }

    if (Array.isArray(node.plants)) {
      node.plants.forEach(p => tryNode(p));
    }
  }

  tryNode(item);
  if (item.plant_or_group) tryNode(item.plant_or_group);
  return results;
}

function normalizeAll(items, category) {
  const seen   = new Set();
  const plants = [];
  for (const item of items) {
    for (const p of extractLocations(item, category)) {
      const key = p.id || `${p.latitude.toFixed(4)}|${p.longitude.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      plants.push({ ...p, id: key });
    }
  }
  return plants;
}

// ── EC3 pagination ─────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchAllPages(baseUrl, label) {
  const all = [];
  let   url = `${baseUrl}&page=1`;

  while (url) {
    process.stdout.write(`  ${label} ${all.length} items… `);
    const r = await fetch(url, { headers: HEADERS });

    if (r.status === 401) {
      console.log('401 — EC3_API_KEY invalid or expired');
      break;
    }
    if (!r.ok) {
      console.log(`HTTP ${r.status} — stopping`);
      break;
    }

    const data  = await r.json().catch(() => ({}));
    const items = Array.isArray(data) ? data : (data.results || []);
    all.push(...items);
    process.stdout.write(`+${items.length}\n`);

    // EC3 provides data.next as a full URL when there are more pages
    url = (items.length > 0 && data.next && data.next !== url) ? data.next : null;
    if (url) await sleep(400);
  }

  return all;
}

// ── Upsert to Supabase ────────────────────────────────────────────────────────

async function upsertBatch(supabase, rows) {
  const now = new Date().toISOString();
  const rowsReady = rows.map(r => ({ ...r, synced_at: now }));

  let inserted = 0;
  const CHUNK  = 100;

  for (let i = 0; i < rowsReady.length; i += CHUNK) {
    const chunk = rowsReady.slice(i, i + CHUNK);
    const { error, count } = await supabase
      .from('ec3_plants')
      .upsert(chunk, { onConflict: 'id', count: 'exact' });

    if (error) {
      console.error(`  Upsert error (chunk ${Math.floor(i / CHUNK) + 1}):`, error.message);
    } else {
      inserted += count ?? chunk.length;
    }
  }
  return inserted;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (DRY_RUN) console.log('DRY RUN — Supabase will not be written.\n');

  const supabase   = DRY_RUN ? null : createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const syncStart  = Date.now();
  let   totalRows  = 0;

  for (const [cat, ec3Cat] of Object.entries(EC3_CATEGORIES)) {
    const enc = encodeURIComponent(ec3Cat);
    console.log(`\n══ ${cat.toUpperCase()} — "${ec3Cat}" ══`);

    const plantsRaw = await fetchAllPages(
      `${BASE}/plants/?page_size=200&product_class=${enc}`,
      '[plants]'
    );
    console.log(`  ${plantsRaw.length} raw plant objects`);

    const epdsRaw = await fetchAllPages(
      `${BASE}/epds/?page_size=200&category=${enc}`,
      '[epds  ]'
    );
    console.log(`  ${epdsRaw.length} raw EPD objects`);

    const normalized = normalizeAll([...plantsRaw, ...epdsRaw], cat);
    const withGwp    = normalized.filter(p => p.gwp_a1a3 != null).length;
    console.log(`  ${normalized.length} unique plants with coords, ${withGwp} with GWP`);

    if (DRY_RUN) {
      const sample = normalized.find(p => p.gwp_a1a3 != null) || normalized[0];
      if (sample) console.log('  Sample:', JSON.stringify(sample, null, 2));
      continue;
    }

    if (normalized.length > 0) {
      const n = await upsertBatch(supabase, normalized);
      console.log(`  ✓ ${n} rows upserted`);
      totalRows += n;
    }
  }

  if (!DRY_RUN) {
    // Record sync metadata
    await supabase.from('sync_log').upsert({
      id:           'ec3',
      last_synced:  new Date().toISOString(),
      plants_count: totalRows,
    });

    const elapsed = ((Date.now() - syncStart) / 1000).toFixed(1);
    console.log(`\n✓ Done — ${totalRows} rows upserted in ${elapsed}s`);
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
