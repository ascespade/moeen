-- ===================================================
-- Cleanup Test Users (Optional)
-- تنظيف المستخدمين التجريبيين (اختياري)
-- ===================================================
-- 
-- ⚠️ WARNING: This will DELETE test users except the main 4 users
-- تحذير: هذا سيحذف المستخدمين التجريبيين عدا المستخدمين الأربعة الأساسيين
--
-- Keeps:
--   - admin@test.com
--   - doctor@test.com
--   - patient@test.com
--   - staff@test.com
--

-- Show users that will be deleted (preview)
SELECT 
  email,
  name,
  role::text as role,
  created_at,
  'Will be deleted' as action
FROM users
WHERE email LIKE '%@test.com'
  AND email NOT IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com')
ORDER BY created_at;

-- Uncomment the following line to actually delete:
-- DELETE FROM users
-- WHERE email LIKE '%@test.com'
--   AND email NOT IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com');

-- Done! ✅
-- تم عرض المستخدمين الذين سيتم حذفهم
-- لإتمام الحذف، امسح التعليق من سطر DELETE
