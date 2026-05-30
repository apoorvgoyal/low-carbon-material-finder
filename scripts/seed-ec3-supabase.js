'use strict';

/**
 * seed-ec3-supabase.js — Pull EC3 EPD data locally and seed Supabase ec3_plants.
 *
 * Run this from YOUR LOCAL MACHINE (not from Vercel / GitHub Actions).
 * Your home/office IP is not blocked by EC3's WAF; cloud server IPs are.
 *
 * Usage:
 *   EC3_API_KEY=<your-key> node scripts/seed-ec3-supabase.js
 *
 * Or store keys in .env.local (same folder as package.json):
 *   EC3_API_KEY=...
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY=eyJ...   <-- service_role key, NOT anon key
 *
 * Categories fetched: Concrete >> ReadyMix, Steel >> StructuralSteel
 *
 * Get your EC3 key: https://buildingtransparency.org/settings/ → API Keys
 * Get Supabase keys: Supabase Dashboard → Project Settings → API
 */

const fs   = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .forEach(l => {
      const eq = l.indexOf('=');
      if (eq < 1) return;
      const k = l.slice(0, eq).trim();
      const v = l.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (k && !process.env[k]) process.env[k] = v;
    });
}

const EC3_API_KEY    = process.env.EC3_API_KEY;
const SUPABASE_URL   = process.env.SUPABASE_URL;
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_KEY;

if (!EC3_API_KEY) {
  console.error('EC3_API_KEY is required. Set it in .env.local or as an env var.');
  console.error('Get your key: https://buildingtransparency.org/settings/ → API Keys');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY are required. Set them in .env.local.');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

const BASE = 'https://buildingtransparency.org/api';

const CATEGORIES = [
  { key: 'concrete', ec3: 'Concrete >> ReadyMix'       },
  { key: 'steel',    ec3: 'Steel >> StructuralSteel'   },
];

// ── GWP parsing ───────────────────────────────────────────────────────────────

function parseGwp(v) {
  if (v == null) return null;
  if (typeof v === 'number') return isFinite(v) && v > 0 ? Math.round(v * 10) / 10 : null;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
    return isFinite(n) && n > 0 ? Math.round(n * 10) / 10 : null;
  }
  if (typeof v === 'object') return parseGwp(v.qty ?? v.mean ?? v.value ?? v.declared ?? null);
  return null;
}

// openEPD v2: impacts keyed by methodology ("TRACI 2.1", "EF 3.0", etc.)
//   → impacts[methodology].gwp.A1A2A3   (A1A2A3 = Sum of A1..A3)
function extractGwp(item) {
  let v = parseGwp(item.gwp_a1a3) ?? parseGwp(item.gwp_A1A3) ?? parseGwp(item.declared_gwp);
  if (v != null) return v;

  v = parseGwp(item.gwp?.A1A2A3) ?? parseGwp(item.gwp?.A1A3);
  if (v != null) return v;

  if (item.impacts && typeof item.impacts === 'object') {
    for (const meth of Object.values(item.impacts)) {
      if (!meth || typeof meth !== 'object') continue;
      v = parseGwp(meth.gwp?.A1A2A3) ?? parseGwp(meth.gwp?.A1A3);
      if (v != null) return v;
    }
  }

  return parseGwp(item.kg_co2e_per_m3) ?? null;
}

// ── Location extraction ───────────────────────────────────────────────────────

function extractLocations(item, category) {
  const results = [];
  const gwp     = extractGwp(item);
  const name    = item.name ?? item.plant_name ?? null;
  const epdUrl  = item.external_validation_url ?? item.epd_url ?? item.link ?? null;

  function tryNode(node) {
    if (!node) return;

    // Current openEPD: location.latlng.lat/lng
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
        gwp_a1a3: gwp, product_name: name, category,
        epd_url: node.epd_url ?? epdUrl ?? null,
      });
      return;
    }

    // Deprecated flat lat/lng
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
        gwp_a1a3: gwp, product_name: name, category,
        epd_url: node.epd_url ?? epdUrl ?? null,
      });
      return;
    }

    if (Array.isArray(node.plants)) node.plants.forEach(p => tryNode(p));
  }

  tryNode(item);
  if (item.plant_or_group) tryNode(item.plant_or_group);
  return results;
}

// ── Fetch one page from EC3 ───────────────────────────────────────────────────

async function fetchPage(endpoint, params) {
  const url = `${BASE}/${endpoint}?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${EC3_API_KEY}`,
      Accept: 'application/json',
    }
  });
  if (res.status === 401) throw Object.assign(new Error('401 Unauthorized — key rejected'), { code: 401 });
  if (res.status === 403) throw Object.assign(new Error('403 Forbidden — WAF blocked this IP'), { code: 403 });
  if (!res.ok) throw new Error(`HTTP ${res.status} from EC3`);
  return res.json();
}

// ── Fetch all pages for a category ───────────────────────────────────────────

async function fetchAll(cat) {
  const seen  = new Set();
  const rows  = [];

  for (const endpoint of ['epds/', 'plants/']) {
    const paramKey = endpoint === 'epds/' ? 'category' : 'product_class';
    let page = 1;

    while (true) {
      let data;
      try {
        data = await fetchPage(endpoint, {
          [paramKey]: cat.ec3,
          page_size: 200,
          page,
        });
      } catch (err) {
        if (err.code === 401) throw err;   // bad key — abort everything
        if (err.code === 403) {
          console.error(`\n  403 from EC3: WAF blocked this IP on ${endpoint}`);
          console.error('  Make sure you\'re running this on your LOCAL machine, not a server.');
          break;
        }
        console.warn(`  ${endpoint} page ${page}: ${err.message}`);
        break;
      }

      const items = Array.isArray(data) ? data : (data.results || []);
      process.stdout.write(`\r  ${cat.key} ${endpoint.replace('/', '')} page ${page}: ${items.length} items`);

      for (const item of items) {
        for (const loc of extractLocations(item, cat.key)) {
          const key = loc.id || `${loc.latitude.toFixed(4)}|${loc.longitude.toFixed(4)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          rows.push({ ...loc, id: key });
        }
      }

      if (items.length < 200 || !data.next) break;
      page++;
    }
    console.log();
  }

  return rows;
}

// ── Upsert to Supabase ────────────────────────────────────────────────────────

async function upsert(supabase, rows) {
  const now    = new Date().toISOString();
  const dbRows = rows.map(r => ({ ...r, synced_at: now }));
  const CHUNK  = 100;
  let   done   = 0;

  for (let i = 0; i < dbRows.length; i += CHUNK) {
    const chunk = dbRows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from('ec3_plants')
      .upsert(chunk, { onConflict: 'id' });
    if (error) console.error(`  Supabase upsert error (rows ${i}–${i + chunk.length}):`, error.message);
    else done += chunk.length;
    process.stdout.write(`\r  Uploading ${done}/${rows.length}...`);
  }
  console.log();
  return done;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('EC3 → Supabase seed\n');
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`EC3 key:  ${EC3_API_KEY.slice(0, 6)}${'*'.repeat(EC3_API_KEY.length - 6)}\n`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  let total = 0;

  for (const cat of CATEGORIES) {
    console.log(`── ${cat.key} (${cat.ec3}) ─────────────────────────`);
    let rows;
    try {
      rows = await fetchAll(cat);
    } catch (err) {
      if (err.code === 401) {
        console.error('\n401 — EC3 key rejected. Get a new key at https://buildingtransparency.org/settings/');
        process.exit(1);
      }
      throw err;
    }

    const withGwp = rows.filter(r => r.gwp_a1a3 != null).length;
    console.log(`  Found ${rows.length} plants (${withGwp} with GWP)`);

    if (rows.length > 0) {
      const done = await upsert(supabase, rows);
      console.log(`  Upserted ${done} rows\n`);
      total += done;
    } else {
      console.log('  Nothing to upsert\n');
    }
  }

  console.log(`Done — ${total} total rows written to ec3_plants.`);
}

main().catch(err => { console.error('\nFatal:', err.message); process.exit(1); });
