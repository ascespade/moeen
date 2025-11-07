/**
 * Border & Radius System - Extracted from Homepage Design
 * نظام الحدود والزوايا - مستخرج من تصميم الصفحة الرئيسية
 *
 * Source: src/styles/centralized.css
 * Reference: src/components/home/OriginalHero.tsx
 */

// Border Radius (from CSS variables)
export const borderRadius = {
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
  none: '0',
} as const;

// CSS Variable Names
export const radiusVariables = {
  radiusSm: '--radius-sm',
  radiusMd: '--radius-md',
  radiusLg: '--radius-lg',
} as const;

// Border Widths
export const borderWidths = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
} as const;

// Border Styles
export const borderStyles = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  none: 'none',
} as const;

// Component-specific borders
export const componentBorders = {
  card: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.lg,
  },
  button: {
    width: borderWidths[2],
    style: borderStyles.solid,
    radius: borderRadius.md,
  },
  input: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.md,
  },
  badge: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.full,
  },
} as const;

// Tailwind Classes
export const borderClasses = {
  radius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
    none: 'rounded-none',
  },
  width: {
    0: 'border-0',
    1: 'border',
    2: 'border-2',
    4: 'border-4',
  },
} as const;

// Type exports
export type BorderRadius = keyof typeof borderRadius;
export type BorderWidth = keyof typeof borderWidths;
export type BorderStyle = keyof typeof borderStyles;
export type ComponentBorder = keyof typeof componentBorders;

// Helper functions
export function getBorderRadius(size: BorderRadius): string {
  return borderRadius[size];
}

export function getRadiusCSSVar(size: keyof typeof radiusVariables): string {
  return `var(${radiusVariables[size]})`;
}

export function getBorderRadiusClass(size: BorderRadius): string {
  return borderClasses.radius[size];
}
