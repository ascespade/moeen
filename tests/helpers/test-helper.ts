import { Page } from '@playwright/test';

export class TestHelper {
  static async login(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
  }

  static async createTestData(page: Page, data: any) {
    // Helper to create test data
    return data;
  }

  static async cleanupTestData(page: Page, ids: string[]) {
    // Helper to cleanup test data
    return true;
  }
}
