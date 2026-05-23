'use strict';

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

  try {
    const ec3Res = await fetch(
      `https://buildingtransparency.org/api/materials/plants/public?${params}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' } }
    );

    let data;
    try { data = await ec3Res.json(); } catch { data = {}; }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(ec3Res.status).json(data);
  } catch (err) {
    console.error('[api/ec3-proxy]', err.message);
    return res.status(502).json({ error: 'Failed to reach EC3' });
  }
};
