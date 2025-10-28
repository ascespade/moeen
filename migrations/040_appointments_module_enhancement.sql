-- ================================================================
-- 📅 APPOINTMENTS MODULE ENHANCEMENT MIGRATION
-- ================================================================
-- Following the same methodology as Authentication Module
-- Date: 2025-10-17
-- Purpose: Add tracking columns, indexes, constraints, and comments
-- ================================================================

-- ============================================================
-- PART 1: ENHANCE APPOINTMENTS TABLE
-- ============================================================

-- Add tracking columns
ALTER TABLE appointments
  -- Booking source tracking
  ADD COLUMN IF NOT EXISTS booking_source VARCHAR(50) DEFAULT 'web',
  ADD COLUMN IF NOT EXISTS booking_channel VARCHAR(50),
  
  -- Status tracking
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirmed_by UUID,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_by UUID,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  
  -- Reminder tracking
  ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reminder_at TIMESTAMPTZ,
  
  -- Activity tracking
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional metadata
  ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'consultation',
  ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS is_virtual BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS meeting_link TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  
  -- Timestamps (ensure they exist)
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Set default values for created_at if not set
UPDATE appointments SET created_at = NOW() WHERE created_at IS NULL;

-- ============================================================
-- PART 2: ADD CHECK CONSTRAINTS
-- ============================================================

-- Status constraint
DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_status_check 
  CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Payment status constraint
DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_payment_status_check 
  CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'failed'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Booking source constraint
DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_booking_source_check 
  CHECK (booking_source IN ('web', 'mobile', 'chatbot', 'phone', 'whatsapp', 'walk_in', 'admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Type constraint
DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_type_check 
  CHECK (type IN ('consultation', 'follow_up', 'emergency', 'routine_checkup', 'specialist', 'lab_test', 'imaging'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Duration constraint
DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_duration_check 
  CHECK (duration >= 15 AND duration <= 240);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- PART 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON appointments(payment_status);

-- Tracking indexes
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_updated_at ON appointments(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_cancelled_at ON appointments(cancelled_at) WHERE cancelled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_appointments_booking_source ON appointments(booking_source);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(type);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_appointments_created_by ON appointments(created_by);
CREATE INDEX IF NOT EXISTS idx_appointments_cancelled_by ON appointments(cancelled_by);
CREATE INDEX IF NOT EXISTS idx_appointments_last_activity ON appointments(last_activity_at DESC);

-- Reminder indexes
CREATE INDEX IF NOT EXISTS idx_appointments_reminder_sent ON appointments(reminder_sent);
CREATE INDEX IF NOT EXISTS idx_appointments_reminder_pending 
  ON appointments(scheduled_at) 
  WHERE reminder_sent = FALSE AND status IN ('pending', 'confirmed');

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status_date ON appointments(status, scheduled_at);

-- ============================================================
-- PART 4: ADD COLUMN COMMENTS
-- ============================================================

COMMENT ON TABLE appointments IS 'Appointments table with comprehensive tracking';
COMMENT ON COLUMN appointments.id IS 'Primary key';
COMMENT ON COLUMN appointments.public_id IS 'Public-facing appointment ID';
COMMENT ON COLUMN appointments.patient_id IS 'Reference to patient';
COMMENT ON COLUMN appointments.doctor_id IS 'Reference to doctor';
COMMENT ON COLUMN appointments.scheduled_at IS 'Scheduled appointment date and time';
COMMENT ON COLUMN appointments.status IS 'Current appointment status';
COMMENT ON COLUMN appointments.payment_status IS 'Payment status';
COMMENT ON COLUMN appointments.booking_source IS 'Source of booking (web, chatbot, phone, etc.)';
COMMENT ON COLUMN appointments.booking_channel IS 'Specific channel within source';
COMMENT ON COLUMN appointments.confirmed_at IS 'When appointment was confirmed';
COMMENT ON COLUMN appointments.confirmed_by IS 'Who confirmed the appointment';
COMMENT ON COLUMN appointments.completed_at IS 'When appointment was completed';
COMMENT ON COLUMN appointments.cancelled_at IS 'When appointment was cancelled';
COMMENT ON COLUMN appointments.cancelled_by IS 'Who cancelled the appointment';
COMMENT ON COLUMN appointments.cancellation_reason IS 'Reason for cancellation';
COMMENT ON COLUMN appointments.reminder_sent IS 'Whether reminder was sent';
COMMENT ON COLUMN appointments.reminder_count IS 'Number of reminders sent';
COMMENT ON COLUMN appointments.last_reminder_at IS 'Last reminder sent time';
COMMENT ON COLUMN appointments.created_by IS 'User who created the appointment';
COMMENT ON COLUMN appointments.updated_by IS 'User who last updated the appointment';
COMMENT ON COLUMN appointments.last_activity_at IS 'Last activity timestamp';
COMMENT ON COLUMN appointments.type IS 'Type of appointment';
COMMENT ON COLUMN appointments.duration IS 'Duration in minutes';
COMMENT ON COLUMN appointments.is_virtual IS 'Whether appointment is virtual';
COMMENT ON COLUMN appointments.meeting_link IS 'Virtual meeting link';
COMMENT ON COLUMN appointments.metadata IS 'Additional metadata in JSON format';
COMMENT ON COLUMN appointments.created_at IS 'Creation timestamp';
COMMENT ON COLUMN appointments.updated_at IS 'Last update timestamp';

-- ============================================================
-- PART 5: ENHANCE SESSIONS TABLE
-- ============================================================

-- Add tracking columns to sessions table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions') THEN
    -- Add tracking columns
    ALTER TABLE sessions
      ADD COLUMN IF NOT EXISTS created_by UUID,
      ADD COLUMN IF NOT EXISTS updated_by UUID,
      ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS session_notes TEXT,
      ADD COLUMN IF NOT EXISTS session_summary TEXT,
      ADD COLUMN IF NOT EXISTS prescriptions TEXT,
      ADD COLUMN IF NOT EXISTS next_steps TEXT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_sessions_appointment_id ON sessions(appointment_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_doctor_id ON sessions(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
    
    -- Add comments
    COMMENT ON TABLE sessions IS 'Medical sessions with comprehensive tracking';
    COMMENT ON COLUMN sessions.created_by IS 'User who created the session';
    COMMENT ON COLUMN sessions.updated_by IS 'User who last updated the session';
    COMMENT ON COLUMN sessions.last_activity_at IS 'Last activity timestamp';
    COMMENT ON COLUMN sessions.metadata IS 'Additional metadata in JSON format';
  END IF;
END $$;

-- ============================================================
-- PART 6: CREATE MIGRATION LOG ENTRY
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      action,
      resource_type,
      metadata,
      created_at
    ) VALUES (
      'migration_applied',
      'appointments',
      jsonb_build_object(
        'migration', '040_appointments_module_enhancement',
        'date', NOW(),
        'description', 'Enhanced appointments and sessions tables with tracking columns, indexes, and constraints',
        'changes', jsonb_build_array(
          'Added 20+ tracking columns',
          'Created 15+ performance indexes',
          'Added 5 CHECK constraints',
          'Added comprehensive comments'
        )
      ),
      NOW()
    );
  END IF;
END $$;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify appointments table structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'appointments'
ORDER BY ordinal_position;

-- Count appointments by booking source
SELECT booking_source, COUNT(*) as count
FROM appointments
GROUP BY booking_source
ORDER BY count DESC;

-- ============================================================
-- MIGRATION COMPLETE ✅
-- ============================================================
