#!/usr/bin/env node

/**
 * AI Orchestrator
 * Main orchestrator for the Ultimate E2E Self-Healing Runner
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

// Import modules
import { generateAllTests } from './ai_test_generator.mjs';
import { applyAllFixes, getFixSummary } from './ai_automated_fixer.mjs';
import { generateComprehensiveReport } from './ai_report_generator.mjs';
import { handlePRWorkflow } from './ai_pr_manager.mjs';

// Configuration
const CONFIG = {
  runId: `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  timeout: 300000, // 5 minutes
  logLevel: 'info',
};

// State tracking
const state = {
  startTime: Date.now(),
  currentStep: 'initialization',
  testResults: [],
  fixes: [],
  errors: [],
  warnings: [],
  modules: [],
  overallStatus: 'PENDING',
};

/**
 * Initialize the orchestrator
 */
async function initialize() {
  console.log('🚀 Initializing Ultimate E2E Self-Healing Runner');
  console.log(`📋 Run ID: ${CONFIG.runId}`);

  try {
    // Check environment
    await checkEnvironment();

    // Create necessary directories
    await createDirectories();

    // Initialize logging
    await initializeLogging();

    console.log('✅ Initialization complete');
    return true;
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    return false;
  }
}

/**
 * Check environment requirements
 */
async function checkEnvironment() {
  console.log('🔍 Checking environment requirements...');

  const requirements = [
    { name: 'Node.js', command: 'node --version', required: true },
    { name: 'npm', command: 'npm --version', required: true },
    { name: 'Git', command: 'git --version', required: true },
    {
      name: 'Playwright',
      command: 'npx playwright --version',
      required: false,
    },
  ];

  for (const req of requirements) {
    try {
      const result = execSync(req.command, {
        cwd: WORKSPACE_ROOT,
        encoding: 'utf8',
      });
      console.log(`✅ ${req.name}: ${result.trim()}`);
    } catch (error) {
      if (req.required) {
        throw new Error(`${req.name} is required but not available`);
      } else {
        console.log(`⚠️ ${req.name}: Not available (optional)`);
      }
    }
  }
}

/**
 * Create necessary directories
 */
async function createDirectories() {
  const directories = [
    'reports',
    'reports/backups',
    'reports/llm_prompts',
    'tests/generated',
    'tests/generated/playwright',
    'tests/generated/supawright',
    'tests/generated/integration',
    'tests/generated/edge-cases',
    'dashboard/logs',
  ];

  for (const dir of directories) {
    await fs.mkdir(path.join(WORKSPACE_ROOT, dir), { recursive: true });
  }

  console.log('✅ Directories created');
}

/**
 * Initialize logging
 */
async function initializeLogging() {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Ultimate E2E Self-Healing Runner started',
    runId: CONFIG.runId,
  };

  await fs.appendFile(
    path.join(WORKSPACE_ROOT, 'reports', 'execution.log'),
    JSON.stringify(logEntry) + '\n'
  );
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Initialize
    state.currentStep = 'initialization';
    const initialized = await initialize();
    if (!initialized) {
      process.exit(1);
    }

    // Step 1: Generate test scenarios
    state.currentStep = 'test_generation';
    console.log('\n🧪 Step 1: Generating test scenarios...');
    const testsGenerated = await generateAllTests();
    if (!testsGenerated) {
      throw new Error('Test generation failed');
    }

    // Step 2: Apply automated fixes
    state.currentStep = 'automated_fixes';
    console.log('\n🔧 Step 2: Applying automated fixes...');
    const fixesApplied = await applyAllFixes();
    if (!fixesApplied) {
      console.log('⚠️ Some fixes failed, continuing...');
    }

    // Step 3: Run tests
    state.currentStep = 'test_execution';
    console.log('\n🧪 Step 3: Running tests...');
    const testResults = await runTests();
    state.testResults = testResults;

    // Step 4: Generate reports
    state.currentStep = 'report_generation';
    console.log('\n📊 Step 4: Generating reports...');
    const reports = await generateComprehensiveReport(
      CONFIG.runId,
      state.testResults,
      state.fixes,
      state.errors,
      state.warnings
    );

    // Step 5: Create PR if needed
    state.currentStep = 'pr_creation';
    console.log('\n📝 Step 5: Creating PR...');
    const prUrl = await createPRIfNeeded();

    // Step 6: Final summary
    state.currentStep = 'completion';
    console.log('\n🎯 Final Summary:');
    await printFinalSummary(prUrl);

    // Determine exit status
    const hasErrors = state.errors.length > 0;
    const hasWarnings = state.warnings.length > 0;
    const hasFailedTests = state.testResults.some(t => t.status === 'failed');

    if (hasErrors || hasFailedTests) {
      console.log('❌ Run completed with errors');
      process.exit(1);
    } else if (hasWarnings) {
      console.log('⚠️ Run completed with warnings');
      process.exit(0);
    } else {
      console.log('✅ Run completed successfully');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    state.errors.push(error.message);
    await logError(error);
    process.exit(1);
  }
}

/**
 * Run tests
 */
async function runTests() {
  try {
    console.log('🧪 Running Playwright tests...');

    // Run Playwright tests
    const playwrightResult = await runPlaywrightTests();

    // Run Supawright tests
    const supawrightResult = await runSupawrightTests();

    // Combine results
    const allResults = [...playwrightResult, ...supawrightResult];

    console.log(`✅ Tests completed: ${allResults.length} total`);
    return allResults;
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    state.errors.push(`Test execution failed: ${error.message}`);
    return [];
  }
}

/**
 * Run Playwright tests
 */
async function runPlaywrightTests() {
  try {
    const playwrightTestsDir = path.join(
      WORKSPACE_ROOT,
      'tests',
      'generated',
      'playwright'
    );

    // Check if tests exist
    try {
      await fs.access(playwrightTestsDir);
    } catch (e) {
      console.log('⚠️ No Playwright tests found');
      return [];
    }

    const result = execSync(
      `npx playwright test ${playwrightTestsDir} --reporter=json`,
      {
        cwd: WORKSPACE_ROOT,
        encoding: 'utf8',
        timeout: CONFIG.timeout,
      }
    );

    const results = JSON.parse(result);
    console.log(`✅ Playwright tests: ${results.length} tests`);
    return results;
  } catch (error) {
    console.log('⚠️ Playwright tests failed:', error.message);
    return [];
  }
}

/**
 * Run Supawright tests
 */
async function runSupawrightTests() {
  try {
    const supawrightTestsDir = path.join(
      WORKSPACE_ROOT,
      'tests',
      'generated',
      'supawright'
    );

    // Check if tests exist
    try {
      await fs.access(supawrightTestsDir);
    } catch (e) {
      console.log('⚠️ No Supawright tests found');
      return [];
    }

    const result = execSync(
      `npx playwright test ${supawrightTestsDir} --reporter=json`,
      {
        cwd: WORKSPACE_ROOT,
        encoding: 'utf8',
        timeout: CONFIG.timeout,
      }
    );

    const results = JSON.parse(result);
    console.log(`✅ Supawright tests: ${results.length} tests`);
    return results;
  } catch (error) {
    console.log('⚠️ Supawright tests failed:', error.message);
    return [];
  }
}

/**
 * Create PR if needed
 */
async function createPRIfNeeded() {
  try {
    const hasChanges = await checkForChanges();

    if (!hasChanges) {
      console.log('ℹ️ No changes detected, skipping PR creation');
      return null;
    }

    const changes = {
      summary: 'Automated fixes and test improvements',
      errors: state.errors.length,
      warnings: state.warnings.length,
      files: await getChangedFiles(),
    };

    const prUrl = await handlePRWorkflow(
      CONFIG.runId,
      changes,
      state.fixes,
      state.testResults
    );

    if (prUrl) {
      console.log(`✅ PR created: ${prUrl}`);
    } else {
      console.log('⚠️ PR creation failed');
    }

    return prUrl;
  } catch (error) {
    console.log('⚠️ PR creation failed:', error.message);
    return null;
  }
}

/**
 * Check for changes
 */
async function checkForChanges() {
  try {
    const result = execSync('git status --porcelain', {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    return result.trim().length > 0;
  } catch (error) {
    console.log('⚠️ Could not check for changes:', error.message);
    return false;
  }
}

/**
 * Get changed files
 */
async function getChangedFiles() {
  try {
    const result = execSync('git diff --name-only', {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    return result
      .trim()
      .split('\n')
      .filter(f => f.trim());
  } catch (error) {
    console.log('⚠️ Could not get changed files:', error.message);
    return [];
  }
}

/**
 * Print final summary
 */
async function printFinalSummary(prUrl) {
  const endTime = Date.now();
  const duration = endTime - state.startTime;

  const passedTests = state.testResults.filter(
    t => t.status === 'passed'
  ).length;
  const failedTests = state.testResults.filter(
    t => t.status === 'failed'
  ).length;
  const skippedTests = state.testResults.filter(
    t => t.status === 'skipped'
  ).length;

  console.log('📊 Final Summary:');
  console.log(`   Run ID: ${CONFIG.runId}`);
  console.log(`   Duration: ${Math.round(duration / 1000)}s`);
  console.log(
    `   Tests: ${state.testResults.length} total, ${passedTests} passed, ${failedTests} failed, ${skippedTests} skipped`
  );
  console.log(`   Errors: ${state.errors.length}`);
  console.log(`   Warnings: ${state.warnings.length}`);
  console.log(`   Fixes: ${state.fixes.length}`);

  if (prUrl) {
    console.log(`   PR: ${prUrl}`);
  }

  // Save final summary
  const summary = {
    runId: CONFIG.runId,
    duration: duration,
    testResults: {
      total: state.testResults.length,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
    },
    issues: {
      errors: state.errors.length,
      warnings: state.warnings.length,
    },
    fixes: state.fixes.length,
    prUrl: prUrl,
    timestamp: new Date().toISOString(),
  };

  await fs.writeFile(
    path.join(WORKSPACE_ROOT, 'reports', 'final_summary.json'),
    JSON.stringify(summary, null, 2)
  );
}

/**
 * Log error
 */
async function logError(error) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message,
    stack: error.stack,
    runId: CONFIG.runId,
    step: state.currentStep,
  };

  await fs.appendFile(
    path.join(WORKSPACE_ROOT, 'reports', 'execution.log'),
    JSON.stringify(logEntry) + '\n'
  );
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n⚠️ Received SIGINT, shutting down gracefully...');

  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    message: 'Process interrupted by user',
    runId: CONFIG.runId,
    step: state.currentStep,
  };

  await fs.appendFile(
    path.join(WORKSPACE_ROOT, 'reports', 'execution.log'),
    JSON.stringify(logEntry) + '\n'
  );

  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️ Received SIGTERM, shutting down gracefully...');

  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    message: 'Process terminated by system',
    runId: CONFIG.runId,
    step: state.currentStep,
  };

  await fs.appendFile(
    path.join(WORKSPACE_ROOT, 'reports', 'execution.log'),
    JSON.stringify(logEntry) + '\n'
  );

  process.exit(1);
});

// Run the orchestrator
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main, CONFIG, state };
