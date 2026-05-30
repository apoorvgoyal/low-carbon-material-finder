'use strict';

/**
 * Import EC3 EPD export into Supabase ec3_plants table.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=<service_role_key> \
 *   node scripts/import-ec3-export.js <path-to-ec3-export.json> [category]
 *
 * <path-to-ec3-export.json>: EC3 JSON export downloaded from EC3's Materials page
 * [category]: "concrete" or "steel" (auto-detected from product_class if omitted)
 *
 * HOW TO GET THE EC3 EXPORT:
 *   1. Log in at https://buildingtransparency.org/ec3
 *   2. Go to Materials → search for your category (e.g. "Concrete >> ReadyMix")
 *   3. Apply filters as needed, then click "Download" / "Export EPDs"
 *   4. Save the JSON file and pass its path as the first argument
 *
 * Alternatively, if you have an EC3 API key, download directly:
 *   curl -H "Authorization: Bearer <key>" \
 *     "https://buildingtransparency.org/api/epds/?category=Concrete+%3E%3E+ReadyMix&page_size=200" \
 *     -o concrete-epds.json
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ── GWP parsing ───────────────────────────────────────────────────────────────
// openEPD Measurement: { mean, qty, value, unit, dist, rsd }

function parseGwp(v) {
  if (v == null) return null;
  if (typeof v === 'number') return isFinite(v) && v > 0 ? Math.round(v * 10) / 10 : null;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
    return isFinite(n) && n > 0 ? Math.round(n * 10) / 10 : null;
  }
  if (typeof v === 'object') {
    const raw = v.qty ?? v.mean ?? v.value ?? v.declared ?? null;
    return parseGwp(raw);
  }
  return null;
}

// openEPD v2: impacts is keyed by methodology ("TRACI 2.1", "EF 3.0", etc.)
//   → impacts[methodology].gwp.A1A2A3   (A1A2A3 = Sum of A1..A3)
// Legacy EC3 API: flat field gwp_a1a3 as a plain number.
function extractGwp(item) {
  let v = parseGwp(item.gwp_a1a3) ?? parseGwp(item.gwp_A1A3) ?? parseGwp(item.declared_gwp);
  if (v != null) return v;

  v = parseGwp(item.gwp?.A1A2A3) ?? parseGwp(item.gwp?.A1A3);
  if (v != null) return v;

  if (item.impacts && typeof item.impacts === 'object') {
    for (const method of Object.values(item.impacts)) {
      if (!method || typeof method !== 'object') continue;
      v = parseGwp(method.gwp?.A1A2A3) ?? parseGwp(method.gwp?.A1A3);
      if (v != null) return v;
    }
  }

  return parseGwp(item.kg_co2e_per_m3) ?? null;
}

// ── Location extraction ───────────────────────────────────────────────────────
// openEPD v2 Plant: location.latlng.lat / location.latlng.lng
// Legacy / deprecated: latitude / longitude directly on plant node
// Group: { plants: [ Plant, ... ] }

function extractLocations(item, categoryHint) {
  const results = [];
  const gwp     = extractGwp(item);
  const name    = item.name ?? item.plant_name ?? null;
  const epdUrl  = item.external_validation_url ?? item.epd_url ?? item.link ?? null;
  const cat     = item.category ?? item.product_class ?? categoryHint ?? null;

  function tryNode(node) {
    if (!node) return;

    // Current format: location.latlng
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
        category:     cat,
        epd_url:      node.epd_url ?? epdUrl ?? null,
      });
      return;
    }

    // Deprecated flat lat/lng on plant node
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
        category:     cat,
        epd_url:      node.epd_url ?? epdUrl ?? null,
      });
      return;
    }

    // Plus-code in ID (e.g. "865P2W3V+3W.manufacturer.com") — no lat/lng available
    // We skip these because we can't geocode without an external service
    if (node.id && node.id.includes('+') && !node.location?.latlng) {
      return;
    }

    // Group: recurse into plants[]
    if (Array.isArray(node.plants)) node.plants.forEach(p => tryNode(p));
  }

  // If item is itself a plant
  tryNode(item);
  // If item is an EPD with embedded plant_or_group
  if (item.plant_or_group) tryNode(item.plant_or_group);

  return results;
}

// ── Category detection ────────────────────────────────────────────────────────

function detectCategory(item) {
  const c = (item.category ?? item.product_class ?? '').toLowerCase();
  if (c.includes('concrete') || c.includes('readymix') || c.includes('ready mix')) return 'concrete';
  if (c.includes('steel') || c.includes('structural')) return 'steel';
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const filePath  = process.argv[2];
  const catArg    = process.argv[3]; // optional: "concrete" or "steel"

  if (!filePath) {
    console.error('Usage: node import-ec3-export.js <file.json> [concrete|steel]');
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
    process.exit(1);
  }

  // Parse input file
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
  } catch (e) {
    console.error('Failed to parse JSON:', e.message);
    process.exit(1);
  }

  const items = Array.isArray(raw) ? raw : (raw.results ?? raw.data ?? [raw]);
  console.log(`Loaded ${items.length} items from ${filePath}`);

  // Extract plant rows
  const seen  = new Set();
  const rows  = [];
  let noCoord = 0;
  let noGwp   = 0;

  for (const item of items) {
    const catHint = catArg ?? detectCategory(item);
    const locs = extractLocations(item, catHint);
    if (locs.length === 0) { noCoord++; continue; }

    for (const loc of locs) {
      const key = loc.id || `${loc.latitude.toFixed(4)}|${loc.longitude.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!loc.gwp_a1a3) noGwp++;
      rows.push({ ...loc, id: key });
    }
  }

  console.log(`Extracted ${rows.length} unique plant locations`);
  console.log(`  → with GWP:    ${rows.length - noGwp}`);
  console.log(`  → without GWP: ${noGwp}`);
  console.log(`  → no coords:   ${noCoord} items skipped`);

  if (rows.length === 0) {
    console.log('Nothing to insert.');
    return;
  }

  // Upsert to Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);
  const now      = new Date().toISOString();
  const dbRows   = rows.map(r => ({ ...r, synced_at: now }));

  const CHUNK   = 100;
  let inserted  = 0;
  for (let i = 0; i < dbRows.length; i += CHUNK) {
    const chunk = dbRows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from('ec3_plants')
      .upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Chunk ${i}–${i + chunk.length} error:`, error.message);
    } else {
      inserted += chunk.length;
      process.stdout.write(`\rUploaded ${inserted}/${rows.length}...`);
    }
  }
  console.log(`\nDone — ${inserted} rows upserted to ec3_plants.`);
}

main().catch(err => { console.error(err); process.exit(1); });
