import { test, expect } from '@playwright/test';

test.describe('Modules and Screens Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('dashboard module should load', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check that page loaded
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check URL
    expect(page.url()).toContain('/dashboard');
  });

  test('settings module should load', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Should not redirect to login
    expect(page.url()).toContain('/settings');
    await expect(page.locator('body')).toBeVisible();
  });

  test('profile module should load', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should not redirect to login
    expect(page.url()).toContain('/profile');
    await expect(page.locator('body')).toBeVisible();
  });

  test('admin routes should be accessible to admin', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Admin should access admin routes
    expect(page.url()).toContain('/admin');
  });

  test('agent role should not access admin routes', async ({ page }) => {
    // Logout first
    await page.context().clearCookies();

    // Login as doctor (agent role)
    await page.goto('/login');
    await page.fill('input[type="email"]', 'doctor@test.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Try to access admin
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Should redirect away from admin
    expect(page.url()).not.toContain('/admin');
  });
});
