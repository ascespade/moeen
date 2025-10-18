import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to dashboard', async({ page }) => {
    await page.goto('/');

    // Check if we can navigate to dashboard
    await page.click('text=لوحة التحكم');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to conversations', async({ page }) => {
    await page.goto('/dashboard');

    // Check if conversations link works
    await page.click('text=المحادثات');
    await expect(page).toHaveURL('/conversations');
  });

  test('should navigate to flow builder', async({ page }) => {
    await page.goto('/dashboard');

    // Check if flow link works
    await page.click('text=تدفق البوت');
    await expect(page).toHaveURL('/flow');
  });

  test('should navigate to review center', async({ page }) => {
    await page.goto('/dashboard');

    // Check if review link works
    await page.click('text=مركز المراجعة');
    await expect(page).toHaveURL('/review');
  });

  test('should navigate to admin users', async({ page }) => {
    await page.goto('/dashboard');

    // Check if admin users link works
    await page.click('text=المستخدمون');
    await expect(page).toHaveURL('/admin/users');
  });

  test('should navigate to settings', async({ page }) => {
    await page.goto('/dashboard');

    // Check if settings link works
    await page.click('text=الإعدادات');
    await expect(page).toHaveURL('/settings');
  });
});
