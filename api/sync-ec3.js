'use strict';

// Vercel serverless function that fetches one page from EC3 and upserts to
// Supabase. Called by scripts/trigger-sync.js (run from GitHub Actions).
// EC3 requests come from Vercel's IP, which is not blocked by EC3's WAF.
//
// Required Vercel env vars:
//   EC3_API_KEY          — EC3 bearer token
//   SUPABASE_URL         — https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY — service_role key
//   SYNC_SECRET          — arbitrary secret to protect this endpoint

const { createClient } = require('@supabase/supabase-js');

const BASE = 'https://buildingtransparency.org/api';
const EC3_CATEGORIES = {
  concrete: 'Concrete >> ReadyMix',
  steel:    'Steel >> StructuralSteel',
};

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

function extractGwp(item) {
  return parseGwp(item.gwp_a1a3)
      ?? parseGwp(item.gwp_A1A3)
      ?? parseGwp(item.declared_gwp)
      ?? parseGwp(item.gwp)
      ?? parseGwp(item.impacts?.gwp?.A1A3)
      ?? parseGwp(item.impacts?.GWP?.A1A3)
      ?? parseGwp(item.kg_co2e_per_m3)
      ?? null;
}

// ── Location extraction ───────────────────────────────────────────────────────

function extractLocations(item, category) {
  const results = [];
  const gwp    = extractGwp(item);
  const name   = item.name ?? item.plant_name ?? null;
  const epdUrl = item.external_validation_url ?? item.epd_url ?? item.link ?? null;

  function tryNode(node) {
    if (!node) return;
    const lat1 = node.latitude  ?? node.lat  ?? null;
    const lng1 = node.longitude ?? node.lng  ?? null;
    if (lat1 != null && lng1 != null && isFinite(+lat1) && isFinite(+lng1)) {
      results.push({ id: node.id ?? null, plant_name: node.name ?? node.plant_name ?? null,
        latitude: +lat1, longitude: +lng1, address: node.address ?? null,
        city: node.city ?? null, country: node.country ?? null,
        gwp_a1a3: gwp, product_name: name, category, epd_url: node.epd_url ?? epdUrl ?? null });
      return;
    }
    const lat2 = node.location?.latlng?.lat ?? null;
    const lng2 = node.location?.latlng?.lng ?? null;
    if (lat2 != null && lng2 != null && isFinite(+lat2) && isFinite(+lng2)) {
      results.push({ id: node.id ?? null, plant_name: node.name ?? node.plant_name ?? null,
        latitude: +lat2, longitude: +lng2,
        address: node.address ?? node.location?.address ?? null,
        city: node.city ?? node.location?.city ?? null,
        country: node.country ?? node.location?.country ?? null,
        gwp_a1a3: gwp, product_name: name, category, epd_url: node.epd_url ?? epdUrl ?? null });
      return;
    }
    if (Array.isArray(node.plants)) node.plants.forEach(p => tryNode(p));
  }

  tryNode(item);
  if (item.plant_or_group) tryNode(item.plant_or_group);
  return results;
}

function normalizeAll(items, category) {
  const seen = new Set();
  const out  = [];
  for (const item of items) {
    for (const p of extractLocations(item, category)) {
      const key = p.id || `${p.latitude.toFixed(4)}|${p.longitude.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...p, id: key });
    }
  }
  return out;
}

// ── Handler ───────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth
  const secret = req.headers['x-sync-secret'];
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: 'Invalid JSON' }); }

  const { category, page = 1 } = body || {};
  if (!category || !EC3_CATEGORIES[category]) {
    return res.status(400).json({ error: 'category must be concrete or steel' });
  }

  const ec3Key     = process.env.EC3_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const missing = [
    !ec3Key      && 'EC3_API_KEY',
    !supabaseUrl && 'SUPABASE_URL',
    !supabaseKey && 'SUPABASE_SERVICE_KEY',
  ].filter(Boolean);
  if (missing.length) {
    return res.status(503).json({ error: 'Missing env vars', missing });
  }

  const enc     = encodeURIComponent(EC3_CATEGORIES[category]);
  const headers = { Authorization: `Bearer ${ec3Key}`, Accept: 'application/json' };

  const [plantsRes, epdsRes] = await Promise.all([
    fetch(`${BASE}/plants/?page_size=200&page=${page}&product_class=${enc}`, { headers }),
    fetch(`${BASE}/epds/?page_size=200&page=${page}&category=${enc}`,        { headers }),
  ]);

  const plantsData  = plantsRes.ok ? await plantsRes.json().catch(() => ({})) : {};
  const epdsData    = epdsRes.ok   ? await epdsRes.json().catch(() => ({}))   : {};
  const plantsItems = Array.isArray(plantsData) ? plantsData : (plantsData.results || []);
  const epdsItems   = Array.isArray(epdsData)   ? epdsData   : (epdsData.results   || []);

  if (!plantsRes.ok && !epdsRes.ok) {
    return res.status(502).json({
      error: `EC3 blocked both endpoints`,
      plantsStatus: plantsRes.status,
      epdsStatus:   epdsRes.status,
    });
  }

  const normalized = normalizeAll([...plantsItems, ...epdsItems], category);

  let inserted = 0;
  if (normalized.length > 0) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const now      = new Date().toISOString();
    const rows     = normalized.map(r => ({ ...r, synced_at: now }));
    const CHUNK    = 100;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const { error } = await supabase
        .from('ec3_plants')
        .upsert(rows.slice(i, i + CHUNK), { onConflict: 'id' });
      if (!error) inserted += rows.slice(i, i + CHUNK).length;
      else console.error('[sync-ec3] upsert error:', error.message);
    }
  }

  // Continue if either endpoint still has more pages
  const hasMore = !!(plantsData.next || epdsData.next ||
    plantsItems.length === 200 || epdsItems.length === 200);

  return res.status(200).json({
    category, page,
    plantsItems: plantsItems.length,
    epdsItems:   epdsItems.length,
    normalized:  normalized.length,
    inserted,
    hasMore,
  });
};
