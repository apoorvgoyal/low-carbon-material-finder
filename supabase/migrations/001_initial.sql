-- Low-Carbon Material Finder — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor

-- ── Technologies ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS technologies (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  examples    TEXT[]
);

-- ── Manufacturers ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manufacturers (
  id                 TEXT PRIMARY KEY,
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'approved', 'rejected')),
  tier               TEXT NOT NULL DEFAULT 'basic'
                       CHECK (tier IN ('basic', 'verified', 'featured', 'enterprise')),
  company            TEXT NOT NULL,
  product_line       TEXT,
  type               TEXT NOT NULL CHECK (type IN ('concrete', 'steel')),
  coverage           TEXT CHECK (coverage IN ('national', 'regional', 'local')),
  service_states     TEXT[],
  service_region     TEXT,
  plant_count        TEXT,
  hq_lat             DECIMAL(10, 7) NOT NULL,
  hq_lng             DECIMAL(10, 7) NOT NULL,
  hq_label           TEXT,
  plant_locator_url  TEXT,
  logo_color         TEXT,
  about              TEXT,
  technology_status  TEXT CHECK (technology_status IN ('commercial', 'licensed', 'precommercial')),
  country            TEXT DEFAULT 'US',
  contact_url        TEXT,
  ec3_search_url     TEXT,
  source             TEXT DEFAULT 'manual',
  synced_at          TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  TEXT PRIMARY KEY,
  manufacturer_id     TEXT NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  gwp_verified        NUMERIC,
  gwp_label           TEXT,
  gwp_estimate        NUMERIC,
  gwp_estimate_note   TEXT,
  gwp_unit            TEXT,
  reduction_claim     TEXT,
  epd_available       BOOLEAN DEFAULT FALSE,
  epd_note            TEXT,
  epd_url             TEXT,
  epd_info_url        TEXT,
  ec3_searchable      BOOLEAN DEFAULT FALSE,
  cost_base           TEXT,
  cost_premium        TEXT,
  cost_note           TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturer Sources ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manufacturer_sources (
  id              SERIAL PRIMARY KEY,
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  label           TEXT,
  url             TEXT
);

-- ── Manufacturer Technologies (many-to-many) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS manufacturer_technologies (
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  technology_id   TEXT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (manufacturer_id, technology_id)
);

-- ── Updated-at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manufacturers_updated_at
  BEFORE UPDATE ON manufacturers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_manufacturers_type   ON manufacturers(type);
CREATE INDEX IF NOT EXISTS idx_manufacturers_status ON manufacturers(status);
CREATE INDEX IF NOT EXISTS idx_manufacturers_tier   ON manufacturers(tier);
CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer_id);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Public read of approved manufacturers + their products
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved manufacturers
CREATE POLICY "Public read approved manufacturers"
  ON manufacturers FOR SELECT
  USING (status = 'approved');

-- Anyone can read products of approved manufacturers
CREATE POLICY "Public read products of approved manufacturers"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM manufacturers m
      WHERE m.id = products.manufacturer_id AND m.status = 'approved'
    )
  );

-- Anyone can read sources of approved manufacturers
CREATE POLICY "Public read sources of approved manufacturers"
  ON manufacturer_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM manufacturers m
      WHERE m.id = manufacturer_sources.manufacturer_id AND m.status = 'approved'
    )
  );

-- Anyone can read manufacturer_technologies
CREATE POLICY "Public read manufacturer_technologies"
  ON manufacturer_technologies FOR SELECT USING (true);

-- Anyone can read technologies
CREATE POLICY "Public read technologies"
  ON technologies FOR SELECT USING (true);

-- Anyone can submit (insert pending) manufacturers
CREATE POLICY "Public submit manufacturers"
  ON manufacturers FOR INSERT
  WITH CHECK (status = 'pending');

-- Anyone can submit products for pending manufacturers
CREATE POLICY "Public submit products"
  ON products FOR INSERT
  WITH CHECK (true);

-- Anyone can submit sources for pending manufacturers
CREATE POLICY "Public submit sources"
  ON manufacturer_sources FOR INSERT
  WITH CHECK (true);
