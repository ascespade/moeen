'use client';

import { Languages } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { DynamicThemeManager } from '@/lib/dynamic-theme-manager';

interface LanguageSwitcherProps {
  variant?: 'button' | 'dropdown';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'button',
  showLabel = true,
  size = 'md',
  className = '',
}: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n(language);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
    const currentLang = document.documentElement.getAttribute('lang') || 'ar';
    setLanguage(currentLang as 'ar' | 'en');
  }, []);

  // Function to load user preferences from database
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      const preferences = DynamicThemeManager.loadConfig();
      setLanguage(preferences.language);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply language to document
  const applyLanguage = useCallback(() => {
    // Apply language changes
    DynamicThemeManager.updateConfig({ language });
  }, [language]);

  // Load user preferences from database on mount
  useEffect(() => {
    if (mounted) {
      loadUserPreferences();
    }
  }, [mounted]);

  // Apply language changes
  useEffect(() => {
    if (!isLoading && mounted) {
      applyLanguage();
    }
  }, [language, isLoading, applyLanguage, mounted]);

  const toggleLanguage = async () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);

    // Update HTML attributes
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute(
      'dir',
      newLanguage === 'ar' ? 'rtl' : 'ltr'
    );

    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }

    try {
      // Save to database
      DynamicThemeManager.updateConfig({
        language: newLanguage,
      });
      // Reload page to apply translations
      window.location.reload();
    } catch (error) {}
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-full border border-[var(--brand-border)] ${className}`}
      />
    );
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-9 w-9';
    }
  };

  const sizeClasses = getSizeClasses();

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (variant === 'dropdown') {
    return (
      <div className={`hs-dropdown relative ${className}`}>
        <select
          className={`inline-flex items-center gap-2 rounded-md border border-gray-200 text-gray-700 hover:bg-surface focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 ${sizeClasses} ${textSizes[size]}`}
          value={language}
          onChange={e => {
            setLanguage(e.target.value as 'ar' | 'en');
            // Save language preference and reload
            window.location.reload();
          }}
          disabled={isLoading}
        >
          <option value='ar'>العربية</option>
          <option value='en'>English</option>
        </select>
      </div>
    );
  }

  return (
    <button
      className={`${sizeClasses} rounded-full border border-[var(--brand-border)] flex items-center justify-center text-foreground hover:bg-[var(--brand-surface)] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 ${className}`}
      onClick={toggleLanguage}
      disabled={isLoading}
      aria-label={
        language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'
      }
    >
      {isLoading ? (
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 ${iconSizes[size]}`}
        ></div>
      ) : (
        <Languages className={`${iconSizes[size]} text-[var(--brand-info)]`} />
      )}
      {showLabel && (
        <span className={`ml-2 ${textSizes[size]} font-medium hidden sm:inline`}>
          {language === 'ar' ? 'العربية' : 'English'}
        </span>
      )}
    </button>
  );
}
