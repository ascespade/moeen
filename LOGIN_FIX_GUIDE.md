# 🔧 Login Fix Guide - دليل إصلاح تسجيل الدخول

## ✅ ما تم إصلاحه (What Was Fixed)

1. **Type Mismatch**: تم تغيير `id` من `number` إلى `string` (UUID) في `CustomAuthHub.ts`
2. **Debugging Logs**: تم إضافة logs لتتبع المشكلة
3. **Error Handling**: تحسين معالجة الأخطاء

---

## 🔍 خطوات التشخيص (Debugging Steps)

### 1. تحقق من Console في المتصفح

افتح Developer Tools (F12) واذهب إلى Console. ابحث عن:
- `[CUSTOM-LOGIN]` logs
- `[AUTH-HUB]` logs
- أي أخطاء (errors)

### 2. تحقق من Network Tab

1. افتح Network tab في Developer Tools
2. حاول تسجيل الدخول
3. ابحث عن request إلى `/api/auth/custom-login`
4. اضغط على Request وافتح Response
5. انظر إلى الرسالة الخطأ

### 3. تحقق من Server Logs

في terminal حيث يعمل `npm run dev`، ابحث عن:
- `[CUSTOM-LOGIN]` logs
- `[AUTH-HUB]` logs

---

## 🐛 المشاكل الشائعة (Common Issues)

### المشكلة 1: `verify_password function does not exist`

**الخطأ**: 
```
Error: function verify_password(text, text) does not exist
```

**الحل**:
```sql
-- شغّل في Supabase SQL Editor:
-- apply_db_fix_working.sql
```

### المشكلة 2: Password verification returns false

**الخطأ**: Login fails even with correct password

**الحل**:
```sql
-- اختبر verify_password مباشرة:
-- test_password_verification.sql

-- إذا كان password_hash مختلف، أعد تشغيل:
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com';
```

### المشكلة 3: JWT_SECRET not set

**الخطأ**: 
```
Error: JWT_SECRET environment variable is not set
```

**الحل**:
أضف إلى `.env.local`:
```env
JWT_SECRET=your-very-secure-jwt-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
```

لتوليد JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### المشكلة 4: User status is not 'active'

**الخطأ**: User account is inactive

**الحل**:
```sql
UPDATE users
SET status = 'active'::user_status
WHERE email = 'admin@test.com';
```

---

## 🧪 اختبار مباشر (Direct Testing)

### اختبار 1: تحقق من وجود verify_password function
```sql
SELECT routine_name 
FROM information_schema.routines
WHERE routine_name = 'verify_password';
```

### اختبار 2: تحقق من كلمة مرور admin
```sql
SELECT verify_password('Admin123!', password_hash)
FROM users
WHERE email = 'admin@test.com';
```

يجب أن يعيد `true`

### اختبار 3: تحقق من بيانات المستخدم
```sql
SELECT 
  email,
  status::text,
  role::text,
  CASE 
    WHEN password_hash IS NULL THEN 'No password'
    ELSE 'Has password'
  END
FROM users
WHERE email = 'admin@test.com';
```

---

## 📋 Checklist

قبل محاولة تسجيل الدخول، تأكد من:

- [ ] تم تشغيل `apply_db_fix_working.sql` في Supabase
- [ ] `verify_password` function موجودة في قاعدة البيانات
- [ ] `hash_password` function موجودة في قاعدة البيانات
- [ ] `JWT_SECRET` موجود في `.env.local`
- [ ] المستخدم له `password_hash` في قاعدة البيانات
- [ ] حالة المستخدم هي `'active'`
- [ ] تم إعادة تشغيل dev server بعد تعديل `.env.local`

---

## 🔄 إعادة الإصلاح الكاملة (Full Re-Fix)

إذا استمرت المشكلة، شغّل هذا التسلسل:

1. **في Supabase SQL Editor**:
```sql
-- 1. إنشاء الدوال
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION verify_password(
  password_input TEXT,
  password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated, anon, service_role;

-- 2. إعادة تعيين كلمات المرور
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com';

UPDATE users
SET password_hash = crypt('Doctor123!', gen_salt('bf'))
WHERE email = 'doctor@test.com';

UPDATE users
SET password_hash = crypt('Patient123!', gen_salt('bf'))
WHERE email = 'patient@test.com';

UPDATE users
SET password_hash = crypt('Staff123!', gen_salt('bf'))
WHERE email = 'staff@test.com';

-- 3. التأكد من حالة المستخدمين
UPDATE users
SET status = 'active'::user_status
WHERE email IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com');
```

2. **في `.env.local`**:
```env
JWT_SECRET=your-generated-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d
```

3. **أعد تشغيل Dev Server**:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 📞 إذا استمرت المشكلة

أرسل لي:
1. Console logs من المتصفح
2. Network response من `/api/auth/custom-login`
3. Server logs من terminal
4. نتيجة `test_password_verification.sql`
