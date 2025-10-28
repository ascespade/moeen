-- ================================================================
-- 💳 PAYMENTS MODULE ENHANCEMENT MIGRATION
-- ================================================================

-- Create payments table if not exists
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  public_id VARCHAR(255) UNIQUE DEFAULT 'pay_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('payments_id_seq')::TEXT, 6, '0'),
  appointment_id INTEGER REFERENCES appointments(id),
  patient_id INTEGER REFERENCES patients(id),
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'SAR',
  method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Payment gateway info
  gateway VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  gateway_response JSONB,
  
  -- Tracking
  created_by UUID,
  updated_by UUID,
  processed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add tracking columns
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS ip_address INET,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Constraints
ALTER TABLE payments ADD CONSTRAINT payments_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'));

ALTER TABLE payments ADD CONSTRAINT payments_amount_check 
CHECK (amount >= 0);

COMMENT ON TABLE payments IS 'Payment transactions with full tracking';
