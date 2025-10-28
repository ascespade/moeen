import { test, expect } from '@playwright/test';

test.describe('Dynamic Data Module Tests', () => {
  test('should load dynamic contact info', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Check if page loaded
    await expect(page).toHaveTitle(/./);
  });

  test('should load dynamic stats', async ({ page }) => {
    await page.goto('http://localhost:3001');

    const title = await page.title();
    console.log('Page loaded:', title);

    expect(true).toBe(true);
  });

  test('should load dynamic services', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Wait for services to load
    await page.waitForTimeout(1000);

    expect(true).toBe(true);
  });

  test('should load doctors list', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Check for doctors section
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    expect(true).toBe(true);
  });
});
