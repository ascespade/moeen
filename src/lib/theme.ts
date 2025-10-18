
  primary: "#F58220",
  primaryHover: "#d66f15",
  secondary: "#009688",
  accent: "#007BFF",
  success: "#009688",
  warning: "#f59e0b",
  error: "#ef4444",
};
  lightBg: "#FFFFFF",
  lightSurface: "#F9FAFB",
  darkBg: "#0D1117",
  darkSurface: "#1E1E2E",
  text: "#111827",
  muted: "#9CA3AF",
  borderLight: "#e5e7eb",
  borderDark: "#1f2937",
};
  fontFamilyArabic: "var(--font-cairo)",
  fontFamilyLatin: "var(--font-inter)",
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    x2: "1.5rem",
    x3: "1.875rem",
    x4: "2.25rem",
  },
};
  x0_5: "0.125rem",
  x1: "0.25rem",
  x1_5: "0.375rem",
  x2: "0.5rem",
  x3: "0.75rem",
  x4: "1rem",
  x6: "1.5rem",
  x8: "2rem",
  x12: "3rem",
};
  soft: "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)",
  softDark: "0 1px 2px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.25)",
};
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },
};
  locale?.toLowerCase() === "ar" ? "rtl" : "ltr";
  locale?.toLowerCase() === "ar" ? "ar" : "en";
// Exports
export const brand = {
export type ThemeMode = "light" | "dark";
export const neutrals = {
export const typography = {
export const spacing = {
export const elevation = {
export const motion = {
export const dirForLocale = (locale: string): "rtl" | "ltr" =>
export const langForLocale = (locale: string): "ar" | "en" =>