import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 🔧 إعدادات Playwright
  testDir: './tests/e2e',

  // تشغيل الاختبارات في ملفات متوازية
  fullyParallel: true,

  // فشل الاختبار إذا كان هناك خطأ في console
  forbidOnly: !!process.env.CI,

  // إعادة المحاولة عند الفشل
  retries: process.env.CI ? 2 : 0,

  // عدد العمال المتوازيين
  workers: process.env.CI ? 1 : undefined,

  // إعدادات التقرير
  reporter: [
    ['html', { outputFolder: 'test-results/e2e-html' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }],
    ['list']
  ],

  // إعدادات عامة
  use: {
    // Base URL للاختبارات
    baseURL: 'http://localhost:3000',

    // تتبع الأخطاء
    trace: 'on-first-retry',

    // لقطات الشاشة
    screenshot: 'only-on-failure',

    // تسجيل الفيديو
    video: 'retain-on-failure',

    // إعدادات المتصفح
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // إعدادات الشبكة
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // إعدادات التحميل
    waitForLoadState: 'networkidle'
  },

  // إعدادات المشاريع (المتصفحات)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    // اختبارات الهاتف المحمول
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    },
    // اختبارات التابلت
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] }
    }
  ],

  // إعدادات الخادم المحلي
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 دقيقة
    stdout: 'pipe',
    stderr: 'pipe'
  },

  // إعدادات الاختبار
  testMatch: [
    '**/*.e2e.{test,spec}.{js,ts,jsx,tsx}',
    '**/e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'
  ],

  // إعدادات الاستبعاد
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.nuxt/**',
    '**/.output/**'
  ],

  // إعدادات الوقت
  timeout: 30000, // 30 ثانية
  expect: {
    timeout: 10000 // 10 ثواني
  },

  // إعدادات البيئة
  globalSetup: './config/e2e-global-setup.js',
  globalTeardown: './config/e2e-global-teardown.js',

  // إعدادات التقرير
  outputDir: 'test-results/e2e-artifacts',

  // إعدادات التحديث
  updateSnapshots: 'missing',

  // إعدادات التصحيح
  debug: process.env.PWDEBUG === '1',

  // إعدادات الشبكة
  use: {
    ...devices['Desktop Chrome'],
    // إعدادات إضافية
    locale: 'en-US',
    timezoneId: 'America/New_York',
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation', 'camera', 'microphone'],
    colorScheme: 'light',
    reducedMotion: 'reduce'
  }
});
