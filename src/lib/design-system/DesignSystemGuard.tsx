/**
 * Design System Guard Component
 * حارس نظام التصميم
 *
 * Wraps components to enforce design system rules
 */

'use client';

import React, { Component, ReactNode, _ErrorInfo } from 'react';
import { validateCSSClasses, type ValidationResult } from './validator';
import { logger } from '@/lib/utils/logger';

interface DesignSystemGuardProps {
  children: ReactNode;
  componentName: string;
  strict?: boolean;
}

interface DesignSystemGuardState {
  violations: ValidationResult;
}

export class DesignSystemGuard extends Component<
  DesignSystemGuardProps,
  DesignSystemGuardState
> {
  constructor(props: DesignSystemGuardProps) {
    super(props);
    this.state = {
      violations: {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: [],
      },
    };
  }

  componentDidMount() {
    this.validateComponent();
  }

  componentDidUpdate() {
    this.validateComponent();
  }

  validateComponent() {
    // Get all elements with className in children
    if (typeof window === 'undefined') return;

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Find all elements with className
    const elements = document.querySelectorAll('[class]');
    elements.forEach((element) => {
      const className = element.getAttribute('class') || '';
      const result = validateCSSClasses(className, this.props.componentName);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
      suggestions.push(...result.suggestions);
    });

    const violations: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };

    if (!violations.isValid && this.props.strict) {
      logger.error('Design System Violations:', { violations })
    }

    if (warnings.length > 0) {
      logger.warn('Design System Warnings:', { warnings })
    }

    this.setState({ violations });
  }

  render() {
    const { children, strict } = this.props;
    const { violations } = this.state;

    if (strict && !violations.isValid) {
      return (
        <div className="border-2 border-red-500 p-4 bg-red-50 rounded">
          <h3 className="text-red-800 font-bold mb-2">
            Design System Violation Detected
          </h3>
          <ul className="list-disc list-inside text-red-700">
            {violations.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      );
    }

    return <>{children}</>;
  }
}

/**
 * Hook to validate and auto-fix CSS classes
 */
export function useDesignSystemValidation(classes: string, componentName: string) {
  const [violations, setViolations] = React.useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
  });

  React.useEffect(() => {
    const result = validateCSSClasses(classes, componentName);
    setViolations(result);
  }, [classes, componentName]);

  return violations;
}

