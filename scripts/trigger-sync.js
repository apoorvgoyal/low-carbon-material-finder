#!/usr/bin/env node
/**
 * trigger-sync.js — Triggers the /api/sync-ec3 Vercel endpoint page by page.
 *
 * Used by GitHub Actions so EC3 requests come from Vercel's IP (not blocked),
 * while GitHub Actions just orchestrates the pagination loop.
 *
 * Required env:
 *   VERCEL_URL   — https://your-app.vercel.app  (no trailing slash)
 *   SYNC_SECRET  — must match SYNC_SECRET set in Vercel env vars
 */
'use strict';

const VERCEL_URL  = (process.env.VERCEL_URL  || '').replace(/\/$/, '');
const SYNC_SECRET = process.env.SYNC_SECRET  || '';

if (!VERCEL_URL || !SYNC_SECRET) {
  console.error('VERCEL_URL and SYNC_SECRET must be set');
  process.exit(1);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function syncCategory(category) {
  console.log(`\n══ ${category.toUpperCase()} ══`);
  let page = 1;

  while (true) {
    const res = await fetch(`${VERCEL_URL}/api/sync-ec3`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-sync-secret': SYNC_SECRET },
      body:    JSON.stringify({ category, page }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error(`  page ${page}: HTTP ${res.status} — ${txt.slice(0, 200)}`);
      break;
    }

    const data = await res.json();
    console.log(`  page ${page}: plants=${data.plantsItems} epds=${data.epdsItems} ` +
                `normalised=${data.normalized} inserted=${data.inserted} ` +
                `hasMore=${data.hasMore}`);

    if (!data.hasMore) break;
    page++;
    await sleep(600);
  }
}

async function main() {
  for (const cat of ['concrete', 'steel']) {
    await syncCategory(cat);
  }
  console.log('\n✓ Trigger complete');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
