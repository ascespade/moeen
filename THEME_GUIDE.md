# Theme System Guide - دليل نظام الثيم

## Overview - نظرة عامة

The theme system provides comprehensive light/dark theme support with RTL compatibility, CSS variables, and persistent user preferences for the healthcare dashboard.

## Features - الميزات

### Theme Modes - أوضاع الثيم

1. **Light Mode** - الوضع المضيء
   - Clean, bright interface
   - High contrast text
   - Professional appearance

2. **Dark Mode** - الوضع المظلم
   - Reduced eye strain
   - Modern appearance
   - Battery saving on OLED displays

3. **System Mode** - وضع النظام
   - Follows OS preference
   - Automatic switching
   - Seamless experience

### RTL Support - دعم الكتابة من اليمين لليسار

- **Automatic direction detection** based on language
- **CSS logical properties** for consistent spacing
- **Icon and layout mirroring** for RTL interface
- **Chart components** adapt to RTL layout

## Architecture - المعمارية

### Components - المكونات

1. **ThemeContext** - سياق الثيم
   - Theme state management
   - CSS variable application
   - RTL direction handling

2. **ThemeProvider** - موفر الثيم
   - Context provider for theme state
   - localStorage persistence
   - System preference detection

3. **ThemeSwitcher** - مبدل الثيم
   - User interface for theme switching
   - Accessible controls
   - Visual feedback

4. **CSS Variables** - متغيرات CSS
   - Dynamic color system
   - Theme-specific values
   - Consistent theming

## Usage - الاستخدام

### Basic Usage - الاستخدام الأساسي

```tsx
import { useTheme } from '@/context/ThemeContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';

function MyComponent() {
  const { theme, isDark, isLight, isSystem, toggleTheme } = useTheme();

  return (
    <div>
      <h1>Current theme: {theme}</h1>
      <p>Is dark mode: {isDark ? 'Yes' : 'No'}</p>

      <ThemeSwitcher />

      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Advanced Usage - الاستخدام المتقدم

```tsx
import { useTheme } from '@/context/ThemeContext';

function AdvancedComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Set specific theme
  const handleSetLight = () => setTheme('light');
  const handleSetDark = () => setTheme('dark');
  const handleSetSystem = () => setTheme('system');

  return (
    <div>
      <h1>
        Theme: {theme} (Resolved: {resolvedTheme})
      </h1>

      <div className='theme-controls'>
        <button onClick={handleSetLight}>Light</button>
        <button onClick={handleSetDark}>Dark</button>
        <button onClick={handleSetSystem}>System</button>
      </div>
    </div>
  );
}
```

### CSS Variables Usage - استخدام متغيرات CSS

```css
/* Use CSS variables in your styles */
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--brand-border);
}

.my-button {
  background-color: var(--brand-primary);
  color: var(--foreground);
}

.my-button:hover {
  background-color: var(--brand-primary-hover);
}
```

## CSS Variables - متغيرات CSS

### Light Theme Variables - متغيرات الثيم المضيء

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --brand-primary: #e46c0a;
  --brand-primary-hover: #d45f08;
  --brand-secondary: #6b4e16;
  --brand-neutral-beige: #f2e7dc;
  --brand-accent: #007bff;
  --brand-accent-deep: #c93c00;
  --brand-success: #009688;
  --brand-warning: #f59e0b;
  --brand-error: #ef4444;
  --brand-border: #e5e7eb;
  --brand-surface: #f9fafb;
  --panel: #ffffff;
  --focus-ring: #007bff;
}
```

### Dark Theme Variables - متغيرات الثيم المظلم

```css
[data-theme='dark'] {
  --background: #0d1117;
  --foreground: #e5eef7;
  --brand-primary: #e46c0a;
  --brand-primary-hover: #d45f08;
  --brand-secondary: #6b4e16;
  --brand-neutral-beige: #2a2520;
  --brand-accent: #007bff;
  --brand-accent-deep: #c93c00;
  --brand-success: #00b39b;
  --brand-warning: #fbbf24;
  --brand-error: #f87171;
  --brand-border: #1f2937;
  --brand-surface: #0d1117;
  --panel: #111827;
  --focus-ring: #007bff;
}
```

## Brand Colors - الألوان الأساسية

### Solid Brand Colors - الألوان الأساسية الصلبة

- **Primary Orange**: #E46C0A
- **Primary Hover**: #D45F08
- **Secondary Brown**: #6B4E16
- **Neutral Beige**: #F2E7DC (Light) / #2A2520 (Dark)
- **Accent Blue**: #007bff
- **Accent Deep**: #C93C00
- **Success**: #009688 (Light) / #00b39b (Dark)
- **Warning**: #f59e0b (Light) / #fbbf24 (Dark)
- **Error**: #ef4444 (Light) / #f87171 (Dark)

### Color Usage - استخدام الألوان

```tsx
// Use brand colors in components
const brandColors = {
  primary: 'var(--brand-primary)',
  secondary: 'var(--brand-secondary)',
  accent: 'var(--brand-accent)',
  success: 'var(--brand-success)',
  warning: 'var(--brand-warning)',
  error: 'var(--brand-error)',
};
```

## RTL Support - دعم الكتابة من اليمين لليسار

### Implementation - التنفيذ

```tsx
// Automatic RTL detection and application
useEffect(() => {
  const root = document.documentElement;
  const direction = root.getAttribute('dir') || 'rtl';
  root.setAttribute('dir', direction);
}, []);
```

### CSS Logical Properties - الخصائص المنطقية CSS

```css
/* Use logical properties for RTL support */
.my-component {
  margin-inline-start: 1rem; /* margin-left in LTR, margin-right in RTL */
  margin-inline-end: 1rem; /* margin-right in LTR, margin-left in RTL */
  padding-inline-start: 0.5rem;
  padding-inline-end: 0.5rem;
  text-align: start; /* left in LTR, right in RTL */
}
```

### Chart RTL Support - دعم الرسوم البيانية RTL

```tsx
// Charts automatically adapt to RTL
const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

<AreaChart
  data={data}
  margin={{
    right: isRTL ? 30 : 30,
    left: isRTL ? 30 : 0,
  }}
/>;
```

## Theme Switching - تبديل الثيم

### ThemeSwitcher Component - مكون مبدل الثيم

```tsx
import ThemeSwitcher from '@/components/ThemeSwitcher';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeSwitcher size='md' showLabel={true} />
    </header>
  );
}
```

### Props - الخصائص

- `size`: 'sm' | 'md' | 'lg' - Button size
- `showLabel`: boolean - Show theme label
- `className`: string - Additional CSS classes

### Custom Theme Switcher - مبدل ثيم مخصص

```tsx
function CustomThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <select value={theme} onChange={e => setTheme(e.target.value as Theme)}>
      <option value='light'>Light</option>
      <option value='dark'>Dark</option>
      <option value='system'>System</option>
    </select>
  );
}
```

## Persistence - الاستمرارية

### localStorage Integration - تكامل localStorage

```tsx
// Theme preference is automatically saved
const savedTheme = localStorage.getItem('theme') as Theme;
if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
  setThemeState(savedTheme);
}
```

### System Preference Detection - كشف تفضيل النظام

```tsx
// Listen for system theme changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', updateResolvedTheme);
```

## Performance - الأداء

### CSS Variable Updates - تحديث متغيرات CSS

```tsx
// Efficient CSS variable updates
Object.entries(themeVariables).forEach(([property, value]) => {
  root.style.setProperty(property, value);
});
```

### Theme Context Optimization - تحسين سياق الثيم

```tsx
// Memoized theme values
const value = useMemo(
  () => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  }),
  [theme, resolvedTheme]
);
```

## Accessibility - إمكانية الوصول

### ARIA Labels - تسميات ARIA

```tsx
<button
  onClick={toggleTheme}
  aria-label={getAriaLabel()}
  title={getAriaLabel()}
>
  {getIcon()}
  {showLabel && <span>{getLabel()}</span>}
</button>
```

### Focus Management - إدارة التركيز

```tsx
// Focus ring for keyboard navigation
.focus\:ring-2:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

## Testing - الاختبار

### Theme Testing - اختبار الثيم

```tsx
// Test component with different themes
function TestThemes() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h1>Current theme: {theme}</h1>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

### RTL Testing - اختبار RTL

```tsx
// Test RTL layout
function TestRTL() {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
  }, []);

  return <div>RTL Test Content</div>;
}
```

## Troubleshooting - استكشاف الأخطاء وإصلاحها

### Common Issues - المشاكل الشائعة

1. **Theme not persisting**:
   - Check localStorage availability
   - Verify theme value is valid
   - Check browser console for errors

2. **CSS variables not updating**:
   - Verify theme context is provided
   - Check CSS variable names
   - Ensure proper theme switching

3. **RTL layout issues**:
   - Check document direction attribute
   - Verify CSS logical properties
   - Test with different browsers

4. **Dark mode not working**:
   - Check system preference detection
   - Verify CSS variable values
   - Test theme switching manually

### Debug Mode - وضع التصحيح

```tsx
// Enable theme debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Theme debug:', {
    theme,
    resolvedTheme,
    isDark,
    isLight,
    isSystem,
    direction: document.documentElement.getAttribute('dir'),
  });
}
```

## Migration Guide - دليل الترحيل

### From CSS Classes - من فئات CSS

```css
/* Before */
.light-theme {
  background: white;
  color: black;
}
.dark-theme {
  background: black;
  color: white;
}

/* After */
:root {
  --background: white;
  --foreground: black;
}
[data-theme='dark'] {
  --background: black;
  --foreground: white;
}
```

### From Inline Styles - من الأنماط المضمنة

```tsx
// Before
<div style={{ backgroundColor: isDark ? 'black' : 'white' }}>

// After
<div style={{ backgroundColor: 'var(--background)' }}>
```

## Best Practices - أفضل الممارسات

1. **Use CSS variables** instead of hardcoded colors
2. **Test both themes** during development
3. **Ensure proper contrast** in both themes
4. **Use logical properties** for RTL support
5. **Test with system preference** changes
6. **Provide accessible controls** for theme switching

## Support - الدعم

For technical support and questions about the theme system, please refer to the project documentation or contact the development team.
