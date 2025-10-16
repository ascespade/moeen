# Centralized Theme System - نظام الثيم المركزي

## نظرة عامة - Overview

نظام الثيم المركزي هو المصدر الوحيد للحقيقة لجميع رموز التصميم والألوان والخطوط والمسافات وأنماط المكونات في التطبيق بأكمله.

The Centralized Theme System is the single source of truth for all design tokens, colors, typography, spacing, and component styles across the entire application.

## الملفات الرئيسية - Main Files

### 1. الملف الرئيسي - Main File
```
src/lib/centralized-theme.ts
```
- يحتوي على جميع الألوان والخطوط والمسافات
- يدير الثيمات الفاتحة والداكنة
- يوفر فئات CSS جاهزة للمكونات

### 2. سياق React - React Context
```
src/context/ThemeContext.tsx
```
- يدير حالة الثيم في التطبيق
- يوفر دوال تبديل الثيم
- يدعم الوضع المظلم والفاتح

### 3. مكون تبديل الثيم - Theme Switcher Component
```
src/components/common/ThemeSwitcher.tsx
```
- زر تبديل الثيم
- يدعم الثيمات: فاتح، مظلم، نظام

### 4. CSS المركزي - Centralized CSS
```
src/styles/centralized.css
```
- فئات CSS جاهزة للمكونات
- متغيرات CSS للثيمات

## الاستخدام - Usage

### 1. إعداد المزود - Provider Setup

```tsx
import { ThemeProvider } from '@/context/ThemeContext';

function App({ children }) {
  return (
    <ThemeProvider 
      defaultTheme="light"
      defaultLanguage="ar"
      enableSystemTheme={true}
      enableLanguageSwitching={true}
    >
      {children}
    </ThemeProvider>
  );
}
```

### 2. استخدام الثيم - Using Theme

```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { theme, setTheme, isDark, isLight } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### 3. استخدام فئات CSS - Using CSS Classes

```tsx
import { COMPONENT_CLASSES } from '@/lib/centralized-theme';

function MyButton() {
  return (
    <button className={COMPONENT_CLASSES['btn-brand']}>
      Click me
    </button>
  );
}
```

### 4. استخدام مكون تبديل الثيم - Using Theme Switcher

```tsx
import ThemeSwitcher from '@/components/common/ThemeSwitcher';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeSwitcher 
        showLabel={true}
        size="md"
        variant="default"
      />
    </header>
  );
}
```

## الألوان - Colors

### الألوان الأساسية - Brand Colors

```typescript
const BRAND_COLORS = {
  primary: '#E46C0A',        // البرتقالي الأساسي
  primaryHover: '#D45F08',   // البرتقالي عند التمرير
  secondary: '#6B4E16',      // البني الثانوي
  neutralBeige: '#F2E7DC',   // البيج المحايد
  accent: '#007bff',         // الأزرق المميز
  accentDeep: '#C93C00',     // الأحمر البرتقالي العميق
  success: '#009688',        // الأخضر للنجاح
  warning: '#f59e0b',        // الأصفر للتحذير
  error: '#ef4444',          // الأحمر للخطأ
  info: '#007bff',           // الأزرق للمعلومات
};
```

### ألوان الثيم - Theme Colors

```typescript
// Light Theme - الثيم الفاتح
const light = {
  background: '#ffffff',
  foreground: '#0f172a',
  surface: '#f9fafb',
  panel: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  textSecondary: '#6b7280',
  muted: '#f3f4f6',
};

// Dark Theme - الثيم المظلم
const dark = {
  background: '#0d1117',
  foreground: '#e5eef7',
  surface: '#0d1117',
  panel: '#111827',
  border: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  muted: '#1f2937',
};
```

## الخطوط - Typography

```typescript
const TYPOGRAPHY = {
  fontFamily: {
    sans: 'var(--font-cairo), var(--font-inter), "Cairo", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", monaco, consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  },
};
```

## المسافات - Spacing

```typescript
const SPACING = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  // ... المزيد
};
```

## فئات المكونات - Component Classes

### الأزرار - Buttons

```typescript
const COMPONENT_CLASSES = {
  btn: 'inline-flex items-center justify-center gap-2 px-6 py-3 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
  'btn-brand': 'bg-brand-primary text-white hover:bg-brand-primary-hover hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
  'btn-secondary': 'bg-brand-surface text-foreground border border-brand-border hover:bg-panel hover:-translate-y-0.5 active:translate-y-0',
  'btn-outline': 'bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white hover:-translate-y-0.5 active:translate-y-0',
  'btn-ghost': 'bg-transparent text-foreground hover:bg-brand-surface hover:-translate-y-0.5 active:translate-y-0',
  'btn-sm': 'px-4 py-2 text-xs',
  'btn-lg': 'px-8 py-4 text-base',
};
```

### البطاقات - Cards

```typescript
const COMPONENT_CLASSES = {
  card: 'bg-panel border border-brand-border rounded-lg transition-all duration-150',
  'card-hover': 'hover:-translate-y-1 hover:shadow-lg cursor-pointer',
  'card-elevated': 'shadow-lg',
  'card-interactive': 'cursor-pointer hover:-translate-y-2 hover:shadow-xl',
};
```

### النماذج - Forms

```typescript
const COMPONENT_CLASSES = {
  'form-input': 'w-full px-4 py-3 border border-brand-border rounded-md bg-panel text-foreground text-sm transition-all duration-150 focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 placeholder:text-brand-border',
  'form-label': 'block text-sm font-medium text-foreground mb-2',
  'form-error': 'text-brand-error text-xs mt-1',
  'form-help': 'text-brand-border text-xs mt-1',
};
```

### الشارات - Badges

```typescript
const COMPONENT_CLASSES = {
  badge: 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
  'badge-success': 'bg-brand-success/10 text-brand-success',
  'badge-warning': 'bg-brand-warning/10 text-brand-warning',
  'badge-error': 'bg-brand-error/12 text-brand-error',
  'badge-info': 'bg-brand-accent/12 text-brand-accent',
  'badge-brand': 'bg-brand-primary/10 text-brand-primary',
};
```

## المتغيرات CSS - CSS Variables

```css
:root {
  /* Brand Colors - ألوان العلامة التجارية */
  --brand-primary: #E46C0A;
  --brand-primary-hover: #D45F08;
  --brand-secondary: #6B4E16;
  --brand-neutral-beige: #F2E7DC;
  --brand-accent: #007bff;
  --brand-accent-deep: #C93C00;
  --brand-success: #009688;
  --brand-warning: #f59e0b;
  --brand-error: #ef4444;
  --brand-info: #007bff;

  /* Theme Colors - ألوان الثيم */
  --background: #ffffff;
  --foreground: #0f172a;
  --brand-surface: #f9fafb;
  --panel: #ffffff;
  --brand-border: #e5e7eb;
  --text: #111827;
  --text-secondary: #6b7280;
  --muted: #f3f4f6;
}
```

## دعم RTL - RTL Support

النظام يدعم الكتابة من اليمين لليسار (RTL) للغة العربية:

```css
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .btn {
  flex-direction: row-reverse;
}

[dir="rtl"] .card {
  text-align: right;
}
```

## الحركات - Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
```

## التصميم المتجاوب - Responsive Design

```css
@media (max-width: 640px) {
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }
}

@media (min-width: 768px) {
  .btn-lg {
    padding: 1.25rem 2.5rem;
    font-size: 1.125rem;
  }
}
```

## أفضل الممارسات - Best Practices

### 1. استخدام فئات CSS - Using CSS Classes

```tsx
// ✅ جيد - Good
<button className={COMPONENT_CLASSES['btn-brand']}>
  Click me
</button>

// ❌ سيء - Bad
<button className="bg-orange-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

### 2. استخدام سياق الثيم - Using Theme Context

```tsx
// ✅ جيد - Good
const { theme, setTheme, isDark } = useTheme();

// ❌ سيء - Bad
const [theme, setTheme] = useState('light');
```

### 3. استخدام المتغيرات CSS - Using CSS Variables

```css
/* ✅ جيد - Good */
.my-component {
  background-color: var(--brand-primary);
  color: var(--text);
}

/* ❌ سيء - Bad */
.my-component {
  background-color: #E46C0A;
  color: #111827;
}
```

## التطوير - Development

### إضافة لون جديد - Adding New Color

1. أضف اللون إلى `BRAND_COLORS` في `centralized-theme.ts`
2. أضف متغير CSS في `centralized.css`
3. أضف فئة مكون إذا لزم الأمر

### إضافة مكون جديد - Adding New Component

1. أضف فئات CSS إلى `COMPONENT_CLASSES`
2. أضف الأنماط إلى `centralized.css`
3. أنشئ مكون React إذا لزم الأمر

### إضافة ثيم جديد - Adding New Theme

1. أضف ألوان الثيم إلى `BRAND_COLORS`
2. أضف متغيرات CSS في `centralized.css`
3. حدث `generateCSSVariables` function

## الدعم - Support

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير.

For help or inquiries, please contact the development team.

---

**آخر تحديث - Last Updated:** ${new Date().toLocaleDateString('ar-SA')}
**الإصدار - Version:** 1.0.0