# دليل الأنماط المركزية - مُعين

## نظرة عامة

تم إنشاء نظام أنماط مركزي ومتسق لجميع صفحات ومكونات منصة مُعين باستخدام Tailwind CSS و CSS مخصص.

## الألوان الأساسية

### ألوان العلامة التجارية

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
--foreground: #0f172a; /* النص الأساسي */
--brand-surface: #f9fafb; /* سطح العلامة التجارية */
--panel: #ffffff; /* لوحة المكونات */
--brand-border: #e5e7eb; /* حدود العلامة التجارية */
```

## المكونات الأساسية

### الأزرار (Buttons)

```html
<!-- زر أساسي -->
<button class="btn btn-brand">نص الزر</button>

<!-- زر ثانوي -->
<button class="btn btn-secondary">نص الزر</button>

<!-- زر مخطط -->
<button class="btn btn-outline">نص الزر</button>

<!-- أحجام مختلفة -->
<button class="btn btn-brand btn-sm">صغير</button>
<button class="btn btn-brand btn-lg">كبير</button>
```

### البطاقات (Cards)

```html
<!-- بطاقة عادية -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">عنوان البطاقة</h3>
  </div>
  <div class="card-body">محتوى البطاقة</div>
  <div class="card-footer">تذييل البطاقة</div>
</div>

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
  <a href="#" class="nav-link">رابط التنقل</a>
</nav>

<!-- الشريط الجانبي -->
<aside class="sidebar">
  <a href="#" class="sidebar-item">عنصر القائمة</a>
  <a href="#" class="sidebar-item active">عنصر نشط</a>
</aside>
```

### مؤشرات الحالة (Status Indicators)

```html
<span class="status-success">نجح</span>
<span class="status-warning">تحذير</span>
<span class="status-error">خطأ</span>

<!-- أو باستخدام البادجات -->
<span class="badge badge-success">نجح</span>
<span class="badge badge-warning">تحذير</span>
<span class="badge badge-error">خطأ</span>
<span class="badge badge-info">معلومات</span>
```

## فئات المساعدة

### التخطيط

```css
.container-app     /* حاوية التطبيق الرئيسية */
.section-padding   /* مساحة داخلية للقسم */
.section-padding-lg /* مساحة داخلية كبيرة للقسم */
```

### الألوان

```css
.text-brand        /* نص باللون الأساسي */
.bg-brand          /* خلفية باللون الأساسي */
.border-brand      /* حدود باللون الأساسي */
```

### التدرجات

```css
.bg-gradient-brand     /* تدرج العلامة التجارية */
.bg-gradient-brand-2   /* تدرج العلامة التجارية 2 */
.bg-gradient-brand-3   /* تدرج العلامة التجارية 3 */
.text-gradient         /* نص متدرج */
```

### الرسوم المتحركة

```css
.animate-fadeInUp      /* ظهور من الأسفل */
.animate-slideInRight  /* انزلاق من اليمين */
.animate-pulse         /* نبضة */
.animate-bounce        /* ارتداد */
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
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- محتوى متجاوب -->
</div>
```

## الوضع المظلم (Dark Mode)

يتم دعم الوضع المظلم تلقائياً باستخدام `prefers-color-scheme`. جميع الألوان والمكونات تتكيف مع الوضع المظلم.

## الطباعة (Print Styles)

```css
.no-print  /* إخفاء العناصر عند الطباعة */
```

## أفضل الممارسات

1. **استخدم الفئات المحددة مسبقاً** بدلاً من إنشاء أنماط مخصصة
2. **اتبع هيكل المكونات** المحدد في هذا الدليل
3. **استخدم متغيرات CSS** للألوان بدلاً من القيم المباشرة
4. **اختبر في الوضع المظلم** للتأكد من التوافق
5. **استخدم الفئات المتجاوبة** للتخطيطات المختلفة

## أمثلة كاملة

### صفحة تسجيل الدخول

```html
<div
  class="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-4"
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
