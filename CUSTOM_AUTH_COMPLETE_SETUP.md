# 🔐 نظام المصادقة المخصص - إعداد كامل

## ✅ ما تم إنجازه

### 1. تحديث JWT ليكون ديناميكي في Runtime
- ✅ `CustomAuthHub.ts` يقرأ `JWT_SECRET` من `.env` في runtime
- ✅ يرمي خطأ واضح إذا لم يكن `JWT_SECRET` موجود
- ✅ تحديث `.env.example` مع JWT_SECRET آمن

### 2. إنشاء SQL Scripts
- ✅ `supabase/setup_custom_auth.sql` - إنشاء الدالة والمستخدمين
- ✅ دالة `verify_password` للتحقق من كلمات المرور باستخدام pgcrypto

### 3. API Endpoints
- ✅ `/api/auth/custom-login` - Login مخصص
- ✅ `/api/auth/verify` - التحقق من JWT token

### 4. React Hooks
- ✅ `useCustomAuth` - Hook للمصادقة المخصصة
- ✅ تحديث صفحة Login لاستخدام النظام المخصص

## 🚀 خطوات الإعداد

### الخطوة 1: تطبيق SQL على قاعدة البيانات

افتح **Supabase Dashboard** → **SQL Editor** وشغّل ملف:
```
supabase/setup_custom_auth.sql
```

هذا سينشئ:
- دالة `verify_password` للتحقق من كلمات المرور
- 4 مستخدمين تجريبيين:
  - admin@test.com / Admin123!
  - doctor@test.com / Doctor123!
  - patient@test.com / Patient123!
  - staff@test.com / Staff123!

### الخطوة 2: إعداد ملف .env.local

انسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

تأكد من وجود:
```env
JWT_SECRET=7d44821bf90a10bf07ecc95e96177b320f808fe3f023c58f74a50f900f1cbd41
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### الخطوة 3: تشغيل الاختبار

```bash
./test_custom_auth.sh
```

أو يدوياً:
```bash
npm run dev
```

ثم افتح `http://localhost:3001/login` واختبر تسجيل الدخول.

## 🧪 الاختبار

### 1. اختبار Login API مباشرة

```bash
curl -X POST http://localhost:3001/api/auth/custom-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'
```

يجب أن يعيد:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@test.com",
      "name": "Test Admin",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "permissions": [...]
  }
}
```

### 2. اختبار التحقق من Token

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_HERE"}'
```

### 3. اختبار من واجهة المستخدم

1. افتح `http://localhost:3001/login`
2. اضغط على زر "Admin" أو أدخل:
   - Email: `admin@test.com`
   - Password: `Admin123!`
3. يجب أن يتم تسجيل الدخول وإعادة توجيهك إلى `/dashboard`

## 📋 المستخدمون التجريبيون

| Email | Password | Role | Dashboard Route |
|-------|----------|------|-----------------|
| admin@test.com | Admin123! | admin | /admin/dashboard |
| doctor@test.com | Doctor123! | doctor | /doctor-dashboard |
| patient@test.com | Patient123! | patient | /dashboard/patient |
| staff@test.com | Staff123! | staff | /dashboard/staff |

## 🔧 التكوين

### JWT Configuration

في `.env.local`:
```env
JWT_SECRET=7d44821bf90a10bf07ecc95e96177b320f808fe3f023c58f74a50f900f1cbd41
JWT_EXPIRES_IN=7d
```

**⚠️ مهم**: في الإنتاج، استخدم secret قوي وفريد:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Schema

النظام يستخدم:
- `users` table - للمستخدمين وكلمات المرور
- `roles` table - للأدوار
- `user_roles` → `role_permissions` → `permissions` - للصلاحيات

## 🐛 استكشاف الأخطاء

### خطأ: "JWT_SECRET environment variable is not set"

**الحل**: تأكد من وجود `JWT_SECRET` في `.env.local`

### خطأ: "Password verification failed"

**الحل**: تأكد من تشغيل `setup_custom_auth.sql` في Supabase SQL Editor

### خطأ: "Invalid credentials"

**الحل**: 
1. تأكد من وجود المستخدم في قاعدة البيانات
2. تأكد من استخدام كلمة المرور الصحيحة
3. تحقق من logs في Supabase Dashboard

### Token لا يعمل

**الحل**:
1. تأكد من `JWT_SECRET` نفسه في كل البيئات
2. تحقق من انتهاء صلاحية Token
3. تأكد من حفظ Token في localStorage

## ✅ Checklist قبل النشر

- [ ] تم تشغيل `setup_custom_auth.sql` في Supabase
- [ ] `JWT_SECRET` موجود في `.env.local`
- [ ] تم اختبار Login بنجاح
- [ ] تم اختبار Token verification
- [ ] المستخدمون التجريبيون محذوفون (في الإنتاج)
- [ ] `JWT_SECRET` مختلف في الإنتاج

## 📝 ملاحظات

- النظام يستخدم **JWT tokens** بدلاً من Supabase Auth sessions
- كلمات المرور مشفرة باستخدام **pgcrypto** مع **bcrypt**
- الصلاحيات يتم cache لمدة 5 دقائق
- في الإنتاج، احذف المستخدمين التجريبيين

## 🎉 جاهز!

النظام جاهز للاستخدام. إذا واجهت أي مشاكل، راجع قسم "استكشاف الأخطاء" أعلاه.
