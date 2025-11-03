# 🔧 تطبيق إصلاح قاعدة البيانات الآن

## الطريقة السريعة (موصى بها)

### ✅ شغّل هذا SQL في Supabase SQL Editor:

1. افتح **Supabase Dashboard**
2. اذهب إلى **SQL Editor**
3. افتح ملف: `apply_db_fix_direct.sql`
4. انسخ المحتوى كاملاً
5. الصقه في SQL Editor
6. اضغط **Run**

هذا سيقوم بـ:
- ✅ إنشاء دالة `verify_password`
- ✅ إنشاء دالة `hash_password`
- ✅ إضافة/تحديث المستخدمين التجريبيين مع كلمات مرور
- ✅ التحقق من النتيجة

## بعد التطبيق

تحقق من أن كل شيء يعمل:

```sql
-- تحقق من المستخدمين
SELECT 
  email,
  name,
  role,
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN '❌ No password'
    ELSE '✅ Has password'
  END as password_status
FROM users
WHERE email LIKE '%@test.com';
```

يجب أن ترى `✅ Has password` لجميع المستخدمين.

## اختبار Login

بعد تطبيق SQL:

1. شغّل: `npm run dev`
2. افتح: `http://localhost:3001/login`
3. جرّب تسجيل الدخول:
   - admin@test.com / Admin123!
   - doctor@test.com / Doctor123!
   - patient@test.com / Patient123!
   - staff@test.com / Staff123!

## إذا لم يعمل

1. تأكد من تشغيل SQL بالكامل
2. تحقق من وجود extension `pgcrypto`
3. تحقق من logs في Supabase Dashboard
4. راجع `FIX_PASSWORD_NOT_SET.md` للمزيد من الحلول
