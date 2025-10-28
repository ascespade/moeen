'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeSwitcherProps {
  variant?: 'button' | 'dropdown';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeSwitcher({
  variant = 'button',
  showLabel = false,
  size = 'md',
  className = '',
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');

    // Apply saved theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Toggle dark class on html
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
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

  if (variant === 'dropdown') {
    return (
      <div className={`hs-dropdown relative ${className}`}>
        <button
          className={`${sizeClasses} rounded-full border border-[var(--brand-border)] flex items-center justify-center text-foreground hover:bg-[var(--brand-surface)] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2`}
          onClick={toggleTheme}
          aria-label={
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
        >
          {theme === 'light' ? (
            <Sun className='h-5 w-5 text-[var(--brand-warning)]' />
          ) : (
            <Moon className='h-5 w-5 text-[var(--brand-accent)]' />
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${sizeClasses} rounded-full border border-[var(--brand-border)] flex items-center justify-center text-foreground hover:bg-[var(--brand-surface)] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 ${className}`}
      onClick={toggleTheme}
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      {theme === 'light' ? (
        <Sun className='h-5 w-5 text-[var(--brand-warning)]' />
      ) : (
        <Moon className='h-5 w-5 text-[var(--brand-accent)]' />
      )}
      {showLabel && (
        <span className='ml-2 text-sm font-medium'>
          {theme === 'light' ? 'فاتح' : 'داكن'}
        </span>
      )}
    </button>
  );
}

export default ThemeSwitcher;
