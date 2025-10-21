# نظام التصميم المركزي الشامل - مُعين

## نظرة عامة

نظام التصميم المركزي الشامل لمشروع مُعين يوفر نظاماً موحداً ومتسقاً للألوان، الخطوط، والستايلات على مستوى المشروع كامل.

## هيكل النظام

```
src/styles/design-system/
├── index.css          # الملف الرئيسي - يستورد جميع الأنظمة
├── unified.css        # النظام الموحد - يجمع جميع الأنظمة الفرعية
├── colors.css         # نظام الألوان المركزي
├── typography.css     # نظام الخطوط المركزي
└── spacing.css        # نظام الستايل المركزي (المسافات، الحدود، الظلال، الأنيميشن)
```

## الميزات الرئيسية

### 🎨 نظام الألوان المركزي
- **الألوان الأساسية**: البرتقالي النابض بالحياة (#ff6b35)
- **الألوان الثانوية**: البرتقالي المكمل (#ff8c42)
- **الألوان الدلالية**: النجاح، التحذير، الخطأ، المعلومات
- **دعم الثيم المظلم**: ألوان محسنة للوضع المظلم
- **التدرجات**: تدرجات متعددة الألوان جاهزة للاستخدام

### 🔤 نظام الخطوط المركزي
- **الخطوط الأساسية**: نظام الخطوط المحلية
- **الخطوط العربية**: دعم كامل للغة العربية
- **الخطوط الأحادية**: للكود والبيانات التقنية
- **الخطوط العرضية**: للعناوين والعناوين الرئيسية
- **الخطوط المتجاوبة**: أحجام خطوط تتكيف مع حجم الشاشة

### 📏 نظام الستايل المركزي
- **المسافات**: نظام مسافات متدرج ومنطقي
- **الحدود**: أنماط وأحجام حدود متنوعة
- **الظلال**: ظلال متدرجة وظلال ملونة
- **الأنيميشن**: انتقالات وأنيميشن مخصصة
- **التحويلات**: تحويلات CSS متقدمة

## الاستخدام

### استيراد النظام

```css
/* في ملف CSS */
@import '../styles/design-system/index.css';
```

### استخدام الألوان

```css
/* استخدام متغيرات CSS */
.my-element {
  background-color: var(--color-primary-500);
  color: var(--color-text-primary);
  border-color: var(--color-border-primary);
}

/* استخدام فئات Tailwind */
<div class="bg-primary text-white border-primary">
  محتوى العنصر
</div>
```

### استخدام الخطوط

```css
/* استخدام متغيرات CSS */
.my-text {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

/* استخدام فئات مخصصة */
<h1 class="heading-1">عنوان رئيسي</h1>
<p class="body-text">نص أساسي</p>
```

### استخدام المسافات والستايلات

```css
/* استخدام متغيرات CSS */
.my-container {
  padding: var(--spacing-6);
  margin: var(--spacing-4);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

/* استخدام فئات Tailwind */
<div class="p-6 m-4 rounded-lg shadow-lg">
  محتوى العنصر
</div>
```

## الفئات المتاحة

### فئات الألوان
- `.bg-primary`, `.bg-secondary`, `.bg-accent`
- `.text-primary`, `.text-secondary`, `.text-accent`
- `.border-primary`, `.border-secondary`, `.border-accent`
- `.gradient-primary`, `.gradient-secondary`, `.gradient-brand`

### فئات الخطوط
- `.font-primary`, `.font-arabic`, `.font-mono`, `.font-display`
- `.heading-1`, `.heading-2`, `.heading-3`, `.heading-4`, `.heading-5`, `.heading-6`
- `.body-text`, `.body-text-large`, `.body-text-small`
- `.caption-text`, `.label-text`, `.code-text`, `.quote-text`

### فئات الستايل
- `.p-*`, `.m-*` (المسافات)
- `.rounded-*` (نصف قطر الحدود)
- `.shadow-*` (الظلال)
- `.animate-*` (الأنيميشن)
- `.transition-*` (الانتقالات)

## التخصيص

### إضافة ألوان جديدة

```css
:root {
  --color-custom-500: #your-color;
  --color-custom-600: #your-darker-color;
}
```

### إضافة خطوط جديدة

```css
:root {
  --font-family-custom: 'Your Font', sans-serif;
}
```

### إضافة مسافات جديدة

```css
:root {
  --spacing-custom: 2.5rem;
}
```

## الوصولية

النظام يدعم:
- **الحركة المقللة**: `prefers-reduced-motion`
- **التباين العالي**: `prefers-contrast: high`
- **الوضع المظلم**: `prefers-color-scheme: dark`
- **الطباعة**: إعدادات محسنة للطباعة

## الاستجابة

النظام متجاوب بالكامل:
- **الشاشات الصغيرة**: أقل من 640px
- **الشاشات المتوسطة**: 768px - 1023px
- **الشاشات الكبيرة**: 1024px - 1279px
- **الشاشات الكبيرة جداً**: 1280px وأكثر

## دعم اللغة العربية

النظام يدعم اللغة العربية بالكامل:
- **اتجاه RTL**: دعم كامل للاتجاه من اليمين لليسار
- **الخطوط العربية**: خطوط محسنة للعربية
- **أحجام الخطوط**: أحجام محسنة للعربية
- **المسافات**: مسافات مناسبة للعربية

## الأداء

النظام محسن للأداء:
- **CSS Variables**: استخدام متغيرات CSS للسرعة
- **Tree Shaking**: إزالة الكود غير المستخدم
- **Compression**: ضغط CSS محسن
- **Caching**: تخزين مؤقت فعال

## التطوير

### إضافة مكونات جديدة

```css
.my-component {
  /* استخدام متغيرات النظام */
  background-color: var(--color-bg-surface);
  border: var(--border-width-1) solid var(--color-border-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  
  /* استخدام الانتقالات */
  transition: var(--transition-all);
}

.my-component:hover {
  background-color: var(--color-interactive-hover);
  box-shadow: var(--shadow-md);
}
```

### إضافة أنيميشن جديدة

```css
@keyframes myAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-my-animation {
  animation: myAnimation var(--duration-500) var(--ease-in-out) infinite;
}
```

## الصيانة

### تحديث الألوان
1. عدّل المتغيرات في `colors.css`
2. اختبر التغييرات في جميع المكونات
3. تأكد من الوصولية والتباين

### تحديث الخطوط
1. عدّل المتغيرات في `typography.css`
2. اختبر الخطوط في جميع اللغات
3. تأكد من الأداء والتحميل

### تحديث المسافات
1. عدّل المتغيرات في `spacing.css`
2. اختبر التخطيط في جميع الأحجام
3. تأكد من الاستجابة

## الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل:
- راجع الوثائق
- اختبر في متصفحات مختلفة
- تأكد من التوافق مع Tailwind CSS

---

**تم تطوير هذا النظام خصيصاً لمشروع مُعين لضمان تجربة مستخدم متسقة ومتجاوبة.**
