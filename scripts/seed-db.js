#!/usr/bin/env node
/**
 * seed-db.js — Seed Supabase with the curated manufacturer data from manufacturers.js
 *
 * Usage:
 *   node scripts/seed-db.js
 *
 * Requires .env.local with:
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY=eyJ...   (service_role key — NOT anon key)
 *
 * Run the SQL migration first:
 *   Supabase Dashboard → SQL Editor → paste supabase/migrations/001_initial.sql
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// Load env from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .forEach(line => {
      const [k, ...rest] = line.split('=');
      if (k && rest.length) process.env[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    });
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL         = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[seed-db] ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env.local');
  console.error('  Get the service_role key from: Supabase Dashboard → Project Settings → API');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Load manufacturer data (stubs window so the browser module runs in Node)
global.window = {};
require(path.join(__dirname, '..', 'data', 'manufacturers.js'));
const MANUFACTURERS = global.window.MANUFACTURERS;

// Load technologies from database.json
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'database.json'), 'utf8'));

async function seedTechnologies() {
  console.log('\n── Technologies ────────────────────');
  for (const t of db.technologies) {
    const { error } = await supabase.from('technologies').upsert({
      id:          t.id,
      name:        t.name,
      description: t.description,
      examples:    t.examples || []
    }, { onConflict: 'id' });

    if (error) {
      console.error(`  ✗ ${t.id}: ${error.message}`);
    } else {
      console.log(`  ✓ ${t.id}`);
    }
  }
}

async function seedManufacturer(m) {
  // Insert / update manufacturer row
  const { error: mErr } = await supabase.from('manufacturers').upsert({
    id:                m.id,
    status:            'approved',
    tier:              'basic',
    company:           m.company,
    product_line:      m.productLine || null,
    type:              m.type,
    coverage:          m.coverage || null,
    service_states:    m.serviceStates    || null,
    service_countries: m.serviceCountries || null,
    service_region:    m.serviceRegion    || null,
    country:           m.country          || null,
    country_code:      m.countryCode      || null,
    plant_count:       m.plantCount   || null,
    hq_lat:            m.hq.lat,
    hq_lng:            m.hq.lng,
    hq_label:          m.hq.label     || null,
    plant_locator_url: m.plantLocatorUrl || null,
    logo_color:        m.logoColor    || null,
    about:             m.about        || null,
    technology_status: m.technologyStatus || null,
    contact_url:       m.contactUrl   || null,
    ec3_search_url:    m.ec3SearchUrl || null,
    source:            'seed'
  }, { onConflict: 'id' });

  if (mErr) {
    console.error(`  ✗ ${m.id} (manufacturer): ${mErr.message}`);
    return;
  }

  // Delete old products and sources so upsert is clean
  await supabase.from('products').delete().eq('manufacturer_id', m.id);
  await supabase.from('manufacturer_sources').delete().eq('manufacturer_id', m.id);

  // Insert products
  for (const p of (m.products || [])) {
    const { error: pErr } = await supabase.from('products').insert({
      id:               p.id,
      manufacturer_id:  m.id,
      name:             p.name,
      description:      p.description || null,
      gwp_verified:     p.gwpVerified  != null ? p.gwpVerified  : null,
      gwp_label:        p.gwpLabel     || null,
      gwp_estimate:     p.gwpEstimate  != null ? p.gwpEstimate  : null,
      gwp_estimate_note:p.gwpEstimateNote || null,
      gwp_unit:         p.gwpUnit      || null,
      reduction_claim:  p.reductionClaim || null,
      epd_available:    !!p.epdAvailable,
      epd_note:         p.epdNote      || null,
      epd_url:          p.epdUrl       || null,
      epd_info_url:     p.epdInfoUrl   || null,
      ec3_searchable:   !!p.ec3Searchable,
      cost_base:        p.costBase     || null,
      cost_premium:     p.costPremium  || null,
      cost_note:        p.costNote     || null
    });

    if (pErr) console.warn(`    ⚠ product ${p.id}: ${pErr.message}`);
  }

  // Insert sources
  for (const s of (m.sources || [])) {
    if (!s.url) continue;
    await supabase.from('manufacturer_sources').insert({
      manufacturer_id: m.id,
      label:           s.label || null,
      url:             s.url
    });
  }

  console.log(`  ✓ ${m.id} (${m.type}) — ${(m.products || []).length} product(s)`);
}

async function main() {
  console.log('[seed-db] Starting seed…');
  console.log(`  Supabase: ${SUPABASE_URL}`);

  await seedTechnologies();

  console.log('\n── Concrete Manufacturers ───────────');
  for (const m of MANUFACTURERS.concrete) {
    await seedManufacturer(m);
  }

  console.log('\n── Steel Manufacturers ──────────────');
  for (const m of MANUFACTURERS.steel) {
    await seedManufacturer(m);
  }

  const total = MANUFACTURERS.concrete.length + MANUFACTURERS.steel.length;
  console.log(`\n[seed-db] Done. ${total} manufacturers seeded.`);
}

main().catch(err => {
  console.error('[seed-db] Fatal error:', err);
  process.exit(1);
});
