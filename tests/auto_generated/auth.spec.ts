import { test, expect } from "@playwright/test";
test("login flow placeholder", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("input[name=email]")).toBeVisible();
});
