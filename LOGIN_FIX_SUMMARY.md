# ✅ إصلاح مشكلة Login - 400 Bad Request

## المشكلة

كان `AuthHub` يستدعي Supabase Auth مباشرة:
```typescript
await this.supabase.auth.signInWithPassword({ email, password });
```

هذا يفشل بـ **400 Bad Request** لأن:
- المستخدمين غير موجودين في Supabase Auth
- يجب استخدام `/api/auth/login` الذي لديه fallback logic

## الحل المطبق

### ✅ تحديث AuthHub.login()

**قبل:**
```typescript
// ❌ يستدعي Supabase مباشرة
const { data, error } = await this.supabase.auth.signInWithPassword({
  email,
  password,
});
```

**بعد:**
```typescript
// ✅ يستخدم API route الذي لديه fallback logic
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});
```

## فوائد هذا التغيير

1. ✅ **Fallback Logic**: يستخدم `/api/auth/login` الذي:
   - يحاول Supabase Auth أولاً
   - إذا فشل: يحاول DB lookup
   - إذا المستخدم غير موجود: ينشئه تلقائياً (في dev mode)

2. ✅ **Auto-User Creation**: في dev mode، إذا المستخدم غير موجود، يتم إنشاؤه تلقائياً

3. ✅ **Better Error Handling**: رسائل خطأ أوضح للمستخدم

## الخطوات التالية

### لإنشاء Test Users في Supabase Auth:

**Option 1: Via Supabase Dashboard**
1. اذهب إلى Supabase Dashboard
2. Authentication > Users > Add User
3. أنشئ المستخدمين:
   - admin@test.com / Admin123!
   - doctor@test.com / Doctor123!
   - patient@test.com / Patient123!
   - staff@test.com / Staff123!

**Option 2: Via API (Auto-create)**
- في dev mode، API route سينشئ المستخدمين تلقائياً عند أول login
- استخدم كلمة المرور: `A123456` أو `Admin123!` إلخ

**Option 3: Via SQL Script**
- راجع `supabase/00_test_users.sql`
- لكن يجب أيضاً إنشاء المستخدمين في Supabase Auth Dashboard

## الاختبار

بعد الإصلاح:
1. ✅ جرب تسجيل الدخول بـ admin@test.com / Admin123!
2. ✅ إذا فشل، جرب مع كلمة المرور `A123456` (fallback password)
3. ✅ في dev mode، يجب أن ينشئ المستخدم تلقائياً

---

**تاريخ الإصلاح:** 2025-01-XX  
**الحالة:** ✅ مكتمل