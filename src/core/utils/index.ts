/**
 * Core utilities export
 */
export { cn, cva } from '@/lib/cn';
export type { VariantProps } from '@/lib/cn';

// Placeholder for other utils
export const storageUtils = {};
export const debounce = (fn: any, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
