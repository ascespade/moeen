/**
 * Theme System - نظام الثيمات المركزي
 * Centralized theme system exports
 * صادرات نظام الثيمات المركزي
 */

// Core exports
export { default as ThemeManager } from './ThemeManager';
export { ThemeProvider, useTheme, useThemeAware, useDesignTokens, useThemeColors } from './ThemeProvider';
export { 
  commonStyles, 
  createThemeStyles, 
  getThemeStyle, 
  mergeThemeStyles,
  createResponsiveThemeStyles,
  createAnimationStyles,
  createTransitionStyles,
  generateThemeCSSVariables,
  generateComponentCSSVariables
} from './ThemeStyles';

// Type exports
export type { ThemeMode, ResolvedTheme, ThemeConfig, DesignTokens } from './ThemeManager';
export type { ThemeAwareStyles } from './ThemeStyles';

// Re-export for convenience
export { default as ThemeManagerInstance } from './ThemeManager';
