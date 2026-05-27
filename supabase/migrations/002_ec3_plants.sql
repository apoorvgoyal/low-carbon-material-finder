-- EC3 Plants — PostGIS-backed table for monthly synced plant data
-- Run in: Supabase Dashboard → SQL Editor

CREATE EXTENSION IF NOT EXISTS postgis;

-- ── ec3_plants ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ec3_plants (
  id           TEXT PRIMARY KEY,
  plant_name   TEXT,
  latitude     DOUBLE PRECISION NOT NULL,
  longitude    DOUBLE PRECISION NOT NULL,
  location     GEOGRAPHY(POINT, 4326),
  address      TEXT,
  city         TEXT,
  country      TEXT,
  gwp_a1a3     DOUBLE PRECISION,
  product_name TEXT,
  category     TEXT NOT NULL,
  epd_url      TEXT,
  synced_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ec3_plants_location_idx ON ec3_plants USING GIST(location);
CREATE INDEX IF NOT EXISTS ec3_plants_category_idx ON ec3_plants (category);

-- Trigger: auto-compute location geography from lat/lng on every write
CREATE OR REPLACE FUNCTION ec3_plants_set_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ec3_plants_location_trig ON ec3_plants;
CREATE TRIGGER ec3_plants_location_trig
  BEFORE INSERT OR UPDATE ON ec3_plants
  FOR EACH ROW EXECUTE FUNCTION ec3_plants_set_location();

-- ── search function ───────────────────────────────────────────────────────────
-- Called by /api/search-plants via supabase.rpc('search_ec3_plants', {...})
CREATE OR REPLACE FUNCTION search_ec3_plants(
  p_category       TEXT,
  p_lat            DOUBLE PRECISION,
  p_lng            DOUBLE PRECISION,
  p_radius_meters  DOUBLE PRECISION,
  p_limit          INTEGER DEFAULT 500
)
RETURNS TABLE(
  id            TEXT,
  plant_name    TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  address       TEXT,
  city          TEXT,
  country       TEXT,
  gwp_a1a3      DOUBLE PRECISION,
  product_name  TEXT,
  category      TEXT,
  epd_url       TEXT,
  synced_at     TIMESTAMPTZ,
  distance_m    DOUBLE PRECISION
)
AS $$
  SELECT
    sub.id,
    sub.plant_name,
    sub.latitude,
    sub.longitude,
    sub.address,
    sub.city,
    sub.country,
    sub.gwp_a1a3,
    sub.product_name,
    sub.category,
    sub.epd_url,
    sub.synced_at,
    sub.distance_m
  FROM (
    SELECT
      p.id,
      p.plant_name,
      p.latitude,
      p.longitude,
      p.address,
      p.city,
      p.country,
      p.gwp_a1a3,
      p.product_name,
      p.category,
      p.epd_url,
      p.synced_at,
      ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
      ) AS distance_m
    FROM ec3_plants p
    WHERE p.category = p_category
      AND ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
        p_radius_meters
      )
  ) sub
  ORDER BY sub.distance_m
  LIMIT p_limit;
$$ LANGUAGE sql STABLE;

-- ── sync_log ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_log (
  id           TEXT PRIMARY KEY,
  last_synced  TIMESTAMPTZ NOT NULL,
  plants_count INTEGER
);
