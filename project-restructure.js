#!/usr/bin/env node

/**
 * Project Restructure Script
 * سكريبت إعادة تنظيم المشروع حسب المعايير العالمية
 */

const fs = require('fs');
const path = require('path');

class ProjectRestructure {
  constructor() {
    this.srcPath = 'src';
    this.newStructure = {
      // Core application structure
      app: 'src/app', // Next.js 13+ App Router
      components: 'src/components', // Reusable UI components
      lib: 'src/lib', // Utility functions and configurations
      hooks: 'src/hooks', // Custom React hooks
      types: 'src/types', // TypeScript type definitions
      styles: 'src/styles', // Global styles and themes
      constants: 'src/constants', // Application constants
      utils: 'src/utils', // Pure utility functions
      services: 'src/services', // API services and external integrations
      store: 'src/store', // State management (Redux, Zustand, etc.)
      context: 'src/context', // React contexts
      config: 'src/config', // Configuration files
      assets: 'src/assets', // Static assets
      locales: 'src/locales', // Internationalization files
      tests: 'src/tests', // Test utilities and helpers
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix =
      type === 'error'
        ? '❌'
        : type === 'success'
          ? '✅'
          : type === 'warning'
            ? '⚠️'
            : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async createDirectoryStructure() {
    this.log('🏗️ Creating standardized directory structure...');

    for (const [name, path] of Object.entries(this.newStructure)) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        this.log(`✅ Created directory: ${path}`);
      } else {
        this.log(`ℹ️ Directory already exists: ${path}`);
      }
    }
  }

  async organizeComponents() {
    this.log('🧩 Organizing components...');

    const componentStructure = {
      ui: 'src/components/ui', // Basic UI components (Button, Input, etc.)
      layout: 'src/components/layout', // Layout components (Header, Sidebar, etc.)
      forms: 'src/components/forms', // Form components
      charts: 'src/components/charts', // Chart components
      modals: 'src/components/modals', // Modal components
      tables: 'src/components/tables', // Table components
      navigation: 'src/components/navigation', // Navigation components
      feedback: 'src/components/feedback', // Loading, Error, Success components
      'data-display': 'src/components/data-display', // Cards, Lists, etc.
      surfaces: 'src/components/surfaces', // Surfaces and containers
    };

    for (const [name, path] of Object.entries(componentStructure)) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        this.log(`✅ Created component directory: ${path}`);
      }
    }
  }

  async organizeAppRouter() {
    this.log('📱 Organizing App Router structure...');

    const appStructure = {
      // Public routes
      '(auth)': 'src/app/(auth)',
      '(marketing)': 'src/app/(marketing)',

      // Protected routes
      '(dashboard)': 'src/app/(dashboard)',
      '(admin)': 'src/app/(admin)',

      // API routes
      api: 'src/app/api',

      // Special pages
      'globals.css': 'src/app/globals.css',
      'layout.tsx': 'src/app/layout.tsx',
      'page.tsx': 'src/app/page.tsx',
      'loading.tsx': 'src/app/loading.tsx',
      'error.tsx': 'src/app/error.tsx',
      'not-found.tsx': 'src/app/not-found.tsx',
    };

    for (const [name, path] of Object.entries(appStructure)) {
      if (name.includes('.')) {
        // This is a file, not a directory
        continue;
      }

      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        this.log(`✅ Created app directory: ${path}`);
      }
    }
  }

  async organizeServices() {
    this.log('🔧 Organizing services...');

    const serviceStructure = {
      api: 'src/services/api', // API client and endpoints
      auth: 'src/services/auth', // Authentication services
      database: 'src/services/database', // Database services
      storage: 'src/services/storage', // File storage services
      email: 'src/services/email', // Email services
      notifications: 'src/services/notifications', // Notification services
      analytics: 'src/services/analytics', // Analytics services
      external: 'src/services/external', // External API integrations
    };

    for (const [name, path] of Object.entries(serviceStructure)) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        this.log(`✅ Created service directory: ${path}`);
      }
    }
  }

  async organizeUtils() {
    this.log('🛠️ Organizing utilities...');

    const utilStructure = {
      validation: 'src/utils/validation', // Validation utilities
      formatting: 'src/utils/formatting', // Date, number, text formatting
      helpers: 'src/utils/helpers', // General helper functions
      constants: 'src/utils/constants', // Utility constants
      hooks: 'src/utils/hooks', // Custom hooks utilities
      api: 'src/utils/api', // API utilities
      storage: 'src/utils/storage', // Storage utilities
      date: 'src/utils/date', // Date utilities
      string: 'src/utils/string', // String utilities
      array: 'src/utils/array', // Array utilities
      object: 'src/utils/object', // Object utilities
    };

    for (const [name, path] of Object.entries(utilStructure)) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        this.log(`✅ Created util directory: ${path}`);
      }
    }
  }

  async createIndexFiles() {
    this.log('📄 Creating index files...');

    const indexFiles = [
      'src/components/index.ts',
      'src/lib/index.ts',
      'src/hooks/index.ts',
      'src/types/index.ts',
      'src/utils/index.ts',
      'src/services/index.ts',
      'src/constants/index.ts',
    ];

    for (const file of indexFiles) {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '// Auto-generated index file\n');
        this.log(`✅ Created index file: ${file}`);
      }
    }
  }

  async createConfigFiles() {
    this.log('⚙️ Creating configuration files...');

    const configFiles = {
      'src/config/app.ts': `// Application configuration
export const appConfig = {
  name: 'Moeen',
  version: '1.0.0',
  description: 'منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
};

export default appConfig;
`,

      'src/config/database.ts': `// Database configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL,
  maxConnections: 10,
  ssl: process.env.NODE_ENV === 'production',
};

export default databaseConfig;
`,

      'src/config/auth.ts': `// Authentication configuration
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  expiresIn: '7d',
  refreshExpiresIn: '30d',
  maxLoginAttempts: 5,
  lockoutDuration: 15, // minutes
};

export default authConfig;
`,

      'src/config/api.ts': `// API configuration
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retries: 3,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

export default apiConfig;
`,
    };

    for (const [file, content] of Object.entries(configFiles)) {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, content);
        this.log(`✅ Created config file: ${file}`);
      }
    }
  }

  async createTypeDefinitions() {
    this.log('📝 Creating type definitions...');

    const typeFiles = {
      'src/types/common.ts': `// Common types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
`,

      'src/types/auth.ts': `// Authentication types
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  last_login?: string;
  login_count: number;
}

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff' | 'supervisor' | 'patient' | 'agent' | 'manager' | 'demo';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
`,

      'src/types/components.ts': `// Component types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
`,
    };

    for (const [file, content] of Object.entries(typeFiles)) {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, content);
        this.log(`✅ Created type file: ${file}`);
      }
    }
  }

  async createConstants() {
    this.log('📋 Creating constants...');

    const constantFiles = {
      'src/constants/routes.ts': `// Application routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
  
  // API routes
  API: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    APPOINTMENTS: '/api/appointments',
    PATIENTS: '/api/patients',
  },
} as const;

export default ROUTES;
`,

      'src/constants/roles.ts': `// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  STAFF: 'staff',
  SUPERVISOR: 'supervisor',
  PATIENT: 'patient',
  AGENT: 'agent',
  MANAGER: 'manager',
  DEMO: 'demo',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'],
  [USER_ROLES.DOCTOR]: ['read:patients', 'write:appointments', 'read:medical_records'],
  [USER_ROLES.NURSE]: ['read:patients', 'read:appointments'],
  [USER_ROLES.STAFF]: ['read:appointments', 'write:appointments'],
  [USER_ROLES.SUPERVISOR]: ['read:*', 'write:appointments'],
  [USER_ROLES.PATIENT]: ['read:own_data', 'write:own_appointments'],
  [USER_ROLES.AGENT]: ['read:appointments', 'write:appointments'],
  [USER_ROLES.MANAGER]: ['read:*', 'write:appointments', 'write:patients'],
  [USER_ROLES.DEMO]: ['read:*'],
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
`,

      'src/constants/api.ts': `// API constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: '/users/:id',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    GET: '/appointments/:id',
    UPDATE: '/appointments/:id',
    DELETE: '/appointments/:id',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
`,
    };

    for (const [file, content] of Object.entries(constantFiles)) {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, content);
        this.log(`✅ Created constants file: ${file}`);
      }
    }
  }

  async run() {
    this.log('🚀 Starting project restructure...');

    try {
      await this.createDirectoryStructure();
      await this.organizeComponents();
      await this.organizeAppRouter();
      await this.organizeServices();
      await this.organizeUtils();
      await this.createIndexFiles();
      await this.createConfigFiles();
      await this.createTypeDefinitions();
      await this.createConstants();

      this.log('✅ Project restructure completed successfully!', 'success');
    } catch (error) {
      this.log(`❌ Project restructure failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the restructure
if (require.main === module) {
  const restructure = new ProjectRestructure();
  restructure.run().catch(error => {
    console.error('Restructure failed:', error);
    process.exit(1);
  });
}

module.exports = ProjectRestructure;
