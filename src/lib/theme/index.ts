/**
 * Theme System - Complete Design Tokens
 * نظام الثيم - معاملات التصميم الكاملة
 * 
 * Centralized export of all design tokens extracted from homepage
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './borders';
export * from './animations';

// Re-export all for convenience
import { brandColors, featureColors, lightTheme, darkTheme } from './colors';
import { typography, fontSizes, fontWeights } from './typography';
import { spacing, containerMaxWidth } from './spacing';
import { shadows } from './shadows';
import { borderRadius } from './borders';
import { transitions, keyframes } from './animations';

export const theme = {
  colors: {
    brand: brandColors,
    feature: featureColors,
    light: lightTheme,
    dark: darkTheme,
  },
  typography: {
    fonts: typography,
    sizes: fontSizes,
    weights: fontWeights,
  },
  spacing: {
    scale: spacing,
    container: {
      maxWidth: containerMaxWidth,
    },
  },
  shadows,
  borderRadius,
  transitions,
  animations: keyframes,
} as const;

export type Theme = typeof theme;
