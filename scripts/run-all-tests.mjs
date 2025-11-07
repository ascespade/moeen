#!/usr/bin/env node

/**
 * Run All Comprehensive Tests
 * ????? ???? ?????????? ???????
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Running All Comprehensive Tests...\n');

const testSuites = [
  { name: 'E2E Tests', file: 'tests/e2e/all-user-types-simple.test.ts' },
  { name: 'Round 7 Tests', file: 'tests/comprehensive-round7.test.ts' },
];

const results = {
  passed: [],
  failed: [],
  total: 0,
  startTime: Date.now(),
};

for (const suite of testSuites) {
  try {
    console.log(`\n?? Running ${suite.name}...\n`);

    const output = execSync(
      `npx playwright test ${suite.file} --reporter=list`,
      {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: 300000,
      }
    );

    console.log(output);

    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('?') || line.includes('PASSED') || line.includes('?')) {
        results.passed.push(`${suite.name}: ${line.trim()}`);
      } else if (
        line.includes('?') ||
        line.includes('FAILED') ||
        line.includes('?')
      ) {
        results.failed.push(`${suite.name}: ${line.trim()}`);
      }
    }
  } catch (error) {
    console.log(`\n??  ${suite.name} completed with some failures\n`);
    const errorOutput = error.stdout?.toString() || error.message;
    console.log(errorOutput);

    const lines = errorOutput.split('\n');
    for (const line of lines) {
      if (line.includes('?') || line.includes('PASSED') || line.includes('?')) {
        results.passed.push(`${suite.name}: ${line.trim()}`);
      } else if (
        line.includes('?') ||
        line.includes('FAILED') ||
        line.includes('?')
      ) {
        results.failed.push(`${suite.name}: ${line.trim()}`);
      }
    }
  }
}

results.total = results.passed.length + results.failed.length;
const duration = Date.now() - results.startTime;

console.log('\n' + '='.repeat(70));
console.log('?? Test Summary');
console.log('='.repeat(70));
console.log(`? Passed: ${results.passed.length}`);
console.log(`? Failed: ${results.failed.length}`);
console.log(`?? Total: ${results.total}`);
console.log(`??  Duration: ${(duration / 1000).toFixed(2)}s`);

if (results.total > 0) {
  const successRate = ((results.passed.length / results.total) * 100).toFixed(
    1
  );
  console.log(`?? Success Rate: ${successRate}%`);
}

const report = {
  timestamp: new Date().toISOString(),
  duration,
  summary: {
    passed: results.passed.length,
    failed: results.failed.length,
    total: results.total,
    successRate:
      results.total > 0
        ? ((results.passed.length / results.total) * 100).toFixed(1) + '%'
        : '0%',
  },
  passed: results.passed,
  failed: results.failed,
};

writeFileSync(
  join(projectRoot, 'ALL_TESTS_RESULTS.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n?? Report saved to: ALL_TESTS_RESULTS.json\n');

if (results.failed.length === 0 && results.total > 0) {
  console.log('?? All tests passed!\n');
  process.exit(0);
} else {
  console.log('??  Some tests failed. Please review the results above.\n');
  process.exit(1);
}
