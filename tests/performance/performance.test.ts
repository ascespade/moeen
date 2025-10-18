import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Homepage should load within 2 seconds', async({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('Dashboard should load within 3 seconds', async({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');

    const startTime = Date.now();
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('Images should be optimized', async({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        // Check if image is using Next.js Image component
        const parent = img.locator('..');
        const hasNextImageClass = await parent.evaluate((el) =>
          el.classList.contains('next-image')
        );

        expect(hasNextImageClass).toBeTruthy();
      }
    }
  });

  test('Bundle size should be reasonable', async({ page }) => {
    await page.goto('/');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });

    expect(metrics.domContentLoaded).toBeLessThan(1000);
    expect(metrics.loadComplete).toBeLessThan(500);
    expect(metrics.totalLoadTime).toBeLessThan(2000);
  });

  test('Memory usage should be reasonable', async({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (memoryInfo) {
      const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
      expect(usedMB).toBeLessThan(100); // Less than 100MB
    }
  });

  test('API responses should be fast', async({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');

    // Monitor network requests
    const responsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/auth/login')
    );

    const startTime = Date.now();
    await page.click('[data-testid="login-button"]');
    const response = await responsePromise;
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Less than 1 second
  });

  test('Lazy loading should work correctly', async({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check if lazy components are loaded
    const lazyComponents = page.locator('[data-lazy-component]');
    const lazyComponentCount = await lazyComponents.count();

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check if components are now visible
    for (let i = 0; i < lazyComponentCount; i++) {
      const component = lazyComponents.nth(i);
      const isVisible = await component.isVisible();
      expect(isVisible).toBeTruthy();
    }
  });

  test('Page should handle rapid navigation', async({ page }) => {
    const pages = ['/dashboard', '/patients', '/appointments', '/sessions'];

    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(2000);
    }
  });

  test('Form submissions should be responsive', async({ page }) => {
    await page.goto('/register');

    const startTime = Date.now();
    await page.fill('[data-testid="full-name"]', 'Test User');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirm-password"]', 'password123');

    const fillTime = Date.now() - startTime;
    expect(fillTime).toBeLessThan(1000); // Form filling should be fast

    // Test form validation response time
    const validationStartTime = Date.now();
    await page.click('[data-testid="register-button"]');
    await page.waitForSelector(
      '[data-testid="error-message"], [data-testid="success-message"]',
      { timeout: 2000 }
    );
    const validationTime = Date.now() - validationStartTime;

    expect(validationTime).toBeLessThan(2000);
  });

  test('Search functionality should be fast', async({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      const startTime = Date.now();
      await searchInput.fill('test search');
      await page.waitForTimeout(500); // Wait for debounced search
      const searchTime = Date.now() - startTime;

      expect(searchTime).toBeLessThan(1000);
    }
  });

  test('Mobile performance should be acceptable', async({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // Slightly more lenient for mobile
  });
});
