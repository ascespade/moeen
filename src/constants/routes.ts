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

export const PROTECTED_ROUTES = [
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

export const ADMIN_ROUTES = [
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

export const PUBLIC_ROUTES = [
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

// RTL-aware route translations
export const ROUTE_TRANSLATIONS = {
  ar: {
    // Navigation labels
    HOME: "الرئيسية",
    LOGIN: "تسجيل الدخول",
    REGISTER: "إنشاء حساب",
    FORGOT_PASSWORD: "نسيت كلمة المرور",
    RESET_PASSWORD: "إعادة تعيين كلمة المرور",
    DASHBOARD: "لوحة التحكم",
    PROFILE: "الملف الشخصي",
    SETTINGS: "الإعدادات",
    CHANNELS: "القنوات",
    CONVERSATIONS: "المحادثات",
    NOTIFICATIONS: "الإشعارات",
    MESSAGES: "الرسائل",
    
    // Admin labels
    ADMIN: "الإدارة",
    USERS: "المستخدمون",
    LOGS: "السجلات",
    REVIEW: "المراجعة",
    FLOW: "التدفق",
    SYSTEM: "النظام",
    ANALYTICS: "التحليلات",
    SECURITY: "الأمان",
    INTEGRATIONS: "التكاملات",
    PERFORMANCE: "الأداء",
    
    // Health labels
    APPOINTMENTS: "المواعيد",
    SESSIONS: "الجلسات",
    PATIENTS: "المرضى",
    INSURANCE_CLAIMS: "مطالبات التأمين",
    MEDICAL_FILE: "الملف الطبي",
    THERAPY: "العلاج",
    TRAINING: "التدريب",
    FAMILY_SUPPORT: "دعم الأسرة",
    PROGRESS_TRACKING: "تتبع التقدم",
    
    // CRM labels
    CRM: "إدارة العملاء",
    CONTACTS: "جهات الاتصال",
    LEADS: "العملاء المحتملين",
    DEALS: "الصفقات",
    ACTIVITIES: "الأنشطة",
    FLOWS: "التدفقات",
    
    // Marketing labels
    FEATURES: "الميزات",
    PRICING: "الأسعار",
    FAQ: "الأسئلة الشائعة",
    DOCUMENTATION: "الوثائق",
    
    // Info labels
    ABOUT: "حول",
    CONTACT: "اتصل بنا",
    
    // Legal labels
    PRIVACY: "الخصوصية",
    TERMS: "الشروط",
  },
  en: {
    // Navigation labels
    HOME: "Home",
    LOGIN: "Login",
    REGISTER: "Register",
    FORGOT_PASSWORD: "Forgot Password",
    RESET_PASSWORD: "Reset Password",
    DASHBOARD: "Dashboard",
    PROFILE: "Profile",
    SETTINGS: "Settings",
    CHANNELS: "Channels",
    CONVERSATIONS: "Conversations",
    NOTIFICATIONS: "Notifications",
    MESSAGES: "Messages",
    
    // Admin labels
    ADMIN: "Admin",
    USERS: "Users",
    LOGS: "Logs",
    REVIEW: "Review",
    FLOW: "Flow",
    SYSTEM: "System",
    ANALYTICS: "Analytics",
    SECURITY: "Security",
    INTEGRATIONS: "Integrations",
    PERFORMANCE: "Performance",
    
    // Health labels
    APPOINTMENTS: "Appointments",
    SESSIONS: "Sessions",
    PATIENTS: "Patients",
    INSURANCE_CLAIMS: "Insurance Claims",
    MEDICAL_FILE: "Medical File",
    THERAPY: "Therapy",
    TRAINING: "Training",
    FAMILY_SUPPORT: "Family Support",
    PROGRESS_TRACKING: "Progress Tracking",
    
    // CRM labels
    CRM: "CRM",
    CONTACTS: "Contacts",
    LEADS: "Leads",
    DEALS: "Deals",
    ACTIVITIES: "Activities",
    FLOWS: "Flows",
    
    // Marketing labels
    FEATURES: "Features",
    PRICING: "Pricing",
    FAQ: "FAQ",
    DOCUMENTATION: "Documentation",
    
    // Info labels
    ABOUT: "About",
    CONTACT: "Contact",
    
    // Legal labels
    PRIVACY: "Privacy",
    TERMS: "Terms",
  },
} as const;
