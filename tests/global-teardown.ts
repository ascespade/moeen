import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  // Clean up any resources
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
