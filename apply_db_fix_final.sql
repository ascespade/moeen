-- ===================================================
-- Final Database Fix - Fixed for enum role type
-- إصلاح قاعدة البيانات النهائي - متوافق مع enum role
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

-- Step 4: Check available enum values first
-- Run this to see what role values are allowed:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_role'::regtype;

-- Step 5: Fix passwords for existing users (only update password_hash, don't change role)
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Try to update/create other users, but only if role enum allows it
-- First, check if we can cast the role value
DO $$
BEGIN
  -- Try to update/create doctor user
  BEGIN
    UPDATE users
    SET password_hash = crypt('Doctor123!', gen_salt('bf'))
    WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');
    
    -- If user doesn't exist, try to create (only if enum allows)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@test.com') THEN
      INSERT INTO users (email, password_hash, name, role, status, created_at)
      VALUES ('doctor@test.com', crypt('Doctor123!', gen_salt('bf')), 'Test Doctor', 'admin'::text::user_role, 'active', NOW());
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create/update doctor@test.com: %', SQLERRM;
  END;

  -- Try patient
  BEGIN
    UPDATE users
    SET password_hash = crypt('Patient123!', gen_salt('bf'))
    WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');
    
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@test.com') THEN
      INSERT INTO users (email, password_hash, name, role, status, created_at)
      VALUES ('patient@test.com', crypt('Patient123!', gen_salt('bf')), 'Test Patient', 'admin'::text::user_role, 'active', NOW());
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create/update patient@test.com: %', SQLERRM;
  END;

  -- Try staff
  BEGIN
    UPDATE users
    SET password_hash = crypt('Staff123!', gen_salt('bf'))
    WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');
    
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@test.com') THEN
      INSERT INTO users (email, password_hash, name, role, status, created_at)
      VALUES ('staff@test.com', crypt('Staff123!', gen_salt('bf')), 'Test Staff', 'admin'::text::user_role, 'active', NOW());
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create/update staff@test.com: %', SQLERRM;
  END;
END $$;

-- Step 6: Verify results
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
