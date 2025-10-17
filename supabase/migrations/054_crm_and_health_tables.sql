-- ================================================================
-- 📊 CRM TABLES & HEALTH MODULES
-- ================================================================
-- Migration: Create tables for CRM, Progress Tracking, Training, etc.
-- Date: 2025-01-17

-- CRM Contacts Table
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'cnt_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(100),
  status VARCHAR(20) DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer', 'inactive')),
  source VARCHAR(50),
  notes TEXT,
  tags JSONB DEFAULT '[]',
  address JSONB,
  social_media JSONB,
  last_contact_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Leads Table
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'led_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  source VARCHAR(50),
  value DECIMAL(10, 2),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  notes TEXT,
  tags JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Deals Table
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'del_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  title VARCHAR(255) NOT NULL,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  contact_name VARCHAR(255),
  value DECIMAL(12, 2) NOT NULL,
  stage VARCHAR(30) DEFAULT 'prospecting' CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  notes TEXT,
  tags JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Activities Table
CREATE TABLE IF NOT EXISTS crm_contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'cac_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  activity_type VARCHAR(20) CHECK (activity_type IN ('call', 'email', 'meeting', 'note')),
  subject VARCHAR(255),
  description TEXT,
  activity_date TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Goals Table
CREATE TABLE IF NOT EXISTS progress_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'pgl_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  goal_title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Assessments Table
CREATE TABLE IF NOT EXISTS progress_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'pas_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  assessment_type VARCHAR(100),
  assessment_date DATE NOT NULL,
  score INTEGER,
  notes TEXT,
  assessor_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Reports Table
CREATE TABLE IF NOT EXISTS progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'prp_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  report_title VARCHAR(255) NOT NULL,
  report_date DATE NOT NULL,
  summary TEXT,
  details JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Programs Table
CREATE TABLE IF NOT EXISTS training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'trp_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  program_name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_weeks INTEGER,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  program_type VARCHAR(50),
  content JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Progress Table
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'tpr_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family Members Table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'fmb_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(50),
  phone VARCHAR(50),
  email VARCHAR(255),
  is_primary_contact BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Sessions Table
CREATE TABLE IF NOT EXISTS support_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'sps_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  session_title VARCHAR(255) NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME,
  duration_minutes INTEGER,
  session_type VARCHAR(50),
  facilitator_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'res_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  resource_title VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50) CHECK (resource_type IN ('document', 'video', 'article', 'guide', 'form', 'other')),
  description TEXT,
  url TEXT,
  file_path TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_source ON crm_contacts(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact_id ON crm_contact_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_progress_goals_patient_id ON progress_goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_progress_goals_status ON progress_goals(status);
CREATE INDEX IF NOT EXISTS idx_progress_assessments_patient_id ON progress_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_patient_id ON training_progress(patient_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_program_id ON training_progress(program_id);
CREATE INDEX IF NOT EXISTS idx_family_members_patient_id ON family_members(patient_id);
CREATE INDEX IF NOT EXISTS idx_support_sessions_patient_id ON support_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

-- Add comments
COMMENT ON TABLE crm_contacts IS 'CRM contacts and potential customers';
COMMENT ON TABLE crm_leads IS 'Sales leads tracking';
COMMENT ON TABLE crm_deals IS 'Sales deals and opportunities';
COMMENT ON TABLE progress_goals IS 'Patient therapy goals and objectives';
COMMENT ON TABLE training_programs IS 'Training and rehabilitation programs';
COMMENT ON TABLE family_members IS 'Patient family members and emergency contacts';
COMMENT ON TABLE support_sessions IS 'Family support and counseling sessions';
COMMENT ON TABLE resources IS 'Educational resources and materials';

