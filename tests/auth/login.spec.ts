import { test, expect } from '@playwright/test';

test.describe('Authentication Tests - Login', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display login page correctly', async ({ page }) => {
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login with admin credentials', async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Admin123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect (could go to dashboard or admin/dashboard)
    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });
    
    // Verify we're on a protected route (not login)
    expect(page.url()).not.toContain('/login');
    
    // Verify auth_token cookie exists
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    expect(authCookie).toBeDefined();
    expect(authCookie?.value).toBeTruthy();
  });

  test('should login with doctor credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'doctor@test.com');
    await page.fill('input[type="password"]', 'Doctor123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/(dashboard)/, { timeout: 15000 });
    expect(page.url()).not.toContain('/login');
    
    const cookies = await page.context().cookies();
    expect(cookies.find(c => c.name === 'auth_token')).toBeDefined();
  });

  test('should login with patient credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'patient@test.com');
    await page.fill('input[type="password"]', 'Patient123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/(dashboard)/, { timeout: 15000 });
    expect(page.url()).not.toContain('/login');
    
    const cookies = await page.context().cookies();
    expect(cookies.find(c => c.name === 'auth_token')).toBeDefined();
  });

  test('should login with staff credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'staff@test.com');
    await page.fill('input[type="password"]', 'Staff123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/(dashboard)/, { timeout: 15000 });
    expect(page.url()).not.toContain('/login');
    
    const cookies = await page.context().cookies();
    expect(cookies.find(c => c.name === 'auth_token')).toBeDefined();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForSelector('text=/خطأ|error|invalid|credentials/i', { timeout: 5000 });
    
    // Should still be on login page
    expect(page.url()).toContain('/login');
  });

  test('should use quick login buttons', async ({ page }) => {
    // Find and click admin quick login button
    const adminButton = page.locator('button:has-text("Admin")');
    await adminButton.click();
    
    // Wait for redirect (could be dashboard or admin/dashboard)
    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });
    expect(page.url()).not.toContain('/login');
  });
});
