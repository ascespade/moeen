import React from "react";
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Design System Types
interface DesignSystemConfig {
  theme: Theme;
  language: Language;
  direction: Direction;
  spacing: Spacing;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadows: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
}

interface DesignSystemState {
  // Current values
  theme: Theme;
  language: Language;
  direction: Direction;
  spacing: Spacing;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadows: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setDirection: (direction: Direction) => void;
  setSpacing: (spacing: Spacing) => void;
  setFontSize: (fontSize: 'small' | 'medium' | 'large') => void;
  setBorderRadius: (borderRadius: 'none' | 'small' | 'medium' | 'large') => void;
  setShadows: (shadows: 'none' | 'small' | 'medium' | 'large') => void;
  setAnimations: (animations: boolean) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
  setFocusVisible: (focusVisible: boolean) => void;
  reset: () => void;
}

type Theme = 'light' | 'dark' | 'auto';
type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';
type Spacing = 'compact' | 'comfortable' | 'spacious';

// Default configuration
const defaultConfig: DesignSystemConfig = {
  theme: 'light',
  language: 'en',
  direction: 'ltr',
  spacing: 'comfortable',
  fontSize: 'medium',
  borderRadius: 'medium',
  shadows: 'medium',
  animations: true,
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
};

// Create context
const DesignSystemContext = createContext<DesignSystemState | undefined>(undefined);

// Provider component
interface DesignSystemProviderProps {
  children: ReactNode;
  config?: Partial<DesignSystemConfig>;
}

export function DesignSystemProvider({ children, config = {} }: DesignSystemProviderProps) {
  const [state, setState] = useState<DesignSystemState>(() => {
    const mergedConfig = { ...defaultConfig, ...config };
    
    return {
      ...mergedConfig,
      setTheme: (theme: Theme) => setState(prev => ({ ...prev, theme })),
      setLanguage: (language: Language) => setState(prev => ({ ...prev, language })),
      setDirection: (direction: Direction) => setState(prev => ({ ...prev, direction })),
      setSpacing: (spacing: Spacing) => setState(prev => ({ ...prev, spacing })),
      setFontSize: (fontSize: 'small' | 'medium' | 'large') => setState(prev => ({ ...prev, fontSize })),
      setBorderRadius: (borderRadius: 'none' | 'small' | 'medium' | 'large') => setState(prev => ({ ...prev, borderRadius })),
      setShadows: (shadows: 'none' | 'small' | 'medium' | 'large') => setState(prev => ({ ...prev, shadows })),
      setAnimations: (animations: boolean) => setState(prev => ({ ...prev, animations })),
      setReducedMotion: (reducedMotion: boolean) => setState(prev => ({ ...prev, reducedMotion })),
      setHighContrast: (highContrast: boolean) => setState(prev => ({ ...prev, highContrast })),
      setFocusVisible: (focusVisible: boolean) => setState(prev => ({ ...prev, focusVisible })),
      reset: () => setState(prev => ({ ...prev, ...defaultConfig })),
    };
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    root.setAttribute('data-theme', state.theme);
    
    // Apply language and direction
    root.setAttribute('lang', state.language);
    root.setAttribute('dir', state.direction);
    
    // Apply spacing
    root.setAttribute('data-spacing', state.spacing);
    
    // Apply fontSize
    root.setAttribute('data-font-size', state.fontSize);
    
    // Apply borderRadius
    root.setAttribute('data-border-radius', state.borderRadius);
    
    // Apply shadows
    root.setAttribute('data-shadows', state.shadows);
    
    // Apply animations
    root.setAttribute('data-animations', state.animations.toString());
    
    // Apply reduced motion
    root.setAttribute('data-reduced-motion', state.reducedMotion.toString());
    
    // Apply high contrast
    root.setAttribute('data-high-contrast', state.highContrast.toString());
    
    // Apply focus visible
    root.setAttribute('data-focus-visible', state.focusVisible.toString());
    
  }, [state]);

  // Handle system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setState(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle system theme preference
  useEffect(() => {
    if (state.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      handleChange(mediaQuery);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.theme]);

  return (
    <DesignSystemContext.Provider value={state}>
      {children}
    </DesignSystemContext.Provider>
  );
}

// Hook to use design system
export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}

// Hook to use theme
export function useTheme() {
  const theme, setTheme = useDesignSystem();
  return { theme, setTheme };
}

// Hook to use language
export function useLanguage() {
  const language, setLanguage = useDesignSystem();
  return { language, setLanguage };
}

// Hook to use direction
export function useDirection() {
  const direction, setDirection = useDesignSystem();
  return { direction, setDirection };
}

// Hook to use spacing
export function useSpacing() {
  const spacing, setSpacing = useDesignSystem();
  return { spacing, setSpacing };
}

// Hook to use fontSize
export function useFontSize() {
  const fontSize, setFontSize = useDesignSystem();
  return { fontSize, setFontSize };
}

// Hook to use borderRadius
export function useBorderRadius() {
  const borderRadius, setBorderRadius = useDesignSystem();
  return { borderRadius, setBorderRadius };
}

// Hook to use shadows
export function useShadows() {
  const shadows, setShadows = useDesignSystem();
  return { shadows, setShadows };
}

// Hook to use animations
export function useAnimations() {
  const animations, setAnimations = useDesignSystem();
  return { animations, setAnimations };
}

// Hook to use reduced motion
export function useReducedMotion() {
  const reducedMotion, setReducedMotion = useDesignSystem();
  return { reducedMotion, setReducedMotion };
}

// Hook to use high contrast
export function useHighContrast() {
  const highContrast, setHighContrast = useDesignSystem();
  return { highContrast, setHighContrast };
}

// Hook to use focus visible
export function useFocusVisible() {
  const focusVisible, setFocusVisible = useDesignSystem();
  return { focusVisible, setFocusVisible };
}