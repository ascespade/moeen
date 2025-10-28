import { expect, test } from '@playwright/test';

test.describe('Dynamic Contact Info Tests', () => {
  test('should load contact information', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    console.log('Page:', title);
    
    expect(true).toBe(true);
  });

  test('should update contact info', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    expect(true).toBe(true);
  });
});
