import { defineConfig, devices } from '@playwright/test';

/**
 * إعدادات Playwright للاختبارات التلقائية
 * Auto Test Configuration - No Manual Intervention Required
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* تشغيل الاختبارات بشكل متوازي */
  fullyParallel: true,

  /* منع الاختبارات المحددة فقط في CI */
  forbidOnly: !!process.env.CI,

  /* إعادة المحاولة - محلي و CI */
  retries: 1,

  /* عدد العمال المتوازيين */
  workers: process.env.CI ? 1 : 2,

  /* مهلة زمنية عامة للاختبارات */
  timeout: 60000,

  /* مهلة زمنية للتحقق من النتائج */
  expect: {
    timeout: 10000
  },

  /* تقارير الاختبارات */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-results.json' }],
    ['junit', { outputFile: 'playwright-results.xml' }],
    ['list'] // تقرير مبسط في الكونسول
  ],

  /* إعدادات مشتركة لجميع الاختبارات */
  use: {
    /* الرابط الأساسي */
    baseURL: 'http://localhost:3001',

    /* تتبع الأخطاء */
    trace: 'on-first-retry',

    /* لقطات الشاشة عند الفشل فقط */
    screenshot: 'only-on-failure',

    /* تسجيل الفيديو عند الفشل فقط */
    video: 'retain-on-failure',

    /* مهلة زمنية للإجراءات */
    actionTimeout: 30000,

    /* مهلة زمنية للتنقل */
    navigationTimeout: 30000,

    /* تجاهل أخطاء HTTPS */
    ignoreHTTPSErrors: true,

    /* قبول التنزيلات تلقائياً */
    acceptDownloads: true,

    /* إعدادات إضافية للاستقرار */
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    }
  },

  /* إعداد المشاريع - المتصفحات */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // إعدادات إضافية لكروم
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        }
      }
    }
  ],

  /* إعداد الخادم المحلي */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120 * 1000, // 2 دقيقة
    stdout: 'pipe',
    stderr: 'pipe'
  },

  /* الإعدادات العامة */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  /* متغيرات البيئة */
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: 'test'
  }
});
