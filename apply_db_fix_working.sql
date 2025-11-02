-- ===================================================
-- Working Database Fix - Compatible with user_role enum
-- إصلاح قاعدة البيانات - متوافق مع enum user_role
-- ===================================================
-- 
-- user_role enum values: 'admin', 'manager', 'agent', 'demo', 'supervisor'
-- user_status enum values: 'active', 'inactive', etc.
--

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

-- Step 4: Fix password for existing admin@test.com (keep existing role)
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Step 5: Create test users with valid enum values
-- Using 'agent' role for doctor/patient/staff (you can change to 'supervisor' if needed)

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'doctor@test.com', crypt('Doctor123!', gen_salt('bf')), 'Test Doctor', 'agent'::user_role, 'active'::user_status, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'patient@test.com', crypt('Patient123!', gen_salt('bf')), 'Test Patient', 'agent'::user_role, 'active'::user_status, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'staff@test.com', crypt('Staff123!', gen_salt('bf')), 'Test Staff', 'agent'::user_role, 'active'::user_status, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@test.com');

-- Step 6: Update passwords for existing users
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
ORDER BY email;

-- Done! ✅
-- الآن جميع المستخدمين لديهم كلمات مرور
