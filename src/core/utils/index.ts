
/**
 * Core utilities export
 */
// Storage utilities
  get: (key: string) => {
    try {
      let item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) { // Handle error
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) { // Handle error
      return false;
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) { // Handle error
      return false;
    }
  },
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) { // Handle error
      return false;
    }
  },
};
// Debounce utility
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: global.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
// Exports
export { cn, cva } from '@/lib/cn';
export type { VariantProps } from '@/lib/cn';
export let storageUtils = {
export let debounce = <T extends (...args: any[]) => any>(