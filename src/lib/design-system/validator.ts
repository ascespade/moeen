/**
 * Design System Validator
 * نظام فحص التصميم
 *
 * Prevents design system from breaking by validating all CSS classes
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// Allowed CSS classes from centralized system
const ALLOWED_CLASSES = {
  // Layout
  container: ['container-app'],
  layout: ['flex', 'grid', 'inline-flex', 'block', 'inline-block'],

  // Spacing
  padding: ['p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8', 'px-1', 'px-2', 'px-3', 'px-4', 'px-6', 'px-8', 'py-1', 'py-2', 'py-3', 'py-4', 'py-6', 'py-8'],
  margin: ['m-1', 'm-2', 'm-3', 'm-4', 'm-6', 'm-8', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-6', 'mb-8'],
  gap: ['gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8'],

  // Colors - MUST use CSS variables
  background: [
    'bg-[var(--background)]',
    'bg-[var(--panel)]',
    'bg-[var(--brand-surface)]',
    'bg-[var(--brand-primary)]',
    'bg-[var(--brand-secondary)]',
    'bg-[var(--brand-accent)]',
  ],
  text: [
    'text-[var(--text-primary)]',
    'text-[var(--text-secondary)]',
    'text-[var(--text-muted)]',
    'text-[var(--foreground)]',
    'text-white',
    'text-black',
  ],
  border: [
    'border-[var(--brand-border)]',
    'border-[var(--brand-primary)]',
  ],

  // Components
  button: ['btn', 'btn-default', 'btn-outline', 'btn-secondary'],
  card: ['card'],
  nav: ['nav', 'nav-link'],

  // Responsive
  responsive: ['sm:', 'md:', 'lg:', 'xl:', '2xl:'],

  // Utilities
  utilities: ['rounded', 'rounded-lg', 'rounded-md', 'rounded-xl', 'shadow', 'shadow-lg', 'shadow-md', 'transition-all', 'transition-colors'],
};

// Forbidden patterns
const FORBIDDEN_PATTERNS = [
  /bg-(red|blue|green|yellow|purple|pink|indigo|teal|orange|gray)-\d+/,
  /text-(red|blue|green|yellow|purple|pink|indigo|teal|orange|gray)-\d+/,
  /border-(red|blue|green|yellow|purple|pink|indigo|teal|orange|gray)-\d+/,
  /bg-white(?![^[]*var)/,
  /bg-black(?![^[]*var)/,
  /text-gray-\d+/,
  /border-gray-\d+/,
  /style\s*=\s*\{[^}]*color[^}]*\}/,
  /style\s*=\s*\{[^}]*background[^}]*\}/,
];

/**
 * Validate CSS classes in a string
 */
export function validateCSSClasses(classes: string, context?: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!classes || typeof classes !== 'string') {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
    };
  }

  const classList = classes.split(/\s+/).filter(Boolean);

  // Check for forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(classes)) {
      const match = classes.match(pattern);
      if (match) {
        errors.push(
          `FORBIDDEN: Hardcoded color detected: "${match[0]}" ${context ? `in ${context}` : ''}. Use CSS variables instead.`
        );
        suggestions.push(
          `Replace "${match[0]}" with appropriate CSS variable from centralized.css`
        );
      }
    }
  }

  // Check for inline styles with colors
  if (/style\s*=\s*\{[^}]*["']#[^"']*["']/.test(classes)) {
    errors.push(
      `FORBIDDEN: Inline style with hardcoded color detected ${context ? `in ${context}` : ''}. Use CSS variables.`
    );
  }

  // Check for missing CSS variables for colors
  const hasColorClasses = /(bg|text|border)-/.test(classes);
  const hasCSSVariables = /var\(--/.test(classes);

  if (hasColorClasses && !hasCSSVariables && !classes.includes('btn') && !classes.includes('card')) {
    warnings.push(
      `Color classes detected without CSS variables ${context ? `in ${context}` : ''}. Consider using CSS variables for theme support.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validate a React component's className props
 */
export function validateComponent(componentCode: string, componentName: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Extract all className attributes
  const classNameRegex = /className\s*=\s*["']([^"']+)["']/g;
  const classNameMatches = [...componentCode.matchAll(classNameRegex)];

  for (const match of classNameMatches) {
    const classes = match[1];
    const result = validateCSSClasses(classes, `${componentName} component`);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    suggestions.push(...result.suggestions);
  }

  // Extract template literal className
  const templateLiteralRegex = /className\s*=\s*\{`([^`]+)`\}/g;
  const templateMatches = [...componentCode.matchAll(templateLiteralRegex)];

  for (const match of templateMatches) {
    const classes = match[1];
    const result = validateCSSClasses(classes, `${componentName} component`);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    suggestions.push(...result.suggestions);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Auto-fix common design system violations
 */
export function autoFixCSSClasses(classes: string): string {
  let fixed = classes;

  // Replace common hardcoded colors with CSS variables
  const colorReplacements: Record<string, string> = {
    'bg-white': 'bg-[var(--background)]',
    'bg-black': 'bg-[var(--background)]',
    'bg-gray-50': 'bg-[var(--panel)]',
    'bg-gray-100': 'bg-[var(--brand-surface)]',
    'bg-gray-200': 'bg-[var(--brand-surface)]',
    'bg-gray-800': 'bg-[var(--brand-surface)]',
    'bg-gray-900': 'bg-[var(--background)]',
    'text-gray-900': 'text-[var(--text-primary)]',
    'text-gray-700': 'text-[var(--text-secondary)]',
    'text-gray-600': 'text-[var(--text-secondary)]',
    'text-gray-500': 'text-[var(--text-muted)]',
    'text-gray-400': 'text-[var(--text-muted)]',
    'border-gray-200': 'border-[var(--brand-border)]',
    'border-gray-300': 'border-[var(--brand-border)]',
    'border-gray-700': 'border-[var(--brand-border)]',
  };

  for (const [oldClass, newClass] of Object.entries(colorReplacements)) {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    fixed = fixed.replace(regex, newClass);
  }

  return fixed;
}

/**
 * Validate entire file
 */
export async function validateFile(filePath: string): Promise<ValidationResult> {
  // This would read the file and validate it
  // For now, return a placeholder
  return {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
  };
}

