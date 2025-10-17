-- ================================================================
-- 👥 CRM MODULE ENHANCEMENT
-- ================================================================

-- Enhance customers table
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lifecycle_stage VARCHAR(50) DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Enhance crm_leads
ALTER TABLE crm_leads
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS assigned_to UUID,
  ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100),
  ADD COLUMN IF NOT EXISTS conversion_probability NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_lead_score ON customers(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_customers_lifecycle ON customers(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(lead_source);

-- Constraints
ALTER TABLE customers ADD CONSTRAINT customers_lead_score_check 
CHECK (lead_score >= 0 AND lead_score <= 100);

ALTER TABLE customers ADD CONSTRAINT customers_lifecycle_check 
CHECK (lifecycle_stage IN ('lead', 'prospect', 'customer', 'advocate', 'inactive'));
