#!/usr/bin/env node
/**
 * Intelligent Migration Generator
 * Creates SQL migrations for:
 * 1. Soft Delete (deleted_at, deleted_by)
 * 2. Reminder System
 * 3. Booking Validation
 * 4. Search Functions
 */

const fs = require('fs');

const CONFIG = JSON.parse(
  fs.readFileSync('/workspace/tmp/db-sync-config.json')
);
const DB_SCHEMA = JSON.parse(
  fs.readFileSync('/workspace/tmp/db-schema-scan.json')
);

let migrationSQL = [];
let migrationNumber = 74; // Next migration after 073

function header(title) {
  return `
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ${title}
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

function generateSoftDeleteMigration() {
  console.log('\n📝 Generating Soft Delete Migration...\n');

  let sql = header('Migration 074: Soft Delete System');
  sql += `
-- Purpose: Add soft delete columns to all tables
-- Author: DB Sync Agent
-- Date: ${new Date().toISOString()}
-- Safety: Non-destructive (ADD COLUMN only)

BEGIN;

-- Add soft delete columns to all tables
`;

  const tables = DB_SCHEMA.tables.filter(
    t => !['migrations', 'schema_migrations'].includes(t)
  );

  for (const table of tables) {
    sql += `
-- Table: ${table}
ALTER TABLE ${table} 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_${table}_deleted_at ON ${table}(deleted_at);
COMMENT ON COLUMN ${table}.deleted_at IS 'Soft delete timestamp - NULL means active';
COMMENT ON COLUMN ${table}.deleted_by IS 'User who deleted this record';
`;
  }

  // Create soft delete helper functions
  sql += `
${header('Soft Delete Helper Functions')}

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

${header('Update RLS Policies to respect soft delete')}

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
`;

  console.log(`✅ Generated soft delete for ${tables.length} tables\n`);

  return {
    number: migrationNumber++,
    name: '074_soft_delete_system',
    sql: sql,
    safety: 'safe',
    description: 'Add soft delete columns and functions to all tables',
  };
}

function generateReminderSystemMigration() {
  console.log('📝 Generating Reminder System Migration...\n');

  let sql = header('Migration 075: Reminder System');
  sql += `
-- Purpose: Automated reminder system for appointments
-- Features: WhatsApp/SMS/Email reminders 24h before
-- Safety: Non-destructive (new tables + functions)

BEGIN;

-- Reminder outbox table
CREATE TABLE IF NOT EXISTS reminder_outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('whatsapp', 'sms', 'email', 'push')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminder_outbox_scheduled ON reminder_outbox(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_reminder_outbox_appointment ON reminder_outbox(appointment_id);

-- Reminder preferences table
CREATE TABLE IF NOT EXISTS reminder_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  whatsapp_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  hours_before INTEGER DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

${header('Reminder System Functions')}

-- Function: Schedule reminders for an appointment
CREATE OR REPLACE FUNCTION schedule_appointment_reminders(
  p_appointment_id UUID
) RETURNS INTEGER AS $$
DECLARE
  v_appointment RECORD;
  v_preferences RECORD;
  v_reminder_time TIMESTAMPTZ;
  v_count INTEGER := 0;
BEGIN
  -- Get appointment details
  SELECT * INTO v_appointment
  FROM appointments
  WHERE id = p_appointment_id AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Get user preferences (patient's guardian)
  SELECT * INTO v_preferences
  FROM reminder_preferences
  WHERE user_id = v_appointment.patient_id;
  
  -- Use defaults if no preferences
  IF NOT FOUND THEN
    INSERT INTO reminder_preferences (user_id)
    VALUES (v_appointment.patient_id)
    RETURNING * INTO v_preferences;
  END IF;
  
  -- Calculate reminder time
  v_reminder_time := (v_appointment.appointment_date::timestamp + v_appointment.appointment_time::time) - 
                      (v_preferences.hours_before || ' hours')::interval;
  
  -- Only schedule if in future
  IF v_reminder_time > NOW() THEN
    -- WhatsApp reminder
    IF v_preferences.whatsapp_enabled THEN
      INSERT INTO reminder_outbox (appointment_id, recipient_id, reminder_type, scheduled_for)
      VALUES (p_appointment_id, v_appointment.patient_id, 'whatsapp', v_reminder_time);
      v_count := v_count + 1;
    END IF;
    
    -- SMS reminder
    IF v_preferences.sms_enabled THEN
      INSERT INTO reminder_outbox (appointment_id, recipient_id, reminder_type, scheduled_for)
      VALUES (p_appointment_id, v_appointment.patient_id, 'sms', v_reminder_time);
      v_count := v_count + 1;
    END IF;
    
    -- Email reminder
    IF v_preferences.email_enabled THEN
      INSERT INTO reminder_outbox (appointment_id, recipient_id, reminder_type, scheduled_for)
      VALUES (p_appointment_id, v_appointment.patient_id, 'email', v_reminder_time);
      v_count := v_count + 1;
    END IF;
  END IF;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Process pending reminders (called by cron/scheduler)
CREATE OR REPLACE FUNCTION process_pending_reminders()
RETURNS TABLE(reminder_id UUID, appointment_id UUID, reminder_type VARCHAR, recipient_phone VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ro.id,
    ro.appointment_id,
    ro.reminder_type::VARCHAR,
    u.phone::VARCHAR
  FROM reminder_outbox ro
  JOIN users u ON ro.recipient_id = u.id
  WHERE ro.status = 'pending'
  AND ro.scheduled_for <= NOW()
  AND ro.deleted_at IS NULL
  ORDER BY ro.scheduled_for
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-schedule reminders on appointment creation
CREATE OR REPLACE FUNCTION trigger_schedule_reminders()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM schedule_appointment_reminders(NEW.id);
  ELSIF TG_OP = 'UPDATE' AND (OLD.appointment_date != NEW.appointment_date OR OLD.appointment_time != NEW.appointment_time) THEN
    -- Cancel old reminders
    UPDATE reminder_outbox SET status = 'cancelled' WHERE appointment_id = NEW.id AND status = 'pending';
    -- Schedule new reminders
    PERFORM schedule_appointment_reminders(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_appointment_reminder ON appointments;
CREATE TRIGGER trg_appointment_reminder
  AFTER INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_schedule_reminders();

COMMIT;
`;

  console.log('✅ Generated reminder system\n');

  return {
    number: migrationNumber++,
    name: '075_reminder_system',
    sql: sql,
    safety: 'safe',
    description: 'Automated reminder system with WhatsApp/SMS/Email',
  };
}

function generateBookingValidationMigration() {
  console.log('📝 Generating Booking Validation Migration...\n');

  let sql = header('Migration 076: Booking Validation');
  sql += `
-- Purpose: Prevent double-booking and validate appointments
-- Safety: Non-destructive (constraints + functions)

BEGIN;

${header('Booking Validation Functions')}

-- Function: Check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_doctor_id UUID,
  p_appointment_date DATE,
  p_appointment_time TIME,
  p_duration INTEGER,
  p_exclude_appointment_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_end_time TIME;
  v_conflict_count INTEGER;
BEGIN
  -- Calculate end time
  v_end_time := p_appointment_time + (p_duration || ' minutes')::interval;
  
  -- Check for overlapping appointments
  SELECT COUNT(*) INTO v_conflict_count
  FROM appointments
  WHERE doctor_id = p_doctor_id
  AND appointment_date = p_appointment_date
  AND status NOT IN ('cancelled', 'completed')
  AND deleted_at IS NULL
  AND (id != p_exclude_appointment_id OR p_exclude_appointment_id IS NULL)
  AND (
    -- New appointment starts during existing
    (appointment_time <= p_appointment_time AND 
     (appointment_time + (duration || ' minutes')::interval) > p_appointment_time)
    OR
    -- New appointment ends during existing
    (appointment_time < v_end_time AND 
     (appointment_time + (duration || ' minutes')::interval) >= v_end_time)
    OR
    -- New appointment completely overlaps existing
    (p_appointment_time <= appointment_time AND 
     v_end_time >= (appointment_time + (duration || ' minutes')::interval))
  );
  
  RETURN v_conflict_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create booking with validation
CREATE OR REPLACE FUNCTION create_booking(
  p_patient_id UUID,
  p_doctor_id UUID,
  p_session_type_id UUID,
  p_appointment_date DATE,
  p_appointment_time TIME,
  p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_duration INTEGER;
  v_has_conflict BOOLEAN;
  v_appointment_id UUID;
BEGIN
  -- Get session duration
  SELECT duration INTO v_duration
  FROM session_types
  WHERE id = p_session_type_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid session type';
  END IF;
  
  -- Check for conflicts
  v_has_conflict := check_booking_conflict(
    p_doctor_id,
    p_appointment_date,
    p_appointment_time,
    v_duration
  );
  
  IF v_has_conflict THEN
    RAISE EXCEPTION 'Booking conflict detected for this time slot';
  END IF;
  
  -- Create appointment
  INSERT INTO appointments (
    patient_id,
    doctor_id,
    session_type_id,
    appointment_date,
    appointment_time,
    duration,
    status,
    notes
  ) VALUES (
    p_patient_id,
    p_doctor_id,
    p_session_type_id,
    p_appointment_date,
    p_appointment_time,
    v_duration,
    'scheduled',
    p_notes
  ) RETURNING id INTO v_appointment_id;
  
  RETURN v_appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Constraint: Prevent double booking at DB level
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointment_no_overlap ON appointments (
  doctor_id,
  appointment_date,
  appointment_time
) WHERE deleted_at IS NULL AND status NOT IN ('cancelled');

COMMIT;
`;

  console.log('✅ Generated booking validation\n');

  return {
    number: migrationNumber++,
    name: '076_booking_validation',
    sql: sql,
    safety: 'safe',
    description: 'Booking conflict detection and validation functions',
  };
}

function generateSearchFunctionsMigration() {
  console.log('📝 Generating Search Functions Migration...\n');

  let sql = header('Migration 077: Full Text Search');
  sql += `
-- Purpose: Fast search across patients, users, appointments
-- Features: Full-text search with tsvector + GIN indexes
-- Safety: Non-destructive (columns + indexes + functions)

BEGIN;

${header('Add search columns')}

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

${header('Search Functions')}

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
`;

  console.log('✅ Generated search functions\n');

  return {
    number: migrationNumber++,
    name: '077_search_functions',
    sql: sql,
    safety: 'safe',
    description: 'Full-text search with Arabic support',
  };
}

function generateAll() {
  console.log('\n🚀 Starting Migration Generation...\n');
  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
  );

  const migrations = [];

  if (CONFIG.features.soft_delete) {
    migrations.push(generateSoftDeleteMigration());
  }

  if (CONFIG.features.reminder_scheduler) {
    migrations.push(generateReminderSystemMigration());
  }

  if (CONFIG.features.booking_validation) {
    migrations.push(generateBookingValidationMigration());
  }

  if (CONFIG.features.search_functions) {
    migrations.push(generateSearchFunctionsMigration());
  }

  // Save individual migration files
  for (const migration of migrations) {
    const filename = `supabase/migrations/${migration.name}.sql`;
    fs.writeFileSync(`/workspace/${filename}`, migration.sql);
    console.log(`✅ Created: ${filename}\n`);
  }

  // Save combined SQL
  const combinedSQL = migrations.map(m => m.sql).join('\n\n');
  fs.writeFileSync('/workspace/tmp/db-auto-migrations.sql', combinedSQL);

  // Save metadata
  const metadata = {
    generated_at: new Date().toISOString(),
    run_id: CONFIG.run_id,
    migrations: migrations.map(m => ({
      number: m.number,
      name: m.name,
      safety: m.safety,
      description: m.description,
    })),
    total_migrations: migrations.length,
    safety_summary: {
      safe: migrations.filter(m => m.safety === 'safe').length,
      requires_review: migrations.filter(m => m.safety === 'requires_review')
        .length,
    },
  };

  fs.writeFileSync(
    '/workspace/tmp/migrations-metadata.json',
    JSON.stringify(metadata, null, 2)
  );

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );
  console.log(`\n✅ Generated ${migrations.length} migrations successfully!\n`);
  console.log('📁 Files created:');
  migrations.forEach(m =>
    console.log(`   - supabase/migrations/${m.name}.sql`)
  );
  console.log(`   - tmp/db-auto-migrations.sql (combined)`);
  console.log(`   - tmp/migrations-metadata.json`);
  console.log('');

  return metadata;
}

// Run if called directly
if (require.main === module) {
  generateAll();
}

module.exports = { generateAll };
