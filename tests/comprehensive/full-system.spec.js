
import { test, expect } from '@playwright/test';

test.describe('Comprehensive System Tests', () => {
  test('Full system integration test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Moeen/);
    
    // Test all major functionality
    await testNavigation(page);
    await testDatabaseConnection(page);
    await testAuthentication(page);
    await testCRUDOperations(page);
  });
  
  async function testNavigation(page) {
    const navItems = ['Dashboard', 'Patients', 'Appointments', 'Medical Records'];
    for (const item of navItems) {
      if (await page.locator(`text=${item}`).isVisible()) {
        await page.click(`text=${item}`);
        await page.waitForLoadState('networkidle');
      }
    }
  }
  
  async function testDatabaseConnection(page) {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.database).toBe('connected');
  }
  
  async function testAuthentication(page) {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
  }
  
  async function testCRUDOperations(page) {
    // Test patient CRUD
    await page.goto('/patients');
    if (await page.locator('button:has-text("Add Patient")').isVisible()) {
      await page.click('button:has-text("Add Patient")');
      await page.fill('input[name="name"]', 'Test Patient');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Test Patient')).toBeVisible();
    }
  }
});
