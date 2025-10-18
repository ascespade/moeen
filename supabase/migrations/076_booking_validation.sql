
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Migration 076: Booking Validation
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Purpose: Prevent double-booking and validate appointments
-- Safety: Non-destructive (constraints + functions)

BEGIN;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Booking Validation Functions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


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
