#!/usr/bin/env node

/**
 * Run All Final Tests
 * ????? ???? ?????????? ????????
 * 
 * This script runs:
 * 1. Build test
 * 2. Lint test
 * 3. Type check
 * 4. Playwright tests
 * 5. Supabase tests
 * 6. 5 Rounds + Round 6
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Running All Final Tests...\n');
console.log('='.repeat(70) + '\n');

const results = {
  build: { passed: false, error: null },
  lint: { passed: false, error: null },
  typeCheck: { passed: false, error: null },
  playwright: { passed: false, error: null },
  supabase: { passed: false, error: null },
  rounds: { passed: false, error: null },
};

// 1. Build Test
console.log('1??  Testing Build...');
try {
  execSync('npm run build', { 
    cwd: projectRoot, 
    stdio: 'pipe',
    timeout: 300000
  });
  results.build.passed = true;
  console.log('   ? Build passed\n');
} catch (error) {
  results.build.passed = false;
  results.build.error = error.message.substring(0, 200);
  console.log('   ? Build failed\n');
}

// 2. Lint Test
console.log('2??  Testing Lint...');
try {
  execSync('npm run lint', { 
    cwd: projectRoot, 
    stdio: 'pipe',
    timeout: 120000
  });
  results.lint.passed = true;
  console.log('   ? Lint passed\n');
} catch (error) {
  results.lint.passed = false;
  results.lint.error = error.message.substring(0, 200);
  console.log('   ? Lint failed\n');
}

// 3. Type Check
console.log('3??  Testing Type Check...');
try {
  execSync('npx tsc --noEmit', { 
    cwd: projectRoot, 
    stdio: 'pipe',
    timeout: 120000
  });
  results.typeCheck.passed = true;
  console.log('   ? Type check passed\n');
} catch (error) {
  results.typeCheck.passed = false;
  results.typeCheck.error = error.message.substring(0, 200);
  console.log('   ? Type check failed\n');
}

// 4. Playwright Tests
console.log('4??  Testing Playwright...');
try {
  execSync('npx playwright test --reporter=list', { 
    cwd: projectRoot, 
    stdio: 'pipe',
    timeout: 300000
  });
  results.playwright.passed = true;
  console.log('   ? Playwright tests passed\n');
} catch (error) {
  results.playwright.passed = false;
  results.playwright.error = error.message.substring(0, 200);
  console.log('   ? Playwright tests failed\n');
}

// 5. Supabase Tests
console.log('5??  Testing Supabase Integration...');
try {
  // Run Supabase connection tests
  execSync('node scripts/round6-comprehensive-testing.mjs --supabase-only', { 
    cwd: projectRoot, 
    stdio: 'pipe',
    timeout: 120000
  });
  results.supabase.passed = true;
  console.log('   ? Supabase tests passed\n');
} catch (error) {
  results.supabase.passed = false;
  results.supabase.error = error.message.substring(0, 200);
  console.log('   ? Supabase tests failed\n');
}

// 6. 5 Rounds + Round 6
console.log('6??  Running 5 Rounds + Round 6...');
try {
  execSync('node scripts/run-all-audits-and-tests.mjs', { 
    cwd: projectRoot, 
    stdio: 'inherit',
    timeout: 600000 // 10 minutes
  });
  results.rounds.passed = true;
  console.log('\n   ? All rounds passed\n');
} catch (error) {
  results.rounds.passed = false;
  results.rounds.error = error.message.substring(0, 200);
  console.log('\n   ? Some rounds failed\n');
}

// Summary
console.log('='.repeat(70));
console.log('?? Final Test Summary');
console.log('='.repeat(70));
console.log(`Build:        ${results.build.passed ? '?' : '?'}`);
console.log(`Lint:         ${results.lint.passed ? '?' : '?'}`);
console.log(`Type Check:   ${results.typeCheck.passed ? '?' : '?'}`);
console.log(`Playwright:   ${results.playwright.passed ? '?' : '?'}`);
console.log(`Supabase:     ${results.supabase.passed ? '?' : '?'}`);
console.log(`5 Rounds + 6: ${results.rounds.passed ? '?' : '?'}`);

const totalTests = 6;
const passedTests = Object.values(results).filter(r => r.passed).length;
const successRate = (passedTests / totalTests * 100).toFixed(1);

console.log(`\nSuccess Rate: ${successRate}% (${passedTests}/${totalTests})`);
console.log('='.repeat(70) + '\n');

// Save results
import { writeFileSync } from 'fs';
writeFileSync(
  join(projectRoot, 'FINAL_TEST_RESULTS.json'),
  JSON.stringify({ ...results, successRate, timestamp: new Date().toISOString() }, null, 2)
);

if (passedTests === totalTests) {
  console.log('? All tests passed! System is ready for production.');
  process.exit(0);
} else {
  console.log('??  Some tests failed. Please review the errors above.');
  process.exit(1);
}
