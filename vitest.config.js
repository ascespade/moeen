import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  // 🔧 إعدادات Vitest
  test: {
    // البيئة
    environment: 'jsdom',
    
    // المجلدات
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    
    // إعدادات الاختبار
    globals: true,
    passWithNoTests: true,
    bail: 0,
    timeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    
    // التغطية
    coverage: {
      provider: 'c8',
      reporter: ['text', 'text-summary', 'html', 'json', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{js,ts,jsx,tsx}',
        'src/**/*.spec.{js,ts,jsx,tsx}',
        'src/**/__tests__/**',
        'src/**/__mocks__/**',
        'src/**/index.{js,ts}',
        'src/**/types/**',
        'src/**/constants/**',
        'src/**/utils/test-utils/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      all: true,
      skipFull: false,
      clean: true,
      cleanOnRerun: true
    },
    
    // إعدادات الأداء
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4
      }
    },
    
    // إعدادات المراقبة
    watch: false,
    watchExclude: ['**/node_modules/**', '**/dist/**'],
    
    // إعدادات التقارير
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/index.html'
    },
    
    // إعدادات الاختبار
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    
    // إعدادات الاستيراد
    deps: {
      inline: ['@testing-library/jest-dom']
    },
    
    // إعدادات البيئة
    env: {
      NODE_ENV: 'test'
    },
    
    // إعدادات الملفات
    setupFiles: ['./config/test-setup.js'],
    
    // إعدادات CSS
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  },
  
  // إعدادات Vite
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests'),
      '@config': resolve(__dirname, './config'),
      '@utils': resolve(__dirname, './src/utils'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@store': resolve(__dirname, './src/store'),
      '@types': resolve(__dirname, './src/types')
    }
  },
  
  // إعدادات البناء
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'SmartBootloaderSystem',
      fileName: 'smart-bootloader-system'
    }
  },
  
  // إعدادات الخادم
  server: {
    port: 3000,
    open: false,
    cors: true
  },
  
  // إعدادات المعاينة
  preview: {
    port: 4173,
    open: false,
    cors: true
  }
});
