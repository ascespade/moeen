// Storage constants
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',

  // User preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  TIMEZONE: 'timezone',

  // App settings
  SETTINGS: 'app_settings',
  NOTIFICATIONS: 'notification_settings',
  PRIVACY: 'privacy_settings',

  // UI state
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  TABLE_PREFERENCES: 'table_preferences',

  // Recent data
  RECENT_CHANNELS: 'recent_channels',
  RECENT_CONVERSATIONS: 'recent_conversations',
  RECENT_SEARCHES: 'recent_searches',

  // Draft data
  DRAFT_MESSAGES: 'draft_messages',
  DRAFT_FORMS: 'draft_forms',

  // Cache
  CACHE_PREFIX: 'cache_',
  CACHE_TIMESTAMP: 'cache_timestamp',

  // Temporary data
  TEMP_PREFIX: 'temp_',
  UPLOAD_PROGRESS: 'upload_progress',
} as const;

export const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  INDEXED_DB: 'indexedDB',
} as const;

export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 2 * 60 * 60 * 1000, // 2 hours
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const STORAGE_QUOTAS = {
  LOCAL_STORAGE: 5 * 1024 * 1024, // 5MB
  SESSION_STORAGE: 5 * 1024 * 1024, // 5MB
  INDEXED_DB: 50 * 1024 * 1024, // 50MB
} as const;
