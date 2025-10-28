'use client';

import { useEffect } from 'react';
import { initModernInteractions } from '@/lib/modern-interactions';

interface ModernInteractionsProviderProps {
  children: React.ReactNode;
}

export default function ModernInteractionsProvider({
  children,
}: ModernInteractionsProviderProps) {
  useEffect(() => {
    // Initialize modern interactions when component mounts
    initModernInteractions();

    // Add scroll reveal classes to elements
    const addScrollRevealClasses = () => {
      const elements = document.querySelectorAll(
        '.animate-fadeInUp, .animate-fadeIn, .animate-slideInRight'
      );
      elements.forEach(element => {
        element.classList.add('scroll-reveal');
      });
    };

    // Add classes after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(addScrollRevealClasses, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <>{children}</>;
}
