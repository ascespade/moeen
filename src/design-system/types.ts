/**
 * Design System Types
 * أنواع نظام التصميم
 * 
 * TypeScript type definitions for design system
 * تعريفات أنواع TypeScript لنظام التصميم
 */

import { ReactNode, CSSProperties } from 'react';

// ========================================
// BASE TYPES - الأنواع الأساسية
// ========================================

export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';
export type Direction = 'ltr' | 'rtl';
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// ========================================
// COLOR TYPES - أنواع الألوان
// ========================================

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  DEFAULT?: string;
  hover?: string;
}

export interface BrandColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: {
    blue: string;
    green: string;
    purple: string;
    pink: string;
    yellow: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  neutral: ColorPalette;
}

// ========================================
// SPACING TYPES - أنواع المسافات
// ========================================

export interface SpacingScale {
  [key: string]: string;
}

export interface ResponsiveSpacing {
  mobile: string;
  tablet: string;
  desktop: string;
}

// ========================================
// TYPOGRAPHY TYPES - أنواع الخطوط
// ========================================

export interface FontSize {
  fontSize: string;
  lineHeight: string;
}

export interface ResponsiveTypography {
  mobile: FontSize;
  tablet: FontSize;
  desktop: FontSize;
}

export interface TypographyScale {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    [key: string]: [string, { lineHeight: string }];
  };
  fontWeight: {
    [key: string]: string;
  };
  letterSpacing: {
    [key: string]: string;
  };
  lineHeight: {
    [key: string]: string;
  };
}

// ========================================
// COMPONENT TYPES - أنواع المكونات
// ========================================

export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: keyof typeof import('./components').BUTTON_VARIANTS;
  size?: keyof typeof import('./components').BUTTON_SIZES;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  variant?: keyof typeof import('./components').CARD_VARIANTS;
  size?: keyof typeof import('./components').CARD_SIZES;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface InputProps extends BaseComponentProps {
  variant?: keyof typeof import('./components').INPUT_VARIANTS;
  size?: keyof typeof import('./components').INPUT_SIZES;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: keyof typeof import('./components').BADGE_VARIANTS;
  size?: Size;
  removable?: boolean;
  onRemove?: () => void;
}

export interface AlertProps extends BaseComponentProps {
  variant?: keyof typeof import('./components').ALERT_VARIANTS;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
}

// ========================================
// LAYOUT TYPES - أنواع التخطيط
// ========================================

export interface ContainerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  fluid?: boolean;
}

export interface GridProps extends BaseComponentProps {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: keyof SpacingScale;
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
  };
}

export interface FlexProps extends BaseComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  gap?: keyof SpacingScale;
}

// ========================================
// HOOK TYPES - أنواع الخطافات
// ========================================

export interface ThemeHookReturn {
  theme: Theme;
  isLoading: boolean;
  toggleTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  isLight: boolean;
  isDark: boolean;
}

export interface LanguageHookReturn {
  language: Language;
  isLoading: boolean;
  toggleLanguage: () => void;
  setArabic: () => void;
  setEnglish: () => void;
  isArabic: boolean;
  isEnglish: boolean;
  direction: Direction;
}

export interface RTLHookReturn {
  isRTL: boolean;
  direction: Direction;
  getRTLValue: <T>(ltrValue: T, rtlValue: T) => T;
  getRTLClass: (ltrClass: string, rtlClass: string) => string;
  getRTLStyle: (ltrStyle: CSSProperties, rtlStyle: CSSProperties) => CSSProperties;
}

export interface BreakpointHookReturn {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
}

export interface AnimationHookReturn {
  isAnimating: boolean;
  startAnimation: () => void;
  stopAnimation: () => void;
  toggleAnimation: () => void;
}

export interface StaggeredAnimationHookReturn {
  visibleItems: number[];
  getItemDelay: (index: number) => number;
}

export interface FocusHookReturn {
  focusedElement: HTMLElement | null;
  focusElement: (element: HTMLElement | null) => void;
  blurElement: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
}

export interface ValidationHookReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  setValue: (field: keyof T, value: any) => void;
  setTouchedField: (field: keyof T) => void;
  validateField: (field: keyof T, value: any) => string | null;
  validateAll: () => boolean;
  reset: () => void;
  isValid: boolean;
}

export interface StorageHookReturn<T> {
  value: T;
  updateValue: (newValue: T) => void;
  removeValue: () => void;
  isLoading: boolean;
}

// ========================================
// UTILITY TYPES - أنواع الأدوات
// ========================================

export interface ColorUtilities {
  generateColorPalette: (baseColor: string) => ColorPalette;
  getContrastColor: (backgroundColor: string) => string;
  hexToRgb: (hex: string) => { r: number; g: number; b: number } | null;
  rgbToHex: (r: number, g: number, b: number) => string;
}

export interface SpacingUtilities {
  generateSpacingScale: (baseUnit?: number) => SpacingScale;
  getResponsiveSpacing: (
    mobile: string,
    tablet?: string,
    desktop?: string
  ) => ResponsiveSpacing;
}

export interface TypographyUtilities {
  generateFontSize: (fontSize: string, lineHeight?: string | number) => FontSize;
  getResponsiveTypography: (
    mobile: { fontSize: string; lineHeight?: string | number },
    tablet?: { fontSize: string; lineHeight?: string | number },
    desktop?: { fontSize: string; lineHeight?: string | number }
  ) => ResponsiveTypography;
}

export interface LayoutUtilities {
  generateGridColumns: (cols: number, gap?: string) => CSSProperties;
  generateFlexLayout: (
    direction?: 'row' | 'column',
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch',
    wrap?: boolean
  ) => CSSProperties;
}

export interface RTLUtilities {
  getRTLProperty: (ltrValue: string, rtlValue: string, direction?: Direction) => string;
  getLogicalProperty: (
    property: 'margin' | 'padding' | 'border',
    side: 'start' | 'end' | 'block-start' | 'block-end',
    value: string
  ) => Record<string, string>;
}

export interface AnimationUtilities {
  generateTransition: (properties: string[], duration?: number, easing?: string) => string;
  generateKeyframe: (
    name: string,
    keyframes: Record<string, Record<string, string | number>>
  ) => string;
}

export interface CSSUtilities {
  generateCSSVariables: (variables: Record<string, string>) => string;
  generateMediaQuery: (breakpoint: Breakpoint, styles: Record<string, string | number>) => string;
}

export interface ThemeUtilities {
  generateThemeVariables: (theme: Theme) => Record<string, string>;
  applyTheme: (theme: Theme) => void;
}

export interface ValidationUtilities {
  isValidColor: (color: string) => boolean;
  isValidSpacing: (value: string | number) => boolean;
}

export interface HelperUtilities {
  deepMerge: <T extends Record<string, any>>(target: T, source: Partial<T>) => T;
  generateId: (prefix?: string) => string;
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => (...args: Parameters<T>) => void;
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => (...args: Parameters<T>) => void;
}

// ========================================
// DESIGN SYSTEM CONFIG - إعدادات نظام التصميم
// ========================================

export interface DesignSystemConfig {
  theme: Theme;
  language: Language;
  direction: Direction;
  breakpoint: Breakpoint;
  colors: BrandColors;
  spacing: SpacingScale;
  typography: TypographyScale;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  zIndex: Record<string, number | string>;
  animation: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

// ========================================
// EVENT TYPES - أنواع الأحداث
// ========================================

export interface ThemeChangeEvent {
  theme: Theme;
  previousTheme: Theme;
}

export interface LanguageChangeEvent {
  language: Language;
  previousLanguage: Language;
  direction: Direction;
}

export interface BreakpointChangeEvent {
  breakpoint: Breakpoint;
  previousBreakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// ========================================
// CONTEXT TYPES - أنواع السياق
// ========================================

export interface DesignSystemContextValue {
  theme: Theme;
  language: Language;
  direction: Direction;
  breakpoint: Breakpoint;
  config: DesignSystemConfig;
  updateTheme: (theme: Theme) => void;
  updateLanguage: (language: Language) => void;
}

// ========================================
// PROVIDER TYPES - أنواع المزودين
// ========================================

export interface DesignSystemProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  config?: Partial<DesignSystemConfig>;
}

// ========================================
// EXPORT ALL TYPES - تصدير جميع الأنواع
// ========================================

export type {
  // Re-export commonly used types
  ReactNode,
  CSSProperties,
};
