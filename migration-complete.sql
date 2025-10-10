-- Complete Database Migration Script
-- Generated: 2025-10-10T14:30:39.177Z
-- Project: Moeen Healthcare Platform

-- ============================================
-- MIGRATION 1: Core Healthcare Tables
-- ============================================

-- 001_add_public_id_core_tables.sql
-- Migration: Add public_id columns to existing healthcare tables
-- IMPORTANT: Run backup before applying this migration
-- Date: 2024-01-15
-- Description: Adds CUID public_id columns to core healthcare tables for API use

-- Add public_id columns with UNIQUE constraint
ALTER TABLE patients 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE doctors 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE appointments 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE sessions 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

ALTER TABLE insurance_claims 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

-- Performance indexes for public_id columns
CREATE INDEX IF NOT EXISTS idx_patients_public_id 
  ON patients(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_doctors_public_id 
  ON doctors(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_public_id 
  ON appointments(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_public_id 
  ON sessions(public_id) WHERE public_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_insurance_claims_public_id 
  ON insurance_claims(public_id) WHERE public_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN patients.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN doctors.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN appointments.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN sessions.public_id IS 'CUID public identifier for API use';
COMMENT ON COLUMN insurance_claims.public_id IS 'CUID public identifier for API use';

-- Log migration completion
INSERT INTO audit_logs (action, table_name, new_values) 
VALUES ('migration', 'core_tables', '{"migration": "001_add_public_id_core_tables", "status": "completed"}')
ON CONFLICT DO NOTHING;


-- 010_chatbot_tables.sql
-- Migration: Create Chatbot System Tables
-- Date: 2024-01-15
-- Description: Creates complete chatbot subsystem with flows, nodes, edges, templates, integrations, conversations, and messages

-- chatbot_flows
CREATE TABLE IF NOT EXISTS chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_nodes
CREATE TABLE IF NOT EXISTS chatbot_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  node_type VARCHAR(50) NOT NULL, -- 'start', 'message', 'condition', 'action', 'end'
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL, -- Node configuration (messages, conditions, etc.)
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_edges
CREATE TABLE IF NOT EXISTS chatbot_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  condition JSONB, -- Edge condition logic
  created_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_templates
CREATE TABLE IF NOT EXISTS chatbot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- 'greeting', 'appointment', 'information', 'support'
  language VARCHAR(10) DEFAULT 'ar',
  content TEXT NOT NULL,
  variables JSONB, -- Template variables
  is_approved BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_integrations
CREATE TABLE IF NOT EXISTS chatbot_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'whatsapp', 'web', 'telegram', 'facebook'
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL, -- Provider-specific configuration
  status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'error'
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  last_health_check TIMESTAMP,
  health_status VARCHAR(50) DEFAULT 'unknown', -- 'healthy', 'unhealthy', 'unknown'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  integration_id UUID REFERENCES chatbot_integrations(id),
  patient_id UUID REFERENCES patients(id),
  external_id VARCHAR(255), -- External conversation ID (WhatsApp, etc.)
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'archived'
  channel VARCHAR(50) NOT NULL, -- 'whatsapp', 'web', 'telegram'
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  metadata JSONB, -- Additional conversation data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL, -- 'user', 'bot', 'system'
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file', 'button'
  metadata JSONB, -- Additional message data
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Add comments for documentation
COMMENT ON TABLE chatbot_flows IS 'Chatbot conversation flows and workflows';
COMMENT ON TABLE chatbot_nodes IS 'Individual nodes within chatbot flows';
COMMENT ON TABLE chatbot_edges IS 'Connections between chatbot nodes';
COMMENT ON TABLE chatbot_templates IS 'Reusable message templates for chatbot';
COMMENT ON TABLE chatbot_integrations IS 'External platform integrations for chatbot';
COMMENT ON TABLE conversations IS 'Individual chatbot conversations';
COMMENT ON TABLE messages IS 'Messages within chatbot conversations';


-- 011_chatbot_indexes.sql
-- Migration: Create Chatbot System Indexes
-- Date: 2024-01-15
-- Description: Performance indexes for chatbot tables

-- Chatbot flows indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_status ON chatbot_flows(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_created_by ON chatbot_flows(created_by);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_public_id ON chatbot_flows(public_id);

-- Chatbot nodes indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_flow_id ON chatbot_nodes(flow_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_type ON chatbot_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_public_id ON chatbot_nodes(public_id);

-- Chatbot edges indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_flow_id ON chatbot_edges(flow_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_source ON chatbot_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_target ON chatbot_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_public_id ON chatbot_edges(public_id);

-- Chatbot templates indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_category ON chatbot_templates(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_language ON chatbot_templates(language);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_approved ON chatbot_templates(is_approved);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_public_id ON chatbot_templates(public_id);

-- Chatbot integrations indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_provider ON chatbot_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_status ON chatbot_integrations(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_health ON chatbot_integrations(health_status);
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_public_id ON chatbot_integrations(public_id);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_integration ON conversations(integration_id);
CREATE INDEX IF NOT EXISTS idx_conversations_patient ON conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_external_id ON conversations(external_id);
CREATE INDEX IF NOT EXISTS idx_conversations_public_id ON conversations(public_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_messages_public_id ON messages(public_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_conversations_patient_status ON conversations(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sent ON messages(conversation_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_created_status ON chatbot_flows(created_by, status);


-- 012_chatbot_rls.sql
-- Migration: Create Chatbot System RLS Policies
-- Date: 2024-01-15
-- Description: Row Level Security policies for chatbot tables

-- Enable RLS on chatbot tables
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Chatbot flows policies
CREATE POLICY "Users can view published flows" ON chatbot_flows
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their own flows" ON chatbot_flows
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all flows" ON chatbot_flows
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot nodes policies
CREATE POLICY "Users can view nodes of accessible flows" ON chatbot_nodes
  FOR SELECT USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE 
      status = 'published' OR 
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  ));

CREATE POLICY "Users can manage nodes of their flows" ON chatbot_nodes
  FOR ALL USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE created_by = auth.uid()
  ));

CREATE POLICY "Admins can manage all nodes" ON chatbot_nodes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot edges policies
CREATE POLICY "Users can view edges of accessible flows" ON chatbot_edges
  FOR SELECT USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE 
      status = 'published' OR 
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  ));

CREATE POLICY "Users can manage edges of their flows" ON chatbot_edges
  FOR ALL USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE created_by = auth.uid()
  ));

CREATE POLICY "Admins can manage all edges" ON chatbot_edges
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot templates policies
CREATE POLICY "Users can view approved templates" ON chatbot_templates
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own templates" ON chatbot_templates
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all templates" ON chatbot_templates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot integrations policies
CREATE POLICY "Users can view active integrations" ON chatbot_integrations
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage their own integrations" ON chatbot_integrations
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all integrations" ON chatbot_integrations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (patient_id IN (
    SELECT id FROM patients WHERE id IN (
      SELECT patient_id FROM appointments WHERE doctor_id IN (
        SELECT id FROM doctors WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "Admins can view all conversations" ON conversations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can manage conversations" ON conversations
  FOR ALL USING (true); -- Allow system/bot operations

-- Messages policies
CREATE POLICY "Users can view messages of their conversations" ON messages
  FOR SELECT USING (conversation_id IN (
    SELECT id FROM conversations WHERE patient_id IN (
      SELECT id FROM patients WHERE id IN (
        SELECT patient_id FROM appointments WHERE doctor_id IN (
          SELECT id FROM doctors WHERE user_id = auth.uid()
        )
      )
    )
  ));

CREATE POLICY "Admins can view all messages" ON messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can manage messages" ON messages
  FOR ALL USING (true); -- Allow system/bot operations


-- 020_crm_tables.sql
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


-- 021_crm_indexes.sql
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


-- 022_crm_rls.sql
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


-- 030_system_admin_tables.sql
-- Migration: Create System & Admin Tables
-- Date: 2024-01-15
-- Description: Creates system administration tables for notifications, audit logs, roles, and settings

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- internal_messages
CREATE TABLE IF NOT EXISTS internal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES internal_messages(id),
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL, -- Array of permission strings
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general', -- 'general', 'api', 'integrations', 'notifications'
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE internal_messages IS 'Internal messaging system between users';
COMMENT ON TABLE audit_logs IS 'Audit trail for all system actions';
COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE user_roles IS 'User role assignments';
COMMENT ON TABLE settings IS 'System configuration settings';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed';
COMMENT ON COLUMN audit_logs.table_name IS 'Database table affected';
COMMENT ON COLUMN roles.permissions IS 'JSON array of permission strings';
COMMENT ON COLUMN settings.is_public IS 'Whether setting is publicly readable';


-- 031_system_rls.sql
-- Migration: Create System & Admin RLS Policies
-- Date: 2024-01-15
-- Description: Row Level Security policies for system administration tables

-- Enable RLS on system tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Internal messages policies
CREATE POLICY "Users can view messages sent to them" ON internal_messages
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can view messages they sent" ON internal_messages
  FOR SELECT USING (sender_id = auth.uid());

CREATE POLICY "Users can create messages" ON internal_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received messages" ON internal_messages
  FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Admins can manage all messages" ON internal_messages
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Audit logs policies (read-only for most users)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Roles policies
CREATE POLICY "Users can view non-system roles" ON roles
  FOR SELECT USING (is_system = false);

CREATE POLICY "Admins can manage all roles" ON roles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- User roles policies
CREATE POLICY "Users can view their own role assignments" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all role assignments" ON user_roles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Settings policies
CREATE POLICY "Users can view public settings" ON settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create audit log trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for sensitive tables
CREATE TRIGGER audit_patients_trigger
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_appointments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();


