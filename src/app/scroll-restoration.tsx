'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Save scroll position on scroll
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
    };

    // Restore scroll position
    const restoreScroll = () => {
      const savedPosition = sessionStorage.getItem(`scroll-${pathname}`);
      if (savedPosition) {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: 'auto', // instant restore for back button
          });
        });
      }
    };

    // Save scroll position periodically
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Restore immediately if navigating back/forward
    if (window.performance && window.performance.navigation.type === 2) {
      // Back/Forward navigation
      restoreScroll();
    } else {
      // Regular navigation - restore after a delay
      const timer = setTimeout(restoreScroll, 50);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, searchParams]);

  return null;
}

