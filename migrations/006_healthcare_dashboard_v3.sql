-- Healthcare Dashboard v3.0 Force Update Migration
-- This migration adds the new role-based system and additional tables

-- Create the new users table with role system (if not exists)
CREATE TABLE IF NOT EXISTS users_v3 (
  id serial primary key, 
  email text unique, 
  password_hash text, 
  role text, 
  meta jsonb, 
  created_at timestamptz default now()
);

-- Create roles table for the new system
CREATE TABLE IF NOT EXISTS roles_v3 (
  role text primary key, 
  description text
);

-- Insert roles for the healthcare system
INSERT INTO roles_v3 (role, description) VALUES 
  ('patient','Patient role with access to personal dashboard and appointment booking'),
  ('doctor','Doctor role with access to patient records and appointment management'),
  ('staff','Staff role with access to patient registration and payment processing'),
  ('supervisor','Supervisor role with access to staff management and reports'),
  ('admin','Admin role with full system access and configuration')
ON CONFLICT (role) DO NOTHING;

-- Create patients table for the new system
CREATE TABLE IF NOT EXISTS patients_v3 (
  id serial primary key, 
  user_id int references users_v3(id), 
  full_name text, 
  dob date, 
  phone text, 
  insurance_provider text, 
  insurance_number text, 
  activated boolean default false, 
  created_at timestamptz default now()
);

-- Create doctors table for the new system
CREATE TABLE IF NOT EXISTS doctors_v3 (
  id serial primary key, 
  user_id int references users_v3(id), 
  speciality text, 
  schedule jsonb, 
  created_at timestamptz default now()
);

-- Create appointments table for the new system
CREATE TABLE IF NOT EXISTS appointments_v3 (
  id serial primary key, 
  patient_id int references patients_v3(id), 
  doctor_id int references doctors_v3(id), 
  scheduled_at timestamptz, 
  status text default 'pending', 
  payment_status text default 'unpaid', 
  created_at timestamptz default now()
);

-- Create insurance claims table
CREATE TABLE IF NOT EXISTS insurance_claims_v3 (
  id serial primary key, 
  patient_id int references patients_v3(id), 
  appointment_id int references appointments_v3(id), 
  provider text, 
  claim_status text default 'draft', 
  claim_payload jsonb, 
  created_at timestamptz default now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments_v3 (
  id serial primary key, 
  appointment_id int references appointments_v3(id), 
  amount numeric, 
  currency text, 
  method text, 
  status text default 'pending', 
  meta jsonb, 
  created_at timestamptz default now()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages_v3 (
  id serial primary key, 
  code text unique, 
  name text, 
  is_default boolean default false, 
  direction text default 'rtl'
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations_v3 (
  id serial primary key, 
  lang_code text references languages_v3(code), 
  key text, 
  value text, 
  created_at timestamptz default now()
);

-- Create reports admin table
CREATE TABLE IF NOT EXISTS reports_admin_v3 (
  id serial primary key, 
  type text, 
  payload jsonb, 
  generated_at timestamptz default now()
);

-- Create system metrics table
CREATE TABLE IF NOT EXISTS system_metrics_v3 (
  id serial primary key, 
  metric_key text, 
  metric_value numeric, 
  meta jsonb, 
  recorded_at timestamptz default now()
);

-- Create missing translations table
CREATE TABLE IF NOT EXISTS missing_translations_v3 (
  id serial primary key,
  key text,
  lang_code text,
  context text,
  created_at timestamptz default now()
);

-- Insert default languages
INSERT INTO languages_v3 (code, name, is_default, direction) VALUES 
  ('ar', 'العربية', true, 'rtl'),
  ('en', 'English', false, 'ltr')
ON CONFLICT (code) DO NOTHING;

-- Insert some basic translations
INSERT INTO translations_v3 (lang_code, key, value) VALUES 
  ('ar', 'dashboard.title', 'لوحة التحكم'),
  ('ar', 'dashboard.patients', 'المرضى'),
  ('ar', 'dashboard.doctors', 'الأطباء'),
  ('ar', 'dashboard.appointments', 'المواعيد'),
  ('ar', 'dashboard.revenue', 'الإيرادات'),
  ('ar', 'dashboard.claims', 'المطالبات'),
  ('en', 'dashboard.title', 'Dashboard'),
  ('en', 'dashboard.patients', 'Patients'),
  ('en', 'dashboard.doctors', 'Doctors'),
  ('en', 'dashboard.appointments', 'Appointments'),
  ('en', 'dashboard.revenue', 'Revenue'),
  ('en', 'dashboard.claims', 'Claims')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_v3_email ON users_v3(email);
CREATE INDEX IF NOT EXISTS idx_users_v3_role ON users_v3(role);
CREATE INDEX IF NOT EXISTS idx_patients_v3_user_id ON patients_v3(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_v3_activated ON patients_v3(activated);
CREATE INDEX IF NOT EXISTS idx_doctors_v3_user_id ON doctors_v3(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_v3_patient_id ON appointments_v3(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_v3_doctor_id ON appointments_v3(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_v3_scheduled_at ON appointments_v3(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_translations_v3_lang_key ON translations_v3(lang_code, key);
CREATE INDEX IF NOT EXISTS idx_missing_translations_v3_key ON missing_translations_v3(key);

-- Create a function to log missing translations
CREATE OR REPLACE FUNCTION log_missing_translation(
  p_key text,
  p_lang_code text,
  p_context text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO missing_translations_v3 (key, lang_code, context)
  VALUES (p_key, p_lang_code, p_context)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get translations with fallback
CREATE OR REPLACE FUNCTION get_translation(
  p_key text,
  p_lang_code text DEFAULT 'ar'
) RETURNS text AS $$
DECLARE
  result text;
BEGIN
  -- Try to get translation for the requested language
  SELECT value INTO result
  FROM translations_v3
  WHERE key = p_key AND lang_code = p_lang_code;
  
  -- If not found, try to get from default language (Arabic)
  IF result IS NULL THEN
    SELECT value INTO result
    FROM translations_v3
    WHERE key = p_key AND lang_code = 'ar';
  END IF;
  
  -- If still not found, log the missing translation and return the key
  IF result IS NULL THEN
    PERFORM log_missing_translation(p_key, p_lang_code, 'get_translation_function');
    RETURN p_key;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing
INSERT INTO users_v3 (email, password_hash, role, meta) VALUES 
  ('admin@alhemamcenter.com', '$2b$10$example_hash', 'admin', '{"name": "System Admin"}'),
  ('doctor1@alhemamcenter.com', '$2b$10$example_hash', 'doctor', '{"name": "Dr. Ahmed", "speciality": "General Medicine"}'),
  ('staff1@alhemamcenter.com', '$2b$10$example_hash', 'staff', '{"name": "Staff Member"}')
ON CONFLICT (email) DO NOTHING;

-- Insert sample patients
INSERT INTO patients_v3 (user_id, full_name, dob, phone, insurance_provider, insurance_number, activated) VALUES 
  (1, 'محمد أحمد', '1985-01-15', '+966501234567', 'التأمين السعودي', 'SA123456789', true),
  (2, 'فاطمة محمد', '1990-05-20', '+966502345678', 'تأمين الراجحي', 'RH987654321', false)
ON CONFLICT DO NOTHING;

-- Insert sample doctors
INSERT INTO doctors_v3 (user_id, speciality, schedule) VALUES 
  (2, 'General Medicine', '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}}')
ON CONFLICT DO NOTHING;

-- Log completion
INSERT INTO system_metrics_v3 (metric_key, metric_value, meta) VALUES 
  ('migration_v3_completed', 1, '{"timestamp": "' || NOW() || '", "version": "3.0-force"}');

-- Success message
SELECT 'Healthcare Dashboard v3.0 migration completed successfully!' as message;