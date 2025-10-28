-- Migration: Dynamic Dashboard Statistics System
-- Creates comprehensive SQL functions for real-time dashboard statistics

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dashboard statistics view
CREATE OR REPLACE VIEW dashboard_statistics AS
SELECT 
  -- Patient Statistics
  (SELECT COUNT(*) FROM patients WHERE status = 'active') as total_patients,
  (SELECT COUNT(*) FROM patients WHERE status = 'active' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as new_patients_this_month,
  (SELECT COUNT(*) FROM patients WHERE status = 'blocked') as blocked_patients,
  
  -- Appointment Statistics
  (SELECT COUNT(*) FROM appointments) as total_appointments,
  (SELECT COUNT(*) FROM appointments WHERE status = 'completed') as completed_appointments,
  (SELECT COUNT(*) FROM appointments WHERE status = 'pending') as pending_appointments,
  (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') as cancelled_appointments,
  (SELECT COUNT(*) FROM appointments WHERE appointment_date::date = CURRENT_DATE) as appointments_today,
  (SELECT COUNT(*) FROM appointments WHERE appointment_date >= CURRENT_DATE - INTERVAL '7 days') as appointments_this_week,
  
  -- Doctor Statistics
  (SELECT COUNT(*) FROM doctors WHERE status = 'active') as total_doctors,
  (SELECT COUNT(*) FROM doctors WHERE status = 'active' AND specialty IS NOT NULL) as doctors_with_specialty,
  
  -- Staff Statistics
  (SELECT COUNT(*) FROM users WHERE user_role IN ('doctor', 'therapist', 'staff', 'admin')) as total_staff,
  (SELECT COUNT(*) FROM users WHERE user_role IN ('doctor', 'therapist', 'staff', 'admin') AND status = 'active') as active_staff,
  
  -- Session Statistics
  (SELECT COUNT(*) FROM sessions) as total_sessions,
  (SELECT COUNT(*) FROM sessions WHERE status = 'completed') as completed_sessions,
  (SELECT COUNT(*) FROM sessions WHERE status = 'scheduled' AND session_date >= CURRENT_DATE) as upcoming_sessions,
  
  -- Revenue Statistics (if payments table exists)
  COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'completed'), 0) as total_revenue,
  COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '30 days'), 0) as monthly_revenue,
  
  -- Insurance Claims Statistics
  (SELECT COUNT(*) FROM insurance_claims) as total_claims,
  (SELECT COUNT(*) FROM insurance_claims WHERE status = 'approved') as approved_claims,
  (SELECT COUNT(*) FROM insurance_claims WHERE status = 'pending') as pending_claims,
  (SELECT COUNT(*) FROM insurance_claims WHERE status = 'rejected') as rejected_claims;

-- Create function to get patient analytics by age groups
CREATE OR REPLACE FUNCTION get_patient_analytics_by_age()
RETURNS TABLE(age_group TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) BETWEEN 0 AND 5 THEN '0-5'
      WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) BETWEEN 6 AND 12 THEN '6-12'
      WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) BETWEEN 13 AND 18 THEN '13-18'
      WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) >= 19 THEN '19+'
      ELSE 'غير محدد'
    END as age_group,
    COUNT(*) as count
  FROM patients p
  WHERE p.status = 'active'
  GROUP BY age_group
  ORDER BY 
    CASE age_group
      WHEN '0-5' THEN 1
      WHEN '6-12' THEN 2
      WHEN '13-18' THEN 3
      WHEN '19+' THEN 4
      ELSE 5
    END;
END;
$$ LANGUAGE plpgsql;

-- Create function to get patient analytics by condition
CREATE OR REPLACE FUNCTION get_patient_analytics_by_condition()
RETURNS TABLE(condition_name TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.primary_condition, 'غير محدد') as condition_name,
    COUNT(*) as count
  FROM patients p
  WHERE p.status = 'active'
  GROUP BY p.primary_condition
  ORDER BY COUNT(*) DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create function to get patient analytics by gender
CREATE OR REPLACE FUNCTION get_patient_analytics_by_gender()
RETURNS TABLE(gender TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.gender, 'غير محدد') as gender,
    COUNT(*) as count
  FROM patients p
  WHERE p.status = 'active'
  GROUP BY p.gender
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get appointment trends by month
CREATE OR REPLACE FUNCTION get_appointment_trends_by_month(months_back INTEGER DEFAULT 12)
RETURNS TABLE(month TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(a.appointment_date, 'YYYY-MM') as month,
    COUNT(*) as count
  FROM appointments a
  WHERE a.appointment_date >= CURRENT_DATE - INTERVAL '1 month' * months_back
  GROUP BY TO_CHAR(a.appointment_date, 'YYYY-MM')
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Create function to get doctor specialties distribution
CREATE OR REPLACE FUNCTION get_doctor_specialties_distribution()
RETURNS TABLE(specialty TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(d.specialty, 'غير محدد') as specialty,
    COUNT(*) as count
  FROM doctors d
  WHERE d.status = 'active'
  GROUP BY d.specialty
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get therapy sessions by type
CREATE OR REPLACE FUNCTION get_therapy_sessions_by_type()
RETURNS TABLE(therapy_type TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(s.therapy_type, 'غير محدد') as therapy_type,
    COUNT(*) as count
  FROM sessions s
  WHERE s.status IN ('completed', 'scheduled')
  GROUP BY s.therapy_type
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get revenue trends by month
CREATE OR REPLACE FUNCTION get_revenue_trends_by_month(months_back INTEGER DEFAULT 12)
RETURNS TABLE(month TEXT, revenue NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(p.created_at, 'YYYY-MM') as month,
    COALESCE(SUM(p.amount), 0) as revenue
  FROM payments p
  WHERE p.status = 'completed' 
    AND p.created_at >= CURRENT_DATE - INTERVAL '1 month' * months_back
  GROUP BY TO_CHAR(p.created_at, 'YYYY-MM')
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Create function to get recent activities
CREATE OR REPLACE FUNCTION get_recent_activities(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  activity_type TEXT,
  title TEXT,
  description TEXT,
  timestamp TIMESTAMPTZ,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Recent appointments
  SELECT 
    a.id,
    'appointment'::TEXT as activity_type,
    'موعد جديد'::TEXT as title,
    ('تم حجز موعد جديد للمريض ' || COALESCE(p.first_name, 'غير محدد') || ' مع د. ' || COALESCE(d.first_name, 'غير محدد'))::TEXT as description,
    a.created_at as timestamp,
    a.status
  FROM appointments a
  LEFT JOIN patients p ON a.patient_id = p.id
  LEFT JOIN doctors d ON a.doctor_id = d.id
  WHERE a.created_at >= CURRENT_DATE - INTERVAL '7 days'
  
  UNION ALL
  
  -- Recent payments
  SELECT 
    p.id,
    'payment'::TEXT as activity_type,
    'دفعة مستلمة'::TEXT as title,
    ('تم استلام دفعة بقيمة ' || p.amount || ' ريال')::TEXT as description,
    p.created_at as timestamp,
    p.status
  FROM payments p
  WHERE p.status = 'completed' 
    AND p.created_at >= CURRENT_DATE - INTERVAL '7 days'
  
  UNION ALL
  
  -- Recent patient registrations
  SELECT 
    p.id,
    'patient'::TEXT as activity_type,
    'مريض جديد'::TEXT as title,
    ('تم تسجيل مريض جديد: ' || COALESCE(p.first_name, 'غير محدد'))::TEXT as description,
    p.created_at as timestamp,
    p.status
  FROM patients p
  WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days'
  
  ORDER BY timestamp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get staff work hours
CREATE OR REPLACE FUNCTION get_staff_work_hours()
RETURNS TABLE(
  staff_id UUID,
  staff_name TEXT,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  total_hours NUMERIC,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as staff_id,
    COALESCE(u.name, 'غير محدد') as staff_name,
    ah.check_in_time,
    ah.check_out_time,
    CASE 
      WHEN ah.check_out_time IS NOT NULL THEN 
        EXTRACT(EPOCH FROM (ah.check_out_time - ah.check_in_time)) / 3600
      ELSE 
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ah.check_in_time)) / 3600
    END as total_hours,
    CASE 
      WHEN ah.check_out_time IS NOT NULL THEN 'مكتمل'
      ELSE 'نشط'
    END as status
  FROM users u
  LEFT JOIN attendance_history ah ON u.id = ah.user_id 
    AND ah.check_in_time::date = CURRENT_DATE
  WHERE u.user_role IN ('doctor', 'therapist', 'staff', 'admin')
    AND u.status = 'active'
  ORDER BY ah.check_in_time DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Create comprehensive dashboard data function
CREATE OR REPLACE FUNCTION get_comprehensive_dashboard_data()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'statistics', (
      SELECT row_to_json(ds) FROM dashboard_statistics ds LIMIT 1
    ),
    'patient_analytics', json_build_object(
      'by_age', (SELECT json_agg(row_to_json(t)) FROM get_patient_analytics_by_age() t),
      'by_condition', (SELECT json_agg(row_to_json(t)) FROM get_patient_analytics_by_condition() t),
      'by_gender', (SELECT json_agg(row_to_json(t)) FROM get_patient_analytics_by_gender() t)
    ),
    'appointment_trends', (
      SELECT json_agg(row_to_json(t)) FROM get_appointment_trends_by_month(12) t
    ),
    'doctor_specialties', (
      SELECT json_agg(row_to_json(t)) FROM get_doctor_specialties_distribution() t
    ),
    'therapy_sessions', (
      SELECT json_agg(row_to_json(t)) FROM get_therapy_sessions_by_type() t
    ),
    'revenue_trends', (
      SELECT json_agg(row_to_json(t)) FROM get_revenue_trends_by_month(12) t
    ),
    'recent_activities', (
      SELECT json_agg(row_to_json(t)) FROM get_recent_activities(10) t
    ),
    'staff_work_hours', (
      SELECT json_agg(row_to_json(t)) FROM get_staff_work_hours() t
    ),
    'last_updated', CURRENT_TIMESTAMP
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for dashboard data
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read dashboard data
CREATE POLICY "Allow authenticated users to read dashboard data" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read doctors" ON doctors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read sessions" ON sessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read payments" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read insurance claims" ON insurance_claims
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_status_created ON patients(status, created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_doctors_status_specialty ON doctors(status, specialty);
CREATE INDEX IF NOT EXISTS idx_sessions_date_status ON sessions(session_date, status);
CREATE INDEX IF NOT EXISTS idx_payments_status_created ON payments(status, created_at);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_patient_analytics_by_age() TO authenticated;
GRANT EXECUTE ON FUNCTION get_patient_analytics_by_condition() TO authenticated;
GRANT EXECUTE ON FUNCTION get_patient_analytics_by_gender() TO authenticated;
GRANT EXECUTE ON FUNCTION get_appointment_trends_by_month(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_doctor_specialties_distribution() TO authenticated;
GRANT EXECUTE ON FUNCTION get_therapy_sessions_by_type() TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_trends_by_month(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_activities(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_staff_work_hours() TO authenticated;
GRANT EXECUTE ON FUNCTION get_comprehensive_dashboard_data() TO authenticated;

-- Grant select on view
GRANT SELECT ON dashboard_statistics TO authenticated;
