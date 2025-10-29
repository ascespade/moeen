/**
 * Core Constants - الثوابت الأساسية
 * Centralized application constants
 */

// Import canonical roles from the single source of truth
import { USER_ROLES as CANONICAL_ROLES } from '@/constants/roles';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication - Enhanced from constants/api.ts merge
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // Users - Enhanced from constants/api.ts merge  
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    SEARCH: '/api/users/search',
  },

  // Patients
  PATIENTS: {
    LIST: '/api/patients',
    CREATE: '/api/patients',
    GET: (id: string) => `/api/patients/${id}`,
    UPDATE: (id: string) => `/api/patients/${id}`,
    DELETE: (id: string) => `/api/patients/${id}`,
    ACTIVATE: (id: string) => `/api/patients/${id}/activate`,
  },

  // Doctors
  DOCTORS: {
    LIST: '/api/doctors',
    CREATE: '/api/doctors',
    GET: (id: string) => `/api/doctors/${id}`,
    UPDATE: (id: string) => `/api/doctors/${id}`,
    DELETE: (id: string) => `/api/doctors/${id}`,
    AVAILABILITY: '/api/doctors/availability',
  },

  // Appointments
  APPOINTMENTS: {
    LIST: '/api/appointments',
    CREATE: '/api/appointments',
    GET: (id: string) => `/api/appointments/${id}`,
    UPDATE: (id: string) => `/api/appointments/${id}`,
    DELETE: (id: string) => `/api/appointments/${id}`,
  },

  // Payments
  PAYMENTS: {
    LIST: '/api/payments',
    CREATE: '/api/payments',
    GET: (id: string) => `/api/payments/${id}`,
    UPDATE: (id: string) => `/api/payments/${id}`,
    PROCESS: '/api/payments/process',
  },

  // Insurance
  INSURANCE: {
    CLAIMS: '/api/insurance/claims',
    CLAIM: (id: string) => `/api/insurance/claims/${id}`,
    SUBMIT: (id: string) => `/api/insurance/claims/${id}/submit`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    SEND: '/api/notifications/send',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  },

  // Reports
  REPORTS: {
    DASHBOARD_METRICS: '/api/reports/dashboard-metrics',
    PATIENTS: '/api/reports/patients',
    APPOINTMENTS: '/api/reports/appointments',
    PAYMENTS: '/api/reports/payments',
  },

  // Channels - Added from constants/api.ts merge
  CHANNELS: {
    LIST: '/api/channels',
    CREATE: '/api/channels',
    GET: (id: string) => `/api/channels/${id}`,
    UPDATE: (id: string) => `/api/channels/${id}`,
    DELETE: (id: string) => `/api/channels/${id}`,
    JOIN: (id: string) => `/api/channels/${id}/join`,
    LEAVE: (id: string) => `/api/channels/${id}/leave`,
    MEMBERS: (id: string) => `/api/channels/${id}/members`,
  },

  // Messages - Added from constants/api.ts merge
  MESSAGES: {
    LIST: (channelId: string) => `/api/channels/${channelId}/messages`,
    CREATE: (channelId: string) => `/api/channels/${channelId}/messages`,
    GET: (id: string) => `/api/messages/${id}`,
    UPDATE: (id: string) => `/api/messages/${id}`,
    DELETE: (id: string) => `/api/messages/${id}`,
    SEARCH: '/api/messages/search',
  },

  // Conversations - Added from constants/api.ts merge
  CONVERSATIONS: {
    LIST: '/api/conversations',
    GET: (id: string) => `/api/conversations/${id}`,
    CREATE: '/api/conversations',
    UPDATE: (id: string) => `/api/conversations/${id}`,
    DELETE: (id: string) => `/api/conversations/${id}`,
  },

  // Settings - Enhanced from constants/api.ts merge
  SETTINGS: {
    GET: '/api/settings',
    UPDATE: '/api/settings',
    THEME: '/api/settings/theme',
    NOTIFICATIONS: '/api/settings/notifications',
    PRIVACY: '/api/settings/privacy',
  },

  // Webhooks - Added from constants/api.ts merge
  WEBHOOKS: {
    LIST: '/api/webhooks',
    CREATE: '/api/webhooks',
    GET: (id: string) => `/api/webhooks/${id}`,
    UPDATE: (id: string) => `/api/webhooks/${id}`,
    DELETE: (id: string) => `/api/webhooks/${id}`,
    TEST: (id: string) => `/api/webhooks/${id}/test`,
  },

  // AI - Added from constants/api.ts merge
  AI: {
    CHAT: '/api/ai/chat',
    COMPLETE: '/api/ai/complete',
    TRANSLATE: '/api/ai/translate',
    SUMMARIZE: '/api/ai/summarize',
  },

  // Logs - Added from constants/api.ts merge
  LOGS: {
    LIST: '/api/logs',
    GET: (id: string) => `/api/logs/${id}`,
    SEARCH: '/api/logs/search',
    EXPORT: '/api/logs/export',
  },

  // Dashboard - Added from constants/api.ts merge
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    CHARTS: '/api/dashboard/charts',
    ACTIVITY: '/api/dashboard/activity',
  },

  // File Upload
  UPLOAD: {
    FILE: '/api/upload',
    MEDICAL_RECORDS: '/api/medical-records',
  },
} as const;

// User Roles - Re-export from canonical source for backward compatibility
// All new code should import directly from @/constants/roles
export const USER_ROLES = CANONICAL_ROLES;

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  INSURANCE: 'insurance',
  WALLET: 'wallet',
} as const;

// Insurance Providers
export const INSURANCE_PROVIDERS = {
  SEHA: 'SEHA',
  SHOON: 'SHOON',
  TATMAN: 'TATMAN',
} as const;

// Claim Status
export const CLAIM_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  INSURANCE_UPDATE: 'insurance_update',
  SYSTEM_ALERT: 'system_alert',
} as const;

// Notification Channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app',
} as const;

// File Types
export const FILE_TYPES = {
  MEDICAL_RECORD: 'medical_record',
  INSURANCE_CLAIM: 'insurance_claim',
  PROFILE: 'profile',
  OTHER: 'other',
} as const;

// Allowed File Extensions
export const ALLOWED_FILE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
] as const;

// MIME Types
export const MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'text/plain': '.txt',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  APPOINTMENT_DURATION: 30, // minutes
  REMINDER_TIME: 24, // hours before appointment
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
  RATE_LIMIT_WINDOW: 900000, // 15 minutes in milliseconds
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 9,
  MEDICAL_RECORD_LENGTH: 10,
  LICENSE_NUMBER_LENGTH: 8,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'تم الإنشاء بنجاح',
  UPDATED: 'تم التحديث بنجاح',
  DELETED: 'تم الحذف بنجاح',
  SAVED: 'تم الحفظ بنجاح',
  SENT: 'تم الإرسال بنجاح',
  UPLOADED: 'تم الرفع بنجاح',
  LOGGED_IN: 'تم تسجيل الدخول بنجاح',
  LOGGED_OUT: 'تم تسجيل الخروج بنجاح',
  ACTIVATED: 'تم التفعيل بنجاح',
  CONFIRMED: 'تم التأكيد بنجاح',
  CANCELLED: 'تم الإلغاء بنجاح',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'هذا الحقل مطلوب',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  INVALID_PHONE: 'رقم الهاتف غير صحيح',
  INVALID_PASSWORD: 'كلمة المرور غير صحيحة',
  UNAUTHORIZED: 'غير مصرح لك بالوصول',
  FORBIDDEN: 'ممنوع الوصول',
  NOT_FOUND: 'العنصر المطلوب غير موجود',
  CONFLICT: 'يوجد تعارض في البيانات',
  INTERNAL_ERROR: 'حدث خطأ داخلي في الخادم',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  TIMEOUT: 'انتهت مهلة الطلب',
  VALIDATION_FAILED: 'فشل في التحقق من البيانات',
  INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',
  FILE_TOO_LARGE: 'حجم الملف كبير جداً',
  APPOINTMENT_CONFLICT: 'يوجد موعد آخر في نفس الوقت',
  DOCTOR_UNAVAILABLE: 'الطبيب غير متاح في هذا الوقت',
  PATIENT_NOT_ACTIVATED: 'المريض غير مفعل',
  INSUFFICIENT_PERMISSIONS: 'صلاحيات غير كافية',
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+966|0)?[5-9][0-9]{8}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  MEDICAL_RECORD: /^MR[0-9]{8}$/,
  LICENSE_NUMBER: /^[A-Z]{2}[0-9]{6}$/,
  URL: /^https?:\/\/.+/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
  CART: 'cart',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  USERS: 'users',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  PAYMENTS: 'payments',
  INSURANCE_CLAIMS: 'insurance_claims',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  DASHBOARD_METRICS: 'dashboard_metrics',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  CHATBOT_ENABLED: 'chatbot_enabled',
  PAYMENT_ENABLED: 'payment_enabled',
  INSURANCE_ENABLED: 'insurance_enabled',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  ANALYTICS_ENABLED: 'analytics_enabled',
  MAINTENANCE_MODE: 'maintenance_mode',
} as const;
