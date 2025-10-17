/**
 * Theme Toggle - مفتاح تبديل الثيم
 * Theme switching component with visual feedback
 * مكون تبديل الثيم مع ردود فعل بصرية
 */

"use client";

import React from 'react';
import { useTheme } from '@/core/theme';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ 
  className = '', 
  showLabels = false,
  size = 'md' 
}: ThemeToggleProps) {
  const { theme, setTheme, isDark, isLight, isSystem } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (isSystem) {
      return <ComputerDesktopIcon className={iconSizeClasses[size]} />;
    } else if (isDark) {
      return <MoonIcon className={iconSizeClasses[size]} />;
    } else {
      return <SunIcon className={iconSizeClasses[size]} />;
    }
  };

  const getLabel = () => {
    if (isSystem) {
      return 'نظام';
    } else if (isDark) {
      return 'داكن';
    } else {
      return 'فاتح';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-lg border border-border
        bg-panel text-text-primary
        hover:bg-hover active:bg-active
        focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
        transition-all duration-200 ease-in-out
        ${className}
      `}
      aria-label={`تبديل الثيم إلى ${getLabel()}`}
      title={`الثيم الحالي: ${getLabel()}`}
    >
      {getIcon()}
      {showLabels && (
        <span className="mr-2 text-sm font-medium">
          {getLabel()}
        </span>
      )}
    </button>
  );
}

// Theme indicator component
export function ThemeIndicator() {
  const { theme, isDark, isLight, isSystem } = useTheme();

  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      <div className="flex items-center space-x-1 space-x-reverse">
        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-yellow-500'}`} />
        <span className="text-sm text-text-secondary">
          {isSystem ? 'نظام' : isDark ? 'داكن' : 'فاتح'}
        </span>
      </div>
    </div>
  );
}

// Theme status component
export function ThemeStatus() {
  const { theme, resolvedTheme, isDark, isLight, isSystem, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" />
        <span className="text-sm text-text-muted">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 space-x-reverse text-sm">
      <div className="flex items-center space-x-1 space-x-reverse">
        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-yellow-500'}`} />
        <span className="text-text-secondary">
          {isSystem ? 'نظام' : theme}
        </span>
      </div>
      <span className="text-text-muted">→</span>
      <span className="text-text-primary font-medium">
        {resolvedTheme}
      </span>
    </div>
  );
}

export default ThemeToggle;
