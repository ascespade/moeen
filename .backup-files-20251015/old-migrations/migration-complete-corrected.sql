-- Complete Database Migration Script (CORRECTED)
-- Generated: 2025-10-10T14:30:39.177Z
-- Project: Moeen Healthcare Platform

-- ============================================
-- STEP 1: Create Core Healthcare Tables First
-- ============================================

-- Create core healthcare tables if they don't exist
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  medical_history TEXT,
  allergies TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  license_number VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  consultation_fee DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER DEFAULT 30, -- minutes
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES doctors(id),
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration INTEGER DEFAULT 30, -- minutes
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  diagnosis TEXT,
  treatment_plan TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),
  claim_number VARCHAR(100) UNIQUE,
  insurance_provider VARCHAR(255),
  claim_amount DECIMAL(10,2),
  approved_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'paid'
  submitted_date DATE,
  processed_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STEP 2: Add public_id columns to core tables
-- ============================================

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

-- ============================================
-- STEP 3: Create User Preferences Table
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark', 'auto'
  language VARCHAR(10) DEFAULT 'ar', -- 'ar', 'en'
  timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  notifications_enabled BOOLEAN DEFAULT true,
  sidebar_collapsed BOOLEAN DEFAULT false,
  dashboard_layout JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- STEP 4: Create Translations Table
-- ============================================

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  namespace VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(key, locale, namespace)
);

-- Enable RLS on translations
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for translations (public read)
CREATE POLICY "Anyone can read translations" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage translations" ON translations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- STEP 5: Create Chatbot System Tables
-- ============================================

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

-- ============================================
-- STEP 6: Create CRM System Tables
-- ============================================

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

-- ============================================
-- STEP 7: Create System & Admin Tables
-- ============================================

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

-- ============================================
-- STEP 8: Create All Indexes
-- ============================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_sessions_appointment ON sessions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_doctor ON sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_patient ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);

-- Chatbot indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_status ON chatbot_flows(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_created_by ON chatbot_flows(created_by);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_public_id ON chatbot_flows(public_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_flow_id ON chatbot_nodes(flow_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_type ON chatbot_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_public_id ON chatbot_nodes(public_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_flow_id ON chatbot_edges(flow_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_source ON chatbot_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_target ON chatbot_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_public_id ON chatbot_edges(public_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_category ON chatbot_templates(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_language ON chatbot_templates(language);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_approved ON chatbot_templates(is_approved);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_public_id ON chatbot_templates(public_id);
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

-- CRM indexes
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner ON crm_leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_public_id ON crm_leads(public_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner ON crm_deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_lead ON crm_deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_value ON crm_deals(value);
CREATE INDEX IF NOT EXISTS idx_crm_deals_close_date ON crm_deals(expected_close_date);
CREATE INDEX IF NOT EXISTS idx_crm_deals_public_id ON crm_deals(public_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_type ON crm_activities(type);
CREATE INDEX IF NOT EXISTS idx_crm_activities_owner ON crm_activities(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_status ON crm_activities(status);
CREATE INDEX IF NOT EXISTS idx_crm_activities_priority ON crm_activities(priority);
CREATE INDEX IF NOT EXISTS idx_crm_activities_due_date ON crm_activities(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_deal ON crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_public_id ON crm_activities(public_id);

-- System indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_public_id ON notifications(public_id);
CREATE INDEX IF NOT EXISTS idx_internal_messages_sender ON internal_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_internal_messages_recipient ON internal_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_internal_messages_read ON internal_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_internal_messages_public_id ON internal_messages(public_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_public_id ON audit_logs(public_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_system ON roles(is_system);
CREATE INDEX IF NOT EXISTS idx_roles_public_id ON roles(public_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_public_id ON user_roles(public_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_public ON settings(is_public);
CREATE INDEX IF NOT EXISTS idx_settings_public_id ON settings(public_id);

-- ============================================
-- STEP 9: Enable RLS and Create Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (simplified for now)
-- Patients policies
CREATE POLICY "Users can view patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Admins can manage patients" ON patients FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- Doctors policies
CREATE POLICY "Users can view doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Admins can manage doctors" ON doctors FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- Appointments policies
CREATE POLICY "Users can view appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Admins can manage appointments" ON appointments FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- Sessions policies
CREATE POLICY "Users can view sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Admins can manage sessions" ON sessions FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- Insurance claims policies
CREATE POLICY "Users can view insurance claims" ON insurance_claims FOR SELECT USING (true);
CREATE POLICY "Admins can manage insurance claims" ON insurance_claims FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- Chatbot policies
CREATE POLICY "Users can view published flows" ON chatbot_flows FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage flows" ON chatbot_flows FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view approved templates" ON chatbot_templates FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can manage templates" ON chatbot_templates FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- CRM policies
CREATE POLICY "Users can view their own leads" ON crm_leads FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all leads" ON crm_leads FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view their own deals" ON crm_deals FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all deals" ON crm_deals FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view their own activities" ON crm_activities FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all activities" ON crm_activities FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- System policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view messages sent to them" ON internal_messages FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "Users can view messages they sent" ON internal_messages FOR SELECT USING (sender_id = auth.uid());
CREATE POLICY "Admins can manage all messages" ON internal_messages FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view their own audit logs" ON audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all audit logs" ON audit_logs FOR SELECT USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view non-system roles" ON roles FOR SELECT USING (is_system = false);
CREATE POLICY "Admins can manage all roles" ON roles FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view their own role assignments" ON user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all role assignments" ON user_roles FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view public settings" ON settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage all settings" ON settings FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

-- ============================================
-- STEP 10: Create Audit Trigger Function
-- ============================================

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

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Log migration completion
INSERT INTO audit_logs (action, table_name, new_values) 
VALUES ('migration', 'complete_migration', '{"migration": "complete_database_setup", "status": "completed", "tables_created": 22}')
ON CONFLICT DO NOTHING;
