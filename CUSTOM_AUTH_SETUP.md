# 🔐 إعداد نظام المصادقة المخصص

## نظرة عامة

تم إنشاء نظام مصادقة مخصص يعتمد على جداول قاعدة البيانات الخاصة بك بدلاً من Supabase Authentication.

## الملفات المُنشأة

1. **`src/lib/auth/CustomAuthHub.ts`** - نظام المصادقة المخصص الأساسي
2. **`src/lib/auth/hooks/useCustomAuth.ts`** - React hook للمصادقة
3. **`src/app/api/auth/custom-login/route.ts`** - API endpoint للـ login
4. **`src/app/api/auth/verify/route.ts`** - API endpoint للتحقق من الـ token
5. **`supabase/create_verify_password_function.sql`** - دالة SQL للتحقق من كلمة المرور

## إعداد قاعدة البيانات

### 1. إنشاء دالة التحقق من كلمة المرور

قم بتشغيل هذا الملف في Supabase SQL Editor:

```sql
-- تشغيل supabase/create_verify_password_function.sql
```

هذا سينشئ دالة `verify_password` التي تستخدم `pgcrypto` للتحقق من كلمات المرور.

### 2. إنشاء مستخدمين تجريبيين

```sql
-- إنشاء مستخدم admin
INSERT INTO users (email, password_hash, name, role, status)
VALUES (
  'admin@test.com',
  crypt('Admin123!', gen_salt('bf')),
  'Test Admin',
  'admin',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- إنشاء مستخدم doctor
INSERT INTO users (email, password_hash, name, role, status)
VALUES (
  'doctor@test.com',
  crypt('Doctor123!', gen_salt('bf')),
  'Test Doctor',
  'doctor',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- إنشاء مستخدم patient
INSERT INTO users (email, password_hash, name, role, status)
VALUES (
  'patient@test.com',
  crypt('Patient123!', gen_salt('bf')),
  'Test Patient',
  'patient',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- إنشاء مستخدم staff
INSERT INTO users (email, password_hash, name, role, status)
VALUES (
  'staff@test.com',
  crypt('Staff123!', gen_salt('bf')),
  'Test Staff',
  'staff',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status;
```

### 3. إعداد JWT Secret

أضف في ملف `.env.local`:

```env
JWT_SECRET=your-very-secure-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

## استخدام النظام المخصص

### في صفحة Login

استبدل استخدام `useUnifiedAuth` بـ `useCustomAuth`:

```typescript
'use client';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';

export default function LoginPage() {
  const { login, loading } = useCustomAuth();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Show error
      alert(result.error);
    }
  };

  // ... rest of component
}
```

### في Middleware

عدّل `middleware.ts` لاستخدام النظام المخصص:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    // Redirect to login for protected routes
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // User is authenticated
    return NextResponse.next();
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

## الصلاحيات

النظام يحصل على الصلاحيات من:
1. جدول `user_roles` -> `role_permissions` -> `permissions`
2. جدول `user_permissions` -> `permissions`
3. إذا لم توجد صلاحيات، يستخدم صلاحيات افتراضية حسب الـ role

## المستخدمون التجريبيون

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin123! | admin |
| doctor@test.com | Doctor123! | doctor |
| patient@test.com | Patient123! | patient |
| staff@test.com | Staff123! | staff |

## ملاحظات أمنية

1. **تغيير JWT_SECRET في الإنتاج**: استخدم secret قوي وفريد في الإنتاج
2. **حماية كلمات المرور**: تأكد من استخدام `crypt` مع `gen_salt('bf')` لجميع كلمات المرور
3. **HTTPS فقط**: تأكد من استخدام HTTPS في الإنتاج
4. **Rate Limiting**: أضف rate limiting على endpoints المصادقة
5. **حذف المستخدمين التجريبيين**: احذف المستخدمين التجريبيين قبل النشر

## الخطوات التالية

1. ✅ تشغيل `create_verify_password_function.sql`
2. ✅ إنشاء المستخدمين التجريبيين
3. ✅ إعداد `JWT_SECRET` في `.env.local`
4. ⏭️ تحديث صفحة Login لاستخدام `useCustomAuth`
5. ⏭️ تحديث Middleware للتحقق من JWT tokens
6. ⏭️ اختبار النظام

## الدعم

إذا واجهت أي مشاكل، تحقق من:
- Console logs للـ errors
- Supabase logs
- Network tab في DevTools
