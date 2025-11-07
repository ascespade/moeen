import { chromium } from 'playwright';

async function testLogin() {
  console.log('🚀 Starting login test with visual browser...\n');

  // Launch browser (headless with screenshots for debugging)
  const browser = await chromium.launch({
    headless: true, // Headless mode
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    // Enable video recording
    recordVideo: {
      dir: './test-results/videos/',
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  try {
    console.log('📱 Navigating to login page...');
    await page.goto('http://localhost:3002/login', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    console.log('✅ Login page loaded');

    // Wait for login form to be visible
    await page.waitForSelector('[data-testid="email-input"]', {
      timeout: 10000,
    });
    console.log('✅ Login form visible');

    // Fill email
    console.log('📝 Entering email: admin@test.com');
    await page.fill('[data-testid="email-input"]', 'admin@test.com');

    // Fill password
    console.log('🔒 Entering password...');
    await page.fill('[data-testid="password-input"]', 'Admin123!');

    // Check if remember me is visible (optional)
    const rememberMe = page.locator('[data-testid="remember-me-checkbox"]');
    if (await rememberMe.isVisible()) {
      await rememberMe.check();
      console.log('✅ Remember me checked');
    }

    // Take screenshot before login
    await page.screenshot({
      path: './test-results/before-login.png',
      fullPage: true,
    });
    console.log('📸 Screenshot saved: before-login.png');

    // Click login button
    console.log('🔑 Clicking login button...');
    await page.click('[data-testid="login-button"]');

    // Wait for navigation or error
    console.log('⏳ Waiting for redirect...');

    try {
      // Wait for either redirect or error message
      await Promise.race([
        page.waitForURL(/\/dashboard|\/admin/, { timeout: 10000 }),
        page
          .waitForSelector('.status-error', { timeout: 5000 })
          .catch(() => null),
        page
          .waitForSelector('text=/جار تسجيل الدخول/', { timeout: 3000 })
          .catch(() => null),
      ]);

      // Check current URL
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);

      // Wait a bit more for any redirects
      await page.waitForTimeout(2000);

      const finalUrl = page.url();
      console.log(`📍 Final URL: ${finalUrl}`);

      // Take screenshot after login attempt
      await page.screenshot({
        path: './test-results/after-login.png',
        fullPage: true,
      });
      console.log('📸 Screenshot saved: after-login.png');

      // Check for errors
      const errorElement = await page.locator('.status-error').first();
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.log(`❌ Login Error: ${errorText}`);
      }

      // Check if we're on dashboard
      if (finalUrl.includes('/dashboard') || finalUrl.includes('/admin')) {
        console.log('✅ SUCCESS: Redirected to dashboard!');
        console.log(`✅ Final destination: ${finalUrl}`);

        // Check if cookie is set
        const cookies = await context.cookies();
        const authCookie = cookies.find(c => c.name === 'auth_token');
        if (authCookie) {
          console.log('✅ Auth cookie found!');
          console.log(
            `   Cookie value: ${authCookie.value.substring(0, 50)}...`
          );
        } else {
          console.log('⚠️ Warning: Auth cookie not found');
        }

        // Wait a bit to see the dashboard
        await page.waitForTimeout(3000);
        await page.screenshot({
          path: './test-results/dashboard.png',
          fullPage: true,
        });
        console.log('📸 Screenshot saved: dashboard.png');
      } else if (finalUrl.includes('/login')) {
        console.log('❌ FAILED: Still on login page');
        console.log('   This indicates redirect loop or login failure');
      } else {
        console.log(`⚠️ Unexpected URL: ${finalUrl}`);
      }
    } catch (error) {
      console.log(`❌ Error during login: ${error.message}`);
      await page.screenshot({
        path: './test-results/error-state.png',
        fullPage: true,
      });
    }
  } catch (error) {
    console.error('❌ Test Error:', error);
    await page.screenshot({ path: './test-results/error.png', fullPage: true });
  } finally {
    // Keep browser open for 5 seconds to see result
    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);

    await context.close();
    await browser.close();
    console.log('✅ Browser closed');
  }
}

// Run test
testLogin().catch(console.error);
