-- ===================================================
-- Simple Fix - Only fix password for admin@test.com
-- إصلاح بسيط - فقط إصلاح كلمة مرور admin@test.com
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

-- Step 4: Fix password for existing admin user (keep existing role)
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Step 5: Verify
SELECT 
  email,
  name,
  role,
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN '❌ No password'
    ELSE '✅ Has password'
  END as password_status
FROM users
WHERE email = 'admin@test.com';

-- Done! ✅
-- الآن admin@test.com لديه كلمة مرور
