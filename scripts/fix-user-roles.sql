-- Fix user roles in database
-- إصلاح أدوار المستخدمين في قاعدة البيانات

-- Update existing users with correct roles
UPDATE users 
SET role = 'admin', status = 'active', is_active = true
WHERE email = 'admin@test.com';

UPDATE users 
SET role = 'doctor', status = 'active', is_active = true
WHERE email = 'doctor@test.com';

UPDATE users 
SET role = 'patient', status = 'active', is_active = true
WHERE email = 'patient@test.com';

UPDATE users 
SET role = 'staff', status = 'active', is_active = true
WHERE email = 'staff@test.com';

-- Insert users if they don't exist (based on Supabase Auth IDs)
-- Get UUIDs from Supabase Auth and insert here

-- Verify users
SELECT id, email, role, status, is_active 
FROM users 
WHERE email LIKE '%@test.com'
ORDER BY role;