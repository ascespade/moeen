-- ===================================================
-- TEST USERS FOR AUTHENTICATION TESTING
-- ===================================================
-- 
-- These users are for development/testing only
-- REMOVE BEFORE PRODUCTION DEPLOYMENT!
--
-- Created: 2025-01-XX
-- Purpose: Quick login testing for all user roles
-- ===================================================

-- Ensure roles exist
INSERT INTO roles (role, description) VALUES
  ('admin', 'System administrator with full access'),
  ('doctor', 'Medical professional with patient access'),
  ('patient', 'Patient with personal data access'),
  ('staff', 'Staff member with administrative access')
ON CONFLICT (role) DO NOTHING;

-- Create test users
-- Note: These use Supabase Auth, so passwords need to be set via Supabase Auth API
-- For testing purposes, you'll need to create these users via:
-- 1. Supabase Dashboard > Authentication > Users > Add User
-- 2. Or via API: POST /auth/v1/admin/users

-- Test user data structure (to be created via Supabase Auth)
-- 
-- Admin Test User:
-- Email: admin@test.com
-- Password: Admin123!
-- Role: admin
--
-- Doctor Test User:
-- Email: doctor@test.com
-- Password: Doctor123!
-- Role: doctor
--
-- Patient Test User:
-- Email: patient@test.com
-- Password: Patient123!
-- Role: patient
--
-- Staff Test User:
-- Email: staff@test.com
-- Password: Staff123!
-- Role: staff

-- If users table exists and you're using password_hash directly:
-- Note: This assumes bcrypt password hashing
-- You'll need to generate hashes for: Admin123!, Doctor123!, Patient123!, Staff123!

-- Create users table entries (if using custom auth with password_hash)
DO $$
DECLARE
  admin_id INTEGER;
  doctor_id INTEGER;
  patient_id INTEGER;
  staff_id INTEGER;
BEGIN
  -- Check if users already exist
  SELECT id INTO admin_id FROM users WHERE email = 'admin@test.com';
  SELECT id INTO doctor_id FROM users WHERE email = 'doctor@test.com';
  SELECT id INTO patient_id FROM users WHERE email = 'patient@test.com';
  SELECT id INTO staff_id FROM users WHERE email = 'staff@test.com';

  -- Insert admin user if not exists
  IF admin_id IS NULL THEN
    INSERT INTO users (email, role, status, name, created_at)
    VALUES ('admin@test.com', 'admin', 'active', 'Test Admin', NOW())
    RETURNING id INTO admin_id;
  END IF;

  -- Insert doctor user if not exists
  IF doctor_id IS NULL THEN
    INSERT INTO users (email, role, status, name, created_at)
    VALUES ('doctor@test.com', 'doctor', 'active', 'Test Doctor', NOW())
    RETURNING id INTO doctor_id;
  END IF;

  -- Insert patient user if not exists
  IF patient_id IS NULL THEN
    INSERT INTO users (email, role, status, name, created_at)
    VALUES ('patient@test.com', 'patient', 'active', 'Test Patient', NOW())
    RETURNING id INTO patient_id;
  END IF;

  -- Insert staff user if not exists
  IF staff_id IS NULL THEN
    INSERT INTO users (email, role, status, name, created_at)
    VALUES ('staff@test.com', 'staff', 'active', 'Test Staff', NOW())
    RETURNING id INTO staff_id;
  END IF;

  RAISE NOTICE 'Test users created successfully';
  RAISE NOTICE 'Admin ID: %, Doctor ID: %, Patient ID: %, Staff ID: %', 
    admin_id, doctor_id, patient_id, staff_id;
END $$;

-- Display created users
SELECT 
  u.id,
  u.email,
  u.role,
  u.status,
  u.name,
  r.description as role_description
FROM users u
LEFT JOIN roles r ON u.role = r.role
WHERE u.email LIKE '%@test.com'
ORDER BY u.role;

-- ===================================================
-- IMPORTANT NOTES:
-- ===================================================
-- 
-- 1. If using Supabase Auth (recommended):
--    - Create users via Supabase Dashboard or Admin API
--    - Set passwords: Admin123!, Doctor123!, Patient123!, Staff123!
--    - Link Supabase Auth users to users table via email
--
-- 2. If using custom password_hash:
--    - Generate bcrypt hashes for passwords
--    - Update password_hash column for each user
--
-- 3. These are TEST users only
--    - Delete before production deployment
--    - Use strong, unique passwords in production
--
-- ===================================================