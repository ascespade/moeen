-- ===================================================
-- Final Database Fix - Using correct enum values
-- إصلاح قاعدة البيانات النهائي - باستخدام قيم enum الصحيحة
-- ===================================================

-- Step 1: Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Create verify_password function
CREATE OR REPLACE FUNCTION verify_password(
  password_input TEXT,
  password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated, anon, service_role;

-- Step 3: Create hash_password function
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

GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated, anon, service_role;

-- Step 4: Fix password for existing admin@test.com user
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Step 5: Create test users with valid enum role values
-- Note: user_role enum only allows: 'admin', 'manager', 'agent', 'demo', 'supervisor'
-- We'll use 'agent' for doctor/patient/staff for now, or you can add them as 'admin'/'supervisor'

-- Create doctor user as 'agent' role (or 'supervisor' if needed)
INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'doctor@test.com', crypt('Doctor123!', gen_salt('bf')), 'Test Doctor', 'agent'::user_role, 'active'::user_status, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@test.com');

-- Create patient user as 'agent' role
INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'patient@test.com', crypt('Patient123!', gen_salt('bf')), 'Test Patient', 'agent'::user_role, 'active'::user_status, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@test.com');

-- Create staff user as 'agent' role  
INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'staff@test.com', crypt('Staff123!', gen_salt('bf')), 'Test Staff', 'agent'::user_role, 'active'::user_status, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@test.com');

-- Step 6: Update passwords for existing users if they don't have one
UPDATE users
SET password_hash = crypt('Doctor123!', gen_salt('bf'))
WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Patient123!', gen_salt('bf'))
WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Staff123!', gen_salt('bf'))
WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Step 7: Verify results
SELECT 
  email,
  name,
  role::text as role,
  status::text as status,
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN '❌ No password'
    ELSE '✅ Has password'
  END as password_status
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role;

-- Done! ✅
-- جميع المستخدمين الآن لديهم كلمات مرور
