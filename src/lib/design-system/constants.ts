/**
 * Design System Constants - Centralized Parameters
 * ثوابت نظام التصميم - المعاملات المركزية
 *
 * DO NOT MODIFY THESE VALUES - These are the core design system
 * لا تعدل هذه القيم - هذه هي نواة نظام التصميم
 */

// Core Brand Colors - NEVER CHANGE
export const BRAND_COLORS = {
  PRIMARY: '#f97316', // Orange
  PRIMARY_HOVER: '#ea580c',
  SECONDARY: '#eab308', // Yellow
  ACCENT: '#0284c7', // Blue
} as const;

// Feature Card Colors - Exact from Original Design
export const FEATURE_COLORS = {
  INNOVATION: {
    solid: '#22c55e', // Green
    gradient: 'from-green-500 to-green-600',
  },
  INCLUSIVITY: {
    solid: '#3b82f6', // Blue
    gradient: 'from-blue-500 to-blue-600',
  },
  QUALITY: {
    solid: '#f97316', // Orange
    gradient: 'from-yellow-500 to-orange-500',
  },
  CARE: {
    solid: '#ec4899', // Pink
    gradient: 'from-pink-500 to-red-500',
  },
} as const;

// Layout Constants
export const LAYOUT = {
  CONTAINER_MAX_WIDTH: '1200px',
  CONTAINER_PADDING_MOBILE: '1rem',
  CONTAINER_PADDING_TABLET: '1.5rem',
  CONTAINER_PADDING_DESKTOP: '2rem',
} as const;

// Spacing Scale
export const SPACING = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

// Border Radius
export const RADIUS = {
  SM: '0.25rem',
  MD: '0.375rem',
  LG: '0.5rem',
  XL: '0.75rem',
  '2XL': '1rem',
} as const;

// Shadows
export const SHADOWS = {
  SM: '0 1px 2px rgba(16, 24, 40, 0.05)',
  MD: '0 4px 6px rgba(2, 6, 23, 0.08)',
  LG: '0 10px 15px rgba(2, 6, 23, 0.12)',
  XL: '0 20px 25px rgba(2, 6, 23, 0.15)',
} as const;

// Typography
export const TYPOGRAPHY = {
  FONT_SIZES: {
    XS: '0.75rem',
    SM: '0.875rem',
    BASE: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    '2XL': '1.5rem',
    '3XL': '1.875rem',
    '4XL': '2.25rem',
    '5XL': '3rem',
  },
  FONT_WEIGHTS: {
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
    BLACK: 900,
  },
  LINE_HEIGHTS: {
    TIGHT: '1.25',
    NORMAL: '1.5',
    RELAXED: '1.75',
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Transitions
export const TRANSITIONS = {
  FAST: '150ms ease-out',
  NORMAL: '300ms ease-out',
  SLOW: '500ms ease-out',
} as const;

// Z-Index Scale
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// Component Specific Constants
export const COMPONENTS = {
  BUTTON: {
    HEIGHT_SM: '2rem',
    HEIGHT_MD: '2.5rem',
    HEIGHT_LG: '3rem',
    PADDING_X_SM: '0.75rem',
    PADDING_X_MD: '1rem',
    PADDING_X_LG: '1.5rem',
  },
  CARD: {
    PADDING_SM: '1rem',
    PADDING_MD: '1.5rem',
    PADDING_LG: '2rem',
    BORDER_RADIUS: '0.5rem',
  },
  INPUT: {
    HEIGHT: '2.5rem',
    PADDING_X: '0.75rem',
    PADDING_Y: '0.5rem',
  },
} as const;

// Design System Version
export const DESIGN_SYSTEM_VERSION = '1.0.0';

// Export all as single object
export const DESIGN_SYSTEM = {
  BRAND_COLORS,
  FEATURE_COLORS,
  LAYOUT,
  SPACING,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  BREAKPOINTS,
  TRANSITIONS,
  Z_INDEX,
  COMPONENTS,
  VERSION: DESIGN_SYSTEM_VERSION,
} as const;

