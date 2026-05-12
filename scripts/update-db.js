#!/usr/bin/env node
/**
 * update-db.js — Low-Carbon Material Finder database updater
 *
 * Usage:
 *   node scripts/update-db.js [--dry-run] [--approve]
 *
 * Environment variables:
 *   EC3_API_KEY  — Bearer token for EC3 (Building Transparency) API
 *                  Obtain from: https://buildingtransparency.org/settings/
 *                  (Settings → API Keys → Create Key)
 *
 * Flags:
 *   --dry-run    Print fetched plants without writing database.json
 *   --approve    Auto-approve all new entries (sets status: 'approved')
 *                Default status is 'pending' (requires manual review)
 *
 * What it does:
 *   1. Reads data/database.json
 *   2. Fetches EPDs from EC3 API for ReadyMixConcrete and StructuralSteel
 *   3. Extracts plant location + GWP data from each EPD
 *   4. Merges new plants (deduped by EC3 id) into manufacturers array
 *   5. Saves updated data/database.json
 *
 * EC3 API base: https://buildingtransparency.org/api/
 * Auth: Authorization: Bearer <token>
 * Docs: https://docs.buildingtransparency.org/ec3/api-and-integrations
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

const DB_PATH    = path.join(__dirname, '..', 'data', 'database.json');
const EC3_BASE   = 'https://buildingtransparency.org/api';
const EC3_API_KEY = process.env.EC3_API_KEY || '';

const DRY_RUN    = process.argv.includes('--dry-run');
const AUTO_APPROVE = process.argv.includes('--approve');

// Categories to sync: [EC3 category slug, internal type label, GWP unit]
const CATEGORIES = [
  { slug: 'ReadyMixConcrete',  type: 'concrete', unit: 'kg CO₂e/m³'          },
  { slug: 'StructuralSteel',   type: 'steel',    unit: 'kg CO₂e/metric ton'  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('[update-db] database.json not found — creating empty database.');
    return {
      version: '1.0',
      lastUpdated: today(),
      autoSync: { enabled: false, source: 'EC3', frequency: 'weekly', lastSync: null },
      manufacturers: [],
      technologies: []
    };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(db) {
  db.lastUpdated = today();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + '\n', 'utf8');
  console.log(`[update-db] Saved database.json (${db.manufacturers.length} manufacturers).`);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path:     parsed.pathname + parsed.search,
        method:   'GET',
        headers:  {
          'Accept':       'application/json',
          'User-Agent':   'low-carbon-material-finder/1.0',
          ...headers
        }
      },
      res => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
            catch { reject(new Error(`JSON parse error for ${url}: ${data.slice(0, 200)}`)); }
          } else {
            reject(Object.assign(
              new Error(`HTTP ${res.statusCode} for ${url}`),
              { status: res.statusCode, body: data.slice(0, 400) }
            ));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

// ── EC3 fetch ────────────────────────────────────────────────────────────────

/**
 * Fetch all EPDs for a given category from EC3 API, handling pagination.
 * EC3 endpoint: GET /api/epds/?category=<slug>&page_size=100&jurisdiction=US
 *
 * Each EPD record includes:
 *   id, name, gwp (A1-A3 declared value), epd_url,
 *   manufacturer { name },
 *   plant_or_group { name, address, latitude, longitude, state }
 */
async function fetchEC3Category(category) {
  const authHeader = { 'Authorization': `Bearer ${EC3_API_KEY}` };
  const plants = [];
  let url = `${EC3_BASE}/epds/?` + new URLSearchParams({
    category:  category.slug,
    page_size: 100,
    jurisdiction: 'US',
    // Only fetch EPDs that have declared GWP or location data
    format:    'json'
  });

  let page = 1;
  let hasMore = true;

  while (hasMore) {
    let result;
    try {
      result = await httpsGet(url, authHeader);
    } catch (err) {
      // Provide actionable diagnostics for common errors
      if (err.status === 401) {
        console.error('[update-db] ✗ 401 Unauthorized — EC3_API_KEY is invalid or expired.');
        console.error('           Get a new key at: https://buildingtransparency.org/settings/');
      } else if (err.status === 403) {
        const body = (err.body || '').toLowerCase();
        if (body.includes('allowlist') || body.includes('host')) {
          console.error('[update-db] ✗ 403 — EC3 API blocked this server IP (WAF allowlist).');
          console.error('           Run this script from your local machine or a whitelisted server.');
          console.error('           EC3 may restrict server-side API calls — see their support docs.');
        } else {
          console.error(`[update-db] ✗ 403 Forbidden — ${err.body}`);
        }
      } else if (err.status === 429) {
        console.error('[update-db] ✗ 429 Rate Limited — wait before retrying.');
      } else {
        console.error(`[update-db] ✗ Fetch error (page ${page}): ${err.message}`);
      }
      break;
    }

    const data   = result.body;
    const epds   = data.results || [];
    hasMore      = !!data.next;
    url          = data.next || url;  // EC3 returns full next-page URL
    page++;

    for (const epd of epds) {
      const loc = epd.plant_or_group || epd.plant || {};
      const mfr = epd.manufacturer || {};

      const lat = parseFloat(loc.latitude  || loc.lat);
      const lng = parseFloat(loc.longitude || loc.lng || loc.lon);
      if (isNaN(lat) || isNaN(lng)) continue;

      const name = loc.name || mfr.name || epd.name || 'Unknown Plant';
      if (!name) continue;

      plants.push({
        ec3Id:      epd.id,
        name,
        mfrName:    mfr.name || name,
        address:    loc.address || loc.city || null,
        state:      loc.state || null,
        lat,
        lng,
        gwpA1A3:    epd.gwp ?? epd.gwp_A1A3 ?? null,
        productName: epd.name || null,
        epdUrl:     epd.epd_url || epd.url || null,
        category:   category.slug,
        type:       category.type,
        unit:       category.unit,
      });
    }

    if (epds.length === 0) hasMore = false;
    console.log(`[update-db]   ${category.slug} page ${page - 1}: ${epds.length} EPDs, ${plants.length} plants total so far`);
  }

  return plants;
}

// ── Merge ─────────────────────────────────────────────────────────────────────

function mergePlants(db, plants, dryRun) {
  let added = 0;

  for (const p of plants) {
    const existingId = `ec3-${p.ec3Id}`;
    if (db.manufacturers.some(m => m.id === existingId)) continue;

    const entry = {
      id:            existingId,
      status:        AUTO_APPROVE ? 'approved' : 'pending',
      source:        'ec3-sync',
      syncedAt:      new Date().toISOString(),
      company:       p.mfrName,
      productLine:   p.category,
      type:          p.type,
      coverage:      'local',
      serviceStates: p.state ? [p.state] : null,
      serviceRegion: p.address || 'See EC3',
      plantCount:    '1',
      hq:            { lat: p.lat, lng: p.lng, label: p.address || p.name || 'See EC3' },
      plantLocatorUrl: 'https://www.buildingtransparency.org/',
      about: `Plant data synced from EC3 (Building Transparency). GWP A1-A3: ${
        p.gwpA1A3 != null ? `${p.gwpA1A3} ${p.unit}` : 'see EC3'
      }.`,
      products: [{
        id:             'ec3-product',
        name:           p.productName || 'See EC3 for details',
        description:    '',
        gwpVerified:    p.gwpA1A3,
        gwpLabel:       p.gwpA1A3 != null ? `${p.gwpA1A3} ${p.unit}` : 'No data found',
        gwpEstimate:    null,
        gwpEstimateNote: null,
        gwpUnit:        p.unit,
        reductionClaim: 'No data found',
        epdAvailable:   !!p.epdUrl,
        epdUrl:         p.epdUrl || null,
        epdInfoUrl:     'https://www.buildingtransparency.org/',
        epdNote:        p.epdUrl ? 'EPD available via EC3' : 'No data found',
        ec3Searchable:  true,
        costBase:       'No data found',
        costPremium:    'No data found',
        costNote:       'Contact plant'
      }],
      sources: [{ label: 'EC3 (Building Transparency)', url: 'https://www.buildingtransparency.org/' }],
      contactUrl:    'https://www.buildingtransparency.org/',
      ec3SearchUrl:  'https://www.buildingtransparency.org/'
    };

    if (dryRun) {
      console.log(`  [dry-run] Would add: ${p.mfrName} — ${p.name} (${p.state || '?'}) GWP:${p.gwpA1A3 ?? 'n/a'}`);
    } else {
      db.manufacturers.push(entry);
    }
    added++;
  }

  return added;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!EC3_API_KEY) {
    console.error('[update-db] EC3_API_KEY is not set. Export it before running:');
    console.error('  export EC3_API_KEY=<your-key>');
    console.error('  node scripts/update-db.js');
    console.error('');
    console.error('Get your key at: https://buildingtransparency.org/settings/');
    process.exit(1);
  }

  if (DRY_RUN) console.log('[update-db] DRY RUN — no files will be written.\n');

  console.log('[update-db] Starting database update…');
  const db     = readDb();
  const before = db.manufacturers.length;
  let   total  = 0;

  for (const category of CATEGORIES) {
    console.log(`[update-db] Fetching ${category.slug}…`);
    const plants = await fetchEC3Category(category);
    console.log(`[update-db] ${category.slug}: ${plants.length} plants with location data`);

    const added = mergePlants(db, plants, DRY_RUN);
    console.log(`[update-db] ${category.slug}: ${added} new entries ${DRY_RUN ? '(dry-run)' : 'added'}`);
    total += added;
  }

  db.autoSync.lastSync = new Date().toISOString();

  if (!DRY_RUN) {
    saveDb(db);
    console.log(`\n[update-db] Done. ${total} new entries added (status: '${AUTO_APPROVE ? 'approved' : 'pending'}').`);
    if (!AUTO_APPROVE && total > 0) {
      console.log('[update-db] Review new entries in data/database.json and change status to "approved" to show them on the map.');
    }
  } else {
    console.log(`\n[update-db] Dry-run complete. Would add ${total} entries.`);
  }
}

main().catch(err => {
  console.error('[update-db] Fatal:', err.message);
  process.exit(1);
});
