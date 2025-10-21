'use client';
import { useState } from 'react';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'button' | 'dropdown';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'button',
  showLabel = false,
  size = 'md',
  className = '',
}: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute(
      'dir',
      newLanguage === 'ar' ? 'rtl' : 'ltr'
    );
  };

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

  if (variant === 'dropdown') {
    return (
      <div className={`hs-dropdown relative ${className}`}>
        <button
          className={`${sizeClasses} rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
          onClick={toggleLanguage}
        >
          <Languages className='h-4 w-4' />
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${sizeClasses} rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      onClick={toggleLanguage}
    >
      <Languages className='h-4 w-4' />
      {showLabel && (
        <span className='ml-2 text-sm'>
          {language === 'ar' ? 'العربية' : 'English'}
        </span>
      )}
    </button>
  );
}
