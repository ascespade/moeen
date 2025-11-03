-- ===================================================
-- Fixed Database Fix - Compatible with actual schema
-- إصلاح قاعدة البيانات - متوافق مع البنية الفعلية
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

GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO service_role;

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

GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO service_role;

-- Step 4: Fix passwords for test users (UPDATE existing users)
-- This will work regardless of roles table structure
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Doctor123!', gen_salt('bf'))
WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Patient123!', gen_salt('bf'))
WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Staff123!', gen_salt('bf'))
WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Step 5: Create users if they don't exist
-- Using UPSERT that works with existing structure
INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'admin@test.com', crypt('Admin123!', gen_salt('bf')), 'Test Admin', 'admin', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'doctor@test.com', crypt('Doctor123!', gen_salt('bf')), 'Test Doctor', 'doctor', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'patient@test.com', crypt('Patient123!', gen_salt('bf')), 'Test Patient', 'patient', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'staff@test.com', crypt('Staff123!', gen_salt('bf')), 'Test Staff', 'staff', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@test.com');

-- Step 6: If users already exist but don't have passwords, update them
-- This handles the case where user exists but password_hash is NULL or empty
UPDATE users
SET 
  password_hash = COALESCE(
    NULLIF(password_hash, ''),
    crypt('Admin123!', gen_salt('bf'))
  ),
  name = COALESCE(name, 'Test Admin'),
  role = COALESCE(role, 'admin'),
  status = COALESCE(status, 'active')
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET 
  password_hash = COALESCE(
    NULLIF(password_hash, ''),
    crypt('Doctor123!', gen_salt('bf'))
  ),
  name = COALESCE(name, 'Test Doctor'),
  role = COALESCE(role, 'doctor'),
  status = COALESCE(status, 'active')
WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET 
  password_hash = COALESCE(
    NULLIF(password_hash, ''),
    crypt('Patient123!', gen_salt('bf'))
  ),
  name = COALESCE(name, 'Test Patient'),
  role = COALESCE(role, 'patient'),
  status = COALESCE(status, 'active')
WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET 
  password_hash = COALESCE(
    NULLIF(password_hash, ''),
    crypt('Staff123!', gen_salt('bf'))
  ),
  name = COALESCE(name, 'Test Staff'),
  role = COALESCE(role, 'staff'),
  status = COALESCE(status, 'active')
WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Step 7: Verify results
SELECT 
  email,
  name,
  role,
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN '❌ No password'
    ELSE '✅ Has password'
  END as password_status,
  status
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role;

-- Done! ✅
-- الآن جميع المستخدمين لديهم كلمات مرور
