/**
 * Design System Types - أنواع نظام التصميم
 * 
 * TypeScript types for design system
 * أنواع TypeScript لنظام التصميم
 */

// ========================================
// BRAND TYPES - أنواع العلامة التجارية
// ========================================

export type BrandColor = keyof typeof import('./tokens').BRAND_COLORS;
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'DEFAULT' | 'hover';

// ========================================
// COMPONENT TYPES - أنواع المكونات
// ========================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

export type InputVariant = 'default' | 'error' | 'success';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

// ========================================
// LAYOUT TYPES - أنواع التخطيط
// ========================================

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type GridColumns = 1 | 2 | 3 | 4;
export type FlexDirection = 'row' | 'col';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch';

// ========================================
// THEME TYPES - أنواع الثيم
// ========================================

export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ========================================
// RESPONSIVE TYPES - أنواع الاستجابة
// ========================================

export type ResponsiveValue<T> = {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// ========================================
// ANIMATION TYPES - أنواع الحركة
// ========================================

export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing = 'linear' | 'in' | 'out' | 'in-out';

// ========================================
// ACCESSIBILITY TYPES - أنواع إمكانية الوصول
// ========================================

export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';
export type AccessibilityLevel = 'basic' | 'enhanced' | 'maximum';

// ========================================
// UTILITY TYPES - أنواع المساعدة
// ========================================

export type SpacingScale = keyof typeof import('./tokens').SPACING;
export type TypographyScale = keyof typeof import('./tokens').TYPOGRAPHY.fontSize;
export type BorderRadiusScale = keyof typeof import('./tokens').BORDER_RADIUS;
export type ShadowScale = keyof typeof import('./tokens').SHADOWS;

// ========================================
// COMPONENT PROPS TYPES - أنواع خصائص المكونات
// ========================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface InputProps extends BaseComponentProps {
  variant?: InputVariant;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
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
  isRTL: boolean;
  isLTR: boolean;
}

export interface ResponsiveHookReturn {
  breakpoint: Breakpoint;
  isLoading: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
}

export interface ColorHookReturn {
  primaryColor: string;
  secondaryColor: string;
  updatePrimaryColor: (color: string) => void;
  updateSecondaryColor: (color: string) => void;
  resetColors: () => void;
}

export interface AnimationHookReturn {
  isAnimating: boolean;
  animationDuration: number;
  startAnimation: (duration?: number) => void;
  stopAnimation: () => void;
}

export interface AccessibilityHookReturn {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: FontSize;
  updateFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
}

export interface DesignSystemHookReturn {
  theme: ThemeHookReturn;
  language: LanguageHookReturn;
  responsive: ResponsiveHookReturn;
  color: ColorHookReturn;
  animation: AnimationHookReturn;
  accessibility: AccessibilityHookReturn;
}

// ========================================
// CSS VARIABLE TYPES - أنواع متغيرات CSS
// ========================================

export interface CSSVariables {
  [key: string]: string;
}

export interface ThemeVariables extends CSSVariables {
  '--brand-primary': string;
  '--brand-primary-hover': string;
  '--brand-secondary': string;
  '--brand-accent': string;
  '--brand-success': string;
  '--brand-warning': string;
  '--brand-error': string;
  '--background': string;
  '--foreground': string;
  '--brand-surface': string;
  '--panel': string;
  '--brand-border': string;
  '--font-family-sans': string;
  '--font-family-mono': string;
}

// ========================================
// UTILITY FUNCTION TYPES - أنواع وظائف المساعدة
// ========================================

export type ColorWithOpacity = (color: string, opacity: number) => string;
export type GetBrandColor = (colorName: BrandColor, shade?: ColorShade) => string;
export type GetSpacing = (size: SpacingScale) => string;
export type GetResponsiveSpacing = (
  mobile: SpacingScale,
  tablet?: SpacingScale,
  desktop?: SpacingScale
) => string;
export type GetFontFamily = (family: 'sans' | 'mono') => string;
export type GetFontSize = (size: TypographyScale) => string;
export type GetResponsiveClass = (
  base: string,
  tablet?: string,
  desktop?: string,
  mobile?: string
) => string;
export type GetRTLClass = (ltrClass: string, rtlClass: string) => string;
export type GetTransitionClass = (
  property?: string,
  duration?: AnimationDuration,
  easing?: AnimationEasing
) => string;
export type IsValidColor = (color: string) => boolean;
export type IsValidSpacing = (spacing: string) => boolean;
export type GetThemeAwareColor = (
  lightColor: string,
  darkColor: string,
  theme?: Theme
) => string;
export type GenerateThemeVariables = (theme: Theme) => ThemeVariables;