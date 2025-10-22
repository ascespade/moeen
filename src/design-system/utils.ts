/**
 * Design System Utilities - أدوات نظام التصميم
 *
 * Utility functions for design system
 * وظائف مساعدة لنظام التصميم
 */

import {
  BRAND_COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
} from './tokens';

// ========================================
// COLOR UTILITIES - أدوات الألوان
// ========================================

/**
 * Get color with opacity
 * الحصول على لون مع الشفافية
 */
export function getColorWithOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

/**
 * Get brand color by name
 * الحصول على لون العلامة التجارية بالاسم
 */
export function getBrandColor(
  colorName: keyof typeof BRAND_COLORS,
  shade?: string
): string {
  const color = BRAND_COLORS[colorName];
  if (typeof color === 'object' && shade && shade in color) {
    return (color as any)[shade];
  }
  return typeof color === 'string' ? color : (color as any).DEFAULT || color;
}

// ========================================
// SPACING UTILITIES - أدوات المسافات
// ========================================

/**
 * Get spacing value
 * الحصول على قيمة المسافة
 */
export function getSpacing(size: keyof typeof SPACING): string {
  return SPACING[size];
}

/**
 * Get responsive spacing
 * الحصول على مسافة متجاوبة
 */
export function getResponsiveSpacing(
  mobile: keyof typeof SPACING,
  tablet?: keyof typeof SPACING,
  desktop?: keyof typeof SPACING
): string {
  let spacing = SPACING[mobile];
  if (tablet) spacing += ` md:${SPACING[tablet]}`;
  if (desktop) spacing += ` lg:${SPACING[desktop]}`;
  return spacing;
}

// ========================================
// TYPOGRAPHY UTILITIES - أدوات الخطوط
// ========================================

/**
 * Get font family
 * الحصول على عائلة الخط
 */
export function getFontFamily(
  family: keyof typeof TYPOGRAPHY.fontFamily
): string {
  return TYPOGRAPHY.fontFamily[family].join(', ');
}

/**
 * Get font size with line height
 * الحصول على حجم الخط مع ارتفاع السطر
 */
export function getFontSize(size: keyof typeof TYPOGRAPHY.fontSize): string {
  const [fontSize, lineHeight] = TYPOGRAPHY.fontSize[size];
  return `${fontSize}/${lineHeight}`;
}

// ========================================
// CSS VARIABLE UTILITIES - أدوات متغيرات CSS
// ========================================

/**
 * Generate CSS variables object
 * إنشاء كائن متغيرات CSS
 */
export function generateCSSVariables(): Record<string, string> {
  return {
    '--brand-primary': BRAND_COLORS.primary.DEFAULT,
    '--brand-primary-hover': BRAND_COLORS.primary.hover,
    '--brand-secondary': BRAND_COLORS.secondary.DEFAULT,
    '--brand-accent': BRAND_COLORS.accent.blue,
    '--brand-success': BRAND_COLORS.status.success,
    '--brand-warning': BRAND_COLORS.status.warning,
    '--brand-error': BRAND_COLORS.status.error,
    '--font-family-sans': TYPOGRAPHY.fontFamily.sans.join(', '),
    '--font-family-mono': TYPOGRAPHY.fontFamily.mono.join(', '),
  };
}

/**
 * Apply CSS variables to element
 * تطبيق متغيرات CSS على العنصر
 */
export function applyCSSVariables(
  element: HTMLElement,
  variables: Record<string, string>
): void {
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

// ========================================
// RESPONSIVE UTILITIES - أدوات الاستجابة
// ========================================

/**
 * Get responsive class
 * الحصول على فئة متجاوبة
 */
export function getResponsiveClass(
  base: string,
  tablet?: string,
  desktop?: string,
  mobile?: string
): string {
  let classes = base;
  if (mobile) classes = `${mobile} ${classes}`;
  if (tablet) classes += ` md:${tablet}`;
  if (desktop) classes += ` lg:${desktop}`;
  return classes;
}

/**
 * Get breakpoint value
 * الحصول على قيمة نقطة التوقف
 */
export function getBreakpoint(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
): string {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };
  return breakpoints[breakpoint];
}

// ========================================
// RTL UTILITIES - أدوات RTL
// ========================================

/**
 * Get RTL-aware class
 * الحصول على فئة واعية بـ RTL
 */
export function getRTLClass(ltrClass: string, rtlClass: string): string {
  return `${ltrClass} rtl:${rtlClass}`;
}

/**
 * Get logical property
 * الحصول على الخاصية المنطقية
 */
export function getLogicalProperty(
  property: 'start' | 'end' | 'block-start' | 'block-end'
): string {
  const properties = {
    start: 'inline-start',
    end: 'inline-end',
    'block-start': 'block-start',
    'block-end': 'block-end',
  };
  return properties[property];
}

// ========================================
// ANIMATION UTILITIES - أدوات الحركة
// ========================================

/**
 * Get transition class
 * الحصول على فئة الانتقال
 */
export function getTransitionClass(
  property: string = 'all',
  duration: 'fast' | 'normal' | 'slow' = 'normal',
  easing: 'linear' | 'in' | 'out' | 'in-out' = 'in-out'
): string {
  const durations = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  };

  const easings = {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return `transition-${property} duration-${durations[duration]} ease-${easing}`;
}

// ========================================
// VALIDATION UTILITIES - أدوات التحقق
// ========================================

/**
 * Validate color value
 * التحقق من قيمة اللون
 */
export function isValidColor(color: string): boolean {
  // Check if it's a valid hex color
  if (color.startsWith('#')) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  // Check if it's a valid CSS color
  const div = document.createElement('div');
  div.style.color = color;
  return div.style.color !== '';
}

/**
 * Validate spacing value
 * التحقق من قيمة المسافة
 */
export function isValidSpacing(spacing: string): boolean {
  return spacing in SPACING;
}

// ========================================
// THEME UTILITIES - أدوات الثيم
// ========================================

/**
 * Get theme-aware color
 * الحصول على لون واعي بالثيم
 */
export function getThemeAwareColor(
  lightColor: string,
  darkColor: string,
  theme: 'light' | 'dark' = 'light'
): string {
  return theme === 'dark' ? darkColor : lightColor;
}

/**
 * Generate theme CSS variables
 * إنشاء متغيرات CSS للثيم
 */
export function generateThemeVariables(
  theme: 'light' | 'dark'
): Record<string, string> {
  const baseVariables = generateCSSVariables();

  if (theme === 'dark') {
    return {
      ...baseVariables,
      '--background': '#0d1117',
      '--foreground': '#e5eef7',
      '--brand-surface': '#0d1117',
      '--panel': '#111827',
      '--brand-border': '#1f2937',
    };
  }

  return {
    ...baseVariables,
    '--background': '#ffffff',
    '--foreground': '#0f172a',
    '--brand-surface': '#f9fafb',
    '--panel': '#ffffff',
    '--brand-border': '#e5e7eb',
  };
}
