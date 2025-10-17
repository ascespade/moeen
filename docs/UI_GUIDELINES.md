# 🎨 UI Guidelines - دليل المكونات

## 📚 Table of Contents

1. [Import Guidelines](#import-guidelines)
2. [Color System](#color-system)
3. [Component Sizes](#component-sizes)
4. [Spacing](#spacing)
5. [Typography](#typography)
6. [Best Practices](#best-practices)

---

## 📦 Import Guidelines

### ✅ CORRECT - Use Central Exports

```typescript
// Import from central location
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { ErrorBoundary, OptimizedImage } from '@/components/common';

// Or from main export
import { Button, Card, ErrorBoundary } from '@/components';
```

### ❌ WRONG - Individual File Imports

```typescript
// DON'T DO THIS
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
```

---

## 🎨 Color System

### Brand Colors

```typescript
// ✅ CORRECT
<div className="bg-brand-primary text-white">
<div className="bg-brand-secondary">
<div className="bg-brand-accent">
```

### Semantic Colors

```typescript
// ✅ CORRECT
<div className="bg-brand-success">  // Green
<div className="bg-brand-warning">  // Yellow
<div className="bg-brand-error">    // Red
```

### Background & Surface

```typescript
// ✅ CORRECT
<div className="bg-background">     // Main background
<div className="bg-surface">        // Cards, panels
<div className="bg-panel">          // Elevated surfaces
```

### Text Colors

```typescript
// ✅ CORRECT
<span className="text-text-primary">    // Primary text
<span className="text-text-secondary">  // Secondary text
<span className="text-text-muted">      // Muted text
```

### ❌ AVOID Hardcoded Colors

```typescript
// ❌ WRONG
<div className="bg-blue-500">
<div className="text-green-600">
<div className="bg-red-50">
<div style={{ color: '#E46C0A' }}>
```

---

## 📏 Component Sizes

### Button Sizes

```typescript
<Button size="xs">Extra Small</Button>  // 24px height
<Button size="sm">Small</Button>        // 32px height
<Button size="md">Medium</Button>       // 40px height (default)
<Button size="lg">Large</Button>        // 48px height
<Button size="xl">Extra Large</Button>  // 56px height
```

### Input Sizes

```typescript
<Input size="sm" />  // 32px height
<Input size="md" />  // 40px height (default)
<Input size="lg" />  // 48px height
```

### Card Padding

```typescript
<Card padding="sm">...</Card>  // 1rem padding
<Card padding="md">...</Card>  // 1.5rem padding (default)
<Card padding="lg">...</Card>  // 2rem padding
```

---

## 📐 Spacing

Use the spacing scale for consistent margins and paddings:

```typescript
// Using Tailwind classes
<div className="p-4">      // 1rem (16px)
<div className="m-6">      // 1.5rem (24px)
<div className="gap-8">    // 2rem (32px)

// Available sizes:
// 1 (0.25rem), 2 (0.5rem), 3 (0.75rem), 4 (1rem)
// 5 (1.25rem), 6 (1.5rem), 8 (2rem), 10 (2.5rem)
// 12 (3rem), 16 (4rem), 20 (5rem), 24 (6rem), 32 (8rem)
```

---

## 📝 Typography

### Font Sizes

```typescript
<h1 className="text-5xl">    // 48px - Main headings
<h2 className="text-4xl">    // 36px - Section headings
<h3 className="text-3xl">    // 30px - Subsection headings
<h4 className="text-2xl">    // 24px - Card titles
<p className="text-base">    // 16px - Body text (default)
<span className="text-sm">   // 14px - Secondary text
<small className="text-xs">  // 12px - Captions
```

### Font Weights

```typescript
<span className="font-light">      // 300
<span className="font-normal">     // 400 (default)
<span className="font-medium">     // 500
<span className="font-semibold">   // 600
<span className="font-bold">       // 700
```

---

## ✨ Best Practices

### 1. Component Variants

Always use the variant prop instead of custom classes:

```typescript
// ✅ CORRECT
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
<Button variant="ghost">Delete</Button>

// ❌ WRONG
<button className="bg-blue-500 text-white px-4 py-2">Save</button>
```

### 2. Consistent Loading States

```typescript
// ✅ CORRECT
import { LoadingSpinner } from '@/components/ui';

{loading && <LoadingSpinner />}
{loading ? <Skeleton /> : <Content />}

// ❌ WRONG
{loading && <div>Loading...</div>}
{loading && <div className="animate-spin">⏳</div>}
```

### 3. Error Boundaries

```typescript
// ✅ CORRECT
import { ErrorBoundary } from '@/components/common';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// ❌ WRONG
try {
  // Don't handle UI errors manually
} catch (e) {
  console.error(e);
}
```

### 4. Responsive Design

```typescript
// ✅ CORRECT - Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="text-sm md:text-base lg:text-lg">
<div className="p-4 md:p-6 lg:p-8">

// ❌ WRONG - Desktop first
<div className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
```

### 5. Dark Mode Support

All components support dark mode automatically through CSS variables:

```typescript
// ✅ CORRECT - Theme-aware
<div className="bg-background text-text-primary">
<Card className="border-border">

// ❌ WRONG - Hard-coded colors
<div className="bg-white text-black">
<div className="border-gray-200">
```

### 6. Accessibility

```typescript
// ✅ CORRECT
<Button aria-label="Close dialog">
  <XIcon />
</Button>

<img src="..." alt="User profile" />

<div role="alert" aria-live="polite">
  {message}
</div>

// ❌ WRONG
<div onClick={handleClick}>Click me</div>
<img src="..." />
<div>{message}</div>
```

### 7. Type Safety

```typescript
// ✅ CORRECT
import type { ButtonProps } from '@/components/ui';

interface MyButtonProps extends ButtonProps {
  customProp: string;
}

// Use TypeScript interfaces
const MyComponent: React.FC<MyButtonProps> = ({ variant, customProp, ...props }) => {
  return <Button variant={variant} {...props} />;
};
```

---

## 🚫 Anti-Patterns

### Don't Use Inline Styles

```typescript
// ❌ WRONG
<div style={{ backgroundColor: '#E46C0A', padding: '16px' }}>

// ✅ CORRECT
<div className="bg-brand-primary p-4">
```

### Don't Mix Design Systems

```typescript
// ❌ WRONG - Mixing Bootstrap and Tailwind
<button className="btn btn-primary bg-blue-500">

// ✅ CORRECT - Use one system
<Button variant="primary">
```

### Don't Create Custom Buttons

```typescript
// ❌ WRONG - Reinventing the wheel
const MyButton = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    {children}
  </button>
);

// ✅ CORRECT - Use existing components
import { Button } from '@/components/ui';
<Button variant="primary">{children}</Button>
```

---

## 📚 Additional Resources

- [Design Tokens Reference](/src/lib/design-tokens.ts)
- [Component Library](/src/components/ui/index.ts)
- [Tailwind Config](/tailwind.config.js)
- [Theme CSS](/src/styles/theme.css)

---

## 🎯 Quick Reference

### Import Pattern
```typescript
import { Button, Card, Input } from '@/components/ui';
```

### Color Pattern
```typescript
bg-brand-primary | bg-brand-success | bg-brand-error
text-text-primary | text-text-secondary
```

### Size Pattern
```typescript
size="sm" | "md" | "lg" | "xl"
```

### Spacing Pattern
```typescript
p-{size} | m-{size} | gap-{size}
// where size: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32
```

---

**Last Updated**: 2025-10-17
**Version**: 1.0.0
