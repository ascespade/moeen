export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
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
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${label} took ${duration}ms`);
    }

    return duration;
  }

  measurePageLoad(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;

        console.log(`Page load time: ${loadTime}ms`);

        // Send to analytics
        this.sendMetric("page_load_time", loadTime);
      });
    }
// Image lazy loading
export const lazyLoadImage = (img: HTMLImageElement) => {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.classList.remove("lazy");
            observer.unobserve(image);
          }
        }
      });
    });

    imageObserver.observe(img);
  } else {
    // Fallback for older browsers
    img.src = img.dataset.src || "";
  }

  measureComponentRender(componentName: string): void {
    this.startTiming(`component_${componentName}_render`);
// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = ["/hemam-logo.jpg"];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimize animations
export const optimizeAnimations = () => {
  // Reduce motion for users who prefer it
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty(
      "--animation-duration",
      "0.01ms",
    );
  }

  endComponentRender(componentName: string): number {
    return this.endTiming(`component_${componentName}_render`);
// Memory management
export const cleanupEventListeners = (element: HTMLElement) => {
  const newElement = element.cloneNode(true) as HTMLElement;
  element.parentNode?.replaceChild(newElement, element);
  return newElement;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }

  measureAsyncOperation(operationName: string): void {
    this.startTiming(`async_${operationName}`);
  }

  endAsyncOperation(operationName: string): number {
    return this.endTiming(`async_${operationName}`);
  }

  private sendMetric(name: string, value: number): void {
    if (process.env.NODE_ENV === "production") {
      // Send to analytics service
      fetch("/api/analytics/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, value, timestamp: Date.now() }),
      }).catch(console.error);
    }
  }

  // Memory usage monitoring
  checkMemoryUsage(): void {
    if (typeof window !== "undefined" && 'memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1024 / 1024; // MB
      const total = memory.totalJSHeapSize / 1024 / 1024; // MB
      
      if (used > 100) { // Alert if using more than 100MB
        console.warn(`High memory usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
      }
    }
  }
}

export default PerformanceMonitor;
// Bundle size optimization
export const loadComponentLazy = (importFn: () => Promise<any>) => {
  return importFn().catch((error) => {
    console.warn("Failed to load component:", error);
    return null;
  });
};
