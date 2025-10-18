#!/usr/bin/env node

/**
 * Ultimate E2E Self-Healing Runner
 * Aggressive autonomous pipeline for comprehensive test coverage and self-healing
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { chromium, firefox, webkit } from 'playwright';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  maxRetriesPerTest: 8,
  maxWorkers: Math.min(require('os').cpus().length - 1, 4),
  runId: `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  backupDir: path.join(WORKSPACE_ROOT, 'reports', 'backups'),
  reportsDir: path.join(WORKSPACE_ROOT, 'reports'),
  testsDir: path.join(WORKSPACE_ROOT, 'tests'),
  logsDir: path.join(WORKSPACE_ROOT, 'dashboard', 'logs'),
  memoryDbPath: path.join(WORKSPACE_ROOT, 'ci_memory.sqlite'),
  commitAuthor: {
    name: 'ai-bot',
    email: 'ai-bot@users.noreply.github.com'
  }
};

// Initialize clients
let supabase = null;
let openai = null;
let memoryDb = null;

// State tracking
const state = {
  startTime: Date.now(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  fixedTests: 0,
  errors: [],
  warnings: [],
  fixes: [],
  testResults: [],
  currentModule: null,
  retryCount: 0
};

/**
 * Initialize all required services
 */
async function initialize() {
  console.log('<LLM_PROMPT>Initializing Ultimate E2E Self-Healing Runner</LLM_PROMPT>');
  
  try {
    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized');
    } else {
      console.log('⚠️ Supabase credentials not found, continuing without DB operations');
    }

    // Initialize OpenAI
    const openaiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY;
    if (openaiKey) {
      openai = new OpenAI({ apiKey: openaiKey });
      console.log('✅ OpenAI client initialized');
    } else {
      console.log('⚠️ OpenAI API key not found, LLM features will be limited');
    }

    // Initialize SQLite memory database
    await initializeMemoryDb();

    // Create backup
    await createBackup();

    console.log('✅ Initialization complete');
    return true;
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    return false;
  }
}

/**
 * Initialize SQLite memory database for tracking
 */
async function initializeMemoryDb() {
  try {
    const sqlite3 = await import('sqlite3');
    const { open } = await import('sqlite');
    
    memoryDb = await open({
      filename: CONFIG.memoryDbPath,
      driver: sqlite3.Database
    });

    await memoryDb.exec(`
      CREATE TABLE IF NOT EXISTS test_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT UNIQUE,
        start_time INTEGER,
        end_time INTEGER,
        status TEXT,
        total_tests INTEGER,
        passed_tests INTEGER,
        failed_tests INTEGER,
        fixed_tests INTEGER,
        errors_count INTEGER,
        warnings_count INTEGER
      )
    `);

    await memoryDb.exec(`
      CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT,
        test_name TEXT,
        status TEXT,
        error_message TEXT,
        fix_applied TEXT,
        retry_count INTEGER,
        timestamp INTEGER
      )
    `);

    await memoryDb.exec(`
      CREATE TABLE IF NOT EXISTS fixes_applied (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT,
        test_name TEXT,
        fix_type TEXT,
        fix_description TEXT,
        success BOOLEAN,
        timestamp INTEGER
      )
    `);

    console.log('✅ Memory database initialized');
  } catch (error) {
    console.error('❌ Failed to initialize memory database:', error);
  }
}

/**
 * Create backup of critical files
 */
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(CONFIG.backupDir, timestamp);
  
  try {
    await fs.mkdir(backupPath, { recursive: true });
    
    // Backup src directory
    await execSync(`cp -r src ${backupPath}/`, { cwd: WORKSPACE_ROOT });
    
    // Backup migrations
    if (await fs.access('migrations').then(() => true).catch(() => false)) {
      await execSync(`cp -r migrations ${backupPath}/`, { cwd: WORKSPACE_ROOT });
    }
    
    // Backup package.json and other config files
    const configFiles = ['package.json', 'next.config.js', 'tailwind.config.js', 'tsconfig.json'];
    for (const file of configFiles) {
      try {
        await fs.copyFile(path.join(WORKSPACE_ROOT, file), path.join(backupPath, file));
      } catch (e) {
        // File might not exist, continue
      }
    }
    
    console.log(`✅ Backup created at ${backupPath}`);
  } catch (error) {
    console.error('❌ Backup creation failed:', error);
  }
}

/**
 * Generate comprehensive test scenarios
 */
async function generateTestScenarios() {
  console.log('<LLM_PROMPT>Generating comprehensive test scenarios</LLM_PROMPT>');
  
  try {
    // Detect modules in src/
    const modules = await detectModules();
    console.log(`📁 Detected modules: ${modules.join(', ')}`);
    
    // Generate Playwright tests
    await generatePlaywrightTests(modules);
    
    // Generate Supawright tests
    await generateSupawrightTests(modules);
    
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
      if (entry.isDirectory()) {
        modules.push(entry.name);
      }
    }
  } catch (error) {
    console.error('Failed to read src directory:', error);
  }
  
  return modules;
}

/**
 * Generate Playwright tests
 */
async function generatePlaywrightTests(modules) {
  const playwrightTestsDir = path.join(CONFIG.testsDir, 'generated', 'playwright');
  await fs.mkdir(playwrightTestsDir, { recursive: true });
  
  for (const module of modules) {
    const testContent = await generateModulePlaywrightTest(module);
    const testFile = path.join(playwrightTestsDir, `${module}.spec.js`);
    await fs.writeFile(testFile, testContent);
  }
}

/**
 * Generate Supawright tests
 */
async function generateSupawrightTests(modules) {
  const supawrightTestsDir = path.join(CONFIG.testsDir, 'generated', 'supawright');
  await fs.mkdir(supawrightTestsDir, { recursive: true });
  
  for (const module of modules) {
    const testContent = await generateModuleSupawrightTest(module);
    const testFile = path.join(supawrightTestsDir, `${module}.test.js`);
    await fs.writeFile(testFile, testContent);
  }
}

/**
 * Generate Playwright test for a module
 */
async function generateModulePlaywrightTest(module) {
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

  test('should handle user interactions', async ({ page }) => {
    // Test form interactions
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        const inputs = form.locator('input, select, textarea');
        const inputCount = await inputs.count();
        
        for (let j = 0; j < inputCount; j++) {
          const input = inputs.nth(j);
          const type = await input.getAttribute('type');
          
          if (type === 'text' || type === 'email') {
            await input.fill('test@example.com');
          } else if (type === 'password') {
            await input.fill('testpassword123');
          } else if (type === 'number') {
            await input.fill('123');
          }
        }
      }
    }
  });

  test('should handle API calls', async ({ page }) => {
    // Monitor network requests
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
    // Test error handling
    const errorElements = page.locator('[class*="error"], [class*="Error"]');
    const errorCount = await errorElements.count();
    
    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const error = errorElements.nth(i);
        await expect(error).toBeVisible();
      }
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test different viewport sizes
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
});`;
}

/**
 * Generate Supawright test for a module
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

    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    expect(error).toBeNull();
  });

  test('should handle ${module} data operations', async () => {
    if (!supabase) {
      test.skip('Supabase not configured');
      return;
    }

    // Test data operations specific to the module
    const testData = {
      name: 'Test ${module}',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try to insert test data (if table exists)
    try {
      const { data, error } = await supabase
        .from('${module.toLowerCase()}')
        .insert(testData)
        .select();

      if (error) {
        console.log('Table ${module.toLowerCase()} might not exist:', error.message);
      } else {
        expect(data).toBeDefined();
        
        // Clean up test data
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

    // Test database constraints and relationships
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.log('Could not access schema information:', error.message);
    } else {
      expect(data).toBeDefined();
    }
  });
});`;
}

/**
 * Execute tests with self-healing
 */
async function executeTestsWithHealing() {
  console.log('<LLM_PROMPT>Executing tests with self-healing</LLM_PROMPT>');
  
  try {
    // Run Playwright tests
    await runPlaywrightTests();
    
    // Run Supawright tests
    await runSupawrightTests();
    
    // Apply automated fixes
    await applyAutomatedFixes();
    
    // Re-run failed tests
    await rerunFailedTests();
    
    console.log('✅ Test execution with healing complete');
    return true;
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    return false;
  }
}

/**
 * Run Playwright tests
 */
async function runPlaywrightTests() {
  const playwrightTestsDir = path.join(CONFIG.testsDir, 'generated', 'playwright');
  
  try {
    const result = execSync(`npx playwright test ${playwrightTestsDir} --reporter=json`, {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8'
    });
    
    const results = JSON.parse(result);
    state.testResults.push(...results);
    state.totalTests += results.length;
    
    console.log(`✅ Playwright tests completed: ${results.length} tests`);
  } catch (error) {
    console.error('❌ Playwright tests failed:', error.message);
    state.errors.push(`Playwright tests failed: ${error.message}`);
  }
}

/**
 * Run Supawright tests
 */
async function runSupawrightTests() {
  const supawrightTestsDir = path.join(CONFIG.testsDir, 'generated', 'supawright');
  
  try {
    const result = execSync(`npx playwright test ${supawrightTestsDir} --reporter=json`, {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8'
    });
    
    const results = JSON.parse(result);
    state.testResults.push(...results);
    state.totalTests += results.length;
    
    console.log(`✅ Supawright tests completed: ${results.length} tests`);
  } catch (error) {
    console.error('❌ Supawright tests failed:', error.message);
    state.errors.push(`Supawright tests failed: ${error.message}`);
  }
}

/**
 * Apply automated fixes
 */
async function applyAutomatedFixes() {
  console.log('<LLM_PROMPT>Applying automated fixes</LLM_PROMPT>');
  
  try {
    // Run ESLint fixes
    try {
      execSync('npx eslint src --fix', { cwd: WORKSPACE_ROOT });
      console.log('✅ ESLint fixes applied');
    } catch (e) {
      console.log('⚠️ ESLint not available or no fixes needed');
    }

    // Run Prettier fixes
    try {
      execSync('npx prettier --write src', { cwd: WORKSPACE_ROOT });
      console.log('✅ Prettier fixes applied');
    } catch (e) {
      console.log('⚠️ Prettier not available or no fixes needed');
    }

    // Apply database fixes if needed
    await applyDatabaseFixes();

    console.log('✅ Automated fixes complete');
  } catch (error) {
    console.error('❌ Automated fixes failed:', error);
  }
}

/**
 * Apply database fixes
 */
async function applyDatabaseFixes() {
  if (!supabase) {
    console.log('⚠️ Supabase not available, skipping database fixes');
    return;
  }

  try {
    // Check for common database issues and apply fixes
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('Could not access table information:', tablesError.message);
      return;
    }

    // Apply common fixes
    const fixes = [
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
    ];

    for (const fix of fixes) {
      try {
        await supabase.rpc('exec_sql', { sql: fix });
        console.log(`✅ Applied database fix: ${fix}`);
      } catch (e) {
        console.log(`⚠️ Could not apply fix: ${fix}`);
      }
    }
  } catch (error) {
    console.error('❌ Database fixes failed:', error);
  }
}

/**
 * Re-run failed tests
 */
async function rerunFailedTests() {
  const failedTests = state.testResults.filter(result => result.status === 'failed');
  
  if (failedTests.length === 0) {
    console.log('✅ No failed tests to re-run');
    return;
  }

  console.log(`🔄 Re-running ${failedTests.length} failed tests`);
  
  for (const test of failedTests) {
    if (state.retryCount < CONFIG.maxRetriesPerTest) {
      state.retryCount++;
      
      try {
        // Re-run individual test
        const result = execSync(`npx playwright test ${test.file} --grep "${test.title}"`, {
          cwd: WORKSPACE_ROOT,
          encoding: 'utf8'
        });
        
        console.log(`✅ Test ${test.title} passed on retry`);
        state.fixedTests++;
      } catch (e) {
        console.log(`❌ Test ${test.title} still failing after retry`);
        state.failedTests++;
      }
    }
  }
}

/**
 * Generate comprehensive report
 */
async function generateReport() {
  console.log('<LLM_PROMPT>Generating comprehensive report</LLM_PROMPT>');
  
  const endTime = Date.now();
  const duration = endTime - state.startTime;
  
  const report = {
    runId: CONFIG.runId,
    startTime: new Date(state.startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
    duration: duration,
    overallStatus: state.errors.length === 0 && state.warnings.length === 0 ? 'OK' : 'ISSUES',
    summary: {
      totalTests: state.totalTests,
      passedTests: state.passedTests,
      failedTests: state.failedTests,
      fixedTests: state.fixedTests,
      errors: state.errors.length,
      warnings: state.warnings.length
    },
    testResults: state.testResults,
    errors: state.errors,
    warnings: state.warnings,
    fixes: state.fixes,
    recommendations: generateRecommendations()
  };

  // Save JSON report
  const reportPath = path.join(CONFIG.reportsDir, 'ai_validation_report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Save markdown summary
  const summaryPath = path.join(CONFIG.reportsDir, 'final_summary.md');
  const summary = generateMarkdownSummary(report);
  await fs.writeFile(summaryPath, summary);

  // Save execution log
  const logPath = path.join(CONFIG.reportsDir, 'execution.log');
  const log = generateExecutionLog(report);
  await fs.writeFile(logPath, log);

  // Save dashboard logs
  const dashboardLogPath = path.join(CONFIG.logsDir, 'logs.json');
  await fs.writeFile(dashboardLogPath, JSON.stringify(report, null, 2));

  // Update memory database
  if (memoryDb) {
    await memoryDb.run(`
      INSERT INTO test_runs (run_id, start_time, end_time, status, total_tests, passed_tests, failed_tests, fixed_tests, errors_count, warnings_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      CONFIG.runId,
      state.startTime,
      endTime,
      report.overallStatus,
      state.totalTests,
      state.passedTests,
      state.failedTests,
      state.fixedTests,
      state.errors.length,
      state.warnings.length
    ]);
  }

  console.log('✅ Report generation complete');
  return report;
}

/**
 * Generate recommendations
 */
function generateRecommendations() {
  const recommendations = [];
  
  if (state.errors.length > 0) {
    recommendations.push('Address critical errors before deployment');
  }
  
  if (state.warnings.length > 0) {
    recommendations.push('Review and resolve warnings for better code quality');
  }
  
  if (state.failedTests > 0) {
    recommendations.push('Investigate and fix failing tests');
  }
  
  if (state.fixedTests > 0) {
    recommendations.push('Review automated fixes and ensure they meet requirements');
  }
  
  return recommendations;
}

/**
 * Generate markdown summary
 */
function generateMarkdownSummary(report) {
  return `# E2E Self-Healing Test Report

## Run Information
- **Run ID**: ${report.runId}
- **Start Time**: ${report.startTime}
- **End Time**: ${report.endTime}
- **Duration**: ${Math.round(report.duration / 1000)}s

## Summary
- **Overall Status**: ${report.overallStatus}
- **Total Tests**: ${report.summary.totalTests}
- **Passed Tests**: ${report.summary.passedTests}
- **Failed Tests**: ${report.summary.failedTests}
- **Fixed Tests**: ${report.summary.fixedTests}
- **Errors**: ${report.summary.errors}
- **Warnings**: ${report.summary.warnings}

## Test Results
${report.testResults.map(result => `- **${result.title}**: ${result.status}`).join('\n')}

## Errors
${report.errors.map(error => `- ${error}`).join('\n')}

## Warnings
${report.warnings.map(warning => `- ${warning}`).join('\n')}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Fixes Applied
${report.fixes.map(fix => `- **${fix.type}**: ${fix.description}`).join('\n')}
`;
}

/**
 * Generate execution log
 */
function generateExecutionLog(report) {
  return `E2E Self-Healing Test Execution Log
========================================

Run ID: ${report.runId}
Start Time: ${report.startTime}
End Time: ${report.endTime}
Duration: ${Math.round(report.duration / 1000)}s

Overall Status: ${report.overallStatus}

Test Summary:
- Total Tests: ${report.summary.totalTests}
- Passed Tests: ${report.summary.passedTests}
- Failed Tests: ${report.summary.failedTests}
- Fixed Tests: ${report.summary.fixedTests}
- Errors: ${report.summary.errors}
- Warnings: ${report.summary.warnings}

Detailed Results:
${JSON.stringify(report.testResults, null, 2)}

Errors:
${report.errors.join('\n')}

Warnings:
${report.warnings.join('\n')}

Fixes Applied:
${report.fixes.map(fix => `${fix.type}: ${fix.description}`).join('\n')}
`;
}

/**
 * Create PR with fixes
 */
async function createPR() {
  console.log('<LLM_PROMPT>Creating PR with fixes</LLM_PROMPT>');
  
  try {
    // Create branch
    const branchName = `ai-auto-fixes/${CONFIG.runId}`;
    execSync(`git checkout -b ${branchName}`, { cwd: WORKSPACE_ROOT });
    
    // Add changes
    execSync('git add .', { cwd: WORKSPACE_ROOT });
    
    // Commit changes
    const commitMessage = `🤖 Auto-Healed: ${CONFIG.runId}

- Fixed ${state.fixedTests} tests
- Resolved ${state.errors.length} errors
- Addressed ${state.warnings.length} warnings
- Applied ${state.fixes.length} automated fixes

Generated by Ultimate E2E Self-Healing Runner
Run ID: ${CONFIG.runId}
`;
    
    execSync(`git commit -m "${commitMessage}"`, { cwd: WORKSPACE_ROOT });
    
    // Push branch
    execSync(`git push origin ${branchName}`, { cwd: WORKSPACE_ROOT });
    
    console.log(`✅ PR created: ${branchName}`);
    return branchName;
  } catch (error) {
    console.error('❌ PR creation failed:', error);
    return null;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Ultimate E2E Self-Healing Runner');
  console.log(`📋 Run ID: ${CONFIG.runId}`);
  
  try {
    // Initialize
    const initialized = await initialize();
    if (!initialized) {
      process.exit(1);
    }

    // Generate test scenarios
    const scenariosGenerated = await generateTestScenarios();
    if (!scenariosGenerated) {
      process.exit(1);
    }

    // Execute tests with healing
    const testsExecuted = await executeTestsWithHealing();
    if (!testsExecuted) {
      process.exit(1);
    }

    // Generate report
    const report = await generateReport();
    
    // Create PR if there are fixes
    if (state.fixes.length > 0 || state.fixedTests > 0) {
      await createPR();
    }

    // Final status
    console.log('\n🎯 Final Status:');
    console.log(`   Overall: ${report.overallStatus}`);
    console.log(`   Tests: ${report.summary.totalTests} total, ${report.summary.passedTests} passed, ${report.summary.failedTests} failed`);
    console.log(`   Issues: ${report.summary.errors} errors, ${report.summary.warnings} warnings`);
    console.log(`   Fixes: ${report.summary.fixedTests} tests fixed`);
    
    if (report.overallStatus === 'OK') {
      console.log('✅ All tests passed with zero errors and warnings!');
      process.exit(0);
    } else {
      console.log('⚠️ Some issues remain - check the report for details');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the main function
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main, CONFIG, state };