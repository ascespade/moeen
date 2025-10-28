
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Migration 075: Reminder System
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Reminder System Functions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


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
