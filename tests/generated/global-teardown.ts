// tests/generated/global-teardown.ts
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('Cleaning up global test environment...');
  
  // Clean up any test data
  console.log('Global teardown completed');
}

export default globalTeardown;
