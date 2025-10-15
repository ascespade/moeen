/**
 * Design Tokens - Centralized Design System
 * رموز التصميم - نظام التصميم المركزي
 * 
 * All design tokens for colors, spacing, typography, etc.
 * جميع رموز التصميم للألوان والمسافات والخطوط وغيرها
 */

// ========================================
// BRAND COLORS - الألوان الأساسية
// ========================================

export const BRAND_COLORS = {
  // Primary Orange - البرتقالي الأساسي
  primary: {
    50: '#fff7ed',
    100: '#ffedd5', 
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Main brand color
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    DEFAULT: '#f58220', // CSS variable value
    hover: '#d66f15',
  },
  
  // Secondary Brown - البني الثانوي
  secondary: {
    50: '#fdf8f6',
    100: '#f2e8e5',
    200: '#eaddd7',
    300: '#e0cec7',
    400: '#d2bab0',
    500: '#bfa094',
    600: '#a18072',
    700: '#977669',
    800: '#846358',
    900: '#43302b',
    DEFAULT: '#a18072',
  },

  // Accent Colors - الألوان المميزة
  accent: {
    blue: '#007bff',
    green: '#009688',
    purple: '#8b5cf6',
    pink: '#ec4899',
    yellow: '#f59e0b',
  },

  // Status Colors - ألوان الحالة
  status: {
    success: '#009688',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#007bff',
  },

  // Neutral Colors - الألوان المحايدة
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// ========================================
// SPACING SCALE - مقياس المسافات
// ========================================

export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
} as const;

// ========================================
// TYPOGRAPHY - الخطوط
// ========================================

export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },

  // Font Sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
    '8xl': ['6rem', { lineHeight: '1' }],         // 96px
    '9xl': ['8rem', { lineHeight: '1' }],         // 128px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// ========================================
// BORDER RADIUS - نصف قطر الحدود
// ========================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ========================================
// SHADOWS - الظلال
// ========================================

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
} as const;

// ========================================
// BREAKPOINTS - نقاط التوقف
// ========================================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ========================================
// Z-INDEX SCALE - مقياس الطبقات
// ========================================

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090,
} as const;

// ========================================
// ANIMATION DURATIONS - مدة الحركات
// ========================================

export const ANIMATION = {
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

// ========================================
// RTL SUPPORT - دعم الكتابة من اليمين لليسار
// ========================================

export const RTL = {
  // Logical properties for RTL support
  logical: {
    start: 'inline-start',
    end: 'inline-end',
    blockStart: 'block-start',
    blockEnd: 'block-end',
  },
  
  // Direction-specific utilities
  direction: {
    ltr: 'ltr',
    rtl: 'rtl',
  },
  
  // Text alignment
  textAlign: {
    start: 'start',
    end: 'end',
  },
} as const;

// ========================================
// CSS CUSTOM PROPERTIES - خصائص CSS المخصصة
// ========================================

export const CSS_VARIABLES = {
  // Brand colors as CSS variables
  '--brand-primary': BRAND_COLORS.primary.DEFAULT,
  '--brand-primary-hover': BRAND_COLORS.primary.hover,
  '--brand-secondary': BRAND_COLORS.secondary.DEFAULT,
  '--brand-accent': BRAND_COLORS.accent.blue,
  '--brand-success': BRAND_COLORS.status.success,
  '--brand-warning': BRAND_COLORS.status.warning,
  '--brand-error': BRAND_COLORS.status.error,
  
  // Background colors
  '--background': '#ffffff',
  '--foreground': '#0f172a',
  '--brand-surface': BRAND_COLORS.neutral[50],
  '--panel': '#ffffff',
  '--brand-border': BRAND_COLORS.neutral[200],
  
  // Focus ring
  '--focus-ring': BRAND_COLORS.accent.blue,
  
  // Font families
  '--font-family-sans': TYPOGRAPHY.fontFamily.sans.join(', '),
  '--font-family-mono': TYPOGRAPHY.fontFamily.mono.join(', '),
  
  // Spacing scale
  '--space-1': SPACING[1],
  '--space-2': SPACING[2],
  '--space-3': SPACING[3],
  '--space-4': SPACING[4],
  '--space-6': SPACING[6],
  '--space-8': SPACING[8],
  '--space-12': SPACING[12],
  '--space-16': SPACING[16],
  
  // Border radius
  '--radius-sm': BORDER_RADIUS.sm,
  '--radius-md': BORDER_RADIUS.md,
  '--radius-lg': BORDER_RADIUS.lg,
  '--radius-xl': BORDER_RADIUS.xl,
  
  // Shadows
  '--shadow-sm': SHADOWS.sm,
  '--shadow-md': SHADOWS.md,
  '--shadow-lg': SHADOWS.lg,
  '--shadow-xl': SHADOWS.xl,
  
  // Transitions
  '--transition-fast': `${ANIMATION.duration[150]} ${ANIMATION.easing['in-out']}`,
  '--transition-normal': `${ANIMATION.duration[300]} ${ANIMATION.easing['in-out']}`,
  '--transition-slow': `${ANIMATION.duration[500]} ${ANIMATION.easing['in-out']}`,
  
  // Z-index
  '--z-dropdown': Z_INDEX.dropdown,
  '--z-sticky': Z_INDEX.sticky,
  '--z-fixed': Z_INDEX.banner,
  '--z-modal-backdrop': Z_INDEX.overlay,
  '--z-modal': Z_INDEX.modal,
  '--z-popover': Z_INDEX.popover,
  '--z-tooltip': Z_INDEX.tooltip,
  '--z-toast': Z_INDEX.toast,
} as const;

// ========================================
// DARK MODE VARIABLES - متغيرات الوضع الليلي
// ========================================

export const DARK_MODE_VARIABLES = {
  '--background': '#0d1117',
  '--foreground': '#e5eef7',
  '--brand-primary': BRAND_COLORS.primary.DEFAULT,
  '--brand-primary-hover': '#c25e0f',
  '--brand-secondary': BRAND_COLORS.secondary.DEFAULT,
  '--brand-accent': BRAND_COLORS.accent.blue,
  '--brand-success': '#00b39b',
  '--brand-warning': '#fbbf24',
  '--brand-error': '#f87171',
  '--brand-border': '#1f2937',
  '--brand-surface': '#0d1117',
  '--panel': '#111827',
  '--focus-ring': BRAND_COLORS.accent.blue,
} as const;
