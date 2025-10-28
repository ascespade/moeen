/**
 * THEME CONTEXT - سياق الثيم
 * ==========================
 *
 * React context for managing theme state across the application
 * سياق React لإدارة حالة الثيم في التطبيق
 */

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import {
  Theme,
  ResolvedTheme,
  Language,
  Direction,
  CENTRALIZED_THEME,
  resolveTheme,
  applyThemeToDocument,
  applyLanguageToDocument,
  getStoredTheme,
  storeTheme,
  getStoredLanguage,
  storeLanguage,
  getSystemTheme,
} from '@/lib/centralized-theme';

// ========================================
// CONTEXT TYPES - أنواع السياق
// ========================================

interface ThemeContextValue {
  // Theme state - حالة الثيم
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (_theme: Theme) => void;

  // Language state - حالة اللغة
  language: Language;
  direction: Direction;
  setLanguage: (_language: Language) => void;

  // Loading state - حالة التحميل
  isLoading: boolean;

  // Theme utilities - أدوات الثيم
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

// ========================================
// CONTEXT CREATION - إنشاء السياق
// ========================================

const __ThemeContext = createContext<ThemeContextValue | null>(null);

// ========================================
// PROVIDER PROPS - خصائص المزود
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  enableSystemTheme?: boolean;
  enableLanguageSwitching?: boolean;
  enableThemeTransition?: boolean;
}

// ========================================
// THEME PROVIDER - مزود الثيم
// ========================================

export function __ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultLanguage = 'ar',
  enableSystemTheme = true,
  enableLanguageSwitching = true,
  enableThemeTransition = true,
}: ThemeProviderProps) {
  // State management - إدارة الحالة
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Resolved theme - الثيم المحلول
  const __resolvedTheme = resolveTheme(theme);
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  // Computed values - القيم المحسوبة
  const __isDark = resolvedTheme === 'dark';
  const __isLight = resolvedTheme === 'light';
  const __isSystem = theme === 'system';

  // ========================================
  // THEME FUNCTIONS - دوال الثيم
  // ========================================

  const __setTheme = (_newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);

    if (enableThemeTransition) {
      // Apply theme with transition
      applyThemeToDocument(resolveTheme(newTheme));
    }
  };

  const __setLanguage = (_newLanguage: Language) => {
    setLanguageState(newLanguage);
    storeLanguage(newLanguage);
    applyLanguageToDocument(newLanguage);
  };

  const __toggleTheme = () => {
    if (isDark) {
      setTheme('light');
    } else if (isLight) {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  // ========================================
  // EFFECTS - التأثيرات
  // ========================================

  // Initialize theme and language - تهيئة الثيم واللغة
  useEffect(() => {
    const __initializeTheme = async () => {
      try {
        // Get stored preferences - الحصول على التفضيلات المحفوظة
        const __storedTheme = getStoredTheme();
        const __storedLanguage = getStoredLanguage();

        // Set initial theme - تعيين الثيم الأولي
        if (storedTheme) {
          setThemeState(storedTheme);
        }

        // Set initial language - تعيين اللغة الأولية
        if (storedLanguage) {
          setLanguageState(storedLanguage);
        }

        // Apply initial theme - تطبيق الثيم الأولي
        const __initialTheme = storedTheme || defaultTheme;
        const __resolvedInitialTheme = resolveTheme(initialTheme);
        applyThemeToDocument(resolvedInitialTheme);

        // Apply initial language - تطبيق اللغة الأولية
        const __initialLanguage = storedLanguage || defaultLanguage;
        applyLanguageToDocument(initialLanguage);

        setIsInitialized(true);
      } catch (error) {
        // // console.error("Failed to initialize theme:", error);
        // Fallback to defaults - العودة للقيم الافتراضية
        applyThemeToDocument(resolveTheme(defaultTheme));
        applyLanguageToDocument(defaultLanguage);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, [defaultTheme, defaultLanguage]);

  // Apply theme changes - تطبيق تغييرات الثيم
  useEffect(() => {
    if (isInitialized) {
      applyThemeToDocument(resolvedTheme);
    }
  }, [resolvedTheme, isInitialized]);

  // Apply language changes - تطبيق تغييرات اللغة
  useEffect(() => {
    if (isInitialized) {
      applyLanguageToDocument(language);
    }
  }, [language, isInitialized]);

  // Listen for system theme changes - الاستماع لتغييرات ثيم النظام
  useEffect(() => {
    if (!enableSystemTheme || theme !== 'system') return;

    const __mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const __handleChange = () => {
      if (theme === 'system') {
        applyThemeToDocument(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystemTheme]);

  // ========================================
  // CONTEXT VALUE - قيمة السياق
  // ========================================

  const contextValue: ThemeContextValue = {
    // Theme state
    theme,
    resolvedTheme,
    setTheme,

    // Language state
    language,
    direction,
    setLanguage,

    // Loading state
    isLoading,

    // Theme utilities
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  };

  // ========================================
  // RENDER - العرض
  // ========================================

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================
// HOOKS - الخطافات
// ========================================

/**
 * Use theme context hook
 * خطاف استخدام سياق الثيم
 */
export function __useTheme() {
  const __context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

/**
 * Use theme hook (simplified)
 * خطاف استخدام الثيم (مبسط)
 */
export function __useThemeState() {
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  } = useTheme();

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  };
}

/**
 * Use language hook
 * خطاف استخدام اللغة
 */
export function __useLanguage() {
  const { language, direction, setLanguage } = useTheme();

  return {
    language,
    direction,
    setLanguage,
  };
}

// ========================================
// EXPORTS - التصدير
// ========================================

export default ThemeProvider;
