import { useEffect, useCallback, useRef } from "react";

// Performance monitoring hook
export const usePerformance = () => {
  // Monitor Core Web Vitals
  const measureCoreWebVitals = useCallback(() => {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry && "startTime" in lastEntry) {
        console.log("LCP:", (lastEntry as PerformanceEntry).startTime);
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const e: any = entry as any;
        if (
          typeof e.processingStart === "number" &&
          typeof e.startTime === "number"
        ) {
          console.log("FID:", e.processingStart - e.startTime);
        }
      });
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log("CLS:", clsValue);
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      // CLS not supported
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Monitor memory usage
  const measureMemory = useCallback(() => {
    if (typeof window === "undefined") return;

    const checkMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        console.log("Memory usage:", {
          used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
          total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
        });
      }
    };

    // Check memory every 30 seconds
    const interval = setInterval(checkMemory, 30000);
    return () => clearInterval(interval);
  }, []);

  // Monitor long tasks
  const measureLongTasks = useCallback(() => {
    if (typeof window === "undefined") return;

    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log("Long task detected:", entry.duration + "ms");
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ["longtask"] });
      return () => longTaskObserver.disconnect();
    } catch (e) {
      // Long task API not supported
      return () => {};
    }
  }, []);

  useEffect(() => {
    const cleanupFunctions = [
      measureCoreWebVitals(),
      measureMemory(),
      measureLongTasks(),
    ].filter(Boolean);

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup?.());
    };
  }, [measureCoreWebVitals, measureMemory, measureLongTasks]);

  return {
    measureCoreWebVitals,
    measureMemory,
    measureLongTasks,
  };
};

// Hook for measuring component render performance
export const useRenderPerformance = (componentName: string) => {
  const renderStart = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (renderTime > 16) {
      // More than one frame (16ms at 60fps)
      console.warn(
        `${componentName} took ${renderTime.toFixed(2)}ms to render`,
      );
    }
  });
};

// Hook for measuring API call performance
export const useApiPerformance = () => {
  const measureApiCall = useCallback(
    async <T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await apiCall();
        const duration = performance.now() - startTime;

        console.log(`API call to ${endpoint} took ${duration.toFixed(2)}ms`);

        if (duration > 1000) {
          // More than 1 second
          console.warn(
            `Slow API call to ${endpoint}: ${duration.toFixed(2)}ms`,
          );
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        console.error(
          `API call to ${endpoint} failed after ${duration.toFixed(2)}ms:`,
          error,
        );
        throw error;
      }
    },
    [],
  );

  return { measureApiCall };
};
