/**
 * Design Tokens - من STYLING_GUIDE.md الأصلي
 * استخرج من commit c96c10fe (2025-10-10)
 * 
 * هذا الملف يحتوي على جميع قيم التصميم المركزية
 * المستخرجة من التصميم الأصلي للمشروع
 */

/**
 * الألوان الأساسية من STYLING_GUIDE.md الأصلي
 */
export const COLORS = {
  primary: {
    500: '#f58220', // ⭐ اللون الأساسي من الدليل الأصلي
    600: '#d66f15', // ⭐ hover من الدليل الأصلي
  },
  secondary: {
    500: '#009688', // ⭐ اللون الثانوي من الدليل الأصلي
  },
  accent: {
    500: '#007bff', // ⭐ اللون المميز من الدليل الأصلي
  },
  success: {
    500: '#009688', // ⭐ لون النجاح من الدليل الأصلي
  },
  warning: {
    500: '#f59e0b', // ⭐ لون التحذير من الدليل الأصلي
  },
  error: {
    500: '#ef4444', // ⭐ لون الخطأ من الدليل الأصلي
  },
  background: {
    primary: '#ffffff', // ⭐ الخلفية الأساسية من الدليل الأصلي
    secondary: '#f9fafb', // ⭐ سطح العلامة التجارية من الدليل الأصلي
  },
  text: {
    primary: '#0f172a', // ⭐ النص الأساسي من الدليل الأصلي
  },
  border: {
    primary: '#e5e7eb', // ⭐ حدود العلامة التجارية من الدليل الأصلي
  },
} as const;

/**
 * الخطوط - System Fonts كما في التصميم الأصلي
 */
export const FONTS = {
  primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  arabic: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  handwriting: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
} as const;

/**
 * أحجام الخطوط
 */
export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
  '8xl': '6rem',    // 96px
  '9xl': '8rem',    // 128px
} as const;

/**
 * أوزان الخطوط
 */
export const FONT_WEIGHTS = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

/**
 * المسافات
 */
export const SPACING = {
  0: '0',
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
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

/**
 * نصف قطر الحدود
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

/**
 * الظلال
 */
export const SHADOWS = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

/**
 * الرسوم المتحركة
 */
export const ANIMATIONS = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * نقاط التوقف للاستجابة
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * فئات CSS المساعدة
 */
export const CSS_CLASSES = {
  // الألوان
  textBrand: 'text-[var(--color-primary-500)]',
  bgBrand: 'bg-[var(--color-primary-500)]',
  borderBrand: 'border-[var(--color-primary-500)]',
  
  // الخلفيات
  bgSurface: 'bg-[var(--color-bg-secondary)]',
  bgPanel: 'bg-[var(--color-bg-primary)]',
  
  // النصوص
  textPrimary: 'text-[var(--color-text-primary)]',
  
  // الحدود
  borderPrimary: 'border-[var(--color-border-primary)]',
  
  // التدرجات
  gradientBrand: 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)]',
  
  // الظلال
  shadowCard: 'shadow-lg',
  shadowButton: 'shadow-md hover:shadow-lg',
} as const;

/**
 * مكونات التصميم الأساسية
 */
export const COMPONENTS = {
  // الأزرار
  button: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white focus:ring-[var(--color-primary-500)]',
    secondary: 'bg-[var(--color-secondary-500)] hover:bg-[var(--color-secondary-600)] text-white focus:ring-[var(--color-secondary-500)]',
    outline: 'border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)] hover:text-white focus:ring-[var(--color-primary-500)]',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  
  // البطاقات
  card: {
    base: 'bg-white rounded-lg shadow-md border border-[var(--color-border-primary)]',
    elevated: 'bg-white rounded-lg shadow-xl border border-[var(--color-border-primary)]',
    interactive: 'bg-white rounded-lg shadow-md border border-[var(--color-border-primary)] hover:shadow-lg transition-shadow duration-200',
  },
  
  // حقول الإدخال
  input: {
    base: 'w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] transition-colors duration-200',
  },
  
  // التسميات
  label: {
    base: 'block text-sm font-medium text-[var(--color-text-primary)] mb-1',
  },
} as const;

/**
 * تخطيط الصفحة
 */
export const LAYOUT = {
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12 lg:py-16',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
} as const;

/**
 * دالة للحصول على لون من النظام
 */
export function getColor(colorPath: string): string {
  const keys = colorPath.split('.');
  let value: any = COLORS;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Color not found: ${colorPath}`);
      return '#000000';
    }
  }
  
  return value;
}

/**
 * دالة للحصول على فئة CSS
 */
export function getCSSClass(component: keyof typeof COMPONENTS, variant?: string, size?: string): string {
  const componentStyles = COMPONENTS[component];
  
  if (typeof componentStyles === 'object' && 'base' in componentStyles) {
    let classes = componentStyles.base;
    
    if (variant && variant in componentStyles) {
      classes += ` ${componentStyles[variant as keyof typeof componentStyles]}`;
    }
    
    if (size && 'sizes' in componentStyles && componentStyles.sizes && size in componentStyles.sizes) {
      classes += ` ${componentStyles.sizes[size as keyof typeof componentStyles.sizes]}`;
    }
    
    return classes;
  }
  
  return '';
}

export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  BREAKPOINTS,
  CSS_CLASSES,
  COMPONENTS,
  LAYOUT,
  getColor,
  getCSSClass,
};
