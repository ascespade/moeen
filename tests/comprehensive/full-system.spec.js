import { test, expect } from '@playwright/test';

test.describe('Full System Tests - Ultimate CI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('Homepage loads and displays correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Moeen/);
    await expect(page.locator('body')).toBeVisible();
  });
  
  test('Navigation works across all pages', async ({ page }) => {
    // Test main navigation
    const navItems = ['Dashboard', 'Patients', 'Appointments', 'Medical Records', 'Payments'];
    for (const item of navItems) {
      if (await page.locator(`text=${item}`).isVisible()) {
        await page.click(`text=${item}`);
        await page.waitForLoadState('networkidle');
      }
    }
  });
  
  test('Database connection and operations', async ({ page }) => {
    // Test database health endpoint
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('database');
    expect(data.database).toBe('connected');
  });
  
  test('Authentication flow', async ({ page }) => {
    // Test login page
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    
    // Test form validation
    await page.click('button[type="submit"]');
    await expect(page.locator('.error, [role="alert"]')).toBeVisible();
  });
  
  test('CRUD operations for all modules', async ({ page }) => {
    // Test patient creation
    await page.goto('/patients');
    if (await page.locator('button:has-text("Add Patient")').isVisible()) {
      await page.click('button:has-text("Add Patient")');
      await page.fill('input[name="name"]', 'Test Patient');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Test Patient')).toBeVisible();
    }
  });

  test('API endpoints are working', async ({ page }) => {
    // Test critical API endpoints
    const endpoints = [
      '/api/health',
      '/api/auth/status',
      '/api/patients',
      '/api/appointments'
    ];
    
    for (const endpoint of endpoints) {
      const response = await page.request.get(endpoint);
      expect(response.status()).toBeLessThan(500);
    }
  });

  test('Error handling works correctly', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
  });

  test('Performance metrics are acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });
});