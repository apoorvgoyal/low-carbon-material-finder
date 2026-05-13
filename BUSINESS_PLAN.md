# Low-Carbon Material Finder — Business Plan & Deployment Roadmap

**Version 1.0 · May 2026**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Market Opportunity](#3-market-opportunity)
4. [Revenue Model](#4-revenue-model)
5. [Customer Segments](#5-customer-segments)
6. [Go-to-Market Strategy](#6-go-to-market-strategy)
7. [Competitive Landscape](#7-competitive-landscape)
8. [What Is Missing — Feature Gap Analysis](#8-what-is-missing--feature-gap-analysis)
9. [Deployment Readiness Roadmap](#9-deployment-readiness-roadmap)
10. [Technical Architecture for Production](#10-technical-architecture-for-production)
11. [Financial Projections](#11-financial-projections)
12. [Risks & Mitigations](#12-risks--mitigations)

---

## 1. Executive Summary

The Low-Carbon Material Finder is a map-based tool that helps architects, structural engineers, and general contractors identify concrete and steel suppliers that can meet embodied carbon targets on construction projects. Today it is a free, open-source static website. This plan describes how to evolve it into a two-sided marketplace with a sustainable revenue model.

**The core insight:** The construction industry is undergoing a mandatory shift toward low-embodied-carbon materials driven by building codes (Buy Clean California, NYC Local Law 97, LEED v5, IRA incentives). Specifiers need to find compliant suppliers fast. Suppliers need to reach specifiers who are already filtering by GWP. This tool sits at that intersection.

**Revenue model summary:**
- **Manufacturer Data Listings** — suppliers pay to upload verified EPD data, appear with GWP badges, and receive lead analytics ($600–$3,600/plant/year)
- **Specifier Project Tools** — design firms pay for saved projects, GWP exports, team seats, and API access ($49–$299/month/firm)

**Year 1 target:** $180,000 ARR from 60 paying manufacturer plant listings + 30 firm subscriptions.
**Year 3 target:** $1.2M ARR from 300 plant listings + 200 firm subscriptions.

---

## 2. Product Overview

### What It Does Today

- Interactive Leaflet.js map of the continental USA
- Filters concrete and steel manufacturers by ZIP code, radius, and product type
- GWP Target mode: shows all plants nationwide that can meet a carbon target
- Color-coded GWP scale (green = low carbon, red = high carbon)
- Technology badges: CO₂ Mineralization, EAF Steel, Novel Binder, etc.
- EC3 API sync script for importing plant data from Building Transparency
- Community submission form (`submit.html`) for manufacturers to self-report
- Mobile-responsive layout

### What It Is Not (Yet)

- It has no backend, no database, no user accounts, no payments
- All data is hardcoded in `data/manufacturers.js` (a JavaScript file)
- Submitted data goes nowhere automatically — it requires manual JSON editing
- There is no way for a manufacturer to manage their own listing
- There is no analytics, no email, no notifications

---

## 3. Market Opportunity

### Demand Drivers

| Driver | Detail |
|---|---|
| Buy Clean California Act | State-funded projects must meet GWP thresholds for concrete, steel, flat glass |
| NYC Local Law 97 | $268/ton CO₂e penalties above limits starting 2024, escalating 2030 |
| LEED v5 (2025) | Mandatory EPD credit; GWP benchmarks tied to certification level |
| IRA § 48C / 45L | Tax credits tied to low-carbon materials in manufacturing and construction |
| SEC Climate Disclosure | Scope 3 reporting pressure pushing GCs to track embodied carbon in supply chain |
| EU CBAM | Carbon border adjustment creating global cost pressure on high-GWP steel |

### Market Size

- **US construction starts:** ~$2.1T/year. Embodied carbon materials (concrete, steel, glass, aluminum) represent roughly 40% of project cost on structural projects.
- **AEC firms with sustainability staff:** ~8,500 firms in the US have at least one sustainability or carbon lead (USGBC estimate).
- **Concrete plants in the US:** ~5,500 ready-mix plants (NRMCA). ~1,200 have filed EPDs with EC3. Addressable listing market: 1,200 plants with existing EPD data, growing 15%/year.
- **US structural steel fabricators/mills:** ~240 EAF mills, ~3,000 fabricators.

### The Specifier Pain Point

Finding a low-carbon concrete or steel supplier today requires:
1. Searching EC3 manually (requires account, complex filtering)
2. Calling a regional sales rep and asking if they have EPDs
3. Cross-referencing state-specific buy clean databases (each has different format)
4. Emailing 4–6 plants and waiting for responses

This tool compresses that process to 30 seconds.

### The Supplier Pain Point

A plant spends $15k–50k on an EPD and then relies on a sales rep to email it to specifiers. There is no passive inbound channel. A verified listing in a tool that specifiers are already using is a direct ROI.

---

## 4. Revenue Model

### Stream 1: Manufacturer Data Listings (Primary)

Manufacturers pay to upload verified EPD data and appear as "EPD Verified" in search results.

| Tier | Price | What's Included |
|---|---|---|
| **Basic (Free)** | $0 | Name, location, material type, website link — appears in results but no GWP data shown |
| **Verified** | $600/plant/year | Upload EPD PDF, GWP value displayed, green badge, contact form leads sent to plant |
| **Featured** | $1,800/plant/year | Everything in Verified + promoted placement in sidebar, analytics dashboard, 3 product lines |
| **Enterprise** | $3,600+/year | Multi-plant account, API access to listing data, white-label embed option, dedicated onboarding |

**Key principle:** GWP color (green/red) is always honest. A high-GWP plant that pays for Verified still shows up red. The badge means "this GWP is real and audited," not "this plant is green." This is what keeps specifier trust — and specifier trust is what makes the listing worth paying for.

**Upsell logic:** The EC3 sync script already identifies ~1,200 plants with existing EPD data. Outreach to those plants is the warmest possible pitch: "Your EPD data is already on EC3 — we can surface it to specifiers searching by ZIP and GWP target for $600/year."

### Stream 2: Specifier Project Tools (Secondary)

Design firms pay for workflow features that turn the tool from a discovery map into a project document.

| Tier | Price | What's Included |
|---|---|---|
| **Free** | $0 | Map search, GWP filter, basic results |
| **Project** | $49/month | Save project locations, export results to PDF/CSV, 5 saved searches |
| **Team** | $149/month | Up to 10 seats, shared project library, GWP comparison reports, Slack/email notifications when new plants open in radius |
| **Firm** | $299/month | Unlimited seats, API access, custom GWP benchmarks per project type, LEED/BREEAM export format |

**Conversion path:** The free tool is genuinely useful and drives adoption. The upgrade trigger is when a specifier wants to put results into a deliverable — a LEED submittal, a client embodied carbon report, a project spec. That's the moment they need an export.

### Stream 3: Data Licensing (Future — Year 2+)

The curated, verified manufacturer database becomes valuable as a standalone data product:
- License to BIM/Revit plugin developers ($500/month API access)
- License to cost estimating software (RSMeans, Procore) for carbon-integrated cost models
- License to state agencies building buy clean procurement databases

---

## 5. Customer Segments

### Segment A: Specifiers (Users of the map)

| Persona | Role | Need |
|---|---|---|
| Sustainability Lead | Large AEC firm | GWP data for LEED submittals, client reports |
| Structural Engineer | Mid-size firm | Find a concrete plant in radius that meets spec GWP |
| Owner's Rep | Developer/GC | Verify supplier claims, track embodied carbon across portfolio |
| Procurement Manager | Public agency | Buy Clean compliance documentation |

**How they find the tool:** Search ("low carbon concrete suppliers [city]"), USGBC/AIA sustainability networks, LinkedIn posts by sustainability leads, EC3 community.

### Segment B: Manufacturers (Paying for listings)

| Persona | Role | Need |
|---|---|---|
| Sustainability Director | Regional concrete producer | Justify EPD investment, generate inbound leads |
| Marketing Manager | National steel brand | Differentiate from competitors on GWP in spec community |
| Sales Engineer | Precast plant | Reach architects early in project, before spec is locked |
| Business Development | Novel binder startup | Build brand awareness while technology scales up |

**How they find the tool:** Their EPD consultant mentions it, EC3 community, sales rep hears specifier reference it, LinkedIn.

---

## 6. Go-to-Market Strategy

### Phase 1: Build Credibility (Months 1–6)

- Publish tool publicly on custom domain (e.g., `lowcarbonfinder.com`)
- Submit to EC3 community newsletter, CLF (Carbon Leadership Forum) resources list, USGBC resource library
- Write one case study: "How to find a Buy Clean compliant concrete plant in California in under 2 minutes"
- Cold outreach to 20 regional concrete producers with existing EPDs: offer free Verified listing for first 6 months
- Target: 20 free Verified listings, 500 monthly active specifiers

### Phase 2: First Revenue (Months 6–12)

- Convert free Verified listings to paid ($600/year)
- Launch Project tier for specifiers ($49/month)
- Add analytics dashboard so manufacturers can see search impressions
- Target: 60 paying plant listings ($36k ARR), 30 firm subscriptions ($53k ARR) = **$89k ARR**

### Phase 3: Scale (Year 2–3)

- Hire one part-time sales rep focused on national concrete/steel brands (Holcim, CEMEX, Nucor)
- Launch API licensing to BIM plugin developers
- Expand to Canada (LEED v4 adoption, carbon pricing)
- Add aluminum and mass timber categories
- Target: 300 plant listings + 200 firm subscriptions = **$1.2M ARR**

---

## 7. Competitive Landscape

| Tool | Strengths | Weaknesses vs. This Tool |
|---|---|---|
| **EC3 (Building Transparency)** | Deep EPD database, industry standard | Complex UI, no map-first UX, requires account to search, not optimized for project specifiers |
| **Tally (Autodesk)** | Integrated into Revit | Requires BIM model, not useful for early project phases, no supplier search |
| **oneClickLCA** | Full LCA platform | Expensive ($500+/month), overkill for supplier search |
| **State buy clean lists** | Official compliance | Static PDFs, no map, no GWP comparison, not updated frequently |
| **Manufacturer websites** | Direct contact info | Can't compare across suppliers, no third-party verification |

**Differentiation:** This tool is the only one that is map-first, mobile-friendly, free to specifiers at the basic tier, and optimized for the "I need a compliant plant within 50 miles" use case that happens dozens of times per project.

---

## 8. What Is Missing — Feature Gap Analysis

This section catalogs every capability the tool needs before it can generate revenue. Items are grouped by priority.

### P0 — Required Before Any Revenue

These are blockers. Without them, the tool cannot charge anyone.

#### 8.1 Backend & Real Database
**Current state:** Data is hardcoded in `data/manufacturers.js`. Submissions via `submit.html` go nowhere.
**What's needed:** A real database (PostgreSQL or SQLite) with tables for manufacturers, products, EPDs, users, and subscriptions. An API layer (Node/Express, Python/FastAPI, or serverless functions) that the frontend calls instead of reading a static JS file.

#### 8.2 User Authentication
**Current state:** No accounts. Anyone can view everything.
**What's needed:** Auth system for two user types:
- **Manufacturers:** log in to manage their listing, upload EPDs, view analytics
- **Specifiers:** log in to save projects and access paid exports
- Options: Auth0 (fastest), Clerk, or custom JWT. Google OAuth is sufficient for specifiers; email/password for manufacturers.

#### 8.3 Payment Processing
**Current state:** No payments.
**What's needed:** Stripe integration for:
- Manufacturer listing subscriptions (annual billing, card on file)
- Specifier plan subscriptions (monthly/annual, seat-based)
- Stripe Customer Portal for self-serve plan management
- Webhook handling for subscription events (created, cancelled, past-due)

#### 8.4 EPD File Upload & Storage
**Current state:** GWP values are manually hardcoded.
**What's needed:** File upload flow where manufacturers upload their EPD PDF. Store in S3 or Cloudflare R2. Admin reviews and manually enters (or auto-extracts) the verified GWP value. Mark listing as "EPD Verified" after review.

#### 8.5 Admin Dashboard
**Current state:** Updating `database.json` requires editing a JSON file manually.
**What's needed:** A password-protected admin interface to:
- Review and approve/reject submitted manufacturers
- Edit GWP values after EPD review
- Set listing tier (Basic/Verified/Featured)
- Manage user accounts and subscriptions
- View platform analytics (searches per day, popular regions, top GWP targets)

---

### P1 — Required for Good Product Experience

#### 8.6 Manufacturer Self-Serve Dashboard
Manufacturers who pay need to be able to:
- Edit their company description, logo, contact URL
- Add/remove plant locations
- Upload new EPD documents when certifications update
- View their analytics: impressions, searches that surfaced them, geographic breakdown of specifier interest

#### 8.7 Specifier Export (PDF / CSV)
The most critical paid feature. When a specifier runs a search, they need to export:
- A table of matching plants with GWP, distance, contact info, EPD link
- Formatted for pasting into a LEED submittal or client report
- CSV for import into project management software

#### 8.8 Saved Projects
Allow specifiers to:
- Save a project location with a name (e.g., "One Herald Square — NYC")
- Store GWP target and radius per project
- Return later and re-run the search (useful when more plants get verified)
- Share a project link with teammates

#### 8.9 Email Notifications
- Manufacturer: "You received 3 new specifier views this week in [state]"
- Specifier: "A new EPD-verified concrete plant opened within 50 miles of your saved project"
- Admin: "New manufacturer submission needs review"
- Subscription: Stripe-generated receipts and renewal reminders

#### 8.10 Mobile Submission Flow
The current `submit.html` is desktop-optimized. A manufacturer's sales rep filling this out on a phone (common scenario at a trade show or plant visit) needs a streamlined mobile form.

---

### P2 — Competitive Differentiators (Year 2)

#### 8.11 EC3 Live Data Pull (User-Facing)
The EC3 sync script exists but requires a server to run. Expose it as a "Refresh from EC3" button in the admin dashboard that specifiers can also trigger (rate-limited). This keeps the database current without manual work.

#### 8.12 GWP Benchmarks by Project Type
Different projects have different GWP thresholds. Add presets:
- LEED v4 Concrete Benchmark (regional average - 10%)
- Buy Clean California limits by concrete strength class
- NYC Local Law 97 thresholds
- Custom (current slider)

#### 8.13 Multi-Plant Accounts
National producers (Holcim, CEMEX, Nucor) have dozens of plants. Allow Enterprise accounts to manage all plants under one login, with bulk EPD upload and a unified analytics view.

#### 8.14 Comparison Mode
Let specifiers select 2–4 plants and see a side-by-side GWP comparison table with product specs, EPD links, and contact info — exportable as a single PDF.

#### 8.15 Revit / BIM Plugin
A Revit add-in that embeds the map inside the design environment. Specifiers never leave their authoring tool. This is a distribution strategy as much as a feature.

---

### P3 — Nice to Have

- **Verified Reviews:** Specifiers can leave a star rating + comment on a plant after a project closes
- **RFQ Tool:** Specifiers can send a structured quote request to multiple plants simultaneously
- **Carbon Trajectory Tracking:** Show a plant's GWP trend over time as EPDs are renewed
- **API Public Docs:** Let third-party developers query verified plant data with an API key

---

## 9. Deployment Readiness Roadmap

"Deployment ready" means the tool is stable, secure, scalable, and maintainable by someone who wasn't involved in building it. Below is what that requires and how long each phase takes.

### What "Deployment Ready" Means

| Dimension | Not Ready (Today) | Ready |
|---|---|---|
| **Hosting** | GitHub Pages (static only) | Proper server or serverless with custom domain, SSL, CDN |
| **Data** | Hardcoded JS file | Database with backups, migrations, access control |
| **Auth** | None | Secure login with session management and password reset |
| **Payments** | None | Stripe with webhook handling and subscription lifecycle |
| **Monitoring** | None | Error tracking, uptime alerts, performance metrics |
| **Security** | None enforced | Input validation, rate limiting, HTTPS, CSP headers |
| **Backups** | None (git is not a backup) | Automated daily database backups with restore testing |
| **Updates** | Manual file edits | Admin UI or CMS, no code deployment required for data changes |

---

### Phase 0: Foundation (Weeks 1–4)

**Goal:** Move off GitHub Pages onto a real host with a domain and HTTPS.

- Register domain (`lowcarbonfinder.com` or similar)
- Choose hosting stack (see Section 10)
- Set up SSL certificate (Let's Encrypt or Cloudflare)
- Configure CDN (Cloudflare free tier is sufficient)
- Set up error monitoring (Sentry free tier)
- Set up uptime monitoring (Better Uptime or UptimeRobot)
- Move static assets (map tiles, fonts) to CDN-backed URLs

**Deliverable:** Tool is publicly accessible at a real domain, loads fast, and someone gets paged if it goes down.

**Cost:** $15/month domain + $5/month VPS or $0 on Vercel/Netlify free tier.

---

### Phase 1: Backend & Database (Weeks 5–10)

**Goal:** Replace static JSON with a real database and API.

- Set up PostgreSQL (or SQLite for simplicity) with tables:
  - `manufacturers` (id, name, type, status, tier, created_at)
  - `plants` (id, manufacturer_id, lat, lng, address, state)
  - `products` (id, plant_id, name, gwp_verified, gwp_unit, epd_url)
  - `users` (id, email, role, stripe_customer_id)
  - `subscriptions` (id, user_id, plan, status, stripe_subscription_id)
- Build REST API endpoints:
  - `GET /api/manufacturers?state=CA&material=concrete&maxGwp=250`
  - `POST /api/submit` (manufacturer submission)
  - `GET /api/manufacturer/:id`
- Migrate existing hardcoded manufacturers from `data/manufacturers.js` into database
- Update frontend to fetch from API instead of static file
- Set up automated daily database backups to S3

**Deliverable:** Data lives in a database. Adding a new manufacturer no longer requires a code deploy.

---

### Phase 2: Auth & Admin (Weeks 11–16)

**Goal:** Admin can manage data without touching code. Manufacturers can log in.

- Implement authentication (Auth0 or Clerk recommended for speed)
- Build admin dashboard (simple HTML/CSS or Next.js):
  - Manufacturer review queue (approve / reject submissions)
  - Edit GWP values after EPD review
  - User management
  - Basic analytics (searches per day, top states)
- Build manufacturer dashboard:
  - Edit company description, logo, contact info
  - Upload EPD PDF (stored in S3/R2)
  - View impression analytics
- Implement email notifications (Resend or SendGrid):
  - Submission confirmation to manufacturer
  - Review notification to admin
  - Welcome email on approval

**Deliverable:** The tool can be operated by a non-technical admin. Manufacturers can self-serve.

---

### Phase 3: Payments & Monetization (Weeks 17–22)

**Goal:** First dollar of revenue.

- Integrate Stripe:
  - Product catalog: Verified ($600/year), Featured ($1,800/year), Project ($49/month), Team ($149/month)
  - Checkout flow for manufacturer upgrades
  - Customer Portal for self-serve plan management
  - Webhook handler for subscription lifecycle events
- Implement feature gating:
  - GWP badge and EPD link only visible on Verified+ listings
  - Export button only for Project+ specifiers
  - Analytics dashboard only for paying manufacturers
- Launch pricing page explaining tiers
- Set up Stripe test mode → production switch checklist

**Deliverable:** A manufacturer can find the tool, create a listing, pay, and go live without any human intervention.

---

### Phase 4: Specifier Tools & Polish (Weeks 23–28)

**Goal:** Paid specifier features that justify the subscription.

- PDF export (use Puppeteer or a PDF library server-side)
- CSV export
- Saved projects (stored per user account)
- Email alerts when new verified plants open near a saved project
- Mobile form improvements
- Accessibility audit (WCAG 2.1 AA — important for public agency users)
- Performance audit (Lighthouse score ≥ 90)
- Security audit: input validation, rate limiting, CSP headers, SQL injection checks

**Deliverable:** Tool is complete, polished, and ready for press coverage and sales outreach.

---

## 10. Technical Architecture for Production

### Recommended Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | Current HTML/CSS/JS (keep) | No need to rewrite what works. Add fetch() calls to API. |
| **API** | Node.js + Express or Hono | Familiar language, fast to build, good Stripe/Auth0 SDKs |
| **Database** | PostgreSQL (Supabase hosted) | Free tier covers early stage; easy to migrate off |
| **Auth** | Clerk | Free up to 10k MAU, drop-in React components, handles sessions |
| **Payments** | Stripe | Industry standard, best documentation |
| **File Storage** | Cloudflare R2 | S3-compatible, no egress fees, $0 for first 10GB |
| **Hosting** | Vercel (frontend) + Railway (API) | Free/low-cost, zero-DevOps deployment, good DX |
| **Email** | Resend | Simple API, good deliverability, $0 for first 3k/month |
| **Monitoring** | Sentry (errors) + Better Uptime | Both have free tiers adequate for early stage |
| **CDN** | Cloudflare free tier | Already needed for DNS; adds caching and DDoS protection |

### Why Not a Monolith on a Single VPS?

A single VPS (DigitalOcean droplet, $12/month) is actually fine for early stage. The table above reflects a "no-DevOps" preference — managed services mean you are not patching servers, configuring nginx, or managing SSL renewals. As the business scales, migrating to dedicated infrastructure is straightforward.

### Data Flow (Production)

```
User browser
    │
    ├── GET /api/manufacturers?... ──► Node API ──► PostgreSQL
    │                                      │
    │                                      └── Auth0/Clerk token validation
    │
    ├── POST /api/submit ──────────────► Node API ──► PostgreSQL (pending)
    │                                      │
    │                                      └── Email → admin (Resend)
    │
    ├── POST /api/checkout ────────────► Node API ──► Stripe
    │
    └── Static assets (HTML/CSS/JS) ──► Cloudflare CDN ──► Vercel
```

### Security Checklist for Production

- [ ] All API endpoints require authentication except public manufacturer search
- [ ] Rate limiting on search endpoint (100 req/min per IP) to prevent scraping
- [ ] Input validation on all POST bodies (no raw SQL, use parameterized queries)
- [ ] EPD file upload: validate MIME type server-side, max 20MB, virus scan
- [ ] Content Security Policy headers (prevent XSS)
- [ ] HTTPS enforced everywhere, HSTS header set
- [ ] Stripe webhooks verified with signature secret
- [ ] Admin routes protected by role check (not just authentication)
- [ ] Database credentials never in frontend code or git history
- [ ] Automated dependency updates (Dependabot)

---

## 11. Financial Projections

### Assumptions

- Manufacturer listings: 60% annual churn in Year 1, improving to 30% by Year 3 (manufacturers renew when they see lead value)
- Specifier subscriptions: 8% monthly churn (SaaS benchmark for SMB)
- Average listing tier mix: 60% Verified, 30% Featured, 10% Enterprise
- Average specifier tier mix: 50% Project, 35% Team, 15% Firm
- Customer acquisition cost (CAC): $200 for manufacturers (email outreach + trade shows), $50 for specifiers (SEO + word of mouth)

### Revenue Model

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Paying manufacturer plants | 60 | 160 | 320 |
| Avg. revenue per plant/year | $1,100 | $1,300 | $1,400 |
| Manufacturer revenue | $66,000 | $208,000 | $448,000 |
| Paying specifier firms | 30 | 100 | 220 |
| Avg. revenue per firm/month | $95 | $110 | $130 |
| Specifier revenue | $34,200 | $132,000 | $343,200 |
| Data licensing | $0 | $12,000 | $60,000 |
| **Total ARR** | **$100,200** | **$352,000** | **$851,200** |

### Cost Structure

| Cost | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Infrastructure (hosting, DB, email, storage) | $3,600 | $8,400 | $18,000 |
| Stripe fees (~2.9% of revenue) | $2,900 | $10,200 | $24,700 |
| Domain + misc SaaS tools | $1,200 | $2,400 | $3,600 |
| Part-time sales/outreach (Year 2+) | $0 | $40,000 | $60,000 |
| **Total Costs** | **$7,700** | **$61,000** | **$106,300** |
| **Net** | **$92,500** | **$291,000** | **$744,900** |

*These are pre-tax, pre-founder-salary figures. Adjust based on whether this is a side project or a funded company.*

### Break-Even Analysis

The tool reaches break-even (covering infrastructure costs) at approximately **10 paying manufacturer listings** ($11,000 ARR). At the proposed pricing, this is achievable within the first 90 days of launch with a modest outreach effort.

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| EC3 becomes free and map-based | Medium | High | Move faster on specifier tools (EC3 won't build project management features) |
| Manufacturers don't pay because EC3 is "good enough" | Medium | High | Offer free trial period; lead analytics are the real value EC3 doesn't provide |
| Specifiers won't pay for exports | Medium | Medium | Test with $0 freemium first; export is the natural upgrade trigger |
| GWP data accuracy liability | Low | High | Always show source, link to EPD PDF, include disclaimer that specifiers verify with manufacturer |
| Small number of verified plants makes tool less useful | High (early) | High | Seed the database by importing EC3 data as "unverified" to show value before manufacturers pay |
| Regulatory changes make GWP thresholds obsolete | Low | Medium | Benchmarks are configurable; add LEED v5 and Buy Clean presets as they update |
| GitHub Pages goes away or changes policy | Low | Low | Already planned to move to proper hosting in Phase 0 |

---

## Appendix: Current Tool File Structure

```
low-carbon-material-finder/
├── index.html              # Main application (map + UI)
├── submit.html             # Manufacturer submission form
├── js/
│   └── app.js              # Application logic (Leaflet, search, filters)
├── data/
│   ├── manufacturers.js    # Hardcoded manufacturer data (to be replaced by DB)
│   └── database.json       # Community submissions skeleton
├── scripts/
│   └── update-db.js        # EC3 API sync script (Node.js)
└── .github/
    └── workflows/
        └── update-db.yml   # Weekly GitHub Action for EC3 sync
```

### What Each File Becomes in Production

| Current File | Production Equivalent |
|---|---|
| `data/manufacturers.js` | PostgreSQL `manufacturers` + `products` tables |
| `data/database.json` | Same tables, `status='pending'` rows |
| `submit.html` | Same form, POST to `/api/submit` instead of clipboard copy |
| `scripts/update-db.js` | Same script, runs on a cron job on the server (not GitHub Actions) |
| `.github/workflows/update-db.yml` | Replaced by server-side cron or admin dashboard "Sync EC3" button |
| `js/app.js` | Same file, replace static data reads with `fetch('/api/manufacturers?...')` |
| `index.html` | Same file, add auth state, export buttons, saved projects UI |

---

*This document was prepared in May 2026. Financial projections are illustrative estimates based on comparable SaaS marketplaces in the AEC industry.*
