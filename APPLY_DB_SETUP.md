# 🔧 تطبيق إعداد قاعدة البيانات

## استخدام MCP Supabase أو SQL Editor

### الطريقة 1: Supabase SQL Editor (موصى بها)

1. افتح **Supabase Dashboard**
2. اذهب إلى **SQL Editor**
3. افتح ملف `supabase/setup_custom_auth.sql`
4. انسخ المحتوى بالكامل
5. الصقه في SQL Editor
6. اضغط **Run**

### الطريقة 2: استخدام Supabase CLI

إذا كان لديك Supabase CLI:

```bash
supabase db execute -f supabase/setup_custom_auth.sql
```

## التحقق من النجاح

بعد تشغيل SQL، تحقق من:

### 1. التحقق من الدالة

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'verify_password'
  AND routine_schema = 'public';
```

يجب أن ترى `verify_password` في النتائج.

### 2. التحقق من المستخدمين

```sql
SELECT id, email, name, role, status
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role;
```

يجب أن ترى 4 مستخدمين:
- admin@test.com
- doctor@test.com
- patient@test.com
- staff@test.com

### 3. اختبار دالة التحقق من كلمة المرور

```sql
SELECT verify_password(
  'Admin123!',
  (SELECT password_hash FROM users WHERE email = 'admin@test.com')
);
```

يجب أن يرجع `true`.

## بعد التطبيق

1. ✅ تأكد من وجود `.env.local` مع `JWT_SECRET`
2. ✅ شغّل `npm run dev`
3. ✅ اختبر Login من صفحة `/login`

## إذا واجهت مشاكل

- تحقق من logs في Supabase Dashboard
- تأكد من وجود extension `pgcrypto`
- تأكد من صلاحيات الجداول
