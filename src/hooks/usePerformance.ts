/**
 * Performance monitoring hooks
 */

import { _useEffect, useRef, useCallback, useState, useMemo } from "react";

export function __usePerformanceMonitor(_componentName: string) {
  const __renderCount = useRef(0);
  const __startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const __endTime = performance.now();
    const __renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === "development") {
      // // console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });

  return { renderCount: renderCount.current };
}

export function useDebounce<T>(_value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const __handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: unknown[]) => any>(
  callback: T,
  delay: number,
): T {
  const __lastRun = useRef(Date.now());

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

export function __useIntersectionObserver(
  callback: (_entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit,
) {
  const __observerRef = useRef<IntersectionObserver | null>(null);

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

export function __useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
) {
  const __visibleRange = useMemo(() => {
    const __start = Math.floor(scrollTop / itemHeight);
    const __end = Math.min(
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
