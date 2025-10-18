# دليل النظام المركزي للأنماط - مُعين

## نظرة عامة

تم إنشاء نظام أنماط مركزي شامل لضمان الاتساق والسهولة في الصيانة عبر جميع صفحات ومكونات منصة مُعين.

## الملفات المركزية

### الملف الرئيسي

- `src/styles/centralized.css` - الملف الرئيسي الذي يحتوي على جميع الأنماط المركزية

### الملفات المساعدة

- `src/app/globals.css` - يستورد الأنماط المركزية
- `src/styles/index.css` - نقطة الدخول الرئيسية للأنماط

## نظام الألوان

### الألوان الأساسية

```css
--brand-primary: #f58220; /* البرتقالي الأساسي */
--brand-primary-hover: #d66f15; /* البرتقالي عند التمرير */
--brand-secondary: #009688; /* الأخضر الثانوي */
--brand-accent: #007bff; /* الأزرق المميز */
--brand-success: #009688; /* الأخضر للنجاح */
--brand-warning: #f59e0b; /* الأصفر للتحذير */
--brand-error: #ef4444; /* الأحمر للخطأ */
```

### ألوان الخلفية

```css
--background: #ffffff; /* الخلفية الأساسية */
--foreground: #0f172a; /* لون النص الأساسي */
--brand-surface: #f9fafb; /* خلفية السطح */
--panel: #ffffff; /* خلفية اللوحة */
--brand-border: #e5e7eb; /* لون الحدود */
```

## المكونات الأساسية

### الأزرار (Buttons)

#### الاستخدام الأساسي

```html
<!-- زر أساسي -->
<button class="btn btn-brand">نص الزر</button>

<!-- زر ثانوي -->
<button class="btn btn-secondary">نص الزر</button>

<!-- زر مخطط -->
<button class="btn btn-outline">نص الزر</button>
```

#### الأحجام

```html
<!-- زر صغير -->
<button class="btn btn-brand btn-sm">صغير</button>

<!-- زر عادي -->
<button class="btn btn-brand">عادي</button>

<!-- زر كبير -->
<button class="btn btn-brand btn-lg">كبير</button>
```

### البطاقات (Cards)

#### الاستخدام الأساسي

```html
<!-- بطاقة عادية -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">عنوان البطاقة</h3>
  </div>
  <div class="card-body">محتوى البطاقة</div>
  <div class="card-footer">تذييل البطاقة</div>
</div>
```

#### أنواع البطاقات

```html
<!-- بطاقة مرتفعة -->
<div class="card card-elevated">محتوى البطاقة</div>

<!-- بطاقة تفاعلية -->
<div class="card card-interactive">محتوى البطاقة</div>
```

### النماذج (Forms)

```html
<div class="form-group">
  <label class="form-label">تسمية الحقل</label>
  <input type="text" class="form-input" placeholder="نص توضيحي" />
  <p class="form-error">رسالة خطأ</p>
  <p class="form-help">نص مساعد</p>
</div>
```

### التنقل (Navigation)

```html
<!-- شريط التنقل -->
<nav class="nav">
  <div class="container-app">
    <a href="#" class="nav-link">رابط التنقل</a>
  </div>
</nav>

<!-- الشريط الجانبي -->
<aside class="sidebar">
  <a href="#" class="sidebar-item">عنصر القائمة</a>
  <a href="#" class="sidebar-item active">عنصر نشط</a>
</aside>
```

### مؤشرات الحالة (Status Indicators)

```html
<!-- حالات النجاح -->
<span class="status-success">نجح</span>
<span class="badge badge-success">نجح</span>

<!-- حالات التحذير -->
<span class="status-warning">تحذير</span>
<span class="badge badge-warning">تحذير</span>

<!-- حالات الخطأ -->
<span class="status-error">خطأ</span>
<span class="badge badge-error">خطأ</span>

<!-- حالات المعلومات -->
<span class="badge badge-info">معلومات</span>
```

## التخطيط (Layout)

### الحاوية الرئيسية

```html
<div class="container-app">
  <!-- محتوى الصفحة -->
</div>
```

### مساحة الأقسام

```html
<section class="section-padding">
  <!-- قسم عادي -->
</section>

<section class="section-padding-lg">
  <!-- قسم كبير -->
</section>
```

### شبكة لوحة التحكم

```html
<div class="dashboard-grid">
  <div class="dashboard-card">
    <div class="dashboard-metric">1,248</div>
    <div class="dashboard-label">المستخدمون</div>
  </div>
</div>
```

## الفئات المساعدة

### الألوان

```css
.text-brand        /* نص باللون الأساسي */
.bg-brand          /* خلفية باللون الأساسي */
.border-brand      /* حدود باللون الأساسي */
```

### التدرجات

```css
.text-gradient         /* نص متدرج */
.bg-gradient-brand     /* خلفية متدرجة أساسية */
.bg-gradient-brand-2   /* خلفية متدرجة ثانوية */
.bg-gradient-brand-3   /* خلفية متدرجة ثالثة */
```

### الرسوم المتحركة

```css
.animate-fadeInUp      /* ظهور من الأسفل */
.animate-slideInRight  /* انزلاق من اليمين */
.animate-pulse         /* نبضة */
.animate-bounce        /* ارتداد */
```

### الظلال

```css
.shadow-soft           /* ظل ناعم */
```

## الاستجابة (Responsive Design)

### نقاط التوقف

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1440px

### أمثلة الاستخدام

```html
<div class="dashboard-grid">
  <!-- يتكيف تلقائياً مع الشاشات المختلفة -->
</div>
```

## الوضع المظلم (Dark Mode)

يتم دعم الوضع المظلم تلقائياً باستخدام `prefers-color-scheme`. جميع الألوان والمكونات تتكيف مع الوضع المظلم.

## دعم RTL

جميع المكونات تدعم اللغة العربية والاتجاه من اليمين إلى اليسار تلقائياً.

## إمكانية الوصول (Accessibility)

### التركيز

```css
.focus-visible:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

### الشاشات القارئة

```html
<span class="sr-only">نص مخفي للشاشات القارئة</span>
```

### الحركة المقللة

يتم دعم `prefers-reduced-motion` تلقائياً.

## الطباعة (Print Styles)

```css
.no-print  /* إخفاء العناصر عند الطباعة */
```

## أفضل الممارسات

### 1. استخدم الفئات المحددة مسبقاً

```html
<!-- ✅ صحيح -->
<button class="btn btn-brand">زر</button>

<!-- ❌ خطأ -->
<button style="background: #f58220; color: white;">زر</button>
```

### 2. استخدم متغيرات CSS

```css
/* ✅ صحيح */
.custom-element {
  color: var(--brand-primary);
}

/* ❌ خطأ */
.custom-element {
  color: #f58220;
}
```

### 3. اتبع هيكل المكونات

```html
<!-- ✅ صحيح -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">العنوان</h3>
  </div>
  <div class="card-body">المحتوى</div>
</div>
```

### 4. استخدم الحاوية الصحيحة

```html
<!-- ✅ صحيح -->
<div class="container-app">
  <!-- محتوى الصفحة -->
</div>

<!-- ❌ خطأ -->
<div class="container mx-auto px-4">
  <!-- محتوى الصفحة -->
</div>
```

## أمثلة كاملة

### صفحة تسجيل الدخول

```html
<div
  class="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center p-4"
>
  <div class="w-full max-w-md">
    <div class="card p-8">
      <form class="space-y-6">
        <div class="form-group">
          <label class="form-label">البريد الإلكتروني</label>
          <input type="email" class="form-input" required />
        </div>
        <button type="submit" class="btn btn-brand btn-lg w-full">
          تسجيل الدخول
        </button>
      </form>
    </div>
  </div>
</div>
```

### لوحة التحكم

```html
<main class="min-h-screen bg-[var(--brand-surface)]">
  <div class="border-brand border-b bg-white dark:bg-gray-900">
    <div class="container-app py-4">
      <h1 class="text-brand text-2xl font-bold">لوحة التحكم</h1>
    </div>
  </div>
  <div class="container-app py-6">
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="dashboard-metric">1,248</div>
        <div class="dashboard-label">المستخدمون</div>
      </div>
    </div>
  </div>
</main>
```

## التحديثات المستقبلية

- إضافة المزيد من مكونات الواجهة
- تحسين دعم الوضع المظلم
- إضافة المزيد من الرسوم المتحركة
- تحسين الاستجابة للأجهزة المختلفة
- إضافة دعم أفضل للطباعة

## الدعم والمساعدة

إذا كنت بحاجة إلى مساعدة في استخدام النظام المركزي للأنماط، يرجى الرجوع إلى هذا الدليل أو التواصل مع فريق التطوير.
