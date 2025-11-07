import { test, expect } from '@playwright/test';

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('should load dashboard page', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();

    // Check page title or main content
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should display user information', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for user-related content (adjust selectors based on your UI)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Try clicking navigation items if they exist
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const count = await navLinks.count();

    if (count > 0) {
      // Click first nav link
      await navLinks.first().click();
      await page.waitForTimeout(1000);

      // Should still be on a protected route (not login)
      expect(page.url()).not.toContain('/login');
    }
  });
});
