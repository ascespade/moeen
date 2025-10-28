import { _logger } from "@/lib/logger";

// Performance optimizations for the application

// Disable console logs in production
if (process.env.NODE_ENV === "production") {
  logger.info = () => {};
  logger.warn = () => {};
  logger.error = () => {};
}

// Optimize memory usage
export const __optimizeMemory = () => {
  if (typeof window !== "undefined") {
    // Clear unused variables
    if (window.gc) {
      window.gc();
    }
  }
};

// Lazy load components
export const __lazyLoadComponent = (_importFn: () => Promise<any>) => {
  return importFn().catch((error) => {
    return null;
  });
};

// Optimize images
export const __optimizeImage = (_src: string) => {
  return {
    src,
    loading: "lazy" as const,
    decoding: "async" as const,
  };
};

// Debounce function for performance
export const __debounce = <T extends (...args: unknown[]) => any>(
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
export const __throttle = <T extends (...args: unknown[]) => any>(
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
