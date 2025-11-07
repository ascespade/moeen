/**
 * Environment Configuration - إعدادات البيئة
 *
 * Centralized environment variables with validation
 */

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
}

/**
 * Get boolean environment variable
 */
function getBoolEnv(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  if (!value) return defaultValue!;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }
  return parsed;
}

// Environment
export const env = {
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // App
  APP_URL: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  APP_NAME: getEnv('NEXT_PUBLIC_APP_NAME', 'مُعين'),

  // Supabase
  SUPABASE_URL: getEnv('NEXT_PUBLIC_SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY', ''),

  // Database
  DATABASE_URL: getEnv('DATABASE_URL', ''),

  // Auth
  JWT_SECRET: getEnv('JWT_SECRET', ''),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  SESSION_SECRET: getEnv('SESSION_SECRET', ''),

  // API Keys
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY', ''),
  STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY', ''),
  STRIPE_PUBLISHABLE_KEY: getEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', ''),
  TWILIO_ACCOUNT_SID: getEnv('TWILIO_ACCOUNT_SID', ''),
  TWILIO_AUTH_TOKEN: getEnv('TWILIO_AUTH_TOKEN', ''),

  // Email
  SMTP_HOST: getEnv('SMTP_HOST', ''),
  SMTP_PORT: getNumberEnv('SMTP_PORT', 587),
  SMTP_USER: getEnv('SMTP_USER', ''),
  SMTP_PASSWORD: getEnv('SMTP_PASSWORD', ''),

  // Features
  ENABLE_CHATBOT: getBoolEnv('ENABLE_CHATBOT', true),
  ENABLE_NOTIFICATIONS: getBoolEnv('ENABLE_NOTIFICATIONS', true),
  ENABLE_ANALYTICS: getBoolEnv('ENABLE_ANALYTICS', true),

  // Rate Limiting
  RATE_LIMIT_MAX: getNumberEnv('RATE_LIMIT_MAX', 100),
  RATE_LIMIT_WINDOW: getNumberEnv('RATE_LIMIT_WINDOW', 15 * 60 * 1000), // 15 minutes
} as const;
