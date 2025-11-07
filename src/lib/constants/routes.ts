/**
 * Route Constants - Centralized Routes
 * ثوابت المسارات - المسارات المركزية
 *
 * All application routes defined here
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRICING: '/pricing',
  FEATURES: '/features',

  // Authentication Routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
  },

  // Dashboard Routes
  DASHBOARD: '/dashboard',

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/admin-dashboard',
    USERS: '/admin/users',
    DOCTORS: '/admin/doctors',
    PATIENTS: '/admin/patients',
    APPOINTMENTS: '/admin/appointments',
    CRM: '/admin/crm',
    CRM_CONTACTS: '/admin/crm/contacts',
    ANALYTICS: '/admin/analytics',
    SECURITY: '/admin/security',
    PERFORMANCE: '/admin/performance',
    NOTIFICATIONS: '/admin/notifications',
    MESSAGES: '/admin/messages',
    CONVERSATIONS: '/admin/conversations',
    INTEGRATIONS: '/admin/integrations',
    SETTINGS: '/admin/settings',
    CHATBOT: '/admin/chatbot',
    AUDIT_LOGS: '/admin/admin/audit-logs',
    REVIEW: '/admin/review',
    FLOW: '/admin/flow',
    SYSTEM: '/admin/system',
  },

  // Health Routes
  HEALTH: {
    DASHBOARD: '/health',
    PATIENTS: '/health/patients',
    PATIENT_DETAILS: (id: string) => `/health/patients/${id}`,
    SESSIONS: '/health/sessions',
    SESSIONS_BOOK: '/health/sessions/book',
    INSURANCE: '/health/insurance',
    INSURANCE_CLAIMS: '/health/insurance-claims',
    MEDICAL_FILE: '/health/medical-file',
    PROGRESS: '/health/progress',
    PROGRESS_TRACKING: '/health/progress-tracking',
    THERAPY: '/health/therapy',
    TRAINING: '/health/training',
    APPROVALS: '/health/approvals',
    FAMILY: '/health/family',
    FAMILY_SUPPORT: '/health/family-support',
  },

  // User Routes
  USER: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },

  // Doctor Routes
  DOCTOR: {
    DASHBOARD: '/doctor/doctor-dashboard',
  },

  // Patient Routes
  PATIENT: {
    DASHBOARD: '/patient/patient-dashboard',
  },

  // API Routes
  API: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    PATIENTS: '/api/patients',
    DOCTORS: '/api/doctors',
    APPOINTMENTS: '/api/appointments',
    ADMIN: '/api/admin',
    DYNAMIC_DATA: '/api/dynamic-data',
  },
} as const;

// Helper function to get route
export function getRoute(path: string): string {
  return path;
}

// Type exports
export type RouteKey = keyof typeof ROUTES;
