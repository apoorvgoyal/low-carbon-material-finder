# Deployment Guide — Low-Carbon Material Finder

Get from static GitHub Pages → live Vercel + Supabase in ~30 minutes.

---

## Step 1: Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a name (e.g. `low-carbon-finder`) and a strong database password
3. Select the region closest to your users (e.g. `us-east-1`)
4. Once created, go to **SQL Editor** and paste the contents of `supabase/migrations/001_initial.sql` → **Run**
5. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (keep secret — seed script only)

---

## Step 2: Seed the Database

This imports all the curated manufacturers from `data/manufacturers.js` into Supabase.

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your Supabase credentials
cp .env.example .env.local
# Edit .env.local and fill in SUPABASE_URL + SUPABASE_SERVICE_KEY

# 3. Run the seed script
npm run seed
```

You should see output like:
```
[seed-db] Starting seed…
── Technologies ─────────
  ✓ co2-mineralization
  ✓ eaf-steel
  ...
── Concrete Manufacturers ─────────
  ✓ holcim-ecopact (concrete) — 3 product(s)
  ✓ cemex-vertua (concrete) — 3 product(s)
  ...
[seed-db] Done. 20 manufacturers seeded.
```

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts. When asked about environment variables, add:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Option B: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository (`apoorvgoyal/low-carbon-material-finder`)
3. In **Environment Variables**, add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key
4. Click **Deploy**

---

## Step 4: Add a Custom Domain (Optional)

1. In Vercel Dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `lowcarbonfinder.com`)
3. Follow the DNS instructions (add a CNAME or A record at your registrar)
4. SSL is automatic via Vercel

---

## Step 5: Verify It Works

After deployment, open your Vercel URL and:

1. The map should load with manufacturer pins visible
2. Check `https://yourapp.vercel.app/api/manufacturers` in the browser — should return JSON with `manufacturers` array
3. Go to `submit.html`, fill out the form, submit — check Supabase Dashboard → Table Editor → `manufacturers` to see the pending row

---

## Local Development

```bash
npm install
cp .env.example .env.local   # add your Supabase credentials
npm run dev                  # starts Vercel dev server at localhost:3000
```

The `vercel dev` command runs the API routes locally, so `fetch('/api/manufacturers')` works from the browser just like in production.

---

## Environment Variables Reference

| Variable | Where Used | Required |
|---|---|---|
| `SUPABASE_URL` | API routes (Vercel) | Yes |
| `SUPABASE_ANON_KEY` | API routes (Vercel) | Yes |
| `SUPABASE_SERVICE_KEY` | `scripts/seed-db.js` only — never deploy this | Seed only |
| `EC3_API_KEY` | `scripts/update-db.js` + GitHub Actions | Optional |

---

## Database Management

### Adding a New Manufacturer (Admin)

1. Go to Supabase Dashboard → **Table Editor → manufacturers**
2. Find the `pending` row submitted via the form
3. Review the data, set `status` → `approved`, `tier` → `basic`
4. The manufacturer will appear on the map within 5 minutes (API cache TTL)

### Running EC3 Sync Manually

```bash
EC3_API_KEY=your_key node scripts/update-db.js
```

Or trigger it from GitHub Actions: **Actions tab → Update Manufacturer Database → Run workflow**

---

## Architecture

```
Browser
  ├── GET /api/manufacturers → Vercel Function → Supabase (read)
  ├── POST /api/submit       → Vercel Function → Supabase (write, pending)
  └── Static assets          → Vercel CDN

Admin
  └── Supabase Dashboard → approve submissions, edit data

Scripts (run locally or on CI)
  ├── scripts/seed-db.js    → Supabase (service_role write)
  └── scripts/update-db.js  → EC3 API → Supabase (service_role write)
```
