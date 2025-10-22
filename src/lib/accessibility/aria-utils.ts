/**
 * ARIA Accessibility Utilities
 * Professional accessibility helpers
 */

interface AriaLabelProps {
  label: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  hidden?: boolean;
}

/**
 * Generate ARIA attributes for form inputs
 */
export function getFormAriaProps(props: AriaLabelProps): Record<string, any> {
  const attrs: Record<string, any> = {
    'aria-label': props.label,
  };

  if (props.describedBy) {
    attrs['aria-describedby'] = props.describedBy;
  }

  if (props.required) {
    attrs['aria-required'] = 'true';
  }

  if (props.invalid) {
    attrs['aria-invalid'] = 'true';
  }

  if (props.hidden) {
    attrs['aria-hidden'] = 'true';
  }

  return attrs;
}

/**
 * Generate ARIA attributes for buttons
 */
export function getButtonAriaProps(
  label: string,
  options?: {
    pressed?: boolean;
    expanded?: boolean;
    disabled?: boolean;
    controls?: string;
  }
): Record<string, any> {
  const attrs: Record<string, any> = {
    'aria-label': label,
  };

  if (options?.pressed !== undefined) {
    attrs['aria-pressed'] = String(options.pressed);
  }

  if (options?.expanded !== undefined) {
    attrs['aria-expanded'] = String(options.expanded);
  }

  if (options?.disabled) {
    attrs['aria-disabled'] = 'true';
  }

  if (options?.controls) {
    attrs['aria-controls'] = options.controls;
  }

  return attrs;
}

/**
 * Generate ARIA attributes for navigation
 */
export function getNavAriaProps(
  label: string,
  current?: boolean
): Record<string, any> {
  return {
    'aria-label': label,
    'aria-current': current ? 'page' : undefined,
  };
}

/**
 * Generate ARIA attributes for modals/dialogs
 */
export function getDialogAriaProps(
  title: string,
  describedBy?: string
): Record<string, any> {
  return {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': title,
    'aria-describedby': describedBy,
  };
}

/**
 * Generate ARIA attributes for alerts
 */
export function getAlertAriaProps(
  type: 'error' | 'warning' | 'success' | 'secondary'
): Record<string, any> {
  return {
    role: 'alert',
    'aria-live': type === 'error' ? 'assertive' : 'polite',
    'aria-atomic': 'true',
  };
}

/**
 * Generate ARIA attributes for tables
 */
export function getTableAriaProps(caption: string): Record<string, any> {
  return {
    role: 'table',
    'aria-label': caption,
  };
}

/**
 * Generate ARIA attributes for tabs
 */
export function getTabAriaProps(
  id: string,
  selected: boolean,
  controls: string
): Record<string, any> {
  return {
    role: 'tab',
    'aria-selected': String(selected),
    'aria-controls': controls,
    id,
    tabIndex: selected ? 0 : -1,
  };
}

/**
 * Generate ARIA attributes for tab panels
 */
export function getTabPanelAriaProps(
  id: string,
  labelledBy: string,
  hidden: boolean
): Record<string, any> {
  return {
    role: 'tabpanel',
    id,
    'aria-labelledby': labelledBy,
    'aria-hidden': String(hidden),
    tabIndex: 0,
  };
}

/**
 * Generate ARIA live region
 */
export function getLiveRegionAriaProps(
  politeness: 'polite' | 'assertive' = 'polite'
): Record<string, any> {
  return {
    'aria-live': politeness,
    'aria-atomic': 'true',
    role: 'status',
  };
}

/**
 * Screen reader only CSS class
 */
export const srOnly = 'sr-only';

/**
 * Focus visible CSS class
 */
export const focusVisible =
  'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2';

/**
 * Keyboard navigation helper
 */
export function handleKeyboardNav(
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onEnter?.();
      break;
    case 'Escape':
      event.preventDefault();
      onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      onArrowDown?.();
      break;
  }
}

const ariautils = {
  getFormAriaProps,
  getButtonAriaProps,
  getNavAriaProps,
  getDialogAriaProps,
  getAlertAriaProps,
  getTableAriaProps,
  getTabAriaProps,
  getTabPanelAriaProps,
  getLiveRegionAriaProps,
  handleKeyboardNav,
  srOnly,
  focusVisible,
};

export default ariautils;
