-- Complete Healthcare Management System Schema
-- This migration creates all necessary tables for the healthcare system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create audit_logs table first (referenced by other migrations)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'aud_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('audit_logs_id_seq')::TEXT, 6, '0'),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'usr_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('users_id_seq')::TEXT, 6, '0'),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    phone VARCHAR(20),
    avatar_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'pat_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('patients_id_seq')::TEXT, 6, '0'),
    customer_id VARCHAR(100) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'doc_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('doctors_id_seq')::TEXT, 6, '0'),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    consultation_fee DECIMAL(10,2),
    available_days JSONB,
    available_hours JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'apt_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('appointments_id_seq')::TEXT, 6, '0'),
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    diagnosis TEXT,
    prescription TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'ses_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('sessions_id_seq')::TEXT, 6, '0'),
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration INTEGER DEFAULT 60,
    session_type VARCHAR(50),
    notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insurance_claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE DEFAULT 'clm_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('insurance_claims_id_seq')::TEXT, 6, '0'),
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
    claim_number VARCHAR(100) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_date DATE,
    processed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    channel VARCHAR(50) DEFAULT 'web',
    status VARCHAR(20) DEFAULT 'active',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    subject VARCHAR(255),
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sender_type VARCHAR(20) DEFAULT 'user',
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    message_status VARCHAR(20) DEFAULT 'sent',
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id SERIAL PRIMARY KEY,
    whatsapp_number VARCHAR(20),
    conversation_state VARCHAR(50) DEFAULT 'initial',
    current_intent VARCHAR(100),
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot_messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    intent VARCHAR(100),
    confidence DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot_intents table
CREATE TABLE IF NOT EXISTS chatbot_intents (
    id SERIAL PRIMARY KEY,
    intent_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    training_phrases TEXT[],
    responses TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crm_leads table
CREATE TABLE IF NOT EXISTS crm_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    value DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crm_deals table
CREATE TABLE IF NOT EXISTS crm_deals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lead_id INTEGER REFERENCES crm_leads(id) ON DELETE CASCADE,
    stage VARCHAR(50) DEFAULT 'prospecting',
    value DECIMAL(12,2),
    probability INTEGER DEFAULT 0,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    close_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crm_activities table
CREATE TABLE IF NOT EXISTS crm_activities (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    related_to VARCHAR(50),
    related_id INTEGER,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL,
    value TEXT NOT NULL,
    context VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(key, language)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_patients_customer_id ON patients(customer_id);
CREATE INDEX IF NOT EXISTS idx_patients_public_id ON patients(public_id);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_conversations_status_assigned ON conversations(status, assigned_to);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_whatsapp ON chatbot_conversations(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_state ON chatbot_conversations(conversation_state);
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner ON crm_leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner ON crm_deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'patients', 'doctors', 'appointments', 'sessions', 
                         'chatbot_conversations', 'conversations', 'crm_leads', 
                         'crm_deals', 'crm_activities', 'settings', 'translations')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                        BEFORE UPDATE ON %I 
                        FOR EACH ROW 
                        EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- Insert initial audit log entry
INSERT INTO audit_logs (action, table_name, new_values) 
VALUES ('migration', 'complete_schema', '{"migration": "create_complete_schema", "status": "completed", "tables_created": 15}')
ON CONFLICT DO NOTHING;

SELECT 'Complete healthcare schema created successfully' as result;
