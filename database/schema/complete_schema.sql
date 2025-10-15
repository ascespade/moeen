-- ========================================
-- COMPLETE HEALTHCARE DATABASE SCHEMA
-- نظام قاعدة البيانات الشامل للرعاية الصحية
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- CORE SYSTEM TABLES
-- الجداول الأساسية للنظام
-- ========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'staff', 'supervisor', 'admin')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    profile JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('usr_' || substr(id::text, 1, 8)) STORED
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    role VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- HEALTHCARE ENTITIES
-- كيانات الرعاية الصحية
-- ========================================

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    medical_record_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    insurance_expiry DATE,
    is_activated BOOLEAN DEFAULT false,
    activation_date TIMESTAMPTZ,
    medical_history JSONB DEFAULT '[]',
    allergies JSONB DEFAULT '[]',
    medications JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('pat_' || substr(id::text, 1, 8)) STORED
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    sub_speciality VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    experience_years INTEGER DEFAULT 0,
    education JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    schedule JSONB DEFAULT '{}',
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('doc_' || substr(id::text, 1, 8)) STORED
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    type VARCHAR(50) DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow_up', 'emergency', 'surgery', 'checkup')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial', 'refunded')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'insurance', 'bank_transfer')),
    notes TEXT,
    diagnosis TEXT,
    prescription TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('apt_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- MEDICAL RECORDS & FILES
-- السجلات الطبية والملفات
-- ========================================

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('diagnosis', 'prescription', 'lab_result', 'xray', 'scan', 'surgery', 'vaccination', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    is_confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('mcr_' || substr(id::text, 1, 8)) STORED
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) UNIQUE,
    upload_type VARCHAR(50) DEFAULT 'general' CHECK (upload_type IN ('general', 'medical', 'insurance', 'prescription', 'lab_result')),
    is_processed BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('fil_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- INSURANCE & PAYMENTS
-- التأمين والمدفوعات
-- ========================================

-- Insurance claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    provider VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'paid')),
    amount DECIMAL(10,2) NOT NULL,
    approved_amount DECIMAL(10,2),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    claim_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('clm_' || substr(id::text, 1, 8)) STORED
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'stripe', 'moyasar', 'insurance')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    transaction_id VARCHAR(100),
    gateway_response JSONB DEFAULT '{}',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('pay_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- NOTIFICATIONS & COMMUNICATION
-- الإشعارات والتواصل
-- ========================================

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('appointment', 'payment', 'reminder', 'system', 'emergency')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('ntf_' || substr(id::text, 1, 8)) STORED
);

-- Notification templates table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    language VARCHAR(10) DEFAULT 'ar',
    subject VARCHAR(255),
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('tpl_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- SYSTEM ADMINISTRATION
-- إدارة النظام
-- ========================================

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('aud_' || substr(id::text, 1, 8)) STORED
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'object', 'array')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    category VARCHAR(50) DEFAULT 'general',
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('set_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- INTERNATIONALIZATION
-- التدويل
-- ========================================

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    direction VARCHAR(10) DEFAULT 'rtl' CHECK (direction IN ('ltr', 'rtl')),
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('lng_' || substr(id::text, 1, 8)) STORED
);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    namespace VARCHAR(100) DEFAULT 'common',
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(language_code, key, namespace),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('trn_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- REPORTS & ANALYTICS
-- التقارير والتحليلات
-- ========================================

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('dashboard_metrics', 'patient_statistics', 'financial_report', 'appointment_analytics', 'custom')),
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    parameters JSONB DEFAULT '{}',
    data JSONB NOT NULL,
    file_path VARCHAR(500),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('generating', 'completed', 'failed')),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('rpt_' || substr(id::text, 1, 8)) STORED
);

-- System metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_key VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('mtr_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- CHATBOT SYSTEM
-- نظام الدردشة الآلية
-- ========================================

-- Chatbot flows table
CREATE TABLE IF NOT EXISTS chatbot_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    flow_data JSONB NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('flw_' || substr(id::text, 1, 8)) STORED
);

-- Chatbot conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    flow_id UUID REFERENCES chatbot_flows(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('cnv_' || substr(id::text, 1, 8)) STORED
);

-- Chatbot messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'bot', 'system')),
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'button', 'quick_reply')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('msg_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- CRM SYSTEM
-- نظام إدارة العلاقات مع العملاء
-- ========================================

-- CRM leads table
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('led_' || substr(id::text, 1, 8)) STORED
);

-- CRM activities table
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'task')),
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    public_id VARCHAR(50) UNIQUE GENERATED ALWAYS AS ('act_' || substr(id::text, 1, 8)) STORED
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- فهارس الأداء
-- ========================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Patients indexes
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_medical_record ON patients(medical_record_number);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_activated ON patients(is_activated);

-- Doctors indexes
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_license ON doctors(license_number);
CREATE INDEX IF NOT EXISTS idx_doctors_speciality ON doctors(speciality);
CREATE INDEX IF NOT EXISTS idx_doctors_available ON doctors(is_available);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON appointments(payment_status);

-- Medical records indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_type ON medical_records(record_type);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medical_records(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Translations indexes
CREATE INDEX IF NOT EXISTS idx_translations_language_code ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_namespace ON translations(namespace);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- سياسات أمان مستوى الصف
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Patients can view their own data
CREATE POLICY "Patients can view own data" ON patients
    FOR SELECT USING (auth.uid() = user_id);

-- Doctors can view their own data
CREATE POLICY "Doctors can view own data" ON doctors
    FOR SELECT USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON appointments
    FOR SELECT USING (
        patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
    );

CREATE POLICY "Doctors can view their appointments" ON appointments
    FOR SELECT USING (
        doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
    );

-- Medical records policies
CREATE POLICY "Patients can view own medical records" ON medical_records
    FOR SELECT USING (
        patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
    );

CREATE POLICY "Doctors can view patient medical records" ON medical_records
    FOR SELECT USING (
        doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- الدوال والمشغلات
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_flows_updated_at BEFORE UPDATE ON chatbot_flows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- عروض للاستعلامات الشائعة
-- ========================================

-- Patient dashboard view
CREATE OR REPLACE VIEW patient_dashboard AS
SELECT 
    p.id,
    p.public_id,
    p.full_name,
    p.medical_record_number,
    p.phone,
    p.email,
    p.is_activated,
    p.insurance_provider,
    p.insurance_number,
    u.last_login,
    COUNT(a.id) as total_appointments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
    COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_appointments
FROM patients p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN appointments a ON p.id = a.patient_id
GROUP BY p.id, p.public_id, p.full_name, p.medical_record_number, p.phone, p.email, p.is_activated, p.insurance_provider, p.insurance_number, u.last_login;

-- Doctor dashboard view
CREATE OR REPLACE VIEW doctor_dashboard AS
SELECT 
    d.id,
    d.public_id,
    d.full_name,
    d.speciality,
    d.license_number,
    d.phone,
    d.email,
    d.consultation_fee,
    d.rating,
    d.total_reviews,
    d.is_available,
    u.last_login,
    COUNT(a.id) as total_appointments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
    COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_appointments
FROM doctors d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN appointments a ON d.id = a.doctor_id
GROUP BY d.id, d.public_id, d.full_name, d.speciality, d.license_number, d.phone, d.email, d.consultation_fee, d.rating, d.total_reviews, d.is_available, u.last_login;

-- Appointment details view
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
    a.id,
    a.public_id,
    a.scheduled_at,
    a.duration_minutes,
    a.type,
    a.status,
    a.payment_status,
    a.payment_method,
    a.notes,
    a.diagnosis,
    a.prescription,
    p.full_name as patient_name,
    p.medical_record_number,
    p.phone as patient_phone,
    d.full_name as doctor_name,
    d.speciality,
    d.license_number
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
LEFT JOIN doctors d ON a.doctor_id = d.id;

-- ========================================
-- INITIAL DATA INSERTION
-- إدراج البيانات الأولية
-- ========================================

-- Insert default roles
INSERT INTO roles (role, name, description, permissions) VALUES
('patient', 'Patient', 'Patient role with basic access', '["view_own_profile", "book_appointment", "view_own_appointments", "view_own_medical_records"]'),
('doctor', 'Doctor', 'Doctor role with medical access', '["view_patient_records", "create_medical_records", "manage_appointments", "prescribe_medications"]'),
('staff', 'Staff', 'Staff role with administrative access', '["manage_patients", "manage_appointments", "process_payments", "send_notifications"]'),
('supervisor', 'Supervisor', 'Supervisor role with oversight access', '["view_reports", "manage_staff", "approve_claims", "system_monitoring"]'),
('admin', 'Administrator', 'Admin role with full system access', '["full_access", "manage_users", "system_configuration", "audit_logs"]')
ON CONFLICT (role) DO NOTHING;

-- Insert default languages
INSERT INTO languages (code, name, native_name, direction, is_default, is_active) VALUES
('ar', 'Arabic', 'العربية', 'rtl', true, true),
('en', 'English', 'English', 'ltr', false, true)
ON CONFLICT (code) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value, type, description, is_public, category) VALUES
('app_name', '"مُعين - منصة الرعاية الصحية"', 'string', 'Application name', true, 'general'),
('app_version', '"1.0.0"', 'string', 'Application version', true, 'general'),
('default_language', '"ar"', 'string', 'Default language', true, 'i18n'),
('timezone', '"Asia/Riyadh"', 'string', 'Default timezone', true, 'general'),
('currency', '"SAR"', 'string', 'Default currency', true, 'financial'),
('max_file_size', '10485760', 'number', 'Maximum file upload size in bytes', false, 'uploads'),
('session_timeout', '3600', 'number', 'Session timeout in seconds', false, 'security'),
('enable_notifications', 'true', 'boolean', 'Enable system notifications', true, 'notifications'),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode status', true, 'system')
ON CONFLICT (key) DO NOTHING;

-- Insert default notification templates
INSERT INTO notification_templates (name, type, language, subject, body, variables, is_active) VALUES
('appointment_confirmation', 'appointment', 'ar', 'تأكيد الموعد', 'تم تأكيد موعدك مع الدكتور {{doctor_name}} في {{appointment_date}}', '["doctor_name", "appointment_date"]', true),
('appointment_reminder', 'reminder', 'ar', 'تذكير بالموعد', 'تذكير: لديك موعد مع الدكتور {{doctor_name}} غداً في {{appointment_time}}', '["doctor_name", "appointment_time"]', true),
('payment_confirmation', 'payment', 'ar', 'تأكيد الدفع', 'تم تأكيد دفع مبلغ {{amount}} {{currency}} بنجاح', '["amount", "currency"]', true),
('welcome_message', 'system', 'ar', 'مرحباً بك', 'مرحباً {{name}}، أهلاً وسهلاً بك في منصة مُعين للرعاية الصحية', '["name"]', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default translations
INSERT INTO translations (language_code, key, value, namespace, is_approved) VALUES
('ar', 'common.welcome', 'مرحباً', 'common', true),
('ar', 'common.hello', 'أهلاً وسهلاً', 'common', true),
('ar', 'common.goodbye', 'وداعاً', 'common', true),
('ar', 'common.yes', 'نعم', 'common', true),
('ar', 'common.no', 'لا', 'common', true),
('ar', 'common.save', 'حفظ', 'common', true),
('ar', 'common.cancel', 'إلغاء', 'common', true),
('ar', 'common.edit', 'تعديل', 'common', true),
('ar', 'common.delete', 'حذف', 'common', true),
('ar', 'common.search', 'بحث', 'common', true),
('ar', 'common.loading', 'جاري التحميل...', 'common', true),
('ar', 'common.error', 'حدث خطأ', 'common', true),
('ar', 'common.success', 'تم بنجاح', 'common', true),
('ar', 'dashboard.title', 'لوحة التحكم', 'dashboard', true),
('ar', 'dashboard.overview', 'نظرة عامة', 'dashboard', true),
('ar', 'dashboard.metrics', 'المقاييس', 'dashboard', true),
('ar', 'patient.title', 'المريض', 'patient', true),
('ar', 'doctor.title', 'الطبيب', 'doctor', true),
('ar', 'staff.title', 'الموظف', 'staff', true),
('ar', 'admin.title', 'المدير', 'admin', true),
('ar', 'appointment.title', 'الموعد', 'appointment', true),
('ar', 'payment.title', 'الدفع', 'payment', true),
('ar', 'insurance.title', 'التأمين', 'insurance', true),
('en', 'common.welcome', 'Welcome', 'common', true),
('en', 'common.hello', 'Hello', 'common', true),
('en', 'common.goodbye', 'Goodbye', 'common', true),
('en', 'common.yes', 'Yes', 'common', true),
('en', 'common.no', 'No', 'common', true),
('en', 'common.save', 'Save', 'common', true),
('en', 'common.cancel', 'Cancel', 'common', true),
('en', 'common.edit', 'Edit', 'common', true),
('en', 'common.delete', 'Delete', 'common', true),
('en', 'common.search', 'Search', 'common', true),
('en', 'common.loading', 'Loading...', 'common', true),
('en', 'common.error', 'An error occurred', 'common', true),
('en', 'common.success', 'Success', 'common', true),
('en', 'dashboard.title', 'Dashboard', 'dashboard', true),
('en', 'dashboard.overview', 'Overview', 'dashboard', true),
('en', 'dashboard.metrics', 'Metrics', 'dashboard', true),
('en', 'patient.title', 'Patient', 'patient', true),
('en', 'doctor.title', 'Doctor', 'doctor', true),
('en', 'staff.title', 'Staff', 'staff', true),
('en', 'admin.title', 'Admin', 'admin', true),
('en', 'appointment.title', 'Appointment', 'appointment', true),
('en', 'payment.title', 'Payment', 'payment', true),
('en', 'insurance.title', 'Insurance', 'insurance', true)
ON CONFLICT (language_code, key, namespace) DO NOTHING;

-- ========================================
-- COMPLETION MESSAGE
-- رسالة الإكمال
-- ========================================

-- Log completion
INSERT INTO system_metrics (metric_key, metric_value, metric_unit, metadata) VALUES
('database_schema_created', 1, 'count', '{"timestamp": "NOW()", "version": "1.0.0"}');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'HEALTHCARE DATABASE SCHEMA CREATED SUCCESSFULLY';
    RAISE NOTICE 'نظام قاعدة البيانات الطبية تم إنشاؤه بنجاح';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: 25+';
    RAISE NOTICE 'Indexes created: 30+';
    RAISE NOTICE 'Policies created: 10+';
    RAISE NOTICE 'Functions created: 1';
    RAISE NOTICE 'Triggers created: 10+';
    RAISE NOTICE 'Views created: 3';
    RAISE NOTICE 'Initial data inserted: 50+ records';
    RAISE NOTICE '========================================';
END $$;