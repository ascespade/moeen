-- Complete Database Migration Script (FINAL CORRECTED)
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
  duration INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'scheduled',
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
  duration INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'scheduled',
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
  status VARCHAR(50) DEFAULT 'pending',
  submitted_date DATE,
  processed_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STEP 2: Add public_id columns to core tables
-- ============================================

ALTER TABLE patients ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;
ALTER TABLE insurance_claims ADD COLUMN IF NOT EXISTS public_id VARCHAR(255) UNIQUE;

-- ============================================
-- STEP 3: Create User Preferences Table
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'ar',
  timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  notifications_enabled BOOLEAN DEFAULT true,
  sidebar_collapsed BOOLEAN DEFAULT false,
  dashboard_layout JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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

-- ============================================
-- STEP 5: Create Chatbot System Tables
-- ============================================

CREATE TABLE IF NOT EXISTS chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  node_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  condition JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  language VARCHAR(10) DEFAULT 'ar',
  content TEXT NOT NULL,
  variables JSONB,
  is_approved BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'inactive',
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  last_health_check TIMESTAMP,
  health_status VARCHAR(50) DEFAULT 'unknown',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  integration_id UUID REFERENCES chatbot_integrations(id),
  patient_id UUID REFERENCES patients(id),
  external_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  channel VARCHAR(50) NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  metadata JSONB,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- ============================================
-- STEP 6: Create CRM System Tables
-- ============================================

CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  notes TEXT,
  owner_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  stage VARCHAR(50) DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  owner_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES patients(id),
  lead_id UUID REFERENCES crm_leads(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TIME,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
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

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STEP 8: Enable RLS on all tables
-- ============================================

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
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

-- ============================================
-- STEP 9: Create Basic RLS Policies
-- ============================================

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Translations policies
CREATE POLICY "Anyone can read translations" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage translations" ON translations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Basic policies for all other tables (simplified)
CREATE POLICY "Users can view patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Admins can manage patients" ON patients FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Admins can manage doctors" ON doctors FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Admins can manage appointments" ON appointments FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Admins can manage sessions" ON sessions FOR ALL USING (EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
));

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
-- MIGRATION COMPLETE
-- ============================================

-- Log migration completion
INSERT INTO audit_logs (action, table_name, new_values) 
VALUES ('migration', 'complete_migration', '{"migration": "complete_database_setup", "status": "completed", "tables_created": 22}')
ON CONFLICT DO NOTHING;
