import { test, expect } from '@playwright/test';

test.describe('Permissions Tests', () => {
  test('admin should have access to admin routes', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Try to access admin route
    await page.goto('/admin');

    // Should not redirect to login
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin');
  });

  test('agent role should redirect from admin routes', async ({ page }) => {
    // Login as doctor (agent role)
    await page.goto('/login');
    await page.fill('input[type="email"]', 'doctor@test.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Try to access admin route
    await page.goto('/admin');

    // Should redirect away from admin (to dashboard)
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/admin');
  });

  test('should maintain session after navigation', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Navigate to different pages
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    await page.goto('/profile');
    await page.waitForTimeout(1000);

    await page.goto('/settings');
    await page.waitForTimeout(1000);

    // Should still be authenticated (not redirected to login)
    expect(page.url()).not.toContain('/login');

    // Verify cookie still exists
    const cookies = await page.context().cookies();
    expect(cookies.find(c => c.name === 'auth_token')).toBeDefined();
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear all cookies
    await page.context().clearCookies();

    // Try to access protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('should redirect authenticated users away from login page', async ({
    page,
  }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Try to access login page again
    await page.goto('/login');

    // Should redirect back to dashboard
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/dashboard');
  });
});
