'use client';

import {
    applyPreferences,
    loadPreferences,
    savePreferences,
    type Language,
    type ThemeMode,
    type UserPreferences,
} from '@/lib/user-preferences';
import { useEffect, useState } from 'react';

/**
 * Centralized hook for managing user preferences
 * Works for both authenticated and unauthenticated users
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'ar',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences()
      .then(prefs => {
        setPreferences(prefs);
        applyPreferences(prefs);
      })
      .catch(() => {
        // Use default preferences on error
        const defaults = { theme: 'light' as ThemeMode, language: 'ar' as Language };
        setPreferences(defaults);
        applyPreferences(defaults);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Update preference
  const updatePreference = async (
    updates: Partial<UserPreferences>
  ): Promise<void> => {
    // Update state immediately
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    // Apply to DOM immediately
    applyPreferences(newPreferences);
    
    // Save to storage (async, don't wait)
    savePreferences(updates).catch(() => {
      // Silently fail - preferences already applied to DOM
    });
  };

  // Set theme
  const setTheme = async (theme: ThemeMode): Promise<void> => {
    await updatePreference({ theme });
  };

  // Toggle theme
  const toggleTheme = async (): Promise<void> => {
    const currentTheme = preferences.theme;
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update state immediately for responsive UI
    const updatedPreferences = { ...preferences, theme: newTheme };
    setPreferences(updatedPreferences);
    applyPreferences(updatedPreferences);
    
    // Save to storage
    await savePreferences({ theme: newTheme });
  };

  // Set language
  const setLanguage = async (language: Language): Promise<void> => {
    await updatePreference({ language });
  };

  // Toggle language
  const toggleLanguage = async (): Promise<void> => {
    const newLanguage: Language = preferences.language === 'ar' ? 'en' : 'ar';
    await setLanguage(newLanguage);
    // Reload page to apply language changes
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return {
    preferences,
    isLoading,
    theme: preferences.theme,
    language: preferences.language,
    setTheme,
    toggleTheme,
    setLanguage,
    toggleLanguage,
    updatePreference,
  };
}


