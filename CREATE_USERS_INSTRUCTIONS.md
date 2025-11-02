# ✅ تعليمات إنشاء Test Users

## ✅ ما تم إنجازه

تم إنشاء جميع المستخدمين في **Supabase Auth** بنجاح:

| Email | Password | Role | Supabase Auth ID |
|-------|----------|------|------------------|
| admin@test.com | Admin123! | admin | 7d56b41f-e8d0-4aa9-a135-583b241f1778 |
| doctor@test.com | Doctor123! | doctor | 6900370b-0424-40b8-81b4-8c3f5ea3a2c0 |
| patient@test.com | Patient123! | patient | 5d772a20-99c8-4dca-9c83-105efd34caa5 |
| staff@test.com | Staff123! | staff | c347adfb-686a-4dd3-974a-b87e66757a43 |

## ⚠️ الخطوة التالية: إنشاء User Records في Database

المستخدمين موجودين في Supabase Auth، لكن هناك مشكلة في إنشاء records في جدول `users` بسبب enum constraint.

### الحل: تشغيل SQL Script

1. اذهب إلى **Supabase Dashboard**
2. افتح **SQL Editor**
3. انسخ والصق محتوى ملف `scripts/create-users-direct.sql`
4. اضغط **Run**

أو قم بتشغيل:

```bash
# في Supabase SQL Editor
cat scripts/create-users-direct.sql
```

### ملاحظة

إذا كان جدول `users` يستخدم enum type يمنع القيم، يمكنك:

**Option 1: تشغيل SQL مباشرة**
- استخدم `scripts/create-users-direct.sql` في Supabase SQL Editor

**Option 2: تحديث Enum Values**
- أضف القيم المطلوبة إلى enum type

## ✅ بعد إنشاء Users Records

بعد إنشاء records في جدول `users`:

1. ✅ تسجيل الدخول سيعمل مباشرة
2. ✅ جميع المستخدمين سيكونون قادرين على Login
3. ✅ سيتم redirect إلى `/admin/dashboard` مباشرة

## Test Credentials

استخدم هذه البيانات لتسجيل الدخول:

```
admin@test.com / Admin123!
doctor@test.com / Doctor123!
patient@test.com / Patient123!
staff@test.com / Staff123!
```

---

**الحالة:** ✅ المستخدمين في Supabase Auth  
**المطلوب:** إنشاء records في جدول `users` عبر SQL Script