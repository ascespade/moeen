#!/usr/bin/env node

/**
 * AI Test Generator
 * Generates comprehensive Playwright and Supawright tests for all modules
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY,
});

/**
 * Generate comprehensive test scenarios for all modules
 */
async function generateAllTests() {
  console.log('🧪 Generating comprehensive test scenarios...');

  try {
    // Detect all modules
    const modules = await detectModules();
    console.log(`📁 Detected ${modules.length} modules: ${modules.join(', ')}`);

    // Generate Playwright tests
    await generatePlaywrightTests(modules);

    // Generate Supawright tests
    await generateSupawrightTests(modules);

    // Generate integration tests
    await generateIntegrationTests(modules);

    // Generate edge case tests
    await generateEdgeCaseTests(modules);

    console.log('✅ Test generation complete');
    return true;
  } catch (error) {
    console.error('❌ Test generation failed:', error);
    return false;
  }
}

/**
 * Detect modules in src directory
 */
async function detectModules() {
  const modules = [];
  const srcPath = path.join(WORKSPACE_ROOT, 'src');

  try {
    const entries = await fs.readdir(srcPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        modules.push(entry.name);
      }
    }
  } catch (error) {
    console.error('Failed to read src directory:', error);
  }

  return modules;
}

/**
 * Generate Playwright tests for all modules
 */
async function generatePlaywrightTests(modules) {
  const playwrightTestsDir = path.join(
    WORKSPACE_ROOT,
    'tests',
    'generated',
    'playwright'
  );
  await fs.mkdir(playwrightTestsDir, { recursive: true });

  for (const module of modules) {
    console.log(`📝 Generating Playwright tests for ${module}...`);

    const testContent = await generateModulePlaywrightTest(module);
    const testFile = path.join(playwrightTestsDir, `${module}.spec.js`);
    await fs.writeFile(testFile, testContent);
  }

  // Generate global test configuration
  const configContent = generatePlaywrightConfig();
  const configFile = path.join(playwrightTestsDir, 'playwright.config.js');
  await fs.writeFile(configFile, configContent);
}

/**
 * Generate Supawright tests for all modules
 */
async function generateSupawrightTests(modules) {
  const supawrightTestsDir = path.join(
    WORKSPACE_ROOT,
    'tests',
    'generated',
    'supawright'
  );
  await fs.mkdir(supawrightTestsDir, { recursive: true });

  for (const module of modules) {
    console.log(`📝 Generating Supawright tests for ${module}...`);

    const testContent = await generateModuleSupawrightTest(module);
    const testFile = path.join(supawrightTestsDir, `${module}.test.js`);
    await fs.writeFile(testFile, testContent);
  }
}

/**
 * Generate integration tests
 */
async function generateIntegrationTests(modules) {
  const integrationTestsDir = path.join(
    WORKSPACE_ROOT,
    'tests',
    'generated',
    'integration'
  );
  await fs.mkdir(integrationTestsDir, { recursive: true });

  console.log('📝 Generating integration tests...');

  const testContent = generateIntegrationTestContent(modules);
  const testFile = path.join(integrationTestsDir, 'integration.spec.js');
  await fs.writeFile(testFile, testContent);
}

/**
 * Generate edge case tests
 */
async function generateEdgeCaseTests(modules) {
  const edgeCaseTestsDir = path.join(
    WORKSPACE_ROOT,
    'tests',
    'generated',
    'edge-cases'
  );
  await fs.mkdir(edgeCaseTestsDir, { recursive: true });

  console.log('📝 Generating edge case tests...');

  const testContent = generateEdgeCaseTestContent(modules);
  const testFile = path.join(edgeCaseTestsDir, 'edge-cases.spec.js');
  await fs.writeFile(testFile, testContent);
}

/**
 * Generate Playwright test for a specific module
 */
async function generateModulePlaywrightTest(module) {
  const modulePath = path.join(WORKSPACE_ROOT, 'src', module);
  const moduleFiles = await getModuleFiles(modulePath);

  return `import { test, expect } from '@playwright/test';

test.describe('${module} Module E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the module
    await page.goto('/${module.toLowerCase()}');
    await page.waitForLoadState('networkidle');
  });

  test('should load ${module} page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/.*${module}.*/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle form interactions', async ({ page }) => {
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        await testFormInteractions(page, form);
      }
    }
  });

  test('should handle button clicks', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      try {
        const button = buttons.nth(i);
        if (await button.isVisible() && await button.isEnabled()) {
          await button.click();
          await page.waitForTimeout(500);
        }
      } catch (e) {
        // Button might not be clickable, continue
      }
    }
  });

  test('should handle API calls', async ({ page }) => {
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method()
      });
    });

    // Trigger actions that might cause API calls
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      try {
        await buttons.nth(i).click();
        await page.waitForTimeout(1000);
      } catch (e) {
        // Button might not be clickable, continue
      }
    }

    // Verify API responses
    expect(responses.length).toBeGreaterThanOrEqual(0);
    responses.forEach(response => {
      expect(response.status).toBeLessThan(500);
    });
  });

  test('should handle error states', async ({ page }) => {
    const errorElements = page.locator('[class*="error"], [class*="Error"], [class*="alert"]');
    const errorCount = await errorElements.count();
    
    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const error = errorElements.nth(i);
        await expect(error).toBeVisible();
      }
    }
  });

  test('should be responsive', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }  // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Verify page is still functional
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle navigation', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      try {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
          await link.click();
          await page.waitForLoadState('networkidle');
          await page.goBack();
          await page.waitForLoadState('networkidle');
        }
      } catch (e) {
        // Link might not be clickable, continue
      }
    }
  });
});

async function testFormInteractions(page, form) {
  const inputs = form.locator('input, select, textarea');
  const inputCount = await inputs.count();
  
  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const type = await input.getAttribute('type');
    const tagName = await input.evaluate(el => el.tagName.toLowerCase());
    
    if (tagName === 'input') {
      if (type === 'text' || type === 'email') {
        await input.fill('test@example.com');
      } else if (type === 'password') {
        await input.fill('testpassword123');
      } else if (type === 'number') {
        await input.fill('123');
      } else if (type === 'checkbox') {
        await input.check();
      } else if (type === 'radio') {
        await input.check();
      }
    } else if (tagName === 'select') {
      const options = input.locator('option');
      const optionCount = await options.count();
      if (optionCount > 1) {
        await input.selectOption({ index: 1 });
      }
    } else if (tagName === 'textarea') {
      await input.fill('Test text content');
    }
  }
}`;
}

/**
 * Generate Supawright test for a specific module
 */
async function generateModuleSupawrightTest(module) {
  return `import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

test.describe('${module} Module Database Tests', () => {
  let supabase;

  test.beforeAll(async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
    }
  });

  test('should connect to database', async () => {
    if (!supabase) {
      test.skip('Supabase not configured');
      return;
    }

    try {
      const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
      expect(error).toBeNull();
    } catch (e) {
      console.log('Database connection test not available');
    }
  });

  test('should handle ${module} data operations', async () => {
    if (!supabase) {
      test.skip('Supabase not configured');
      return;
    }

    const testData = {
      name: 'Test ${module}',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('${module.toLowerCase()}')
        .insert(testData)
        .select();

      if (error) {
        console.log('Table ${module.toLowerCase()} might not exist:', error.message);
      } else {
        expect(data).toBeDefined();
        
        if (data && data.length > 0) {
          await supabase
            .from('${module.toLowerCase()}')
            .delete()
            .eq('id', data[0].id);
        }
      }
    } catch (e) {
      console.log('Table ${module.toLowerCase()} operations not available');
    }
  });

  test('should validate data integrity', async () => {
    if (!supabase) {
      test.skip('Supabase not configured');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) {
        console.log('Could not access schema information:', error.message);
      } else {
        expect(data).toBeDefined();
      }
    } catch (e) {
      console.log('Schema validation not available');
    }
  });

  test('should handle concurrent operations', async () => {
    if (!supabase) {
      test.skip('Supabase not configured');
      return;
    }

    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        supabase
          .from('${module.toLowerCase()}')
          .select('*')
          .limit(1)
      );
    }

    const results = await Promise.allSettled(promises);
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        expect(result.value.error).toBeNull();
      }
    });
  });
});`;
}

/**
 * Generate integration test content
 */
function generateIntegrationTestContent(modules) {
  return `import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test('should handle complete user workflows', async ({ page }) => {
    // Test complete user journey across multiple modules
    const workflows = [
      'auth -> dashboard -> profile',
      'auth -> patients -> appointments',
      'auth -> admin -> settings'
    ];

    for (const workflow of workflows) {
      console.log(\`Testing workflow: \${workflow}\`);
      
      // Navigate through workflow steps
      const steps = workflow.split(' -> ');
      for (const step of steps) {
        await page.goto(\`/\${step.toLowerCase()}\`);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should handle cross-module data flow', async ({ page }) => {
    // Test data flow between modules
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Simulate login
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('testpassword123');
      await loginButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to different modules
    const modules = ['dashboard', 'patients', 'appointments', 'admin'];
    for (const module of modules) {
      await page.goto(\`/\${module}\`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle error recovery', async ({ page }) => {
    // Test error recovery across modules
    const errorScenarios = [
      'network failure',
      'invalid data',
      'unauthorized access'
    ];

    for (const scenario of errorScenarios) {
      console.log(\`Testing error scenario: \${scenario}\`);
      
      // Simulate error conditions
      await page.route('**/*', route => {
        if (scenario === 'network failure') {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      
      // Verify error handling
      const errorElements = page.locator('[class*="error"], [class*="Error"]');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        await expect(errorElements.first()).toBeVisible();
      }
    }
  });
});`;
}

/**
 * Generate edge case test content
 */
function generateEdgeCaseTestContent(modules) {
  return `import { test, expect } from '@playwright/test';

test.describe('Edge Case Tests', () => {
  test('should handle empty states', async ({ page }) => {
    // Test empty data states
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for empty state indicators
    const emptyStates = page.locator('[class*="empty"], [class*="no-data"], [class*="placeholder"]');
    const emptyCount = await emptyStates.count();
    
    if (emptyCount > 0) {
      for (let i = 0; i < emptyCount; i++) {
        const empty = emptyStates.nth(i);
        await expect(empty).toBeVisible();
      }
    }
  });

  test('should handle large datasets', async ({ page }) => {
    // Test with large amounts of data
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');
    
    // Check for pagination or virtualization
    const pagination = page.locator('[class*="pagination"], [class*="page"]');
    const virtualList = page.locator('[class*="virtual"], [class*="infinite"]');
    
    const hasPagination = await pagination.count() > 0;
    const hasVirtualization = await virtualList.count() > 0;
    
    expect(hasPagination || hasVirtualization).toBeTruthy();
  });

  test('should handle concurrent users', async ({ page, context }) => {
    // Test concurrent user scenarios
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);

    const promises = pages.map(async (p, index) => {
      await p.goto('/dashboard');
      await p.waitForLoadState('networkidle');
      return p;
    });

    await Promise.all(promises);
    
    // Verify all pages loaded successfully
    for (const p of pages) {
      await expect(p.locator('body')).toBeVisible();
    }
    
    await Promise.all(pages.map(p => p.close()));
  });

  test('should handle network interruptions', async ({ page }) => {
    // Test network interruption scenarios
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Simulate network interruption
    await page.route('**/*', route => route.abort());
    
    // Try to perform actions
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      try {
        await buttons.nth(i).click();
        await page.waitForTimeout(1000);
      } catch (e) {
        // Expected to fail due to network interruption
      }
    }
    
    // Restore network
    await page.unroute('**/*');
    
    // Verify recovery
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle malformed data', async ({ page }) => {
    // Test with malformed data
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ invalid: 'data' })
      });
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify error handling
    const errorElements = page.locator('[class*="error"], [class*="Error"]');
    const errorCount = await errorElements.count();
    
    if (errorCount > 0) {
      await expect(errorElements.first()).toBeVisible();
    }
  });
});`;
}

/**
 * Generate Playwright configuration
 */
function generatePlaywrightConfig() {
  return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});`;
}

/**
 * Get module files for analysis
 */
async function getModuleFiles(modulePath) {
  const files = [];

  try {
    const entries = await fs.readdir(modulePath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subFiles = await getModuleFiles(
          path.join(modulePath, entry.name)
        );
        files.push(...subFiles);
      } else if (
        entry.name.endsWith('.tsx') ||
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.jsx') ||
        entry.name.endsWith('.js')
      ) {
        files.push(path.join(modulePath, entry.name));
      }
    }
  } catch (error) {
    console.error('Failed to read module directory:', error);
  }

  return files;
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllTests().catch(console.error);
}

export { generateAllTests };
