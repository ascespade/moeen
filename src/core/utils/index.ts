/**
 * Core Utilities - الأدوات الأساسية
 * Centralized utility functions
 */

import { _type ClassValue, clsx } from "clsx";

// Class name utility
export function __cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Date utilities
export const __dateUtils = {
  format: (_date: Date | string, format: string = "DD/MM/YYYY"): string => {
    const __d = new Date(date);
    const __day = d.getDate().toString().padStart(2, "0");
    const __month = (d.getMonth() + 1).toString().padStart(2, "0");
    const __year = d.getFullYear();
    const __hours = d.getHours().toString().padStart(2, "0");
    const __minutes = d.getMinutes().toString().padStart(2, "0");

    return format
      .replace("DD", day)
      .replace("MM", month)
      .replace("YYYY", year.toString())
      .replace("HH", hours)
      .replace("mm", minutes);
  },

  addDays: (_date: Date, days: number): Date => {
    const __result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addHours: (_date: Date, hours: number): Date => {
    const __result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  },

  isToday: (_date: Date): boolean => {
    const __today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isTomorrow: (_date: Date): boolean => {
    const __tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  },

  getTimeSlots: (
    startTime: string,
    endTime: string,
    duration: number = 30,
  ): string[] => {
    const slots: string[] = [];
    const __start = new Date(`2000-01-01T${startTime}`);
    const __end = new Date(`2000-01-01T${endTime}`);

    const __current = new Date(start);
    while (current < end) {
      const __timeString = current.toTimeString().slice(0, 5);
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + duration);
    }

    return slots;
  },
};

// String utilities
export const __stringUtils = {
  capitalize: (_str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  camelCase: (_str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1]?.toUpperCase() || "");
  },

  kebabCase: (_str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  },

  truncate: (_str: string, length: number): string => {
    return str.length > length ? str.slice(0, length) + "..." : str;
  },

  slugify: (_str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  generateId: (_length: number = 8): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

// Number utilities
export const __numberUtils = {
  formatCurrency: (_amount: number, currency: string = "SAR"): string => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },

  formatNumber: (_num: number): string => {
    return new Intl.NumberFormat("ar-SA").format(num);
  },

  round: (_num: number, decimals: number = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  clamp: (_num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  },
};

// Array utilities
export const __arrayUtils = {
  unique: <T>(_arr: T[]): T[] => {
    return [...new Set(arr)];
  },

  groupBy: <T, K extends string | number>(
    arr: T[],
    key: (_item: T) => K,
  ): Record<K, T[]> => {
    return arr.reduce(
      (groups, item) => {
        const __groupKey = key(item);
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );
  },

  sortBy: <T>(
    arr: T[],
    key: keyof T,
    direction: "asc" | "desc" = "asc",
  ): T[] => {
    return [...arr].sort((a, b) => {
      const __aVal = a[key];
      const __bVal = b[key];

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  },

  chunk: <T>(_arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
};

// Object utilities
export const __objectUtils = {
  pick: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Pick<T, K> => {
    const __result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> => {
    const __result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  },

  deepMerge: <T extends Record<string, any>>(
    target: T,
    source: Partial<T>,
  ): T => {
    const __result = { ...target };

    for (const key in source) {
      if (source[key] !== undefined) {
        if (
          typeof source[key] === "object" &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = objectUtils.deepMerge(
            (result[key] as any) || {},
            source[key] as any,
          );
        } else {
          result[key] = source[key] as any;
        }
      }
    }

    return result;
  },
};

// Validation utilities
export const __validationUtils = {
  isEmail: (_email: string): boolean => {
    const __emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPhone: (_phone: string): boolean => {
    const __phoneRegex = /^(\+966|0)?[5-9][0-9]{8}$/;
    return phoneRegex.test(phone);
  },

  isUrl: (_url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isStrongPassword: (_password: string): boolean => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },
};

// Local storage utilities
export const __storageUtils = {
  get: <T>(_key: string, defaultValue?: T): T | null => {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const __item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(_key: string, value: T): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // // console.error("Error saving to localStorage:", error);
    }
  },

  remove: (_key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};

// API utilities
export const __apiUtils = {
  buildUrl: (_baseUrl: string, params: Record<string, any>): string => {
    const __url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
    return url.toString();
  },

  handleResponse: async <T>(_response: Response): Promise<T> => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const __data = await response.json();
    return data;
  },

  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000,
  ): Promise<T> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxAttempts) {
          throw lastError;
        }

        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  },
};

// Debounce utility
export function debounce<T extends (...args: unknown[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
