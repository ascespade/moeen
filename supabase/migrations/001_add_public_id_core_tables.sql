-- Migration: Add public_id columns to existing healthcare tables
-- IMPORTANT: Run backup before applying this migration
-- Date: 2024-01-15
-- Description: Adds CUID public_id columns to core healthcare tables for API use

-- Add public_id columns with UNIQUE constraint
ALTER TABLE patients 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE doctors 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE appointments 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE sessions 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE insurance_claims 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

-- Performance indexes for public_id columns
CREATE INDEX IF NOT EXISTS idx_patients_public_id 
  ON patients(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_doctors_public_id 
  ON doctors(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_public_id 
  ON appointments(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_public_id 
  ON sessions(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_insurance_claims_public_id 
  ON insurance_claims(public_id) WHERE public_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN patients.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN doctors.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN appointments.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN sessions.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN insurance_claims.public_id IS 'CUID public identifier for API use';

-- Log migration completion
INSERT INTO audit_logs (action, table_name, new_values) 
VALUES ('migration', 'core_tables', '{"migration": "001_add_public_id_core_tables", "status": "completed"}')
ON CONFLICT DO NOTHING;
