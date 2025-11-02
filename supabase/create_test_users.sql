-- ===================================================
-- TEST USERS CREATION SCRIPT
-- Moeen Healthcare Management System
-- ===================================================
--
-- This script creates test users for all roles
-- IMPORTANT: Delete these users before production deployment
--
-- Test Users Created:
-- - admin@test.com / Admin123!
-- - doctor@test.com / Doctor123!
-- - patient@test.com / Patient123!
-- - staff@test.com / Staff123!
-- ===================================================

-- Ensure roles exist
INSERT INTO roles (role, description) VALUES
  ('admin', 'System administrator with full access'),
  ('doctor', 'Medical professional with patient access'),
  ('patient', 'Patient with personal data access'),
  ('staff', 'Staff member with administrative access'),
  ('supervisor', 'Supervisor with limited administrative access'),
  ('manager', 'Manager with comprehensive administrative access')
ON CONFLICT (role) DO NOTHING;

-- Create test users
-- Note: These users will be created in Supabase Auth first, then linked to users table
-- You'll need to:
-- 1. Create users in Supabase Dashboard > Authentication > Users
-- 2. Or use Supabase Management API to create users with passwords
-- 3. Then link them to the users table using their auth.uid

-- Example: After creating users in Supabase Auth, insert into users table:
-- 
-- INSERT INTO users (id, email, name, role, status, created_at) VALUES
--   (
--     'uuid-from-supabase-auth',  -- Replace with actual auth.uid
--     'admin@test.com',
--     'Test Admin',
--     'admin',
--     'active',
--     NOW()
--   ),
--   (
--     'uuid-from-supabase-auth',
--     'doctor@test.com',
--     'Test Doctor',
--     'doctor',
--     'active',
--     NOW()
--   ),
--   (
--     'uuid-from-supabase-auth',
--     'patient@test.com',
--     'Test Patient',
--     'patient',
--     'active',
--     NOW()
--   ),
--   (
--     'uuid-from-supabase-auth',
--     'staff@test.com',
--     'Test Staff',
--     'staff',
--     'active',
--     NOW()
--   )
-- ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;

-- Alternative: If using password_hash column instead of Supabase Auth
-- Use pgcrypto extension to hash passwords
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create test users with hashed passwords (if not using Supabase Auth)
-- ⚠️ WARNING: Only use this if you're using custom auth, not Supabase Auth
-- DO NOT USE if you're using Supabase's built-in authentication

/*
INSERT INTO users (email, password_hash, name, role, status, created_at) VALUES
  (
    'admin@test.com',
    crypt('Admin123!', gen_salt('bf')),
    'Test Admin',
    'admin',
    'active',
    NOW()
  ),
  (
    'doctor@test.com',
    crypt('Doctor123!', gen_salt('bf')),
    'Test Doctor',
    'doctor',
    'active',
    NOW()
  ),
  (
    'patient@test.com',
    crypt('Patient123!', gen_salt('bf')),
    'Test Patient',
    'patient',
    'active',
    NOW()
  ),
  (
    'staff@test.com',
    crypt('Staff123!', gen_salt('bf')),
    'Test Staff',
    'staff',
    'active',
    NOW()
  )
ON CONFLICT (email) DO UPDATE SET 
  role = EXCLUDED.role, 
  status = EXCLUDED.status,
  password_hash = EXCLUDED.password_hash;
*/

-- Verify test users (after creation)
-- SELECT 
--   u.email,
--   u.name,
--   u.role,
--   u.status,
--   r.description as role_description
-- FROM users u
-- LEFT JOIN roles r ON u.role = r.role
-- WHERE u.email LIKE '%@test.com'
-- ORDER BY u.role;

-- ===================================================
-- MANUAL INSTRUCTIONS FOR SUPABASE AUTH USERS:
-- ===================================================
--
-- Since Supabase Auth handles user creation, you need to:
--
-- Option 1: Use Supabase Dashboard
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" > "Create new user"
-- 3. Enter email: admin@test.com, password: Admin123!
-- 4. Repeat for doctor@test.com, patient@test.com, staff@test.com
-- 5. Then run the INSERT statements above with the auth.uid values
--
-- Option 2: Use Supabase Management API
-- POST https://[PROJECT_REF].supabase.co/auth/v1/admin/users
-- Headers: { "Authorization": "Bearer [SERVICE_ROLE_KEY]" }
-- Body: { "email": "admin@test.com", "password": "Admin123!", "email_confirm": true }
--
-- Option 3: Use Supabase CLI
-- supabase auth users create admin@test.com --password Admin123! --email-confirm
-- supabase auth users create doctor@test.com --password Doctor123! --email-confirm
-- supabase auth users create patient@test.com --password Patient123! --email-confirm
-- supabase auth users create staff@test.com --password Staff123! --email-confirm
--
-- After creating users in Auth, link them to users table:
--
-- INSERT INTO users (id, email, name, role, status, created_at)
-- SELECT 
--   au.id,
--   au.email,
--   CASE 
--     WHEN au.email = 'admin@test.com' THEN 'Test Admin'
--     WHEN au.email = 'doctor@test.com' THEN 'Test Doctor'
--     WHEN au.email = 'patient@test.com' THEN 'Test Patient'
--     WHEN au.email = 'staff@test.com' THEN 'Test Staff'
--   END as name,
--   CASE 
--     WHEN au.email = 'admin@test.com' THEN 'admin'
--     WHEN au.email = 'doctor@test.com' THEN 'doctor'
--     WHEN au.email = 'patient@test.com' THEN 'patient'
--     WHEN au.email = 'staff@test.com' THEN 'staff'
--   END as role,
--   'active' as status,
--   NOW() as created_at
-- FROM auth.users au
-- WHERE au.email IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com')
-- ON CONFLICT (id) DO UPDATE SET
--   email = EXCLUDED.email,
--   name = EXCLUDED.name,
--   role = EXCLUDED.role,
--   status = EXCLUDED.status;
--
-- ===================================================
