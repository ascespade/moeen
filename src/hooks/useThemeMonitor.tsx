/**
 * Theme Monitor Hook - Hook للمراقبة الفورية للثيمات
 * Monitors components and applies real-time theme adjustments
 */

'use client';

import { analyzeComponentStyles } from '@/lib/color-intelligence';
import { loadThemeSettings, type AdvancedThemeSettings } from '@/lib/theme-settings';
import { useCallback, useEffect, useRef } from 'react';

export interface ThemeMonitorOptions {
  enabled?: boolean;
  mode: 'light' | 'dark';
  onAdjustment?: (component: HTMLElement, adjustments: string[]) => void;
  onReport?: (report: ThemeAdjustmentReport) => void;
}

export interface ThemeAdjustmentReport {
  timestamp: Date;
  component: string;
  adjustments: string[];
  contrastRatio: number;
  meetsStandard: boolean;
}

export function useThemeMonitor(options: ThemeMonitorOptions) {
  const { enabled = true, mode, onAdjustment, onReport } = options;
  const observerRef = useRef<MutationObserver | null>(null);
  const settingsRef = useRef<AdvancedThemeSettings>(loadThemeSettings());
  const reportsRef = useRef<ThemeAdjustmentReport[]>([]);
  // Track last adjustment per element to avoid re-applying too frequently
  const lastAdjustedRef = useRef<WeakMap<HTMLElement, number>>(new WeakMap());

  const applyThemeAdjustments = useCallback(
    (element: HTMLElement) => {
      if (!enabled) return;

      const settings = settingsRef.current;
      if (!settings.themeManagement.colorIntelligence.realTimeUpdate) {
        return;
      }

      // Throttle adjustments per element (once per 10s)
      const now = Date.now();
      const last = lastAdjustedRef.current.get(element) || 0;
      if (now - last < 10000) {
        return;
      }

      // Skip known noisy elements
      if (element.tagName === 'SVG' || element.closest('svg')) return;
      if (element.tagName === 'A' && element.classList.contains('group')) return;

      // Skip non-interactive text elements - don't add shadows or borders to them
      const isTextElement = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LABEL', 'LI', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN', 'ASIDE'].includes(element.tagName);
      const isInteractive = element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT' || element.getAttribute('role') === 'button' || element.getAttribute('role') === 'link' || element.getAttribute('tabindex') !== null;
      
      // Don't apply shadow or other visual adjustments to non-interactive text elements
      if (isTextElement && !isInteractive) {
        return;
      }

      try {
        const analysis = analyzeComponentStyles(element, mode, settings);

        // Apply adjustments if needed
        if (analysis.adjustments.length > 0 || !analysis.meetsStandard) {
          // Apply color adjustments
          if (analysis.color) {
            element.style.color = analysis.color;
          }

          // Apply shadow if optimized - ONLY for interactive elements
          if (analysis.shadow && isInteractive) {
            element.style.boxShadow = analysis.shadow;
          }

          // Apply gradient if optimized
          if (analysis.gradient && element.style.backgroundImage) {
            element.style.backgroundImage = analysis.gradient;
          }

          // Notify about adjustments
          if (onAdjustment && analysis.adjustments.length > 0) {
            onAdjustment(element, analysis.adjustments);
          }

          // Generate report
          // Handle className safely - it might be SVGAnimatedString or other types
          let classNameStr = '';
          try {
            if (element.className) {
              if (typeof element.className === 'string') {
                classNameStr = element.className.split(' ')[0] || '';
              } else if (typeof element.className === 'object' && 'baseVal' in element.className) {
                // SVGAnimatedString case
                classNameStr = (element.className as any).baseVal?.split(' ')[0] || '';
              } else if (typeof element.className === 'object' && 'value' in element.className) {
                classNameStr = (element.className as any).value?.split(' ')[0] || '';
              }
            }
          } catch (e) {
            // Ignore className errors
          }
          
          const report: ThemeAdjustmentReport = {
            timestamp: new Date(),
            component: element.tagName.toLowerCase() + (classNameStr ? `.${classNameStr}` : ''),
            adjustments: analysis.adjustments,
            contrastRatio: analysis.contrastRatio,
            meetsStandard: analysis.meetsStandard,
          };

          reportsRef.current.push(report);
          if (onReport) {
            onReport(report);
          }

          // mark as recently adjusted
          lastAdjustedRef.current.set(element, now);
        }
      } catch (error) {
        console.warn('Failed to apply theme adjustments:', error);
      }
    },
    [enabled, mode, onAdjustment, onReport]
  );

  const scanAndAdjustComponents = useCallback(() => {
    if (!enabled) return;

    const settings = settingsRef.current;
    if (!settings.themeManagement.colorIntelligence.realTimeUpdate) {
      return;
    }

    // Scan all elements with data-theme-auto attribute
    const elementsToCheck = document.querySelectorAll<HTMLElement>('[data-theme-auto]');
    elementsToCheck.forEach((element) => {
      applyThemeAdjustments(element);
    });

    // Also check common component selectors
    const commonSelectors = [
      '[class*="button"]',
      '[class*="card"]',
      '[class*="input"]',
      '[class*="text"]',
      '[class*="bg-"]',
    ];

    commonSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        elements.forEach((element) => {
          // Only adjust if element is visible
          if (element.offsetParent !== null) {
            applyThemeAdjustments(element);
          }
        });
      } catch (error) {
        // Ignore selector errors
      }
    });
  }, [enabled, applyThemeAdjustments]);

  useEffect(() => {
    if (!enabled) return;

    settingsRef.current = loadThemeSettings();

    // Initial scan
    scanAndAdjustComponents();

    // Set up MutationObserver to watch for new components
    if (settingsRef.current.themeManagement.colorIntelligence.realTimeUpdate) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              applyThemeAdjustments(element);

              // Also check children
              const children = element.querySelectorAll<HTMLElement>('[data-theme-auto]');
              children.forEach((child) => {
                applyThemeAdjustments(child);
              });
            }
          });
        });
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false, // We'll check on attribute changes separately
      });
    }

    // Periodic scan for elements that might have changed styles
    const interval = setInterval(() => {
      scanAndAdjustComponents();
    }, 8000); // Scan every 8 seconds to reduce noise

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(interval);
    };
  }, [enabled, mode, scanAndAdjustComponents, applyThemeAdjustments]);

  const generateReport = useCallback((): ThemeAdjustmentReport[] => {
    return [...reportsRef.current];
  }, []);

  const clearReports = useCallback(() => {
    reportsRef.current = [];
  }, []);

  return {
    scanAndAdjust: scanAndAdjustComponents,
    generateReport,
    clearReports,
    reports: reportsRef.current,
  };
}

