'use strict';

// EC3 category mapping: our internal names → EC3 taxonomy
const EC3_CATEGORY = {
  concrete: 'Concrete >> ReadyMix',
  steel:    'Steel >> StructuralSteel',
};

const PLANTS_URL = 'https://buildingtransparency.org/api/materials/plants/public';
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

  const { apiKey, category, jurisdiction, page = 1, page_size = 200 } = body || {};
  if (!apiKey)   return res.status(400).json({ error: 'apiKey is required' });
  if (!category) return res.status(400).json({ error: 'category is required' });

  const ec3Category = EC3_CATEGORY[category] || category;
  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' };

  // Strategies to try in order. We stop on 401 (definite bad token).
  // 403 may mean bad params rather than bad token, so we keep trying.
  const strategies = [
    // 1. Plants endpoint with product_class filter
    () => {
      const p = new URLSearchParams({ page_size, page });
      p.set('product_class', ec3Category);
      if (jurisdiction) p.set('jurisdiction', jurisdiction);
      return `${PLANTS_URL}?${p}`;
    },
    // 2. Plants endpoint without category (return all nearby plants)
    () => {
      const p = new URLSearchParams({ page_size, page });
      if (jurisdiction) p.set('jurisdiction', jurisdiction);
      return `${PLANTS_URL}?${p}`;
    },
    // 3. EPDs endpoint with category
    () => {
      const p = new URLSearchParams({ page_size, page });
      p.set('category', ec3Category);
      if (jurisdiction) p.set('jurisdiction', jurisdiction);
      return `${EPDS_URL}?${p}`;
    },
  ];

  let lastStatus = 502;
  let lastData = {};

  for (const buildUrl of strategies) {
    const url = buildUrl();
    console.log(`[ec3-proxy] → ${url}`);
    try {
      const r = await fetch(url, { headers });
      const data = await r.json().catch(() => ({}));
      const n = Array.isArray(data) ? data.length : (data?.results?.length ?? 'n/a');
      console.log(`[ec3-proxy] ← ${r.status}, items: ${n}`);

      // 401 = definitely bad token; stop immediately
      if (r.status === 401) return res.status(401).json(data);

      if (r.ok) {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(data);
      }

      // 403 might be bad params rather than bad auth — record it and try next strategy
      lastStatus = r.status;
      lastData = data;
    } catch (err) {
      console.error('[ec3-proxy] fetch failed:', err.message);
    }
  }

  // All strategies failed — if it was 403 on all, it's likely a bad token
  return res.status(lastStatus).json(lastData);
};
