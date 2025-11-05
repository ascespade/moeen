/**
 * Spacing System - Extracted from Homepage Design
 * نظام المسافات - مستخرج من تصميم الصفحة الرئيسية
 * 
 * Source: src/styles/centralized.css
 * Reference: src/components/home/OriginalHero.tsx
 */

// Spacing Scale (from CSS variables)
export const spacing = {
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

// CSS Variable Names
export const spacingVariables = {
  space1: '--space-1',
  space2: '--space-2',
  space3: '--space-3',
  space4: '--space-4',
  space6: '--space-6',
  space8: '--space-8',
} as const;

// Container Padding (from homepage)
export const containerPadding = {
  mobile: '1rem',
  tablet: '1.5rem',
  desktop: '2rem',
} as const;

// Container Max Width
export const containerMaxWidth = '1200px';

// Section Padding (from homepage sections)
export const sectionPadding = {
  small: 'py-16', // 4rem (64px)
  medium: 'py-20', // 5rem (80px)
  large: 'py-24', // 6rem (96px)
} as const;

// Gap Sizes (from grid layouts)
export const gaps = {
  xs: 'gap-2', // 0.5rem
  sm: 'gap-4', // 1rem
  md: 'gap-6', // 1.5rem
  lg: 'gap-8', // 2rem
  xl: 'gap-12', // 3rem
} as const;

// Type exports
export type Spacing = keyof typeof spacing;
export type ContainerPadding = keyof typeof containerPadding;
export type SectionPadding = keyof typeof sectionPadding;
export type Gap = keyof typeof gaps;

// Helper functions
export function getSpacing(size: Spacing): string {
  return spacing[size];
}

export function getSpacingCSSVar(size: keyof typeof spacingVariables): string {
  return `var(${spacingVariables[size]})`;
}
