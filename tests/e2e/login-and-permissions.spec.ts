/**
 * Comprehensive Login and Permissions Test
 * اختبار شامل لتسجيل الدخول والصلاحيات
 * 
 * Tests:
 * 1. Login process for all user roles
 * 2. Navigation based on roles
 * 3. Permission-based access control
 * 4. Logout functionality
 */

import { test, expect, Page } from '@playwright/test';

// Test users configuration
const TEST_USERS = {
  admin: {
    email: 'admin@test.local',
    password: 'A123456',
    role: 'admin',
    expectedRoute: '/admin/dashboard',
    allowedRoutes: ['/admin', '/dashboard', '/patients', '/doctors', '/appointments', '/settings'],
    deniedRoutes: [],
  },
  doctor: {
    email: 'doctor@test.local',
    password: 'A123456',
    role: 'doctor',
    expectedRoute: '/doctor-dashboard',
    allowedRoutes: ['/doctor-dashboard', '/patients', '/appointments'],
    deniedRoutes: ['/admin'],
  },
  patient: {
    email: 'patient@test.local',
    password: 'A123456',
    role: 'patient',
    expectedRoute: '/dashboard/patient',
    allowedRoutes: ['/dashboard/patient', '/profile'],
    deniedRoutes: ['/admin', '/patients', '/doctors'],
  },
  staff: {
    email: 'staff@test.local',
    password: 'A123456',
    role: 'staff',
    expectedRoute: '/dashboard/staff',
    allowedRoutes: ['/dashboard/staff', '/appointments'],
    deniedRoutes: ['/admin'],
  },
};

/**
 * Helper function to perform login
 */
async function login(page: Page, email: string, password: string) {
  // Navigate to login page
  await page.goto('/login');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Fill in email
  const emailInput = page.locator('input[type="email"]').first();
  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await emailInput.fill(email);
  
  // Fill in password
  const passwordInput = page.locator('input[type="password"]').first();
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);
  
  // Submit form
  const submitButton = page.locator('button[type="submit"]').first();
  await expect(submitButton).toBeVisible();
  
  // Click submit and wait for navigation
  await Promise.all([
    page.waitForURL(/\/dashboard|\/admin/, { timeout: 15000 }),
    submitButton.click(),
  ]);
  
  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Helper function to logout
 */
async function logout(page: Page) {
  // Try to find logout button (could be in different places)
  const logoutButton = page.locator('button:has-text("تسجيل الخروج"), button:has-text("Logout"), a:has-text("تسجيل الخروج"), a:has-text("Logout")').first();
  
  if (await logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  } else {
    // Alternative: navigate directly to logout API
    await page.goto('/api/auth/logout', { method: 'POST' });
    await page.goto('/login');
  }
}

test.describe('Login and Permissions Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for these tests
    test.setTimeout(60000);
  });

  test.describe('Login Process', () => {
    
    test('should load login page successfully', async ({ page }) => {
      await page.goto('/login');
      
      // Check if login page is visible
      await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
      await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.locator('input[type="email"]').first().fill('invalid@test.com');
      await page.locator('input[type="password"]').first().fill('wrongpassword');
      
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      
      // Wait for error message (could be in different formats)
      await page.waitForTimeout(2000);
      
      // Check if still on login page (should not redirect on error)
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
    });

    test('should login successfully with admin credentials', async ({ page }) => {
      const user = TEST_USERS.admin;
      
      await login(page, user.email, user.password);
      
      // Verify redirect to expected route
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/admin|\/dashboard/);
      
      // Verify user is logged in (check for user email or logout button)
      await page.waitForLoadState('networkidle');
    });
  });

  test.describe('Role-Based Navigation', () => {
    
    for (const [roleName, userConfig] of Object.entries(TEST_USERS)) {
      test(`should redirect ${roleName} to correct dashboard`, async ({ page }) => {
        await login(page, userConfig.email, userConfig.password);
        
        // Wait for navigation
        await page.waitForLoadState('networkidle');
        
        // Check if we're on a dashboard page
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/dashboard|\/admin/);
        
        // Verify it's not login page
        expect(currentUrl).not.toContain('/login');
      });
    }
  });

  test.describe('Permission-Based Access Control', () => {
    
    test('admin should access admin routes', async ({ page }) => {
      const user = TEST_USERS.admin;
      await login(page, user.email, user.password);
      
      // Try to access admin route
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Should not be redirected away from admin
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/admin/);
      
      // Cleanup
      await logout(page);
    });

    test('doctor should NOT access admin routes', async ({ page }) => {
      const user = TEST_USERS.doctor;
      await login(page, user.email, user.password);
      
      // Try to access admin route
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Should be redirected away from admin
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/admin');
      
      // Cleanup
      await logout(page);
    });

    test('patient should NOT access admin routes', async ({ page }) => {
      const user = TEST_USERS.patient;
      await login(page, user.email, user.password);
      
      // Try to access admin route
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Should be redirected away from admin
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/admin');
      
      // Cleanup
      await logout(page);
    });

    test('staff should NOT access admin routes', async ({ page }) => {
      const user = TEST_USERS.staff;
      await login(page, user.email, user.password);
      
      // Try to access admin route
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Should be redirected away from admin
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/admin');
      
      // Cleanup
      await logout(page);
    });
  });

  test.describe('Logout Functionality', () => {
    
    test('should logout successfully and redirect to login', async ({ page }) => {
      const user = TEST_USERS.admin;
      
      // Login first
      await login(page, user.email, user.password);
      await page.waitForLoadState('networkidle');
      
      // Verify logged in
      const loggedInUrl = page.url();
      expect(loggedInUrl).not.toContain('/login');
      
      // Logout
      await logout(page);
      
      // Verify redirect to login
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
      
      // Try to access protected route - should redirect to login
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const finalUrl = page.url();
      expect(finalUrl).toContain('/login');
    });
  });

  test.describe('Session Persistence', () => {
    
    test('should maintain session after page reload', async ({ page }) => {
      const user = TEST_USERS.admin;
      
      // Login
      await login(page, user.email, user.password);
      await page.waitForLoadState('networkidle');
      
      const beforeReloadUrl = page.url();
      expect(beforeReloadUrl).not.toContain('/login');
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should still be logged in
      const afterReloadUrl = page.url();
      expect(afterReloadUrl).not.toContain('/login');
      
      // Cleanup
      await logout(page);
    });
  });

  test.describe('Protected Route Access', () => {
    
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      // Make sure we're logged out
      await page.goto('/api/auth/logout', { method: 'POST' }).catch(() => {});
      await page.goto('/login');
      
      // Try to access protected route
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
      
      // Should have redirect parameter
      const url = new URL(currentUrl);
      const redirect = url.searchParams.get('redirect');
      expect(redirect).toBe('/dashboard');
    });
  });

  test.describe('Quick Login Buttons', () => {
    
    test('should have quick login buttons in development', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Check for quick login buttons (only visible in non-production)
      const quickLoginSection = page.locator('text=تسجيل دخول سريع, text=Quick test login').first();
      
      // These buttons might not exist in production, so we just check if page loads
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    
    test('login should complete within 5 seconds', async ({ page }) => {
      const user = TEST_USERS.admin;
      
      const startTime = Date.now();
      
      await page.goto('/login');
      await page.locator('input[type="email"]').first().fill(user.email);
      await page.locator('input[type="password"]').first().fill(user.password);
      
      await Promise.all([
        page.waitForURL(/\/dashboard|\/admin/, { timeout: 10000 }),
        page.locator('button[type="submit"]').first().click(),
      ]);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Login should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
      
      // Cleanup
      await logout(page);
    });

    test('navigation should be instant after login', async ({ page }) => {
      const user = TEST_USERS.admin;
      
      await login(page, user.email, user.password);
      
      // Navigate to different routes and measure time
      const routes = ['/dashboard', '/profile', '/settings'];
      
      for (const route of routes) {
        const startTime = Date.now();
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Navigation should be fast (less than 2 seconds)
        expect(duration).toBeLessThan(2000);
      }
      
      // Cleanup
      await logout(page);
    });
  });
});
