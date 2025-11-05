/**
 * Shadow System - Extracted from Homepage Design
 * نظام الظلال - مستخرج من تصميم الصفحة الرئيسية
 * 
 * Source: src/styles/centralized.css
 * Reference: src/components/ui/Card.tsx
 */

// Shadow Definitions (from CSS variables)
export const shadows = {
  sm: '0 1px 2px rgba(16, 24, 40, 0.05)',
  md: '0 4px 6px rgba(2, 6, 23, 0.08)',
  lg: '0 10px 15px rgba(2, 6, 23, 0.12)',
  xl: '0 20px 25px rgba(2, 6, 23, 0.15)',
} as const;

// CSS Variable Names
export const shadowVariables = {
  shadowSm: '--shadow-sm',
  shadowMd: '--shadow-md',
  shadowLg: '--shadow-lg',
} as const;

// Tailwind Shadow Classes
export const shadowClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  none: 'shadow-none',
} as const;

// Component-specific shadows
export const componentShadows = {
  card: shadows.sm,
  cardHover: shadows.lg,
  button: shadows.sm,
  buttonHover: shadows.md,
  modal: shadows.xl,
  dropdown: shadows.md,
} as const;

// Type exports
export type Shadow = keyof typeof shadows;
export type ShadowClass = keyof typeof shadowClasses;
export type ComponentShadow = keyof typeof componentShadows;

// Helper functions
export function getShadow(size: Shadow): string {
  return shadows[size];
}

export function getShadowCSSVar(size: keyof typeof shadowVariables): string {
  return `var(${shadowVariables[size]})`;
}

export function getShadowClass(size: ShadowClass): string {
  return shadowClasses[size];
}
