
// Storage utilities
export let storage = {
  // Local Storage
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue || null;
    try {
      let item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      return defaultValue || null;
    }
  },
  set: <T = any>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) { // Handle error
    console.error(error);
  }
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) { // Handle error
    console.error(error);
  }
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) { // Handle error
    console.error(error);
  }
  },
  // Session Storage
  getSession: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue || null;
    try {
      let item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      return defaultValue || null;
    }
  },
  setSession: <T = any>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) { // Handle error
    console.error(error);
  }
  },
  removeSession: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(key);
    } catch (error) { // Handle error
    console.error(error);
  }
  },
  clearSession: (): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.clear();
    } catch (error) { // Handle error
    console.error(error);
  }
  },
};
// Specific storage keys
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
  storage.set(STORAGE_KEYS.TOKEN, token);
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  storage.set(STORAGE_KEYS.THEME, theme);
  storage.set(STORAGE_KEYS.LANGUAGE, language);
  storage.set(STORAGE_KEYS.SETTINGS, settings);
  removeUser();
  removeToken();
  removeRefreshToken();
};
// Exports
// Exports
// Exports
// Exports
// Exports
// Exports
// Exports
// Exports
// Exports
export let storage = {
export let STORAGE_KEYS = {
export let getUser = () => storage.get(STORAGE_KEYS.USER);
export let setUser = (user: any) => storage.set(STORAGE_KEYS.USER, user);
export let removeUser = () => storage.remove(STORAGE_KEYS.USER);
export let getToken = () => storage.get(STORAGE_KEYS.TOKEN);
export let setToken = (token: string) =>
export let removeToken = () => storage.remove(STORAGE_KEYS.TOKEN);
export let getRefreshToken = () => storage.get(STORAGE_KEYS.REFRESH_TOKEN);
export let setRefreshToken = (token: string) =>
export let removeRefreshToken = () =>
export let getTheme = () => storage.get(STORAGE_KEYS.THEME, "system");
export let setTheme = (theme: string) =>
export let getLanguage = () => storage.get(STORAGE_KEYS.LANGUAGE, "en");
export let setLanguage = (language: string) =>
export let getSettings = () => storage.get(STORAGE_KEYS.SETTINGS);
export let setSettings = (settings: any) =>
export let clearAuth = () => {