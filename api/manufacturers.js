'use strict';

const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  return createClient(url, key);
}

// Transform snake_case DB row → camelCase frontend format
function toFrontendFormat(m) {
  return {
    id: m.id,
    status: m.status,
    tier: m.tier,
    company: m.company,
    productLine: m.product_line,
    type: m.type,
    coverage: m.coverage,
    serviceStates: m.service_states,
    serviceRegion: m.service_region,
    plantCount: m.plant_count,
    hq: { lat: parseFloat(m.hq_lat), lng: parseFloat(m.hq_lng), label: m.hq_label },
    plantLocatorUrl: m.plant_locator_url,
    logoColor: m.logo_color,
    about: m.about,
    technologyStatus: m.technology_status,
    contactUrl: m.contact_url,
    ec3SearchUrl: m.ec3_search_url,
    source: m.source,
    products: (m.products || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      gwpVerified: p.gwp_verified != null ? parseFloat(p.gwp_verified) : null,
      gwpLabel: p.gwp_label,
      gwpEstimate: p.gwp_estimate != null ? parseFloat(p.gwp_estimate) : null,
      gwpEstimateNote: p.gwp_estimate_note,
      gwpUnit: p.gwp_unit,
      reductionClaim: p.reduction_claim,
      epdAvailable: p.epd_available,
      epdNote: p.epd_note,
      epdUrl: p.epd_url,
      epdInfoUrl: p.epd_info_url,
      ec3Searchable: p.ec3_searchable,
      costBase: p.cost_base,
      costPremium: p.cost_premium,
      costNote: p.cost_note
    })),
    sources: (m.manufacturer_sources || []).map(s => ({ label: s.label, url: s.url }))
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;
  const validTypes = ['concrete', 'steel'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({ error: 'type must be "concrete" or "steel"' });
  }

  try {
    const supabase = getSupabase();

    let query = supabase
      .from('manufacturers')
      .select(`
        *,
        products (*),
        manufacturer_sources (label, url)
      `)
      .eq('status', 'approved')
      .order('company');

    if (type) query = query.eq('type', type);

    const { data, error } = await query;

    if (error) throw error;

    const manufacturers = (data || []).map(toFrontendFormat);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ manufacturers, total: manufacturers.length });

  } catch (err) {
    console.error('[api/manufacturers]', err.message);
    return res.status(500).json({ error: 'Failed to fetch manufacturers' });
  }
};
