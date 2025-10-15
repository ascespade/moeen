-- Migration: Create Roles and Users System
-- Date: 2025-10-15
-- Description: Creates roles, users, and role-based access control tables

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  role TEXT PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (role, description) VALUES 
('patient', 'Patient role with access to personal dashboard and appointments'),
('doctor', 'Doctor role with access to patient files and medical records'),
('staff', 'Staff role with access to patient registration and basic operations'),
('supervisor', 'Supervisor role with access to staff management and reports'),
('admin', 'Admin role with full system access')
ON CONFLICT (role) DO NOTHING;

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT REFERENCES roles(role) DEFAULT 'patient',
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Add comments
COMMENT ON TABLE roles IS 'System roles for role-based access control';
COMMENT ON TABLE users IS 'User accounts with role-based permissions';
COMMENT ON COLUMN users.role IS 'User role determining access permissions';
COMMENT ON COLUMN users.meta IS 'Additional user metadata and preferences';
