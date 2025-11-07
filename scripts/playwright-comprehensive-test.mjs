#!/usr/bin/env node

/**
 * Comprehensive Playwright Test Runner
 * ???? ??? ???? ???????? Playwright
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const testResults = {
  passed: [],
  failed: [],
  skipped: [],
};

// Run comprehensive tests
async function runComprehensiveTests() {
  console.log('?? Running Comprehensive Playwright Tests...\n');

  const testSuites = [
    { name: 'API Routes', pattern: 'tests/api/**/*.spec.ts' },
    { name: 'Authentication', pattern: 'tests/auth/**/*.spec.ts' },
    { name: 'Components', pattern: 'tests/components/**/*.spec.ts' },
    { name: 'Database', pattern: 'tests/database/**/*.spec.ts' },
    { name: 'Integration', pattern: 'tests/integration/**/*.spec.ts' },
  ];

  for (const suite of testSuites) {
    console.log(`\n?? Running ${suite.name} tests...`);

    try {
      const { stdout, stderr } = await execAsync(
        `npx playwright test ${suite.pattern} --reporter=list`
      );

      console.log(stdout);
      if (stderr) console.error(stderr);

      testResults.passed.push(suite.name);
    } catch (error) {
      console.error(`? ${suite.name} tests failed:`, error.message);
      testResults.failed.push(suite.name);
    }
  }

  // Generate report
  generateTestReport();
}

// Generate test report
function generateTestReport() {
  console.log('\n?? Test Results Summary:');
  console.log(`  ? Passed: ${testResults.passed.length}`);
  console.log(`  ? Failed: ${testResults.failed.length}`);
  console.log(`  ??  Skipped: ${testResults.skipped.length}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests();
}

export { runComprehensiveTests };
