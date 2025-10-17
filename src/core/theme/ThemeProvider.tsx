/**
 * Theme Provider - موفر الثيم المركزي
 * Centralized theme provider with conflict prevention
 * موفر الثيم المركزي مع منع التعارضات
 */

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// ========================================
// TYPES - الأنواع
// ========================================

interface ThemeContextType {
  // Theme state
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Theme actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  // Design tokens
  getDesignTokens: () => any;
}

// ========================================
// CONTEXT - السياق
// ========================================

const ThemeContext = createContext<ThemeContextType | null>(null);

// ========================================
// PROVIDER - الموفر
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get theme manager instance
  const themeManager = ThemeManager.getInstance();

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set mounted state
    setMounted(true);
    
    // Get initial theme from manager
    const currentTheme = themeManager.getCurrentTheme();
    const currentResolved = themeManager.getResolvedTheme();
    
    setThemeState(currentTheme);
    setResolvedTheme(currentResolved);
    setIsInitialized(themeManager.isInitialized());
    setIsLoading(false);
    
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe((newResolvedTheme) => {
      setResolvedTheme(newResolvedTheme);
    });
    
    return unsubscribe;
  }, [themeManager]);

  // Theme management functions
  const setTheme = useCallback((newTheme: ThemeMode) => {
    themeManager.setTheme(newTheme);
    setThemeState(newTheme);
  }, [themeManager]);

  const toggleTheme = useCallback(() => {
    themeManager.toggleTheme();
    setThemeState(themeManager.getCurrentTheme());
  }, [themeManager]);

  const getDesignTokens = useCallback(() => {
    return themeManager.getDesignTokens();
  }, [themeManager]);

  // Context value
  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
    isLoading,
    isInitialized,
    setTheme,
    toggleTheme,
    getDesignTokens,
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: 'system',
        resolvedTheme: 'light',
        isDark: false,
        isLight: true,
        isSystem: true,
        isLoading: true,
        isInitialized: false,
        setTheme: () => {},
        toggleTheme: () => {},
        getDesignTokens: () => ({}),
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================
// HOOK - الخطاف
// ========================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// ========================================
// HOOKS - خطافات إضافية
// ========================================

/**
 * Hook for theme-aware styling
 * خطاف للتنسيق المراعي للثيم
 */
export function useThemeAware() {
  const { resolvedTheme, isDark, isLight } = useTheme();
  
  return {
    theme: resolvedTheme,
    isDark,
    isLight,
    // Utility functions
    getThemeClass: (lightClass: string, darkClass: string) => 
      isDark ? darkClass : lightClass,
    getThemeValue: <T,>(lightValue: T, darkValue: T) => 
      isDark ? darkValue : lightValue,
  };
}

/**
 * Hook for design tokens
 * خطاف لرموز التصميم
 */
export function useDesignTokens() {
  const { getDesignTokens } = useTheme();
  return getDesignTokens();
}

/**
 * Hook for theme colors
 * خطاف لألوان الثيم
 */
export function useThemeColors() {
  const { getDesignTokens } = useTheme();
  const tokens = getDesignTokens();
  return tokens.colors;
}

// ========================================
// UTILITIES - أدوات مساعدة
// ========================================

/**
 * Get theme-aware CSS class
 * الحصول على كلاس CSS مراعي للثيم
 */
export function getThemeClass(lightClass: string, darkClass: string, theme: ResolvedTheme): string {
  return theme === 'dark' ? darkClass : lightClass;
}

/**
 * Get theme-aware value
 * الحصول على قيمة مراعية للثيم
 */
export function getThemeValue<T>(lightValue: T, darkValue: T, theme: ResolvedTheme): T {
  return theme === 'dark' ? darkValue : lightValue;
}

/**
 * Create theme-aware styles object
 * إنشاء كائن أنماط مراعي للثيم
 */
export function createThemeAwareStyles(
  lightStyles: Record<string, any>,
  darkStyles: Record<string, any>,
  theme: ResolvedTheme
): Record<string, any> {
  return theme === 'dark' ? darkStyles : lightStyles;
}

export default ThemeProvider;
