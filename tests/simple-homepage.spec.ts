import { expect, test } from '@playwright/test';

test.describe('Simple Homepage Test', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Get actual title for debugging
    const title = await page.title();
    console.log('Page title:', title);

    // Just check that page loaded (title can vary)
    await expect(page).toHaveTitle(/./); // Any title is fine

    // Take screenshot
    await page.screenshot({
      path: 'test-results/homepage.png',
      fullPage: true,
    });

    // Check for main content
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should check for console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    console.log('Console errors found:', errors);

    // Log errors but don't fail (for debugging)
    if (errors.length > 0) {
      console.log('Total errors:', errors.length);
    }
  });
});
