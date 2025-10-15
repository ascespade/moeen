/**
 * Theme Context - سياق الثيم
 * Provides theme management with RTL compatibility and persistence
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // Resolve theme based on system preference
  useEffect(() => {
    const resolveTheme = (): ResolvedTheme => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme as ResolvedTheme;
    };

    const updateResolvedTheme = () => {
      setResolvedTheme(resolveTheme());
    };

    // Initial resolution
    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateResolvedTheme);
    };
  }, [theme]);

  // Apply theme to document and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme attribute for CSS selectors
    root.setAttribute('data-theme', resolvedTheme);
    
    // Apply CSS variables based on theme
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      
      // Apply dark mode CSS variables
      Object.entries({
        '--background': '#0d1117',
        '--foreground': '#e5eef7',
        '--brand-primary': '#E46C0A',
        '--brand-primary-hover': '#D45F08',
        '--brand-secondary': '#6B4E16',
        '--brand-neutral-beige': '#2A2520',
        '--brand-accent': '#007bff',
        '--brand-accent-deep': '#C93C00',
        '--brand-success': '#00b39b',
        '--brand-warning': '#fbbf24',
        '--brand-error': '#f87171',
        '--brand-border': '#1f2937',
        '--brand-surface': '#0d1117',
        '--panel': '#111827',
        '--focus-ring': '#007bff',
      }).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      
      // Apply light mode CSS variables
      Object.entries({
        '--background': '#ffffff',
        '--foreground': '#0f172a',
        '--brand-primary': '#E46C0A',
        '--brand-primary-hover': '#D45F08',
        '--brand-secondary': '#6B4E16',
        '--brand-neutral-beige': '#F2E7DC',
        '--brand-accent': '#007bff',
        '--brand-accent-deep': '#C93C00',
        '--brand-success': '#009688',
        '--brand-warning': '#f59e0b',
        '--brand-error': '#ef4444',
        '--brand-border': '#e5e7eb',
        '--brand-surface': '#f9fafb',
        '--panel': '#ffffff',
        '--focus-ring': '#007bff',
      }).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }

    // Apply RTL support
    const direction = document.documentElement.getAttribute('dir') || 'rtl';
    root.setAttribute('dir', direction);
    
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  }, [theme, setTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  };

  // Prevent hydration mismatch by not rendering until mounted
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
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
