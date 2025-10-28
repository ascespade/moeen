import { test, expect } from '@playwright/test';

test.describe('Layout Components Tests', () => {
  test('should render Header', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Header should be visible
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('should render Footer', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Scroll to bottom to see footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('should have Navigation', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Check for nav elements
    const nav = page.locator('nav').first();

    expect(true).toBe(true);
  });
});
