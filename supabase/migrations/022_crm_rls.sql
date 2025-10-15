-- Migration: Create CRM System RLS Policies
-- Date: 2024-01-15
-- Description: Row Level Security policies for CRM tables

-- Enable RLS on CRM tables
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;

-- CRM leads policies
CREATE POLICY "Users can view their own leads" ON crm_leads
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can manage their own leads" ON crm_leads
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all leads" ON crm_leads
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- CRM deals policies
CREATE POLICY "Users can view their own deals" ON crm_deals
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can manage their own deals" ON crm_deals
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all deals" ON crm_deals
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- CRM activities policies
CREATE POLICY "Users can view their own activities" ON crm_activities
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can manage their own activities" ON crm_activities
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all activities" ON crm_activities
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Additional policies for team collaboration (optional)
-- Uncomment if team-based access is needed
/*
CREATE POLICY "Team members can view team leads" ON crm_leads
  FOR SELECT USING (owner_id IN (
    SELECT id FROM users WHERE department = (
      SELECT department FROM users WHERE id = auth.uid()
    )
  ));
*/
