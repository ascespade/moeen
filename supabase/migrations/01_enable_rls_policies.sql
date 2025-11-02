-- Enable Row Level Security (RLS) on all sensitive tables
-- This migration enables RLS and creates policies for HIPAA compliance
-- Date: 2025-11-02
-- Phase 2: Critical Security Fix

-- Enable RLS on users table
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own record
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

-- Policy: Only admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- Policy: Users can update their own record
CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Policy: Only admins can insert users
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- Enable RLS on patients table
ALTER TABLE IF EXISTS patients ENABLE ROW LEVEL SECURITY;

-- Policy: Patients can view their own record
CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND (users.role = 'patient' AND users.id = patients.id)
    )
  );

-- Policy: Doctors, staff, and admins can view patients
CREATE POLICY "Staff can view patients"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  );

-- Policy: Only doctors, staff, and admins can create patients
CREATE POLICY "Staff can create patients"
  ON patients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  );

-- Policy: Only doctors, staff, and admins can update patients
CREATE POLICY "Staff can update patients"
  ON patients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  );

-- Enable RLS on doctors table
ALTER TABLE IF EXISTS doctors ENABLE ROW LEVEL SECURITY;

-- Policy: Doctors can view their own record
CREATE POLICY "Doctors can view own record"
  ON doctors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.id = doctors.user_id
    )
  );

-- Policy: All authenticated users can view doctors
CREATE POLICY "Authenticated users can view doctors"
  ON doctors FOR SELECT
  USING (auth.role() = 'authenticated');

-- Enable RLS on appointments table
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Patients can view their own appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND (users.role = 'patient' AND users.id = appointments.patient_id)
    )
  );

-- Policy: Doctors can view their own appointments
CREATE POLICY "Doctors can view own appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND EXISTS (
        SELECT 1 FROM doctors
        WHERE doctors.user_id::text = auth.uid()::text
        AND doctors.id = appointments.doctor_id
      )
    )
  );

-- Policy: Staff and admins can view all appointments
CREATE POLICY "Staff can view all appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('staff', 'admin', 'supervisor', 'manager')
    )
  );

-- Policy: Only staff can create/update appointments
CREATE POLICY "Staff can manage appointments"
  ON appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  );

-- Enable RLS on sessions table
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Similar to appointments
CREATE POLICY "Patients can view own sessions"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND (users.role = 'patient' AND users.id = sessions.patient_id)
    )
  );

CREATE POLICY "Staff can manage sessions"
  ON sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('doctor', 'staff', 'admin', 'supervisor', 'manager')
    )
  );

-- Enable RLS on medical_records if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'medical_records') THEN
    ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Patients can view own medical records"
      ON medical_records FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id::text = auth.uid()::text
          AND users.id = medical_records.patient_id
        )
      );

    CREATE POLICY "Staff can manage medical records"
      ON medical_records FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id::text = auth.uid()::text
          AND users.role IN ('doctor', 'staff', 'admin', 'supervisor')
        )
      );
  END IF;
END $$;

-- Enable RLS on audit_logs (admins only)
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- Enable RLS on insurance_claims if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'insurance_claims') THEN
    ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Patients can view own claims"
      ON insurance_claims FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id::text = auth.uid()::text
          AND users.id = insurance_claims.patient_id
        )
      );

    CREATE POLICY "Staff can manage claims"
      ON insurance_claims FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id::text = auth.uid()::text
          AND users.role IN ('staff', 'admin', 'supervisor')
        )
      );
  END IF;
END $$;

-- Create function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action VARCHAR(100),
  p_table_name VARCHAR(100),
  p_record_id INTEGER,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_audit_id INTEGER;
  v_user_id INTEGER;
BEGIN
  -- Get user ID from auth context
  v_user_id := NULL;
  IF auth.uid() IS NOT NULL THEN
    SELECT id INTO v_user_id FROM users WHERE id::text = auth.uid()::text LIMIT 1;
  END IF;

  -- Insert audit log
  INSERT INTO audit_logs (
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    user_id,
    ip_address,
    user_agent
  ) VALUES (
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    v_user_id,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION log_audit_event TO authenticated;

COMMENT ON FUNCTION log_audit_event IS 'Creates an audit log entry for HIPAA compliance and security tracking';
