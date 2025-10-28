#!/usr/bin/env node
// scripts/run_parallel_tests.mjs
import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execSync);

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');
const TESTS_DIR = path.join(ROOT, 'tests', 'generated');

// إنشاء المجلدات المطلوبة
fs.mkdirSync(REPORTS, { recursive: true });
fs.mkdirSync(path.join(REPORTS, 'test-results'), { recursive: true });

// الموديولات المكتشفة
const MODULES = [
  'app',
  'components',
  'config',
  'constants',
  'context',
  'core',
  'design-system',
  'hooks',
  'lib',
  'middleware',
  'scripts',
  'services',
  'styles',
  'theme',
  'types',
  'utils',
];

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(REPORTS, 'execution.log'), line + '\n');
}

// تشغيل اختبارات موديول واحد
async function runModuleTests(moduleName) {
  log(`Starting tests for module: ${moduleName}`);

  const results = {
    module: moduleName,
    startTime: new Date().toISOString(),
    tests: {
      playwright: { status: 'pending', output: '', errors: [] },
      supawright: { status: 'pending', output: '', errors: [] },
      integration: { status: 'pending', output: '', errors: [] },
      edgeCases: { status: 'pending', output: '', errors: [] },
    },
    overallStatus: 'pending',
  };

  try {
    // تشغيل اختبارات Playwright
    log(`Running Playwright tests for ${moduleName}`);
    try {
      const playwrightCmd = `npx playwright test tests/generated/playwright/${moduleName}.spec.ts --reporter=list`;
      const playwrightOutput = await exec(playwrightCmd, {
        cwd: ROOT,
        timeout: 300000, // 5 minutes timeout
      });
      results.tests.playwright.status = 'passed';
      results.tests.playwright.output = playwrightOutput.stdout.toString();
      log(`Playwright tests passed for ${moduleName}`);
    } catch (error) {
      results.tests.playwright.status = 'failed';
      results.tests.playwright.output = error.stdout?.toString() || '';
      results.tests.playwright.errors.push(error.message);
      log(`Playwright tests failed for ${moduleName}: ${error.message}`);
    }

    // تشغيل اختبارات Supawright
    log(`Running Supawright tests for ${moduleName}`);
    try {
      const supawrightCmd = `npx playwright test tests/generated/supawright/${moduleName}.spec.ts --reporter=list`;
      const supawrightOutput = await exec(supawrightCmd, {
        cwd: ROOT,
        timeout: 300000,
      });
      results.tests.supawright.status = 'passed';
      results.tests.supawright.output = supawrightOutput.stdout.toString();
      log(`Supawright tests passed for ${moduleName}`);
    } catch (error) {
      results.tests.supawright.status = 'failed';
      results.tests.supawright.output = error.stdout?.toString() || '';
      results.tests.supawright.errors.push(error.message);
      log(`Supawright tests failed for ${moduleName}: ${error.message}`);
    }

    // تشغيل اختبارات التكامل
    log(`Running Integration tests for ${moduleName}`);
    try {
      const integrationCmd = `npx playwright test tests/generated/integration/${moduleName}.spec.ts --reporter=list`;
      const integrationOutput = await exec(integrationCmd, {
        cwd: ROOT,
        timeout: 300000,
      });
      results.tests.integration.status = 'passed';
      results.tests.integration.output = integrationOutput.stdout.toString();
      log(`Integration tests passed for ${moduleName}`);
    } catch (error) {
      results.tests.integration.status = 'failed';
      results.tests.integration.output = error.stdout?.toString() || '';
      results.tests.integration.errors.push(error.message);
      log(`Integration tests failed for ${moduleName}: ${error.message}`);
    }

    // تشغيل اختبارات الحالات الحدية
    log(`Running Edge Case tests for ${moduleName}`);
    try {
      const edgeCasesCmd = `npx playwright test tests/generated/edge-cases/${moduleName}.spec.ts --reporter=list`;
      const edgeCasesOutput = await exec(edgeCasesCmd, {
        cwd: ROOT,
        timeout: 300000,
      });
      results.tests.edgeCases.status = 'passed';
      results.tests.edgeCases.output = edgeCasesOutput.stdout.toString();
      log(`Edge Case tests passed for ${moduleName}`);
    } catch (error) {
      results.tests.edgeCases.status = 'failed';
      results.tests.edgeCases.output = error.stdout?.toString() || '';
      results.tests.edgeCases.errors.push(error.message);
      log(`Edge Case tests failed for ${moduleName}: ${error.message}`);
    }

    // تحديد الحالة العامة
    const allPassed = Object.values(results.tests).every(
      test => test.status === 'passed'
    );
    results.overallStatus = allPassed ? 'passed' : 'failed';
    results.endTime = new Date().toISOString();

    log(`Module ${moduleName} overall status: ${results.overallStatus}`);
  } catch (error) {
    log(`Error running tests for ${moduleName}: ${error.message}`);
    results.overallStatus = 'error';
    results.endTime = new Date().toISOString();
  }

  return results;
}

// تشغيل اختبارات متوازية لـ 2 موديول
async function runParallelTests(module1, module2) {
  log(`Starting parallel tests for modules: ${module1}, ${module2}`);

  const startTime = Date.now();

  // تشغيل الاختبارات بشكل متوازي
  const [results1, results2] = await Promise.all([
    runModuleTests(module1),
    runModuleTests(module2),
  ]);

  const endTime = Date.now();
  const duration = endTime - startTime;

  log(`Parallel tests completed in ${duration}ms`);

  return {
    module1: results1,
    module2: results2,
    duration,
    startTime: new Date(startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
  };
}

// تطبيق الإصلاحات التلقائية
async function applyAutoFixes() {
  log('Applying automatic fixes...');

  try {
    // تشغيل ESLint fixes
    log('Running ESLint fixes...');
    try {
      await exec('npx eslint src --fix --ext .ts,.tsx,.js,.jsx', { cwd: ROOT });
      log('ESLint fixes applied successfully');
    } catch (error) {
      log(`ESLint fixes failed: ${error.message}`);
    }

    // تشغيل Prettier fixes
    log('Running Prettier fixes...');
    try {
      await exec('npx prettier --write src', { cwd: ROOT });
      log('Prettier fixes applied successfully');
    } catch (error) {
      log(`Prettier fixes failed: ${error.message}`);
    }

    // تشغيل TypeScript fixes
    log('Running TypeScript fixes...');
    try {
      await exec('npx tsc --noEmit', { cwd: ROOT });
      log('TypeScript checks passed');
    } catch (error) {
      log(`TypeScript errors found: ${error.message}`);
    }
  } catch (error) {
    log(`Error applying auto fixes: ${error.message}`);
  }
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  log('Starting comprehensive test execution...');

  const allResults = [];
  const failedModules = [];

  // تشغيل الاختبارات 2 موديول في كل مرة
  for (let i = 0; i < MODULES.length; i += 2) {
    const module1 = MODULES[i];
    const module2 = MODULES[i + 1];

    if (module2) {
      log(
        `Running tests for modules ${i + 1}-${i + 2}: ${module1}, ${module2}`
      );
      const parallelResults = await runParallelTests(module1, module2);
      allResults.push(parallelResults);

      // تطبيق الإصلاحات إذا فشلت الاختبارات
      if (
        parallelResults.module1.overallStatus === 'failed' ||
        parallelResults.module2.overallStatus === 'failed'
      ) {
        log('Some tests failed, applying auto fixes...');
        await applyAutoFixes();

        // إعادة تشغيل الاختبارات الفاشلة
        if (parallelResults.module1.overallStatus === 'failed') {
          log(`Retrying tests for ${module1}...`);
          const retryResults1 = await runModuleTests(module1);
          parallelResults.module1 = retryResults1;
          if (retryResults1.overallStatus === 'failed') {
            failedModules.push(module1);
          }
        }

        if (parallelResults.module2.overallStatus === 'failed') {
          log(`Retrying tests for ${module2}...`);
          const retryResults2 = await runModuleTests(module2);
          parallelResults.module2 = retryResults2;
          if (retryResults2.overallStatus === 'failed') {
            failedModules.push(module2);
          }
        }
      }
    } else {
      // موديول واحد فقط
      log(`Running tests for module: ${module1}`);
      const singleResults = await runModuleTests(module1);
      allResults.push({
        module1: singleResults,
        module2: null,
        duration: 0,
        startTime: singleResults.startTime,
        endTime: singleResults.endTime,
      });

      if (singleResults.overallStatus === 'failed') {
        log('Tests failed, applying auto fixes...');
        await applyAutoFixes();

        log(`Retrying tests for ${module1}...`);
        const retryResults = await runModuleTests(module1);
        if (retryResults.overallStatus === 'failed') {
          failedModules.push(module1);
        }
      }
    }
  }

  // إنشاء التقرير النهائي
  const finalReport = {
    timestamp: new Date().toISOString(),
    totalModules: MODULES.length,
    passedModules: MODULES.length - failedModules.length,
    failedModules: failedModules,
    results: allResults,
    summary: {
      overallStatus: failedModules.length === 0 ? 'PASSED' : 'FAILED',
      totalTests: allResults.length * 2,
      passedTests: allResults.filter(
        r =>
          r.module1.overallStatus === 'passed' &&
          (r.module2 === null || r.module2.overallStatus === 'passed')
      ).length,
      failedTests: failedModules.length,
    },
  };

  // حفظ التقرير
  const reportPath = path.join(REPORTS, 'comprehensive_test_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));

  log(`Test execution completed. Report saved to: ${reportPath}`);
  log(`Overall status: ${finalReport.summary.overallStatus}`);
  log(
    `Passed modules: ${finalReport.passedModules}/${finalReport.totalModules}`
  );

  if (failedModules.length > 0) {
    log(`Failed modules: ${failedModules.join(', ')}`);
  }

  return finalReport;
}

// الدالة الرئيسية
async function main() {
  try {
    // إنشاء الاختبارات أولاً
    log('Generating comprehensive tests...');
    await exec('node scripts/generate_comprehensive_tests.mjs', { cwd: ROOT });

    // تشغيل جميع الاختبارات
    const results = await runAllTests();

    // إنشاء تقرير Markdown
    const markdownReport = `# Comprehensive Test Report

## Summary
- **Overall Status**: ${results.summary.overallStatus}
- **Total Modules**: ${results.totalModules}
- **Passed Modules**: ${results.passedModules}
- **Failed Modules**: ${results.failedModules.length}

## Failed Modules
${results.failedModules.length > 0 ? results.failedModules.map(m => `- ${m}`).join('\n') : 'None'}

## Detailed Results
${results.results
  .map(
    (result, index) => `
### Batch ${index + 1}
- **Module 1**: ${result.module1.module} - ${result.module1.overallStatus}
- **Module 2**: ${result.module2 ? result.module2.module + ' - ' + result.module2.overallStatus : 'N/A'}
- **Duration**: ${result.duration}ms
`
  )
  .join('\n')}

## Test Types
- **Playwright**: UI and interaction tests
- **Supawright**: Database and API tests  
- **Integration**: End-to-end workflow tests
- **Edge Cases**: Boundary and error condition tests

Generated at: ${results.timestamp}
`;

    const markdownPath = path.join(REPORTS, 'comprehensive_test_report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    log(`Markdown report saved to: ${markdownPath}`);

    // إنهاء البرنامج
    process.exit(results.summary.overallStatus === 'PASSED' ? 0 : 1);
  } catch (error) {
    log(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
