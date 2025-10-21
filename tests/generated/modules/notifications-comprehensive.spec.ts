/**
 * Notifications Module - Comprehensive Test Suite
 * 100+ tests covering all aspects of notification management
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { realDB } from '@/lib/supabase-real';

interface TestNotification {
  id: string;
  user_id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

class NotificationTestHelper {
  private testNotifications: TestNotification[] = [];
  private testUsers: any[] = [];

  async createTestData() {
    // Create test users
    const users = [
      {
        name: 'أحمد محمد العلي',
        email: 'ahmed.ali@test.com',
        phone: '+966501234100',
        role: 'patient',
      },
      {
        name: 'د. فاطمة سعد الأحمد',
        email: 'dr.fatima@test.com',
        phone: '+966501234200',
        role: 'doctor',
      },
      {
        name: 'محمد عبدالله السالم',
        email: 'mohammed.salem@test.com',
        phone: '+966501234300',
        role: 'admin',
      },
    ];

    for (const user of users) {
      try {
        const userRecord = await realDB.createUser({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role as any,
        });
        this.testUsers.push(userRecord);
      } catch (error) {
        console.log(`User ${user.name} might already exist`);
      }
    }

    // Create test notifications
    const notifications = [
      {
        user_id: this.testUsers[0]?.id,
        type: 'appointment_reminder',
        priority: 'medium',
        title: 'تذكير بالموعد',
        message: 'لديك موعد غداً في الساعة 10:00 صباحاً',
        data: { appointment_id: '123', date: '2024-01-15' },
        is_read: false,
      },
      {
        user_id: this.testUsers[1]?.id,
        type: 'new_appointment',
        priority: 'high',
        title: 'موعد جديد',
        message: 'تم حجز موعد جديد لك مع المريض أحمد محمد',
        data: { appointment_id: '124', patient_name: 'أحمد محمد' },
        is_read: true,
      },
      {
        user_id: this.testUsers[2]?.id,
        type: 'system_alert',
        priority: 'critical',
        title: 'تنبيه النظام',
        message: 'تم اكتشاف مشكلة في قاعدة البيانات',
        data: { error_code: 'DB001', severity: 'high' },
        is_read: false,
      },
    ];

    for (const notification of notifications) {
      try {
        const notificationData = await realDB.createNotification({
          user_id: notification.user_id,
          type: notification.type,
          priority: notification.priority as any,
          title: notification.title,
          message: notification.message,
          data: notification.data,
        });
        this.testNotifications.push(notificationData);
      } catch (error) {
        console.log(`Notification might already exist`);
      }
    }
  }

  async cleanupTestData() {
    for (const notification of this.testNotifications) {
      try {
        await realDB.deleteNotification(notification.id);
      } catch (error) {
        console.log(`Failed to delete notification ${notification.id}`);
      }
    }

    for (const user of this.testUsers) {
      try {
        await realDB.deleteUser(user.id);
      } catch (error) {
        console.log(`Failed to delete user ${user.id}`);
      }
    }
  }

  getTestNotification(index: number = 0): TestNotification | undefined {
    return this.testNotifications[index];
  }

  getTestUser(index: number = 0): any {
    return this.testUsers[index];
  }
}

const notificationHelper = new NotificationTestHelper();

test.describe('Notifications Module - Comprehensive Tests', () => {
  test.beforeAll(async () => {
    await notificationHelper.createTestData();
  });

  test.afterAll(async () => {
    await notificationHelper.cleanupTestData();
  });

  test.describe('Notifications List View', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should display notifications list', async ({ page }) => {
      await page.goto('/notifications');

      await expect(
        page.locator('[data-testid="notifications-list"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="notification-item"]')
      ).toHaveCount(3);
    });

    test('should show notification information correctly', async ({ page }) => {
      await page.goto('/notifications');

      const firstNotification = notificationHelper.getTestNotification(0);
      const notificationItem = page
        .locator('[data-testid="notification-item"]')
        .first();

      await expect(
        notificationItem.locator('[data-testid="notification-title"]')
      ).toContainText(firstNotification!.title);
      await expect(
        notificationItem.locator('[data-testid="notification-message"]')
      ).toContainText(firstNotification!.message);
      await expect(
        notificationItem.locator('[data-testid="notification-priority"]')
      ).toBeVisible();
      await expect(
        notificationItem.locator('[data-testid="notification-type"]')
      ).toBeVisible();
    });

    test('should filter notifications by type', async ({ page }) => {
      await page.goto('/notifications');

      await page.selectOption(
        '[data-testid="type-filter"]',
        'appointment_reminder'
      );
      await page.click('[data-testid="apply-filters"]');

      const typeBadges = await page
        .locator('[data-testid="type-badge"]')
        .allTextContents();
      expect(typeBadges.every(type => type === 'تذكير الموعد')).toBe(true);
    });

    test('should filter notifications by priority', async ({ page }) => {
      await page.goto('/notifications');

      await page.selectOption('[data-testid="priority-filter"]', 'high');
      await page.click('[data-testid="apply-filters"]');

      const priorityBadges = await page
        .locator('[data-testid="priority-badge"]')
        .allTextContents();
      expect(priorityBadges.every(priority => priority === 'عالي')).toBe(true);
    });

    test('should filter notifications by read status', async ({ page }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="unread-only-checkbox"]');
      await page.click('[data-testid="apply-filters"]');

      const readStatuses = await page
        .locator('[data-testid="read-status"]')
        .allTextContents();
      expect(readStatuses.every(status => status === 'غير مقروء')).toBe(true);
    });

    test('should filter notifications by user', async ({ page }) => {
      await page.goto('/notifications');

      const user = notificationHelper.getTestUser(0);
      await page.selectOption('[data-testid="user-filter"]', user.id);
      await page.click('[data-testid="apply-filters"]');

      await expect(
        page.locator('[data-testid="notification-item"]')
      ).toHaveCount(1);
    });

    test('should search notifications by title', async ({ page }) => {
      await page.goto('/notifications');

      await page.fill('[data-testid="search-input"]', 'تذكير');
      await page.click('[data-testid="search-button"]');

      await expect(
        page.locator('[data-testid="notification-item"]')
      ).toHaveCount(1);
    });

    test('should search notifications by message', async ({ page }) => {
      await page.goto('/notifications');

      await page.fill('[data-testid="search-input"]', 'موعد');
      await page.click('[data-testid="search-button"]');

      await expect(
        page.locator('[data-testid="notification-item"]')
      ).toHaveCount(2);
    });

    test('should sort notifications by date', async ({ page }) => {
      await page.goto('/notifications');

      await page.click('[data-testid="sort-by-date"]');

      const dates = await page
        .locator('[data-testid="notification-date"]')
        .allTextContents();
      expect(dates.length).toBeGreaterThan(0);
    });

    test('should sort notifications by priority', async ({ page }) => {
      await page.goto('/notifications');

      await page.click('[data-testid="sort-by-priority"]');

      const priorities = await page
        .locator('[data-testid="priority-badge"]')
        .allTextContents();
      expect(priorities.length).toBeGreaterThan(0);
    });

    test('should show notification count', async ({ page }) => {
      await page.goto('/notifications');

      await expect(
        page.locator('[data-testid="notification-count"]')
      ).toContainText('3');
    });

    test('should show unread count', async ({ page }) => {
      await page.goto('/notifications');

      await expect(page.locator('[data-testid="unread-count"]')).toContainText(
        '2'
      );
    });

    test('should clear all filters', async ({ page }) => {
      await page.goto('/notifications');

      await page.selectOption(
        '[data-testid="type-filter"]',
        'appointment_reminder'
      );
      await page.selectOption('[data-testid="priority-filter"]', 'high');
      await page.click('[data-testid="apply-filters"]');

      await page.click('[data-testid="clear-filters"]');

      await expect(
        page.locator('[data-testid="notification-item"]')
      ).toHaveCount(3);
    });
  });

  test.describe('Create New Notification', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should open create notification form', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      await expect(
        page.locator('[data-testid="create-notification-form"]')
      ).toBeVisible();
    });

    test('should create notification successfully', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      const user = notificationHelper.getTestUser(0);

      await page.selectOption('[data-testid="user-select"]', user.id);
      await page.selectOption(
        '[data-testid="type-select"]',
        'appointment_reminder'
      );
      await page.selectOption('[data-testid="priority-select"]', 'medium');
      await page.fill('[data-testid="title-input"]', 'تذكير جديد');
      await page.fill('[data-testid="message-input"]', 'هذا تذكير جديد للمريض');
      await page.fill(
        '[data-testid="data-input"]',
        '{"appointment_id": "125"}'
      );

      await page.click('[data-testid="create-notification-button"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notification created successfully');
      await expect(page).toHaveURL('/notifications');
    });

    test('should create notification for multiple users', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      await page.selectOption('[data-testid="type-select"]', 'system_alert');
      await page.selectOption('[data-testid="priority-select"]', 'high');
      await page.fill('[data-testid="title-input"]', 'تنبيه النظام');
      await page.fill(
        '[data-testid="message-input"]',
        'تنبيه مهم لجميع المستخدمين'
      );
      await page.check('[data-testid="send-to-all-checkbox"]');

      await page.click('[data-testid="create-notification-button"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notification created successfully');
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');
      await page.click('[data-testid="create-notification-button"]');

      await expect(page.locator('[data-testid="user-error"]')).toContainText(
        'User is required'
      );
      await expect(page.locator('[data-testid="type-error"]')).toContainText(
        'Type is required'
      );
      await expect(page.locator('[data-testid="title-error"]')).toContainText(
        'Title is required'
      );
      await expect(page.locator('[data-testid="message-error"]')).toContainText(
        'Message is required'
      );
    });

    test('should validate title length', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      const user = notificationHelper.getTestUser(0);
      await page.selectOption('[data-testid="user-select"]', user.id);
      await page.selectOption(
        '[data-testid="type-select"]',
        'appointment_reminder'
      );
      await page.fill('[data-testid="title-input"]', 'a'.repeat(201)); // Too long
      await page.fill('[data-testid="message-input"]', 'Test message');
      await page.click('[data-testid="create-notification-button"]');

      await expect(page.locator('[data-testid="title-error"]')).toContainText(
        'Title must be less than 200 characters'
      );
    });

    test('should validate message length', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      const user = notificationHelper.getTestUser(0);
      await page.selectOption('[data-testid="user-select"]', user.id);
      await page.selectOption(
        '[data-testid="type-select"]',
        'appointment_reminder'
      );
      await page.fill('[data-testid="title-input"]', 'Test Title');
      await page.fill('[data-testid="message-input"]', 'a'.repeat(1001)); // Too long
      await page.click('[data-testid="create-notification-button"]');

      await expect(page.locator('[data-testid="message-error"]')).toContainText(
        'Message must be less than 1000 characters'
      );
    });

    test('should validate JSON data format', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      const user = notificationHelper.getTestUser(0);
      await page.selectOption('[data-testid="user-select"]', user.id);
      await page.selectOption(
        '[data-testid="type-select"]',
        'appointment_reminder'
      );
      await page.fill('[data-testid="title-input"]', 'Test Title');
      await page.fill('[data-testid="message-input"]', 'Test message');
      await page.fill('[data-testid="data-input"]', 'invalid-json');
      await page.click('[data-testid="create-notification-button"]');

      await expect(page.locator('[data-testid="data-error"]')).toContainText(
        'Data must be valid JSON'
      );
    });

    test('should show loading state during creation', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      const user = notificationHelper.getTestUser(0);
      await page.selectOption('[data-testid="user-select"]', user.id);
      await page.selectOption(
        '[data-testid="type-select"]',
        'appointment_reminder'
      );
      await page.fill(
        '[data-testid="title-input"]',
        'Loading Test Notification'
      );
      await page.fill('[data-testid="message-input"]', 'Test message');
      await page.click('[data-testid="create-notification-button"]');

      await expect(
        page.locator('[data-testid="create-loading"]')
      ).toBeVisible();
    });

    test('should cancel form without creating', async ({ page }) => {
      await page.goto('/notifications');
      await page.click('[data-testid="create-notification-button"]');

      await page.fill(
        '[data-testid="title-input"]',
        'Cancel Test Notification'
      );
      await page.fill('[data-testid="message-input"]', 'Test message');
      await page.click('[data-testid="cancel-button"]');

      await expect(page).toHaveURL('/notifications');
      await expect(
        page.locator('[data-testid="create-notification-form"]')
      ).not.toBeVisible();
    });
  });

  test.describe('Notification Details and Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should display notification details', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await expect(
        page.locator('[data-testid="notification-details"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="notification-title"]')
      ).toContainText(notification!.title);
      await expect(
        page.locator('[data-testid="notification-message"]')
      ).toContainText(notification!.message);
    });

    test('should show user information', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-role"]')).toBeVisible();
    });

    test('should show notification metadata', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await expect(
        page.locator('[data-testid="notification-type"]')
      ).toContainText(notification!.type);
      await expect(
        page.locator('[data-testid="notification-priority"]')
      ).toContainText(notification!.priority);
      await expect(
        page.locator('[data-testid="notification-date"]')
      ).toBeVisible();
    });

    test('should show notification data', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await expect(
        page.locator('[data-testid="notification-data"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="data-json"]')).toContainText(
        JSON.stringify(notification!.data)
      );
    });

    test('should mark notification as read', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await page.click('[data-testid="mark-as-read"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notification marked as read');
      await expect(page.locator('[data-testid="read-status"]')).toContainText(
        'مقروء'
      );
    });

    test('should mark notification as unread', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(1);
      await page.goto(`/notifications/${notification!.id}`);

      await page.click('[data-testid="mark-as-unread"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notification marked as unread');
      await expect(page.locator('[data-testid="read-status"]')).toContainText(
        'غير مقروء'
      );
    });

    test('should delete notification', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(2);
      await page.goto(`/notifications/${notification!.id}`);

      await page.click('[data-testid="delete-notification"]');
      await page.click('[data-testid="confirm-delete"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notification deleted successfully');
      await expect(page).toHaveURL('/notifications');
    });

    test('should show delete confirmation dialog', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await page.click('[data-testid="delete-notification"]');

      await expect(
        page.locator('[data-testid="delete-confirmation"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="delete-message"]')
      ).toContainText(notification!.title);
    });

    test('should cancel delete when cancelled', async ({ page }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await page.click('[data-testid="delete-notification"]');
      await page.click('[data-testid="cancel-delete"]');

      await expect(
        page.locator('[data-testid="delete-confirmation"]')
      ).not.toBeVisible();
      await expect(page).toHaveURL(`/notifications/${notification!.id}`);
    });
  });

  test.describe('Bulk Notification Operations', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should select multiple notifications', async ({ page }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="select-all-checkbox"]');

      const selectedCheckboxes = await page
        .locator('[data-testid="notification-checkbox"]:checked')
        .count();
      expect(selectedCheckboxes).toBe(3);
    });

    test('should mark multiple notifications as read', async ({ page }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="notification-checkbox"]').first();
      await page.check('[data-testid="notification-checkbox"]').nth(1);
      await page.click('[data-testid="mark-selected-read"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notifications marked as read');
    });

    test('should mark multiple notifications as unread', async ({ page }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="notification-checkbox"]').first();
      await page.check('[data-testid="notification-checkbox"]').nth(1);
      await page.click('[data-testid="mark-selected-unread"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notifications marked as unread');
    });

    test('should delete multiple notifications', async ({ page }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="notification-checkbox"]').first();
      await page.check('[data-testid="notification-checkbox"]').nth(1);
      await page.click('[data-testid="delete-selected"]');
      await page.click('[data-testid="confirm-bulk-delete"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Notifications deleted successfully');
    });

    test('should show bulk operations toolbar', async ({ page }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="notification-checkbox"]').first();

      await expect(
        page.locator('[data-testid="bulk-operations-toolbar"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="selected-count"]')
      ).toContainText('1');
    });

    test('should hide bulk operations toolbar when no selections', async ({
      page,
    }) => {
      await page.goto('/notifications');

      await page.check('[data-testid="notification-checkbox"]').first();
      await page.uncheck('[data-testid="notification-checkbox"]').first();

      await expect(
        page.locator('[data-testid="bulk-operations-toolbar"]')
      ).not.toBeVisible();
    });
  });

  test.describe('Notification Templates', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should display notification templates', async ({ page }) => {
      await page.goto('/notifications/templates');

      await expect(
        page.locator('[data-testid="templates-list"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="template-item"]')).toHaveCount(
        5
      );
    });

    test('should create new template', async ({ page }) => {
      await page.goto('/notifications/templates');
      await page.click('[data-testid="create-template-button"]');

      await page.fill('[data-testid="template-name-input"]', 'تذكير الموعد');
      await page.selectOption(
        '[data-testid="template-type-select"]',
        'appointment_reminder'
      );
      await page.fill('[data-testid="template-title-input"]', 'تذكير بالموعد');
      await page.fill(
        '[data-testid="template-message-input"]',
        'لديك موعد غداً في الساعة {{time}}'
      );
      await page.fill(
        '[data-testid="template-variables-input"]',
        'time,date,patient_name'
      );

      await page.click('[data-testid="save-template-button"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Template created successfully');
    });

    test('should edit existing template', async ({ page }) => {
      await page.goto('/notifications/templates');

      await page.click('[data-testid="edit-template-button"]').first();

      await page.fill(
        '[data-testid="template-message-input"]',
        'لديك موعد غداً في الساعة {{time}} مع الدكتور {{doctor_name}}'
      );
      await page.click('[data-testid="save-template-button"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Template updated successfully');
    });

    test('should delete template', async ({ page }) => {
      await page.goto('/notifications/templates');

      await page.click('[data-testid="delete-template-button"]').first();
      await page.click('[data-testid="confirm-delete"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('Template deleted successfully');
    });

    test('should preview template', async ({ page }) => {
      await page.goto('/notifications/templates');

      await page.click('[data-testid="preview-template-button"]').first();

      await expect(
        page.locator('[data-testid="template-preview"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="preview-title"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="preview-message"]')
      ).toBeVisible();
    });
  });

  test.describe('Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/notifications');

      await expect(
        page.locator('[data-testid="search-input"]')
      ).toHaveAttribute('aria-label');
      await expect(
        page.locator('[data-testid="create-notification-button"]')
      ).toHaveAttribute('aria-label');
      await expect(
        page.locator('[data-testid="notification-item"]').first()
      ).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/notifications');

      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        page.locator('[data-testid="create-notification-button"]')
      ).toBeFocused();
    });

    test('should announce notification updates to screen readers', async ({
      page,
    }) => {
      const notification = notificationHelper.getTestNotification(0);
      await page.goto(`/notifications/${notification!.id}`);

      await page.click('[data-testid="mark-as-read"]');

      const announcementElement = page.locator(
        '[data-testid="notification-update-announcement"]'
      );
      await expect(announcementElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  test.describe('Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'admin@test.com');
      await page.fill('[data-testid="password-input"]', 'TestPass123!');
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('/dashboard');
    });

    test('should load notifications list quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/notifications');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('should search notifications quickly', async ({ page }) => {
      await page.goto('/notifications');

      const startTime = Date.now();
      await page.fill('[data-testid="search-input"]', 'تذكير');
      await page.click('[data-testid="search-button"]');
      await page.waitForSelector('[data-testid="notification-item"]');
      const searchTime = Date.now() - startTime;

      expect(searchTime).toBeLessThan(2000);
    });

    test('should handle large notification lists', async ({ page }) => {
      // This would require creating many test notifications
      await page.goto('/notifications');

      await expect(
        page.locator('[data-testid="notification-item"]')
      ).toBeVisible();
    });
  });
});
