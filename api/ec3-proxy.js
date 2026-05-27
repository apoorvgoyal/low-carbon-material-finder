'use strict';

// EC3 category mapping: our internal names → EC3 "Concrete >> ReadyMix" taxonomy
const EC3_CATEGORY = {
  concrete: 'Concrete >> ReadyMix',
  steel:    'Steel >> StructuralSteel',
};

// Plants endpoint: geographic plant locations (used by EC3's public map)
const PLANTS_URL = 'https://buildingtransparency.org/api/materials/plants/public';
// EPDs endpoint: fallback for EPD-level data
const EPDS_URL   = 'https://buildingtransparency.org/api/epds/';

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { apiKey, category, geocode, page = 1, page_size = 200 } = body || {};
  if (!apiKey)    return res.status(400).json({ error: 'apiKey is required' });
  if (!category)  return res.status(400).json({ error: 'category is required' });

  // Translate our internal category key to EC3's taxonomy string
  const ec3Category = EC3_CATEGORY[category] || category;

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
  };

  // ── Try 1: plants/public with EC3 category ─────────────────────────────────
  {
    const params = new URLSearchParams({ page_size, page });
    params.set('product_class', ec3Category);          // plants endpoint uses product_class
    if (geocode) params.set('geocode', geocode);
    const url = `${PLANTS_URL}?${params}`;
    console.log(`[ec3-proxy] plants → ${url}`);
    try {
      const r = await fetch(url, { headers });
      const data = await safeJson(r);
      console.log(`[ec3-proxy] plants → ${r.status}, items: ${count(data)}`);
      if (r.status === 401 || r.status === 403) return res.status(r.status).json(data);
      if (r.ok) {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error('[ec3-proxy] plants failed:', err.message);
    }
  }

  // ── Try 2: plants/public without category (broader search) ─────────────────
  {
    const params = new URLSearchParams({ page_size, page });
    if (geocode) params.set('geocode', geocode);
    const url = `${PLANTS_URL}?${params}`;
    console.log(`[ec3-proxy] plants (no category) → ${url}`);
    try {
      const r = await fetch(url, { headers });
      const data = await safeJson(r);
      console.log(`[ec3-proxy] plants (no cat) → ${r.status}, items: ${count(data)}`);
      if (r.status === 401 || r.status === 403) return res.status(r.status).json(data);
      if (r.ok) {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error('[ec3-proxy] plants (no cat) failed:', err.message);
    }
  }

  // ── Try 3: EPDs endpoint with EC3 category ──────────────────────────────────
  {
    const params = new URLSearchParams({ page_size, page });
    params.set('category', ec3Category);
    if (geocode) params.set('geocode', geocode);
    const url = `${EPDS_URL}?${params}`;
    console.log(`[ec3-proxy] epds → ${url}`);
    try {
      const r = await fetch(url, { headers });
      const data = await safeJson(r);
      console.log(`[ec3-proxy] epds → ${r.status}, items: ${count(data)}`);
      if (r.status === 401 || r.status === 403) return res.status(r.status).json(data);
      if (r.ok) {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error('[ec3-proxy] epds failed:', err.message);
    }
  }

  return res.status(502).json({ error: 'EC3 API unavailable on all endpoints' });
};

function safeJson(r) {
  return r.json().catch(() => ({}));
}
function count(data) {
  return Array.isArray(data) ? data.length : (data?.results?.length ?? 'n/a');
}
