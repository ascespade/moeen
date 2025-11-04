#!/usr/bin/env node
// scripts/test_progress_analyzer.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(REPORTS, 'execution.log'), line + '\n');
}

// تحليل نتائج الاختبارات
function analyzeTestResults() {
  log('📊 Analyzing test results...');

  const results = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    modules: {},
    testTypes: {
      playwright: { total: 0, passed: 0, failed: 0 },
      supawright: { total: 0, passed: 0, failed: 0 },
      integration: { total: 0, passed: 0, failed: 0 },
      edgeCases: { total: 0, passed: 0, failed: 0 },
    },
    errors: [],
    warnings: [],
  };

  // قراءة ملفات التقارير
  const testResultsDir = path.join(ROOT, 'test-results');
  if (fs.existsSync(testResultsDir)) {
    const files = fs.readdirSync(testResultsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(testResultsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        if (data.stats) {
          results.totalTests += data.stats.total || 0;
          results.passedTests += data.stats.passed || 0;
          results.failedTests += data.stats.failed || 0;
          results.skippedTests += data.stats.skipped || 0;
        }

        if (data.suites) {
          for (const suite of data.suites) {
            const moduleName = extractModuleName(suite.title);
            if (moduleName) {
              if (!results.modules[moduleName]) {
                results.modules[moduleName] = {
                  total: 0,
                  passed: 0,
                  failed: 0,
                  skipped: 0,
                };
              }

              results.modules[moduleName].total += suite.tests?.length || 0;
              results.modules[moduleName].passed +=
                suite.tests?.filter(t => t.status === 'passed').length || 0;
              results.modules[moduleName].failed +=
                suite.tests?.filter(t => t.status === 'failed').length || 0;
              results.modules[moduleName].skipped +=
                suite.tests?.filter(t => t.status === 'skipped').length || 0;
            }
          }
        }
      } catch (error) {
        log(`Error reading ${file}: ${error.message}`);
      }
    }
  }

  // تحليل نوع الاختبار من اسم الملف
  function getTestType(fileName) {
    if (fileName.includes('playwright')) return 'playwright';
    if (fileName.includes('supawright')) return 'supawright';
    if (fileName.includes('integration')) return 'integration';
    if (fileName.includes('edge-cases')) return 'edgeCases';
    return 'unknown';
  }

  // استخراج اسم الموديول من عنوان الاختبار
  function extractModuleName(title) {
    const match = title.match(/(\w+)\s+Module/);
    return match ? match[1] : null;
  }

  // حساب النسب المئوية
  results.passRate =
    results.totalTests > 0
      ? Math.round((results.passedTests / results.totalTests) * 100)
      : 0;
  results.failRate =
    results.totalTests > 0
      ? Math.round((results.failedTests / results.totalTests) * 100)
      : 0;
  results.skipRate =
    results.totalTests > 0
      ? Math.round((results.skippedTests / results.totalTests) * 100)
      : 0;

  return results;
}

// تشغيل اختبارات محددة والحصول على الإحصائيات
async function runTestWithStats(testPath, testName) {
  log(`🧪 Running ${testName} tests...`);

  const startTime = Date.now();

  try {
    const output = execSync(`npx playwright test ${testPath} --reporter=json`, {
      cwd: ROOT,
      stdio: 'pipe',
      encoding: 'utf8',
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // تحليل المخرجات
    const lines = output.split('\n');
    let jsonOutput = '';
    let inJson = false;

    for (const line of lines) {
      if (line.trim().startsWith('{')) {
        inJson = true;
      }
      if (inJson) {
        jsonOutput += line + '\n';
      }
    }

    let stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: duration,
    };

    try {
      const data = JSON.parse(jsonOutput);
      if (data.stats) {
        stats = { ...stats, ...data.stats };
      }
    } catch (error) {
      // إذا فشل تحليل JSON، نحاول تحليل المخرجات النصية
      const passedMatches = output.match(/✓\s+(\d+)/g);
      const failedMatches = output.match(/✘\s+(\d+)/g);

      if (passedMatches) {
        stats.passed = passedMatches.length;
      }
      if (failedMatches) {
        stats.failed = failedMatches.length;
      }
      stats.total = stats.passed + stats.failed;
    }

    const passRate =
      stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;

    log(
      `✅ ${testName} completed: ${stats.passed}/${stats.total} passed (${passRate}%) in ${Math.round(duration / 1000)}s`
    );

    return {
      name: testName,
      ...stats,
      passRate,
      success: stats.failed === 0,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    log(`❌ ${testName} failed: ${error.message}`);

    return {
      name: testName,
      total: 0,
      passed: 0,
      failed: 1,
      skipped: 0,
      duration: duration,
      passRate: 0,
      success: false,
      error: error.message,
    };
  }
}

// تشغيل جميع الاختبارات مع الإحصائيات
async function runAllTestsWithStats() {
  log('🚀 Starting comprehensive test execution with statistics...');

  const testSuites = [
    { path: 'tests/generated/playwright/', name: 'Playwright UI Tests' },
    { path: 'tests/generated/supawright/', name: 'Supawright DB Tests' },
    { path: 'tests/generated/integration/', name: 'Integration Tests' },
    { path: 'tests/generated/edge-cases/', name: 'Edge Case Tests' },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    suites: [],
    overall: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      passRate: 0,
    },
  };

  // تشغيل كل مجموعة اختبارات
  for (const suite of testSuites) {
    const suiteResult = await runTestWithStats(suite.path, suite.name);
    results.suites.push(suiteResult);

    // تحديث الإحصائيات العامة
    results.overall.total += suiteResult.total;
    results.overall.passed += suiteResult.passed;
    results.overall.failed += suiteResult.failed;
    results.overall.skipped += suiteResult.skipped;
    results.overall.duration += suiteResult.duration;
  }

  // حساب النسبة المئوية العامة
  results.overall.passRate =
    results.overall.total > 0
      ? Math.round((results.overall.passed / results.overall.total) * 100)
      : 0;

  // حفظ التقرير
  const reportPath = path.join(REPORTS, 'test_progress_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // إنشاء تقرير Markdown
  const markdownReport = generateMarkdownReport(results);
  const markdownPath = path.join(REPORTS, 'test_progress_report.md');
  fs.writeFileSync(markdownPath, markdownReport);

  // عرض الإحصائيات
  displayProgressStats(results);

  return results;
}

// إنشاء تقرير Markdown
function generateMarkdownReport(results) {
  return `# Test Progress Report

## 📊 Overall Statistics
- **Total Tests**: ${results.overall.total}
- **Passed**: ${results.overall.passed} (${results.overall.passRate}%)
- **Failed**: ${results.overall.failed} (${100 - results.overall.passRate}%)
- **Skipped**: ${results.overall.skipped}
- **Total Duration**: ${Math.round(results.overall.duration / 1000)}s

## 📈 Test Suite Breakdown

${results.suites
  .map(
    suite => `
### ${suite.name}
- **Status**: ${suite.success ? '✅ PASSED' : '❌ FAILED'}
- **Tests**: ${suite.passed}/${suite.total} (${suite.passRate}%)
- **Duration**: ${Math.round(suite.duration / 1000)}s
${suite.error ? `- **Error**: ${suite.error}` : ''}
`
  )
  .join('')}

## 🎯 Progress Summary
${
  results.overall.passRate >= 90
    ? '🟢 Excellent'
    : results.overall.passRate >= 70
      ? '🟡 Good'
      : results.overall.passRate >= 50
        ? '🟠 Needs Improvement'
        : '🔴 Critical'
}

Generated at: ${results.timestamp}
`;
}

// عرض إحصائيات التقدم
function displayProgressStats(results) {
  console.log('\n🎯 TEST PROGRESS STATISTICS');
  console.log('=====================================');
  console.log(`📊 Total Tests: ${results.overall.total}`);
  console.log(
    `✅ Passed: ${results.overall.passed} (${results.overall.passRate}%)`
  );
  console.log(
    `❌ Failed: ${results.overall.failed} (${100 - results.overall.passRate}%)`
  );
  console.log(`⏭️ Skipped: ${results.overall.skipped}`);
  console.log(
    `⏱️ Total Duration: ${Math.round(results.overall.duration / 1000)}s`
  );

  console.log('\n📈 Test Suite Breakdown:');
  console.log('------------------------');

  results.suites.forEach(suite => {
    const status = suite.success ? '✅' : '❌';
    const duration = Math.round(suite.duration / 1000);
    console.log(
      `${status} ${suite.name}: ${suite.passed}/${suite.total} (${suite.passRate}%) - ${duration}s`
    );
  });

  console.log('\n🎯 Overall Status:');
  if (results.overall.passRate >= 90) {
    console.log('🟢 EXCELLENT - All tests passing!');
  } else if (results.overall.passRate >= 70) {
    console.log('🟡 GOOD - Most tests passing');
  } else if (results.overall.passRate >= 50) {
    console.log('🟠 NEEDS IMPROVEMENT - Some tests failing');
  } else {
    console.log('🔴 CRITICAL - Many tests failing');
  }

  console.log('=====================================\n');
}

// الدالة الرئيسية
async function main() {
  try {
    const results = await runAllTestsWithStats();

    // إنهاء البرنامج بناءً على النتائج
    if (results.overall.failed === 0) {
      log('🎉 All tests passed successfully!');
      process.exit(0);
    } else {
      log(`⚠️ ${results.overall.failed} tests failed`);
      process.exit(1);
    }
  } catch (error) {
    log(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
