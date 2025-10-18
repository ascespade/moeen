
// Theme constants
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const THEME_COLORS = {
  LIGHT: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  DARK: {
    primary: "#60a5fa",
    secondary: "#9ca3af",
    success: "#4ade80",
    warning: "#fbbf24",
    error: "#f87171",
    background: "#111827",
    surface: "#1f2937",
    text: "#f9fafb",
    textSecondary: "#d1d5db",
    border: "#374151",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
} as const;

export const FONT_FAMILIES = {
  SANS: ["Inter", "system-ui", "sans-serif"],
  SERIF: ["Georgia", "Times New Roman", "serif"],
  MONO: ["Fira Code", "Monaco", "Consolas", "monospace"],
} as const;

// FONT_SIZES moved to ui.ts to avoid duplication
export const SPACING_SCALE = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
} as const;

export const BORDER_RADIUS_SCALE = {
  NONE: "0",
  SM: "0.125rem",
  DEFAULT: "0.25rem",
  MD: "0.375rem",
  LG: "0.5rem",
  XL: "0.75rem",
  "2XL": "1rem",
  "3XL": "1.5rem",
  FULL: "9999px",
} as const;

export const SHADOW_SCALE = {
  NONE: "none",
  SM: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  MD: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  LG: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  XL: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2XL": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  INNER: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

export const TRANSITION_DURATIONS = {
  FAST: "150ms",
  NORMAL: "300ms",
  SLOW: "500ms",
} as const;

export const TRANSITION_EASING = {
  LINEAR: "linear",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
  BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  SMOOTH: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;