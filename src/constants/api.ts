// API constants
export const __API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (_id: string) => `/users/${id}`,
    UPDATE: (_id: string) => `/users/${id}`,
    DELETE: (_id: string) => `/users/${id}`,
    SEARCH: "/users/search",
  },

  // Channels
  CHANNELS: {
    LIST: "/channels",
    CREATE: "/channels",
    GET: (_id: string) => `/channels/${id}`,
    UPDATE: (_id: string) => `/channels/${id}`,
    DELETE: (_id: string) => `/channels/${id}`,
    JOIN: (_id: string) => `/channels/${id}/join`,
    LEAVE: (_id: string) => `/channels/${id}/leave`,
    MEMBERS: (_id: string) => `/channels/${id}/members`,
  },

  // Messages
  MESSAGES: {
    LIST: (_channelId: string) => `/channels/${channelId}/messages`,
    CREATE: (_channelId: string) => `/channels/${channelId}/messages`,
    GET: (_id: string) => `/messages/${id}`,
    UPDATE: (_id: string) => `/messages/${id}`,
    DELETE: (_id: string) => `/messages/${id}`,
    SEARCH: "/messages/search",
  },

  // Conversations
  CONVERSATIONS: {
    LIST: "/conversations",
    GET: (_id: string) => `/conversations/${id}`,
    CREATE: "/conversations",
    UPDATE: (_id: string) => `/conversations/${id}`,
    DELETE: (_id: string) => `/conversations/${id}`,
  },

  // Settings
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
    THEME: "/settings/theme",
    NOTIFICATIONS: "/settings/notifications",
    PRIVACY: "/settings/privacy",
  },

  // Webhooks
  WEBHOOKS: {
    LIST: "/webhooks",
    CREATE: "/webhooks",
    GET: (_id: string) => `/webhooks/${id}`,
    UPDATE: (_id: string) => `/webhooks/${id}`,
    DELETE: (_id: string) => `/webhooks/${id}`,
    TEST: (_id: string) => `/webhooks/${id}/test`,
  },

  // AI
  AI: {
    CHAT: "/ai/chat",
    COMPLETE: "/ai/complete",
    TRANSLATE: "/ai/translate",
    SUMMARIZE: "/ai/summarize",
  },

  // Logs
  LOGS: {
    LIST: "/logs",
    GET: (_id: string) => `/logs/${id}`,
    SEARCH: "/logs/search",
    EXPORT: "/logs/export",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    CHARTS: "/dashboard/charts",
    ACTIVITY: "/dashboard/activity",
  },
} as const;

export const __HTTP_STATUS = {
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

export const __API_TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
  LONG_RUNNING: 120000,
} as const;

export const __PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
