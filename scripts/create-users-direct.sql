-- Direct SQL to create/update test users in database
-- Run this in Supabase SQL Editor

-- First, ensure roles exist
INSERT INTO roles (role, description) VALUES
  ('admin', 'مدير النظام - صلاحيات كاملة على جميع الوحدات'),
  ('doctor', 'طبيب/معالج - إدارة المرضى والجلسات'),
  ('patient', 'مريض - الوصول إلى البيانات الخاصة'),
  ('staff', 'موظف - صلاحيات أساسية للعمليات اليومية')
ON CONFLICT (role) DO NOTHING;

-- Create/update users based on Supabase Auth UUIDs
-- Admin user (UUID from script output: 7d56b41f-e8d0-4aa9-a135-583b241f1778)
INSERT INTO users (email, name, role, status, is_active, created_at)
VALUES ('admin@test.com', 'Test Admin', 'admin', 'active', true, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active;

-- Doctor user (UUID: 6900370b-0424-40b8-81b4-8c3f5ea3a2c0)
INSERT INTO users (email, name, role, status, is_active, created_at)
VALUES ('doctor@test.com', 'Test Doctor', 'doctor', 'active', true, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active;

-- Patient user (UUID: 5d772a20-99c8-4dca-9c83-105efd34caa5)
INSERT INTO users (email, name, role, status, is_active, created_at)
VALUES ('patient@test.com', 'Test Patient', 'patient', 'active', true, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active;

-- Staff user (UUID: c347adfb-686a-4dd3-974a-b87e66757a43)
INSERT INTO users (email, name, role, status, is_active, created_at)
VALUES ('staff@test.com', 'Test Staff', 'staff', 'active', true, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active;

-- Verify users were created
SELECT id, email, name, role, status, is_active 
FROM users 
WHERE email LIKE '%@test.com'
ORDER BY role;