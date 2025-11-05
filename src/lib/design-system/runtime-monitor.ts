/**
 * Runtime Design System Monitor
 * مراقب نظام التصميم في الوقت الفعلي
 *
 * يفحص التصميم في المتصفح ويحذّر من المخالفات
 */

import { logger } from '@/lib/monitoring/logger';

if (typeof window !== 'undefined') {
  // Monitor for hardcoded colors
  const observer = new MutationObserver(() => {
    checkForViolations();
  });

  function checkForViolations() {
    const forbiddenClasses = [
      'bg-gray-',
      'text-gray-',
      'border-gray-',
      'bg-white',
      'bg-black',
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
            '\n💡 Use CSS variables instead: bg-[var(--background)]'
          );

          // Highlight in development
          if (process.env.NODE_ENV === 'development') {
            (element as HTMLElement).style.outline = '2px solid red';
            (element as HTMLElement).style.outlineOffset = '2px';
          }
        }
      });
    });
  }

  // Start monitoring after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
      checkForViolations();
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
    checkForViolations();
  }
}

export {};

