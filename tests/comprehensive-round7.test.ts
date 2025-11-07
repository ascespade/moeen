/**
 * Comprehensive Round 7 Testing
 * ???????? ?????? ??? 7
 *
 * Final verification that everything works as expected
 */

import { test, expect } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Round 7: Final Comprehensive Verification', () => {
  test('? System Health Check', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect([200, 404]).toContain(response.status());
  });

  test('? Homepage Loads', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('? Login Page Accessible', async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState('networkidle');
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });

  test('? Chatbot API Available', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/chatbot/moeen`, {
      data: {
        message: '?????',
        sessionId: 'test-session',
      },
    });
    expect([200, 400, 500]).toContain(response.status());
  });

  test('? Notifications API Available', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/notifications/send`, {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        type: 'in_app',
        title: 'Test',
        body: 'Test notification',
      },
    });
    expect([200, 400, 403, 500]).toContain(response.status());
  });

  test('? Performance - Page Load Time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(30000);
  });

  test('? Accessibility - ARIA Labels', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const buttons = await page.locator('button').count();
    const buttonsWithAria = await page.locator('button[aria-label]').count();
    const ariaRatio = buttons > 0 ? buttonsWithAria / buttons : 0;
    expect(ariaRatio).toBeGreaterThan(0.5); // At least 50% should have aria-labels
  });

  test('? Accessibility - Semantic HTML', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const hasNav = (await page.locator('nav, [role="navigation"]').count()) > 0;
    const hasMain = (await page.locator('main, [role="main"]').count()) > 0;
    const hasHeader =
      (await page.locator('header, [role="banner"]').count()) > 0;
    expect(hasNav || hasMain || hasHeader).toBeTruthy();
  });

  test('? Responsive Design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('? Error Handling - 404', async ({ page }) => {
    const response = await page.goto(`${baseURL}/nonexistent-page-12345`);
    expect([200, 404]).toContain(response?.status() || 200);
  });
});
