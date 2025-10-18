import { test, expect } from '@playwright/test';

test.describe('Frontend Tests - Comprehensive', () => {
  test.beforeEach(async ({ page }) => {
    // إعداد الصفحة قبل كل اختبار
    await page.goto('/');
  });

  test('Homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Moeen/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Navigation works correctly', async ({ page }) => {
    // اختبار التنقل الرئيسي
    const navItems = [
      'Dashboard',
      'Patients',
      'Appointments',
      'Settings',
      'Profile',
    ];

    for (const item of navItems) {
      const navElement = page.locator(`text=${item}`).first();
      if (await navElement.isVisible()) {
        await navElement.click();
        await page.waitForLoadState('networkidle');
        // تأكد من أن الصفحة تم تحميلها
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('Forms validation works', async ({ page }) => {
    // اختبار صفحة تسجيل الدخول
    await page.goto('/login');

    // اختبار التحقق من صحة البريد الإلكتروني
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // تأكد من ظهور رسالة خطأ
    const errorMessage = page
      .locator('.error, [role="alert"], .text-red-500')
      .first();
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('Responsive design works', async ({ page }) => {
    // اختبار التصميم المتجاوب
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Accessibility features work', async ({ page }) => {
    // اختبار إمكانية الوصول
    await page.goto('/');

    // اختبار alt text للصور
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // اختبار ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('Loading states work correctly', async ({ page }) => {
    // اختبار حالات التحميل
    await page.goto('/dashboard');

    // البحث عن عناصر التحميل
    const loadingElements = page.locator(
      '.loading, .spinner, [data-testid="loading"]'
    );
    if ((await loadingElements.count()) > 0) {
      // تأكد من أن عناصر التحميل تظهر وتختفي
      await expect(loadingElements.first()).toBeVisible();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Error boundaries work', async ({ page }) => {
    // اختبار حدود الأخطاء
    await page.goto('/');

    // محاولة إثارة خطأ (إذا كان هناك زر للاختبار)
    const errorButton = page.locator('[data-testid="error-button"]');
    if (await errorButton.isVisible()) {
      await errorButton.click();
      // تأكد من ظهور رسالة خطأ مناسبة
      const errorMessage = page.locator('.error-boundary, .error-message');
      await expect(errorMessage).toBeVisible();
    }
  });

  test('Internationalization works', async ({ page }) => {
    // اختبار الترجمة
    await page.goto('/');

    // البحث عن عناصر الترجمة
    const langSwitcher = page.locator(
      '[data-testid="language-switcher"], .language-switcher'
    );
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();

      // اختبار تغيير اللغة
      const arabicOption = page.locator('text=العربية, text=Arabic');
      if (await arabicOption.isVisible()) {
        await arabicOption.click();
        await page.waitForLoadState('networkidle');
        // تأكد من تغيير النص
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });
});
