-- ================================================================
-- 📋 MEDICAL RECORDS TRIGGERS & FUNCTIONS
-- ================================================================

-- ============================================================
-- PART 1: TRIGGERS FOR PATIENTS
-- ============================================================

CREATE OR REPLACE FUNCTION update_patients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_patients_updated_at ON patients;
CREATE TRIGGER trigger_update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_patients_updated_at();

-- ============================================================
-- PART 2: AUDIT LOGGING FOR PATIENTS
-- ============================================================

CREATE OR REPLACE FUNCTION log_patient_changes()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  changed_fields JSONB := '{}'::jsonb;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    action_type := 'patient_created';
    changed_fields := to_jsonb(NEW);
  ELSIF (TG_OP = 'UPDATE') THEN
    action_type := 'patient_updated';
    
    -- Track specific changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      changed_fields := changed_fields || jsonb_build_object('status', 
        jsonb_build_object('old', OLD.status, 'new', NEW.status));
    END IF;
    
    IF OLD.risk_level IS DISTINCT FROM NEW.risk_level THEN
      changed_fields := changed_fields || jsonb_build_object('risk_level',
        jsonb_build_object('old', OLD.risk_level, 'new', NEW.risk_level));
      action_type := 'patient_risk_level_changed';
    END IF;
    
  ELSIF (TG_OP = 'DELETE') THEN
    action_type := 'patient_deleted';
    changed_fields := to_jsonb(OLD);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      action, resource_type, resource_id, user_id, metadata, created_at
    ) VALUES (
      action_type, 'patient',
      COALESCE(NEW.id::TEXT, OLD.id::TEXT),
      COALESCE(NEW.updated_by, NEW.created_by, OLD.updated_by),
      jsonb_build_object('changes', changed_fields),
      NOW()
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_patient_changes ON patients;
CREATE TRIGGER trigger_log_patient_changes
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION log_patient_changes();

-- ============================================================
-- PART 3: FUNCTION - CALCULATE HEALTH SCORE
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_health_score(
  p_patient_id INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 100;
  v_patient patients;
  v_age INTEGER;
  v_chronic_count INTEGER;
  v_recent_visits INTEGER;
BEGIN
  SELECT * INTO v_patient FROM patients WHERE id = p_patient_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Calculate age
  IF v_patient.dob IS NOT NULL THEN
    v_age := EXTRACT(YEAR FROM AGE(v_patient.dob));
    IF v_age > 60 THEN v_score := v_score - 10; END IF;
    IF v_age > 70 THEN v_score := v_score - 10; END IF;
  END IF;
  
  -- Chronic conditions impact
  IF v_patient.chronic_conditions IS NOT NULL THEN
    v_chronic_count := array_length(v_patient.chronic_conditions, 1);
    v_score := v_score - (v_chronic_count * 5);
  END IF;
  
  -- Risk level impact
  CASE v_patient.risk_level
    WHEN 'medium' THEN v_score := v_score - 10;
    WHEN 'high' THEN v_score := v_score - 20;
    WHEN 'critical' THEN v_score := v_score - 30;
    ELSE NULL;
  END CASE;
  
  -- Recent visits (good sign)
  IF v_patient.last_visit IS NOT NULL AND 
     v_patient.last_visit > NOW() - INTERVAL '6 months' THEN
    v_score := v_score + 5;
  END IF;
  
  -- Ensure score is between 0-100
  v_score := GREATEST(0, LEAST(100, v_score));
  
  -- Update patient record
  UPDATE patients SET health_score = v_score WHERE id = p_patient_id;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PART 4: FUNCTION - LOG PATIENT ACCESS (HIPAA)
-- ============================================================

CREATE OR REPLACE FUNCTION log_patient_access(
  p_patient_id INTEGER,
  p_accessed_by UUID,
  p_access_reason TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_access_entry JSONB;
BEGIN
  v_access_entry := jsonb_build_object(
    'accessed_at', NOW(),
    'accessed_by', p_accessed_by,
    'reason', p_access_reason,
    'ip_address', p_ip_address
  );
  
  UPDATE patients
  SET 
    access_log = COALESCE(access_log, '[]'::jsonb) || v_access_entry,
    last_accessed_by = p_accessed_by,
    last_accessed_at = NOW()
  WHERE id = p_patient_id;
  
  -- Also log in audit_logs
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      action, resource_type, resource_id, user_id,
      ip_address, metadata, created_at
    ) VALUES (
      'patient_record_accessed', 'patient', p_patient_id::TEXT,
      p_accessed_by, p_ip_address::inet,
      jsonb_build_object('reason', p_access_reason),
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PART 5: FUNCTION - GET PATIENT STATISTICS
-- ============================================================

CREATE OR REPLACE FUNCTION get_patient_statistics(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
  total_patients INTEGER,
  active_patients INTEGER,
  new_patients INTEGER,
  high_risk_patients INTEGER,
  average_health_score NUMERIC,
  total_visits INTEGER,
  patients_by_risk JSONB,
  avg_age NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE created_at BETWEEN p_start_date AND p_end_date) as new_pts,
      COUNT(*) FILTER (WHERE risk_level IN ('high', 'critical')) as high_risk,
      AVG(health_score) as avg_score,
      SUM(total_visits) as visits,
      jsonb_object_agg(
        COALESCE(risk_level, 'unknown'),
        COUNT(*) FILTER (WHERE risk_level IS NOT NULL)
      ) as by_risk,
      AVG(EXTRACT(YEAR FROM AGE(dob))) as average_age
    FROM patients
  )
  SELECT
    total::INTEGER,
    active::INTEGER,
    new_pts::INTEGER,
    high_risk::INTEGER,
    ROUND(avg_score, 2),
    visits::INTEGER,
    by_risk,
    ROUND(average_age, 1)
  FROM stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PART 6: FUNCTION - UPDATE DOCTOR STATISTICS
-- ============================================================

CREATE OR REPLACE FUNCTION update_doctor_statistics(
  p_doctor_id INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_total_patients INTEGER;
  v_total_appointments INTEGER;
BEGIN
  -- Count unique patients
  SELECT COUNT(DISTINCT patient_id) INTO v_total_patients
  FROM appointments
  WHERE doctor_id = p_doctor_id AND status = 'completed';
  
  -- Count total appointments
  SELECT COUNT(*) INTO v_total_appointments
  FROM appointments
  WHERE doctor_id = p_doctor_id AND status = 'completed';
  
  -- Update doctor record
  UPDATE doctors
  SET
    total_patients = v_total_patients,
    total_appointments = v_total_appointments,
    updated_at = NOW()
  WHERE id = p_doctor_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PART 7: VIEW - PATIENT HEALTH DASHBOARD
-- ============================================================

CREATE OR REPLACE VIEW patient_health_dashboard AS
SELECT
  p.id,
  p.full_name,
  p.dob,
  EXTRACT(YEAR FROM AGE(p.dob)) as age,
  p.risk_level,
  p.health_score,
  p.last_visit,
  p.next_appointment,
  p.total_visits,
  p.chronic_conditions,
  p.current_medications,
  p.status,
  
  -- Recent appointment
  (SELECT COUNT(*) FROM appointments a 
   WHERE a.patient_id = p.id 
   AND a.scheduled_at > NOW() - INTERVAL '30 days') as visits_last_month,
  
  -- Upcoming appointments
  (SELECT COUNT(*) FROM appointments a 
   WHERE a.patient_id = p.id 
   AND a.scheduled_at > NOW() 
   AND a.status IN ('pending', 'confirmed')) as upcoming_appointments,
  
  -- Days since last visit
  CASE 
    WHEN p.last_visit IS NOT NULL THEN
      EXTRACT(DAY FROM (NOW() - p.last_visit))
    ELSE NULL
  END as days_since_last_visit,
  
  -- Flags
  (p.health_score < 50) as needs_attention,
  (p.risk_level IN ('high', 'critical')) as high_risk,
  (p.last_visit IS NULL OR p.last_visit < NOW() - INTERVAL '1 year') as overdue_checkup
  
FROM patients p
WHERE p.archived = FALSE;

COMMENT ON VIEW patient_health_dashboard IS 'Comprehensive patient health dashboard with calculated metrics';

-- ============================================================
-- PART 8: TRIGGERS FOR DOCTORS
-- ============================================================

CREATE OR REPLACE FUNCTION update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_doctors_updated_at ON doctors;
CREATE TRIGGER trigger_update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_doctors_updated_at();

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
        'migration', '043_medical_records_triggers_functions',
        'features', jsonb_build_array(
          'Patient update triggers',
          'Audit logging',
          'Health score calculation',
          'HIPAA access logging',
          'Statistics functions',
          'Health dashboard view'
        )
      ),
      NOW()
    );
  END IF;
END $$;
