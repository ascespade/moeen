-- ================================================================
-- 📋 MEDICAL RECORDS MODULE ENHANCEMENT MIGRATION
-- ================================================================
-- Date: 2025-10-17
-- Purpose: Enhance patients and doctors tables with comprehensive tracking
-- ================================================================

-- ============================================================
-- PART 1: ENHANCE PATIENTS TABLE
-- ============================================================

ALTER TABLE patients
  -- Visit tracking
  ADD COLUMN IF NOT EXISTS last_visit TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_appointment TIMESTAMPTZ,
  
  -- Health tracking
  ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[],
  ADD COLUMN IF NOT EXISTS current_medications TEXT[],
  
  -- Activity tracking
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_accessed_by UUID,
  ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ,
  
  -- Privacy & compliance (HIPAA)
  ADD COLUMN IF NOT EXISTS access_log JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS consent_signed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_date TIMESTAMPTZ,
  
  -- Additional data
  ADD COLUMN IF NOT EXISTS blood_type VARCHAR(10),
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  
  -- Status
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  
  -- Timestamps
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- PART 2: ENHANCE DOCTORS TABLE
-- ============================================================

ALTER TABLE doctors
  -- Activity tracking
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Performance tracking
  ADD COLUMN IF NOT EXISTS total_patients INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_appointments INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
  
  -- Availability
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
  
  -- Additional data
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS languages TEXT[],
  ADD COLUMN IF NOT EXISTS certifications TEXT[],
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- PART 3: ADD CHECK CONSTRAINTS
-- ============================================================

-- Patients constraints
DO $$ BEGIN
  ALTER TABLE patients ADD CONSTRAINT patients_risk_level_check 
  CHECK (risk_level IN ('low', 'medium', 'high', 'critical'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE patients ADD CONSTRAINT patients_health_score_check 
  CHECK (health_score >= 0 AND health_score <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE patients ADD CONSTRAINT patients_status_check 
  CHECK (status IN ('active', 'inactive', 'deceased', 'transferred'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Doctors constraints
DO $$ BEGIN
  ALTER TABLE doctors ADD CONSTRAINT doctors_status_check 
  CHECK (status IN ('active', 'inactive', 'on_leave', 'suspended'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE doctors ADD CONSTRAINT doctors_rating_check 
  CHECK (average_rating >= 0 AND average_rating <= 5);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PART 4: CREATE INDEXES
-- ============================================================

-- Patients indexes
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_risk_level ON patients(risk_level);
CREATE INDEX IF NOT EXISTS idx_patients_last_visit ON patients(last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_patients_next_appointment ON patients(next_appointment);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_last_activity ON patients(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_archived ON patients(archived) WHERE archived = TRUE;
CREATE INDEX IF NOT EXISTS idx_patients_health_score ON patients(health_score);

-- Doctors indexes
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_speciality ON doctors(speciality);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(status);
CREATE INDEX IF NOT EXISTS idx_doctors_is_available ON doctors(is_available);
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON doctors(created_at DESC);

-- ============================================================
-- PART 5: ADD COMMENTS
-- ============================================================

-- Patients comments
COMMENT ON TABLE patients IS 'Patients with comprehensive health tracking and HIPAA compliance';
COMMENT ON COLUMN patients.last_visit IS 'Last visit date';
COMMENT ON COLUMN patients.total_visits IS 'Total number of visits';
COMMENT ON COLUMN patients.risk_level IS 'Health risk level: low, medium, high, critical';
COMMENT ON COLUMN patients.health_score IS 'Overall health score (0-100)';
COMMENT ON COLUMN patients.chronic_conditions IS 'Array of chronic conditions';
COMMENT ON COLUMN patients.current_medications IS 'Array of current medications';
COMMENT ON COLUMN patients.access_log IS 'HIPAA compliance: who accessed records and when';
COMMENT ON COLUMN patients.consent_signed IS 'Whether patient signed consent';
COMMENT ON COLUMN patients.blood_type IS 'Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)';
COMMENT ON COLUMN patients.health_score IS 'Calculated health score based on various factors';

-- Doctors comments
COMMENT ON TABLE doctors IS 'Doctors with performance and availability tracking';
COMMENT ON COLUMN doctors.total_patients IS 'Total number of patients treated';
COMMENT ON COLUMN doctors.total_appointments IS 'Total appointments completed';
COMMENT ON COLUMN doctors.average_rating IS 'Average rating from patient reviews';
COMMENT ON COLUMN doctors.is_available IS 'Currently available for appointments';
COMMENT ON COLUMN doctors.years_experience IS 'Years of medical experience';
COMMENT ON COLUMN doctors.languages IS 'Languages spoken';
COMMENT ON COLUMN doctors.certifications IS 'Medical certifications and specializations';

-- ============================================================
-- MIGRATION LOG
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      action, resource_type, metadata, created_at
    ) VALUES (
      'migration_applied', 'medical_records',
      jsonb_build_object(
        'migration', '042_medical_records_enhancement',
        'tables', jsonb_build_array('patients', 'doctors'),
        'changes', jsonb_build_array(
          'Added 25+ tracking columns to patients',
          'Added 15+ tracking columns to doctors',
          'Created 15+ indexes',
          'Added 5 CHECK constraints',
          'HIPAA compliance fields'
        )
      ),
      NOW()
    );
  END IF;
END $$;
