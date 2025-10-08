import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE = 'test-service-role';
process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
process.env.WHATSAPP_PHONE_NUMBER_ID = 'test-phone-id';
process.env.WHATSAPP_BUSINESS_ACCOUNT_ID = 'test-business-id';
process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify-token';
process.env.SEHA_API_ENDPOINT = 'https://test.seha.sa';
process.env.JWT_SECRET = 'test-jwt-secret';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
    })),
  })),
}));

// Mock Socket.io
jest.mock('socket.io', () => ({
  Server: jest.fn(() => ({
    on: jest.fn(),
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
    emit: jest.fn(),
  })),
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: 'test-message-id' })),
  })),
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt-token'),
  verify: jest.fn(() => ({ userId: 'test-user', email: 'test@example.com', role: 'patient' })),
}));

// Mock crypto for browser compatibility
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn((arr) => arr.map(() => Math.floor(Math.random() * 256))),
    randomUUID: jest.fn(() => 'mock-uuid'),
  },
});

// Mock Web Crypto API
Object.defineProperty(global, 'window', {
  value: {
    crypto: {
      getRandomValues: jest.fn((arr) => arr.map(() => Math.floor(Math.random() * 256))),
      randomUUID: jest.fn(() => 'mock-uuid'),
    },
  },
});

// Mock requestIdleCallback
Object.defineProperty(global, 'requestIdleCallback', {
  value: jest.fn((callback) => {
    setTimeout(callback, 0);
  }),
});

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
  },
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock URL constructor
global.URL = jest.fn(() => ({
  searchParams: {
    get: jest.fn(),
  },
})) as any;

// Mock Headers
global.Headers = jest.fn(() => ({
  get: jest.fn(),
  set: jest.fn(),
  has: jest.fn(),
  delete: jest.fn(),
  forEach: jest.fn(),
})) as any;

// Mock Request
global.Request = jest.fn(() => ({
  url: 'http://localhost:3000',
  method: 'GET',
  headers: new Headers(),
  json: jest.fn(() => Promise.resolve({})),
})) as any;

// Mock Response
global.Response = jest.fn(() => ({
  ok: true,
  status: 200,
  json: jest.fn(() => Promise.resolve({})),
  text: jest.fn(() => Promise.resolve('')),
  headers: new Headers(),
})) as any;