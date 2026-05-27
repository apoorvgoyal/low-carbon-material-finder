'use strict';

const EC3_CATEGORY = {
  concrete: 'Concrete >> ReadyMix',
  steel:    'Steel >> StructuralSteel',
};

// Correct EC3 API endpoints
const PLANTS_URL = 'https://buildingtransparency.org/api/plants/';
const EPDS_URL   = 'https://buildingtransparency.org/api/epds/';

// EC3 EPDs embed plant_or_group with location — extract unique plants from them.
// This normalises EPD objects into the same plant shape the frontend expects.
function extractPlantsFromEpds(epds) {
  const seen = new Set();
  const plants = [];
  for (const epd of epds) {
    const pg = epd.plant_or_group;
    if (!pg) continue;
    const lat = pg.location?.latlng?.lat ?? pg.latitude ?? null;
    const lng = pg.location?.latlng?.lng ?? pg.longitude ?? null;
    if (lat == null || lng == null) continue;

    const key = pg.id || `${pg.name}|${lat}|${lng}`;
    if (seen.has(key)) continue;
    seen.add(key);

    plants.push({
      id:          pg.id || epd.id,
      plant_name:  pg.name,
      latitude:    lat,
      longitude:   lng,
      address:     pg.location?.address,
      city:        pg.location?.city,
      country:     pg.location?.country,
      gwp_A1A3:    epd.gwp_a1a3 ?? epd.gwp ?? null,
      product_name: epd.name,
      category:    epd.category,
      epd_url:     epd.external_validation_url ?? epd.link ?? null,
    });
  }
  return plants;
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

  // Strategies tried in order. Stop on 401 (bad token). 403 may mean bad params — keep trying.
  const strategies = [
    // 1. Plants endpoint filtered by product_class + jurisdiction
    { isEpd: false, buildUrl() {
      const p = new URLSearchParams({ page_size, page });
      p.set('product_class', ec3Category);
      if (jurisdiction) p.set('jurisdiction', jurisdiction);
      return `${PLANTS_URL}?${p}`;
    }},
    // 2. EPDs endpoint (normalized into plant objects by extractPlantsFromEpds)
    { isEpd: true, buildUrl() {
      const p = new URLSearchParams({ page_size, page });
      p.set('category', ec3Category);
      if (jurisdiction) p.set('jurisdiction', jurisdiction);
      return `${EPDS_URL}?${p}`;
    }},
    // 3. Plants endpoint without category (any plants in jurisdiction)
    { isEpd: false, buildUrl() {
      const p = new URLSearchParams({ page_size, page });
      if (jurisdiction) p.set('jurisdiction', jurisdiction);
      return `${PLANTS_URL}?${p}`;
    }},
  ];

  let lastStatus = 502;
  let lastData = {};

  for (const { isEpd, buildUrl } of strategies) {
    const url = buildUrl();
    console.log(`[ec3-proxy] → ${url}`);
    try {
      const r = await fetch(url, { headers });
      const data = await r.json().catch(() => ({}));
      const items = Array.isArray(data) ? data : (data.results || []);
      console.log(`[ec3-proxy] ← ${r.status}, raw: ${items.length}, type: ${isEpd ? 'epd' : 'plant'}`);

      if (r.status === 401) return res.status(401).json(data);

      if (r.ok) {
        const plants = isEpd ? extractPlantsFromEpds(items) : items;
        console.log(`[ec3-proxy] plants returned: ${plants.length}`);
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(plants);
      }

      lastStatus = r.status;
      lastData = data;
    } catch (err) {
      console.error('[ec3-proxy] fetch failed:', err.message);
    }
  }

  return res.status(lastStatus).json(lastData);
};
