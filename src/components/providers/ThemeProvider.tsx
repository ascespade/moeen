'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ThemeManager,
  type ThemeSettings,
  type ThemeMode,
} from '@/lib/theme-manager';

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (updates: Partial<ThemeSettings>) => void;
  setMode: (mode: ThemeMode) => void;
  toggleRTL: () => void;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<ThemeSettings>;
}

export function ThemeProvider({
  children,
  initialSettings,
}: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    // Always default to light mode on first load
    const defaultSettings = { mode: 'light' as ThemeMode, rtl: true };
    const saved = ThemeManager.getSettings();
    
    if (initialSettings) {
      return { ...saved, ...defaultSettings, ...initialSettings };
    }
    return { ...saved, ...defaultSettings };
  });

  useEffect(() => {
    // Apply initial settings if provided
    if (initialSettings) {
      ThemeManager.updateSettings(initialSettings);
      setSettings(prev => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = ThemeManager.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const updateSettings = (updates: Partial<ThemeSettings>) => {
    const newSettings = ThemeManager.updateSettings(updates);
    setSettings(newSettings);
  };

  const setMode = (mode: ThemeMode) => {
    ThemeManager.setMode(mode);
    setSettings(prev => ({ ...prev, mode }));
  };

  const toggleRTL = () => {
    ThemeManager.toggleRTL();
    setSettings(prev => ({ ...prev, rtl: !prev.rtl }));
  };

  const reset = () => {
    const defaultSettings = ThemeManager.reset();
    setSettings(defaultSettings);
  };

  const value: ThemeContextType = {
    settings,
    updateSettings,
    setMode,
    toggleRTL,
    reset,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}