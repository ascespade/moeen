/**
 * Unified Theme Provider - موفر الثيم الموحد
 * Single theme provider that handles all theming logic
 * موفر ثيم واحد يتعامل مع جميع منطق الثيمات
 */

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeMode as Theme, ResolvedTheme } from '@/core/theme';

// Helper functions
const applyThemeToDocument = (theme: ResolvedTheme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

const detectSystemTheme = (): ResolvedTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// ========================================
// TYPES - الأنواع
// ========================================

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  isLoading: boolean;
}

// ========================================
// CONTEXT - السياق
// ========================================

const ThemeContext = createContext<ThemeContextType | null>(null);

// ========================================
// PROVIDER - الموفر
// ========================================

interface UnifiedThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function UnifiedThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: UnifiedThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      setMounted(true);
    }
  }, []);

  // Resolve theme based on current setting
  useEffect(() => {
    if (!mounted) return;

    let resolved: ResolvedTheme;
    
    if (theme === 'system') {
      resolved = detectSystemTheme();
    } else {
      resolved = theme;
    }

    setResolvedTheme(resolved);
    applyThemeToDocument(resolved);
    setIsLoading(false);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newResolved = detectSystemTheme();
      setResolvedTheme(newResolved);
      applyThemeToDocument(newResolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Theme management functions
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
    isLoading,
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: 'system',
        resolvedTheme: 'light',
        setTheme: () => {},
        toggleTheme: () => {},
        isDark: false,
        isLight: true,
        isSystem: true,
        isLoading: true,
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
    throw new Error('useTheme must be used within a UnifiedThemeProvider');
  }
  return context;
}

// ========================================
// THEME SWITCHER COMPONENT - مكون تبديل الثيم
// ========================================

export function ThemeSwitcher() {
  const { theme, toggleTheme, isDark, isLight, isSystem } = useTheme();

  const getIcon = () => {
    if (isSystem) return '🌓';
    if (isDark) return '🌙';
    return '☀️';
  };

  const getLabel = () => {
    if (isSystem) return 'نظام';
    if (isDark) return 'مظلم';
    return 'مضيء';
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--panel)] border border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
      title={`التبديل إلى ${getLabel()}`}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {getLabel()}
      </span>
    </button>
  );
}

