#!/usr/bin/env node

/**
 * Run Critical Modules Tests
 * Tests: EMR, Finance, Admin, Settings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testFiles = [
  'tests/e2e/critical-modules.spec.ts',
  'tests/e2e/critical-modules-functional.spec.ts',
  'tests/e2e/visual-regression.spec.ts'
];

console.log('🚀 Starting Critical Modules Tests...\n');
console.log('Testing modules: EMR, Finance, Admin, Settings\n');

let totalPassed = 0;
let totalFailed = 0;

for (const testFile of testFiles) {
  if (!fs.existsSync(testFile)) {
    console.log(`⚠️  Test file not found: ${testFile}`);
    continue;
  }

  console.log(`\n📝 Running: ${path.basename(testFile)}`);
  
  try {
    execSync(`npx playwright test ${testFile} --reporter=list`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    totalPassed++;
    console.log(`✅ Passed: ${path.basename(testFile)}`);
  } catch (error) {
    totalFailed++;
    console.log(`❌ Failed: ${path.basename(testFile)}`);
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary');
console.log('='.repeat(50));
console.log(`✅ Passed: ${totalPassed}`);
console.log(`❌ Failed: ${totalFailed}`);
console.log(`📈 Total: ${totalPassed + totalFailed}`);

if (totalFailed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed');
  process.exit(1);
}

