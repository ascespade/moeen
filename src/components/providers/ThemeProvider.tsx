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
  const [themeManager] = useState(() => {
    if (typeof window !== 'undefined') {
      return new ThemeManager(initialSettings);
    }
    return null;
  });
  const [settings, setSettings] = useState<ThemeSettings>(
    themeManager?.getSettings() || {
      mode: 'light',
      customColors: {},
      typographyScale: 'medium',
      rtl: false
    } as ThemeSettings
  );

  useEffect(() => {
    if (themeManager) {
      const unsubscribe = themeManager.subscribe(setSettings);
      return unsubscribe;
    }
    return undefined;
  }, [themeManager]);

  const contextValue: ThemeContextType = {
    settings,
    updateSettings:
      themeManager?.updateSettings.bind(themeManager) || (() => {}),
    setMode: themeManager?.setMode.bind(themeManager) || (() => {}),
    toggleRTL: themeManager?.toggleRTL.bind(themeManager) || (() => {}),
    reset: themeManager?.reset.bind(themeManager) || (() => {}),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
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

export default ThemeProvider;
