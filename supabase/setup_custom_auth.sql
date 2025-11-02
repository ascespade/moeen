-- ===================================================
-- Setup Custom Authentication System
-- إعداد نظام المصادقة المخصص
-- ===================================================
-- This script creates the verify_password function and test users
-- يجب تشغيل هذا السكريبت في Supabase SQL Editor

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===================================================
-- Step 1: Create verify_password function
-- ===================================================
CREATE OR REPLACE FUNCTION verify_password(
  password_input TEXT,
  password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Compare the input password with the stored hash using crypt
  -- crypt(password_input, password_hash) will generate the same hash
  -- if the password matches
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error (e.g., invalid hash format), return false
    RETURN FALSE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO service_role;

-- ===================================================
-- Step 2: Create hash_password function (if needed)
-- ===================================================
CREATE OR REPLACE FUNCTION hash_password(
  password_input TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, gen_salt('bf'));
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO service_role;

-- ===================================================
-- Step 3: Create test users (UPSERT with password)
-- ===================================================
-- Ensure roles exist first
INSERT INTO roles (role, description) VALUES
  ('admin', 'System administrator with full access'),
  ('doctor', 'Medical professional with patient access'),
  ('patient', 'Patient with personal data access'),
  ('staff', 'Staff member with administrative access'),
  ('supervisor', 'Supervisor with limited administrative access'),
  ('manager', 'Manager with comprehensive administrative access')
ON CONFLICT (role) DO NOTHING;

-- Create/Update test admin user with password
INSERT INTO users (email, password_hash, name, role, status, created_at)
VALUES (
  'admin@test.com',
  crypt('Admin123!', gen_salt('bf')),
  'Test Admin',
  'admin',
  'active',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = COALESCE(EXCLUDED.password_hash, crypt('Admin123!', gen_salt('bf'))),
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  name = COALESCE(EXCLUDED.name, users.name);

-- Update existing admin user if password_hash is NULL
UPDATE users 
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Create/Update test doctor user with password
INSERT INTO users (email, password_hash, name, role, status, created_at)
VALUES (
  'doctor@test.com',
  crypt('Doctor123!', gen_salt('bf')),
  'Test Doctor',
  'doctor',
  'active',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = COALESCE(EXCLUDED.password_hash, crypt('Doctor123!', gen_salt('bf'))),
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  name = COALESCE(EXCLUDED.name, users.name);

-- Update existing doctor user if password_hash is NULL
UPDATE users 
SET password_hash = crypt('Doctor123!', gen_salt('bf'))
WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Create/Update test patient user with password
INSERT INTO users (email, password_hash, name, role, status, created_at)
VALUES (
  'patient@test.com',
  crypt('Patient123!', gen_salt('bf')),
  'Test Patient',
  'patient',
  'active',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = COALESCE(EXCLUDED.password_hash, crypt('Patient123!', gen_salt('bf'))),
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  name = COALESCE(EXCLUDED.name, users.name);

-- Update existing patient user if password_hash is NULL
UPDATE users 
SET password_hash = crypt('Patient123!', gen_salt('bf'))
WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Create/Update test staff user with password
INSERT INTO users (email, password_hash, name, role, status, created_at)
VALUES (
  'staff@test.com',
  crypt('Staff123!', gen_salt('bf')),
  'Test Staff',
  'staff',
  'active',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = COALESCE(EXCLUDED.password_hash, crypt('Staff123!', gen_salt('bf'))),
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  name = COALESCE(EXCLUDED.name, users.name);

-- Update existing staff user if password_hash is NULL
UPDATE users 
SET password_hash = crypt('Staff123!', gen_salt('bf'))
WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');

-- ===================================================
-- Step 4: Verify setup
-- ===================================================
-- Check if function was created
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'verify_password'
  AND routine_schema = 'public';

-- Check test users
SELECT 
  id,
  email,
  name,
  role,
  status,
  created_at
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role;

-- ===================================================
-- Done! Test users are ready:
-- - admin@test.com / Admin123!
-- - doctor@test.com / Doctor123!
-- - patient@test.com / Patient123!
-- - staff@test.com / Staff123!
-- ===================================================
