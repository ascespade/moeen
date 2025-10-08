// Route constants
export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CHANNELS: "/admin/channels",
    CONVERSATIONS: "/admin/conversations",
    SETTINGS: "/admin/settings",
    LOGS: "/admin/logs",
    REVIEW: "/admin/review",
    FLOW: "/admin/flow",
  },

  // User routes
  USER: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    CHANNELS: "/channels",
    CONVERSATIONS: "/conversations",
  },

  // Channel routes
  CHANNEL: {
    LIST: "/channels",
    CREATE: "/channels/create",
    VIEW: (id: string) => `/channels/${id}`,
    EDIT: (id: string) => `/channels/${id}/edit`,
    SETTINGS: (id: string) => `/channels/${id}/settings`,
  },

  // Conversation routes
  CONVERSATION: {
    LIST: "/conversations",
    VIEW: (id: string) => `/conversations/${id}`,
  },

  // Chatbot routes
  CHATBOT: {
    FLOWS: "/chatbot/flows",
    FLOW: (id: string) => `/chatbot/flows/${id}`,
    TEMPLATES: "/chatbot/templates",
    TEMPLATE: (id: string) => `/chatbot/templates/${id}`,
    INTEGRATIONS: "/chatbot/integrations",
    ANALYTICS: "/chatbot/analytics",
  },

  // CRM routes
  CRM: {
    CONTACTS: "/crm/contacts",
    CONTACT: (id: string) => `/crm/contacts/${id}`,
    LEADS: "/crm/leads",
    DEALS: "/crm/deals",
    ACTIVITIES: "/crm/activities",
  },

  // Healthcare routes
  HEALTH: {
    APPOINTMENTS: "/appointments",
    SESSIONS: "/sessions",
    PATIENTS: "/patients",
    PATIENT: (id: string) => `/patients/${id}`,
    INSURANCE_CLAIMS: "/insurance-claims",
  },

  // Settings
  SETTINGS: "/settings",

  // API routes
  API: {
    AUTH: "/api/auth",
    USERS: "/api/users",
    CHANNELS: "/api/channels",
    MESSAGES: "/api/messages",
    CONVERSATIONS: "/api/conversations",
    SETTINGS: "/api/settings",
    WEBHOOKS: "/api/webhooks",
    AI: "/api/ai",
    LOGS: "/api/logs",
  },
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.CHANNELS,
  ROUTES.ADMIN.CONVERSATIONS,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.ADMIN.LOGS,
  ROUTES.ADMIN.REVIEW,
  ROUTES.ADMIN.FLOW,
  ROUTES.USER.DASHBOARD,
  ROUTES.USER.PROFILE,
  ROUTES.USER.SETTINGS,
  ROUTES.USER.CHANNELS,
  ROUTES.USER.CONVERSATIONS,
] as const;

export const ADMIN_ROUTES = [
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.CHANNELS,
  ROUTES.ADMIN.CONVERSATIONS,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.ADMIN.LOGS,
  ROUTES.ADMIN.REVIEW,
  ROUTES.ADMIN.FLOW,
] as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;
