// tests/generated/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Setting up global test environment...');

  // Start browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the app
  await page.goto(process.env.BASE_URL || 'http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('Global setup completed');

  await browser.close();
}

export default globalSetup;
