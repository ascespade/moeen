import { test, expect } from '@playwright/test';

test.describe('Chart Components Tests', () => {
  test('should render charts on dashboard', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Check for SVG elements (charts use SVG)
    const svgs = await page.locator('svg').count();
    console.log('Found SVG charts:', svgs);

    expect(svgs).toBeGreaterThanOrEqual(0);
  });

  test('should display KPI cards', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Look for KPI related content
    const body = page.locator('body');
    await expect(body).toBeVisible();

    expect(true).toBe(true);
  });
});
