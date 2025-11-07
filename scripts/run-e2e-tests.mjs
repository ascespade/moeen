#!/usr/bin/env node

/**
 * Run E2E Tests for All User Types
 * ????? ???????? E2E ????? ????? ??????????
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Running E2E Tests for All User Types...\n');
console.log('='.repeat(70));

const testResults = {
  passed: [],
  failed: [],
  total: 0,
  startTime: Date.now(),
};

try {
  console.log('\n?? Starting Playwright E2E Tests...\n');

  const output = execSync(
    'npx playwright test tests/e2e/all-user-types.test.ts --reporter=list --reporter=json',
    {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 600000, // 10 minutes
    }
  );

  console.log(output);

  // Parse console output for test results
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('?') && line.includes('PASSED')) {
      testResults.passed.push(line.trim());
    } else if (line.includes('?') && line.includes('FAILED')) {
      testResults.failed.push(line.trim());
    }
  }

  testResults.total = testResults.passed.length + testResults.failed.length;
} catch (error) {
  console.log('\n??  Tests completed with some failures\n');

  // Try to parse error output
  const errorOutput = error.stdout?.toString() || error.message;
  console.log(errorOutput);

  // Extract test results from error output
  const lines = errorOutput.split('\n');
  for (const line of lines) {
    if (line.includes('?') || line.includes('PASSED') || line.includes('?')) {
      testResults.passed.push(line.trim());
    } else if (
      line.includes('?') ||
      line.includes('FAILED') ||
      line.includes('?')
    ) {
      testResults.failed.push(line.trim());
    }
  }

  testResults.total = testResults.passed.length + testResults.failed.length;
}

const duration = Date.now() - testResults.startTime;

// Summary
console.log('\n' + '='.repeat(70));
console.log('?? E2E Test Summary');
console.log('='.repeat(70));
console.log(`? Passed: ${testResults.passed.length}`);
console.log(`? Failed: ${testResults.failed.length}`);
console.log(`?? Total: ${testResults.total}`);
console.log(`??  Duration: ${(duration / 1000).toFixed(2)}s`);

if (testResults.total > 0) {
  const successRate = (
    (testResults.passed.length / testResults.total) *
    100
  ).toFixed(1);
  console.log(`?? Success Rate: ${successRate}%`);
}

if (testResults.passed.length > 0) {
  console.log('\n? Passed Tests:');
  testResults.passed.slice(0, 10).forEach(test => console.log(`  - ${test}`));
  if (testResults.passed.length > 10) {
    console.log(`  ... and ${testResults.passed.length - 10} more`);
  }
}

if (testResults.failed.length > 0) {
  console.log('\n? Failed Tests:');
  testResults.failed.forEach(test => console.log(`  - ${test}`));
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  duration: duration,
  summary: {
    passed: testResults.passed.length,
    failed: testResults.failed.length,
    total: testResults.total,
    successRate:
      testResults.total > 0
        ? ((testResults.passed.length / testResults.total) * 100).toFixed(1) +
          '%'
        : '0%',
  },
  passed: testResults.passed,
  failed: testResults.failed,
};

writeFileSync(
  join(projectRoot, 'E2E_TEST_RESULTS.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n?? Detailed report saved to: E2E_TEST_RESULTS.json\n');

if (testResults.failed.length === 0 && testResults.total > 0) {
  console.log('?? All E2E tests passed!\n');
  process.exit(0);
} else if (testResults.total === 0) {
  console.log('??  No tests were executed. Please check test configuration.\n');
  process.exit(1);
} else {
  console.log('??  Some tests failed. Please review the results above.\n');
  process.exit(1);
}
