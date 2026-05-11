#!/usr/bin/env node
/**
 * update-db.js — Low-Carbon Material Finder database updater
 *
 * Usage:
 *   node scripts/update-db.js
 *
 * Environment variables:
 *   EC3_API_KEY  — Bearer token for EC3 (Building Transparency) API (optional)
 *
 * What it does:
 *   1. Reads data/database.json
 *   2. If EC3_API_KEY is set, fetches live plant data from EC3 API
 *      and merges any new plants into the manufacturers array (status: 'pending')
 *   3. Saves updated data/database.json with new lastUpdated timestamp
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');
const EC3_API_KEY = process.env.EC3_API_KEY || '';

// ── Helpers ─────────────────────────────────────────────────────────────────

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('[update-db] database.json not found, creating empty database.');
    return {
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      autoSync: { enabled: false, source: 'EC3', frequency: 'weekly', lastSync: null },
      manufacturers: [],
      technologies: []
    };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(db) {
  db.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + '\n', 'utf8');
  console.log(`[update-db] Saved database.json (${db.manufacturers.length} manufacturers).`);
}

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const reqOptions = {
      hostname: opts.hostname,
      path: opts.pathname + opts.search,
      method: 'GET',
      headers: { 'Accept': 'application/json', 'User-Agent': 'low-carbon-material-finder/1.0', ...headers }
    };
    const req = https.request(reqOptions, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error(`JSON parse error for ${url}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ── EC3 Sync ─────────────────────────────────────────────────────────────────

async function syncFromEC3(db) {
  if (!EC3_API_KEY) {
    console.log('[update-db] EC3_API_KEY not set — skipping EC3 sync.');
    return 0;
  }

  console.log('[update-db] Fetching EC3 plant data…');
  let added = 0;

  for (const category of ['ReadyMixConcrete', 'StructuralSteel']) {
    const materialType = category === 'ReadyMixConcrete' ? 'concrete' : 'steel';
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `https://buildingtransparency.org/api/materials/plants/public?category=${category}&page=${page}&page_size=100`;
      let data;
      try {
        data = await httpsGet(url, { 'Authorization': `Bearer ${EC3_API_KEY}` });
      } catch (err) {
        console.warn(`[update-db] EC3 fetch error (page ${page}): ${err.message}`);
        break;
      }

      const plants = data.results || [];
      hasMore = !!data.next;
      page++;

      for (const plant of plants) {
        if (!plant.latitude || !plant.longitude || !plant.plant_name) continue;

        const existingId = `ec3-${plant.id}`;
        const alreadyExists = db.manufacturers.some(m => m.id === existingId);
        if (alreadyExists) continue;

        const gwpVal = plant.gwp_A1A3 || null;
        const unit = materialType === 'concrete' ? 'kg CO₂e/m³' : 'kg CO₂e/metric ton';

        db.manufacturers.push({
          id: existingId,
          status: 'pending',
          source: 'ec3-sync',
          syncedAt: new Date().toISOString(),
          company: plant.plant_name,
          productLine: plant.category || materialType,
          type: materialType,
          coverage: 'local',
          serviceStates: plant.state ? [plant.state] : null,
          serviceRegion: plant.address || 'See EC3',
          plantCount: '1',
          hq: { lat: plant.latitude, lng: plant.longitude, label: plant.address || 'See EC3' },
          plantLocatorUrl: 'https://www.buildingtransparency.org/',
          about: `Plant data from EC3 (Building Transparency). GWP: ${gwpVal != null ? gwpVal + ' ' + unit : 'see EC3'}.`,
          products: [{
            id: 'ec3-product',
            name: plant.product_name || 'See EC3 for details',
            description: '',
            gwpVerified: gwpVal,
            gwpLabel: gwpVal != null ? `${gwpVal} ${unit}` : 'No data found',
            gwpEstimate: null, gwpEstimateNote: null, gwpUnit: unit,
            reductionClaim: 'No data found',
            epdAvailable: !!plant.epd_url,
            epdUrl: plant.epd_url || null,
            epdInfoUrl: 'https://www.buildingtransparency.org/',
            epdNote: plant.epd_url ? 'EPD available via EC3' : 'No data found',
            ec3Searchable: true,
            costBase: 'No data found', costPremium: 'No data found', costNote: 'Contact plant'
          }],
          sources: [{ label: 'EC3 (Building Transparency)', url: 'https://www.buildingtransparency.org/' }],
          contactUrl: 'https://www.buildingtransparency.org/',
          ec3SearchUrl: 'https://www.buildingtransparency.org/'
        });
        added++;
      }

      if (plants.length === 0) hasMore = false;
    }
  }

  db.autoSync.lastSync = new Date().toISOString();
  console.log(`[update-db] EC3 sync complete. ${added} new plants added (status: pending).`);
  return added;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[update-db] Starting database update…');
  const db = readDb();
  const before = db.manufacturers.length;

  await syncFromEC3(db);

  const after = db.manufacturers.length;
  if (after !== before) {
    saveDb(db);
    console.log(`[update-db] Done. Added ${after - before} entries (review and approve in database.json).`);
  } else {
    saveDb(db); // still update lastUpdated
    console.log('[update-db] No new entries found.');
  }
}

main().catch(err => { console.error('[update-db] Fatal error:', err); process.exit(1); });
