'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    HSStaticMethods?: {
      autoInit?: () => void;
    };
  }
}

export default function PrelineInit() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Dynamically import and initialize Preline with error handling
    const initPreline = async () => {
      try {
        const prelineModule = await import('preline/preline');
        // Preline may export differently, try multiple possible exports
        const HSStaticMethods = prelineModule?.HSStaticMethods || prelineModule?.default || prelineModule;
        if (HSStaticMethods && typeof HSStaticMethods === 'object') {
          window.HSStaticMethods = HSStaticMethods;
          if (typeof HSStaticMethods.autoInit === 'function') {
            HSStaticMethods.autoInit();
          }
        }
      } catch (error) {
        // Silently fail if Preline can't be loaded - don't block the app
        console.warn('Preline initialization failed (this is optional):', error);
      }
    };

    // Initialize after a small delay to not block initial render
    const timer = setTimeout(() => {
      initPreline();
    }, 100);

    // Re-initialize on route changes for Next.js App Router
    const handleRouteChange = () => {
      if (window.HSStaticMethods?.autoInit) {
        window.HSStaticMethods.autoInit();
      }
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
}

