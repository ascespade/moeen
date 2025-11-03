import { chromium } from 'playwright';

async function testLogin() {
  console.log('🚀 Testing login...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('📱 Going to login page...');
    await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle' });

    console.log('✅ Page loaded');
    await page.waitForSelector('[data-testid="email-input"]', { timeout: 5000 });

    // Fill credentials
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'Admin123!');

    console.log('🔑 Clicking login...');

    // Click and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }),
      page.click('[data-testid="login-button"]'),
    ]);

    const finalUrl = page.url();
    console.log(`📍 Final URL: ${finalUrl}`);

    // Check cookies
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');

    if (authCookie) {
      console.log('✅ Cookie found!');
    } else {
      console.log('❌ No cookie found');
    }

    if (finalUrl.includes('/dashboard') || finalUrl.includes('/admin')) {
      console.log('✅ SUCCESS: Redirected correctly!');
      await page.screenshot({ path: './test-results/success.png' });
    } else if (finalUrl.includes('/login')) {
      console.log('❌ FAILED: Still on login page');

      // Check for error message
      const error = await page.locator('.status-error').first();
      if (await error.isVisible()) {
        console.log(`Error: ${await error.textContent()}`);
      }

      await page.screenshot({ path: './test-results/failed.png' });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: './test-results/error.png' });
  } finally {
    await browser.close();
    console.log('✅ Test complete');
  }
}

testLogin().catch(console.error);





