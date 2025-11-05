/**
 * Design System Monitor Component
 * مكون مراقبة نظام التصميم
 */

'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/monitoring/logger';

export function DesignSystemMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor for hardcoded colors
    const checkForViolations = () => {
      const forbiddenClasses = [
        'bg-gray-',
        'text-gray-',
        'border-gray-',
      ];

      forbiddenClasses.forEach(pattern => {
        const elements = document.querySelectorAll(`[class*="${pattern}"]`);
        elements.forEach(element => {
          const className = element.getAttribute('class') || '';
          // Skip if already using CSS variables
          if (!className.includes('var(--')) {
            logger.warn(
              `⚠️ Design System Violation: Found "${pattern}" in element:`,
              element,
              '\n💡 Use CSS variables instead'
            );
          }
        });
      });
    };

    // Check on mount
    checkForViolations();

    // Monitor changes
    const observer = new MutationObserver(() => {
      checkForViolations();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

