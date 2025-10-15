/**
 * Design System Utilities
 * أدوات نظام التصميم
 * 
 * Utility functions for design system
 * وظائف مساعدة لنظام التصميم
 */

import { BRAND_COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from './tokens';

// ========================================
// COLOR UTILITIES - أدوات الألوان
// ========================================

/**
 * Generate color palette from base color
 * إنشاء لوحة ألوان من لون أساسي
 */
export function generateColorPalette(baseColor: string) {
  return {
    50: `color-mix(in oklab, ${baseColor} 5%, #fff)`,
    100: `color-mix(in oklab, ${baseColor} 10%, #fff)`,
    200: `color-mix(in oklab, ${baseColor} 20%, #fff)`,
    300: `color-mix(in oklab, ${baseColor} 30%, #fff)`,
    400: `color-mix(in oklab, ${baseColor} 40%, #fff)`,
    500: baseColor,
    600: `color-mix(in oklab, ${baseColor} 80%, #000)`,
    700: `color-mix(in oklab, ${baseColor} 70%, #000)`,
    800: `color-mix(in oklab, ${baseColor} 60%, #000)`,
    900: `color-mix(in oklab, ${baseColor} 50%, #000)`,
  };
}

/**
 * Get contrast color (black or white) for given background
 * الحصول على لون متباين (أسود أو أبيض) للخلفية المعطاة
 */
export function getContrastColor(backgroundColor: string): string {
  // Simple contrast calculation - in real app, use a proper color library
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * Convert hex to RGB
 * تحويل hex إلى RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex
 * تحويل RGB إلى hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ========================================
// SPACING UTILITIES - أدوات المسافات
// ========================================

/**
 * Generate spacing scale
 * إنشاء مقياس المسافات
 */
export function generateSpacingScale(baseUnit: number = 4) {
  const scale: Record<string, string> = {};
  for (let i = 0; i <= 96; i++) {
    scale[i] = `${i * baseUnit}px`;
  }
  return scale;
}

/**
 * Get responsive spacing
 * الحصول على مسافات متجاوبة
 */
export function getResponsiveSpacing(
  mobile: keyof typeof SPACING,
  tablet?: keyof typeof SPACING,
  desktop?: keyof typeof SPACING
) {
  return {
    mobile: SPACING[mobile],
    tablet: tablet ? SPACING[tablet] : SPACING[mobile],
    desktop: desktop ? SPACING[desktop] : (tablet ? SPACING[tablet] : SPACING[mobile]),
  };
}

// ========================================
// TYPOGRAPHY UTILITIES - أدوات الخطوط
// ========================================

/**
 * Generate font size with line height
 * إنشاء حجم خط مع ارتفاع السطر
 */
export function generateFontSize(
  fontSize: string,
  lineHeight?: string | number
): { fontSize: string; lineHeight: string } {
  return {
    fontSize,
    lineHeight: lineHeight ? (typeof lineHeight === 'number' ? `${lineHeight}rem` : lineHeight) : '1.5',
  };
}

/**
 * Generate responsive typography
 * إنشاء خطوط متجاوبة
 */
export function getResponsiveTypography(
  mobile: { fontSize: string; lineHeight?: string | number },
  tablet?: { fontSize: string; lineHeight?: string | number },
  desktop?: { fontSize: string; lineHeight?: string | number }
) {
  return {
    mobile: generateFontSize(mobile.fontSize, mobile.lineHeight),
    tablet: tablet ? generateFontSize(tablet.fontSize, tablet.lineHeight) : generateFontSize(mobile.fontSize, mobile.lineHeight),
    desktop: desktop ? generateFontSize(desktop.fontSize, desktop.lineHeight) : (tablet ? generateFontSize(tablet.fontSize, tablet.lineHeight) : generateFontSize(mobile.fontSize, mobile.lineHeight)),
  };
}

// ========================================
// LAYOUT UTILITIES - أدوات التخطيط
// ========================================

/**
 * Generate grid columns
 * إنشاء أعمدة الشبكة
 */
export function generateGridColumns(cols: number, gap: keyof typeof SPACING = 4) {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: SPACING[gap],
  };
}

/**
 * Generate flex layout
 * إنشاء تخطيط مرن
 */
export function generateFlexLayout(
  direction: 'row' | 'column' = 'row',
  justify: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' = 'start',
  align: 'start' | 'end' | 'center' | 'baseline' | 'stretch' = 'start',
  wrap: boolean = false
) {
  return {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };
}

// ========================================
// RTL UTILITIES - أدوات الكتابة من اليمين لليسار
// ========================================

/**
 * Get RTL-aware property
 * الحصول على خاصية متوافقة مع RTL
 */
export function getRTLProperty(
  ltrValue: string,
  rtlValue: string,
  direction: 'ltr' | 'rtl' = 'ltr'
): string {
  return direction === 'rtl' ? rtlValue : ltrValue;
}

/**
 * Get logical property for RTL support
 * الحصول على خاصية منطقية لدعم RTL
 */
export function getLogicalProperty(
  property: 'margin' | 'padding' | 'border',
  side: 'start' | 'end' | 'block-start' | 'block-end',
  value: string
): Record<string, string> {
  const logicalMap = {
    margin: {
      start: 'margin-inline-start',
      end: 'margin-inline-end',
      'block-start': 'margin-block-start',
      'block-end': 'margin-block-end',
    },
    padding: {
      start: 'padding-inline-start',
      end: 'padding-inline-end',
      'block-start': 'padding-block-start',
      'block-end': 'padding-block-end',
    },
    border: {
      start: 'border-inline-start',
      end: 'border-inline-end',
      'block-start': 'border-block-start',
      'block-end': 'border-block-end',
    },
  };

  return {
    [logicalMap[property][side]]: value,
  };
}

// ========================================
// ANIMATION UTILITIES - أدوات الحركة
// ========================================

/**
 * Generate transition
 * إنشاء انتقال
 */
export function generateTransition(
  properties: string[],
  duration: number = 150,
  easing: string = 'ease-in-out'
): string {
  return properties
    .map(prop => `${prop} ${duration}ms ${easing}`)
    .join(', ');
}

/**
 * Generate keyframe animation
 * إنشاء حركة keyframe
 */
export function generateKeyframe(
  name: string,
  keyframes: Record<string, Record<string, string | number>>
): string {
  const keyframeString = Object.entries(keyframes)
    .map(([percentage, styles]) => {
      const styleString = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
      return `${percentage} { ${styleString} }`;
    })
    .join(' ');

  return `@keyframes ${name} { ${keyframeString} }`;
}

// ========================================
// CSS UTILITIES - أدوات CSS
// ========================================

/**
 * Generate CSS custom properties
 * إنشاء خصائص CSS المخصصة
 */
export function generateCSSVariables(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n');
}

/**
 * Generate media query
 * إنشاء استعلام وسائط
 */
export function generateMediaQuery(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  styles: Record<string, string | number>
): string {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };

  const styleString = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');

  return `@media (min-width: ${breakpoints[breakpoint]}) { ${styleString} }`;
}

// ========================================
// THEME UTILITIES - أدوات الثيم
// ========================================

/**
 * Generate theme CSS variables
 * إنشاء متغيرات CSS للثيم
 */
export function generateThemeVariables(theme: 'light' | 'dark'): Record<string, string> {
  const lightTheme = {
    '--background': '#ffffff',
    '--foreground': '#0f172a',
    '--brand-surface': BRAND_COLORS.neutral[50],
    '--panel': '#ffffff',
    '--brand-border': BRAND_COLORS.neutral[200],
  };

  const darkTheme = {
    '--background': '#0d1117',
    '--foreground': '#e5eef7',
    '--brand-surface': '#0d1117',
    '--panel': '#111827',
    '--brand-border': '#1f2937',
  };

  return theme === 'dark' ? darkTheme : lightTheme;
}

/**
 * Apply theme to document
 * تطبيق الثيم على المستند
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const variables = generateThemeVariables(theme);

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.setAttribute('data-theme', theme);
}

// ========================================
// VALIDATION UTILITIES - أدوات التحقق
// ========================================

/**
 * Validate color format
 * التحقق من تنسيق اللون
 */
export function isValidColor(color: string): boolean {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  
  return hexPattern.test(color) || rgbPattern.test(color) || rgbaPattern.test(color);
}

/**
 * Validate spacing value
 * التحقق من قيمة المسافة
 */
export function isValidSpacing(value: string | number): boolean {
  if (typeof value === 'number') return value >= 0;
  if (typeof value === 'string') {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  }
  return false;
}

// ========================================
// HELPER FUNCTIONS - وظائف مساعدة
// ========================================

/**
 * Deep merge objects
 * دمج عميق للكائنات
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key] as any);
    } else {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

/**
 * Generate unique ID
 * إنشاء معرف فريد
 */
export function generateId(prefix: string = 'ds'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 * وظيفة تأخير
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 * وظيفة تقييد
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
