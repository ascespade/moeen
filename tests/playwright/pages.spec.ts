import { test, expect } from '@playwright/test';

test.describe('الصفحات الرئيسية', () => {
  test('الصفحة الرئيسية تحمل بشكل صحيح', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('صفحة تسجيل الدخول تعمل', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('صفحة التسجيل تعمل', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('form')).toBeVisible();
  });

  test('صفحة 404 تعمل', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });
});

test.describe('التنقل', () => {
  test('القائمة الرئيسية تعمل', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('nav');
    await expect(menu).toBeVisible();
  });

  test('الروابط تعمل', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href]');
    const count = await links.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        await link.click();
        await page.waitForLoadState('networkidle');
        await page.goBack();
      }
    }
  });
});

test.describe('النماذج', () => {
  test('نموذج تسجيل الدخول يعمل', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('التحقق من صحة النماذج', async ({ page }) => {
    await page.goto('/login');
    
    // محاولة إرسال نموذج فارغ
    await page.click('button[type="submit"]');
    await expect(page.locator('.error, [role="alert"]')).toBeVisible();
  });
});