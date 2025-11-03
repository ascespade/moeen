# ✅ الحل النهائي - إصلاح مشكلة "Password not set"

## 🔍 المشكلة
المستخدم `admin@test.com` موجود في قاعدة البيانات لكن **ليس لديه `password_hash`**.

## 🚀 الحل السريع (خطوتين فقط)

### الخطوة 1: شغّل SQL في Supabase

1. افتح: https://supabase.com/dashboard/project/socwpqzcalgvpzjwavgh/sql
2. انسخ محتوى ملف: **`apply_db_fix_direct.sql`**
3. الصقه في SQL Editor
4. اضغط **Run**

### الخطوة 2: تحقق من النتيجة

بعد تشغيل SQL، شغّل:
```bash
node apply_db_fix_simple.mjs
```

يجب أن ترى `✅ Has password` لجميع المستخدمين.

## 📋 SQL الذي يجب تشغيله

```sql
-- Fix passwords for existing users
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
```

## ✅ بعد الإصلاح

1. جرّب تسجيل الدخول:
   - `admin@test.com` / `Admin123!`
2. يجب أن يعمل الآن!

## 📁 الملفات الجاهزة

- ✅ `apply_db_fix_direct.sql` - SQL كامل جاهز للتشغيل
- ✅ `apply_db_fix_simple.mjs` - للتحقق من الحالة
- ✅ `CustomAuthHub.ts` - محدّث للتعامل مع المستخدمين بدون passwords

## 🎯 الخلاصة

**المشكلة**: المستخدم موجود لكن بدون `password_hash`  
**الحل**: شغّل SQL script في Supabase SQL Editor  
**الوقت**: دقيقة واحدة ⏱️

---

**✅ كل شيء جاهز! شغّل SQL وستعمل! 🚀**
