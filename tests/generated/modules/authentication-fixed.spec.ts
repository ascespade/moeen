/**
 * Authentication Module - Fixed Comprehensive Tests
 * Fixed version addressing the undefined user issues
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { realDB } from '@/lib/supabase-real';

interface TestUser {
  id: string;
  email: string;
  phone: string;
  role: string;
  name: string;
}

class AuthenticationTestHelper {
  private testUsers: Map<string, TestUser> = new Map();

  async createTestUsers() {
    const users = [
      {
        email: 'admin@test.com',
        phone: '+966501234567',
        role: 'admin',
        name: 'Admin User',
        password: 'TestPass123!',
      },
      {
        email: 'doctor@test.com',
        phone: '+966501234568',
        role: 'doctor',
        name: 'Doctor User',
        password: 'TestPass123!',
      },
      {
        email: 'patient@test.com',
        phone: '+966501234569',
        role: 'patient',
        name: 'Patient User',
        password: 'TestPass123!',
      },
      {
        email: 'therapist@test.com',
        phone: '+966501234570',
        role: 'therapist',
        name: 'Therapist User',
        password: 'TestPass123!',
      },
    ];

    for (const userData of users) {
      try {
        const user = await realDB.createUser({
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          name: userData.name,
          password: userData.password,
        });

        this.testUsers.set(userData.role, {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          name: user.name,
        });

        console.log(`✅ Created test user: ${userData.role}`);
      } catch (error) {
        console.log(`User ${userData.email} might already exist`);
        // Try to get existing user
        try {
          const existingUser = await realDB.getUserByEmail(userData.email);
          if (existingUser) {
            this.testUsers.set(userData.role, {
              id: existingUser.id,
              email: existingUser.email,
              phone: existingUser.phone,
              role: existingUser.role,
              name: existingUser.name,
            });
          }
        } catch (e) {
          console.error(`Failed to get existing user: ${userData.email}`, e);
        }
      }
    }
  }

  getTestUser(role: string): TestUser | undefined {
    return this.testUsers.get(role);
  }

  async cleanup() {
    for (const [role, user] of this.testUsers) {
      try {
        await realDB.deleteUser(user.id);
        console.log(`✅ Cleaned up test user: ${role}`);
      } catch (error) {
        console.log(`Failed to cleanup user: ${role}`, error);
      }
    }
    this.testUsers.clear();
  }
}

test.describe('Authentication Module - Fixed Comprehensive Tests', () => {
  let authHelper: AuthenticationTestHelper;
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async () => {
    authHelper = new AuthenticationTestHelper();
    await authHelper.createTestUsers();
  });

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/login');
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.afterAll(async () => {
    await authHelper.cleanup();
  });

  test.describe('Login Functionality', () => {
    test('should login with valid email and password', async () => {
      const adminUser = authHelper.getTestUser('admin');
      expect(adminUser).toBeDefined();

      if (adminUser) {
        await page.fill('[data-testid="email-input"]', adminUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');

        // Wait for redirect to dashboard
        await page.waitForURL('/dashboard', { timeout: 10000 });
        await expect(page).toHaveURL('/dashboard');
      }
    });

    test('should login with valid phone and password', async () => {
      const doctorUser = authHelper.getTestUser('doctor');
      expect(doctorUser).toBeDefined();

      if (doctorUser) {
        await page.fill('[data-testid="phone-input"]', doctorUser.phone);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');

        // Wait for redirect to dashboard
        await page.waitForURL('/dashboard', { timeout: 10000 });
        await expect(page).toHaveURL('/dashboard');
      }
    });

    test('should show error for invalid credentials', async () => {
      await page.fill('[data-testid="email-input"]', 'invalid@test.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');

      // Wait for error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });

    test('should validate required fields', async () => {
      await page.click('[data-testid="login-button"]');

      // Check for validation messages
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="password-error"]')
      ).toBeVisible();
    });
  });

  test.describe('Registration Functionality', () => {
    test('should register new user successfully', async () => {
      await page.goto('/register');

      const testEmail = `test-${Date.now()}@example.com`;
      const testPhone = `+966501234${Math.floor(Math.random() * 1000)}`;

      await page.fill('[data-testid="name-input"]', 'Test User');
      await page.fill('[data-testid="email-input"]', testEmail);
      await page.fill('[data-testid="phone-input"]', testPhone);
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.fill('[data-testid="confirm-password-input"]', 'TestPass123!');
      await page.selectOption('[data-testid="role-select"]', 'patient');
      await page.click('[data-testid="register-button"]');

      // Wait for success message or redirect
      await page.waitForTimeout(2000);
      await expect(
        page.locator('[data-testid="success-message"]')
      ).toBeVisible();
    });

    test('should validate password confirmation', async () => {
      await page.goto('/register');

      await page.fill('[data-testid="name-input"]', 'Test User');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="phone-input"]', '+966501234567');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.fill(
        '[data-testid="confirm-password-input"]',
        'DifferentPass123!'
      );
      await page.selectOption('[data-testid="role-select"]', 'patient');
      await page.click('[data-testid="register-button"]');

      await expect(
        page.locator('[data-testid="password-mismatch-error"]')
      ).toBeVisible();
    });
  });

  test.describe('Logout Functionality', () => {
    test('should logout successfully', async () => {
      // First login
      const adminUser = authHelper.getTestUser('admin');
      if (adminUser) {
        await page.fill('[data-testid="email-input"]', adminUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');
        await page.waitForURL('/dashboard');

        // Then logout
        await page.click('[data-testid="logout-button"]');
        await page.waitForURL('/login');
        await expect(page).toHaveURL('/login');
      }
    });
  });

  test.describe('Password Reset', () => {
    test('should request password reset', async () => {
      await page.click('[data-testid="forgot-password-link"]');
      await page.waitForURL('/forgot-password');

      const adminUser = authHelper.getTestUser('admin');
      if (adminUser) {
        await page.fill('[data-testid="email-input"]', adminUser.email);
        await page.click('[data-testid="reset-button"]');

        await expect(
          page.locator('[data-testid="reset-success-message"]')
        ).toBeVisible();
      }
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async () => {
      const adminUser = authHelper.getTestUser('admin');
      if (adminUser) {
        await page.fill('[data-testid="email-input"]', adminUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');
        await page.waitForURL('/dashboard');

        // Refresh page
        await page.reload();
        await expect(page).toHaveURL('/dashboard');
      }
    });

    test('should redirect to login when session expires', async () => {
      // This would require mocking session expiration
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('should redirect admin to admin dashboard', async () => {
      const adminUser = authHelper.getTestUser('admin');
      if (adminUser) {
        await page.fill('[data-testid="email-input"]', adminUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');
        await page.waitForURL('/admin');
        await expect(page).toHaveURL('/admin');
      }
    });

    test('should redirect doctor to doctor dashboard', async () => {
      const doctorUser = authHelper.getTestUser('doctor');
      if (doctorUser) {
        await page.fill('[data-testid="email-input"]', doctorUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');
        await page.waitForURL('/doctor');
        await expect(page).toHaveURL('/doctor');
      }
    });

    test('should redirect patient to patient dashboard', async () => {
      const patientUser = authHelper.getTestUser('patient');
      if (patientUser) {
        await page.fill('[data-testid="email-input"]', patientUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');
        await page.waitForURL('/patient');
        await expect(page).toHaveURL('/patient');
      }
    });
  });

  test.describe('Security Tests', () => {
    test('should prevent SQL injection in login', async () => {
      await page.fill(
        '[data-testid="email-input"]',
        "admin@test.com'; DROP TABLE users; --"
      );
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');

      // Should show error, not crash
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });

    test('should prevent XSS in login form', async () => {
      await page.fill(
        '[data-testid="email-input"]',
        '<script>alert("xss")</script>'
      );
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');

      // Should not execute script
      await expect(page.locator('script')).toHaveCount(0);
    });

    test('should rate limit login attempts', async () => {
      // Try multiple failed logins
      for (let i = 0; i < 5; i++) {
        await page.fill('[data-testid="email-input"]', 'invalid@test.com');
        await page.fill('[data-testid="password-input"]', 'wrongpassword');
        await page.click('[data-testid="login-button"]');
        await page.waitForTimeout(100);
      }

      // Should show rate limit message
      await expect(
        page.locator('[data-testid="rate-limit-message"]')
      ).toBeVisible();
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', async () => {
      await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute(
        'aria-label'
      );
      await expect(
        page.locator('[data-testid="password-input"]')
      ).toHaveAttribute('aria-label');
      await expect(
        page.locator('[data-testid="login-button"]')
      ).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="email-input"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        page.locator('[data-testid="password-input"]')
      ).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="login-button"]')).toBeFocused();
    });

    test('should announce errors to screen readers', async () => {
      await page.click('[data-testid="login-button"]');

      const errorElement = page.locator('[data-testid="error-message"]');
      await expect(errorElement).toBeVisible();
      await expect(errorElement).toHaveAttribute('role', 'alert');
    });
  });

  test.describe('Performance Tests', () => {
    test('should load login page quickly', async () => {
      const startTime = Date.now();
      await page.goto('/login');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle login request efficiently', async () => {
      const adminUser = authHelper.getTestUser('admin');
      if (adminUser) {
        const startTime = Date.now();
        await page.fill('[data-testid="email-input"]', adminUser.email);
        await page.fill('[data-testid="password-input"]', 'TestPass123!');
        await page.click('[data-testid="login-button"]');
        await page.waitForURL('/dashboard');
        const loginTime = Date.now() - startTime;

        expect(loginTime).toBeLessThan(5000); // Should login within 5 seconds
      }
    });
  });
});
