#!/usr/bin/env node
// scripts/simple_test_stats.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// تشغيل اختبارات محدودة والحصول على الإحصائيات
async function runLimitedTests() {
  log('🧪 Running limited test suite for statistics...');
  
  const results = {
    timestamp: new Date().toISOString(),
    modules: {},
    overall: {
      total: 0,
      passed: 0,
      failed: 0,
      duration: 0
    }
  };

  // الموديولات للاختبار (2 في كل مرة)
  const modules = [
    'app', 'components', 'config', 'constants', 'context', 'core',
    'design-system', 'hooks', 'lib', 'middleware', 'scripts', 'services',
    'styles', 'theme', 'types', 'utils'
  ];

  // تشغيل اختبارات 2 موديول في كل مرة
  for (let i = 0; i < modules.length; i += 2) {
    const module1 = modules[i];
    const module2 = modules[i + 1];
    
    log(`\n📦 Testing modules: ${module1}${module2 ? `, ${module2}` : ''}`);
    
    const startTime = Date.now();
    
    try {
      // تشغيل اختبارات Playwright للموديول الأول
      const test1Path = `tests/generated/playwright/${module1}.spec.ts`;
      if (fs.existsSync(test1Path)) {
        log(`  🎭 Running Playwright tests for ${module1}...`);
        const output1 = execSync(`npx playwright test ${test1Path} --reporter=line`, { 
          cwd: ROOT,
          stdio: 'pipe',
          encoding: 'utf8',
          timeout: 60000 // 1 minute timeout
        });
        
        const stats1 = parseTestOutput(output1.toString());
        if (!results.modules[module1]) {
          results.modules[module1] = { total: 0, passed: 0, failed: 0 };
        }
        results.modules[module1].total += stats1.total;
        results.modules[module1].passed += stats1.passed;
        results.modules[module1].failed += stats1.failed;
        
        log(`    ✅ ${module1}: ${stats1.passed}/${stats1.total} passed`);
      }
      
      // تشغيل اختبارات Playwright للموديول الثاني
      if (module2) {
        const test2Path = `tests/generated/playwright/${module2}.spec.ts`;
        if (fs.existsSync(test2Path)) {
          log(`  🎭 Running Playwright tests for ${module2}...`);
          const output2 = execSync(`npx playwright test ${test2Path} --reporter=line`, { 
            cwd: ROOT,
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 60000
          });
          
          const stats2 = parseTestOutput(output2.toString());
          if (!results.modules[module2]) {
            results.modules[module2] = { total: 0, passed: 0, failed: 0 };
          }
          results.modules[module2].total += stats2.total;
          results.modules[module2].passed += stats2.passed;
          results.modules[module2].failed += stats2.failed;
          
          log(`    ✅ ${module2}: ${stats2.passed}/${stats2.total} passed`);
        }
      }
      
    } catch (error) {
      log(`    ❌ Error testing modules: ${error.message}`);
      
      // إضافة الأخطاء إلى النتائج
      if (!results.modules[module1]) {
        results.modules[module1] = { total: 0, passed: 0, failed: 1 };
      } else {
        results.modules[module1].failed += 1;
      }
      
      if (module2) {
        if (!results.modules[module2]) {
          results.modules[module2] = { total: 0, passed: 0, failed: 1 };
        } else {
          results.modules[module2].failed += 1;
        }
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    results.overall.duration += duration;
    
    log(`  ⏱️ Batch completed in ${Math.round(duration/1000)}s`);
  }
  
  // حساب الإحصائيات العامة
  for (const module in results.modules) {
    const stats = results.modules[module];
    results.overall.total += stats.total;
    results.overall.passed += stats.passed;
    results.overall.failed += stats.failed;
  }
  
  results.overall.passRate = results.overall.total > 0 ? 
    Math.round((results.overall.passed / results.overall.total) * 100) : 0;
  
  return results;
}

// تحليل مخرجات الاختبارات
function parseTestOutput(output) {
  const lines = output.split('\n');
  let total = 0;
  let passed = 0;
  let failed = 0;
  
  for (const line of lines) {
    if (line.includes('✓')) {
      passed++;
      total++;
    } else if (line.includes('✘')) {
      failed++;
      total++;
    } else if (line.includes('Running') && line.includes('tests')) {
      const match = line.match(/(\d+)\s+tests/);
      if (match) {
        total = parseInt(match[1]);
      }
    }
  }
  
  return { total, passed, failed };
}

// عرض الإحصائيات
function displayStats(results) {
  console.log('\n🎯 COMPREHENSIVE TEST STATISTICS');
  console.log('=====================================');
  console.log(`📊 Total Tests: ${results.overall.total}`);
  console.log(`✅ Passed: ${results.overall.passed} (${results.overall.passRate}%)`);
  console.log(`❌ Failed: ${results.overall.failed} (${100 - results.overall.passRate}%)`);
  console.log(`⏱️ Total Duration: ${Math.round(results.overall.duration / 1000)}s`);
  
  console.log('\n📈 Module Breakdown:');
  console.log('--------------------');
  
  for (const module in results.modules) {
    const stats = results.modules[module];
    const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
    const status = stats.failed === 0 ? '✅' : '❌';
    console.log(`${status} ${module}: ${stats.passed}/${stats.total} (${passRate}%)`);
  }
  
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

// حفظ التقرير
function saveReport(results) {
  const reportPath = path.join(REPORTS, 'simple_test_stats.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  const markdownReport = `# Simple Test Statistics Report

## 📊 Overall Statistics
- **Total Tests**: ${results.overall.total}
- **Passed**: ${results.overall.passed} (${results.overall.passRate}%)
- **Failed**: ${results.overall.failed} (${100 - results.overall.passRate}%)
- **Total Duration**: ${Math.round(results.overall.duration / 1000)}s

## 📈 Module Breakdown

${Object.entries(results.modules).map(([module, stats]) => {
  const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
  const status = stats.failed === 0 ? '✅' : '❌';
  return `- **${module}**: ${status} ${stats.passed}/${stats.total} (${passRate}%)`;
}).join('\n')}

## 🎯 Status
${results.overall.passRate >= 90 ? '🟢 EXCELLENT' : 
  results.overall.passRate >= 70 ? '🟡 GOOD' : 
  results.overall.passRate >= 50 ? '🟠 NEEDS IMPROVEMENT' : '🔴 CRITICAL'}

Generated at: ${results.timestamp}
`;

  const markdownPath = path.join(REPORTS, 'simple_test_stats.md');
  fs.writeFileSync(markdownPath, markdownReport);
  
  console.log(`📄 Report saved to: ${reportPath}`);
  console.log(`📄 Markdown report saved to: ${markdownPath}`);
}

// الدالة الرئيسية
async function main() {
  try {
    log('🚀 Starting simple test statistics collection...');
    
    const results = await runLimitedTests();
    
    displayStats(results);
    saveReport(results);
    
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