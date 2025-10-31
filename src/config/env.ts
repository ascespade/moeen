import { z } from 'zod';

// Zod schema for environment variable validation
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Mu3een'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // API
  NEXT_PUBLIC_API_URL: z.string().default('/api'),
  NEXT_PUBLIC_API_TIMEOUT: z.string().regex(/^\d+$/).transform(Number).default('10000'),

  // Database - Required (DATABASE_URL optional if using Supabase directly)
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  
  // Authentication - Required (with default in dev)
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters').optional().default('dev-secret-change-in-production-minimum-32-chars-long-for-security'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  // OAuth - Optional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),

  // Email - Optional
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number).default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // File Storage
  UPLOAD_MAX_SIZE: z.string().regex(/^\d+$/).transform(Number).default('10485760'),
  UPLOAD_ALLOWED_TYPES: z.string().optional(),

  // Redis - Optional
  REDIS_URL: z.string().url().optional(),

  // Webhooks - Optional
  WEBHOOK_SECRET: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  MOYASAR_SECRET_KEY: z.string().optional(),
  ADMIN_INTERNAL_SECRET: z.string().optional(),
  TEST_USERS_PASSWORD: z.string().optional(),

  // AI - Optional
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-3.5-turbo'),

  // Analytics - Optional
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_DEBUG: z.string().transform(val => val === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_AI: z.string().transform(val => val === 'true').default('false'),
});

// Parse and validate environment variables
function parseEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingRequired = error.errors
        .filter(e => e.code === 'too_small' || (e.code === 'invalid_string' && e.message.includes('required')))
        .map(e => e.path.join('.'));
      
      const invalidFormat = error.errors
        .filter(e => e.code === 'invalid_type' || e.code === 'invalid_string' || e.code === 'invalid_url')
        .map(e => `${e.path.join('.')}: ${e.message}`);

      const errors: string[] = [];
      if (missingRequired.length > 0) {
        errors.push(`Missing required variables: ${missingRequired.join(', ')}`);
      }
      if (invalidFormat.length > 0) {
        errors.push(`Invalid format: ${invalidFormat.join(', ')}`);
      }

      // Only throw in production - in development, log warning
      const isProduction = process.env.NODE_ENV === 'production';
      const errorMessage = `Environment validation failed:\n${errors.join('\n')}`;
      
      if (isProduction) {
        throw new Error(errorMessage);
      } else {
        // In development, log but continue with defaults where possible
        console.warn(`??  ${errorMessage}`);
        // Try to use safeParse to get partial values
        const result = envSchema.safeParse(process.env);
        if (result.success) {
          return result.data;
        }
        // Fallback: use partial parse with provided defaults - never throw in dev
        const partial = {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV || 'development',
          DATABASE_URL: process.env.DATABASE_URL,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
          JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-minimum-32-characters-long-' + Math.random().toString(36).substring(2, 15),
        };
        
        try {
          return envSchema.parse(partial);
        } catch (e) {
          // Final fallback - return minimal valid structure
          return {
            ...partial,
            NEXT_PUBLIC_APP_NAME: 'Mu3een',
            NEXT_PUBLIC_APP_VERSION: '1.0.0',
            NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
          } as z.infer<typeof envSchema>;
        }
      }
    }
    throw error;
  }
}

// Validate on module load (fail fast in production, warn in development)
let validatedEnv: z.infer<typeof envSchema>;
try {
  validatedEnv = parseEnv();
} catch (error) {
  // In case of critical failure, provide minimal defaults
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
  // Development fallback - use partial validation with defaults
  console.warn('??  Environment validation failed, using safe defaults for development');
  const partialResult = envSchema.safeParse(process.env);
  if (partialResult.success) {
    validatedEnv = partialResult.data;
  } else {
    // Use default values from schema for development
    validatedEnv = envSchema.parse({
      NODE_ENV: 'development',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/moeen',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://localhost.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
      JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production-' + Math.random().toString(36),
      ...process.env,
    });
  }
}

// Environment configuration - all values are now validated
export const env = {
  // App
  NODE_ENV: validatedEnv.NODE_ENV,
  APP_NAME: validatedEnv.NEXT_PUBLIC_APP_NAME,
  APP_VERSION: validatedEnv.NEXT_PUBLIC_APP_VERSION,
  APP_URL: validatedEnv.NEXT_PUBLIC_APP_URL,

  // API
  API_URL: validatedEnv.NEXT_PUBLIC_API_URL,
  API_TIMEOUT: validatedEnv.NEXT_PUBLIC_API_TIMEOUT,

  // Database
  DATABASE_URL: validatedEnv.DATABASE_URL,
  SUPABASE_URL: validatedEnv.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: validatedEnv.SUPABASE_SERVICE_ROLE_KEY,

  // Authentication
  JWT_SECRET: validatedEnv.JWT_SECRET,
  JWT_EXPIRES_IN: validatedEnv.JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: validatedEnv.REFRESH_TOKEN_EXPIRES_IN,

  // OAuth
  GOOGLE_CLIENT_ID: validatedEnv.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: validatedEnv.GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID: validatedEnv.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: validatedEnv.FACEBOOK_APP_SECRET,

  // Email
  SMTP_HOST: validatedEnv.SMTP_HOST,
  SMTP_PORT: validatedEnv.SMTP_PORT,
  SMTP_USER: validatedEnv.SMTP_USER,
  SMTP_PASS: validatedEnv.SMTP_PASS,
  SMTP_FROM: validatedEnv.SMTP_FROM,

  // File Storage
  UPLOAD_MAX_SIZE: validatedEnv.UPLOAD_MAX_SIZE,
  UPLOAD_ALLOWED_TYPES: validatedEnv.UPLOAD_ALLOWED_TYPES?.split(',').filter(Boolean) || [
    'image/jpeg',
    'image/png',
    'image/gif',
  ],

  // Redis
  REDIS_URL: validatedEnv.REDIS_URL,

  // Webhooks
  WEBHOOK_SECRET: validatedEnv.WEBHOOK_SECRET,
  WHATSAPP_VERIFY_TOKEN: validatedEnv.WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: validatedEnv.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_ACCESS_TOKEN: validatedEnv.WHATSAPP_ACCESS_TOKEN,
  STRIPE_WEBHOOK_SECRET: validatedEnv.STRIPE_WEBHOOK_SECRET,
  MOYASAR_SECRET_KEY: validatedEnv.MOYASAR_SECRET_KEY,
  ADMIN_INTERNAL_SECRET: validatedEnv.ADMIN_INTERNAL_SECRET,
  TEST_USERS_PASSWORD: validatedEnv.TEST_USERS_PASSWORD,

  // AI
  OPENAI_API_KEY: validatedEnv.OPENAI_API_KEY,
  OPENAI_MODEL: validatedEnv.OPENAI_MODEL,

  // Analytics
  GOOGLE_ANALYTICS_ID: validatedEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  MIXPANEL_TOKEN: validatedEnv.NEXT_PUBLIC_MIXPANEL_TOKEN,

  // Feature Flags
  ENABLE_ANALYTICS: validatedEnv.NEXT_PUBLIC_ENABLE_ANALYTICS,
  ENABLE_DEBUG: validatedEnv.NEXT_PUBLIC_ENABLE_DEBUG,
  ENABLE_AI: validatedEnv.NEXT_PUBLIC_ENABLE_AI,

  // Development
  IS_DEVELOPMENT: validatedEnv.NODE_ENV === 'development',
  IS_PRODUCTION: validatedEnv.NODE_ENV === 'production',
  IS_TEST: validatedEnv.NODE_ENV === 'test',
} as const;

// Validate required environment variables (deprecated - validation now happens on module load)
export const validateEnv = () => {
  // This function is kept for backward compatibility
  // Actual validation happens during module initialization above
  // If we reach here, validation already passed
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
