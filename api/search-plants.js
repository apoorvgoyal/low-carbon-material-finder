'use strict';

const { createClient } = require('@supabase/supabase-js');

const MILES_TO_METERS = 1609.344;

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { category, lat, lng, radiusMiles = 100 } = body || {};
  if (!category)          return res.status(400).json({ error: 'category required' });
  if (lat == null || lng == null) return res.status(400).json({ error: 'lat/lng required' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.rpc('search_ec3_plants', {
    p_category:      category,
    p_lat:           +lat,
    p_lng:           +lng,
    p_radius_meters: +radiusMiles * MILES_TO_METERS,
    p_limit:         500,
  });

  if (error) {
    console.error('[search-plants]', error.message);
    return res.status(500).json({ error: 'Query failed', detail: error.message });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(data || []);
};
