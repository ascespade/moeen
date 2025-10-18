/**
 * Design Tokens - رموز التصميم المركزية
 *
 * Central design tokens following industry best practices:
 * - Token-based design system
 * - Theme-aware
 * - Type-safe
 * - Scalable
 */

// ============================================
// COLORS - الألوان
// ============================================

export const colors = {
  // Brand Colors
  brand: {
    primary: "var(--brand-primary)",
    primaryHover: "var(--brand-primary-hover)",
    secondary: "var(--brand-secondary)",
    accent: "var(--brand-accent)",
  },

  // Semantic Colors
  semantic: {
    success: "var(--brand-success)",
    warning: "var(--brand-warning)",
    error: "var(--brand-error)",
    info: "var(--brand-accent)",
  },

  // Background Colors
  bg: {
    primary: "var(--background)",
    secondary: "var(--surface)",
    tertiary: "var(--panel)",
  },

  // Text Colors
  text: {
    primary: "var(--text-primary)",
    secondary: "var(--text-secondary)",
    muted: "var(--text-muted)",
  },

  // Interactive States
  interactive: {
    hover: "var(--hover)",
    active: "var(--active)",
    focus: "var(--focus)",
  },

  // Border
  border: {
    default: "var(--border)",
    accent: "var(--brand-primary)",
  },
} as const;

// ============================================
// SPACING - المسافات
// ============================================

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "var(--space-0-5, 0.125rem)",
  1: "var(--space-1, 0.25rem)",
  2: "var(--space-2, 0.5rem)",
  3: "var(--space-3, 0.75rem)",
  4: "var(--space-4, 1rem)",
  5: "var(--space-5, 1.25rem)",
  6: "var(--space-6, 1.5rem)",
  8: "var(--space-8, 2rem)",
  10: "var(--space-10, 2.5rem)",
  12: "var(--space-12, 3rem)",
  16: "var(--space-16, 4rem)",
  20: "var(--space-20, 5rem)",
  24: "var(--space-24, 6rem)",
  32: "var(--space-32, 8rem)",
} as const;

// ============================================
// TYPOGRAPHY - الطباعة
// ============================================

export const fontSize = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
} as const;

export const fontWeight = {
  thin: "100",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
} as const;

// ============================================
// BORDER RADIUS - نصف القطر
// ============================================

export const borderRadius = {
  none: "0",
  sm: "0.125rem",
  base: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

// ============================================
// SHADOWS - الظلال
// ============================================

export const boxShadow = {
  sm: "var(--shadow-sm)",
  base: "var(--shadow-base)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  "2xl": "var(--shadow-2xl)",
  inner: "var(--shadow-inner)",
  none: "none",
} as const;

// ============================================
// Z-INDEX - ترتيب الطبقات
// ============================================

export const zIndex = {
  hide: -1,
  auto: "auto",
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

// ============================================
// TRANSITIONS - الانتقالات
// ============================================

export const transition = {
  fast: "150ms ease-in-out",
  normal: "300ms ease-in-out",
  slow: "500ms ease-in-out",
  colors:
    "color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out",
  transform: "transform 200ms ease-in-out",
  opacity: "opacity 200ms ease-in-out",
} as const;

// ============================================
// BREAKPOINTS - نقاط التوقف
// ============================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================
// COMPONENT SIZES - أحجام المكونات
// ============================================

export const componentSizes = {
  button: {
    xs: { height: "24px", padding: "0 0.5rem", fontSize: fontSize.xs },
    sm: { height: "32px", padding: "0 0.75rem", fontSize: fontSize.sm },
    md: { height: "40px", padding: "0 1rem", fontSize: fontSize.sm },
    lg: { height: "48px", padding: "0 1.5rem", fontSize: fontSize.base },
    xl: { height: "56px", padding: "0 2rem", fontSize: fontSize.lg },
  },
  input: {
    sm: { height: "32px", padding: "0 0.5rem", fontSize: fontSize.xs },
    md: { height: "40px", padding: "0 0.75rem", fontSize: fontSize.sm },
    lg: { height: "48px", padding: "0 1rem", fontSize: fontSize.base },
  },
  card: {
    sm: { padding: "1rem" },
    md: { padding: "1.5rem" },
    lg: { padding: "2rem" },
  },
} as const;

// ============================================
// UTILITY FUNCTIONS - وظائف مساعدة
// ============================================

/**
 * Get color value by semantic name
 * استخدام: getColor('brand', 'primary') → 'var(--brand-primary)'
 */
export function getColor(category: keyof typeof colors, key: string): string {
  return (colors[category] as any)[key] || colors.text.primary;
}

/**
 * Get spacing value
 * استخدام: getSpacing(4) → 'var(--space-4, 1rem)'
 */
export function getSpacing(size: keyof typeof spacing): string {
  return spacing[size];
}

/**
 * Build className from design tokens
 * استخدام: buildClassName({ bg: 'brand.primary', text: 'white' })
 */
export function buildClassName(tokens: {
  bg?: string;
  text?: string;
  border?: string;
  rounded?: keyof typeof borderRadius;
  shadow?: keyof typeof boxShadow;
  p?: keyof typeof spacing;
  m?: keyof typeof spacing;
}): string {
  const classes: string[] = [];

  if (tokens.bg) classes.push(`bg-${tokens.bg.replace(".", "-")}`);
  if (tokens.text) classes.push(`text-${tokens.text.replace(".", "-")}`);
  if (tokens.border) classes.push(`border-${tokens.border.replace(".", "-")}`);
  if (tokens.rounded) classes.push(`rounded-${tokens.rounded}`);
  if (tokens.shadow) classes.push(`shadow-${tokens.shadow}`);
  if (tokens.p) classes.push(`p-${tokens.p}`);
  if (tokens.m) classes.push(`m-${tokens.m}`);

  return classes.join(" ");
}

// ============================================
// TYPE EXPORTS
// ============================================

export type ColorCategory = keyof typeof colors;
export type SemanticColor = keyof typeof colors.semantic;
export type SpacingSize = keyof typeof spacing;
export type FontSize = keyof typeof fontSize;
export type BorderRadius = keyof typeof borderRadius;
export type BoxShadow = keyof typeof boxShadow;
export type ZIndex = keyof typeof zIndex;
