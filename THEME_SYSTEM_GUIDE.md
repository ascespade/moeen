# دليل نظام الثيمات المركزي - Centralized Theme System Guide

## نظرة عامة - Overview

تم إنشاء نظام ثيمات مركزي احترافي لحل مشاكل التعارض والتغيير غير المرغوب فيه للألوان. النظام يوفر:

- **مصدر واحد للحقيقة** لجميع الألوان والثيمات
- **منع التعارضات** بين ملفات الثيمات المختلفة
- **تطبيق فوري** للثيمات بدون تأخير
- **دعم كامل** للثيمات الفاتحة والداكنة والنظام
- **رموز تصميم مركزية** قابلة للتخصيص

## الملفات الرئيسية - Core Files

```
src/core/theme/
├── ThemeManager.ts          # مدير الثيمات المركزي
├── ThemeProvider.tsx        # موفر الثيم React
├── ThemeStyles.ts           # أنماط الثيم CSS-in-JS
└── index.ts                 # صادرات النظام

src/styles/
└── theme.css               # أنماط CSS المركزية

src/components/theme/
├── ThemeToggle.tsx          # مكون تبديل الثيم
└── ThemeTest.tsx           # مكون اختبار النظام
```

## الاستخدام الأساسي - Basic Usage

### 1. إعداد التطبيق - App Setup

```tsx
// src/app/layout.tsx
import { ThemeProvider } from '@/core/theme';
import '@/styles/theme.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. استخدام الثيم في المكونات - Using Theme in Components

```tsx
import { useTheme, useThemeAware } from '@/core/theme';

function MyComponent() {
  const { theme, isDark, isLight, setTheme } = useTheme();
  const { getThemeClass, getThemeValue } = useThemeAware();

  return (
    <div className={getThemeClass('bg-white', 'bg-gray-900')}>
      <h1 className="text-text-primary">
        الثيم الحالي: {theme}
      </h1>
      <button onClick={() => setTheme('dark')}>
        تفعيل الثيم الداكن
      </button>
    </div>
  );
}
```

### 3. استخدام الألوان - Using Colors

```tsx
// استخدام ألوان الثيم
<div className="bg-background text-text-primary">
  <div className="bg-brand-primary text-white">
    لون أساسي
  </div>
  <div className="bg-surface border border-border">
    خلفية وحدود
  </div>
</div>
```

## المكونات المتاحة - Available Components

### ThemeToggle

```tsx
import { ThemeToggle, ThemeStatus } from '@/components/theme/ThemeToggle';

// مفتاح تبديل بسيط
<ThemeToggle />

// مفتاح مع تسميات
<ThemeToggle showLabels size="lg" />

// مؤشر حالة الثيم
<ThemeStatus />
```

### ThemeTest

```tsx
import { ThemeTest } from '@/components/theme/ThemeTest';

// صفحة اختبار شاملة
<ThemeTest />
```

## رموز التصميم - Design Tokens

### الألوان - Colors

```tsx
import { useDesignTokens } from '@/core/theme';

function ColorPalette() {
  const tokens = useDesignTokens();
  
  return (
    <div>
      <div style={{ backgroundColor: tokens.colors.brand.primary }}>
        لون أساسي
      </div>
      <div style={{ backgroundColor: tokens.colors.brand.secondary }}>
        لون ثانوي
      </div>
    </div>
  );
}
```

### CSS Variables

```css
/* استخدام متغيرات CSS */
.my-component {
  background-color: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

## Tailwind CSS Integration

### الألوان المتاحة - Available Colors

```tsx
// ألوان العلامة التجارية
bg-brand-primary
text-brand-primary
border-brand-primary

// ألوان الثيم
bg-background
text-text-primary
border-border

// ألوان محايدة
bg-neutral-100
text-neutral-900
border-neutral-200
```

### Classes المساعدة - Utility Classes

```tsx
// خلفيات الثيم
.bg-theme-primary
.bg-theme-secondary
.bg-theme-panel

// نصوص الثيم
.text-theme-primary
.text-theme-secondary
.text-theme-muted

// حدود الثيم
.border-theme-primary
.border-theme-accent

// حالات التفاعل
.hover-theme:hover
.active-theme:active
.focus-theme:focus
```

## التخصيص - Customization

### تخصيص الألوان - Customizing Colors

```tsx
// في ThemeManager.ts
private readonly designTokens: DesignTokens = {
  colors: {
    brand: {
      primary: '#E46C0A',        // اللون الأساسي
      primaryHover: '#D45F08',   // لون التمرير
      secondary: '#6B4E16',      // اللون الثانوي
      // ... المزيد
    }
  }
};
```

### إضافة ألوان جديدة - Adding New Colors

```tsx
// 1. أضف اللون في ThemeManager.ts
brand: {
  // ... الألوان الموجودة
  newColor: '#FF6B6B',
}

// 2. أضف متغير CSS في theme.css
:root {
  --brand-new-color: #FF6B6B;
}

// 3. أضف في tailwind.config.js
colors: {
  brand: {
    // ... الألوان الموجودة
    "new-color": "var(--brand-new-color)",
  }
}
```

## حل المشاكل - Troubleshooting

### مشكلة تغيير الألوان بعد التحميل

**السبب**: تعارض بين أنظمة ثيمات متعددة

**الحل**: 
1. تأكد من استخدام `ThemeProvider` الجديد فقط
2. احذف أوامر `import` للثيمات القديمة
3. تأكد من تحميل `theme.css` بدلاً من `unified.css`

### مشكلة عدم تطبيق الثيم الداكن

**السبب**: عدم تطبيق متغيرات CSS بشكل صحيح

**الحل**:
1. تأكد من وجود `[data-theme="dark"]` في CSS
2. تحقق من تطبيق المتغيرات في `ThemeManager`
3. تأكد من عدم وجود CSS متضارب

### مشكلة Hydration Mismatch

**السبب**: اختلاف بين الخادم والعميل

**الحل**: 
النظام يتعامل مع هذه المشكلة تلقائياً باستخدام `suppressHydrationWarning`

## أفضل الممارسات - Best Practices

### 1. استخدام CSS Variables

```css
/* ✅ جيد */
.my-component {
  background-color: var(--background);
  color: var(--text-primary);
}

/* ❌ تجنب */
.my-component {
  background-color: #ffffff;
  color: #000000;
}
```

### 2. استخدام Theme-Aware Classes

```tsx
// ✅ جيد
<div className="bg-panel text-text-primary border-border">

// ❌ تجنب
<div className="bg-white text-black border-gray-300">
```

### 3. استخدام Hooks المناسبة

```tsx
// ✅ للثيم العام
const { theme, setTheme } = useTheme();

// ✅ للتنسيق المراعي للثيم
const { getThemeClass } = useThemeAware();

// ✅ لرموز التصميم
const tokens = useDesignTokens();
```

## الاختبار - Testing

### اختبار النظام

1. انتقل إلى `/theme-test`
2. جرب تبديل الثيمات
3. تحقق من تطبيق الألوان بشكل صحيح
4. تأكد من عدم تغيير الألوان بعد التحميل

### اختبار المكونات

```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/core/theme';

test('renders with theme', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
  
  expect(screen.getByText('الثيم الحالي')).toBeInTheDocument();
});
```

## الدعم - Support

للمساعدة أو الإبلاغ عن مشاكل:

1. تحقق من ملف `ThemeTest.tsx` للاختبار
2. راجع `ThemeManager.ts` للتفاصيل التقنية
3. استخدم `ThemeStatus` لمتابعة حالة الثيم

---

**ملاحظة**: هذا النظام يحل مشكلة تغيير الألوان بعد التحميل ويوفر نظام ثيمات مركزي احترافي ومستقر.
