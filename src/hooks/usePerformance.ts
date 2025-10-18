
/**
 * Performance monitoring hooks
 */
import logger from '@/lib/monitoring/logger';
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
  let renderCount = useRef(0);
  let startTime = useRef(performance.now());
  useEffect(() => {
    renderCount.current += 1;
    let endTime = performance.now();
    let renderTime = endTime - startTime.current;
    if (process.env.NODE_ENV === "development") {}ms`
    }
    startTime.current = performance.now();
  });
  return { renderCount: renderCount.current };
}
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    let handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
  callback: T,
  delay: number,
): T {
  let lastRun = useRef(Date.now());
  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay],
  );
}
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit,
) {
  let observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);
  return observerRef.current;
}
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
) {
  let visibleRange = useMemo(() => {
    let start = Math.floor(scrollTop / itemHeight);
    let end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      itemCount,
    );
    return {
      start: Math.max(0, start),
      end: Math.min(end, itemCount),
      totalHeight: itemCount * itemHeight,
    };
  }, [itemCount, itemHeight, containerHeight, scrollTop]);
  return visibleRange;
}
// Exports
export function usePerformanceMonitor(componentName: string) {
export function useDebounce<T>(value: T, delay: number): T {
export function useThrottle<T extends (...args: any[]) => any>(
export function useIntersectionObserver(
export function useVirtualization(