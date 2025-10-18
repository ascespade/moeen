
/**
 * Core Configuration - التكوين الأساسي للنظام
 * Centralized configuration management
 */
import { SystemConfig } from '../types';
// Environment Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;
// Database Configuration
  URL: process.env.DATABASE_URL || '',
  MAX_CONNECTIONS: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
  QUERY_TIMEOUT: parseInt(process.env.DB_QUERY_TIMEOUT || '10000'),
} as const;
// Supabase Configuration
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME || 'medical-documents',
} as const;
// API Configuration
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000'),
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  CORS: {
    ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    CREDENTIALS: true,
  },
} as const;
// Authentication Configuration
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT || '3600000'), // 1 hour
  PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
  LOCKOUT_DURATION: parseInt(process.env.LOCKOUT_DURATION || '900000'), // 15 minutes
} as const;
// Payment Configuration
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    CURRENCY: process.env.STRIPE_CURRENCY || 'SAR',
  },
  MOYASAR: {
    SECRET_KEY: process.env.MOYASAR_SECRET_KEY || '',
    PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || '',
    WEBHOOK_SECRET: process.env.MOYASAR_WEBHOOK_SECRET || '',
  },
  DEFAULT_CURRENCY: 'SAR',
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 100000,
} as const;
// Insurance Configuration
  PROVIDERS: {
    SEHA: {
      API_URL: process.env.SEHA_API_URL || '',
      API_KEY: process.env.SEHA_API_KEY || '',
      ENABLED: process.env.SEHA_ENABLED === 'true',
    },
    SHOON: {
      API_URL: process.env.SHOON_API_URL || '',
      API_KEY: process.env.SHOON_API_KEY || '',
      ENABLED: process.env.SHOON_ENABLED === 'true',
    },
    TATMAN: {
      API_URL: process.env.TATMAN_API_URL || '',
      API_KEY: process.env.TATMAN_API_KEY || '',
      ENABLED: process.env.TATMAN_ENABLED === 'true',
    },
  },
  CLAIM_TIMEOUT: parseInt(process.env.INSURANCE_CLAIM_TIMEOUT || '86400000'), // 24 hours
  RETRY_ATTEMPTS: parseInt(process.env.INSURANCE_RETRY_ATTEMPTS || '3'),
} as const;
// Notification Configuration
  EMAIL: {
    PROVIDER: process.env.EMAIL_PROVIDER || 'smtp',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@alhemamcenter.com',
    FROM_NAME: process.env.FROM_NAME || 'مركز الحمام',
  },
  SMS: {
    PROVIDER: process.env.SMS_PROVIDER || 'twilio',
    API_KEY: process.env.SMS_API_KEY || '',
    API_URL: process.env.SMS_API_URL || '',
    FROM_NUMBER: process.env.SMS_FROM_NUMBER || '',
  },
  PUSH: {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || '',
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || '',
    VAPID_SUBJECT: process.env.VAPID_SUBJECT || 'mailto:admin@alhemamcenter.com',
  },
  BATCH_SIZE: parseInt(process.env.NOTIFICATION_BATCH_SIZE || '100'),
  RETRY_ATTEMPTS: parseInt(process.env.NOTIFICATION_RETRY_ATTEMPTS || '3'),
} as const;
// File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  STORAGE_PATH: process.env.UPLOAD_STORAGE_PATH || 'uploads',
  CDN_URL: process.env.CDN_URL || '',
} as const;
// Security Configuration
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
  HASH_ROUNDS: parseInt(process.env.HASH_ROUNDS || '12'),
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  RATE_LIMITING: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  },
} as const;
// Application Configuration
  NAME: 'مركز الحمام الطبي',
  VERSION: '1.0.0',
  DESCRIPTION: 'منصة طبية متكاملة لإدارة المرضى والمواعيد',
  SUPPORT_EMAIL: 'support@alhemamcenter.com',
  SUPPORT_PHONE: '+966501234567',
  WEBSITE: 'https://alhemamcenter.com',
  TIMEZONE: 'Asia/Riyadh',
  LOCALE: 'ar-SA',
  CURRENCY: 'SAR',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
} as const;
// Default System Configuration
  {
    id: 'app-name',
    key: 'app_name',
    value: APP_CONFIG.NAME,
    category: 'general',
    description: 'اسم التطبيق',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'app-version',
    key: 'app_version',
    value: APP_CONFIG.VERSION,
    category: 'general',
    description: 'إصدار التطبيق',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'maintenance-mode',
    key: 'maintenance_mode',
    value: false,
    category: 'system',
    description: 'وضع الصيانة',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'max-appointment-duration',
    key: 'max_appointment_duration',
    value: 120,
    category: 'appointments',
    description: 'أقصى مدة للمواعيد (بالدقائق)',
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'appointment-reminder-time',
    key: 'appointment_reminder_time',
    value: 24,
    category: 'notifications',
    description: 'وقت تذكير المواعيد (بالساعات)',
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
// Exports
export const ENV = {
export const DATABASE_CONFIG = {
export const SUPABASE_CONFIG = {
export const API_CONFIG = {
export const AUTH_CONFIG = {
export const PAYMENT_CONFIG = {
export const INSURANCE_CONFIG = {
export const NOTIFICATION_CONFIG = {
export const UPLOAD_CONFIG = {
export const SECURITY_CONFIG = {
export const APP_CONFIG = {
export const DEFAULT_SYSTEM_CONFIG: SystemConfig[] = [