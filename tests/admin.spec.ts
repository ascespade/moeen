import { test, expect } from '@playwright/test';

/**
 * Automated Admin User Tests
 * اختبارات تلقائية لمستخدم الادمن
 */

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'Admin123!';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

// Helper function to login
async function loginAsAdmin(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  
  await emailInput.fill(ADMIN_EMAIL);
  await passwordInput.fill(ADMIN_PASSWORD);
  
  const submitButton = page.locator('button[type="submit"]').first();
  await submitButton.click();
  
  await page.waitForURL(/\/admin|\/dashboard/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Admin User Tests', () => {
  test('should login as admin successfully', async ({ page }) => {
    await loginAsAdmin(page);
    expect(page.url()).toMatch(/\/admin|\/dashboard/);
  });

  test('should access admin dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    
    const dashboardTitle = page.locator('text=/dashboard|لوحة|إحصائيات/i').first();
    await expect(dashboardTitle).toBeVisible({ timeout: 5000 });
  });

  test('should access admin settings', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/settings`);
    await page.waitForLoadState('networkidle');
    
    const settingsTitle = page.locator('text=/settings|إعدادات/i').first();
    await expect(settingsTitle).toBeVisible({ timeout: 5000 });
  });

  test('should access admin users page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin');
  });

  test('should have admin navigation sidebar', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/dashboard`);
    
    const sidebar = page.locator('nav, [role="navigation"], aside, [class*="sidebar"]').first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });
});
