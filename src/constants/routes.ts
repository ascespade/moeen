
// Route constants
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

  // Dashboard routes
  DASHBOARD: "/dashboard",

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
    NOTIFICATIONS: "/admin/notifications",
    MESSAGES: "/admin/messages",
    SYSTEM: "/admin/system",
    ANALYTICS: "/admin/analytics",
    SECURITY: "/admin/security",
    INTEGRATIONS: "/admin/integrations",
    PERFORMANCE: "/admin/performance",
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
    DASHBOARD: "/crm/dashboard",
    CONTACTS: "/crm/contacts",
    CONTACT: (id: string) => `/crm/contacts/${id}`,
    LEADS: "/crm/leads",
    DEALS: "/crm/deals",
    ACTIVITIES: "/crm/activities",
    FLOWS: "/crm/flows",
  },

  // Healthcare routes
  HEALTH: {
    APPOINTMENTS: "/appointments",
    SESSIONS: "/sessions",
    PATIENTS: "/patients",
    PATIENT: (id: string) => `/patients/${id}`,
    INSURANCE_CLAIMS: "/insurance-claims",
    MEDICAL_FILE: "/medical-file",
    APPROVALS: "/approvals",
    INSURANCE: "/insurance",
    THERAPY: "/therapy",
    TRAINING: "/training",
    FAMILY_SUPPORT: "/family-support",
    PROGRESS_TRACKING: "/progress-tracking",
  },

  // Marketing routes
  MARKETING: {
    FEATURES: "/features",
    PRICING: "/pricing",
    FAQ: "/faq",
    DOCUMENTATION: "/project-documentation",
  },

  // Info routes
  INFO: {
    ABOUT: "/about",
    CONTACT: "/contact",
  },

  // Legal routes
  LEGAL: {
    PRIVACY: "/privacy",
    TERMS: "/terms",
  },

  // Notifications and Messages
  NOTIFICATIONS: "/notifications",
  MESSAGES: "/messages",

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
    USER_PREFERENCES: "/api/user/preferences",
    I18N: "/api/i18n",
  },
} as const;

  ROUTES.DASHBOARD,
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.CHANNELS,
  ROUTES.ADMIN.CONVERSATIONS,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.ADMIN.LOGS,
  ROUTES.ADMIN.REVIEW,
  ROUTES.ADMIN.FLOW,
  ROUTES.ADMIN.NOTIFICATIONS,
  ROUTES.ADMIN.MESSAGES,
  ROUTES.ADMIN.SYSTEM,
  ROUTES.ADMIN.ANALYTICS,
  ROUTES.ADMIN.SECURITY,
  ROUTES.ADMIN.INTEGRATIONS,
  ROUTES.ADMIN.PERFORMANCE,
  ROUTES.USER.DASHBOARD,
  ROUTES.USER.PROFILE,
  ROUTES.USER.SETTINGS,
  ROUTES.USER.CHANNELS,
  ROUTES.USER.CONVERSATIONS,
  ROUTES.HEALTH.APPOINTMENTS,
  ROUTES.HEALTH.SESSIONS,
  ROUTES.HEALTH.PATIENTS,
  ROUTES.HEALTH.INSURANCE_CLAIMS,
  ROUTES.HEALTH.MEDICAL_FILE,
  ROUTES.HEALTH.THERAPY,
  ROUTES.HEALTH.TRAINING,
  ROUTES.HEALTH.FAMILY_SUPPORT,
  ROUTES.HEALTH.PROGRESS_TRACKING,
  ROUTES.CHATBOT.FLOWS,
  ROUTES.CHATBOT.TEMPLATES,
  ROUTES.CHATBOT.INTEGRATIONS,
  ROUTES.CHATBOT.ANALYTICS,
  ROUTES.CRM.DASHBOARD,
  ROUTES.CRM.CONTACTS,
  ROUTES.CRM.LEADS,
  ROUTES.CRM.DEALS,
  ROUTES.CRM.ACTIVITIES,
  ROUTES.CRM.FLOWS,
  ROUTES.NOTIFICATIONS,
  ROUTES.MESSAGES,
  ROUTES.SETTINGS,
] as const;

  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.CHANNELS,
  ROUTES.ADMIN.CONVERSATIONS,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.ADMIN.LOGS,
  ROUTES.ADMIN.REVIEW,
  ROUTES.ADMIN.FLOW,
  ROUTES.ADMIN.NOTIFICATIONS,
  ROUTES.ADMIN.MESSAGES,
  ROUTES.ADMIN.SYSTEM,
  ROUTES.ADMIN.ANALYTICS,
  ROUTES.ADMIN.SECURITY,
  ROUTES.ADMIN.INTEGRATIONS,
  ROUTES.ADMIN.PERFORMANCE,
] as const;

  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.MARKETING.FEATURES,
  ROUTES.MARKETING.PRICING,
  ROUTES.MARKETING.FAQ,
  ROUTES.MARKETING.DOCUMENTATION,
  ROUTES.INFO.ABOUT,
  ROUTES.INFO.CONTACT,
  ROUTES.LEGAL.PRIVACY,
  ROUTES.LEGAL.TERMS,
] as const;


// Exports
export const ROUTES = {
export const PROTECTED_ROUTES = [
export const ADMIN_ROUTES = [
export const PUBLIC_ROUTES = [