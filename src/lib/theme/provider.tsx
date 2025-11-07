/**
 * Theme Provider - Design System Provider
 * موفر الثيم - موفر نظام التصميم
 *
 * Provides design tokens from extracted homepage design
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from './index';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Export theme for direct access
export { theme };
