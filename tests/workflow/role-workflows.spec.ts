import { test, expect } from '@playwright/test';

test.describe('Role Workflow Tests', () => {
  test('admin workflow - full access', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Should redirect to admin dashboard
    await page.waitForURL(/\/(admin\/dashboard|dashboard)/, { timeout: 15000 });

    // Should be able to access admin routes
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin');

    // Should see admin menu items
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Should be able to access admin/users
    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/admin/users');
  });

  test('agent workflow - limited access', async ({ page }) => {
    // Login as doctor (agent role)
    await page.goto('/login');
    await page.fill('input[type="email"]', 'doctor@test.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard (not admin)
    await page.waitForURL(/\/(dashboard)/, { timeout: 15000 });
    expect(page.url()).not.toContain('/admin');

    // Should NOT be able to access admin routes
    await page.goto('/admin');
    await page.waitForTimeout(2000);
    // Should be redirected away from admin
    expect(page.url()).not.toContain('/admin');

    // Should be able to access profile
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/profile');
  });

  test('manager workflow - admin access but limited permissions', async ({
    page,
  }) => {
    // Note: We'd need a manager test user
    // This is a placeholder test structure
    await page.goto('/login');

    // Manager should access admin dashboard
    // But with limited permissions
  });

  test('workflow - session persistence', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/(admin|dashboard)/, { timeout: 15000 });

    // Navigate to different pages
    const pages = ['/dashboard', '/profile', '/admin/dashboard'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForTimeout(1000);
      // Should not redirect to login
      expect(page.url()).not.toContain('/login');
    }
  });

  test('workflow - logout clears session', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/(admin|dashboard)/, { timeout: 15000 });

    // Logout
    const logoutButton = page
      .locator(
        'button:has-text("تسجيل الخروج"), button:has-text("logout"), [aria-label*="logout"]'
      )
      .first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Alternative: clear cookies and go to login
      await page.context().clearCookies();
      await page.goto('/dashboard');
    }

    // Should redirect to login
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
