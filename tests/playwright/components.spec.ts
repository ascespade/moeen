import { test, expect } from '@playwright/test';

test.describe('المكونات', () => {
  test('الأزرار تعمل', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
      await button.click();
    }
  });

  test('حقول الإدخال تعمل', async ({ page }) => {
    await page.goto('/login');
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      await expect(input).toBeVisible();
      await input.fill('test');
    }
  });

  test('القوائم المنسدلة تعمل', async ({ page }) => {
    await page.goto('/');
    const selects = page.locator('select');
    const count = await selects.count();
    
    for (let i = 0; i < count; i++) {
      const select = selects.nth(i);
      await expect(select).toBeVisible();
      await select.selectOption({ index: 0 });
    }
  });
});