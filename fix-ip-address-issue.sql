-- Fix ip_address column type issue
-- The problem: triggers or defaults trying to insert text into inet column

-- Make ip_address nullable in all tables that have it
ALTER TABLE IF EXISTS patients ALTER COLUMN ip_address DROP NOT NULL;
ALTER TABLE IF EXISTS patients ALTER COLUMN ip_address DROP DEFAULT;

ALTER TABLE IF EXISTS users ALTER COLUMN ip_address DROP DEFAULT;

ALTER TABLE IF EXISTS appointments ALTER COLUMN ip_address DROP DEFAULT;

-- Alternative: Cast the default to proper inet type
-- UPDATE patients SET ip_address = NULL WHERE ip_address IS NULL;
