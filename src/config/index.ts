/**
 * Centralized Configuration Exports
 * Single entry point for all configuration files
 */

// Re-export all configuration modules
export * from './app';
export * from './env';
export * from './api';
export * from './auth';
export * from './database';

// Default exports with aliases for easy access
export { default as appConfig } from './app';
export { env as envConfig } from './env';
export { default as apiConfig } from './api';
export { default as authConfig } from './auth';
export { default as databaseConfig } from './database';

// Consolidated config object for convenience
export const config = {
  app: {
    name: 'مركز الهمم',
    version: '1.0.0',
    description: 'منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    retries: 3,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    expiresIn: '7d',
    refreshExpiresIn: '30d',
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
  },
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: 10,
    ssl: process.env.NODE_ENV === 'production',
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const;

// Configuration validation helper
export const validateConfig = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'AUTH_SECRET'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  console.log('Configuration loaded successfully');
  return missingVars.length === 0;
};

// Export types for TypeScript support
export type Config = typeof config;
export type AppConfig = typeof config.app;
export type ApiConfig = typeof config.api;
export type AuthConfig = typeof config.auth;
export type DatabaseConfig = typeof config.database;
