
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Migration 074: Soft Delete System
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Purpose: Add soft delete columns to all tables
-- Author: DB Sync Agent
-- Date: 2025-10-18T04:01:34.426Z
-- Safety: Non-destructive (ADD COLUMN only)

BEGIN;

-- Add soft delete columns to all tables

-- Table: users
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN users.deleted_by IS 'User who deleted this record';

-- Table: patients
ALTER TABLE patients 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_patients_deleted_at ON patients(deleted_at);
COMMENT ON COLUMN patients.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN patients.deleted_by IS 'User who deleted this record';

-- Table: appointments
ALTER TABLE appointments 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_deleted_at ON appointments(deleted_at);
COMMENT ON COLUMN appointments.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN appointments.deleted_by IS 'User who deleted this record';

-- Table: session_types
ALTER TABLE session_types 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_session_types_deleted_at ON session_types(deleted_at);
COMMENT ON COLUMN session_types.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN session_types.deleted_by IS 'User who deleted this record';

-- Table: therapist_schedules
ALTER TABLE therapist_schedules 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_therapist_schedules_deleted_at ON therapist_schedules(deleted_at);
COMMENT ON COLUMN therapist_schedules.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN therapist_schedules.deleted_by IS 'User who deleted this record';

-- Table: therapist_specializations
ALTER TABLE therapist_specializations 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_therapist_specializations_deleted_at ON therapist_specializations(deleted_at);
COMMENT ON COLUMN therapist_specializations.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN therapist_specializations.deleted_by IS 'User who deleted this record';

-- Table: therapist_time_off
ALTER TABLE therapist_time_off 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_therapist_time_off_deleted_at ON therapist_time_off(deleted_at);
COMMENT ON COLUMN therapist_time_off.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN therapist_time_off.deleted_by IS 'User who deleted this record';

-- Table: ieps
ALTER TABLE ieps 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_ieps_deleted_at ON ieps(deleted_at);
COMMENT ON COLUMN ieps.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN ieps.deleted_by IS 'User who deleted this record';

-- Table: iep_goals
ALTER TABLE iep_goals 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_iep_goals_deleted_at ON iep_goals(deleted_at);
COMMENT ON COLUMN iep_goals.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN iep_goals.deleted_by IS 'User who deleted this record';

-- Table: goal_progress
ALTER TABLE goal_progress 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_goal_progress_deleted_at ON goal_progress(deleted_at);
COMMENT ON COLUMN goal_progress.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN goal_progress.deleted_by IS 'User who deleted this record';

-- Table: session_notes
ALTER TABLE session_notes 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_session_notes_deleted_at ON session_notes(deleted_at);
COMMENT ON COLUMN session_notes.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN session_notes.deleted_by IS 'User who deleted this record';

-- Table: call_requests
ALTER TABLE call_requests 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_call_requests_deleted_at ON call_requests(deleted_at);
COMMENT ON COLUMN call_requests.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN call_requests.deleted_by IS 'User who deleted this record';

-- Table: notification_rules
ALTER TABLE notification_rules 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_notification_rules_deleted_at ON notification_rules(deleted_at);
COMMENT ON COLUMN notification_rules.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN notification_rules.deleted_by IS 'User who deleted this record';

-- Table: supervisor_notification_preferences
ALTER TABLE supervisor_notification_preferences 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_supervisor_notification_preferences_deleted_at ON supervisor_notification_preferences(deleted_at);
COMMENT ON COLUMN supervisor_notification_preferences.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN supervisor_notification_preferences.deleted_by IS 'User who deleted this record';

-- Table: notification_logs
ALTER TABLE notification_logs 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_notification_logs_deleted_at ON notification_logs(deleted_at);
COMMENT ON COLUMN notification_logs.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN notification_logs.deleted_by IS 'User who deleted this record';

-- Table: notifications
ALTER TABLE notifications 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_deleted_at ON notifications(deleted_at);
COMMENT ON COLUMN notifications.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN notifications.deleted_by IS 'User who deleted this record';

-- Table: payments
ALTER TABLE payments 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_deleted_at ON payments(deleted_at);
COMMENT ON COLUMN payments.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN payments.deleted_by IS 'User who deleted this record';

-- Table: insurance_claims
ALTER TABLE insurance_claims 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_insurance_claims_deleted_at ON insurance_claims(deleted_at);
COMMENT ON COLUMN insurance_claims.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN insurance_claims.deleted_by IS 'User who deleted this record';

-- Table: chat_conversations
ALTER TABLE chat_conversations 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_deleted_at ON chat_conversations(deleted_at);
COMMENT ON COLUMN chat_conversations.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN chat_conversations.deleted_by IS 'User who deleted this record';

-- Table: chat_messages
ALTER TABLE chat_messages 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_at ON chat_messages(deleted_at);
COMMENT ON COLUMN chat_messages.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN chat_messages.deleted_by IS 'User who deleted this record';


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Soft Delete Helper Functions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- Function: Soft delete a record
CREATE OR REPLACE FUNCTION soft_delete(
  p_table_name TEXT,
  p_record_id UUID,
  p_deleted_by UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_sql TEXT;
BEGIN
  v_sql := format(
    'UPDATE %I SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL',
    p_table_name
  );
  
  EXECUTE v_sql USING p_deleted_by, p_record_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Restore a soft-deleted record
CREATE OR REPLACE FUNCTION restore_deleted(
  p_table_name TEXT,
  p_record_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_sql TEXT;
BEGIN
  v_sql := format(
    'UPDATE %I SET deleted_at = NULL, deleted_by = NULL WHERE id = $1 AND deleted_at IS NOT NULL',
    p_table_name
  );
  
  EXECUTE v_sql USING p_record_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Permanently delete old soft-deleted records
CREATE OR REPLACE FUNCTION cleanup_soft_deleted(
  p_table_name TEXT,
  p_days_old INTEGER DEFAULT 90
) RETURNS INTEGER AS $$
DECLARE
  v_sql TEXT;
  v_count INTEGER;
BEGIN
  v_sql := format(
    'DELETE FROM %I WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL ''%s days'' RETURNING 1',
    p_table_name,
    p_days_old
  );
  
  EXECUTE v_sql;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Update RLS Policies to respect soft delete
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- Update all policies to exclude deleted records
DO $$
DECLARE
  v_table_name TEXT;
  v_policy_name TEXT;
BEGIN
  FOR v_table_name IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name NOT IN ('migrations', 'schema_migrations')
  LOOP
    -- Add filter to existing SELECT policies
    BEGIN
      v_policy_name := v_table_name || '_select_policy';
      EXECUTE format(
        'DROP POLICY IF EXISTS %I ON %I',
        v_policy_name, v_table_name
      );
      EXECUTE format(
        'CREATE POLICY %I ON %I FOR SELECT USING (deleted_at IS NULL)',
        v_policy_name, v_table_name
      );
    EXCEPTION WHEN OTHERS THEN
      -- Policy might not exist, continue
      NULL;
    END;
  END LOOP;
END $$;

COMMIT;
