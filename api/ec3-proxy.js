'use strict';

// EC3 API endpoints to try in order.
// /materials/plants/public is the correct plant-map endpoint (geographic plant locations).
// /api/epds/ is the EPD search fallback.
const EC3_ENDPOINTS = [
  'https://buildingtransparency.org/api/materials/plants/public',
  'https://buildingtransparency.org/api/epds/',
];

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
  if (!apiKey) return res.status(400).json({ error: 'apiKey is required' });
  if (!category) return res.status(400).json({ error: 'category is required' });

  const params = new URLSearchParams({ category, page_size, page });
  if (geocode) params.set('geocode', geocode);

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  };

  // Try the plants endpoint first, fall back to epds endpoint
  for (const base of EC3_ENDPOINTS) {
    try {
      const url = `${base}?${params}`;
      console.log(`[ec3-proxy] Trying ${url}`);

      const ec3Res = await fetch(url, { headers });
      let data;
      try { data = await ec3Res.json(); } catch { data = {}; }

      console.log(`[ec3-proxy] ${base} → ${ec3Res.status}, items: ${Array.isArray(data) ? data.length : (data.results?.length ?? 'n/a')}`);

      // 401/403 means bad key — return immediately, no point retrying other endpoints
      if (ec3Res.status === 401 || ec3Res.status === 403) {
        return res.status(ec3Res.status).json(data);
      }

      if (ec3Res.ok) {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error(`[ec3-proxy] ${base} failed:`, err.message);
    }
  }

  return res.status(502).json({ error: 'EC3 API unavailable on all endpoints' });
};
