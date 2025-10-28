
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Migration 077: Full Text Search
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Purpose: Fast search across patients, users, appointments
-- Features: Full-text search with tsvector + GIN indexes
-- Safety: Non-destructive (columns + indexes + functions)

BEGIN;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Add search columns
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- Patients search
ALTER TABLE patients 
  ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

UPDATE patients 
SET search_vector = 
  setweight(to_tsvector('arabic', COALESCE(first_name, '')), 'A') ||
  setweight(to_tsvector('arabic', COALESCE(last_name, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(phone, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(email, '')), 'C');

CREATE INDEX IF NOT EXISTS idx_patients_search ON patients USING GIN(search_vector);

-- Users search
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

UPDATE users 
SET search_vector = 
  setweight(to_tsvector('arabic', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(email, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(phone, '')), 'C');

CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(search_vector);


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Search Functions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- Function: Search patients
CREATE OR REPLACE FUNCTION search_patients(
  p_query TEXT,
  p_limit INTEGER DEFAULT 20
) RETURNS TABLE(
  id UUID,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.phone,
    p.email,
    ts_rank(p.search_vector, plainto_tsquery('arabic', p_query)) as rank
  FROM patients p
  WHERE p.search_vector @@ plainto_tsquery('arabic', p_query)
  AND p.deleted_at IS NULL
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Search users
CREATE OR REPLACE FUNCTION search_users(
  p_query TEXT,
  p_role VARCHAR DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
) RETURNS TABLE(
  id UUID,
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  role VARCHAR,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.phone,
    u.role,
    ts_rank(u.search_vector, plainto_tsquery('arabic', p_query)) as rank
  FROM users u
  WHERE u.search_vector @@ plainto_tsquery('arabic', p_query)
  AND (p_role IS NULL OR u.role = p_role)
  AND u.deleted_at IS NULL
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers: Auto-update search vectors
CREATE OR REPLACE FUNCTION update_patient_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('arabic', COALESCE(NEW.first_name, '')), 'A') ||
    setweight(to_tsvector('arabic', COALESCE(NEW.last_name, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.phone, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(NEW.email, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_patient_search_update ON patients;
CREATE TRIGGER trg_patient_search_update
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_search_vector();

CREATE OR REPLACE FUNCTION update_user_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('arabic', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.email, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.phone, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_search_update ON users;
CREATE TRIGGER trg_user_search_update
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_search_vector();

COMMIT;
