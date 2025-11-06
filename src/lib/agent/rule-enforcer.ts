/**
 * Rule Enforcer System - نظام فرض القواعد
 * Enforces agent rules and validates code changes in real-time
 */

import { validateAgainstRules, type RuleViolation } from './agent-settings';

// Central color palette - الألوان الأساسية المحمية
export const PROTECTED_COLORS = {
  primary: ['--brand-primary', '--brand-primary-hover'],
  secondary: ['--brand-secondary'],
  accent: ['--brand-accent'],
} as const;

// Central color palette values
export const CENTRAL_PALETTE = [
  // Brand colors
  '#e46c0a', // brand-primary
  '#c55d0a', // brand-primary-hover
  '#ff9800', // brand-secondary
  '#0066cc', // brand-accent
  '#008a7a', // brand-success
  '#e68900', // brand-warning
  '#dc2626', // brand-error
  '#0284c7', // brand-info
  // Text colors
  '#1e293b', // text-primary
  '#475569', // text-secondary
  '#64748b', // text-muted
  // Background colors
  '#ffffff', // background
  '#f9f9f9', // brand-surface
  '#f1f5f9', // brand-surface (light)
  '#121212', // dark background
  '#181818', // dark surface
] as const;

/**
 * Check if a color is in the protected list
 */
export function isProtectedColor(color: string): boolean {
  const normalized = color.toLowerCase().trim();
  // Check if it's a CSS variable for protected colors
  if (
    normalized.includes('--brand-primary') ||
    normalized.includes('--brand-primary-hover')
  ) {
    return true;
  }
  // Check if it matches protected hex values
  return PROTECTED_COLORS.primary.some(pc =>
    normalized.includes(pc.toLowerCase())
  );
}

/**
 * Check if color is in centralized palette
 */
export function isInCentralPalette(color: string): boolean {
  const normalized = color.toLowerCase().trim();
  // Remove # if present
  const cleanColor = normalized.startsWith('#') ? normalized : `#${normalized}`;
  return CENTRAL_PALETTE.some(
    paletteColor => paletteColor.toLowerCase() === cleanColor
  );
}

/**
 * Validate component code for rule violations
 */
export interface ComponentValidationContext {
  code?: string;
  filePath?: string;
  componentName?: string;
  hasFakeData?: boolean;
  primaryColorChanged?: boolean;
  hasEmptyLinks?: boolean;
  isDuplicate?: boolean;
  colorsUsed?: string[];
  links?: { href?: string; text?: string }[];
}

export function validateComponent(context: ComponentValidationContext): {
  isValid: boolean;
  violations: RuleViolation[];
  warnings: string[];
} {
  const violations: RuleViolation[] = [];
  const warnings: string[] = [];

  // Check for fake data patterns
  if (context.code) {
    const fakeDataPatterns = [
      /mockData|fakeData|dummyData|testData/gi,
      /"name":\s*"Test|"John|"Jane|"Ahmed|"محمد|"علي/gi,
      /placeholder\s*=\s*"test|"example/gi,
    ];

    const hasFakeData = fakeDataPatterns.some(pattern =>
      pattern.test(context.code)
    );
    if (hasFakeData) {
      context.hasFakeData = true;
    }

    // Check for empty links
    const emptyLinkPatterns = [
      /href\s*=\s*["']#["']/g,
      /href\s*=\s*["']\s*["']/g,
      /href\s*=\s*{["']\s*["']}/g,
    ];

    const hasEmptyLinks = emptyLinkPatterns.some(pattern =>
      pattern.test(context.code)
    );
    if (hasEmptyLinks) {
      context.hasEmptyLinks = true;
    }

    // Check for non-palette colors
    if (context.colorsUsed) {
      const nonPaletteColors = context.colorsUsed.filter(
        color => !isInCentralPalette(color) && !color.startsWith('var(--')
      );
      if (nonPaletteColors.length > 0) {
        context.usesNonPaletteColors = true;
        warnings.push(
          `الألوان التالية ليست في لوحة الألوان المركزية: ${nonPaletteColors.join(', ')}`
        );
      }
    }

    // Check for primary color changes
    if (
      context.code.includes('--brand-primary') &&
      context.code.includes(':')
    ) {
      // Check if it's being modified (not just used)
      const modificationPattern = /--brand-primary\s*:\s*[^;]+/g;
      if (modificationPattern.test(context.code)) {
        context.primaryColorChanged = true;
      }
    }
  }

  // Run validation against rules
  const ruleViolations = validateAgainstRules({
    componentName: context.componentName,
    hasFakeData: context.hasFakeData,
    primaryColorChanged: context.primaryColorChanged,
    hasEmptyLinks: context.hasEmptyLinks,
    isDuplicate: context.isDuplicate,
    usesNonPaletteColors: context.usesNonPaletteColors,
  });

  violations.push(...ruleViolations);

  // Check accessibility
  if (context.code) {
    const accessibilityIssues: string[] = [];

    // Check for missing alt attributes
    if (
      /<img[^>]+(?!alt=)/g.test(context.code) &&
      !/<img[^>]+alt=/g.test(context.code)
    ) {
      accessibilityIssues.push('صور بدون نص بديل (alt)');
    }

    // Check for missing aria-labels on buttons
    if (
      /<button[^>]*>/g.test(context.code) &&
      !/<button[^>]+aria-label=/g.test(context.code)
    ) {
      const buttonsWithText = /<button[^>]*>.*?<\/button>/gs.test(context.code);
      if (!buttonsWithText) {
        accessibilityIssues.push('أزرار بدون aria-label أو نص واضح');
      }
    }

    if (accessibilityIssues.length > 0) {
      violations.push({
        ruleType: 'accessibilityCheck',
        severity: 'warning',
        message: 'مشاكل في إمكانية الوصول',
        description: accessibilityIssues.join(', '),
      });
    }
  }

  return {
    isValid: violations.filter(v => v.severity === 'error').length === 0,
    violations,
    warnings,
  };
}

/**
 * Generate violation report
 */
export function generateViolationReport(violations: RuleViolation[]): string {
  if (violations.length === 0) {
    return '✅ لا توجد مخالفات - الكود متوافق مع جميع القواعد';
  }

  const errors = violations.filter(v => v.severity === 'error');
  const warnings = violations.filter(v => v.severity === 'warning');
  const infos = violations.filter(v => v.severity === 'info');

  let report = '📋 تقرير المخالفات:\n\n';

  if (errors.length > 0) {
    report += `❌ أخطاء (${errors.length}):\n`;
    errors.forEach((error, index) => {
      report += `${index + 1}. ${(error instanceof Error ? error.message : String(error))}\n   ${error.description}\n\n`;
    });
  }

  if (warnings.length > 0) {
    report += `⚠️ تحذيرات (${warnings.length}):\n`;
    warnings.forEach((warning, index) => {
      report += `${index + 1}. ${warning.message}\n   ${warning.description}\n\n`;
    });
  }

  if (infos.length > 0) {
    report += `ℹ️ معلومات (${infos.length}):\n`;
    infos.forEach((info, index) => {
      report += `${index + 1}. ${info.message}\n   ${info.description}\n\n`;
    });
  }

  return report;
}
