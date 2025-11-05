/**
 * API Endpoints - Centralized API Routes
 * نقاط نهاية API - مسارات API المركزية
 * 
 * All API endpoints defined here
 */

const API_BASE = '/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    REFRESH: `${API_BASE}/auth/refresh`,
    VERIFY_EMAIL: `${API_BASE}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  },

  // Users
  USERS: {
    BASE: `${API_BASE}/users`,
    LIST: `${API_BASE}/users`,
    GET: (id: string) => `${API_BASE}/users/${id}`,
    CREATE: `${API_BASE}/users`,
    UPDATE: (id: string) => `${API_BASE}/users/${id}`,
    DELETE: (id: string) => `${API_BASE}/users/${id}`,
    PROFILE: `${API_BASE}/users/profile`,
  },

  // Patients
  PATIENTS: {
    BASE: `${API_BASE}/patients`,
    LIST: `${API_BASE}/patients`,
    GET: (id: string) => `${API_BASE}/patients/${id}`,
    CREATE: `${API_BASE}/patients`,
    UPDATE: (id: string) => `${API_BASE}/patients/${id}`,
    DELETE: (id: string) => `${API_BASE}/patients/${id}`,
    SESSIONS: (id: string) => `${API_BASE}/patients/${id}/sessions`,
  },

  // Doctors
  DOCTORS: {
    BASE: `${API_BASE}/doctors`,
    LIST: `${API_BASE}/doctors`,
    GET: (id: string) => `${API_BASE}/doctors/${id}`,
    CREATE: `${API_BASE}/doctors`,
    UPDATE: (id: string) => `${API_BASE}/doctors/${id}`,
    DELETE: (id: string) => `${API_BASE}/doctors/${id}`,
  },

  // Appointments
  APPOINTMENTS: {
    BASE: `${API_BASE}/appointments`,
    LIST: `${API_BASE}/appointments`,
    GET: (id: string) => `${API_BASE}/appointments/${id}`,
    CREATE: `${API_BASE}/appointments`,
    UPDATE: (id: string) => `${API_BASE}/appointments/${id}`,
    DELETE: (id: string) => `${API_BASE}/appointments/${id}`,
    BOOK: `${API_BASE}/appointments/book`,
  },

  // Admin
  ADMIN: {
    BASE: `${API_BASE}/admin`,
    CRM_DATA: `${API_BASE}/admin/crm-data`,
    ANALYTICS: `${API_BASE}/admin/analytics`,
    USERS: `${API_BASE}/admin/users`,
    SECURITY: `${API_BASE}/admin/security`,
    PERFORMANCE: `${API_BASE}/admin/performance`,
    NOTIFICATIONS: `${API_BASE}/admin/notifications`,
  },

  // Dynamic Data
  DYNAMIC_DATA: {
    BASE: `${API_BASE}/dynamic-data`,
    SERVICES: `${API_BASE}/dynamic-data?type=services`,
    STATS: `${API_BASE}/dynamic-data?type=stats`,
    DOCTORS: `${API_BASE}/dynamic-data?type=doctors`,
    CONTACT_INFO: `${API_BASE}/dynamic-data?type=contact-info`,
  },

  // Insurance
  INSURANCE: {
    BASE: `${API_BASE}/insurance`,
    CLAIMS: `${API_BASE}/insurance/claims`,
    CLAIM: (id: string) => `${API_BASE}/insurance/claims/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: `${API_BASE}/notifications`,
    SEND: `${API_BASE}/notifications/send`,
    LIST: `${API_BASE}/notifications`,
    MARK_READ: (id: string) => `${API_BASE}/notifications/${id}/read`,
  },
} as const;

// Helper function to build endpoint
export function buildEndpoint(
  base: string,
  ...segments: (string | number)[]
): string {
  return [base, ...segments.map(String)].join('/');
}

// Type exports
export type APIEndpointKey = keyof typeof API_ENDPOINTS;
