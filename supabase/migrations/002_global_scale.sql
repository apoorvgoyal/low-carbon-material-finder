-- Low-Carbon Material Finder — Global Scale Migration
-- Adds country fields to manufacturers for worldwide coverage.
-- Run this in: Supabase Dashboard → SQL Editor

ALTER TABLE manufacturers
  ADD COLUMN IF NOT EXISTS country       TEXT,
  ADD COLUMN IF NOT EXISTS country_code  CHAR(2),
  ADD COLUMN IF NOT EXISTS service_countries TEXT[];

-- Backfill existing US records
UPDATE manufacturers
  SET country = 'United States', country_code = 'US'
  WHERE country_code IS NULL;

-- Index for country-based filtering
CREATE INDEX IF NOT EXISTS idx_manufacturers_country_code ON manufacturers(country_code);

-- Update RLS: no change needed — existing policies cover new columns automatically.
