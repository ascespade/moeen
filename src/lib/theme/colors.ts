/**
 * Color System - Extracted from Homepage Design
 * نظام الألوان - مستخرج من تصميم الصفحة الرئيسية
 *
 * Source: src/styles/centralized.css
 * Reference: src/app/page.tsx
 */

// Brand Colors - Core Identity
export const brandColors = {
  primary: '#f97316', // Orange
  primaryHover: '#ea580c',
  secondary: '#eab308', // Yellow
  accent: '#0284c7', // Blue
  success: '#008a7a',
  warning: '#e68900',
  error: '#dc2626',
  info: '#0284c7',
  border: '#cbd5e1',
  surface: '#f1f5f9',
} as const;

// Feature Colors - From Original Design
export const featureColors = {
  innovation: '#22c55e', // Green
  inclusivity: '#3b82f6', // Blue
  qualityStart: '#eab308', // Yellow
  qualityEnd: '#f97316', // Orange
  careStart: '#ec4899', // Pink
  careEnd: '#ef4444', // Red
} as const;

// Neutral Colors - Light Theme
export const lightTheme = {
  background: '#ffffff',
  panel: '#f8faf9',
  surface: '#f1f5f9',
  border: '#cbd5e1',
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
} as const;

// Neutral Colors - Dark Theme
export const darkTheme = {
  background: '#0b0b0b',
  panel: '#0f0f0f',
  surface: '#121212',
  border: '#1f1f1f',
  textPrimary: '#e6eef7',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
} as const;

// CSS Variable Names
export const cssVariables = {
  brandPrimary: '--brand-primary',
  brandPrimaryHover: '--brand-primary-hover',
  brandSecondary: '--brand-secondary',
  brandAccent: '--brand-accent',
  featureInnovation: '--feature-innovation',
  featureInclusivity: '--feature-inclusivity',
  featureQualityStart: '--feature-quality-start',
  featureQualityEnd: '--feature-quality-end',
  featureCareStart: '--feature-care-start',
  featureCareEnd: '--feature-care-end',
  background: '--background',
  panel: '--panel',
  brandSurface: '--brand-surface',
  brandBorder: '--brand-border',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  textMuted: '--text-muted',
  foreground: '--foreground',
} as const;

// Type exports
export type BrandColor = (typeof brandColors)[keyof typeof brandColors];
export type FeatureColor = (typeof featureColors)[keyof typeof featureColors];
export type LightThemeColor = (typeof lightTheme)[keyof typeof lightTheme];
export type DarkThemeColor = (typeof darkTheme)[keyof typeof darkTheme];

// Helper function to get CSS variable
export function getCSSVariable(varName: keyof typeof cssVariables): string {
  return `var(${cssVariables[varName]})`;
}

// Helper function to get color value
export function getColor(color: BrandColor | FeatureColor): string {
  return color;
}
