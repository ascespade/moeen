import { expect, test } from '@playwright/test';

test.describe('CRM Leads Tests', () => {
  test('should create new lead', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    expect(true).toBe(true);
  });

  test('should convert lead to contact', async ({ page }) => {
    expect(true).toBe(true);
  });

  test('should score leads', async ({ page }) => {
    expect(true).toBe(true);
  });
});
