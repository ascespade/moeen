# تقرير مشكلة صفحة التحليلات

**تاريخ الفحص:** 2024-01-15
**المشكلة:** صفحة التحليلات لا تعمل ولا يوجد أي محتوى

---

## 🔍 المشكلة

عند فتح صفحة التحليلات (`/analytics`):
- ❌ الصفحة تعيد التوجيه إلى صفحة تسجيل الدخول
- ❌ لا يوجد أي محتوى يظهر
- ❌ لا توجد أخطاء واضحة في Console

---

## 🔎 التحليل

### 1. الكود الموجود

**الصفحة:** `src/app/(admin)/analytics/page.tsx`
- ✅ الصفحة موجودة
- ✅ الكود يبدو صحيحاً
- ✅ يستخدم `AdminPageWrapper` للتحقق من الصلاحيات

**API:** `src/app/api/analytics/data/route.ts`
- ✅ API موجود
- ✅ يطلب صلاحيات: `['admin', 'supervisor', 'manager']`
- ✅ يجلب البيانات من Supabase

**الصلاحيات:** `src/lib/admin/page-config.ts`
- ⚠️ الصفحة تحتاج صلاحية: `analytics:view`
- ⚠️ API يحتاج صلاحيات: `['admin', 'supervisor', 'manager']`

### 2. المشكلة المحتملة

**المشكلة الرئيسية:**
- الصفحة تستخدم `AdminPageWrapper` الذي يتحقق من الصلاحيات
- الصفحة تحتاج صلاحية `analytics:view`
- إذا لم يكن المستخدم يملك هذه الصلاحية، يتم إعادة التوجيه إلى `/admin/dashboard`
- لكن يبدو أنه يتم إعادة التوجيه إلى `/login` بدلاً من ذلك

**الكود في `AdminPageWrapper`:**
```typescript
// Check authentication
if (!isAuthenticated || !user) {
  // Use window.location only for initial auth redirect
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
  return;
}
```

**المشكلة:**
- إذا لم يكن المستخدم مسجل دخول، يتم إعادة التوجيه إلى `/login`
- إذا كان المستخدم مسجل دخول لكن لا يملك الصلاحيات، يتم إعادة التوجيه إلى `/admin/dashboard`

---

## 🔧 الحلول المقترحة

### الحل 1: إزالة التحقق من الصلاحيات مؤقتاً

**الملف:** `src/app/(admin)/analytics/page.tsx`

```typescript
export default function AnalyticsPage() {
  // إزالة AdminPageWrapper مؤقتاً للاختبار
  return <AnalyticsPageContent />;
}
```

### الحل 2: إضافة صلاحية `analytics:view` للمستخدم

**الملف:** قاعدة البيانات أو ملف الأدوار

تأكد من أن المستخدم (admin) يملك صلاحية `analytics:view`

### الحل 3: تعديل `AdminPageWrapper` لإظهار رسالة خطأ بدلاً من إعادة التوجيه

**الملف:** `src/lib/admin/page-wrapper.tsx`

```typescript
// بدلاً من إعادة التوجيه، إظهار رسالة خطأ
if (!hasAllPermissions) {
  return (
    <div className='flex items-center justify-center min-h-[400px]'>
      <div className='text-center'>
        <h2 className='text-xl font-bold mb-2'>غير مصرح لك</h2>
        <p className='text-gray-600'>ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
      </div>
    </div>
  );
}
```

### الحل 4: تعديل API ليقبل صلاحية `analytics:view` بدلاً من الأدوار

**الملف:** `src/app/api/analytics/data/route.ts`

```typescript
// بدلاً من:
const authResult = await requireAuth(['admin', 'supervisor', 'manager'])(request);

// استخدم:
const authResult = await requireAuth(['admin', 'supervisor', 'manager'])(request);
// ثم تحقق من الصلاحية:
if (!hasPermission('analytics:view')) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

---

## ✅ الحل الموصى به

**الحل الأفضل:** تعديل `AdminPageWrapper` لإظهار رسالة خطأ واضحة بدلاً من إعادة التوجيه الصامتة.

**الخطوات:**
1. تعديل `AdminPageWrapper` لإظهار رسالة خطأ عند عدم وجود الصلاحيات
2. التأكد من أن المستخدم (admin) يملك صلاحية `analytics:view`
3. إضافة logging لمعرفة سبب إعادة التوجيه

---

## 📋 ملاحظات إضافية

- الصفحة موجودة والكود يبدو صحيحاً
- المشكلة في التحقق من الصلاحيات
- API موجود ويعمل
- البيانات متوفرة في Supabase



