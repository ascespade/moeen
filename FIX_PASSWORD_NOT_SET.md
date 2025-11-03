# 🔧 إصلاح مشكلة "Password not set"

## المشكلة
عند محاولة تسجيل الدخول، يظهر الخطأ: **"Password not set"**

هذا يعني أن المستخدمين في قاعدة البيانات لا يملكون `password_hash`.

## الحل السريع

### الطريقة 1: تشغيل SQL Script لإصلاح المستخدمين الموجودين

شغّل هذا الملف في Supabase SQL Editor:
```
supabase/fix_existing_users_passwords.sql
```

هذا سيقوم بـ:
- ✅ إنشاء دالة `hash_password` إذا لم تكن موجودة
- ✅ إضافة `password_hash` لجميع المستخدمين التجريبيين
- ✅ التحقق من أن جميع المستخدمين لديهم كلمات مرور

### الطريقة 2: تحديث setup_custom_auth.sql وإعادة تشغيله

تم تحديث `setup_custom_auth.sql` ليتعامل مع المستخدمين الموجودين. شغّله مرة أخرى:

```
supabase/setup_custom_auth.sql
```

## التحقق من الإصلاح

بعد تشغيل SQL، تحقق من:

```sql
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
```

يجب أن ترى `✅ Has password` لجميع المستخدمين.

## للمستخدمين الجدد

إذا كنت تريد إنشاء مستخدم جديد مع كلمة مرور:

```sql
INSERT INTO users (email, password_hash, name, role, status)
VALUES (
  'newuser@example.com',
  crypt('YourPassword123!', gen_salt('bf')),
  'User Name',
  'patient',
  'active'
);
```

## ملاحظات

- الكود الآن يتعامل مع المستخدمين بدون `password_hash` في وضع التطوير
- في الإنتاج، يجب أن يكون لجميع المستخدمين `password_hash`
- تم تحديث `CustomAuthHub.ts` ليعطي رسائل خطأ أوضح

## بعد الإصلاح

1. ✅ شغّل SQL script
2. ✅ تحقق من أن المستخدمين لديهم `password_hash`
3. ✅ جرّب تسجيل الدخول مرة أخرى

يجب أن يعمل الآن! 🎉
