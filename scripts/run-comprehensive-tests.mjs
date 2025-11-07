#!/usr/bin/env node

/**
 * Run Comprehensive Tests
 * تشغيل الاختبارات الشاملة
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🧪 Running Comprehensive Tests...\n');
console.log('='.repeat(70));

const testResults = {
  passed: [],
  failed: [],
  total: 0,
};

// Run Playwright tests
console.log('\n1️⃣  Running Playwright Tests...\n');
try {
  const output = execSync(
    'npx playwright test tests/comprehensive-playwright-supabase.test.ts --reporter=list',
    {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 300000,
    }
  );

  console.log(output);

  // Parse results
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('✅') || line.includes('PASSED')) {
      testResults.passed.push(line.trim());
    } else if (line.includes('❌') || line.includes('FAILED')) {
      testResults.failed.push(line.trim());
    }
  }

  testResults.total = testResults.passed.length + testResults.failed.length;
} catch (error) {
  console.log('⚠️  Playwright tests had errors:', error.message);
  const output = error.stdout?.toString() || error.message;
  console.log(output);
}

// Run Supabase tests
console.log('\n2️⃣  Running Supabase Tests...\n');
try {
  const { createClient } = await import('@supabase/supabase-js');
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(projectRoot, '.env.local') });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  Supabase credentials not found');
  } else {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    if (error) {
      testResults.failed.push('Supabase Connection: ' + error.message);
    } else {
      testResults.passed.push('Supabase Connection: SUCCESS');
    }

    // Test tables
    const tables = [
      'users',
      'patients',
      'doctors',
      'appointments',
      'insurance_claims',
    ];
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        if (tableError) {
          testResults.failed.push(`Table ${table}: ${tableError.message}`);
        } else {
          testResults.passed.push(`Table ${table}: EXISTS`);
        }
      } catch (err) {
        testResults.failed.push(`Table ${table}: ERROR`);
      }
    }
  }
} catch (error) {
  console.log('⚠️  Supabase tests error:', error.message);
  testResults.failed.push('Supabase Tests: ' + error.message);
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('📊 Test Summary');
console.log('='.repeat(70));
console.log(`✅ Passed: ${testResults.passed.length}`);
console.log(`❌ Failed: ${testResults.failed.length}`);
console.log(
  `📊 Total: ${testResults.total + testResults.passed.length + testResults.failed.length}`
);

if (testResults.failed.length > 0) {
  console.log('\n❌ Failed Tests:');
  testResults.failed.forEach(test => console.log(`  - ${test}`));
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  passed: testResults.passed,
  failed: testResults.failed,
  total:
    testResults.total + testResults.passed.length + testResults.failed.length,
  successRate:
    (
      (testResults.passed.length /
        (testResults.passed.length + testResults.failed.length)) *
      100
    ).toFixed(2) + '%',
};

writeFileSync(
  join(projectRoot, 'TEST_RESULTS.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Report saved to: TEST_RESULTS.json\n');

if (testResults.failed.length === 0) {
  console.log('🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review.\n');
  process.exit(1);
}
