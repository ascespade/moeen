/**
 * Application routes constants
 */

export const __ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "/404",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  DOCTOR_DASHBOARD: "/doctor/dashboard",
  THERAPIST_DASHBOARD: "/therapist/dashboard",
  PATIENT_DASHBOARD: "/patient/dashboard",
  FAMILY_DASHBOARD: "/family/dashboard",

  // Patient management
  PATIENTS: "/patients",
  PATIENT_DETAILS: "/patients/[id]",
  PATIENT_EDIT: "/patients/[id]/edit",
  PATIENT_CREATE: "/patients/create",

  // Appointment management
  APPOINTMENTS: "/appointments",
  APPOINTMENT_DETAILS: "/appointments/[id]",
  APPOINTMENT_EDIT: "/appointments/[id]/edit",
  APPOINTMENT_CREATE: "/appointments/create",

  // Session management
  SESSIONS: "/sessions",
  SESSION_DETAILS: "/sessions/[id]",
  SESSION_EDIT: "/sessions/[id]/edit",
  SESSION_CREATE: "/sessions/create",

  // Medical records
  MEDICAL_RECORDS: "/medical-records",
  MEDICAL_RECORD_DETAILS: "/medical-records/[id]",
  MEDICAL_RECORD_EDIT: "/medical-records/[id]/edit",
  MEDICAL_RECORD_CREATE: "/medical-records/create",

  // Reports
  REPORTS: "/reports",
  REPORT_DETAILS: "/reports/[id]",
  REPORT_CREATE: "/reports/create",

  // Admin routes
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_ANALYTICS: "/admin/analytics",

  // Profile
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_SETTINGS: "/profile/settings",

  // Settings
  SETTINGS: "/settings",
  NOTIFICATIONS: "/settings/notifications",
  PREFERENCES: "/settings/preferences",

  // API routes
  API: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
    },
    PATIENTS: {
      LIST: "/api/patients",
      CREATE: "/api/patients",
      GET: "/api/patients/[id]",
      UPDATE: "/api/patients/[id]",
      DELETE: "/api/patients/[id]",
    },
    APPOINTMENTS: {
      LIST: "/api/appointments",
      CREATE: "/api/appointments",
      GET: "/api/appointments/[id]",
      UPDATE: "/api/appointments/[id]",
      DELETE: "/api/appointments/[id]",
    },
    SESSIONS: {
      LIST: "/api/sessions",
      CREATE: "/api/sessions",
      GET: "/api/sessions/[id]",
      UPDATE: "/api/sessions/[id]",
      DELETE: "/api/sessions/[id]",
    },
    MEDICAL_RECORDS: {
      LIST: "/api/medical-records",
      CREATE: "/api/medical-records",
      GET: "/api/medical-records/[id]",
      UPDATE: "/api/medical-records/[id]",
      DELETE: "/api/medical-records/[id]",
    },
    REPORTS: {
      LIST: "/api/reports",
      CREATE: "/api/reports",
      GET: "/api/reports/[id]",
      UPDATE: "/api/reports/[id]",
      DELETE: "/api/reports/[id]",
    },
    HEALTH: "/api/health",
    ANALYTICS: "/api/analytics",
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type ApiRouteKey = keyof typeof ROUTES.API;
