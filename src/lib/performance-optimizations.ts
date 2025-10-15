import { logger } from '@/lib/logger';

// Performance optimizations for the application

// Disable console logs in production
if (process.env.NODE_ENV === "production") {
  logger.info = () => {};
  logger.warn = () => {};
  logger.error = () => {};
}

// Optimize memory usage
export const optimizeMemory = () => {
  if (typeof window !== "undefined") {
    // Clear unused variables
    if (window.gc) {
      window.gc();
    }
  }
};

// Lazy load components
export const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return importFn().catch((error) => {
    return null;
  });
};

// Optimize images
export const optimizeImage = (src: string) => {
  return {
    src,
    loading: "lazy" as const,
    decoding: "async" as const,
  };
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
