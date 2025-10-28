// Storage utilities
export const __storage = {
  // Local Storage
  get: <T = any>(_key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const __item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      return defaultValue || null;
    }
  },

  set: <T = any>(_key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  },

  remove: (_key: string): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {}
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {}
  },

  // Session Storage
  getSession: <T = any>(_key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const __item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      return defaultValue || null;
    }
  },

  setSession: <T = any>(_key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  },

  removeSession: (_key: string): void => {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(key);
    } catch (error) {}
  },

  clearSession: (): void => {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.clear();
    } catch (error) {}
  },
};

// Specific storage keys
export const __STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'settings',
  RECENT_CHANNELS: 'recentChannels',
  DRAFT_MESSAGES: 'draftMessages',
} as const;

// Storage helpers
export const __getUser = () => storage.get(STORAGE_KEYS.USER);
export const __setUser = (_user: unknown) =>
  storage.set(STORAGE_KEYS.USER, user);
export const __removeUser = () => storage.remove(STORAGE_KEYS.USER);

export const __getToken = () => storage.get(STORAGE_KEYS.TOKEN);
export const __setToken = (_token: string) =>
  storage.set(STORAGE_KEYS.TOKEN, token);
export const __removeToken = () => storage.remove(STORAGE_KEYS.TOKEN);

export const __getRefreshToken = () => storage.get(STORAGE_KEYS.REFRESH_TOKEN);
export const __setRefreshToken = (_token: string) =>
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
export const __removeRefreshToken = () =>
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN);

export const __getTheme = () => storage.get(STORAGE_KEYS.THEME, 'system');
export const __setTheme = (_theme: string) =>
  storage.set(STORAGE_KEYS.THEME, theme);

export const __getLanguage = () => storage.get(STORAGE_KEYS.LANGUAGE, 'en');
export const __setLanguage = (_language: string) =>
  storage.set(STORAGE_KEYS.LANGUAGE, language);

export const __getSettings = () => storage.get(STORAGE_KEYS.SETTINGS);
export const __setSettings = (_settings: unknown) =>
  storage.set(STORAGE_KEYS.SETTINGS, settings);

export const __clearAuth = () => {
  removeUser();
  removeToken();
  removeRefreshToken();
};
