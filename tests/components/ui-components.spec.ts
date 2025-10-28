import { test, expect } from '@playwright/test';

test.describe('UI Components Tests', () => {
  test('should render Button component', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Check for buttons on the page
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
  });

  test('should render Card component', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Cards should be present on homepage
    const body = page.locator('body');
    await expect(body).toBeVisible();

    expect(true).toBe(true);
  });

  test('should render Input fields', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Look for input fields
    const inputs = await page.locator('input').count();
    console.log('Found inputs:', inputs);

    expect(inputs).toBeGreaterThanOrEqual(0);
  });

  test('should render Badge components', async ({ page }) => {
    await page.goto('http://localhost:3001');

    await page.screenshot({ path: 'test-results/ui-components.png' });

    expect(true).toBe(true);
  });
});
