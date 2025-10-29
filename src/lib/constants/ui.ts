/**
 * UI Constants
 * Centralized constants for UI components
 */

export const UI_CONSTANTS = {
  // Component sizes
  AVATAR: {
    SMALL: 32,
    MEDIUM: 40,
    LARGE: 50,
    XLARGE: 64,
  },

  // Icon sizes
  ICON: {
    SMALL: 16,
    MEDIUM: 20,
    LARGE: 24,
    XLARGE: 32,
  },

  // Animation durations (ms)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },

  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: '#',
  TWITTER: '#',
  INSTAGRAM: '#',
  LINKEDIN: '#',
} as const;

export const CONTACT_INFO = {
  PHONE: '0126173693',
  MOBILE: '0555381558',
  EMAIL: 'info@alhemam.sa',
  ADDRESS: 'جدة، شارع الأمير محمد بن عبدالعزيز (التحلية)، فندق دبليو إيه، الدور الثامن، حي الصفا',
} as const;

