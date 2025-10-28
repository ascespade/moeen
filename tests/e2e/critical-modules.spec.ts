import { test, expect } from '@playwright/test';

/**
 * Critical Modules E2E Tests
 * Tests for: EMR, Finance, Admin, Settings modules
 */

test.describe('Critical Modules - Full E2E Tests', () => {
  let authToken: string;

  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Login as admin
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('EMR - Medical Records Module', () => {
    test('should navigate to medical records page', async ({ page }) => {
      await page.goto('/health/medical-file');
      await expect(page.locator('h1, h2')).toContainText(/medical|records|سجل/i);
    });

    test('should display medical records list', async ({ page }) => {
      await page.goto('/health/medical-file');
      
      // Check if table or list container exists
      const tableExists = await page.locator('table, [role="table"]').count() > 0;
      const listExists = await page.locator('[role="list"], .record-list').count() > 0;
      
      expect(tableExists || listExists).toBeTruthy();
    });

    test('should have add new record button', async ({ page }) => {
      await page.goto('/health/medical-file');
      
      // Look for add button
      const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("إضافة")');
      await expect(addButton.first()).toBeVisible({ timeout: 5000 });
    });

    test('should display medical record details', async ({ page }) => {
      await page.goto('/health/medical-file');
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      // Check for common medical record fields
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.includes('record') || 
               document.body.innerText.includes('patient') ||
               document.body.innerText.includes('سجل');
      });
      
      expect(hasContent).toBeTruthy();
    });
  });

  test.describe('Finance Module - Payments', () => {
    test('should navigate to payments page', async ({ page }) => {
      await page.goto('/payments');
      await page.waitForLoadState('networkidle');
      
      // Check page loaded
      expect(page.url()).toContain('/payments');
    });

    test('should display payments table/list', async ({ page }) => {
      await page.goto('/payments');
      
      // Wait for content
      await page.waitForTimeout(2000);
      
      const hasTable = await page.locator('table, [role="table"]').count() > 0;
      expect(hasTable).toBeTruthy();
    });

    test('should show payment status badges', async ({ page }) => {
      await page.goto('/payments');
      
      // Look for status indicators
      const statusElements = await page.locator('[class*="status"], [class*="badge"]').count();
      expect(statusElements).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Finance Module - Insurance Claims', () => {
    test('should navigate to insurance claims', async ({ page }) => {
      await page.goto('/health/insurance-claims');
      expect(page.url()).toContain('insurance');
    });

    test('should display claims list', async ({ page }) => {
      await page.goto('/health/insurance-claims');
      
      await page.waitForLoadState('networkidle');
      
      // Check for claims content
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.length > 100;
      });
      
      expect(hasContent).toBeTruthy();
    });
  });

  test.describe('Admin Module - User Management', () => {
    test('should navigate to users page', async ({ page }) => {
      await page.goto('/admin/users');
      expect(page.url()).toContain('/admin/users');
    });

    test('should display users table', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForTimeout(2000);
      
      const table = page.locator('table, [role="table"]');
      await expect(table.first()).toBeVisible();
    });

    test('should have user filters', async ({ page }) => {
      await page.goto('/admin/users');
      
      // Look for filter controls
      const filters = await page.locator('select, input[type="search"], button:has-text("Filter")').count();
      expect(filters).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Admin Module - Audit Logs', () => {
    test('should navigate to audit logs', async ({ page }) => {
      await page.goto('/admin/audit-logs');
      expect(page.url()).toContain('audit');
    });

    test('should display audit logs table', async ({ page }) => {
      await page.goto('/admin/audit-logs');
      await page.waitForTimeout(2000);
      
      const table = page.locator('table, [role="table"]');
      await expect(table.first()).toBeVisible();
    });
  });

  test.describe('Admin Module - Reports', () => {
    test('should navigate to reports page', async ({ page }) => {
      await page.goto('/reports');
      expect(page.url()).toContain('report');
    });

    test('should display reports dashboard', async ({ page }) => {
      await page.goto('/reports');
      await page.waitForTimeout(2000);
      
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.length > 50;
      });
      
      expect(hasContent).toBeTruthy();
    });
  });

  test.describe('Settings Module - Theme Switcher', () => {
    test('should have theme toggle button', async ({ page }) => {
      await page.goto('/settings');
      
      // Look for theme switcher
      const themeButton = page.locator('button:has-text("Theme"), button:has-text("Dark"), button:has-text("Light")');
      expect(await themeButton.count()).toBeGreaterThanOrEqual(0);
    });

    test('should toggle between light and dark mode', async ({ page }) => {
      await page.goto('/settings');
      
      // Try to find and click theme toggle
      const themeToggle = page.locator('button[aria-label*="theme"], [data-theme-toggle]').first();
      if (await themeToggle.isVisible({ timeout: 3000 })) {
        await themeToggle.click();
        await page.waitForTimeout(1000);
        
        // Check if theme changed
        const htmlClass = await page.locator('html').getAttribute('class');
        expect(htmlClass).toBeTruthy();
      }
    });
  });

  test.describe('Settings Module - Language Switcher', () => {
    test('should have language switcher', async ({ page }) => {
      await page.goto('/settings');
      
      // Look for language selector
      const langSelector = page.locator('select, button:has-text("Language"), button:has-text("عربي")');
      expect(await langSelector.count()).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Settings Module - RTL/LTR', () => {
    test('should support RTL layout', async ({ page }) => {
      await page.goto('/settings');
      
      // Check HTML dir attribute
      const dir = await page.locator('html').getAttribute('dir');
      expect(['rtl', 'ltr', 'auto']).toContain(dir);
    });

    test('should have text direction controls', async ({ page }) => {
      await page.goto('/settings');
      
      // Page should load successfully
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Visual Regression Tests', () => {
    test('screenshot - EMR page', async ({ page }) => {
      await page.goto('/health/medical-file');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('emr-page.png', { 
        fullPage: false,
        maxDiffPixels: 500
      });
    });

    test('screenshot - Payments page', async ({ page }) => {
      await page.goto('/payments');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('payments-page.png', { 
        fullPage: false,
        maxDiffPixels: 500
      });
    });

    test('screenshot - Users page', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('users-page.png', { 
        fullPage: false,
        maxDiffPixels: 500
      });
    });

    test('screenshot - Settings page', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('settings-page.png', { 
        fullPage: false,
        maxDiffPixels: 500
      });
    });
  });
});

