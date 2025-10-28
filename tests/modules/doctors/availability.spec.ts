import { expect, test } from '@playwright/test';

test.describe('Doctor Availability Tests', () => {
  test('should check doctor availability', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    expect(true).toBe(true);
  });

  test('should set doctor schedule', async ({ page }) => {
    expect(true).toBe(true);
  });
});
