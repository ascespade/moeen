/**
 * Design System Components
 * مكونات نظام التصميم
 * 
 * Centralized component definitions and utilities
 * تعريفات المكونات والأدوات المركزية
 */

import { BRAND_COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from './tokens';

// ========================================
// BUTTON COMPONENTS - مكونات الأزرار
// ========================================

export const BUTTON_VARIANTS = {
  // Primary Button - الزر الأساسي
  primary: {
    base: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    styles: {
      backgroundColor: BRAND_COLORS.primary.DEFAULT,
      color: '#ffffff',
      border: 'none',
      '&:hover': {
        backgroundColor: BRAND_COLORS.primary.hover,
        transform: 'translateY(-1px)',
        boxShadow: SHADOWS.md,
      },
      '&:focus': {
        ringColor: BRAND_COLORS.primary.DEFAULT,
      },
    },
  },

  // Secondary Button - الزر الثانوي
  secondary: {
    base: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    styles: {
      backgroundColor: BRAND_COLORS.neutral[50],
      color: BRAND_COLORS.neutral[900],
      border: `1px solid ${BRAND_COLORS.neutral[200]}`,
      '&:hover': {
        backgroundColor: BRAND_COLORS.neutral[100],
        transform: 'translateY(-1px)',
      },
      '&:focus': {
        ringColor: BRAND_COLORS.primary.DEFAULT,
      },
    },
  },

  // Outline Button - الزر المحدد
  outline: {
    base: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    styles: {
      backgroundColor: 'transparent',
      color: BRAND_COLORS.primary.DEFAULT,
      border: `1px solid ${BRAND_COLORS.primary.DEFAULT}`,
      '&:hover': {
        backgroundColor: BRAND_COLORS.primary.DEFAULT,
        color: '#ffffff',
        transform: 'translateY(-1px)',
      },
      '&:focus': {
        ringColor: BRAND_COLORS.primary.DEFAULT,
      },
    },
  },

  // Ghost Button - الزر الشفاف
  ghost: {
    base: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    styles: {
      backgroundColor: 'transparent',
      color: BRAND_COLORS.neutral[700],
      border: 'none',
      '&:hover': {
        backgroundColor: BRAND_COLORS.neutral[100],
        color: BRAND_COLORS.neutral[900],
      },
      '&:focus': {
        ringColor: BRAND_COLORS.primary.DEFAULT,
      },
    },
  },

  // Danger Button - زر الخطر
  danger: {
    base: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    styles: {
      backgroundColor: BRAND_COLORS.status.error,
      color: '#ffffff',
      border: 'none',
      '&:hover': {
        backgroundColor: '#dc2626',
        transform: 'translateY(-1px)',
        boxShadow: SHADOWS.md,
      },
      '&:focus': {
        ringColor: BRAND_COLORS.status.error,
      },
    },
  },
} as const;

export const BUTTON_SIZES = {
  sm: {
    padding: `${SPACING[2]} ${SPACING[3]}`,
    fontSize: TYPOGRAPHY.fontSize.xs[0],
    height: '2rem',
  },
  md: {
    padding: `${SPACING[2]} ${SPACING[4]}`,
    fontSize: TYPOGRAPHY.fontSize.sm[0],
    height: '2.5rem',
  },
  lg: {
    padding: `${SPACING[3]} ${SPACING[6]}`,
    fontSize: TYPOGRAPHY.fontSize.base[0],
    height: '3rem',
  },
  xl: {
    padding: `${SPACING[4]} ${SPACING[8]}`,
    fontSize: TYPOGRAPHY.fontSize.lg[0],
    height: '3.5rem',
  },
} as const;

// ========================================
// CARD COMPONENTS - مكونات البطاقات
// ========================================

export const CARD_VARIANTS = {
  default: {
    base: 'bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200',
    styles: {
      backgroundColor: '#ffffff',
      borderColor: BRAND_COLORS.neutral[200],
      borderRadius: BORDER_RADIUS.lg,
      boxShadow: SHADOWS.sm,
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: SHADOWS.md,
      },
    },
  },

  elevated: {
    base: 'bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200',
    styles: {
      backgroundColor: '#ffffff',
      borderColor: BRAND_COLORS.neutral[200],
      borderRadius: BORDER_RADIUS.lg,
      boxShadow: SHADOWS.lg,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: SHADOWS.xl,
      },
    },
  },

  outlined: {
    base: 'bg-transparent border-2 border-gray-200 rounded-lg transition-all duration-200',
    styles: {
      backgroundColor: 'transparent',
      borderColor: BRAND_COLORS.neutral[200],
      borderRadius: BORDER_RADIUS.lg,
      '&:hover': {
        borderColor: BRAND_COLORS.primary.DEFAULT,
        backgroundColor: BRAND_COLORS.neutral[50],
      },
    },
  },

  filled: {
    base: 'bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200',
    styles: {
      backgroundColor: BRAND_COLORS.neutral[50],
      borderColor: BRAND_COLORS.neutral[200],
      borderRadius: BORDER_RADIUS.lg,
      '&:hover': {
        backgroundColor: BRAND_COLORS.neutral[100],
        transform: 'translateY(-1px)',
      },
    },
  },
} as const;

export const CARD_SIZES = {
  sm: {
    padding: SPACING[4],
  },
  md: {
    padding: SPACING[6],
  },
  lg: {
    padding: SPACING[8],
  },
} as const;

// ========================================
// INPUT COMPONENTS - مكونات الإدخال
// ========================================

export const INPUT_VARIANTS = {
  default: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-150',
    styles: {
      borderColor: BRAND_COLORS.neutral[300],
      '&:focus': {
        borderColor: BRAND_COLORS.primary.DEFAULT,
        ringColor: BRAND_COLORS.primary.DEFAULT,
      },
      '&:disabled': {
        backgroundColor: BRAND_COLORS.neutral[100],
        color: BRAND_COLORS.neutral[500],
        cursor: 'not-allowed',
      },
    },
  },

  error: {
    base: 'w-full px-3 py-2 border border-red-300 rounded-md text-sm placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-150',
    styles: {
      borderColor: BRAND_COLORS.status.error,
      '&:focus': {
        borderColor: BRAND_COLORS.status.error,
        ringColor: BRAND_COLORS.status.error,
      },
    },
  },

  success: {
    base: 'w-full px-3 py-2 border border-green-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-150',
    styles: {
      borderColor: BRAND_COLORS.status.success,
      '&:focus': {
        borderColor: BRAND_COLORS.status.success,
        ringColor: BRAND_COLORS.status.success,
      },
    },
  },
} as const;

export const INPUT_SIZES = {
  sm: {
    padding: `${SPACING[1]} ${SPACING[2]}`,
    fontSize: TYPOGRAPHY.fontSize.xs[0],
    height: '2rem',
  },
  md: {
    padding: `${SPACING[2]} ${SPACING[3]}`,
    fontSize: TYPOGRAPHY.fontSize.sm[0],
    height: '2.5rem',
  },
  lg: {
    padding: `${SPACING[3]} ${SPACING[4]}`,
    fontSize: TYPOGRAPHY.fontSize.base[0],
    height: '3rem',
  },
} as const;

// ========================================
// BADGE COMPONENTS - مكونات الشارات
// ========================================

export const BADGE_VARIANTS = {
  default: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    styles: {
      backgroundColor: BRAND_COLORS.neutral[100],
      color: BRAND_COLORS.neutral[800],
    },
  },

  primary: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    styles: {
      backgroundColor: BRAND_COLORS.primary[100],
      color: BRAND_COLORS.primary[800],
    },
  },

  success: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    styles: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
  },

  warning: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    styles: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
  },

  error: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    styles: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
  },
} as const;

// ========================================
// ALERT COMPONENTS - مكونات التنبيهات
// ========================================

export const ALERT_VARIANTS = {
  info: {
    base: 'rounded-md p-4',
    styles: {
      backgroundColor: '#dbeafe',
      borderColor: '#93c5fd',
      color: '#1e40af',
    },
  },

  success: {
    base: 'rounded-md p-4',
    styles: {
      backgroundColor: '#dcfce7',
      borderColor: '#86efac',
      color: '#166534',
    },
  },

  warning: {
    base: 'rounded-md p-4',
    styles: {
      backgroundColor: '#fef3c7',
      borderColor: '#fde047',
      color: '#92400e',
    },
  },

  error: {
    base: 'rounded-md p-4',
    styles: {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
      color: '#991b1b',
    },
  },
} as const;

// ========================================
// NAVIGATION COMPONENTS - مكونات التنقل
// ========================================

export const NAV_VARIANTS = {
  default: {
    base: 'flex items-center space-x-4',
    link: 'text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
  },

  tabs: {
    base: 'flex space-x-1',
    tab: 'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
    active: 'bg-white text-gray-900 shadow-sm',
    inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
  },

  sidebar: {
    base: 'flex flex-col space-y-1',
    link: 'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
    active: 'bg-gray-100 text-gray-900',
    inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  },
} as const;

// ========================================
// LAYOUT COMPONENTS - مكونات التخطيط
// ========================================

export const LAYOUT = {
  container: {
    base: 'mx-auto px-4 sm:px-6 lg:px-8',
    sizes: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    },
  },

  grid: {
    base: 'grid gap-4',
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    },
  },

  flex: {
    base: 'flex',
    direction: {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
  },
} as const;
