# 🚀 تطبيق الصلاحيات الآن - Apply Permissions Now

## ✅ تم الاتصال بقاعدة البيانات بنجاح!

الآن يمكن تطبيق SQL scripts مباشرة.

---

## 📋 الخطوات (Steps)

### 1. تطبيق SQL Script في Supabase SQL Editor

افتح Supabase Dashboard:
- https://supabase.com/dashboard/project/socwpqzcalgvpzjwavgh/sql/new

ثم انسخ والصق محتوى هذا الملف:
```
supabase/fix_permissions_schema.sql
```

ثم اضغط **RUN** ▶️

---

### 2. التحقق من التطبيق

بعد تطبيق SQL، شغّل:
```bash
node apply_via_supabase_direct.mjs
```

هذا سيفحص:
- ✅ وجود جداول permissions
- ✅ وجود roles
- ✅ وجود user_roles
- ✅ إنشاء permissions و roles عبر API

---

### 3. تطبيق إصلاحات المستخدمين

إذا لم يتم تطبيقه بعد، شغّل أيضاً:
```
supabase/apply_db_fix_working.sql
```

في Supabase SQL Editor.

---

## 🔍 التحقق اليدوي

بعد التطبيق، تحقق من:

```sql
-- 1. تحقق من Permissions
SELECT code, name FROM permissions LIMIT 10;

-- 2. تحقق من Roles
SELECT name, display_name FROM roles;

-- 3. تحقق من User Roles
SELECT 
  u.email,
  r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email LIKE '%@test.com';
```

---

## ✅ بعد التطبيق

1. ✅ **شغّل الاختبارات**:
   ```bash
   npx playwright test tests/auth/permissions.spec.ts
   ```

2. ✅ **جرّب تسجيل الدخول**:
   - admin@test.com / Admin123!
   - doctor@test.com / Doctor123!

3. ✅ **تحقق من الصلاحيات**:
   - Admin يمكنه الوصول إلى `/admin`
   - Agent (doctor/patient/staff) لا يمكنهم الوصول إلى `/admin`

---

## 📝 الملفات

- `supabase/fix_permissions_schema.sql` - **يجب تطبيقه أولاً**
- `supabase/apply_db_fix_working.sql` - للمستخدمين
- `apply_via_supabase_direct.mjs` - للتحقق والإنشاء عبر API

---

## 🎯 النتيجة المتوقعة

بعد التطبيق:
- ✅ 13+ permissions في جدول permissions
- ✅ 4 roles (admin, manager, supervisor, agent)
- ✅ User roles مرتبطة بالمستخدمين
- ✅ جميع الاختبارات ناجحة
