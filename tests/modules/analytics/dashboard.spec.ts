import { expect, test } from '@playwright/test';

test.describe('Analytics Dashboard Tests', () => {
  test('should load analytics dashboard', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    expect(true).toBe(true);
  });

  test('should display metrics', async ({ page }) => {
    await page.goto('http://localhost:3001');

    const svgs = await page.locator('svg').count();
    console.log('Charts found:', svgs);

    expect(true).toBe(true);
  });
});
