-- ================================================================
-- 📅 APPOINTMENTS MODULE TRIGGERS & FUNCTIONS
-- ================================================================
-- Following the same methodology as Authentication Module
-- Date: 2025-10-17
-- Purpose: Create triggers and functions for appointments
-- ================================================================

-- ============================================================
-- PART 1: TRIGGER FUNCTION - UPDATE updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_appointments_updated_at ON appointments;
CREATE TRIGGER trigger_update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

COMMENT ON FUNCTION update_appointments_updated_at() IS 'Automatically update updated_at and last_activity_at on appointments table';

-- ============================================================
-- PART 2: TRIGGER FUNCTION - LOG APPOINTMENT CHANGES
-- ============================================================

CREATE OR REPLACE FUNCTION log_appointment_changes()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  changed_fields JSONB := '{}'::jsonb;
BEGIN
  -- Determine action type
  IF (TG_OP = 'INSERT') THEN
    action_type := 'appointment_created';
    changed_fields := to_jsonb(NEW);
  ELSIF (TG_OP = 'UPDATE') THEN
    action_type := 'appointment_updated';
    
    -- Track specific important changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      changed_fields := changed_fields || jsonb_build_object('status', jsonb_build_object('old', OLD.status, 'new', NEW.status));
    END IF;
    
    IF OLD.scheduled_at IS DISTINCT FROM NEW.scheduled_at THEN
      changed_fields := changed_fields || jsonb_build_object('scheduled_at', jsonb_build_object('old', OLD.scheduled_at, 'new', NEW.scheduled_at));
      action_type := 'appointment_rescheduled';
    END IF;
    
    IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
      changed_fields := changed_fields || jsonb_build_object('payment_status', jsonb_build_object('old', OLD.payment_status, 'new', NEW.payment_status));
    END IF;
    
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      action_type := 'appointment_cancelled';
    END IF;
    
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
      action_type := 'appointment_confirmed';
    END IF;
    
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      action_type := 'appointment_completed';
    END IF;
    
  ELSIF (TG_OP = 'DELETE') THEN
    action_type := 'appointment_deleted';
    changed_fields := to_jsonb(OLD);
  END IF;

  -- Insert audit log if audit_logs table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      action,
      resource_type,
      resource_id,
      user_id,
      metadata,
      created_at
    ) VALUES (
      action_type,
      'appointment',
      COALESCE(NEW.id::TEXT, OLD.id::TEXT),
      COALESCE(NEW.updated_by, NEW.created_by, OLD.updated_by),
      jsonb_build_object(
        'changes', changed_fields,
        'patient_id', COALESCE(NEW.patient_id, OLD.patient_id),
        'doctor_id', COALESCE(NEW.doctor_id, OLD.doctor_id),
        'scheduled_at', COALESCE(NEW.scheduled_at, OLD.scheduled_at),
        'booking_source', COALESCE(NEW.booking_source, OLD.booking_source)
      ),
      NOW()
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_log_appointment_changes ON appointments;
CREATE TRIGGER trigger_log_appointment_changes
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION log_appointment_changes();

COMMENT ON FUNCTION log_appointment_changes() IS 'Log all appointment changes to audit_logs with detailed tracking';

-- ============================================================
-- PART 3: FUNCTION - CHECK APPOINTMENT CONFLICTS
-- ============================================================

CREATE OR REPLACE FUNCTION check_appointment_conflicts(
  p_doctor_id INTEGER,
  p_scheduled_at TIMESTAMPTZ,
  p_duration INTEGER DEFAULT 30,
  p_exclude_appointment_id INTEGER DEFAULT NULL
)
RETURNS TABLE(
  has_conflicts BOOLEAN,
  conflict_count INTEGER,
  conflicts JSONB
) AS $$
DECLARE
  v_end_time TIMESTAMPTZ;
  v_conflicts JSONB;
  v_count INTEGER;
BEGIN
  v_end_time := p_scheduled_at + (p_duration || ' minutes')::INTERVAL;
  
  -- Find conflicting appointments
  SELECT 
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', id,
        'patient_id', patient_id,
        'scheduled_at', scheduled_at,
        'duration', duration,
        'status', status
      )
    ), '[]'::jsonb),
    COUNT(*)
  INTO v_conflicts, v_count
  FROM appointments
  WHERE doctor_id = p_doctor_id
    AND status IN ('pending', 'confirmed', 'in_progress')
    AND (id != p_exclude_appointment_id OR p_exclude_appointment_id IS NULL)
    AND (
      -- Check for time overlap
      (scheduled_at < v_end_time AND 
       scheduled_at + (duration || ' minutes')::INTERVAL > p_scheduled_at)
    );
  
  RETURN QUERY SELECT 
    (v_count > 0)::BOOLEAN,
    v_count::INTEGER,
    v_conflicts;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_appointment_conflicts IS 'Check for appointment time conflicts for a specific doctor';

-- ============================================================
-- PART 4: FUNCTION - GET APPOINTMENT STATISTICS
-- ============================================================

CREATE OR REPLACE FUNCTION get_appointment_statistics(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW(),
  p_doctor_id INTEGER DEFAULT NULL,
  p_patient_id INTEGER DEFAULT NULL
)
RETURNS TABLE(
  total_appointments INTEGER,
  pending_count INTEGER,
  confirmed_count INTEGER,
  completed_count INTEGER,
  cancelled_count INTEGER,
  no_show_count INTEGER,
  average_duration NUMERIC,
  total_revenue NUMERIC,
  booking_sources JSONB,
  appointment_types JSONB,
  cancellation_rate NUMERIC,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
      COUNT(*) FILTER (WHERE status = 'no_show') as no_show,
      AVG(duration) as avg_duration,
      jsonb_object_agg(
        COALESCE(booking_source, 'unknown'),
        COUNT(*) FILTER (WHERE booking_source IS NOT NULL)
      ) as sources,
      jsonb_object_agg(
        COALESCE(type, 'unknown'),
        COUNT(*) FILTER (WHERE type IS NOT NULL)
      ) as types
    FROM appointments
    WHERE scheduled_at BETWEEN p_start_date AND p_end_date
      AND (p_doctor_id IS NULL OR doctor_id = p_doctor_id)
      AND (p_patient_id IS NULL OR patient_id = p_patient_id)
  )
  SELECT
    total::INTEGER,
    pending::INTEGER,
    confirmed::INTEGER,
    completed::INTEGER,
    cancelled::INTEGER,
    no_show::INTEGER,
    ROUND(avg_duration, 2) as avg_duration,
    0::NUMERIC as total_revenue, -- Will be calculated from payments table
    sources,
    types,
    ROUND((cancelled::NUMERIC / NULLIF(total, 0) * 100), 2) as cancellation_rate,
    ROUND((completed::NUMERIC / NULLIF(total, 0) * 100), 2) as completion_rate
  FROM stats;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_appointment_statistics IS 'Get comprehensive appointment statistics for a date range';

-- ============================================================
-- PART 5: FUNCTION - CANCEL APPOINTMENT
-- ============================================================

CREATE OR REPLACE FUNCTION cancel_appointment(
  p_appointment_id INTEGER,
  p_cancelled_by UUID,
  p_cancellation_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_appointment appointments;
  v_result JSONB;
BEGIN
  -- Get current appointment
  SELECT * INTO v_appointment
  FROM appointments
  WHERE id = p_appointment_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Appointment not found'
    );
  END IF;
  
  -- Check if already cancelled
  IF v_appointment.status = 'cancelled' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Appointment already cancelled'
    );
  END IF;
  
  -- Check if already completed
  IF v_appointment.status = 'completed' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot cancel completed appointment'
    );
  END IF;
  
  -- Update appointment
  UPDATE appointments
  SET
    status = 'cancelled',
    cancelled_at = NOW(),
    cancelled_by = p_cancelled_by,
    cancellation_reason = p_cancellation_reason,
    updated_by = p_cancelled_by,
    updated_at = NOW()
  WHERE id = p_appointment_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Appointment cancelled successfully',
    'appointment_id', p_appointment_id
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cancel_appointment IS 'Cancel an appointment with reason and user tracking';

-- ============================================================
-- PART 6: FUNCTION - UPDATE APPOINTMENT REMINDER
-- ============================================================

CREATE OR REPLACE FUNCTION update_appointment_reminder(
  p_appointment_id INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE appointments
  SET
    reminder_sent = TRUE,
    reminder_count = COALESCE(reminder_count, 0) + 1,
    last_reminder_at = NOW(),
    updated_at = NOW()
  WHERE id = p_appointment_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_appointment_reminder IS 'Update appointment reminder tracking';

-- ============================================================
-- PART 7: CREATE VIEW - APPOINTMENT ANALYTICS
-- ============================================================

CREATE OR REPLACE VIEW appointment_analytics AS
SELECT
  a.id,
  a.public_id,
  a.scheduled_at,
  a.status,
  a.payment_status,
  a.booking_source,
  a.type,
  a.duration,
  a.is_virtual,
  a.reminder_sent,
  a.reminder_count,
  a.created_at,
  a.cancelled_at,
  
  -- Time-based metrics
  EXTRACT(DOW FROM a.scheduled_at) as day_of_week,
  EXTRACT(HOUR FROM a.scheduled_at) as hour_of_day,
  DATE_TRUNC('week', a.scheduled_at) as week,
  DATE_TRUNC('month', a.scheduled_at) as month,
  
  -- Status flags
  (a.status = 'completed') as is_completed,
  (a.status = 'cancelled') as is_cancelled,
  (a.status = 'no_show') as is_no_show,
  (a.scheduled_at < NOW() AND a.status IN ('pending', 'confirmed')) as is_overdue,
  
  -- Time calculations
  CASE 
    WHEN a.completed_at IS NOT NULL THEN 
      EXTRACT(EPOCH FROM (a.completed_at - a.scheduled_at)) / 60
    ELSE NULL
  END as actual_duration_minutes,
  
  CASE 
    WHEN a.cancelled_at IS NOT NULL THEN 
      EXTRACT(EPOCH FROM (a.cancelled_at - a.created_at)) / 3600
    ELSE NULL
  END as hours_until_cancellation,
  
  -- Patient and doctor info
  p.id as patient_id,
  p.full_name as patient_name,
  p.phone as patient_phone,
  d.id as doctor_id,
  d.speciality as doctor_speciality
  
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
LEFT JOIN doctors d ON a.doctor_id = d.id;

COMMENT ON VIEW appointment_analytics IS 'Comprehensive analytics view for appointments with calculated metrics';

-- ============================================================
-- PART 8: TRIGGER FOR SESSIONS TABLE
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions') THEN
    -- Create update trigger for sessions
    CREATE OR REPLACE FUNCTION update_sessions_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      NEW.last_activity_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
    
    DROP TRIGGER IF EXISTS trigger_update_sessions_updated_at ON sessions;
    CREATE TRIGGER trigger_update_sessions_updated_at
      BEFORE UPDATE ON sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_sessions_updated_at();
  END IF;
END $$;

-- ============================================================
-- MIGRATION LOG
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
        'migration', '041_appointments_triggers_functions',
        'date', NOW(),
        'description', 'Created triggers and functions for appointments module',
        'features', jsonb_build_array(
          'Auto-update timestamps',
          'Audit logging',
          'Conflict checking',
          'Statistics calculation',
          'Appointment cancellation',
          'Reminder tracking',
          'Analytics view'
        )
      ),
      NOW()
    );
  END IF;
END $$;

-- ============================================================
-- MIGRATION COMPLETE ✅
-- ============================================================
