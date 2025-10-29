// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const THEME_COLORS = {
  LIGHT: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  DARK: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export const FONT_FAMILIES = {
  SANS: ['Inter', 'system-ui', 'sans-serif'],
  SERIF: ['Georgia', 'Times New Roman', 'serif'],
  MONO: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
} as const;

// FONT_SIZES moved to ui.ts to avoid duplication

// SPACING_SCALE moved to centralized.css as CSS variables
// Use var(--space-0), var(--space-1), etc. instead

// BORDER_RADIUS_SCALE moved to centralized.css as CSS variables
// Use var(--radius-none), var(--radius-sm), etc. instead

export const SHADOW_SCALE = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2XL': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  INNER: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

export const TRANSITION_DURATIONS = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',
} as const;

export const TRANSITION_EASING = {
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
