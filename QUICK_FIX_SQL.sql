-- ===================================================
-- QUICK FIX - شغّل هذا مباشرة في Supabase SQL Editor
-- ===================================================

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create functions
CREATE OR REPLACE FUNCTION verify_password(password_input TEXT, password_hash TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION hash_password(password_input TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN crypt(password_input, gen_salt('bf'));
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated, anon, service_role;

-- Fix passwords for existing users
UPDATE users SET password_hash = crypt('Admin123!', gen_salt('bf')) WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');
UPDATE users SET password_hash = crypt('Doctor123!', gen_salt('bf')) WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');
UPDATE users SET password_hash = crypt('Patient123!', gen_salt('bf')) WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');
UPDATE users SET password_hash = crypt('Staff123!', gen_salt('bf')) WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Create missing users
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

-- Verify
SELECT email, name, role, 
  CASE WHEN password_hash IS NULL OR password_hash = '' THEN '❌' ELSE '✅' END as has_password
FROM users WHERE email LIKE '%@test.com' ORDER BY role;
