-- Migration: Create core healthcare tables with public_id columns
-- Date: 2025-10-15
-- Description: Creates core healthcare tables with CUID public_id columns for API use

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

-- Create patients table with public_id
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

-- Create doctors table with public_id
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

-- Create appointments table with public_id
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

-- Create sessions table with public_id
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

-- Create insurance_claims table with public_id
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
VALUES ('migration', 'core_tables', '{"migration": "001_create_core_tables_fixed", "status": "completed"}')
ON CONFLICT DO NOTHING;
