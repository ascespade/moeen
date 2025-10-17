/**
 * Global Setup - الإعداد العام
 * Runs before all tests to set up the testing environment
 */

import { chromium, FullConfig } from '@playwright/test';
import { testHelper } from './helpers/supabase-test-helper';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  try {
    // Clean up any existing test data
    console.log('🧹 Cleaning up existing test data...');
    await testHelper.cleanup();
    
    // Clear rate limiting cache
    console.log('🔄 Clearing rate limiting cache...');
    await testHelper.clearRateLimit();

    // Verify database connection
    console.log('🔌 Verifying database connection...');
    const stats = await testHelper.getDatabaseStats();
    console.log(`📊 Database stats: ${stats.totalUsers} users, ${stats.totalPatients} patients, ${stats.totalAuditLogs} audit logs`);

    // Create a test browser context to verify the app is running
    console.log('🌐 Verifying application is running...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3001', { timeout: 30000 });
      console.log('✅ Application is running and accessible');
    } catch (error) {
      console.error('❌ Application is not accessible:', error);
      throw error;
    } finally {
      await browser.close();
    }

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;
