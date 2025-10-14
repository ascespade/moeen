-- Migration: Create CRM System Tables
-- Date: 2024-01-15
-- Description: Creates CRM subsystem with leads, deals, and activities

-- crm_leads
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(100), -- 'website', 'referral', 'social', 'cold_call'
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'unqualified', 'converted'
  score INTEGER DEFAULT 0, -- Lead scoring
  notes TEXT,
  owner_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- crm_deals
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  stage VARCHAR(50) DEFAULT 'prospecting', -- 'prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  probability INTEGER DEFAULT 0, -- Percentage
  expected_close_date DATE,
  actual_close_date DATE,
  owner_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES patients(id), -- Using patients as contacts
  lead_id UUID REFERENCES crm_leads(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- crm_activities
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'task', 'note'
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TIME,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  owner_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES patients(id),
  deal_id UUID REFERENCES crm_deals(id),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE crm_leads IS 'CRM leads and potential customers';
COMMENT ON TABLE crm_deals IS 'CRM deals and sales opportunities';
COMMENT ON TABLE crm_activities IS 'CRM activities and tasks';
COMMENT ON COLUMN crm_deals.contact_id IS 'References patients table as contacts';
COMMENT ON COLUMN crm_deals.value IS 'Deal value in specified currency';
COMMENT ON COLUMN crm_deals.probability IS 'Probability percentage (0-100)';
COMMENT ON COLUMN crm_activities.priority IS 'Activity priority level';
COMMENT ON COLUMN crm_activities.type IS 'Type of CRM activity';
