/**
 * Design System - نظام التصميم الموحد
 * Centralized design tokens and components
 */

// Color Palette
export const colors = {
  primary: {
    50: '#fef7ed',
    100: '#fdedd3',
    200: '#fbd7a5',
    300: '#f8bc6d',
    400: '#f59e33',
    500: '#E46C0A', // Main brand color
    600: '#d45f08',
    700: '#b84d06',
    800: '#9c3f08',
    900: '#7f3309',
  },
  secondary: {
    50: '#f8f6f0',
    100: '#f0ead6',
    200: '#e1d4ad',
    300: '#d1bd7f',
    400: '#c1a651',
    500: '#6B4E16', // Main secondary
    600: '#5a3f12',
    700: '#49320e',
    800: '#38250a',
    900: '#271806',
  },
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
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

// Typography
// Typography moved to centralized.css as CSS variables
// Use var(--font-size-*), var(--font-weight-*), var(--font-family-*) instead

// Spacing moved to centralized.css as CSS variables
// Use var(--space-0), var(--space-1), etc. instead

// Border Radius moved to centralized.css as CSS variables
// Use var(--radius-none), var(--radius-sm), etc. instead

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-Index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Animation
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Theme Configuration
export const theme = {
  light: {
    colors: {
      background: colors.neutral[50],
      surface: colors.neutral[100],
      primary: colors.primary[500],
      secondary: colors.secondary[500],
      text: colors.neutral[900],
      textSecondary: colors.neutral[600],
      border: colors.neutral[200],
      success: colors.success[500],
      warning: colors.warning[500],
      error: colors.error[500],
    },
  },
  dark: {
    colors: {
      background: colors.neutral[900],
      surface: colors.neutral[800],
      primary: colors.primary[400],
      secondary: colors.secondary[400],
      text: colors.neutral[100],
      textSecondary: colors.neutral[300],
      border: colors.neutral[700],
      success: colors.success[400],
      warning: colors.warning[400],
      error: colors.error[400],
    },
  },
} as const;
