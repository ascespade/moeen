# 🔧 إصلاح مشكلة "Password not set" - تعليمات سريعة

## ✅ الحل في خطوتين

### الخطوة 1: شغّل SQL في Supabase

**افتح هذا الرابط:**
```
https://supabase.com/dashboard/project/socwpqzcalgvpzjwavgh/sql
```

**انسخ محتوى ملف `QUICK_FIX_SQL.sql` والصقه في SQL Editor ثم اضغط Run**

### الخطوة 2: تحقق من النتيجة

```bash
node apply_db_fix_simple.mjs
```

يجب أن ترى `✅ Has password` لجميع المستخدمين.

## 🎯 بعد الإصلاح

جرّب تسجيل الدخول:
- `admin@test.com` / `Admin123!`

يجب أن يعمل الآن! 🎉

## 📋 ملخص المشكلة

- ✅ المستخدم موجود في قاعدة البيانات
- ❌ لكن بدون `password_hash`
- ✅ SQL script يصلح هذا مباشرة

## 📁 الملفات

- `QUICK_FIX_SQL.sql` - SQL جاهز للتشغيل (الأسرع)
- `apply_db_fix_direct.sql` - SQL كامل مع كل الإصلاحات
- `apply_db_fix_simple.mjs` - للتحقق من الحالة

---

**⏱️ الوقت المطلوب: أقل من دقيقة!**
