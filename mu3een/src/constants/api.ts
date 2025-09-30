// API constants
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    SEARCH: '/users/search',
  },
  
  // Channels
  CHANNELS: {
    LIST: '/channels',
    CREATE: '/channels',
    GET: (id: string) => `/channels/${id}`,
    UPDATE: (id: string) => `/channels/${id}`,
    DELETE: (id: string) => `/channels/${id}`,
    JOIN: (id: string) => `/channels/${id}/join`,
    LEAVE: (id: string) => `/channels/${id}/leave`,
    MEMBERS: (id: string) => `/channels/${id}/members`,
  },
  
  // Messages
  MESSAGES: {
    LIST: (channelId: string) => `/channels/${channelId}/messages`,
    CREATE: (channelId: string) => `/channels/${channelId}/messages`,
    GET: (id: string) => `/messages/${id}`,
    UPDATE: (id: string) => `/messages/${id}`,
    DELETE: (id: string) => `/messages/${id}`,
    SEARCH: '/messages/search',
  },
  
  // Conversations
  CONVERSATIONS: {
    LIST: '/conversations',
    GET: (id: string) => `/conversations/${id}`,
    CREATE: '/conversations',
    UPDATE: (id: string) => `/conversations/${id}`,
    DELETE: (id: string) => `/conversations/${id}`,
  },
  
  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    THEME: '/settings/theme',
    NOTIFICATIONS: '/settings/notifications',
    PRIVACY: '/settings/privacy',
  },
  
  // Webhooks
  WEBHOOKS: {
    LIST: '/webhooks',
    CREATE: '/webhooks',
    GET: (id: string) => `/webhooks/${id}`,
    UPDATE: (id: string) => `/webhooks/${id}`,
    DELETE: (id: string) => `/webhooks/${id}`,
    TEST: (id: string) => `/webhooks/${id}/test`,
  },
  
  // AI
  AI: {
    CHAT: '/ai/chat',
    COMPLETE: '/ai/complete',
    TRANSLATE: '/ai/translate',
    SUMMARIZE: '/ai/summarize',
  },
  
  // Logs
  LOGS: {
    LIST: '/logs',
    GET: (id: string) => `/logs/${id}`,
    SEARCH: '/logs/search',
    EXPORT: '/logs/export',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    CHARTS: '/dashboard/charts',
    ACTIVITY: '/dashboard/activity',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
