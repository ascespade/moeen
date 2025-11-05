/**
 * Query Keys - React Query Keys
 * مفاتيح الاستعلام - مفاتيح React Query
 * 
 * Centralized query keys for React Query / SWR
 */

export const QUERY_KEYS = {
  // Users
  USERS: 'users',
  USER: (id: string) => ['users', id],
  USER_PROFILE: 'user-profile',

  // Patients
  PATIENTS: 'patients',
  PATIENT: (id: string) => ['patients', id],
  PATIENT_SESSIONS: (id: string) => ['patients', id, 'sessions'],

  // Doctors
  DOCTORS: 'doctors',
  DOCTOR: (id: string) => ['doctors', id],

  // Appointments
  APPOINTMENTS: 'appointments',
  APPOINTMENT: (id: string) => ['appointments', id],
  APPOINTMENTS_BY_DATE: (date: string) => ['appointments', 'date', date],

  // Admin
  ADMIN_STATS: 'admin-stats',
  ADMIN_ANALYTICS: 'admin-analytics',
  ADMIN_USERS: 'admin-users',

  // CRM
  CRM_CONTACTS: 'crm-contacts',
  CRM_CONTACT: (id: string) => ['crm-contacts', id],
  CRM_LEADS: 'crm-leads',
  CRM_DEALS: 'crm-deals',

  // Insurance
  INSURANCE_CLAIMS: 'insurance-claims',
  INSURANCE_CLAIM: (id: string) => ['insurance-claims', id],

  // Notifications
  NOTIFICATIONS: 'notifications',
  NOTIFICATION: (id: string) => ['notifications', id],

  // Dynamic Data
  DYNAMIC_SERVICES: 'dynamic-services',
  DYNAMIC_STATS: 'dynamic-stats',
  DYNAMIC_DOCTORS: 'dynamic-doctors',
  DYNAMIC_CONTACT_INFO: 'dynamic-contact-info',
} as const;

// Helper function to build query key
export function buildQueryKey(
  base: string,
  ...segments: (string | number)[]
): string[] {
  return [base, ...segments.map(String)];
}
