// Environment configuration
export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Mu3een',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // API
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Authentication
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',

  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,

  // File Storage
  UPLOAD_MAX_SIZE: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB
  UPLOAD_ALLOWED_TYPES: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
  ],

  // Redis
  REDIS_URL: process.env.REDIS_URL,

  // Webhooks
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,

  // AI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',

  // Analytics
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',

  // Development
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// Validate required environment variables
export const validateEnv = () => {
  const requiredVars = [
    'JWT_SECRET',
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Environment-specific configurations
export const getConfig = () => {
  const baseConfig = {
    app: {
      name: env.APP_NAME,
      version: env.APP_VERSION,
      url: env.APP_URL,
    },
    api: {
      url: env.API_URL,
      timeout: env.API_TIMEOUT,
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
      refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    },
    upload: {
      maxSize: env.UPLOAD_MAX_SIZE,
      allowedTypes: env.UPLOAD_ALLOWED_TYPES,
    },
    features: {
      analytics: env.ENABLE_ANALYTICS,
      debug: env.ENABLE_DEBUG,
      ai: env.ENABLE_AI,
    },
  };

  if (env.IS_DEVELOPMENT) {
    return {
      ...baseConfig,
      debug: true,
      logging: 'debug',
    };
  }

  if (env.IS_PRODUCTION) {
    return {
      ...baseConfig,
      debug: false,
      logging: 'error',
    };
  }

  return baseConfig;
};
