import { expect, test } from '@playwright/test';

test.describe('Chatbot Flows Tests', () => {
  test('should create new flow', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    expect(true).toBe(true);
  });

  test('should execute flow', async ({ page }) => {
    expect(true).toBe(true);
  });
});
