/**
 * Theme Styles - أنماط الثيم المركزي
 * Centralized CSS-in-JS styles with theme support
 * أنماط CSS-in-JS مركزية مع دعم الثيمات
 */

import { ResolvedTheme } from './ThemeManager';

// ========================================
// THEME-AWARE STYLES - أنماط مراعية للثيم
// ========================================

export interface ThemeAwareStyles {
  light: Record<string, any>;
  dark: Record<string, any>;
}

/**
 * Create theme-aware styles
 * إنشاء أنماط مراعية للثيم
 */
export function createThemeStyles(styles: ThemeAwareStyles) {
  return styles;
}

// ========================================
// COMMON STYLES - الأنماط الشائعة
// ========================================

export const commonStyles = {
  // Button styles
  button: createThemeStyles({
    light: {
      base: 'px-4 py-2 rounded-md font-medium transition-colors duration-200',
      primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
      secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
      outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
      ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
    },
    dark: {
      base: 'px-4 py-2 rounded-md font-medium transition-colors duration-200',
      primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
      secondary: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2',
      outline: 'border border-neutral-600 text-neutral-300 hover:bg-neutral-800 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
      ghost: 'text-neutral-300 hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2',
    },
  }),

  // Card styles
  card: createThemeStyles({
    light: {
      base: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
      elevated: 'bg-white border border-neutral-200 rounded-lg shadow-md',
      flat: 'bg-white border border-neutral-200 rounded-lg',
    },
    dark: {
      base: 'bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm',
      elevated: 'bg-neutral-800 border border-neutral-700 rounded-lg shadow-md',
      flat: 'bg-neutral-800 border border-neutral-700 rounded-lg',
    },
  }),

  // Input styles
  input: createThemeStyles({
    light: {
      base: 'w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
      error: 'w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
      disabled: 'w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-100 text-neutral-500 cursor-not-allowed',
    },
    dark: {
      base: 'w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
      error: 'w-full px-3 py-2 border border-red-500 rounded-md bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
      disabled: 'w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-900 text-neutral-500 cursor-not-allowed',
    },
  }),

  // Text styles
  text: createThemeStyles({
    light: {
      primary: 'text-neutral-900',
      secondary: 'text-neutral-600',
      muted: 'text-neutral-500',
      accent: 'text-brand-primary',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
    },
    dark: {
      primary: 'text-white',
      secondary: 'text-neutral-300',
      muted: 'text-neutral-400',
      accent: 'text-brand-primary',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
    },
  }),

  // Background styles
  background: createThemeStyles({
    light: {
      primary: 'bg-white',
      secondary: 'bg-neutral-50',
      tertiary: 'bg-neutral-100',
      accent: 'bg-brand-primary',
    },
    dark: {
      primary: 'bg-neutral-900',
      secondary: 'bg-neutral-800',
      tertiary: 'bg-neutral-700',
      accent: 'bg-brand-primary',
    },
  }),

  // Border styles
  border: createThemeStyles({
    light: {
      primary: 'border-neutral-200',
      secondary: 'border-neutral-300',
      accent: 'border-brand-primary',
      error: 'border-red-500',
    },
    dark: {
      primary: 'border-neutral-700',
      secondary: 'border-neutral-600',
      accent: 'border-brand-primary',
      error: 'border-red-500',
    },
  }),
};

// ========================================
// UTILITY FUNCTIONS - دوال مساعدة
// ========================================

/**
 * Get theme-aware style
 * الحصول على نمط مراعي للثيم
 */
export function getThemeStyle(
  styles: ThemeAwareStyles,
  theme: ResolvedTheme,
  variant?: string
): Record<string, any> {
  const themeStyles = styles[theme];
  if (variant && themeStyles[variant]) {
    return themeStyles[variant];
  }
  return themeStyles.base || themeStyles;
}

/**
 * Merge theme styles
 * دمج أنماط الثيم
 */
export function mergeThemeStyles(
  baseStyles: Record<string, any>,
  themeStyles: Record<string, any>
): Record<string, any> {
  return {
    ...baseStyles,
    ...themeStyles,
  };
}

/**
 * Create responsive theme styles
 * إنشاء أنماط ثيم متجاوبة
 */
export function createResponsiveThemeStyles(
  styles: ThemeAwareStyles,
  breakpoints: Record<string, string> = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
) {
  return {
    light: {
      ...styles.light,
      responsive: breakpoints,
    },
    dark: {
      ...styles.dark,
      responsive: breakpoints,
    },
  };
}

/**
 * Create animation styles
 * إنشاء أنماط الحركة
 */
export function createAnimationStyles() {
  return {
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
    scaleIn: 'animate-scale-in',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
  };
}

/**
 * Create transition styles
 * إنشاء أنماط الانتقال
 */
export function createTransitionStyles() {
  return {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
    opacity: 'transition-opacity duration-200 ease-in-out',
  };
}

// ========================================
// CSS VARIABLES - متغيرات CSS
// ========================================

/**
 * Generate CSS variables for theme
 * إنشاء متغيرات CSS للثيم
 */
export function generateThemeCSSVariables(theme: ResolvedTheme): string {
  const isDark = theme === 'dark';
  
  return `
    :root {
      --theme-mode: ${theme};
      --theme-is-dark: ${isDark ? '1' : '0'};
      --theme-is-light: ${isDark ? '0' : '1'};
    }
  `;
}

/**
 * Generate component CSS variables
 * إنشاء متغيرات CSS للمكونات
 */
export function generateComponentCSSVariables(
  componentName: string,
  styles: Record<string, any>
): string {
  const variables = Object.entries(styles)
    .map(([key, value]) => `--${componentName}-${key}: ${value};`)
    .join('\n    ');
  
  return `
    .${componentName} {
      ${variables}
    }
  `;
}

export default commonStyles;
