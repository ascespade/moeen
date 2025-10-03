#!/bin/bash

# 📋 Workspace Templates System - نظام قوالب مساحات العمل
# قوالب شاملة لجميع التقنيات والأطر الحديثة

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
TEMPLATES_DIR="/home/codeserver/workspace/templates"
WORKSPACE_DIR="/home/codeserver/workspace"

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Create React TypeScript template
create_react_template() {
    local template_dir="$TEMPLATES_DIR/react-typescript"
    mkdir -p "$template_dir"
    
    log "📋 إنشاء قالب React TypeScript..."
    
    # Package.json
    cat > "$template_dir/package.json" << 'EOF'
{
  "name": "react-typescript-template",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.68",
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4",
    "@mui/material": "^5.14.20",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.19",
    "axios": "^1.6.2",
    "react-query": "^3.39.3",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}",
    "prepare": "husky install"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
EOF

    # TypeScript config
    cat > "$template_dir/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/services/*": ["services/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": [
    "src"
  ]
}
EOF

    # ESLint config
    cat > "$template_dir/.eslintrc.json" << 'EOF'
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
EOF

    # Prettier config
    cat > "$template_dir/.prettierrc" << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

    # Source structure
    mkdir -p "$template_dir/src/components"
    mkdir -p "$template_dir/src/hooks"
    mkdir -p "$template_dir/src/services"
    mkdir -p "$template_dir/src/utils"
    mkdir -p "$template_dir/src/types"
    mkdir -p "$template_dir/src/pages"
    mkdir -p "$template_dir/public"

    # App.tsx
    cat > "$template_dir/src/App.tsx" << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
EOF

    # Layout component
    cat > "$template_dir/src/components/Layout.tsx" << 'EOF'
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React TypeScript Template
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/about"
            sx={{
              backgroundColor: location.pathname === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            About
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
EOF

    # Home page
    cat > "$template_dir/src/pages/HomePage.tsx" << 'EOF'
import React from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useQuery } from 'react-query';

const HomePage: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'example-data',
    () => fetch('https://jsonplaceholder.typicode.com/posts?_limit=3').then(res => res.json()),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to React TypeScript Template
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A modern React application with TypeScript, Material-UI, React Query, and more.
        </Typography>
        <Button variant="contained" size="large">
          Get Started
        </Button>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom>
        Example Data
      </Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error loading data</Typography>}

      <Grid container spacing={3}>
        {data?.map((post: any) => (
          <Grid item xs={12} md={4} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.body.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Read More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
EOF

    # About page
    cat > "$template_dir/src/pages/AboutPage.tsx" << 'EOF'
import React from 'react';
import {
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const features = [
    'React 18 with TypeScript',
    'Material-UI for beautiful components',
    'React Query for data fetching',
    'React Router for navigation',
    'ESLint and Prettier for code quality',
    'Husky for git hooks',
    'Modern development setup',
  ];

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About This Template
        </Typography>
        
        <Typography variant="body1" paragraph>
          This is a comprehensive React TypeScript template designed for modern web development.
          It includes all the essential tools and libraries you need to build scalable applications.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Features Included
        </Typography>

        <List>
          {features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Getting Started
        </Typography>

        <Typography variant="body1" paragraph>
          1. Install dependencies: <code>npm install</code>
        </Typography>
        <Typography variant="body1" paragraph>
          2. Start development server: <code>npm start</code>
        </Typography>
        <Typography variant="body1" paragraph>
          3. Build for production: <code>npm run build</code>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AboutPage;
EOF

    # Types
    cat > "$template_dir/src/types/index.ts" << 'EOF'
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
EOF

    # Services
    cat > "$template_dir/src/services/api.ts" << 'EOF'
import axios from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string): Promise<T> =>
    apiClient.get(url).then((response) => response.data),
  
  post: <T>(url: string, data: any): Promise<ApiResponse<T>> =>
    apiClient.post(url, data).then((response) => response.data),
  
  put: <T>(url: string, data: any): Promise<ApiResponse<T>> =>
    apiClient.put(url, data).then((response) => response.data),
  
  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    apiClient.delete(url).then((response) => response.data),
};

export default apiClient;
EOF

    # Custom hook
    cat > "$template_dir/src/hooks/useLocalStorage.ts" << 'EOF'
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
EOF

    # Utils
    cat > "$template_dir/src/utils/formatters.ts" << 'EOF'
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
EOF

    # Environment files
    cat > "$template_dir/.env.example" << 'EOF'
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=React TypeScript Template
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
EOF

    # Public files
    cat > "$template_dir/public/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="React TypeScript Template" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React TypeScript Template</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

    # Gitignore
    cat > "$template_dir/.gitignore" << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment variables
.env
EOF

    log "✅ تم إنشاء قالب React TypeScript"
}

# Create Next.js template
create_nextjs_template() {
    local template_dir="$TEMPLATES_DIR/nextjs-typescript"
    mkdir -p "$template_dir"
    
    log "📋 إنشاء قالب Next.js TypeScript..."
    
    # Package.json
    cat > "$template_dir/package.json" << 'EOF'
{
  "name": "nextjs-typescript-template",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@next/font": "14.0.3",
    "next-themes": "^0.2.1",
    "framer-motion": "^10.16.5",
    "axios": "^1.6.2",
    "swr": "^2.2.4",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2"
  },
  "devDependencies": {
    "typescript": "^5.3.2",
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "14.0.3",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "@types/jest": "^29.5.8",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
EOF

    # Next.js config
    cat > "$template_dir/next.config.js" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
EOF

    # TypeScript config
    cat > "$template_dir/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

    # Tailwind config
    cat > "$template_dir/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
EOF

    # App directory structure
    mkdir -p "$template_dir/src/app"
    mkdir -p "$template_dir/src/components"
    mkdir -p "$template_dir/src/lib"
    mkdir -p "$template_dir/src/hooks"
    mkdir -p "$template_dir/src/types"
    mkdir -p "$template_dir/public"

    # App layout
    cat > "$template_dir/src/app/layout.tsx" << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js TypeScript Template',
  description: 'A modern Next.js application with TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
EOF

    # App page
    cat > "$template_dir/src/app/page.tsx" << 'EOF'
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Next.js TypeScript Template
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A modern, full-featured starter template for Next.js applications
        </p>
        <Button size="lg">
          Get Started
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    icon: '⚡',
    title: 'Fast Development',
    description: 'Hot reload, TypeScript, and modern tooling for rapid development.',
  },
  {
    icon: '🎨',
    title: 'Beautiful UI',
    description: 'Tailwind CSS and Framer Motion for stunning user interfaces.',
  },
  {
    icon: '🔒',
    title: 'Type Safe',
    description: 'Full TypeScript support with strict type checking.',
  },
]
EOF

    # Global CSS
    cat > "$template_dir/src/app/globals.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 98%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

    log "✅ تم إنشاء قالب Next.js TypeScript"
}

# Create Django template
create_django_template() {
    local template_dir="$TEMPLATES_DIR/django-rest-api"
    mkdir -p "$template_dir"
    
    log "📋 إنشاء قالب Django REST API..."
    
    # Requirements
    cat > "$template_dir/requirements.txt" << 'EOF'
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
django-environ==0.11.2
psycopg2-binary==2.9.9
redis==5.0.1
celery==5.3.4
django-celery-beat==2.5.0
Pillow==10.1.0
gunicorn==21.2.0
whitenoise==6.6.0
django-extensions==3.2.3
django-debug-toolbar==4.2.0
pytest-django==4.7.0
factory-boy==3.3.0
coverage==7.3.2
black==23.11.0
flake8==6.1.0
isort==5.12.0
pre-commit==3.6.0
EOF

    # Django settings
    mkdir -p "$template_dir/config/settings"
    
    cat > "$template_dir/config/settings/base.py" << 'EOF'
import environ
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Environment variables
env = environ.Env(
    DEBUG=(bool, False)
)

# Read .env file
environ.Env.read_env(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'django_extensions',
]

LOCAL_APPS = [
    'apps.users',
    'apps.core',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env('DB_PORT', default='5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'users.User'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# CORS settings
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[])
CORS_ALLOW_ALL_ORIGINS = env.bool('CORS_ALLOW_ALL_ORIGINS', default=False)

# Celery Configuration
CELERY_BROKER_URL = env('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('REDIS_URL', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env('REDIS_URL', default='redis://localhost:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}
EOF

    # Development settings
    cat > "$template_dir/config/settings/development.py" << 'EOF'
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Debug toolbar
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

INTERNAL_IPS = [
    '127.0.0.1',
]

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True
EOF

    # Production settings
    cat > "$template_dir/config/settings/production.py" << 'EOF'
from .base import *

DEBUG = False

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 31536000
SECURE_REDIRECT_EXEMPT = []
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

# Static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT', default=587)
EMAIL_USE_TLS = env('EMAIL_USE_TLS', default=True)
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
EOF

    # URLs
    cat > "$template_dir/config/urls.py" << 'EOF'
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/', include('apps.core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns
EOF

    # User model
    mkdir -p "$template_dir/apps/users"
    cat > "$template_dir/apps/users/models.py" << 'EOF'
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
EOF

    # Environment file
    cat > "$template_dir/.env.example" << 'EOF'
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=django_app
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
EOF

    log "✅ تم إنشاء قالب Django REST API"
}

# Create FastAPI template
create_fastapi_template() {
    local template_dir="$TEMPLATES_DIR/fastapi-async"
    mkdir -p "$template_dir"
    
    log "📋 إنشاء قالب FastAPI Async..."
    
    # Requirements
    cat > "$template_dir/requirements.txt" << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
sqlalchemy==2.0.23
alembic==1.13.1
asyncpg==0.29.0
redis==5.0.1
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
aiofiles==23.2.1
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
isort==5.12.0
flake8==6.1.0
mypy==1.7.1
EOF

    # Main application
    cat > "$template_dir/main.py" << 'EOF'
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import create_tables
from app.api.v1.router import api_router
from app.core.exceptions import CustomException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up...")
    await create_tables()
    yield
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Async Template",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Exception handlers
@app.exception_handler(CustomException)
async def custom_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "details": exc.details}
    )

# Routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "FastAPI Async Template",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
EOF

    # Configuration
    mkdir -p "$template_dir/app/core"
    cat > "$template_dir/app/core/config.py" << 'EOF'
from pydantic_settings import BaseSettings
from typing import List, Optional
import secrets

class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "FastAPI Async Template"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "A modern FastAPI template with async support"
    
    # API
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/dbname"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    # Superuser
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "changethis"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
EOF

    # Database
    cat > "$template_dir/app/core/database.py" << 'EOF'
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Create base class for models
Base = declarative_base()
metadata = MetaData()

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
EOF

    # Models
    mkdir -p "$template_dir/app/models"
    cat > "$template_dir/app/models/user.py" << 'EOF'
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.email}>"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
EOF

    # Schemas
    mkdir -p "$template_dir/app/schemas"
    cat > "$template_dir/app/schemas/user.py" << 'EOF'
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    is_verified: bool
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

# Token schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    exp: Optional[int] = None
EOF

    # CRUD operations
    mkdir -p "$template_dir/app/crud"
    cat > "$template_dir/app/crud/user.py" << 'EOF'
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

class UserCRUD:
    async def get(self, db: AsyncSession, id: int) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == id))
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_multi(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[User]:
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: UserCreate) -> User:
        hashed_password = get_password_hash(obj_in.password)
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            hashed_password=hashed_password,
            bio=obj_in.bio,
        )
        db.add(db_obj)
        try:
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except IntegrityError:
            await db.rollback()
            raise ValueError("User with this email or username already exists")

    async def update(
        self, db: AsyncSession, db_obj: User, obj_in: UserUpdate
    ) -> User:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def authenticate(
        self, db: AsyncSession, email: str, password: str
    ) -> Optional[User]:
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    async def is_active(self, user: User) -> bool:
        return user.is_active

    async def is_superuser(self, user: User) -> bool:
        return user.is_superuser

user = UserCRUD()
EOF

    # Security
    cat > "$template_dir/app/core/security.py" << 'EOF'
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
EOF

    # API Router
    mkdir -p "$template_dir/app/api/v1"
    cat > "$template_dir/app/api/v1/router.py" << 'EOF'
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
EOF

    # Environment file
    cat > "$template_dir/.env.example" << 'EOF'
# Project
PROJECT_NAME=FastAPI Async Template
ENVIRONMENT=development
DEBUG=true

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_MINUTES=10080

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost/fastapi_db

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
ALLOWED_HOSTS=["*"]

# Email
SMTP_TLS=true
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=your-email@gmail.com
EMAILS_FROM_NAME=FastAPI Template

# Superuser
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=changethis
EOF

    log "✅ تم إنشاء قالب FastAPI Async"
}

# Main setup function
setup_workspace_templates() {
    log "📋 إعداد نظام قوالب مساحات العمل..."
    
    # Create templates directory
    mkdir -p "$TEMPLATES_DIR"
    
    # Create all templates
    create_react_template
    create_nextjs_template
    create_django_template
    create_fastapi_template
    
    # Set permissions
    chown -R codeserver:codeserver "$TEMPLATES_DIR"
    
    # Create template manager script
    cat > /usr/local/bin/create-from-template << 'EOF'
#!/bin/bash

TEMPLATES_DIR="/home/codeserver/workspace/templates"
WORKSPACE_DIR="/home/codeserver/workspace"

show_templates() {
    echo "📋 Available Templates:"
    echo "====================="
    for template in "$TEMPLATES_DIR"/*; do
        if [ -d "$template" ]; then
            template_name=$(basename "$template")
            echo "  - $template_name"
        fi
    done
}

create_project() {
    local template_name="$1"
    local project_name="$2"
    local template_path="$TEMPLATES_DIR/$template_name"
    local project_path="$WORKSPACE_DIR/$project_name"
    
    if [ ! -d "$template_path" ]; then
        echo "❌ Template '$template_name' not found!"
        show_templates
        exit 1
    fi
    
    if [ -d "$project_path" ]; then
        echo "❌ Project '$project_name' already exists!"
        exit 1
    fi
    
    echo "🚀 Creating project '$project_name' from template '$template_name'..."
    
    # Copy template
    cp -r "$template_path" "$project_path"
    
    # Initialize git
    cd "$project_path"
    git init
    git add .
    git commit -m "Initial commit from $template_name template"
    
    # Set ownership
    chown -R codeserver:codeserver "$project_path"
    
    echo "✅ Project created successfully!"
    echo "📁 Location: $project_path"
    echo "🔧 Next steps:"
    
    case "$template_name" in
        "react-typescript"|"nextjs-typescript")
            echo "  1. cd $project_name"
            echo "  2. npm install"
            echo "  3. npm start"
            ;;
        "django-rest-api")
            echo "  1. cd $project_name"
            echo "  2. python -m venv venv"
            echo "  3. source venv/bin/activate"
            echo "  4. pip install -r requirements.txt"
            echo "  5. python manage.py migrate"
            echo "  6. python manage.py runserver"
            ;;
        "fastapi-async")
            echo "  1. cd $project_name"
            echo "  2. python -m venv venv"
            echo "  3. source venv/bin/activate"
            echo "  4. pip install -r requirements.txt"
            echo "  5. uvicorn main:app --reload"
            ;;
    esac
}

# Main execution
if [ $# -eq 0 ]; then
    echo "Usage: create-from-template <template-name> <project-name>"
    echo ""
    show_templates
    exit 1
fi

if [ $# -eq 1 ] && [ "$1" = "list" ]; then
    show_templates
    exit 0
fi

if [ $# -ne 2 ]; then
    echo "Usage: create-from-template <template-name> <project-name>"
    exit 1
fi

create_project "$1" "$2"
EOF

    chmod +x /usr/local/bin/create-from-template
    
    log "✅ تم إعداد نظام قوالب مساحات العمل"
}

# Main execution
case "${1:-setup}" in
    "setup")
        setup_workspace_templates
        ;;
    *)
        echo "Usage: $0 [setup]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Workspace Templates System Complete!${NC}"
echo -e "${CYAN}======================================${NC}"
echo -e "${BLUE}📋 Available Templates:${NC}"
echo -e "${YELLOW}  • react-typescript    - Modern React with TypeScript${NC}"
echo -e "${YELLOW}  • nextjs-typescript   - Next.js with TypeScript${NC}"
echo -e "${YELLOW}  • django-rest-api     - Django REST API${NC}"
echo -e "${YELLOW}  • fastapi-async       - FastAPI with async support${NC}"
echo ""
echo -e "${BLUE}🛠️ Commands:${NC}"
echo -e "${GREEN}  create-from-template list${NC}"
echo -e "${GREEN}  create-from-template react-typescript my-react-app${NC}"
echo -e "${GREEN}  create-from-template nextjs-typescript my-next-app${NC}"
echo -e "${GREEN}  create-from-template django-rest-api my-api${NC}"
echo -e "${GREEN}  create-from-template fastapi-async my-fastapi${NC}"
echo ""
echo -e "${BLUE}📁 Templates Location:${NC}"
echo -e "${GREEN}  $TEMPLATES_DIR${NC}"
