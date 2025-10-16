import { test, expect } from "@playwright/test";
test("Header language & theme toggles exist", async ({ page }) => {
  await page.goto("/");
  const langBtn = page.locator("[data-test=lang-toggle]");
  const themeBtn = page.locator("[data-test=theme-toggle]");
  await expect(langBtn).toBeVisible();
  await expect(themeBtn).toBeVisible();
  // quick interaction check
  await langBtn.click(); await themeBtn.click();
});
