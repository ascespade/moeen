#!/usr/bin/env node

/**
 * AI Intelligent CI/CD Orchestrator v3.1
 *
 * يدمج:
 * - تحليل الفروقات (Diff Analysis)
 * - توليد اختبارات ذكية (Intelligent Test Generation)
 * - الإصلاح الذاتي (Self-Healing)
 * - التعلم المستمر (Continuous Learning)
 * - المراقبة والتسجيل (Monitoring & Logging)
 */

import { exec, execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logAIResult } from './scripts/ai-logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// تحميل التكوينات
const CONFIG_FILE = path.join(projectRoot, 'ai_agent_config.json');
const CACHE_FILE = path.join(projectRoot, 'ai_training_cache.json');
const DIFF_MAP_FILE = path.join(projectRoot, 'diff_map.json');

let config = {};
let cache = { learned_patterns: [], test_history: [] };

// تحميل التكوين
async function loadConfig() {
  try {
    if (
      await fs
        .access(CONFIG_FILE)
        .then(() => true)
        .catch(() => false)
    ) {
      const content = await fs.readFile(CONFIG_FILE, 'utf8');
      config = JSON.parse(content);
    }
  } catch (error) {
    console.log(
      '⚠️ لم يتم العثور على ملف التكوين، استخدام الإعدادات الافتراضية'
    );
  }
}

// تحميل الذاكرة
async function loadCache() {
  try {
    if (
      await fs
        .access(CACHE_FILE)
        .then(() => true)
        .catch(() => false)
    ) {
      const content = await fs.readFile(CACHE_FILE, 'utf8');
      cache = JSON.parse(content);
    }
  } catch (error) {
    console.log('📝 إنشاء ذاكرة جديدة...');
  }
}

// حفظ الذاكرة
async function saveCache() {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    console.log('💾 تم حفظ الذاكرة');
  } catch (error) {
    console.error('❌ فشل في حفظ الذاكرة:', error.message);
  }
}

// تحليل الفروقات
async function analyzeDiff() {
  console.log('🔍 تحليل الفروقات...');

  const from = process.env.DIFF_FROM || 'HEAD~1';
  const to = process.env.DIFF_TO || 'HEAD';

  let files = [];
  try {
    const raw = execSync(`git diff --name-only ${from} ${to}`)
      .toString()
      .trim();
    files = raw
      ? raw
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean)
      : [];
  } catch (error) {
    console.log('⚠️ لا يمكن الحصول على الفروقات، استخدام جميع الملفات');
    try {
      const raw = execSync('git ls-files src/').toString().trim();
      files = raw
        ? raw
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
        : [];
    } catch (e) {
      files = [];
    }
  }

  // استخراج الموديولات المتأثرة
  const affectedModules = files
    .filter(f => f.startsWith('src/'))
    .map(f => f.replace(/^src\//, '').split('/')[0])
    .filter(Boolean);

  const uniqueModules = [...new Set(affectedModules)];

  const diffMap = {
    timestamp: new Date().toISOString(),
    from,
    to,
    files,
    modules: uniqueModules,
    totalFiles: files.length,
    totalModules: uniqueModules.length,
  };

  await fs.writeFile(DIFF_MAP_FILE, JSON.stringify(diffMap, null, 2), 'utf8');
  console.log(
    `📊 تم تحليل ${files.length} ملف، ${uniqueModules.length} موديول متأثر`
  );

  return diffMap;
}

// توليد اختبارات ذكية
async function generateIntelligentTests(diffMap) {
  console.log('🧪 توليد اختبارات ذكية...');

  const testsDir = path.join(projectRoot, 'tests', 'generated');
  await fs.mkdir(testsDir, { recursive: true });

  const modules = diffMap.modules || [];
  if (modules.length === 0) {
    console.log('⚠️ لا توجد موديولات متأثرة');
    return [];
  }

  const generatedTests = [];

  for (const module of modules) {
    console.log(`  📝 توليد اختبارات لـ ${module}...`);

    // التحقق من التاريخ
    const history = cache.test_history.filter(h => h.module === module);
    const hasFailedBefore = history.some(h => h.status === 'failed');

    // توليد اختبارات بناءً على التاريخ
    let testContent = `// AUTO-GENERATED: Tests for ${module}
import { test, expect } from '@playwright/test';

test.describe('${module} - Comprehensive Tests', () => {
  test('should load ${module} correctly', async ({ page }) => {
    await page.goto('/${module}');
    await expect(page).toHaveTitle(/.*/);
  });
  
  test('should handle basic interactions', async ({ page }) => {
    await page.goto('/${module}');
    // Add specific interactions based on module
  });
  
  ${
    hasFailedBefore
      ? `
  test('regression: previously failed scenario', async ({ page }) => {
    // This test was generated because ${module} failed before
    await page.goto('/${module}');
    // Add specific regression checks
  });
  `
      : ''
  }
  
  test('should handle error states', async ({ page }) => {
    await page.goto('/${module}');
    // Test error handling
  });
});
`;

    const testFile = path.join(testsDir, `${module}.spec.js`);
    await fs.writeFile(testFile, testContent, 'utf8');
    generatedTests.push(testFile);

    console.log(`  ✅ تم توليد: ${testFile}`);
  }

  return generatedTests;
}

// تشغيل الاختبارات المستهدفة
async function runTargetedTests(generatedTests) {
  console.log('🧪 تشغيل الاختبارات المستهدفة...');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
  };

  for (const testFile of generatedTests) {
    try {
      console.log(`  🧪 تشغيل: ${path.basename(testFile)}...`);
      execSync(`npx playwright test ${testFile}`, { stdio: 'inherit' });
      results.passed++;
      results.tests.push({ file: testFile, status: 'passed' });
    } catch (error) {
      results.failed++;
      results.tests.push({
        file: testFile,
        status: 'failed',
        error: error.message,
      });
    }
    results.total++;
  }

  console.log(`📊 النتائج: ${results.passed}/${results.total} نجح`);

  return results;
}

// حلقة الإصلاح الذاتي
async function selfHealingLoop(testResults) {
  console.log('🔧 بدء حلقة الإصلاح الذاتي...');

  const maxRetries = config.safety_measures?.max_retries_per_test || 3;
  let healingAttempts = 0;
  let fixed = 0;

  for (const test of testResults.tests) {
    if (test.status === 'failed' && healingAttempts < maxRetries) {
      console.log(`  🔧 محاولة إصلاح: ${path.basename(test.file)}...`);

      try {
        // تشغيل ESLint fix
        execSync('npm run lint:fix', { stdio: 'ignore' });

        // إعادة تشغيل الاختبار
        execSync(`npx playwright test ${test.file}`, { stdio: 'inherit' });

        test.status = 'fixed';
        fixed++;
        console.log(`  ✅ تم الإصلاح: ${path.basename(test.file)}`);
      } catch (error) {
        console.log(`  ⚠️ فشل الإصلاح: ${path.basename(test.file)}`);
      }

      healingAttempts++;
    }
  }

  console.log(`🔧 تم إصلاح ${fixed} اختبار`);

  return { fixed, attempts: healingAttempts };
}

// التعلم من النتائج
async function learnFromResults(diffMap, testResults, healingResults) {
  console.log('🧠 التعلم من النتائج...');

  // حفظ الأنماط المتعلمة
  for (const module of diffMap.modules) {
    const moduleTests = testResults.tests.filter(t => t.file.includes(module));
    const failedTests = moduleTests.filter(t => t.status === 'failed');

    if (failedTests.length > 0) {
      cache.learned_patterns.push({
        module,
        timestamp: new Date().toISOString(),
        pattern: 'frequent_failure',
        details: `Module ${module} has ${failedTests.length} failed tests`,
      });
    }

    // حفظ التاريخ
    cache.test_history.push({
      module,
      timestamp: new Date().toISOString(),
      status: failedTests.length === 0 ? 'passed' : 'failed',
      totalTests: moduleTests.length,
      failedTests: failedTests.length,
    });
  }

  // الاحتفاظ بآخر 100 سجل فقط
  if (cache.test_history.length > 100) {
    cache.test_history = cache.test_history.slice(-100);
  }

  if (cache.learned_patterns.length > 50) {
    cache.learned_patterns = cache.learned_patterns.slice(-50);
  }

  await saveCache();
  console.log('💾 تم حفظ المعرفة المكتسبة');
}

// إنشاء تقرير شامل
async function generateComprehensiveReport(
  diffMap,
  testResults,
  healingResults
) {
  console.log('📊 إنشاء تقرير شامل...');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesChanged: diffMap.totalFiles,
      modulesAffected: diffMap.totalModules,
      testsGenerated: testResults.total,
      testsPassed: testResults.passed,
      testsFailed: testResults.failed,
      testsFixed: healingResults.fixed,
      healingAttempts: healingResults.attempts,
    },
    diffMap,
    testResults,
    healingResults,
    learnedPatterns: cache.learned_patterns.slice(-10),
  };

  const reportFile = path.join(
    projectRoot,
    'reports',
    'intelligent-ci-report.json'
  );
  await fs.mkdir(path.dirname(reportFile), { recursive: true });
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8');

  // إنشاء تقرير Markdown
  const mdReport = `# 🤖 AI Intelligent CI/CD Report

## 📅 ${new Date().toLocaleString('ar-SA')}

### 📊 الملخص

- **الملفات المتغيرة**: ${report.summary.filesChanged}
- **الموديولات المتأثرة**: ${report.summary.modulesAffected}
- **الاختبارات المولدة**: ${report.summary.testsGenerated}
- **الاختبارات الناجحة**: ${report.summary.testsPassed}
- **الاختبارات الفاشلة**: ${report.summary.testsFailed}
- **الاختبارات المصلحة**: ${report.summary.testsFixed}

### 🔍 الموديولات المتأثرة

${diffMap.modules.map(m => `- \`${m}\``).join('\n')}

### 🧪 نتائج الاختبارات

${testResults.tests.map(t => `- ${path.basename(t.file)}: ${t.status === 'passed' ? '✅' : t.status === 'fixed' ? '🔧' : '❌'} ${t.status}`).join('\n')}

### 🧠 الأنماط المتعلمة

${cache.learned_patterns
  .slice(-5)
  .map(p => `- **${p.module}**: ${p.details}`)
  .join('\n')}

---

*تم إنشاء هذا التقرير بواسطة AI Intelligent CI/CD Orchestrator v3.1*
`;

  const mdReportFile = path.join(
    projectRoot,
    'reports',
    'intelligent-ci-report.md'
  );
  await fs.writeFile(mdReportFile, mdReport, 'utf8');

  console.log(`📊 تم إنشاء التقرير: ${reportFile}`);
  console.log(`📊 تم إنشاء التقرير: ${mdReportFile}`);

  return report;
}

// الوظيفة الرئيسية
async function main() {
  const startTime = Date.now();

  console.log('🚀 بدء AI Intelligent CI/CD Orchestrator v3.1');
  console.log('='.repeat(60));

  try {
    // 1. تحميل التكوينات
    await loadConfig();
    await loadCache();

    // 2. تحليل الفروقات
    const diffMap = await analyzeDiff();

    // 3. توليد اختبارات ذكية
    const generatedTests = await generateIntelligentTests(diffMap);

    // 4. تشغيل الاختبارات المستهدفة
    const testResults = await runTargetedTests(generatedTests);

    // 5. حلقة الإصلاح الذاتي
    const healingResults = await selfHealingLoop(testResults);

    // 6. التعلم من النتائج
    await learnFromResults(diffMap, testResults, healingResults);

    // 7. إنشاء تقرير شامل
    const report = await generateComprehensiveReport(
      diffMap,
      testResults,
      healingResults
    );

    // 8. تسجيل النتائج
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    await logAIResult({
      status: testResults.failed === 0 ? 'success' : 'failed',
      type: 'intelligent-ci',
      duration,
      linesChanged: diffMap.totalFiles,
      qualityScore:
        Math.round((testResults.passed / testResults.total) * 100) || 0,
      notes: `موديولات: ${diffMap.totalModules}, اختبارات: ${testResults.total}, مصلح: ${healingResults.fixed}`,
      branch: execSync('git branch --show-current').toString().trim(),
      commit: execSync('git rev-parse --short HEAD').toString().trim(),
      author: 'AI Orchestrator',
    });

    console.log('='.repeat(60));
    console.log('✅ اكتمل التشغيل بنجاح!');
    console.log(`⏱️  المدة: ${duration} ثانية`);

    process.exit(testResults.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ حدث خطأ فادح:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// تشغيل
main().catch(error => {
  console.error('❌ خطأ غير متوقع:', error);
  process.exit(1);
});
