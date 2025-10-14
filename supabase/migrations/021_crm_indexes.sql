-- Migration: Create CRM System Indexes
-- Date: 2024-01-15
-- Description: Performance indexes for CRM tables

-- CRM leads indexes
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner ON crm_leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_public_id ON crm_leads(public_id);

-- CRM deals indexes
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner ON crm_deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_lead ON crm_deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_value ON crm_deals(value);
CREATE INDEX IF NOT EXISTS idx_crm_deals_close_date ON crm_deals(expected_close_date);
CREATE INDEX IF NOT EXISTS idx_crm_deals_public_id ON crm_deals(public_id);

-- CRM activities indexes
CREATE INDEX IF NOT EXISTS idx_crm_activities_type ON crm_activities(type);
CREATE INDEX IF NOT EXISTS idx_crm_activities_owner ON crm_activities(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_status ON crm_activities(status);
CREATE INDEX IF NOT EXISTS idx_crm_activities_priority ON crm_activities(priority);
CREATE INDEX IF NOT EXISTS idx_crm_activities_due_date ON crm_activities(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_deal ON crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_public_id ON crm_activities(public_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner_status ON crm_leads(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner_stage ON crm_deals(owner_id, stage);
CREATE INDEX IF NOT EXISTS idx_crm_activities_owner_status ON crm_activities(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_activities_due_status ON crm_activities(due_date, status);
