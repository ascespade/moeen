/**
 * Design System Hooks - خطافات نظام التصميم
 * 
 * React hooks for design system
 * خطافات React لنظام التصميم
 */

import { useState, useEffect, useCallback } from 'react';
import { generateThemeVariables, getThemeAwareColor } from './utils';

// ========================================
// THEME HOOKS - خطافات الثيم
// ========================================

/**
 * Theme hook for managing theme state
 * خطاف الثيم لإدارة حالة الثيم
 */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setIsLoading(false);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    const themeVariables = generateThemeVariables(theme);
    
    Object.entries(themeVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, isLoading]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, []);

  return {
    theme,
    isLoading,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  };
}

// ========================================
// LANGUAGE HOOKS - خطافات اللغة
// ========================================

/**
 * Language hook for managing language state
 * خطاف اللغة لإدارة حالة اللغة
 */
export function useLanguage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      setLanguage(browserLang === 'ar' ? 'ar' : 'en');
    }
    setIsLoading(false);
  }, []);

  // Apply language to document
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', language);
  }, [language, isLoading]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const setArabic = useCallback(() => {
    setLanguage('ar');
  }, []);

  const setEnglish = useCallback(() => {
    setLanguage('en');
  }, []);

  return {
    language,
    isLoading,
    toggleLanguage,
    setArabic,
    setEnglish,
    isArabic: language === 'ar',
    isEnglish: language === 'en',
    isRTL: language === 'ar',
    isLTR: language === 'en',
  };
}

// ========================================
// RESPONSIVE HOOKS - خطافات الاستجابة
// ========================================

/**
 * Responsive hook for managing breakpoints
 * خطاف الاستجابة لإدارة نقاط التوقف
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setBreakpoint('2xl');
      } else if (width >= 1280) {
        setBreakpoint('xl');
      } else if (width >= 1024) {
        setBreakpoint('lg');
      } else if (width >= 768) {
        setBreakpoint('md');
      } else {
        setBreakpoint('sm');
      }
      setIsLoading(false);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isLoading,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    isLarge: breakpoint === 'xl' || breakpoint === '2xl',
    isExtraLarge: breakpoint === '2xl',
  };
}

// ========================================
// COLOR HOOKS - خطافات الألوان
// ========================================

/**
 * Color hook for managing color state
 * خطاف اللون لإدارة حالة اللون
 */
export function useColor() {
  const [primaryColor, setPrimaryColor] = useState('#f58220');
  const [secondaryColor, setSecondaryColor] = useState('#a18072');

  const updatePrimaryColor = useCallback((color: string) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--brand-primary', color);
  }, []);

  const updateSecondaryColor = useCallback((color: string) => {
    setSecondaryColor(color);
    document.documentElement.style.setProperty('--brand-secondary', color);
  }, []);

  const resetColors = useCallback(() => {
    setPrimaryColor('#f58220');
    setSecondaryColor('#a18072');
    document.documentElement.style.setProperty('--brand-primary', '#f58220');
    document.documentElement.style.setProperty('--brand-secondary', '#a18072');
  }, []);

  return {
    primaryColor,
    secondaryColor,
    updatePrimaryColor,
    updateSecondaryColor,
    resetColors,
  };
}

// ========================================
// ANIMATION HOOKS - خطافات الحركة
// ========================================

/**
 * Animation hook for managing animations
 * خطاف الحركة لإدارة الحركات
 */
export function useAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(300);

  const startAnimation = useCallback((duration: number = 300) => {
    setIsAnimating(true);
    setAnimationDuration(duration);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  }, []);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    isAnimating,
    animationDuration,
    startAnimation,
    stopAnimation,
  };
}

// ========================================
// ACCESSIBILITY HOOKS - خطافات إمكانية الوصول
// ========================================

/**
 * Accessibility hook for managing accessibility features
 * خطاف إمكانية الوصول لإدارة ميزات إمكانية الوصول
 */
export function useAccessibility() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    setHighContrast(prefersHighContrast);

    // Load saved preferences
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  const updateFontSize = useCallback((size: 'small' | 'normal' | 'large' | 'extra-large') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    
    // Apply font size to document
    const root = document.documentElement;
    root.setAttribute('data-font-size', size);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => {
      const newValue = !prev;
      document.documentElement.setAttribute('data-high-contrast', newValue.toString());
      return newValue;
    });
  }, []);

  return {
    reducedMotion,
    highContrast,
    fontSize,
    updateFontSize,
    toggleHighContrast,
  };
}

// ========================================
// COMBINED HOOKS - الخطافات المجمعة
// ========================================

/**
 * Combined design system hook
 * خطاف نظام التصميم المجمع
 */
export function useDesignSystem() {
  const theme = useTheme();
  const language = useLanguage();
  const responsive = useResponsive();
  const color = useColor();
  const animation = useAnimation();
  const accessibility = useAccessibility();

  return {
    theme,
    language,
    responsive,
    color,
    animation,
    accessibility,
  };
}