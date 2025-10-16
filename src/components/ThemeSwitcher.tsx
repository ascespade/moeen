/**
 * Theme Switcher Component - مكون تبديل الثيم
 * Unified theme switcher using the unified design system
 * مبدل الثيم الموحد باستخدام نظام التصميم الموحد
 */

"use client";

import { useTheme } from '@/context/UnifiedThemeProvider';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeSwitcher({ 
  className = '', 
  showLabel = true,
  size = 'md'
}: ThemeSwitcherProps) {
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

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-4 py-3 text-lg';
      default:
        return 'px-3 py-2 text-base';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 rounded-lg 
        bg-[var(--panel)] border border-[var(--border)] 
        hover:bg-[var(--hover)] active:bg-[var(--active)]
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
        ${getSizeClasses()}
        ${className}
      `}
      title={`التبديل إلى ${getLabel()}`}
      aria-label={`تبديل الثيم إلى ${getLabel()}`}
    >
      <span className="text-lg leading-none">{getIcon()}</span>
      {showLabel && (
        <span className="font-medium text-[var(--text-primary)]">
          {getLabel()}
        </span>
      )}
    </button>
  );
}