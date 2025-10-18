import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lh';

test.describe('Lighthouse Performance Tests', () => {
  test('Homepage should pass Lighthouse audit', async({ page }) => {
    await page.goto('/');

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 90,
        'best-practices': 90,
        seo: 90
      },
      port: 9222
    });

    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories['best-practices'].score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories.seo.score).toBeGreaterThan(0.9);
  });

  test('Dashboard should pass Lighthouse audit', async({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 85,
        accessibility: 90,
        'best-practices': 90,
        seo: 85
      },
      port: 9222
    });

    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.85);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories['best-practices'].score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories.seo.score).toBeGreaterThan(0.85);
  });

  test('Patient Management should pass Lighthouse audit', async({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
    await page.goto('/patients');

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 80,
        accessibility: 90,
        'best-practices': 90,
        seo: 80
      },
      port: 9222
    });

    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.8);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
  });

  test('Appointments page should pass Lighthouse audit', async({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
    await page.goto('/appointments');

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 80,
        accessibility: 90,
        'best-practices': 90,
        seo: 80
      },
      port: 9222
    });

    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.8);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
  });

  test('Mobile view should pass Lighthouse audit', async({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 85,
        accessibility: 90,
        'best-practices': 90,
        seo: 85
      },
      port: 9222
    });

    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.85);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
  });
});
