/**
 * Storage utilities for localStorage and sessionStorage
 */

export const __storage = {
  // localStorage methods
  get: (_key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const __item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (_key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // // console.error("Error saving to localStorage:", error);
    }
  },

  remove: (_key: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // // console.error("Error removing from localStorage:", error);
    }
  },

  clear: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) {
      // // console.error("Error clearing localStorage:", error);
    }
  },
};

export const __sessionStorage = {
  // sessionStorage methods
  get: (_key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const __item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (_key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // // console.error("Error saving to sessionStorage:", error);
    }
  },

  remove: (_key: string) => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      // // console.error("Error removing from sessionStorage:", error);
    }
  },

  clear: () => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.clear();
    } catch (error) {
      // // console.error("Error clearing sessionStorage:", error);
    }
  },
};
