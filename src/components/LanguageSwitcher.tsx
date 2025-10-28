'use client';

import { Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [mounted, setMounted] = useState(false);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
    const currentLang = document.documentElement.getAttribute('lang') || 'ar';
    setLanguage(currentLang as 'ar' | 'en');
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    
    // Update HTML attributes
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute('dir', newLanguage === 'ar' ? 'rtl' : 'ltr');
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-full border border-[var(--brand-border)] ${className}`} />
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

  if (variant === 'dropdown') {
    return (
      <div className={`hs-dropdown relative ${className}`}>
        <button
          className={`${sizeClasses} rounded-full border border-[var(--brand-border)] flex items-center justify-center text-foreground hover:bg-[var(--brand-surface)] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2`}
          onClick={toggleLanguage}
          aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
          <Languages className='h-5 w-5 text-[var(--brand-info)]' />
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${sizeClasses} rounded-full border border-[var(--brand-border)] flex items-center justify-center text-foreground hover:bg-[var(--brand-surface)] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 ${className}`}
      onClick={toggleLanguage}
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Languages className='h-5 w-5 text-[var(--brand-info)]' />
      {showLabel && (
        <span className='ml-2 text-sm font-medium'>
          {language === 'ar' ? 'العربية' : 'English'}
        </span>
      )}
    </button>
  );
}
