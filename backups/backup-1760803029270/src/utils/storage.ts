// Storage utilities
export const storage = {
  // Local Storage
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      return defaultValue || null;
    }
  },

  set: <T = any>(key: string, value: T): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(key);
    } catch (error) {}
  },

  clear: (): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.clear();
    } catch (error) {}
  },

  // Session Storage
  getSession: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      return defaultValue || null;
    }
  },

  setSession: <T = any>(key: string, value: T): void => {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  },

  removeSession: (key: string): void => {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.removeItem(key);
    } catch (error) {}
  },

  clearSession: (): void => {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.clear();
    } catch (error) {}
  },
};

// Specific storage keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  THEME: "theme",
  LANGUAGE: "language",
  SETTINGS: "settings",
  RECENT_CHANNELS: "recentChannels",
  DRAFT_MESSAGES: "draftMessages",
} as const;

// Storage helpers
export const getUser = () => storage.get(STORAGE_KEYS.USER);
export const setUser = (user: any) => storage.set(STORAGE_KEYS.USER, user);
export const removeUser = () => storage.remove(STORAGE_KEYS.USER);

export const getToken = () => storage.get(STORAGE_KEYS.TOKEN);
export const setToken = (token: string) =>
  storage.set(STORAGE_KEYS.TOKEN, token);
export const removeToken = () => storage.remove(STORAGE_KEYS.TOKEN);

export const getRefreshToken = () => storage.get(STORAGE_KEYS.REFRESH_TOKEN);
export const setRefreshToken = (token: string) =>
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
export const removeRefreshToken = () =>
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN);

export const getTheme = () => storage.get(STORAGE_KEYS.THEME, "system");
export const setTheme = (theme: string) =>
  storage.set(STORAGE_KEYS.THEME, theme);

export const getLanguage = () => storage.get(STORAGE_KEYS.LANGUAGE, "en");
export const setLanguage = (language: string) =>
  storage.set(STORAGE_KEYS.LANGUAGE, language);

export const getSettings = () => storage.get(STORAGE_KEYS.SETTINGS);
export const setSettings = (settings: any) =>
  storage.set(STORAGE_KEYS.SETTINGS, settings);

export const clearAuth = () => {
  removeUser();
  removeToken();
  removeRefreshToken();
};
