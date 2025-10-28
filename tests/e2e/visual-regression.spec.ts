import { expect, test } from '@playwright/test';

/**
 * Visual Regression Tests for Critical Modules
 */

test.describe('Visual Regression - Critical Modules', () => {
  test.beforeEach(async ({ page }) => {
    // Go to homepage first
    await page.goto('/');
  });

  test('visual - EMR module layout', async ({ page }) => {
    await page.goto('/health/medical-file');
    await page.waitForLoadState('networkidle');
    
    // Full page screenshot
    await expect(page).toHaveScreenshot('visual-emr-full.png', {
      fullPage: true,
      maxDiffPixels: 1000,
      threshold: 0.2
    });
  });

  test('visual - Finance/Payments module', async ({ page }) => {
    await page.goto('/payments');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('visual-payments-full.png', {
      fullPage: true,
      maxDiffPixels: 1000,
      threshold: 0.2
    });
  });

  test('visual - Admin Users module', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('visual-admin-users-full.png', {
      fullPage: true,
      maxDiffPixels: 1000,
      threshold: 0.2
    });
  });

  test('visual - Settings module', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('visual-settings-full.png', {
      fullPage: true,
      maxDiffPixels: 1000,
      threshold: 0.2
    });
  });

  test('visual - Theme light mode', async ({ page }) => {
    await page.goto('/settings');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('visual-settings-light.png', {
      fullPage: false,
      maxDiffPixels: 500,
      threshold: 0.1
    });
  });

  test('visual - Theme dark mode', async ({ page }) => {
    await page.goto('/settings');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('visual-settings-dark.png', {
      fullPage: false,
      maxDiffPixels: 500,
      threshold: 0.1
    });
  });

  test('visual - RTL layout', async ({ page }) => {
    await page.goto('/');
    
    // Set RTL direction
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('visual-rtl-layout.png', {
      fullPage: false,
      maxDiffPixels: 500,
      threshold: 0.1
    });
  });
});

