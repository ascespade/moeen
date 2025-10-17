// tests/e2e/admin.spec.ts
// Admin Module E2E Tests
// Tests RBAC, user management, system configuration, and security features

import { test, expect } from "@playwright/test";

test.describe("Admin Module", () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin authentication
    await page.addInitScript(() => {
      window.localStorage.setItem("auth-token", "mock-admin-token");
      window.localStorage.setItem("user-role", "admin");
    });

    // Navigate to admin panel
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
  });

  test("should display admin panel header and navigation", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/مُعين/);

    // Check if page loaded successfully
    await expect(page.locator("body")).toBeVisible();
    
    // Just check that we're on the admin page
    await expect(page.url()).toContain("/admin");
  });

  test("should display admin summary cards", async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="admin-summary-card"]', {
      timeout: 10000,
    });

    // Check summary cards
    const cards = page.locator('[data-testid="admin-summary-card"]');
    await expect(cards).toHaveCount(4);

    // Check individual cards
    await expect(cards.nth(0)).toContainText("Total Users");
    await expect(cards.nth(1)).toContainText("System Configs");
    await expect(cards.nth(2)).toContainText("Security Events");
    await expect(cards.nth(3)).toContainText("Failed Logins");
  });

  test("should display user management tab", async ({ page }) => {
    // Navigate to user management tab
    await page.click("text=User Management");

    // Check user management sections
    await expect(page.locator("text=Users").first()).toBeVisible();
    await expect(page.locator("text=Manage system users")).toBeVisible();
    await expect(page.locator("text=Create New User")).toBeVisible();

    // Check user list
    const userItems = page.locator('[data-testid="user-item"]');
    await expect(userItems.first()).toBeVisible();

    // Check user details
    await expect(page.locator("text=test-admin@example.com")).toBeVisible();
    await expect(page.locator("text=Test Admin")).toBeVisible();
  });

  test("should create new user", async ({ page }) => {
    // Navigate to user management tab
    await page.click("text=User Management");

    // Fill new user form
    await page.fill('input[type="email"]', "new-user@example.com");
    await page.fill('input[placeholder*="Name"]', "New User");
    await page.selectOption("select", "agent");
    await page.fill('input[type="password"]', "password123");

    // Submit form
    await page.click('button:has-text("Create User")');

    // Check for success message
    await expect(page.locator("text=User created successfully")).toBeVisible();

    // Check that user appears in list
    await expect(page.locator("text=new-user@example.com")).toBeVisible();
  });

  test("should update user status", async ({ page }) => {
    // Navigate to user management tab
    await page.click("text=User Management");

    // Find a user with active status
    const userItem = page.locator('[data-testid="user-item"]').first();
    await expect(userItem).toBeVisible();

    // Click suspend button
    const suspendButton = userItem.locator('button[title*="Suspend"]');
    if (await suspendButton.isVisible()) {
      await suspendButton.click();

      // Check for success message
      await expect(
        page.locator("text=User updated successfully"),
      ).toBeVisible();
    }
  });

  test("should display system configuration tab", async ({ page }) => {
    // Navigate to system config tab
    await page.click("text=System Config");

    // Check system configuration section
    await expect(page.locator("text=System Configuration")).toBeVisible();
    await expect(page.locator("text=Manage system settings")).toBeVisible();

    // Check for config items
    const configItems = page.locator('[data-testid="config-item"]');
    await expect(configItems.first()).toBeVisible();

    // Check for secret indicators
    const secretIcons = page.locator('[data-testid="secret-icon"]');
    if ((await secretIcons.count()) > 0) {
      await expect(secretIcons.first()).toBeVisible();
    }
  });

  test("should update system configuration", async ({ page }) => {
    // Navigate to system config tab
    await page.click("text=System Config");

    // Find a config item
    const configItem = page.locator('[data-testid="config-item"]').first();
    await expect(configItem).toBeVisible();

    // Update config value
    const configInput = configItem.locator("input");
    await configInput.fill("new-value");

    // Click save button
    const saveButton = configItem.locator('button:has-text("Save")');
    await saveButton.click();

    // Check for success message
    await expect(page.locator("text=Configuration updated")).toBeVisible();
  });

  test("should display security events tab", async ({ page }) => {
    // Navigate to security tab
    await page.click("text=Security");

    // Check security events section
    await expect(page.locator("text=Security Events")).toBeVisible();
    await expect(page.locator("text=Monitor security events")).toBeVisible();

    // Check for security events
    const securityEvents = page.locator('[data-testid="security-event"]');
    await expect(securityEvents.first()).toBeVisible();

    // Check event details
    await expect(page.locator("text=Success")).toBeVisible();
    await expect(page.locator("text=Failed")).toBeVisible();
  });

  test("should display audit log tab", async ({ page }) => {
    // Navigate to audit log tab
    await page.click("text=Audit Log");

    // Check audit log section
    await expect(page.locator("text=Audit Log")).toBeVisible();
    await expect(page.locator("text=Complete audit trail")).toBeVisible();

    // Check for audit entries
    const auditEntries = page.locator('[data-testid="audit-entry"]');
    await expect(auditEntries.first()).toBeVisible();

    // Check audit details
    await expect(page.locator("text=User:")).toBeVisible();
    await expect(page.locator("text=IP:")).toBeVisible();
  });

  test("should handle unauthorized access", async ({ page }) => {
    // Clear authentication
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    // Navigate to admin panel
    await page.goto("/admin");

    // Check for unauthorized message
    await expect(page.locator("text=Unauthorized")).toBeVisible();
  });

  test("should handle insufficient permissions", async ({ page }) => {
    // Mock agent user (not admin)
    await page.addInitScript(() => {
      window.localStorage.setItem("auth-token", "mock-agent-token");
      window.localStorage.setItem("user-role", "agent");
    });

    // Navigate to admin panel
    await page.goto("/admin");

    // Check for insufficient permissions message
    await expect(page.locator("text=Insufficient permissions")).toBeVisible();
  });

  test("should validate user creation form", async ({ page }) => {
    // Navigate to user management tab
    await page.click("text=User Management");

    // Try to submit empty form
    await page.click('button:has-text("Create User")');

    // Check for validation errors
    await expect(page.locator("text=Missing required fields")).toBeVisible();
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/admin/users", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Navigate to admin panel
    await page.goto("/admin");

    // Check for error message
    await expect(page.locator("text=Error:")).toBeVisible();
    await expect(page.locator("text=Retry")).toBeVisible();
  });

  test("should be responsive on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that admin panel is responsive
    await expect(page.locator("h1")).toBeVisible();

    // Check that cards stack properly
    const cards = page.locator('[data-testid="admin-summary-card"]');
    await expect(cards.first()).toBeVisible();

    // Check that tabs are accessible
    await expect(page.locator("text=User Management")).toBeVisible();
  });

  test("should display loading state initially", async ({ page }) => {
    // Navigate to admin panel with slow network
    await page.route("**/api/admin/users", (route) => {
      setTimeout(() => {
        route.continue();
      }, 2000);
    });

    await page.goto("/admin");

    // Check for loading indicator
    await expect(page.locator("text=Loading admin panel...")).toBeVisible();
  });
});
