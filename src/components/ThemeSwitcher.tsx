/**
 * Theme Switcher Component - مكون تبديل الثيم
 * Accessible theme toggle with translations and RTL support
 */

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useT } from '@/hooks/useT';

interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  size = 'md',
  showLabel = true,
}) => {
  const { theme, resolvedTheme, toggleTheme, isDark, isLight, isSystem } = useTheme();
  const { t } = useT();

  const getIcon = () => {
    if (isSystem) {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }
    
    if (isDark) {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }
    
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  };

  const getLabel = () => {
    if (isSystem) return t('theme.system');
    if (isDark) return t('theme.dark');
    return t('theme.light');
  };

  const getAriaLabel = () => {
    if (isSystem) return t('theme.system');
    if (isDark) return t('theme.dark');
    return t('theme.light');
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center gap-2
        bg-brand-surface hover:bg-brand-primary/10
        border border-brand-border
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      {getIcon()}
      {showLabel && (
        <span className="font-medium">
          {getLabel()}
        </span>
      )}
    </button>
  );
};

export default ThemeSwitcher;
