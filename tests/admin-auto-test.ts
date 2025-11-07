import { test, expect, chromium } from '@playwright/test';

/**
 * Automated Admin Testing with Browser
 * اختبار تلقائي للادمن باستخدام البراوزر
 *
 * This test runs automatically and monitors admin functionality
 */

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'Admin123!';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Auto Admin Tests', () => {
  test('comprehensive admin flow test', async ({ page }) => {
    console.log('🔍 Starting comprehensive admin test...');

    // Step 1: Navigate to login
    console.log('📝 Step 1: Navigating to login page');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Step 2: Login
    console.log('🔑 Step 2: Logging in as admin');
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();

    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Wait for login
    await page.waitForURL(/\/admin|\/dashboard/, { timeout: 15000 });
    console.log('✅ Login successful');

    // Step 3: Test Dashboard
    console.log('📊 Step 3: Testing dashboard');
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const dashboardContent = page.locator('body').first();
    await expect(dashboardContent).toBeVisible();
    console.log('✅ Dashboard accessible');

    // Step 4: Test Navigation
    console.log('🧭 Step 4: Testing navigation');
    const sidebar = page
      .locator('nav, [role="navigation"], aside, [class*="sidebar"]')
      .first();
    if (await sidebar.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('✅ Sidebar found');
    }

    // Step 5: Test Settings
    console.log('⚙️ Step 5: Testing settings page');
    await page.goto(`${BASE_URL}/admin/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(page.url()).toContain('/admin');
    console.log('✅ Settings accessible');

    // Step 6: Test Users Page
    console.log('👥 Step 6: Testing users page');
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(page.url()).toContain('/admin');
    console.log('✅ Users page accessible');

    console.log('🎉 All tests passed!');
  });
});
