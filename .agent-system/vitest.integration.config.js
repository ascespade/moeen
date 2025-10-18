import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  // 🔧 إعدادات اختبارات التكامل
  test: {
    // البيئة
    environment: 'node',

    // المجلدات
    include: ['**/*.integration.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
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
    timeout: 30000, // 30 ثانية لاختبارات التكامل
    hookTimeout: 30000,
    teardownTimeout: 30000,

    // التغطية
    coverage: {
      provider: 'c8',
      reporter: ['text', 'text-summary', 'html', 'json', 'lcov'],
      reportsDirectory: './coverage-integration',
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
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
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
        maxThreads: 2 // أقل من اختبارات الوحدة
      }
    },

    // إعدادات المراقبة
    watch: false,
    watchExclude: ['**/node_modules/**', '**/dist/**'],

    // إعدادات التقارير
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/integration-results.json',
      html: './test-results/integration-index.html'
    },

    // إعدادات الاختبار
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,

    // إعدادات الاستيراد
    deps: {
      inline: ['@testing-library/jest-dom']
    },

    // إعدادات البيئة
    env: {
      NODE_ENV: 'test',
      INTEGRATION_TEST: 'true'
    },

    // إعدادات الملفات
    setupFiles: ['./config/integration-test-setup.js'],

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
    target: 'esnext'
  },

  // إعدادات الخادم
  server: {
    port: 3001,
    open: false,
    cors: true
  },

  // إعدادات المعاينة
  preview: {
    port: 4174,
    open: false,
    cors: true
  }
});
