-- ===================================================
-- Test Password Verification
-- اختبار التحقق من كلمة المرور
-- ===================================================

-- Test 1: Check if verify_password function exists
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'verify_password';

-- Test 2: Test password verification for admin@test.com
SELECT 
  email,
  password_hash IS NOT NULL as has_password_hash,
  verify_password('Admin123!', password_hash) as password_correct
FROM users
WHERE email = 'admin@test.com';

-- Test 3: Test all test users
SELECT 
  email,
  name,
  role::text as role,
  password_hash IS NOT NULL as has_password_hash,
  CASE 
    WHEN email = 'admin@test.com' THEN verify_password('Admin123!', password_hash)
    WHEN email = 'doctor@test.com' THEN verify_password('Doctor123!', password_hash)
    WHEN email = 'patient@test.com' THEN verify_password('Patient123!', password_hash)
    WHEN email = 'staff@test.com' THEN verify_password('Staff123!', password_hash)
    ELSE NULL
  END as password_correct
FROM users
WHERE email IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com');

-- Test 4: Try to verify with wrong password (should return false)
SELECT 
  email,
  verify_password('WrongPassword123!', password_hash) as should_be_false
FROM users
WHERE email = 'admin@test.com';
