import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Start the application server
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is ready');
  } catch (error) {
    console.log('⚠️ Application not ready, tests will run anyway');
  }

  await browser.close();
  console.log('✅ Global setup completed');
}

export default globalSetup;
