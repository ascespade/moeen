-- ===================================================
-- Fix Existing Users - Set Passwords for Test Users
-- ===================================================
-- This script sets passwords for existing users who don't have password_hash

-- First, ensure hash_password function exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

-- Update test users with passwords if they don't have password_hash
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

-- Verify updates
SELECT 
  email,
  name,
  role,
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN '❌ No password'
    ELSE '✅ Has password'
  END as password_status
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role;
