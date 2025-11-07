import { test, expect } from '@playwright/test';

/**
 * Comprehensive Admin Tests
 * اختبارات شاملة للادمن
 */

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'Admin123!';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

async function loginAsAdmin(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');

  const emailInput = page
    .locator('input[type="email"], input[name="email"]')
    .first();
  const passwordInput = page
    .locator('input[type="password"], input[name="password"]')
    .first();

  await emailInput.fill(ADMIN_EMAIL);
  await passwordInput.fill(ADMIN_PASSWORD);

  const submitButton = page.locator('button[type="submit"]').first();
  await submitButton.click();

  await page.waitForURL(/\/admin|\/dashboard/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Comprehensive Admin Tests', () => {
  test('should login and verify admin dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    expect(page.url()).toMatch(/\/admin|\/dashboard/);
  });

  test('should navigate to all admin pages', async ({ page }) => {
    await loginAsAdmin(page);

    const adminPages = [
      { path: '/admin/dashboard', name: 'Dashboard' },
      { path: '/admin/users', name: 'Users' },
      { path: '/admin/settings', name: 'Settings' },
    ];

    for (const adminPage of adminPages) {
      await page.goto(`${BASE_URL}${adminPage.path}`);
      await page.waitForLoadState('networkidle');

      const content = await page.content();
      expect(content).not.toContain('404');
      expect(content).not.toContain('Not Found');
    }
  });

  test('should verify admin permissions', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto(`${BASE_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');

    const adminElements = page.locator('text=/admin|إدارة|مدير/i').first();
    await expect(adminElements).toBeVisible({ timeout: 5000 });
  });

  test('should test admin sidebar navigation', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto(`${BASE_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');

    const sidebar = page
      .locator('nav, [role="navigation"], aside, [class*="sidebar"]')
      .first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });
});
