# Design System - نظام التصميم

A comprehensive, centralized design system for the Moeen platform that ensures consistency across all components, colors, typography, and spacing.

نظام تصميم شامل ومركزي لمنصة مُعين يضمن الاتساق عبر جميع المكونات والألوان والخطوط والمسافات.

## 🎨 Features - المميزات

- **Centralized Design Tokens** - رموز التصميم المركزية
- **RTL Support** - دعم الكتابة من اليمين لليسار
- **Dark/Light Theme** - ثيم فاتح/داكن
- **Multi-language Support** - دعم متعدد اللغات
- **Responsive Design** - تصميم متجاوب
- **Accessibility** - إمكانية الوصول
- **TypeScript Support** - دعم TypeScript

## 📁 Structure - الهيكل

```
src/design-system/
├── index.ts              # Main exports
├── tokens.ts             # Design tokens (colors, spacing, etc.)
├── components.ts         # Component definitions
├── utils.ts              # Utility functions
├── hooks.ts              # React hooks
├── types.ts              # TypeScript types
└── README.md             # This file
```

## 🚀 Quick Start - البدء السريع

### 1. Import the Design System

```tsx
import { useTheme, useLanguage, BRAND_COLORS } from '@/design-system';
```

### 2. Use Design System Hooks

```tsx
function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  const { language, direction } = useLanguage();
  
  return (
    <div className="bg-brand-primary text-white p-4">
      Current theme: {theme}
      Current language: {language}
    </div>
  );
}
```

### 3. Use Design System Components

```tsx
import { ThemeSwitcher, LanguageSwitcher } from '@/components';

function Header() {
  return (
    <header>
      <ThemeSwitcher variant="dropdown" />
      <LanguageSwitcher variant="toggle" />
    </header>
  );
}
```

## 🎨 Design Tokens - رموز التصميم

### Colors - الألوان

```tsx
import { BRAND_COLORS } from '@/design-system';

// Primary colors
const primary = BRAND_COLORS.primary.DEFAULT; // #f58220
const primaryHover = BRAND_COLORS.primary.hover; // #d66f15

// Secondary colors
const secondary = BRAND_COLORS.secondary.DEFAULT; // #a18072

// Status colors
const success = BRAND_COLORS.status.success; // #009688
const warning = BRAND_COLORS.status.warning; // #f59e0b
const error = BRAND_COLORS.status.error; // #ef4444
```

### Spacing - المسافات

```tsx
import { SPACING } from '@/design-system';

const padding = SPACING[4]; // 1rem (16px)
const margin = SPACING[8];  // 2rem (32px)
```

### Typography - الخطوط

```tsx
import { TYPOGRAPHY } from '@/design-system';

const fontFamily = TYPOGRAPHY.fontFamily.sans; // ['Cairo', 'Inter', ...]
const fontSize = TYPOGRAPHY.fontSize.lg; // ['1.125rem', { lineHeight: '1.75rem' }]
```

## 🧩 Components - المكونات

### Button - الزر

```tsx
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/design-system';

// Use with Tailwind classes
<button className="ds-button ds-button-primary ds-button-md">
  Click me
</button>
```

### Card - البطاقة

```tsx
<div className="ds-card ds-card-elevated ds-card-md">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Input - حقل الإدخال

```tsx
<input 
  className="ds-input ds-input-md" 
  placeholder="Enter text..."
/>
```

## 🎛️ Hooks - الخطافات

### useTheme - خطاف الثيم

```tsx
import { useTheme } from '@/design-system/hooks';

function ThemeToggle() {
  const { 
    theme, 
    toggleTheme, 
    setLightTheme, 
    setDarkTheme,
    isLight,
    isDark 
  } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isLight ? '🌙' : '☀️'} {theme}
    </button>
  );
}
```

### useLanguage - خطاف اللغة

```tsx
import { useLanguage } from '@/design-system/hooks';

function LanguageToggle() {
  const { 
    language, 
    toggleLanguage, 
    setArabic, 
    setEnglish,
    isArabic,
    isEnglish,
    direction 
  } = useLanguage();

  return (
    <button onClick={toggleLanguage}>
      {isArabic ? '🇺🇸' : '🇸🇦'} {language}
    </button>
  );
}
```

### useRTL - خطاف RTL

```tsx
import { useRTL } from '@/design-system/hooks';

function RTLComponent() {
  const { isRTL, getRTLValue, getRTLClass } = useRTL();

  return (
    <div className={getRTLClass('text-left', 'text-right')}>
      {getRTLValue('Left', 'Right')} aligned text
    </div>
  );
}
```

## 🌙 Theme System - نظام الثيم

### Light Theme - الثيم الفاتح

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --brand-primary: #f58220;
  --brand-secondary: #a18072;
}
```

### Dark Theme - الثيم الداكن

```css
[data-theme="dark"] {
  --background: #0d1117;
  --foreground: #e5eef7;
  --brand-primary: #f58220;
  --brand-secondary: #a18072;
}
```

## 🔄 RTL Support - دعم RTL

The design system automatically handles RTL layout:

```css
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .text-left {
  text-align: right;
}

[dir="rtl"] .text-right {
  text-align: left;
}
```

## 📱 Responsive Design - التصميم المتجاوب

```tsx
import { useBreakpoint } from '@/design-system/hooks';

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <div className={`
      ${isMobile ? 'text-sm' : ''}
      ${isTablet ? 'text-base' : ''}
      ${isDesktop ? 'text-lg' : ''}
    `}>
      Responsive text
    </div>
  );
}
```

## 🎯 Best Practices - أفضل الممارسات

### 1. Use Design Tokens - استخدم رموز التصميم

```tsx
// ✅ Good
<div style={{ color: BRAND_COLORS.primary.DEFAULT }}>

// ❌ Bad
<div style={{ color: '#f58220' }}>
```

### 2. Use Design System Classes - استخدم فئات نظام التصميم

```tsx
// ✅ Good
<button className="ds-button ds-button-primary">

// ❌ Bad
<button className="bg-orange-500 text-white px-4 py-2 rounded">
```

### 3. Use Hooks for State - استخدم الخطافات للحالة

```tsx
// ✅ Good
const { theme, toggleTheme } = useTheme();

// ❌ Bad
const [theme, setTheme] = useState('light');
```

## 🔧 Customization - التخصيص

### Custom Colors - ألوان مخصصة

```tsx
// In your component
const customColors = {
  primary: '#your-color',
  secondary: '#your-secondary-color',
};
```

### Custom Spacing - مسافات مخصصة

```tsx
// In your component
const customSpacing = {
  'custom-1': '0.5rem',
  'custom-2': '1.5rem',
};
```

## 🐛 Troubleshooting - استكشاف الأخطاء

### Common Issues - المشاكل الشائعة

1. **Theme not applying** - الثيم لا يطبق
   - Check if `DesignSystemProvider` wraps your app
   - Verify theme is set in localStorage

2. **RTL not working** - RTL لا يعمل
   - Ensure `useLanguage` hook is used
   - Check if `dir` attribute is set on html

3. **Colors not updating** - الألوان لا تتحدث
   - Verify CSS variables are defined
   - Check if Tailwind config is updated

## 📚 API Reference - مرجع API

### Design Tokens - رموز التصميم

- `BRAND_COLORS` - Brand color palette
- `SPACING` - Spacing scale
- `TYPOGRAPHY` - Typography scale
- `BORDER_RADIUS` - Border radius values
- `SHADOWS` - Shadow definitions
- `BREAKPOINTS` - Responsive breakpoints
- `Z_INDEX` - Z-index scale
- `ANIMATION` - Animation durations and easing

### Hooks - الخطافات

- `useTheme()` - Theme management
- `useLanguage()` - Language management
- `useRTL()` - RTL utilities
- `useBreakpoint()` - Responsive breakpoints
- `useAnimation()` - Animation state
- `useFocus()` - Focus management
- `useValidation()` - Form validation
- `useDesignSystemStorage()` - Local storage

### Components - المكونات

- `ThemeSwitcher` - Theme switching component
- `LanguageSwitcher` - Language switching component

## 🤝 Contributing - المساهمة

1. Follow the existing patterns
2. Update types when adding new tokens
3. Add tests for new functionality
4. Update documentation

## 📄 License - الترخيص

This design system is part of the Moeen platform and follows the same license terms.
