
/**
 * Accessibility Utility Functions
 */

export function getAriaLabel(text: string): string {
  return text;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function announceToScreenReader(message: string): void {
  // Implementation for screen reader announcements
  if (typeof window !== 'undefined') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
}
