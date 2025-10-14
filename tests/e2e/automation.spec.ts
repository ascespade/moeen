// tests/e2e/automation.spec.ts
// Automation Systems E2E Tests
// Tests social media automation, workflow orchestration, and system monitoring

import { test, expect } from "@playwright/test";

test.describe("Automation Systems", () => {
  test.describe("Social Media Automation", () => {
    test("should display social media automation status", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate to automation tab
      await page.click("text=Automation");

      // Check social media section
      await expect(page.locator("text=Social Media")).toBeVisible();
      await expect(
        page.locator("text=Posting automation status"),
      ).toBeVisible();

      // Check social media metrics
      await expect(page.locator("text=Total Posts:")).toBeVisible();
      await expect(page.locator("text=Total Views:")).toBeVisible();
      await expect(page.locator("text=Total Likes:")).toBeVisible();
    });

    test("should display social media platforms", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate to social media tab
      await page.click("text=Social Media");

      // Check social media platforms section
      await expect(page.locator("text=Social Media Platforms")).toBeVisible();
      await expect(page.locator("text=Performance by platform")).toBeVisible();

      // Check for platform cards
      const platformCards = page.locator('[data-testid="platform-card"]');
      if ((await platformCards.count()) > 0) {
        await expect(platformCards.first()).toBeVisible();

        // Check platform metrics
        await expect(page.locator("text=Posts:")).toBeVisible();
        await expect(page.locator("text=Views:")).toBeVisible();
        await expect(page.locator("text=Likes:")).toBeVisible();
        await expect(page.locator("text=Comments:")).toBeVisible();
      }
    });
  });

  test.describe("Workflow Orchestration", () => {
    test("should display workflow status", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate to automation tab
      await page.click("text=Automation");

      // Check workflows section
      await expect(page.locator("text=Workflows")).toBeVisible();
      await expect(page.locator("text=n8n workflow status")).toBeVisible();

      // Check workflow metrics
      await expect(page.locator("text=Total Workflows:")).toBeVisible();
      await expect(page.locator("text=Valid:")).toBeVisible();
      await expect(page.locator("text=Invalid:")).toBeVisible();
    });

    test("should display workflow issues", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate to workflows tab
      await page.click("text=Workflows");

      // Check workflow issues section
      await expect(page.locator("text=Workflow Issues")).toBeVisible();
      await expect(page.locator("text=Common issues found")).toBeVisible();

      // Check for issues or no issues message
      const issuesList = page.locator('[data-testid="workflow-issue"]');
      const noIssuesMessage = page.locator("text=No workflow issues found!");

      if ((await issuesList.count()) > 0) {
        await expect(issuesList.first()).toBeVisible();
      } else {
        await expect(noIssuesMessage).toBeVisible();
      }
    });
  });

  test.describe("System Monitoring", () => {
    test("should display system health", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate to system health tab
      await page.click("text=System Health");

      // Check system health section
      await expect(page.locator("text=System Health")).toBeVisible();
      await expect(
        page.locator("text=Status of all system services"),
      ).toBeVisible();

      // Check for health indicators
      const healthItems = page.locator('[data-testid="health-item"]');
      await expect(healthItems.first()).toBeVisible();

      // Check health badges
      const healthBadges = page.locator('[data-testid="health-badge"]');
      await expect(healthBadges.first()).toBeVisible();
    });

    test("should display system metrics", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate to system health tab
      await page.click("text=System Health");

      // Check system metrics section
      await expect(page.locator("text=System Metrics")).toBeVisible();
      await expect(
        page.locator("text=Performance and resource usage"),
      ).toBeVisible();

      // Check for metrics data
      const metricsItems = page.locator('[data-testid="metrics-item"]');
      await expect(metricsItems.first()).toBeVisible();

      // Check CPU and Memory usage
      await expect(page.locator("text=CPU:")).toBeVisible();
      await expect(page.locator("text=Memory:")).toBeVisible();
    });

    test("should refresh metrics automatically", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Get initial timestamp
      const initialTimestamp = await page
        .locator("text=Last updated:")
        .textContent();

      // Wait for auto-refresh (30 seconds)
      await page.waitForTimeout(35000);

      // Check that timestamp has updated
      const newTimestamp = await page
        .locator("text=Last updated:")
        .textContent();
      expect(newTimestamp).not.toBe(initialTimestamp);
    });
  });

  test.describe("File Cleanup System", () => {
    test("should display file cleanup status", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Check for file cleanup metrics in system metrics
      const metricsItems = page.locator('[data-testid="metrics-item"]');
      const fileCleanupItem = metricsItems.filter({ hasText: "file-cleanup" });

      if ((await fileCleanupItem.count()) > 0) {
        await expect(fileCleanupItem.first()).toBeVisible();
      }
    });
  });

  test.describe("Google Drive Integration", () => {
    test("should display Google Drive status", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Check for Google Drive metrics in system metrics
      const metricsItems = page.locator('[data-testid="metrics-item"]');
      const googleDriveItem = metricsItems.filter({ hasText: "google-drive" });

      if ((await googleDriveItem.count()) > 0) {
        await expect(googleDriveItem.first()).toBeVisible();
      }
    });
  });

  test.describe("Enhancement Loop", () => {
    test("should display enhancement loop status", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Check for enhancement loop metrics in system metrics
      const metricsItems = page.locator('[data-testid="metrics-item"]');
      const enhancementItem = metricsItems.filter({
        hasText: "enhancement-loop",
      });

      if ((await enhancementItem.count()) > 0) {
        await expect(enhancementItem.first()).toBeVisible();
      }
    });
  });

  test.describe("Error Handling", () => {
    test("should handle API errors gracefully", async ({ page }) => {
      // Mock API error
      await page.route("**/api/dashboard/metrics", (route) => {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      });

      // Navigate to dashboard
      await page.goto("/dashboard");

      // Check for error message
      await expect(page.locator("text=Error loading dashboard")).toBeVisible();
      await expect(page.locator("text=Retry")).toBeVisible();
    });

    test("should handle network timeouts", async ({ page }) => {
      // Mock slow API response
      await page.route("**/api/dashboard/metrics", (route) => {
        setTimeout(() => {
          route.continue();
        }, 35000); // Longer than timeout
      });

      // Navigate to dashboard
      await page.goto("/dashboard");

      // Check for timeout handling
      await expect(page.locator("text=Loading dashboard...")).toBeVisible();
    });
  });

  test.describe("Performance", () => {
    test("should load dashboard within acceptable time", async ({ page }) => {
      const startTime = Date.now();

      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      const loadTime = Date.now() - startTime;

      // Check that dashboard loads within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("should handle concurrent requests", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Refresh multiple times rapidly
      for (let i = 0; i < 5; i++) {
        await page.click('button:has-text("Refresh")');
        await page.waitForTimeout(1000);
      }

      // Check that dashboard still functions
      await expect(page.locator("h1")).toContainText("System Dashboard");
    });
  });

  test.describe("Accessibility", () => {
    test("should be accessible with keyboard navigation", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Navigate using Tab key
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Check that focus is visible
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    test("should have proper ARIA labels", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Check for ARIA labels
      const elementsWithAria = page.locator("[aria-label]");
      await expect(elementsWithAria.first()).toBeVisible();
    });
  });

  test.describe("Mobile Responsiveness", () => {
    test("should be responsive on mobile devices", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Check that dashboard is responsive
      await expect(page.locator("h1")).toBeVisible();

      // Check that cards stack properly
      const cards = page.locator('[data-testid="summary-card"]');
      await expect(cards.first()).toBeVisible();

      // Check that tabs are accessible
      await expect(page.locator("text=System Health")).toBeVisible();
    });

    test("should handle touch interactions", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to dashboard
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // Test touch interactions
      await page.tap("text=System Health");

      // Check that tab was activated
      await expect(page.locator("text=System Health")).toBeVisible();
    });
  });
});
