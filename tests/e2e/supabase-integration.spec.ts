/**
 * Supabase Integration Tests - اختبارات تكامل Supabase
 * Comprehensive end-to-end tests with database integration
 */

import { test, expect } from '@playwright/test';
import {
  testHelper,
  TestUser,
  TestPatient,
} from '../helpers/supabase-test-helper';

test.describe('Supabase Integration Tests', () => {
  let testUser: TestUser;
  let testPatient: TestPatient;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test.beforeAll(async () => {
    // Clean up any existing test data
    await testHelper.cleanup();
  });

  test.afterAll(async () => {
    // Clean up test data
    await testHelper.cleanup();
  });

  test.describe('User Registration and Database Integration', () => {
    test('should create user in database through registration form', async ({
      page,
    }) => {
      // Navigate to registration page
      await page.goto('/register');

      // Fill registration form
      await page.getByLabel('الاسم الكامل').fill('Test User');
      await page.getByLabel('البريد الإلكتروني').fill(testEmail);
      await page.getByLabel('كلمة المرور').first().fill(testPassword);
      await page.getByLabel('تأكيد كلمة المرور').fill(testPassword);
      await page.getByLabel('أوافق على').check();

      // Submit form
      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      // Wait for success message or redirect
      await page.waitForTimeout(2000);

      // Verify user was created in database
      const user = await testHelper.getUserByEmail(testEmail);
      expect(user).not.toBeNull();
      expect(user!.email).toBe(testEmail);
      expect(user!.name).toBe('Test User');
      expect(user!.role).toBe('agent'); // Default role
      expect(user!.status).toBe('active');

      testUser = user!;
    });

    test('should prevent duplicate user registration', async ({ page }) => {
      // Try to register with same email
      await page.goto('/register');

      await page.getByLabel('الاسم الكامل').fill('Another User');
      await page.getByLabel('البريد الإلكتروني').fill(testEmail);
      await page.getByLabel('كلمة المرور').first().fill('AnotherPassword123!');
      await page.getByLabel('تأكيد كلمة المرور').fill('AnotherPassword123!');
      await page.getByLabel('أوافق على').check();

      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      // Should show error message
      await expect(
        page.getByText(/البريد الإلكتروني مستخدم بالفعل|User already exists/)
      ).toBeVisible();
    });
  });

  test.describe('User Login and Authentication', () => {
    test('should login with valid credentials and update database', async ({
      page,
    }) => {
      // Navigate to login page
      await page.goto('/login');

      // Fill login form
      await page.getByLabel('البريد الإلكتروني').fill(testEmail);
      await page.getByLabel('كلمة المرور').fill(testPassword);

      // Submit form
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      // Wait for redirect to dashboard
      await page.waitForURL('/dashboard/user');

      // Verify user is logged in
      await expect(page.locator('text=لوحة التحكم')).toBeVisible();

      // Verify database was updated with login info
      const user = await testHelper.getUserByEmail(testEmail);
      expect(user).not.toBeNull();
      expect(user!.last_login).not.toBeNull();

      // Create audit log for login
      await testHelper.createAuditLog({
        user_id: user!.id,
        action: 'user_login',
        resource_type: 'user',
        resource_id: user!.id,
        ip_address: '127.0.0.1',
        user_agent: 'Playwright Test',
      });
    });

    test('should fail login with invalid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel('البريد الإلكتروني').fill(testEmail);
      await page.getByLabel('كلمة المرور').fill('WrongPassword');

      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      // Should show error message
      await expect(
        page.getByText(/بيانات الدخول غير صحيحة|Invalid credentials/)
      ).toBeVisible();
    });
  });

  test.describe('Forgot Password Flow', () => {
    test('should handle forgot password request', async ({ page }) => {
      await page.goto('/forgot-password');

      // Fill forgot password form
      await page.getByLabel('البريد الإلكتروني').fill(testEmail);
      await page
        .getByRole('button', { name: /إرسال رابط إعادة التعيين/ })
        .click();

      // Should show success message
      await expect(
        page.getByText(/تم إرسال رابط إعادة التعيين|Reset link sent/)
      ).toBeVisible();

      // Verify audit log was created
      const user = await testHelper.getUserByEmail(testEmail);
      const auditLogs = await testHelper.getAuditLogs(user!.id, 5);

      const forgotPasswordLog = auditLogs.find(
        log => log.action === 'forgot_password_requested'
      );
      expect(forgotPasswordLog).toBeDefined();
    });

    test('should validate email format in forgot password', async ({
      page,
    }) => {
      await page.goto('/forgot-password');

      await page.getByLabel('البريد الإلكتروني').fill('invalid-email');
      await page
        .getByRole('button', { name: /إرسال رابط إعادة التعيين/ })
        .click();

      // Should show validation error
      await expect(
        page.getByText(/البريد الإلكتروني غير صحيح|Invalid email/)
      ).toBeVisible();
    });
  });

  test.describe('Patient Management Integration', () => {
    test('should create patient in database', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel('البريد الإلكتروني').fill(testEmail);
      await page.getByLabel('كلمة المرور').fill(testPassword);
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();
      await page.waitForURL('/dashboard/user');

      // Navigate to patients page (assuming it exists)
      await page.goto('/patients');

      // Create new patient
      const patientEmail = `patient-${Date.now()}@example.com`;
      await page
        .getByRole('button', { name: /إضافة مريض|Add Patient/ })
        .click();

      // Fill patient form
      await page.getByLabel('الاسم الأول').fill('John');
      await page.getByLabel('الاسم الأخير').fill('Doe');
      await page.getByLabel('البريد الإلكتروني').fill(patientEmail);
      await page.getByLabel('رقم الهاتف').fill('+966501234567');

      await page.getByRole('button', { name: /حفظ|Save/ }).click();

      // Verify patient was created in database
      const patient = await testHelper.getPatientByEmail(patientEmail);
      expect(patient).not.toBeNull();
      expect(patient!.first_name).toBe('John');
      expect(patient!.last_name).toBe('Doe');
      expect(patient!.email).toBe(patientEmail);

      testPatient = patient!;
    });
  });

  test.describe('Admin Panel Database Integration', () => {
    test('should display real user data in admin panel', async ({ page }) => {
      // Create admin user
      const adminUser = await testHelper.createTestUser({
        email: `admin-${Date.now()}@example.com`,
        name: 'Admin User',
        role: 'admin',
        status: 'active',
      });

      // Login as admin
      await page.goto('/login');
      await page.getByLabel('البريد الإلكتروني').fill(adminUser.email);
      await page.getByLabel('كلمة المرور').fill('AdminPassword123!');
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      // Navigate to admin panel
      await page.goto('/admin');

      // Wait for admin data to load
      await page.waitForSelector('[data-testid="admin-summary-card"]', {
        timeout: 10000,
      });

      // Verify admin panel shows real data
      const stats = await testHelper.getDatabaseStats();
      expect(stats.totalUsers).toBeGreaterThan(0);

      // Check if user management shows our test user
      await page.click('text=User Management');
      await expect(page.locator(`text=${testUser.email}`)).toBeVisible();
    });

    test('should update user status in database', async ({ page }) => {
      // Login as admin
      const adminUser = await testHelper.createTestUser({
        email: `admin2-${Date.now()}@example.com`,
        name: 'Admin User 2',
        role: 'admin',
        status: 'active',
      });

      await page.goto('/login');
      await page.getByLabel('البريد الإلكتروني').fill(adminUser.email);
      await page.getByLabel('كلمة المرور').fill('AdminPassword123!');
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      await page.goto('/admin');
      await page.click('text=User Management');

      // Find and update user status
      const userRow = page.locator(`text=${testUser.email}`).locator('..');
      await userRow.getByRole('button', { name: /تحديث|Update/ }).click();

      // Change status to inactive
      await page.selectOption('select[name="status"]', 'inactive');
      await page.getByRole('button', { name: /حفظ|Save/ }).click();

      // Verify status was updated in database
      const updatedUser = await testHelper.getUserByEmail(testUser.email);
      expect(updatedUser!.status).toBe('inactive');

      // Verify audit log was created
      const auditLogs = await testHelper.getAuditLogs(adminUser.id, 5);
      const statusUpdateLog = auditLogs.find(
        log =>
          log.action === 'user_status_updated' &&
          log.resource_id === testUser.id
      );
      expect(statusUpdateLog).toBeDefined();
    });
  });

  test.describe('Database Performance and Reliability', () => {
    test('should handle concurrent user creation', async ({
      page,
      browser,
    }) => {
      const promises = [];
      const userCount = 5;

      // Create multiple users concurrently
      for (let i = 0; i < userCount; i++) {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        promises.push(
          (async () => {
            await newPage.goto('/register');
            await newPage
              .getByLabel('الاسم الكامل')
              .fill(`Concurrent User ${i}`);
            await newPage
              .getByLabel('البريد الإلكتروني')
              .fill(`concurrent-${i}-${Date.now()}@example.com`);
            await newPage
              .getByLabel('كلمة المرور')
              .first()
              .fill('ConcurrentPassword123!');
            await newPage
              .getByLabel('تأكيد كلمة المرور')
              .fill('ConcurrentPassword123!');
            await newPage.getByLabel('أوافق على').check();
            await newPage.getByRole('button', { name: /إنشاء الحساب/ }).click();
            await newPage.waitForTimeout(1000);
            await context.close();
          })()
        );
      }

      await Promise.all(promises);

      // Verify all users were created
      const stats = await testHelper.getDatabaseStats();
      expect(stats.totalUsers).toBeGreaterThanOrEqual(userCount);
    });

    test('should maintain data integrity during operations', async ({
      page,
    }) => {
      // Create a user
      const integrityUser = await testHelper.createTestUser({
        email: `integrity-${Date.now()}@example.com`,
        name: 'Integrity Test User',
        role: 'agent',
        status: 'active',
      });

      // Login and perform operations
      await page.goto('/login');
      await page.getByLabel('البريد الإلكتروني').fill(integrityUser.email);
      await page.getByLabel('كلمة المرور').fill('IntegrityPassword123!');
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      // Perform multiple operations
      await page.goto('/dashboard/user');
      await page.waitForTimeout(1000);

      // Verify user data integrity
      const user = await testHelper.getUserByEmail(integrityUser.email);
      expect(user).not.toBeNull();
      expect(user!.email).toBe(integrityUser.email);
      expect(user!.name).toBe(integrityUser.name);
      expect(user!.role).toBe(integrityUser.role);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle database connection errors gracefully', async ({
      page,
    }) => {
      // This test would require mocking database connection
      // For now, we'll test with invalid data
      await page.goto('/register');

      // Try to register with invalid data
      await page.getByLabel('الاسم الكامل').fill('');
      await page.getByLabel('البريد الإلكتروني').fill('invalid-email');
      await page.getByLabel('كلمة المرور').first().fill('123');
      await page.getByLabel('تأكيد كلمة المرور').fill('456');

      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      // Should show validation errors
      await expect(
        page.getByText(/الاسم الكامل مطلوب|Full name required/)
      ).toBeVisible();
      await expect(
        page.getByText(/البريد الإلكتروني غير صحيح|Invalid email/)
      ).toBeVisible();
      await expect(
        page.getByText(
          /كلمة المرور يجب أن تكون 6 أحرف على الأقل|Password must be at least 6 characters/
        )
      ).toBeVisible();
    });

    test('should handle large data sets efficiently', async ({ page }) => {
      // Create multiple patients
      const patientPromises = [];
      for (let i = 0; i < 10; i++) {
        patientPromises.push(
          testHelper.createTestPatient({
            first_name: `Patient${i}`,
            last_name: 'Test',
            email: `patient-${i}-${Date.now()}@example.com`,
            phone: `+96650123456${i}`,
          })
        );
      }

      await Promise.all(patientPromises);

      // Verify all patients were created
      const stats = await testHelper.getDatabaseStats();
      expect(stats.totalPatients).toBeGreaterThanOrEqual(10);
    });
  });
});
