'use strict';

const { createClient } = require('@supabase/supabase-js');

const EC3_CATEGORY = {
  concrete: 'Concrete >> ReadyMix',
  steel:    'Steel >> StructuralSteel',
};

const BASE = 'https://buildingtransparency.org/api';

// EC3/openEPD GWP values come in several shapes:
//   number:  250
//   string:  "250 kgCO2e"  |  "250 kg CO₂e/m3"  |  "250"
//   object:  { qty: 250, unit: "kgCO2e" }  |  { mean: 250 }  |  { value: 250 }
// Returns a plain number (rounded to 1 dp) or null.
function parseGwp(v) {
  if (v == null) return null;
  if (typeof v === 'number') return isFinite(v) ? Math.round(v * 10) / 10 : null;
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

// Extract GWP from all known EC3/openEPD field names and paths.
//
// openEPD v2 structure (confirmed from openepd Python library + sample EPDs):
//   item.impacts is keyed by methodology name ("TRACI 2.1", "EF 3.0", etc.)
//   → impacts["TRACI 2.1"].gwp.A1A2A3  (A1A2A3 = "Sum of A1..A3", NOT "A1A3")
//
// Legacy EC3 API: flat field gwp_a1a3 as a plain number.
// openEPD top-level gwp: ScopeSetGwp object → gwp.A1A2A3
function extractGwp(item) {
  // 1. Flat legacy fields
  let v = parseGwp(item.gwp_a1a3) ?? parseGwp(item.gwp_A1A3) ?? parseGwp(item.declared_gwp);
  if (v != null) return v;

  // 2. Top-level gwp object (ScopeSetGwp): gwp.A1A2A3
  v = parseGwp(item.gwp?.A1A2A3) ?? parseGwp(item.gwp?.A1A3);
  if (v != null) return v;

  // 3. impacts keyed by methodology name → methodology.gwp.A1A2A3
  if (item.impacts && typeof item.impacts === 'object') {
    for (const method of Object.values(item.impacts)) {
      if (!method || typeof method !== 'object') continue;
      v = parseGwp(method.gwp?.A1A2A3) ?? parseGwp(method.gwp?.A1A3);
      if (v != null) return v;
    }
  }

  // 4. Legacy numeric kg/m³ field
  return parseGwp(item.kg_co2e_per_m3) ?? null;
}

// EC3 openEPD format: plant_or_group can be:
//   Plant:  { latitude, longitude, location:{latlng:{lat,lng}} }
//   Group:  { plants: [ Plant, ... ] }
// Both may appear directly OR nested inside an EPD as epd.plant_or_group.
// This function normalises any of those shapes to a flat array of plant objects.
function extractLocations(item) {
  const results = [];

  function tryNode(node, gwp, productName, category) {
    if (!node) return;
    // Direct lat/lng fields (openEPD v1 + EC3 legacy)
    const lat1 = node.latitude  ?? node.lat  ?? null;
    const lng1 = node.longitude ?? node.lng  ?? null;
    if (lat1 != null && lng1 != null) {
      results.push({
        id:           node.id,
        plant_name:   node.name || node.plant_name,
        latitude:     lat1,
        longitude:    lng1,
        address:      node.address,
        city:         node.city,
        country:      node.country,
        gwp_A1A3:     gwp,
        product_name: productName,
        category,
        epd_url:      node.epd_url ?? null,
      });
      return;
    }
    // Nested location.latlng (openEPD v2)
    const lat2 = node.location?.latlng?.lat ?? null;
    const lng2 = node.location?.latlng?.lng ?? null;
    if (lat2 != null && lng2 != null) {
      results.push({
        id:           node.id,
        plant_name:   node.name || node.plant_name,
        latitude:     lat2,
        longitude:    lng2,
        address:      node.address ?? node.location?.address,
        city:         node.city    ?? node.location?.city,
        country:      node.country ?? node.location?.country,
        gwp_A1A3:     gwp,
        product_name: productName,
        category,
        epd_url:      node.epd_url ?? null,
      });
      return;
    }
    // Group: recurse into plants[]
    if (Array.isArray(node.plants)) {
      node.plants.forEach(p => tryNode(p, gwp, productName, category));
    }
  }

  const gwp     = extractGwp(item);
  const name    = item.name  ?? item.plant_name  ?? null;
  const cat     = item.category ?? item.product_class ?? null;
  const epd_url = item.external_validation_url ?? item.link ?? null;

  // If item IS a plant (has lat/lng or location) — e.g. from /api/plants/
  tryNode(item, gwp, name, cat);

  // If item is an EPD with embedded plant_or_group
  if (item.plant_or_group) {
    const pg = item.plant_or_group;
    // Attach gwp and epd_url from the EPD if not on the plant itself
    const pgGwp = gwp;
    tryNode(pg, pgGwp, name, cat);
  }

  // Fix up epd_url from EPD-level field
  for (const r of results) {
    if (!r.epd_url && epd_url) r.epd_url = epd_url;
  }

  return results;
}

function normalizeToPlants(items) {
  const seen = new Set();
  const plants = [];
  for (const item of items) {
    for (const p of extractLocations(item)) {
      const key = p.id || `${p.latitude?.toFixed(4)}|${p.longitude?.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      plants.push(p);
    }
  }
  return plants;
}

async function cacheToSupabase(plants, category) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return;
  const supabase = createClient(url, key);
  const now  = new Date().toISOString();
  const rows = plants.map(p => ({
    id:           p.id || `${(+p.latitude).toFixed(4)}|${(+p.longitude).toFixed(4)}`,
    plant_name:   p.plant_name || null,
    latitude:     +p.latitude,
    longitude:    +p.longitude,
    address:      p.address    || null,
    city:         p.city       || null,
    country:      p.country    || null,
    gwp_a1a3:     p.gwp_A1A3  ?? null,
    product_name: p.product_name || null,
    category:     category,
    epd_url:      p.epd_url   || null,
    synced_at:    now,
  })).filter(r => r.latitude && r.longitude);

  const CHUNK = 100;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await supabase.from('ec3_plants')
      .upsert(rows.slice(i, i + CHUNK), { onConflict: 'id' });
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { apiKey, category, jurisdiction, page = 1, page_size = 200 } = body || {};
  if (!apiKey)   return res.status(400).json({ error: 'apiKey is required' });
  if (!category) return res.status(400).json({ error: 'category is required' });

  const ec3Category = EC3_CATEGORY[category] || category;
  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' };

  const strategies = [];
  const addStrategy = (url) => strategies.push(url);

  const epdParams   = new URLSearchParams({ page_size, page, category: ec3Category });
  const plantParams = new URLSearchParams({ page_size, page, product_class: ec3Category });

  // EPDs first — they carry both location (plant_or_group) AND declared GWP.
  // Plants endpoint has location only, no GWP, so it comes last as a fallback.
  if (jurisdiction) {
    addStrategy(`${BASE}/epds/?${epdParams}&jurisdiction=${jurisdiction}`);
  }
  addStrategy(`${BASE}/epds/?${epdParams}`);
  if (jurisdiction) {
    addStrategy(`${BASE}/plants/?${plantParams}&jurisdiction=${jurisdiction}`);
  }
  addStrategy(`${BASE}/plants/?${plantParams}`);

  let lastStatus = 502;
  let lastData   = {};
  let gotAny200  = false;

  for (const url of strategies) {
    console.log(`[ec3-proxy] → ${url}`);
    try {
      const r = await fetch(url, { headers });
      const data = await r.json().catch(() => ({}));
      const items = Array.isArray(data) ? data : (data.results || []);
      console.log(`[ec3-proxy] ← ${r.status}, items: ${items.length}`);

      // 401 on one endpoint doesn't mean the key is bad — try remaining strategies
      // before giving up (EPDs and plants may have different auth requirements).
      if (r.status === 401) { lastStatus = 401; lastData = data; continue; }

      if (r.ok) {
        gotAny200 = true;
        // Log GWP fields to help diagnose missing GWP
        if (items.length > 0) {
          const s = items[0];
          const flatFields = ['gwp_a1a3','gwp_A1A3','declared_gwp','kg_co2e_per_m3'];
          const found = flatFields.filter(f => s[f] != null);
          const impactKeys = Object.keys(s.impacts || {});
          const gwpScopeKeys = s.gwp ? Object.keys(s.gwp) : [];
          console.log(`[ec3-proxy] flat GWP fields: [${found.join(',')}]`);
          console.log(`[ec3-proxy] gwp scope keys: [${gwpScopeKeys.join(',')}]`);
          console.log(`[ec3-proxy] impacts methodologies: [${impactKeys.join(',')}]`);
          if (impactKeys.length > 0) {
            const meth = s.impacts[impactKeys[0]];
            console.log(`[ec3-proxy] impacts.${impactKeys[0]}.gwp.A1A2A3:`, JSON.stringify(meth?.gwp?.A1A2A3));
          }
        }
        const plants = normalizeToPlants(items);
        console.log(`[ec3-proxy] plants with coords: ${plants.length}, with gwp: ${plants.filter(p=>p.gwp_A1A3!=null).length}`);
        if (plants.length > 0) {
          res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
          // Cache to Supabase in background so search-plants can serve future users
          cacheToSupabase(plants, category).catch(() => {});
          return res.status(200).json(plants);
        }
        // Got 200 but 0 plants — try next strategy before giving up
        continue;
      }

      lastStatus = r.status;
      lastData   = data;
    } catch (err) {
      console.error('[ec3-proxy] fetch failed:', err.message);
    }
  }

  // All strategies exhausted
  if (gotAny200) {
    // Connected fine but no location data in any response
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(200).json([]);
  }
  return res.status(lastStatus).json(lastData);
};
