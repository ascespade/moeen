'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/cn';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className,
  showLabel = true,
}: ThemeToggleProps) {
  const { settings, setMode } = useTheme();

  const handleToggle = () => {
    if (settings.mode === 'light') {
      setMode('dark');
    } else if (settings.mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  const getIcon = () => {
    switch (settings.mode) {
      case 'light':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        );
      case 'dark':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          </svg>
        );
      case 'system':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (settings.mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'Auto';
      default:
        return 'Theme';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'ds-button ds-button-ghost ds-button-sm',
        'flex items-center gap-2',
        className
      )}
      title={`Switch to ${settings.mode === 'light' ? 'dark' : settings.mode === 'dark' ? 'system' : 'light'} theme`}
    >
      {getIcon()}
      {showLabel && <span>{getLabel()}</span>}
    </button>
  );
}
