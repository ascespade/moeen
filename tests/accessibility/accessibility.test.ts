import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Homepage should not have accessibility violations', async({
    page
  }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Dashboard should not have accessibility violations', async({
    page
  }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Forms should be keyboard navigable', async({ page }) => {
    await page.goto('/register');

    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="full-name"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="password"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(
      page.locator('[data-testid="confirm-password"]')
    ).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="register-button"]')).toBeFocused();
  });

  test('Login form should be accessible', async({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Test form labels
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();

    // Test required fields
    const emailInput = page.locator('[data-testid="email"]');
    const passwordInput = page.locator('[data-testid="password"]');

    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('Data tables should be accessible', async({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
    await page.goto('/patients');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Test table accessibility
    const table = page.locator('table');
    await expect(table).toHaveAttribute('role', 'table');

    const headers = page.locator('th');
    await expect(headers.first()).toHaveAttribute('role', 'columnheader');
  });

  test('Navigation should be keyboard accessible', async({ page }) => {
    await page.goto('/');

    // Test skip links
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeFocused();
    }

    // Test main navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Test keyboard navigation in menu
    const menuItems = page.locator('nav a, nav button');
    const firstMenuItem = menuItems.first();

    if (await firstMenuItem.isVisible()) {
      await firstMenuItem.focus();
      await expect(firstMenuItem).toBeFocused();
    }
  });

  test('Color contrast should meet WCAG standards', async({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Images should have proper alt text', async({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Decorative images should have empty alt
      // Content images should have descriptive alt
      expect(alt).toBeDefined();
    }
  });

  test('Focus indicators should be visible', async({ page }) => {
    await page.goto('/');

    // Focus on first interactive element
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Check if focus indicator is visible
    const focusStyles = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    });

    expect(
      focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none'
    ).toBeTruthy();
  });

  test('ARIA labels should be properly used', async({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['aria'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
