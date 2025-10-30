'use client';

import { useThemeMonitor } from '@/hooks/useThemeMonitor';
import {
    ThemeManager,
    type ThemeMode,
    type ThemeSettings,
} from '@/lib/theme-manager';
import { getCurrentThemeColors, loadThemeSettings, saveThemeSettings } from '@/lib/theme-settings';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (updates: Partial<ThemeSettings>) => void;
  setMode: (mode: ThemeMode) => void;
  toggleRTL: () => void;
  reset: () => void;
  // Advanced theme features
  advancedSettings: ReturnType<typeof loadThemeSettings>;
  updateAdvancedSettings: (updates: Partial<ReturnType<typeof loadThemeSettings>>) => void;
  applyThemeColors: () => void;
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
    
    // Force light mode as default - override any saved dark mode preference
    const finalSettings = { ...saved, ...defaultSettings };
    
    if (initialSettings) {
      return { ...finalSettings, ...initialSettings };
    }
    return finalSettings;
  });

  const [advancedSettings, setAdvancedSettings] = useState(() => loadThemeSettings());
  const resolvedMode = settings.mode === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : settings.mode;

  // Enable theme monitoring with real-time updates
  useThemeMonitor({
    enabled: advancedSettings.themeManagement.colorIntelligence.realTimeUpdate,
    mode: resolvedMode as 'light' | 'dark',
    // Silence logs to reduce console noise; enable only if explicitly needed
    onAdjustment: undefined,
    onReport: undefined,
  });

  // Apply advanced theme colors to CSS variables
  const applyThemeColors = useCallback(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const currentColors = getCurrentThemeColors(resolvedMode as 'light' | 'dark', advancedSettings);

    // Apply theme colors to CSS variables
    root.style.setProperty('--brand-primary', currentColors.primaryColor);
    root.style.setProperty('--brand-secondary', currentColors.secondaryColor);
    root.style.setProperty('--background', currentColors.backgroundColor);
    root.style.setProperty('--foreground', currentColors.textColor);
    
    // Apply accent colors
    currentColors.accentColors.forEach((color, index) => {
      root.style.setProperty(`--accent-${index + 1}`, color);
    });

    // Apply theme mode class
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedMode, advancedSettings]);

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = ThemeManager.subscribe((newSettings) => {
      setSettings(newSettings);
      // Re-apply theme colors when settings change
      applyThemeColors();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Initial theme color application and re-apply when mode or settings change
    applyThemeColors();
  }, [advancedSettings, resolvedMode]);

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

  const updateAdvancedSettings = (updates: Partial<ReturnType<typeof loadThemeSettings>>) => {
    const updated = { ...advancedSettings, ...updates };
    setAdvancedSettings(updated);
    saveThemeSettings(updated);
    applyThemeColors();
  };

  const value: ThemeContextType = {
    settings,
    updateSettings,
    setMode,
    toggleRTL,
    reset,
    advancedSettings,
    updateAdvancedSettings,
    applyThemeColors,
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