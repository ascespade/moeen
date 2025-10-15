/**
 * Design System Hooks
 * خطافات نظام التصميم
 * 
 * React hooks for design system functionality
 * خطافات React لوظائف نظام التصميم
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { applyTheme, generateThemeVariables } from './utils';

// ========================================
// THEME HOOKS - خطافات الثيم
// ========================================

/**
 * Hook for managing theme state
 * خطاف لإدارة حالة الثيم
 */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsLoading(false);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (!isLoading) {
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    }
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

/**
 * Hook for theme-aware color values
 * خطاف لقيم الألوان المتوافقة مع الثيم
 */
export function useThemeColors() {
  const { theme } = useTheme();
  
  return useMemo(() => {
    return generateThemeVariables(theme);
  }, [theme]);
}

// ========================================
// LANGUAGE HOOKS - خطافات اللغة
// ========================================

/**
 * Hook for managing language state
 * خطاف لإدارة حالة اللغة
 */
export function useLanguage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
    const initialLanguage = savedLanguage || 'ar';
    
    setLanguage(initialLanguage);
    setIsLoading(false);
  }, []);

  // Apply language when it changes
  useEffect(() => {
    if (!isLoading) {
      const root = document.documentElement;
      root.setAttribute('lang', language);
      root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
      localStorage.setItem('language', language);
    }
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
    direction: language === 'ar' ? 'rtl' : 'ltr',
  };
}

// ========================================
// RTL HOOKS - خطافات RTL
// ========================================

/**
 * Hook for RTL-aware utilities
 * خطاف للأدوات المتوافقة مع RTL
 */
export function useRTL() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const getRTLValue = useCallback(<T>(ltrValue: T, rtlValue: T): T => {
    return isRTL ? rtlValue : ltrValue;
  }, [isRTL]);

  const getRTLClass = useCallback((ltrClass: string, rtlClass: string): string => {
    return isRTL ? rtlClass : ltrClass;
  }, [isRTL]);

  const getRTLStyle = useCallback((ltrStyle: React.CSSProperties, rtlStyle: React.CSSProperties): React.CSSProperties => {
    return isRTL ? rtlStyle : ltrStyle;
  }, [isRTL]);

  return {
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    getRTLValue,
    getRTLClass,
    getRTLStyle,
  };
}

// ========================================
// BREAKPOINT HOOKS - خطافات نقاط التوقف
// ========================================

/**
 * Hook for responsive breakpoints
 * خطاف لنقاط التوقف المتجاوبة
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else setBreakpoint('sm');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const isMobile = breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
  const isLargeScreen = breakpoint === 'xl' || breakpoint === '2xl';

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
  };
}

// ========================================
// ANIMATION HOOKS - خطافات الحركة
// ========================================

/**
 * Hook for animation state
 * خطاف لحالة الحركة
 */
export function useAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
    toggleAnimation,
  };
}

/**
 * Hook for staggered animations
 * خطاف للحركات المتدرجة
 */
export function useStaggeredAnimation(items: any[], delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems(items.map((_, index) => index));
    }, delay);

    return () => clearTimeout(timer);
  }, [items, delay]);

  const getItemDelay = useCallback((index: number) => {
    return index * delay;
  }, [delay]);

  return {
    visibleItems,
    getItemDelay,
  };
}

// ========================================
// FOCUS HOOKS - خطافات التركيز
// ========================================

/**
 * Hook for focus management
 * خطاف لإدارة التركيز
 */
export function useFocus() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
      setFocusedElement(element);
    }
  }, []);

  const blurElement = useCallback(() => {
    if (focusedElement) {
      focusedElement.blur();
      setFocusedElement(null);
    }
  }, [focusedElement]);

  const focusNext = useCallback(() => {
    if (focusedElement) {
      const nextElement = focusedElement.nextElementSibling as HTMLElement;
      if (nextElement) {
        focusElement(nextElement);
      }
    }
  }, [focusedElement, focusElement]);

  const focusPrevious = useCallback(() => {
    if (focusedElement) {
      const previousElement = focusedElement.previousElementSibling as HTMLElement;
      if (previousElement) {
        focusElement(previousElement);
      }
    }
  }, [focusedElement, focusElement]);

  return {
    focusedElement,
    focusElement,
    blurElement,
    focusNext,
    focusPrevious,
  };
}

// ========================================
// VALIDATION HOOKS - خطافات التحقق
// ========================================

/**
 * Hook for form validation
 * خطاف للتحقق من النماذج
 */
export function useValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T, value: any) => {
    const rule = validationRules[field];
    if (rule) {
      const error = rule(value);
      setErrors(prev => ({
        ...prev,
        [field]: error || undefined,
      }));
      return error;
    }
    return null;
  }, [validationRules]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field as keyof T, values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// ========================================
// STORAGE HOOKS - خطافات التخزين
// ========================================

/**
 * Hook for localStorage with design system defaults
 * خطاف لـ localStorage مع القيم الافتراضية لنظام التصميم
 */
export function useDesignSystemStorage<T>(
  key: string,
  defaultValue: T,
  serializer?: {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
  }
) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = serializer ? serializer.deserialize(stored) : JSON.parse(stored);
        setValue(parsed);
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key, serializer]);

  const updateValue = useCallback((newValue: T) => {
    try {
      const serialized = serializer ? serializer.serialize(newValue) : JSON.stringify(newValue);
      localStorage.setItem(key, serialized);
      setValue(newValue);
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, serializer]);

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  return {
    value,
    updateValue,
    removeValue,
    isLoading,
  };
}
