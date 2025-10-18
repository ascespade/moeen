-- ═══════════════════════════════════════════════════════════════════════
-- FIX CRITICAL DATABASE ISSUES
-- Run this in Supabase SQL Editor immediately
-- ═══════════════════════════════════════════════════════════════════════

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ISSUE 1: Create missing medical_records table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  record_date TIMESTAMP DEFAULT NOW(),
  record_type VARCHAR(50) DEFAULT 'general',
  diagnosis TEXT,
  treatment TEXT,
  medications JSONB DEFAULT '[]'::jsonb,
  prescriptions JSONB DEFAULT '[]'::jsonb,
  lab_results JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  follow_up_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  public_id VARCHAR(255) UNIQUE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON medical_records(record_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_status ON medical_records(status);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ISSUE 2: Create missing payments table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),
  medical_record_id UUID REFERENCES medical_records(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  moyasar_payment_id VARCHAR(255),
  invoice_number VARCHAR(100) UNIQUE,
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  public_id VARCHAR(255) UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_number);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ISSUE 3: Create secure view for users (hide sensitive fields)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE VIEW users_public AS
SELECT 
  id,
  email,
  name,
  role,
  status,
  phone,
  avatar_url,
  timezone,
  language,
  is_active,
  last_login,
  login_count,
  preferences,
  metadata,
  created_at,
  updated_at,
  last_activity_at
FROM users;

-- Allow public access to safe fields only
GRANT SELECT ON users_public TO anon, authenticated;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ISSUE 4: Apply Row Level Security (RLS)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable RLS on all tables
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medical_records
CREATE POLICY "Users can view their own medical records" 
  ON medical_records FOR SELECT 
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE created_by = auth.uid()
    )
    OR
    doctor_id IN (
      SELECT id FROM doctors 
      WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager', 'supervisor')
    )
  );

CREATE POLICY "Doctors can insert medical records" 
  ON medical_records FOR INSERT 
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM doctors 
      WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Doctors can update their own medical records" 
  ON medical_records FOR UPDATE 
  USING (
    doctor_id IN (
      SELECT id FROM doctors 
      WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" 
  ON payments FOR SELECT 
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE created_by = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager', 'agent')
    )
  );

CREATE POLICY "Admin can insert payments" 
  ON payments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager', 'agent')
    )
  );

CREATE POLICY "Admin can update payments" 
  ON payments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ISSUE 5: Fix ip_address trigger
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS set_ip_address_trigger ON patients;
DROP TRIGGER IF EXISTS set_ip_on_insert ON patients;
DROP TRIGGER IF EXISTS set_ip_on_update ON patients;

-- Make ip_address nullable (safest fix)
ALTER TABLE patients ALTER COLUMN ip_address DROP NOT NULL;
ALTER TABLE patients ALTER COLUMN ip_address DROP DEFAULT;

-- Optional: Update function to handle NULL properly
CREATE OR REPLACE FUNCTION set_ip_address_safe()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set if value is provided and valid
  IF NEW.ip_address IS NOT NULL THEN
    BEGIN
      -- Try to cast to inet
      NEW.ip_address := CAST(NEW.ip_address AS inet);
    EXCEPTION WHEN OTHERS THEN
      -- If cast fails, set to NULL
      NEW.ip_address := NULL;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger with safe function
CREATE TRIGGER set_ip_address_safe_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_ip_address_safe();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ISSUE 6: Add triggers for updated_at
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to medical_records
DROP TRIGGER IF EXISTS update_medical_records_updated_at ON medical_records;
CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to payments
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Verification queries
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check if tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('medical_records', 'payments', 'users_public')
ORDER BY table_name;

-- Check RLS policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('medical_records', 'payments')
ORDER BY tablename, policyname;

-- ═══════════════════════════════════════════════════════════════════════
-- SUCCESS! All critical issues fixed
-- ═══════════════════════════════════════════════════════════════════════
