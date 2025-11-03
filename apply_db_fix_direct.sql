-- ===================================================
-- Direct Database Fix - Apply This in Supabase SQL Editor
-- إصلاح قاعدة البيانات مباشرة - شغّل هذا في Supabase SQL Editor
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

-- Step 4: Skip roles table (it has different structure)
-- Note: The roles table has a different structure (id, name, display_name, etc.)
-- Users table uses role as a text field directly, so we don't need to modify roles table

-- Step 5: Fix passwords for test users (UPDATE existing users)
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

-- Step 6: Create users if they don't exist
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
  password_hash = COALESCE(NULLIF(users.password_hash, ''), crypt('Admin123!', gen_salt('bf'))),
  name = COALESCE(users.name, 'Test Admin'),
  role = COALESCE(users.role, 'admin'),
  status = COALESCE(users.status, 'active');

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
  password_hash = COALESCE(NULLIF(users.password_hash, ''), crypt('Doctor123!', gen_salt('bf'))),
  name = COALESCE(users.name, 'Test Doctor'),
  role = COALESCE(users.role, 'doctor'),
  status = COALESCE(users.status, 'active');

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
  password_hash = COALESCE(NULLIF(users.password_hash, ''), crypt('Patient123!', gen_salt('bf'))),
  name = COALESCE(users.name, 'Test Patient'),
  role = COALESCE(users.role, 'patient'),
  status = COALESCE(users.status, 'active');

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
  password_hash = COALESCE(NULLIF(users.password_hash, ''), crypt('Staff123!', gen_salt('bf'))),
  name = COALESCE(users.name, 'Test Staff'),
  role = COALESCE(users.role, 'staff'),
  status = COALESCE(users.status, 'active');

-- Step 7: Verify
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
