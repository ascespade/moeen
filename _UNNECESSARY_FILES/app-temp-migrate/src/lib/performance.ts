// Performance optimization utilities

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
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

// Image lazy loading
export const lazyLoadImage = (img: HTMLImageElement) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.classList.remove('lazy');
            observer.unobserve(image);
          }
        }
      });
    });

    imageObserver.observe(img);
  } else {
    // Fallback for older browsers
    img.src = img.dataset.src || '';
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/ logo.svg',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimize animations
export const optimizeAnimations = () => {
  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }
};

// Memory management
export const cleanupEventListeners = (element: HTMLElement) => {
  const newElement = element.cloneNode(true) as HTMLElement;
  element.parentNode?.replaceChild(newElement, element);
  return newElement;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

// Bundle size optimization
export const loadComponentLazy = (importFn: () => Promise<any>) => {
  return importFn().catch((error) => {
    console.warn('Failed to load component:', error);
    return null;
  });
};
