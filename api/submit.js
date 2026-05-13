'use strict';

const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  return createClient(url, key);
}

function validateSubmission(body) {
  const errors = [];
  if (!body.company || typeof body.company !== 'string' || !body.company.trim()) {
    errors.push('company is required');
  }
  if (!['concrete', 'steel'].includes(body.type)) {
    errors.push('type must be "concrete" or "steel"');
  }
  if (body.hq_lat == null || isNaN(parseFloat(body.hq_lat))) {
    errors.push('hq_lat is required and must be a number');
  }
  if (body.hq_lng == null || isNaN(parseFloat(body.hq_lng))) {
    errors.push('hq_lng is required and must be a number');
  }
  const lat = parseFloat(body.hq_lat);
  const lng = parseFloat(body.hq_lng);
  if (lat < 14 || lat > 72 || lng < -180 || lng > -50) {
    errors.push('hq coordinates appear to be outside North America');
  }
  if (!Array.isArray(body.products) || body.products.length === 0) {
    errors.push('at least one product is required');
  }
  return errors;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const errors = validateSubmission(body);
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  // Rate-limit hint (simple IP check — Vercel provides real IP)
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  console.log(`[api/submit] submission from ${ip}: ${body.company}`);

  try {
    const supabase = getSupabase();

    // Generate a stable ID from company name
    const id = 'sub-' + body.company.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 40) + '-' + Date.now().toString(36);

    // Insert manufacturer (pending review)
    const { error: mErr } = await supabase.from('manufacturers').insert({
      id,
      status: 'pending',
      tier: 'basic',
      company: body.company.trim().substring(0, 200),
      product_line: (body.productLine || '').trim().substring(0, 200) || null,
      type: body.type,
      coverage: ['national', 'regional', 'local'].includes(body.coverage) ? body.coverage : 'local',
      service_states: Array.isArray(body.serviceStates) ? body.serviceStates.slice(0, 56) : null,
      service_region: (body.serviceRegion || '').trim().substring(0, 500) || null,
      plant_count: (body.plantCount || '').trim().substring(0, 100) || null,
      hq_lat: parseFloat(body.hq_lat),
      hq_lng: parseFloat(body.hq_lng),
      hq_label: (body.hq_label || '').trim().substring(0, 300) || null,
      plant_locator_url: sanitizeUrl(body.plantLocatorUrl),
      about: (body.about || '').trim().substring(0, 2000) || null,
      technology_status: ['commercial', 'licensed', 'precommercial'].includes(body.technologyStatus)
        ? body.technologyStatus : null,
      contact_url: sanitizeUrl(body.contactUrl),
      ec3_search_url: sanitizeUrl(body.ec3SearchUrl),
      source: 'community-submission'
    });

    if (mErr) throw mErr;

    // Insert products
    for (const p of (body.products || []).slice(0, 10)) {
      if (!p.name || typeof p.name !== 'string') continue;
      const productId = id + '-' + (p.name || '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').substring(0, 30);

      const { error: pErr } = await supabase.from('products').insert({
        id: productId,
        manufacturer_id: id,
        name: p.name.trim().substring(0, 200),
        description: (p.description || '').trim().substring(0, 1000) || null,
        gwp_verified: parseGwp(p.gwpVerified),
        gwp_label: (p.gwpLabel || '').trim().substring(0, 200) || null,
        gwp_estimate: parseGwp(p.gwpEstimate),
        gwp_estimate_note: (p.gwpEstimateNote || '').trim().substring(0, 500) || null,
        gwp_unit: p.gwpUnit || (body.type === 'concrete' ? 'kg CO₂e/m³' : 'kg CO₂e/metric ton'),
        reduction_claim: (p.reductionClaim || '').trim().substring(0, 300) || null,
        epd_available: !!p.epdAvailable,
        epd_note: (p.epdNote || '').trim().substring(0, 500) || null,
        epd_url: sanitizeUrl(p.epdUrl),
        epd_info_url: sanitizeUrl(p.epdInfoUrl),
        ec3_searchable: !!p.ec3Searchable,
        cost_base: (p.costBase || 'No data found').substring(0, 200),
        cost_premium: (p.costPremium || 'No data found').substring(0, 200),
        cost_note: (p.costNote || '').trim().substring(0, 500) || null
      });

      if (pErr) console.warn(`[api/submit] product insert warning: ${pErr.message}`);
    }

    // Insert sources
    for (const s of (body.sources || []).slice(0, 5)) {
      if (!s.url) continue;
      await supabase.from('manufacturer_sources').insert({
        manufacturer_id: id,
        label: (s.label || '').trim().substring(0, 200) || null,
        url: sanitizeUrl(s.url)
      });
    }

    return res.status(201).json({
      success: true,
      id,
      message: 'Submission received. It will appear on the map after admin review (typically 1–3 business days).'
    });

  } catch (err) {
    console.error('[api/submit]', err.message);
    return res.status(500).json({ error: 'Submission failed. Please try again.' });
  }
};

function parseGwp(val) {
  if (val == null || val === '' || val === 'No data found') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim().substring(0, 500);
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return null;
  return trimmed;
}
