'use client';

/**
 * Centralized User Preferences Manager
 * Handles theme and language preferences with fallback to localStorage
 * when user is not authenticated
 */

export type ThemeMode = 'light' | 'dark';
export type Language = 'ar' | 'en';

export interface UserPreferences {
  theme: ThemeMode;
  language: Language;
}

const STORAGE_KEY = 'moeen_user_preferences';
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'ar',
};

// Cache to prevent multiple simultaneous API calls
let preferencesCache: UserPreferences | null = null;
let loadingPromise: Promise<UserPreferences> | null = null;

/**
 * Get preferences from localStorage
 */
function getLocalPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    // Silently fail - will use default preferences
  }

  return DEFAULT_PREFERENCES;
}

/**
 * Save preferences to localStorage
 */
function saveLocalPreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getLocalPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    // Silently fail - localStorage may be disabled
  }
}

/**
 * Load user preferences (from API if authenticated, localStorage if not)
 * Uses caching to prevent multiple simultaneous API calls
 */
export async function loadPreferences(): Promise<UserPreferences> {
  // Return cached preferences if available
  if (preferencesCache) {
    return preferencesCache;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create loading promise
  loadingPromise = (async () => {
    // Always start with localStorage as default
    let preferences = getLocalPreferences();

    // Try to load from API if authenticated
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        preferences = {
          theme: (data.theme || preferences.theme) as ThemeMode,
          language: (data.language || preferences.language) as Language,
        };
        // Save to localStorage as backup
        saveLocalPreferences(preferences);
      } else if (response.status === 401) {
        // Not authenticated - use localStorage
        preferences = getLocalPreferences();
      }
    } catch (error) {
      // API not available - use localStorage
      preferences = getLocalPreferences();
    }

    // Cache the result
    preferencesCache = preferences;
    return preferences;
  })();

  const result = await loadingPromise;
  loadingPromise = null; // Clear loading promise after completion
  return result;
}

/**
 * Clear preferences cache (useful for testing or forcing reload)
 */
export function clearPreferencesCache(): void {
  preferencesCache = null;
  loadingPromise = null;
}

/**
 * Save user preferences (to API if authenticated, localStorage if not)
 */
export async function savePreferences(
  updates: Partial<UserPreferences>
): Promise<void> {
  // Always save to localStorage first
  saveLocalPreferences(updates);

  // Update cache immediately
  if (preferencesCache) {
    preferencesCache = { ...preferencesCache, ...updates };
  }

  // Try to save to API if authenticated
  try {
    const entries = Object.entries(updates);
    for (const [key, value] of entries) {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok && response.status !== 401) {
        // If not 401 (unauthorized), silently fail - localStorage is already saved
      }
      // If 401, that's fine - we already saved to localStorage
    }
  } catch (error) {
    // API not available - localStorage is already saved, so that's fine
  }
}

/**
 * Apply preferences to the DOM
 */
export function applyPreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  const html = document.documentElement;

  // Apply theme
  html.setAttribute('data-theme', preferences.theme);
  if (preferences.theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  // Apply language
  html.setAttribute('lang', preferences.language);
  html.setAttribute('dir', preferences.language === 'ar' ? 'rtl' : 'ltr');
}

