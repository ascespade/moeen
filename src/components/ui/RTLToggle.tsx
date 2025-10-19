'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/cn';

interface RTLToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function RTLToggle({ className, showLabel = true }: RTLToggleProps) {
  const { settings, toggleRTL } = useTheme();

  return (
    <button
      onClick={toggleRTL}
      className={cn(
        'ds-button ds-button-ghost ds-button-sm',
        'flex items-center gap-2',
        className
      )}
      title={`Switch to ${settings.rtl ? 'LTR' : 'RTL'} mode`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={settings.rtl 
            ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" 
            : "M21 4h-13M21 8h-9m9 4h-6m-4 0l-4-4m0 0l-4 4m4-4v12"
          } 
        />
      </svg>
      {showLabel && <span>{settings.rtl ? 'RTL' : 'LTR'}</span>}
    </button>
  );
}
