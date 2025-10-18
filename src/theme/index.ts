/**
 * Centralized Theme System
 * نظام الثيم المركزي
 *
 * This file contains all theme-related configurations including colors, fonts, spacing, and other design tokens.
 * يحتوي هذا الملف على جميع إعدادات الثيم بما في ذلك الألوان والخطوط والمسافات ورموز التصميم الأخرى.
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// ========================================
// COLOR SYSTEM - نظام الألوان
// ========================================

export interface ColorPalette {
  // Brand Colors - ألوان العلامة التجارية
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
  accentDeep: string;

  // Neutral Colors - الألوان المحايدة
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Semantic Colors - الألوان الدلالية
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;

  // Surface Colors - ألوان الأسطح
  background: string;
  foreground: string;
  surface: string;
  surfaceHover: string;
  panel: string;
  border: string;
  divider: string;

  // Text Colors - ألوان النصوص
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };

  // Interactive Colors - ألوان التفاعل
  interactive: {
    hover: string;
    active: string;
    focus: string;
    disabled: string;
  };
}

// ========================================
// TYPOGRAPHY SYSTEM - نظام الطباعة
// ========================================

export interface Typography {
  // Font Families - عائلات الخطوط
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
    arabic: string[];
  };

  // Font Sizes - أحجام الخطوط
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };

  // Font Weights - أوزان الخطوط
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };

  // Line Heights - ارتفاعات الأسطر
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };

  // Letter Spacing - تباعد الحروف
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

// ========================================
// SPACING SYSTEM - نظام المسافات
// ========================================

export interface Spacing {
  // Base spacing scale - مقياس المسافات الأساسي
  space: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
    80: string;
    96: string;
  };

  // Border radius - نصف قطر الحدود
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };

  // Shadows - الظلال
  boxShadow: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };
}

// ========================================
// BREAKPOINTS - نقاط التوقف
// ========================================

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// ========================================
// ANIMATION - الرسوم المتحركة
// ========================================

export interface Animation {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

// ========================================
// THEME CONFIGURATIONS - إعدادات الثيم
// ========================================

export const lightTheme: ColorPalette = {
  // Brand Colors
  primary: '#E46C0A',
  primaryHover: '#D45F08',
  primaryLight: '#F4A261',
  primaryDark: '#B8540A',
  secondary: '#6B4E16',
  secondaryHover: '#5A3F12',
  accent: '#007bff',
  accentHover: '#0056b3',
  accentDeep: '#C93C00',

  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic Colors
  success: '#009688',
  successLight: '#4db6ac',
  successDark: '#00695c',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  info: '#3b82f6',
  infoLight: '#60a5fa',
  infoDark: '#2563eb',

  // Surface Colors - محسنة للتباين
  background: '#ffffff',
  foreground: '#111827', // أغمق للنص الأساسي
  surface: '#f9fafb',
  surfaceHover: '#f3f4f6',
  panel: '#ffffff',
  border: '#e5e7eb',
  divider: '#f3f4f6',

  // Text Colors - محسنة للتباين
  text: {
    primary: '#111827', // أغمق للنص الأساسي
    secondary: '#374151', // أغمق للنص الثانوي
    tertiary: '#6b7280', // أغمق للنص الثالثي
    disabled: '#9ca3af', // أغمق للنص المعطل
    inverse: '#ffffff',
  },

  // Interactive Colors
  interactive: {
    hover: '#f8fafc',
    active: '#f1f5f9',
    focus: '#3b82f6',
    disabled: '#f1f5f9',
  },
};

export const darkTheme: ColorPalette = {
  // Brand Colors
  primary: '#E46C0A',
  primaryHover: '#F4A261',
  primaryLight: '#F4A261',
  primaryDark: '#B8540A',
  secondary: '#6B4E16',
  secondaryHover: '#7A5A1A',
  accent: '#3b82f6',
  accentHover: '#60a5fa',
  accentDeep: '#C93C00',

  // Neutral Colors
  neutral: {
    50: '#171717',
    100: '#262626',
    200: '#404040',
    300: '#525252',
    400: '#737373',
    500: '#a3a3a3',
    600: '#d4d4d4',
    700: '#e5e5e5',
    800: '#f5f5f5',
    900: '#fafafa',
  },

  // Semantic Colors
  success: '#00b39b',
  successLight: '#4db6ac',
  successDark: '#00695c',
  warning: '#fbbf24',
  warningLight: '#fde68a',
  warningDark: '#f59e0b',
  error: '#f87171',
  errorLight: '#fca5a5',
  errorDark: '#ef4444',
  info: '#60a5fa',
  infoLight: '#93c5fd',
  infoDark: '#3b82f6',

  // Surface Colors - محسنة للتباين
  background: '#0f0f0f', // أغمق للخلفية الأساسية
  foreground: '#f9fafb', // أفتح للنص الأساسي
  surface: '#1a1a1a', // أغمق للأسطح
  surfaceHover: '#262626', // أغمق عند التمرير
  panel: '#1a1a1a', // أغمق للوحات
  border: '#404040', // أفتح للحدود
  divider: '#2a2a2a', // أفتح للفواصل

  // Text Colors - محسنة للتباين
  text: {
    primary: '#f9fafb', // أفتح للنص الأساسي
    secondary: '#e5e7eb', // أفتح للنص الثانوي
    tertiary: '#d1d5db', // أفتح للنص الثالثي
    disabled: '#9ca3af', // أفتح للنص المعطل
    inverse: '#111827', // أغمق للنص على الخلفيات الفاتحة
  },

  // Interactive Colors
  interactive: {
    hover: '#262626', // أفتح عند التمرير
    active: '#333333', // أفتح عند النقر
    focus: '#3b82f6',
    disabled: '#262626', // أفتح للحالات المعطلة
  },
};

export const typography: Typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'Times New Roman', 'serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
    arabic: ['Noto Sans Arabic', 'Tajawal', 'Cairo', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const spacing: Spacing = {
  space: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
    40: '10rem', // 160px
    48: '12rem', // 192px
    56: '14rem', // 224px
    64: '16rem', // 256px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
};

export const breakpoints: Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const animation: Animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ========================================
// THEME UTILITIES - أدوات الثيم
// ========================================

export function getThemeColors(theme: ResolvedTheme): ColorPalette {
  return theme === 'dark' ? darkTheme : lightTheme;
}

export function generateCSSVariables(
  theme: ResolvedTheme
): Record<string, string> {
  const colors = getThemeColors(theme);

  return {
    // Brand Colors
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-light': colors.primaryLight,
    '--color-primary-dark': colors.primaryDark,
    '--color-secondary': colors.secondary,
    '--color-secondary-hover': colors.secondaryHover,
    '--color-accent': colors.accent,
    '--color-accent-hover': colors.accentHover,
    '--color-accent-deep': colors.accentDeep,

    // Neutral Colors
    '--color-neutral-50': colors.neutral[50],
    '--color-neutral-100': colors.neutral[100],
    '--color-neutral-200': colors.neutral[200],
    '--color-neutral-300': colors.neutral[300],
    '--color-neutral-400': colors.neutral[400],
    '--color-neutral-500': colors.neutral[500],
    '--color-neutral-600': colors.neutral[600],
    '--color-neutral-700': colors.neutral[700],
    '--color-neutral-800': colors.neutral[800],
    '--color-neutral-900': colors.neutral[900],

    // Semantic Colors
    '--color-success': colors.success,
    '--color-success-light': colors.successLight,
    '--color-success-dark': colors.successDark,
    '--color-warning': colors.warning,
    '--color-warning-light': colors.warningLight,
    '--color-warning-dark': colors.warningDark,
    '--color-error': colors.error,
    '--color-error-light': colors.errorLight,
    '--color-error-dark': colors.errorDark,
    '--color-info': colors.info,
    '--color-info-light': colors.infoLight,
    '--color-info-dark': colors.infoDark,

    // Surface Colors
    '--color-background': colors.background,
    '--color-foreground': colors.foreground,
    '--color-surface': colors.surface,
    '--color-surface-hover': colors.surfaceHover,
    '--color-panel': colors.panel,
    '--color-border': colors.border,
    '--color-divider': colors.divider,

    // Text Colors
    '--color-text-primary': colors.text.primary,
    '--color-text-secondary': colors.text.secondary,
    '--color-text-tertiary': colors.text.tertiary,
    '--color-text-disabled': colors.text.disabled,
    '--color-text-inverse': colors.text.inverse,

    // Interactive Colors
    '--color-interactive-hover': colors.interactive.hover,
    '--color-interactive-active': colors.interactive.active,
    '--color-interactive-focus': colors.interactive.focus,
    '--color-interactive-disabled': colors.interactive.disabled,

    // Typography
    '--font-family-sans': typography.fontFamily.sans.join(', '),
    '--font-family-serif': typography.fontFamily.serif.join(', '),
    '--font-family-mono': typography.fontFamily.mono.join(', '),
    '--font-family-arabic': typography.fontFamily.arabic.join(', '),

    // Spacing
    '--space-0': spacing.space[0],
    '--space-1': spacing.space[1],
    '--space-2': spacing.space[2],
    '--space-3': spacing.space[3],
    '--space-4': spacing.space[4],
    '--space-5': spacing.space[5],
    '--space-6': spacing.space[6],
    '--space-8': spacing.space[8],
    '--space-10': spacing.space[10],
    '--space-12': spacing.space[12],
    '--space-16': spacing.space[16],
    '--space-20': spacing.space[20],
    '--space-24': spacing.space[24],
    '--space-32': spacing.space[32],
    '--space-40': spacing.space[40],
    '--space-48': spacing.space[48],
    '--space-56': spacing.space[56],
    '--space-64': spacing.space[64],
    '--space-80': spacing.space[80],
    '--space-96': spacing.space[96],

    // Border Radius
    '--radius-none': spacing.borderRadius.none,
    '--radius-sm': spacing.borderRadius.sm,
    '--radius-base': spacing.borderRadius.base,
    '--radius-md': spacing.borderRadius.md,
    '--radius-lg': spacing.borderRadius.lg,
    '--radius-xl': spacing.borderRadius.xl,
    '--radius-2xl': spacing.borderRadius['2xl'],
    '--radius-3xl': spacing.borderRadius['3xl'],
    '--radius-full': spacing.borderRadius.full,

    // Box Shadow
    '--shadow-none': spacing.boxShadow.none,
    '--shadow-sm': spacing.boxShadow.sm,
    '--shadow-base': spacing.boxShadow.base,
    '--shadow-md': spacing.boxShadow.md,
    '--shadow-lg': spacing.boxShadow.lg,
    '--shadow-xl': spacing.boxShadow.xl,
    '--shadow-2xl': spacing.boxShadow['2xl'],
    '--shadow-inner': spacing.boxShadow.inner,

    // Animation
    '--duration-fast': animation.duration.fast,
    '--duration-normal': animation.duration.normal,
    '--duration-slow': animation.duration.slow,
    '--easing-linear': animation.easing.linear,
    '--easing-ease-in': animation.easing.easeIn,
    '--easing-ease-out': animation.easing.easeOut,
    '--easing-ease-in-out': animation.easing.easeInOut,

    // Legacy support for existing CSS variables - دعم للتوافق مع المتغيرات الموجودة
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--brand-surface': colors.surface,
    '--brand-border': colors.border,
    '--brand-primary': colors.primary,
    '--brand-primary-hover': colors.primaryHover,
    '--brand-secondary': colors.secondary,
    '--brand-accent': colors.accent,
    '--brand-success': colors.success,
    '--brand-warning': colors.warning,
    '--brand-error': colors.error,
    '--panel': colors.panel,
    '--focus-ring': colors.interactive.focus,
  };
}
