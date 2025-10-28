// tests/e2e/dashboard.spec.ts
// Dashboard E2E Tests
// Tests real-time dashboard functionality, metrics display, and system health monitoring

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard header and navigation', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Dashboard - مُعين/);

    // Check header elements
    await expect(page.locator('h1')).toContainText('System Dashboard');
    await expect(page.locator('text=Real-time monitoring')).toBeVisible();

    // Check refresh button
    await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
  });

  test('should display summary cards with metrics', async ({ page }) => {
    // Wait for metrics to load
    await page.waitForSelector('[data-testid="summary-card"]', {
      timeout: 10000,
    });

    // Check summary cards
    const cards = page.locator('[data-testid="summary-card"]');
    await expect(cards).toHaveCount(4);

    // Check individual cards
    await expect(cards.nth(0)).toContainText('Overall Health');
    await expect(cards.nth(1)).toContainText('Social Media');
    await expect(cards.nth(2)).toContainText('Workflows');
    await expect(cards.nth(3)).toContainText('Chatbot');
  });

  test('should display system health status', async ({ page }) => {
    // Navigate to system health tab
    await page.click('text=System Health');

    // Check system health section
    await expect(page.locator('text=System Health')).toBeVisible();
    await expect(
      page.locator('text=Status of all system services')
    ).toBeVisible();

    // Check for health indicators
    const healthItems = page.locator('[data-testid="health-item"]');
    await expect(healthItems.first()).toBeVisible();

    // Check health badges
    const healthBadges = page.locator('[data-testid="health-badge"]');
    await expect(healthBadges.first()).toBeVisible();
  });

  test('should display system metrics', async ({ page }) => {
    // Navigate to system health tab
    await page.click('text=System Health');

    // Check system metrics section
    await expect(page.locator('text=System Metrics')).toBeVisible();
    await expect(
      page.locator('text=Performance and resource usage')
    ).toBeVisible();

    // Check for metrics data
    const metricsItems = page.locator('[data-testid="metrics-item"]');
    await expect(metricsItems.first()).toBeVisible();

    // Check CPU and Memory usage
    await expect(page.locator('text=CPU:')).toBeVisible();
    await expect(page.locator('text=Memory:')).toBeVisible();
  });

  test('should display automation status', async ({ page }) => {
    // Navigate to automation tab
    await page.click('text=Automation');

    // Check automation sections
    await expect(page.locator('text=Social Media')).toBeVisible();
    await expect(page.locator('text=Workflows')).toBeVisible();
    await expect(page.locator('text=Chatbot')).toBeVisible();

    // Check automation metrics
    await expect(page.locator('text=Total Posts:')).toBeVisible();
    await expect(page.locator('text=Total Views:')).toBeVisible();
    await expect(page.locator('text=Active Flows:')).toBeVisible();
  });

  test('should display social media metrics', async ({ page }) => {
    // Navigate to social media tab
    await page.click('text=Social Media');

    // Check social media platforms
    await expect(page.locator('text=Social Media Platforms')).toBeVisible();
    await expect(page.locator('text=Performance by platform')).toBeVisible();

    // Check for platform cards
    const platformCards = page.locator('[data-testid="platform-card"]');
    if ((await platformCards.count()) > 0) {
      await expect(platformCards.first()).toBeVisible();

      // Check platform metrics
      await expect(page.locator('text=Posts:')).toBeVisible();
      await expect(page.locator('text=Views:')).toBeVisible();
      await expect(page.locator('text=Likes:')).toBeVisible();
    }
  });

  test('should display workflow issues', async ({ page }) => {
    // Navigate to workflows tab
    await page.click('text=Workflows');

    // Check workflow issues section
    await expect(page.locator('text=Workflow Issues')).toBeVisible();
    await expect(
      page.locator('text=Common issues found in workflows')
    ).toBeVisible();

    // Check for issues or no issues message
    const issuesList = page.locator('[data-testid="workflow-issue"]');
    const noIssuesMessage = page.locator('text=No workflow issues found!');

    if ((await issuesList.count()) > 0) {
      await expect(issuesList.first()).toBeVisible();
    } else {
      await expect(noIssuesMessage).toBeVisible();
    }
  });

  test('should refresh metrics when refresh button is clicked', async ({
    page,
  }) => {
    // Get initial timestamp
    const initialTimestamp = await page
      .locator('text=Last updated:')
      .textContent();

    // Click refresh button
    await page.click('button:has-text("Refresh")');

    // Wait for refresh to complete
    await page.waitForTimeout(2000);

    // Check that timestamp has updated
    const newTimestamp = await page.locator('text=Last updated:').textContent();
    expect(newTimestamp).not.toBe(initialTimestamp);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/dashboard/metrics', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Check for error message
    await expect(page.locator('text=Error loading dashboard')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that dashboard is responsive
    await expect(page.locator('h1')).toBeVisible();

    // Check that cards stack properly
    const cards = page.locator('[data-testid="summary-card"]');
    await expect(cards.first()).toBeVisible();

    // Check that tabs are accessible
    await expect(page.locator('text=System Health')).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to dashboard with slow network
    await page.route('**/api/dashboard/metrics', route => {
      setTimeout(() => {
        route.continue();
      }, 2000);
    });

    await page.goto('/dashboard');

    // Check for loading indicator
    await expect(page.locator('text=Loading dashboard...')).toBeVisible();
  });
});
