-- ===================================================
-- Fix All Users Without Passwords
-- إصلاح جميع المستخدمين بدون كلمات مرور
-- ===================================================

-- This script will set default passwords for all users without passwords
-- كلمة المرور الافتراضية: "Password123!"

-- Fix all users with NULL or empty password_hash
UPDATE users
SET password_hash = crypt('Password123!', gen_salt('bf'))
WHERE (password_hash IS NULL OR password_hash = '')
  AND email LIKE '%@test.com';

-- Verify results
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
ORDER BY 
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN 0
    ELSE 1
  END,
  email;

-- Done! ✅
-- الآن جميع المستخدمين لديهم كلمات مرور: Password123!
