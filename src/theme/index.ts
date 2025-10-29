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
  // Brand Colors - Updated to match image reference
  primary: '#ff6633', // Orange-red for interactive elements - matches image (#FF6633 or #F05030)
  primaryHover: '#ff854d', // Lighter orange-red on hover
  primaryLight: '#ff9800', // Brighter orange
  primaryDark: '#f05030', // Deeper orange-red
  secondary: '#ff9800', // Brighter orange secondary
  secondaryHover: '#ffb366', // Lighter orange on hover
  accent: '#ff6633', // Orange-red accent - matches interactive color
  accentHover: '#ff854d', // Lighter orange-red accent hover
  accentDeep: '#f05030', // Deeper orange-red

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

  // Surface Colors - محسنة للتباين - Updated to match image reference
  background: '#1a1a1a', // Very dark background - matches image (#1A1A1A or #1C1C1C)
  foreground: '#ffffff', // Pure white text - matches image
  surface: '#1a1a1a', // Same as background for consistency
  surfaceHover: '#2c2c2c', // Slightly lighter on hover
  panel: '#282828', // Dark panel for cards - matches image (#282828 or #2C2C2C)
  border: '#404040', // Medium dark border for visibility
  divider: '#404040', // Medium dark divider

  // Text Colors - محسنة للتباين - Updated to match image reference
  text: {
    primary: '#ffffff', // Pure white for primary text - matches image
    secondary: '#a0a0a0', // Medium gray for secondary text - matches image (#A0A0A0 or #B0B0B0)
    tertiary: '#808080', // Darker gray for tertiary text
    disabled: '#666666', // Darker gray for disabled text
    inverse: '#1a1a1a', // Dark text for light backgrounds
  },

  // Interactive Colors - Updated to match image reference
  interactive: {
    hover: '#2c2c2c', // Slightly lighter on hover
    active: '#333333', // Active state
    focus: '#ff6633', // Orange-red focus - matches interactive color
    disabled: '#404040', // Disabled state
  },
};

// Typography moved to centralized.css as CSS variables
// Use var(--font-size-*), var(--font-weight-*), var(--font-family-*) instead
export const typography: Typography = {
  fontFamily: {
    sans: ['var(--font-family-sans)'],
    serif: ['Georgia', 'Times New Roman', 'serif'],
    mono: ['var(--font-family-mono)'],
    arabic: ['var(--font-family-sans)'], // Arabic fonts included in --font-family-sans
  },
  fontSize: {
    // Deprecated: Use CSS variables from centralized.css instead
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
    '6xl': 'var(--font-size-6xl)',
  },
  fontWeight: {
    // Deprecated: Use CSS variables from centralized.css instead
    thin: 'var(--font-weight-thin)',
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
    black: 'var(--font-weight-black)',
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

// Spacing moved to centralized.css as CSS variables --space-*
// Use var(--space-1), var(--space-2), etc. instead
export const spacing: Spacing = {
  space: {
    // Deprecated: Use CSS variables from centralized.css instead
    // Example: var(--space-1), var(--space-2), etc.
    0: 'var(--space-0)',
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    5: 'var(--space-5)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    10: 'var(--space-10)',
    12: 'var(--space-12)',
    16: 'var(--space-16)',
    20: 'var(--space-20)',
    24: 'var(--space-24)',
    32: 'var(--space-32)',
    40: 'var(--space-40)',
    48: 'var(--space-48)',
    56: 'var(--space-56)',
    64: 'var(--space-64)',
    80: 'var(--space-80)',
    96: 'var(--space-96)',
  },
  // Border radius moved to centralized.css as CSS variables --radius-*
  borderRadius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-xs)', // 2px
    base: 'var(--radius-sm)', // 4px
    md: 'var(--radius-md)', // 6px
    lg: 'var(--radius-lg)', // 8px
    xl: 'var(--radius-xl)', // 12px
    '2xl': 'var(--radius-2xl)', // 16px
    '3xl': 'var(--radius-3xl)', // 24px
    full: 'var(--radius-full)',
  },
  // Box shadows moved to centralized.css as CSS variables --shadow-*
  boxShadow: {
    none: 'var(--shadow-none)',
    sm: 'var(--shadow-sm)',
    base: 'var(--shadow-md)', // Using md as base equivalent
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    inner: 'var(--shadow-inner)',
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
