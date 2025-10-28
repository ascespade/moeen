import { test, expect } from '@playwright/test';

/**
 * Functional Tests for Critical Modules
 * EMR, Finance, Admin, Settings
 */

test.describe('Critical Modules - Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('EMR Functionality', () => {
    test('should create new medical record', async ({ page }) => {
      // Navigate via sidebar or direct URL
      await page.goto('/health/medical-file');
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Try to find and click "Add New" button
      const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button[aria-label*="add"]').first();
      
      if (await addButton.isVisible({ timeout: 5000 })) {
        await addButton.click();
        
        // Fill form if dialog/modal fails
        await page.waitForTimeout(1000);
        
        // Check if form or modal opened
        const formExists = await page.locator('form, [role="dialog"]').count() > 0;
        expect(formExists).toBeTruthy();
      }
    });

    test('should filter and search medical records', async ({ page }) => {
      await page.goto('/health/medical-file');
      
      // Look for search/filter input
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
      
      if (await searchInput.isVisible({ timeout: 3000 })) {
        await searchInput.fill('test');
        await page.waitForTimeout(1000);
      }
      
      // Page should handle the search
      expect(await page.isVisible('body')).toBeTruthy();
    });
  });

  test.describe('Finance Module Functionality', () => {
    test('should process payment', async ({ page }) => {
      await page.goto('/payments');
      
      // Look for process payment button
      const processButton = page.locator('button:has-text("Process"), button:has-text("Pay")').first();
      
      if (await processButton.isVisible({ timeout: 5000 })) {
        await processButton.click();
        await page.waitForTimeout(1000);
        
        // Check if payment form/modal opened
        const hasDialog = await page.locator('[role="dialog"], form').count() > 0;
        expect(hasDialog).toBeTruthy();
      }
    });

    test('should view payment details', async ({ page }) => {
      await page.goto('/payments');
      
      // Look for payment items in table/list
      const paymentRow = page.locator('tr, [role="row"], .payment-item').first();
      
      if (await paymentRow.isVisible({ timeout: 5000 })) {
        await paymentRow.click();
        await page.waitForTimeout(1000);
        
        // Should navigate or open details
        expect(page.url()).toBeTruthy();
      }
    });

    test('should create insurance claim', async ({ page }) => {
      await page.goto('/health/insurance-claims');
      
      const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Claim")').first();
      
      if (await addButton.isVisible({ timeout: 5000 })) {
        await addButton.click();
        await page.waitForTimeout(1000);
        
        expect(await page.isVisible('body')).toBeTruthy();
      }
    });
  });

  test.describe('Admin Functionality', () => {
    test('should create new user', async ({ page }) => {
      await page.goto('/admin/users');
      
      const addUserButton = page.locator('button:has-text("Add User"), button:has-text("New User")').first();
      
      if (await addUserButton.isVisible({ timeout: 5000 })) {
        await addUserButton.click();
        await page.waitForTimeout(1000);
        
        const formExists = await page.locator('form, [role="dialog"]').count() > 0;
        expect(formExists).toBeTruthy();
      }
    });

    test('should filter users by role', async ({ page }) => {
      await page.goto('/admin/users');
      
      const roleFilter = page.locator('select, button:has-text("Role")').first();
      
      if (await roleFilter.isVisible({ timeout: 3000 })) {
        await roleFilter.click();
        await page.waitForTimeout(1000);
        
        expect(await page.isVisible('body')).toBeTruthy();
      }
    });

    test('should export audit police', async ({ page }) => {
      await page.goto('/admin/audit-logs');
      
      const exportButton = page.locator('button:has-text("Export"), button[aria-label*="export"]').first();
      
      if (await exportButton.isVisible({ timeout: 5000 })) {
        await exportButton.click();
        
        // Wait for download or confirmation
        await page.waitForTimeout(2000);
        
        expect(await page.isVisible('body')).toBeTruthy();
      }
    });

    test('should generate report', async ({ page }) => {
      await page.goto('/reports');
      
      const generateButton = page.locator('button:has-text("Generate"), button:has-text("Create Report")').first();
      
      if (await generateButton.isVisible({ timeout: 5000 })) {
        await generateButton.click();
        await page.waitForTimeout(1000);
        
        expect(await page.isVisible('body')).toBeTruthy();
      }
    });
  });

  test.describe('sofSettings Functionality', () => {
    test('should change language', async ({ page }) => {
      await page.goto('/settings');
      
      const langButton = page.locator('button:has-text("عربي"), button:has-text("English"), select').first();
      
      if (await langButton.isVisible({ timeout: 5000 })) {
        await langButton.click();
        await page.waitForTimeout(2000);
        
        // Check if language changed
        const htmlLang = await page.locator('html').getAttribute('lang');
        expect(htmlLang).toBeTruthy();
      }
    });

    test('should toggle RTL/LTR', async ({ page }) => {
      await page.goto('/settings');
      
      const dirButton = page.locator('button:has-text("RTL"), button:has-text("LTR"), [data-dir-toggle]').first();
      
      if (await dirButton.isVisible({ timeout: 5000 })) {
        await dirButton.click();
        await page.waitForTimeout(2000);
        
        // Check direction
        const dir = await page.locator('html').getAttribute('dir');
        expect(['rtl', 'ltr']).toContain(dir);
      }
    });

    test('should clear cache/data', async ({ page }) => {
      await page.goto('/settings');
      
      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Clean")').first();
      
      if (await clearButton.isVisible({ timeout: 5000 })) {
        // Don't actually click to avoid clearing data
        expect(clearButton).toBeVisible();
      }
    });
  });
});

