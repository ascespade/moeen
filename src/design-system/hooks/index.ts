'use client';

import { useState, useEffect } from 'react';

// Theme hook
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme to document
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  return {
    theme,
    toggleTheme,
    isLoading,
  };
}

// Language hook
export function useLanguage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('rtl');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get language from localStorage or default to Arabic
    const savedLanguage = localStorage.getItem('language') as
      | 'ar'
      | 'en'
      | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setDirection(savedLanguage === 'ar' ? 'rtl' : 'ltr');
    }
    setIsLoading(false);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    const newDirection = newLanguage === 'ar' ? 'rtl' : 'ltr';

    setLanguage(newLanguage);
    setDirection(newDirection);
    localStorage.setItem('language', newLanguage);

    // Apply language to document
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', newLanguage);
      document.documentElement.setAttribute('dir', newDirection);
    }
  };

  return {
    language,
    direction,
    toggleLanguage,
    isLoading,
  };
}

// RTL hook
export function useRTL() {
  const { direction } = useLanguage();
  return direction === 'rtl';
}

// Breakpoint hook
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}
