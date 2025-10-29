/**
 * ThemeToggle Component - Toggle between light and dark themes
 */

'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/components/providers/ThemeProvider';

export interface ThemeToggleProps {
  variant?: 'default' | 'compact';
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = 'default',
  showLabel = false,
  className = '',
}: ThemeToggleProps) {
  const { settings, setMode } = useTheme();

  const toggleTheme = () => {
    setMode(settings.mode === 'light' ? 'dark' : 'light');
  };

  const isDark = settings.mode === 'dark';

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className={`flex items-center gap-2 ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {showLabel && (
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      )}
    </Button>
  );
}

export default ThemeToggle;
