/**
 * THEME SWITCHER - مبدل الثيم
 * ===========================
 * 
 * Component for switching between light, dark, and system themes
 * مكون للتبديل بين الثيمات الفاتحة والمظلمة ونظام
 */

"use client";

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { COMPONENT_CLASSES } from '@/lib/centralized-theme';

// ========================================
// COMPONENT PROPS - خصائص المكون
// ========================================

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'icon-only';
  showSystemOption?: boolean;
}

// ========================================
// THEME SWITCHER COMPONENT - مكون مبدل الثيم
// ========================================

export function ThemeSwitcher({
  className = '',
  showLabel = true,
  size = 'md',
  variant = 'default',
  showSystemOption = true,
}: ThemeSwitcherProps) {
  const { theme, setTheme, isDark, isLight, isSystem } = useTheme();

  // ========================================
  // THEME OPTIONS - خيارات الثيم
  // ========================================

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'فاتح',
      icon: Sun,
      description: 'الثيم الفاتح',
    },
    {
      value: 'dark' as const,
      label: 'مظلم',
      icon: Moon,
      description: 'الثيم المظلم',
    },
    ...(showSystemOption ? [{
      value: 'system' as const,
      label: 'نظام',
      icon: Monitor,
      description: 'يتبع إعدادات النظام',
    }] : []),
  ];

  // ========================================
  // SIZE CONFIGURATIONS - تكوينات الحجم
  // ========================================

  const sizeConfig = {
    sm: {
      button: 'p-2 text-sm',
      icon: 'w-4 h-4',
      label: 'text-xs',
    },
    md: {
      button: 'p-3 text-base',
      icon: 'w-5 h-5',
      label: 'text-sm',
    },
    lg: {
      button: 'p-4 text-lg',
      icon: 'w-6 h-6',
      label: 'text-base',
    },
  };

  // ========================================
  // VARIANT CONFIGURATIONS - تكوينات المتغير
  // ========================================

  const variantConfig = {
    default: 'bg-panel border border-brand-border hover:bg-brand-surface',
    minimal: 'bg-transparent hover:bg-brand-surface',
    'icon-only': 'bg-transparent hover:bg-brand-surface',
  };

  // ========================================
  // HANDLERS - المعالجات
  // ========================================

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  // ========================================
  // RENDER FUNCTIONS - دوال العرض
  // ========================================

  const renderIconOnly = () => {
    const currentOption = themeOptions.find(option => option.value === theme);
    const Icon = currentOption?.icon || Sun;

    return (
      <button
        onClick={() => {
          const currentIndex = themeOptions.findIndex(option => option.value === theme);
          const nextIndex = (currentIndex + 1) % themeOptions.length;
          handleThemeChange(themeOptions[nextIndex].value);
        }}
        className={`
          ${COMPONENT_CLASSES.btn}
          ${variantConfig[variant]}
          ${sizeConfig[size].button}
          ${className}
        `}
        title={currentOption?.description}
        aria-label={`تغيير الثيم إلى ${currentOption?.label}`}
      >
        <Icon className={sizeConfig[size].icon} />
      </button>
    );
  };

  const renderDropdown = () => {
    return (
      <div className="relative group">
        <button
          className={`
            ${COMPONENT_CLASSES.btn}
            ${variantConfig[variant]}
            ${sizeConfig[size].button}
            ${className}
            flex items-center gap-2
          `}
          aria-label="اختيار الثيم"
        >
          {themeOptions.find(option => option.value === theme)?.icon && (
            React.createElement(
              themeOptions.find(option => option.value === theme)!.icon,
              { className: sizeConfig[size].icon }
            )
          )}
          {showLabel && variant !== 'icon-only' && (
            <span className={sizeConfig[size].label}>
              {themeOptions.find(option => option.value === theme)?.label}
            </span>
          )}
        </button>

        {/* Dropdown Menu - قائمة منسدلة */}
        <div className="absolute top-full left-0 mt-1 bg-panel border border-brand-border rounded-md shadow-lg z-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`
                  w-full px-3 py-2 text-left text-sm hover:bg-brand-surface transition-colors duration-150 flex items-center gap-2
                  ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-foreground'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderButtonGroup = () => {
    return (
      <div className="flex items-center gap-1 bg-brand-surface rounded-md p-1">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`
                ${COMPONENT_CLASSES.btn}
                ${sizeConfig[size].button}
                ${isActive 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'bg-transparent text-foreground hover:bg-brand-surface'
                }
                rounded-md transition-all duration-150
              `}
              title={option.description}
              aria-label={option.description}
            >
              <Icon className={sizeConfig[size].icon} />
              {showLabel && variant !== 'icon-only' && (
                <span className={sizeConfig[size].label}>
                  {option.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // ========================================
  // RENDER - العرض
  // ========================================

  if (variant === 'icon-only') {
    return renderIconOnly();
  }

  if (variant === 'minimal') {
    return renderDropdown();
  }

  return renderButtonGroup();
}

// ========================================
// THEME TOGGLE COMPONENT - مكون تبديل الثيم
// ========================================

export function ThemeToggle({
  className = '',
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { toggleTheme, isDark } = useTheme();

  const sizeConfig = {
    sm: 'w-8 h-4 text-xs',
    md: 'w-12 h-6 text-sm',
    lg: 'w-16 h-8 text-base',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${COMPONENT_CLASSES.btn}
        ${sizeConfig[size]}
        ${isDark ? 'bg-brand-primary' : 'bg-brand-border'}
        relative rounded-full transition-all duration-300
        ${className}
      `}
      aria-label={isDark ? 'تبديل إلى الثيم الفاتح' : 'تبديل إلى الثيم المظلم'}
    >
      <div
        className={`
          absolute top-0.5 left-0.5 w-1/2 h-[calc(100%-4px)] bg-white rounded-full
          transition-transform duration-300 flex items-center justify-center
          ${isDark ? 'translate-x-full' : 'translate-x-0'}
        `}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-brand-primary" />
        ) : (
          <Sun className="w-3 h-3 text-brand-primary" />
        )}
      </div>
    </button>
  );
}

// ========================================
// EXPORTS - التصدير
// ========================================

export default ThemeSwitcher;