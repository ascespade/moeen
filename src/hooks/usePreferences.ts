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
  // Initialize from localStorage immediately (synchronous)
  const getInitialPreferences = (): UserPreferences => {
    if (typeof window === 'undefined') {
      return { theme: 'light', language: 'ar' };
    }
    try {
      const stored = localStorage.getItem('moeen_user_preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          theme: (parsed.theme || 'light') as ThemeMode,
          language: (parsed.language || 'ar') as Language,
        };
      }
    } catch (error) {
      // Ignore errors
    }
    return { theme: 'light', language: 'ar' };
  };

  const [preferences, setPreferences] = useState<UserPreferences>(
    getInitialPreferences()
  );
  const [isLoading, _setIsLoading] = useState(false); // Start as false - we already have localStorage

  // Apply initial preferences immediately
  useEffect(() => {
    applyPreferences(preferences);
    // Then try to load from API (non-blocking)
    loadPreferences()
      .then(prefs => {
        if (
          prefs.theme !== preferences.theme ||
          prefs.language !== preferences.language
        ) {
          setPreferences(prefs);
          applyPreferences(prefs);
        }
      })
      .catch(() => {
        // Silently fail - we already have localStorage preferences
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
