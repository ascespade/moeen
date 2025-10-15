-- Migration: Create Insurance, Payments, and Claims System
-- Date: 2025-10-15
-- Description: Creates tables for insurance claims and payment processing

-- Create insurance_claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  claim_status TEXT DEFAULT 'draft' CHECK (claim_status IN ('draft', 'submitted', 'approved', 'rejected', 'under_review')),
  claim_payload JSONB DEFAULT '{}',
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  method TEXT NOT NULL CHECK (method IN ('cash', 'card', 'bank_transfer', 'insurance')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for insurance_claims
CREATE POLICY "Patients can view own claims" ON insurance_claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = insurance_claims.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all claims" ON insurance_claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );

-- RLS policies for payments
CREATE POLICY "Patients can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments 
      JOIN patients ON appointments.patient_id = patients.id
      WHERE appointments.id = payments.appointment_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_insurance_claims_patient_id ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_appointment_id ON insurance_claims(appointment_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_provider ON insurance_claims(provider);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(claim_status);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_created_at ON insurance_claims(created_at);

CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Add comments
COMMENT ON TABLE insurance_claims IS 'Insurance claims for appointments and treatments';
COMMENT ON TABLE payments IS 'Payment records for appointments and services';
COMMENT ON COLUMN insurance_claims.claim_payload IS 'Additional claim data and attachments';
COMMENT ON COLUMN payments.meta IS 'Payment metadata including transaction IDs and references';
