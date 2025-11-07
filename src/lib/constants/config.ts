/**
 * Config Constants - Application Configuration
 * ثوابت الإعدادات - إعدادات التطبيق
 *
 * Application-wide configuration constants
 */

export const CONFIG = {
  // App Info
  APP_NAME: 'مُعين',
  APP_NAME_EN: 'Mu3een',
  APP_DESCRIPTION: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة',

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Cache
  CACHE_DURATION: 60 * 1000, // 1 minute
  LONG_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // API
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,

  // Validation
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,

  // Dates
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIME_FORMAT: 'HH:mm',

  // UI
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,

  // Features
  FEATURES: {
    ENABLE_CHATBOT: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: true,
    ENABLE_CRM: true,
    ENABLE_INSURANCE: true,
  },
} as const;

// Type exports
export type ConfigKey = keyof typeof CONFIG;
