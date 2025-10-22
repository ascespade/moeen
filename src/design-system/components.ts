/**
 * Design System Components - مكونات نظام التصميم
 * 
 * Centralized component styles and variants
 * أنماط المكونات المركزية والمتغيرات
 */

import { BRAND_COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from './tokens';

// ========================================
// BUTTON COMPONENTS - مكونات الأزرار
// ========================================

export const BUTTON_VARIANTS = {
  // Primary Button - الزر الأساسي
  primary: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    colors: 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] focus:ring-[var(--brand-primary)]',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
  },
  
  // Secondary Button - الزر الثانوي
  secondary: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    colors: 'bg-[var(--brand-secondary)] text-white hover:bg-opacity-90 focus:ring-[var(--brand-secondary)]',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
  },
  
  // Outline Button - الزر المحدد
  outline: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    colors: 'border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white focus:ring-[var(--brand-primary)]',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
  },
  
  // Ghost Button - الزر الشفاف
  ghost: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    colors: 'text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:bg-opacity-10 focus:ring-[var(--brand-primary)]',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
  },
} as const;

// ========================================
// CARD COMPONENTS - مكونات البطاقات
// ========================================

export const CARD_VARIANTS = {
  // Default Card - البطاقة الافتراضية
  default: {
    base: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
    padding: 'p-6',
  },
  
  // Elevated Card - البطاقة المرتفعة
  elevated: {
    base: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700',
    padding: 'p-6',
  },
  
  // Outlined Card - البطاقة المحددة
  outlined: {
    base: 'bg-white dark:bg-gray-800 rounded-xl border-2 border-[var(--brand-primary)]',
    padding: 'p-6',
  },
  
  // Glass Card - البطاقة الزجاجية
  glass: {
    base: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50',
    padding: 'p-6',
  },
} as const;

// ========================================
// INPUT COMPONENTS - مكونات الإدخال
// ========================================

export const INPUT_VARIANTS = {
  // Default Input - حقل الإدخال الافتراضي
  default: {
    base: 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200',
  },
  
  // Error Input - حقل الإدخال مع خطأ
  error: {
    base: 'w-full px-4 py-3 rounded-lg border border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200',
  },
  
  // Success Input - حقل الإدخال مع نجاح
  success: {
    base: 'w-full px-4 py-3 rounded-lg border border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200',
  },
} as const;

// ========================================
// BADGE COMPONENTS - مكونات الشارات
// ========================================

export const BADGE_VARIANTS = {
  // Default Badge - الشارة الافتراضية
  default: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    colors: 'bg-[var(--brand-primary)] text-white',
  },
  
  // Success Badge - شارة النجاح
  success: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    colors: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  
  // Warning Badge - شارة التحذير
  warning: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    colors: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  
  // Error Badge - شارة الخطأ
  error: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    colors: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  
  // Info Badge - شارة المعلومات
  info: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    colors: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
} as const;

// ========================================
// FORM COMPONENTS - مكونات النماذج
// ========================================

export const FORM_VARIANTS = {
  // Form Label - تسمية النموذج
  label: {
    base: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
  },
  
  // Form Error - خطأ النموذج
  error: {
    base: 'mt-1 text-sm text-red-600 dark:text-red-400',
  },
  
  // Form Help - مساعدة النموذج
  help: {
    base: 'mt-1 text-sm text-gray-500 dark:text-gray-400',
  },
} as const;

// ========================================
// LAYOUT COMPONENTS - مكونات التخطيط
// ========================================

export const LAYOUT_VARIANTS = {
  // Container - الحاوية
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
  
  // Grid - الشبكة
  grid: {
    base: 'grid gap-6',
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },
  
  // Flex - المرونة
  flex: {
    base: 'flex',
    direction: {
      row: 'flex-row',
      col: 'flex-col',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
} as const;

// ========================================
// STATUS COMPONENTS - مكونات الحالة
// ========================================

export const STATUS_VARIANTS = {
  // Loading Spinner - مؤشر التحميل
  loading: {
    base: 'animate-spin rounded-full border-2 border-gray-300 border-t-[var(--brand-primary)]',
    sizes: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  
  // Status Dot - نقطة الحالة
  statusDot: {
    base: 'rounded-full',
    sizes: {
      sm: 'h-2 w-2',
      md: 'h-3 w-3',
      lg: 'h-4 w-4',
    },
    colors: {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-yellow-500',
      away: 'bg-orange-500',
    },
  },
} as const;

// ========================================
// UTILITY CLASSES - فئات المساعدة
// ========================================

export const UTILITY_CLASSES = {
  // Text Colors - ألوان النص
  text: {
    primary: 'text-[var(--brand-primary)]',
    secondary: 'text-[var(--brand-secondary)]',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    muted: 'text-gray-500',
  },
  
  // Background Colors - ألوان الخلفية
  background: {
    primary: 'bg-[var(--brand-primary)]',
    secondary: 'bg-[var(--brand-secondary)]',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    muted: 'bg-gray-100',
  },
  
  // Border Colors - ألوان الحدود
  border: {
    primary: 'border-[var(--brand-primary)]',
    secondary: 'border-[var(--brand-secondary)]',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    muted: 'border-gray-300',
  },
  
  // Shadows - الظلال
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none',
  },
  
  // Rounded Corners - الزوايا المدورة
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
} as const;