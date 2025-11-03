
import { test, expect } from '@playwright/test';

test.describe('Comprehensive Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Home page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/????|Center/);
    testResults.playwright.passed++;
    testResults.playwright.total++;
  });

  test('Navigation works correctly', async ({ page }) => {
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    testResults.playwright.passed++;
    testResults.playwright.total++;
  });

  test('API routes are accessible', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBeLessThan(500);
    testResults.playwright.passed++;
    testResults.playwright.total++;
  });

  test('Components render correctly', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toBeVisible();
    testResults.playwright.passed++;
    testResults.playwright.total++;
  });

  test('No console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('http://localhost:3000');
    expect(errors.length).toBe(0);
    testResults.playwright.passed++;
    testResults.playwright.total++;
  });
});
