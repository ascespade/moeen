/**
 * Unified Design System - نظام التصميم الموحد
 * Single source of truth for all design tokens and theming
 * مصدر واحد للحقيقة لجميع رموز التصميم والثيمات
 */

// ========================================
// DESIGN TOKENS - رموز التصميم
// ========================================

export const DESIGN_TOKENS = {
  // Brand Colors - الألوان الأساسية
  colors: {
    // Primary Orange - البرتقالي الأساسي
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#E46C0A', // Main brand color
      600: '#D45F08',
      700: '#C93C00',
      800: '#B83500',
      900: '#A72E00',
      DEFAULT: '#E46C0A',
      hover: '#D45F08',
    },
    
    // Secondary Brown - البني الثانوي
    secondary: {
      50: '#fdf8f6',
      100: '#f2e8e5',
      200: '#eaddd7',
      300: '#e0cec7',
      400: '#d2bab0',
      500: '#6B4E16',
      600: '#5A4213',
      700: '#493610',
      800: '#382A0D',
      900: '#271E0A',
      DEFAULT: '#6B4E16',
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

    // Status Colors - ألوان الحالة
    success: '#009688',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#007bff',
  },

  // Spacing Scale - مقياس المسافات
  spacing: {
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // Border Radius - نصف قطر الحدود
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows - الظلال
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Typography - الخطوط
  typography: {
    fontFamily: {
      sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Z-Index - مؤشر الطبقات
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // Transitions - الانتقالات
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
} as const;

// ========================================
// THEME CONFIGURATIONS - إعدادات الثيمات
// ========================================

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_CONFIGS = {
  light: {
    // Brand Colors
    '--brand-primary': DESIGN_TOKENS.colors.primary.DEFAULT,
    '--brand-primary-hover': DESIGN_TOKENS.colors.primary.hover,
    '--brand-secondary': DESIGN_TOKENS.colors.secondary.DEFAULT,
    '--brand-accent': DESIGN_TOKENS.colors.info,
    '--brand-success': DESIGN_TOKENS.colors.success,
    '--brand-warning': DESIGN_TOKENS.colors.warning,
    '--brand-error': DESIGN_TOKENS.colors.error,

    // Background Colors
    '--background': '#ffffff',
    '--foreground': '#0f172a',
    '--surface': '#f9fafb',
    '--panel': '#ffffff',
    '--border': '#e5e7eb',

    // Text Colors
    '--text-primary': '#0f172a',
    '--text-secondary': '#6b7280',
    '--text-muted': '#9ca3af',

    // Interactive States
    '--hover': '#f3f4f6',
    '--active': '#e5e7eb',
    '--focus': '#007bff',
  },
  
  dark: {
    // Brand Colors
    '--brand-primary': DESIGN_TOKENS.colors.primary.DEFAULT,
    '--brand-primary-hover': DESIGN_TOKENS.colors.primary.hover,
    '--brand-secondary': DESIGN_TOKENS.colors.secondary.DEFAULT,
    '--brand-accent': DESIGN_TOKENS.colors.info,
    '--brand-success': DESIGN_TOKENS.colors.success,
    '--brand-warning': DESIGN_TOKENS.colors.warning,
    '--brand-error': DESIGN_TOKENS.colors.error,

    // Background Colors
    '--background': '#0f172a',
    '--foreground': '#f8fafc',
    '--surface': '#1e293b',
    '--panel': '#334155',
    '--border': '#475569',

    // Text Colors
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--text-muted': '#94a3b8',

    // Interactive States
    '--hover': '#334155',
    '--active': '#475569',
    '--focus': '#007bff',
  },
} as const;

// ========================================
// UTILITY FUNCTIONS - دوال مساعدة
// ========================================

export function getThemeVariables(theme: ResolvedTheme): Record<string, string> {
  return THEME_CONFIGS[theme];
}

export function applyThemeToDocument(theme: ResolvedTheme): void {
  const root = document.documentElement;
  
  // Set theme attribute
  root.setAttribute('data-theme', theme);
  
  // Apply CSS classes
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  // Apply CSS variables
  const variables = getThemeVariables(theme);
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

export function detectSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ========================================
// CSS CLASSES - فئات CSS
// ========================================

export const CSS_CLASSES = {
  // Brand Colors
  'text-brand': 'text-[var(--brand-primary)]',
  'bg-brand': 'bg-[var(--brand-primary)]',
  'border-brand': 'border-[var(--brand-primary)]',
  
  // Background Colors
  'bg-surface': 'bg-[var(--surface)]',
  'bg-panel': 'bg-[var(--panel)]',
  
  // Text Colors
  'text-primary': 'text-[var(--text-primary)]',
  'text-secondary': 'text-[var(--text-secondary)]',
  'text-muted': 'text-[var(--text-muted)]',
  
  // Interactive States
  'hover-bg': 'hover:bg-[var(--hover)]',
  'active-bg': 'active:bg-[var(--active)]',
  'focus-ring': 'focus:ring-[var(--focus)]',
  
  // Common Components
  'btn-brand': 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-4 py-2 rounded-lg transition-colors',
  'btn-outline': 'border border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white px-4 py-2 rounded-lg transition-colors',
  'card': 'bg-[var(--panel)] border border-[var(--border)] rounded-lg p-6 shadow-sm',
  'nav-link': 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors',
} as const;

// ========================================
// EXPORTS - التصدير
// ========================================

export type DesignTokens = typeof DESIGN_TOKENS;
export type ThemeConfig = typeof THEME_CONFIGS;
export type CSSClasses = typeof CSS_CLASSES;

