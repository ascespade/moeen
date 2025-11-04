/**
 * Performance Utilities for Auth
 * أدوات الأداء للمصادقة
 *
 * Performance optimizations and monitoring
 */

/**
 * Debounce function for rate limiting
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for rate limiting
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure function execution time
 */
export async function measureTime<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${label}: ${duration}ms`);
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${label}: ${duration}ms (failed)`);
    }
    throw error;
  }
}
