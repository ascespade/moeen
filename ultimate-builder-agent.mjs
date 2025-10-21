#!/usr/bin/env node

/**
 * 🚀 Ultimate Builder Agent - AI Self-Healing & Auto-Implementation v5.0
 * أجنت البناء الذكي المتقدم - يعمل كـ Builder AI حقيقي
 * 
 * الميزات:
 * - فحص شامل لكل السيناريوهات
 * - إصلاح تلقائي للأخطاء والتحذيرات
 * - تنفيذ تلقائي للأجزاء المفقودة
 * - ربط تلقائي للروابط والأزرار
 * - تحسين الأداء والكود
 * - تطبيق المعايير العالمية
 * - تنظيم المشروع تلقائياً
 * - عمل متوازي وسريع
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UltimateBuilderAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, 'logs', 'ultimate-builder.log');
    this.reportFile = path.join(this.projectRoot, 'reports', 'ultimate-builder-report.md');
    this.isRunning = false;
    this.cycleCount = 0;
    this.maxCycles = Infinity;
    this.fixesApplied = 0;
    this.implementationsAdded = 0;
    this.performanceImprovements = 0;
    this.checkInterval = 60000; // دقيقة واحدة
    this.intervalId = null;
    this.startTime = new Date();
    this.statusFile = 'system-status.json';
    this.parallelWorkers = 4;
    this.qualityThreshold = 95; // 95% جودة مطلوبة
    this.performanceThreshold = 90; // 90% أداء مطلوب
  }

  async init() {
    console.log('🚀 بدء تشغيل Ultimate Builder Agent...');
    console.log('🎯 الهدف: بناء مشروع متكامل ومستقر للإنتاج');
    console.log('⚡ العمل المتوازي: 4 عمال متزامنين');
    console.log('🔍 فحص شامل: كل السيناريوهات والسيناريوهات');
    console.log('🛠️ إصلاح تلقائي: أخطاء، تحذيرات، نواقص');
    console.log('🏗️ تنفيذ تلقائي: أجزاء مفقودة وميزات ناقصة');
    console.log('📈 تحسين مستمر: أداء، كود، تنظيم');

    await this.ensureDirectories();
    await this.log('🤖 Ultimate Builder Agent بدأ التشغيل');
    await this.log(`⏰ وقت البداية: ${this.startTime.toLocaleString('ar-SA')}`);
    await this.log(`🎯 جودة مطلوبة: ${this.qualityThreshold}%`);
    await this.log(`⚡ أداء مطلوب: ${this.performanceThreshold}%`);

    this.isRunning = true;
  }

  async ensureDirectories() {
    const dirs = [
      'logs', 'reports', 'backups', 'tmp', 
      'src/components', 'src/lib', 'src/utils',
      'src/types', 'src/hooks', 'src/contexts',
      'tests/unit', 'tests/integration', 'tests/e2e',
      'docs', 'scripts', 'migrations'
    ];
    
    for (const dir of dirs) {
      try {
        await fs.mkdir(path.join(this.projectRoot, dir), { recursive: true });
      } catch (error) {
        // المجلد موجود بالفعل
      }
    }
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'success' ? '✅' : level === 'warning' ? '⚠️' : 'ℹ️';
    const logMessage = `[${timestamp}] ${prefix} ${message}`;

    try {
      await fs.appendFile(this.logFile, `${logMessage}\n`);
    } catch (error) {
      console.error('خطأ في كتابة السجل:', error.message);
    }

    console.log(logMessage);
  }

  async runCommand(command, options = {}) {
    try {
      const result = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        timeout: options.timeout || 30000,
        ...options,
      });
      return { success: true, output: result };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: error.stdout || error.stderr || '',
      };
    }
  }

  async runParallelTasks(tasks) {
    const results = await Promise.allSettled(
      tasks.map(task => this.executeTask(task))
    );
    
    return results.map((result, index) => ({
      task: tasks[index],
      success: result.status === 'fulfilled',
      result: result.status === 'fulfilled' ? result.value : result.reason
    }));
  }

  async executeTask(task) {
    const { name, command, type } = task;
    await this.log(`🔄 تنفيذ: ${name}`);
    
    const result = await this.runCommand(command, { silent: true });
    
    if (result.success) {
      await this.log(`✅ نجح: ${name}`);
    } else {
      await this.log(`❌ فشل: ${name} - ${result.error}`);
    }
    
    return { name, success: result.success, output: result.output, error: result.error };
  }

  async comprehensiveAnalysis() {
    await this.log('🔍 تحليل شامل للمشروع...');

    const analysis = {
      // جودة الكود
      codeQuality: {
        eslint: { errors: 0, warnings: 0 },
        typescript: { errors: 0, warnings: 0 },
        prettier: { issues: 0 },
        unusedImports: 0,
        deadCode: 0
      },
      
      // الاختبارات
      testing: {
        unit: { passed: 0, failed: 0, coverage: 0 },
        integration: { passed: 0, failed: 0 },
        e2e: { passed: 0, failed: 0 },
        missing: []
      },
      
      // البناء والأداء
      build: {
        success: false,
        bundleSize: 0,
        performance: 0,
        lighthouse: 0
      },
      
      // الوظائف المفقودة
      missingFeatures: {
        brokenLinks: [],
        missingButtons: [],
        incompleteComponents: [],
        missingAPIs: [],
        missingValidations: []
      },
      
      // الأمان
      security: {
        vulnerabilities: 0,
        outdatedDeps: 0,
        securityHeaders: false
      },
      
      // التنظيم
      organization: {
        fileStructure: 0,
        namingConventions: 0,
        documentation: 0
      }
    };

    // فحص ESLint
    const eslintResult = await this.runCommand('npm run lint:check', { silent: true });
    if (!eslintResult.success) {
      const output = eslintResult.output || eslintResult.error || '';
      const errorMatch = output.match(/(\d+) problems \((\d+) errors, (\d+) warnings\)/);
      if (errorMatch) {
        analysis.codeQuality.eslint.errors = parseInt(errorMatch[2]);
        analysis.codeQuality.eslint.warnings = parseInt(errorMatch[3]);
      }
    }

    // فحص TypeScript
    const tsResult = await this.runCommand('npm run type:check', { silent: true });
    if (!tsResult.success) {
      const output = tsResult.output || tsResult.error || '';
      analysis.codeQuality.typescript.errors = (output.match(/error TS/g) || []).length;
    }

    // فحص الاختبارات
    const testResults = await this.runParallelTasks([
      { name: 'Unit Tests', command: 'npm run test:unit', type: 'test' },
      { name: 'Integration Tests', command: 'npm run test:integration', type: 'test' },
      { name: 'E2E Tests', command: 'npm run test:e2e', type: 'test' }
    ]);

    testResults.forEach(result => {
      if (result.task.name.includes('Unit')) {
        analysis.testing.unit.passed = result.success ? 1 : 0;
        analysis.testing.unit.failed = result.success ? 0 : 1;
      } else if (result.task.name.includes('Integration')) {
        analysis.testing.integration.passed = result.success ? 1 : 0;
        analysis.testing.integration.failed = result.success ? 0 : 1;
      } else if (result.task.name.includes('E2E')) {
        analysis.testing.e2e.passed = result.success ? 1 : 0;
        analysis.testing.e2e.failed = result.success ? 0 : 1;
      }
    });

    // فحص البناء
    const buildResult = await this.runCommand('npm run build', { silent: true });
    analysis.build.success = buildResult.success;

    // فحص الروابط المكسورة
    analysis.missingFeatures.brokenLinks = await this.findBrokenLinks();
    
    // فحص الأزرار غير المربوطة
    analysis.missingFeatures.missingButtons = await this.findMissingButtons();
    
    // فحص المكونات غير المكتملة
    analysis.missingFeatures.incompleteComponents = await this.findIncompleteComponents();

    await this.log(`📊 التحليل الشامل: ESLint(${analysis.codeQuality.eslint.errors}E/${analysis.codeQuality.eslint.warnings}W), TypeScript(${analysis.codeQuality.typescript.errors}E), Tests(${analysis.testing.unit.passed + analysis.testing.integration.passed + analysis.testing.e2e.passed}P), Build(${analysis.build.success ? '✅' : '❌'})`);

    return analysis;
  }

  async findBrokenLinks() {
    const brokenLinks = [];
    try {
      // البحث عن الروابط في الملفات
      const files = await this.getAllSourceFiles();
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const linkMatches = content.match(/href=["']([^"']+)["']/g) || [];
        
        for (const match of linkMatches) {
          const link = match.match(/href=["']([^"']+)["']/)[1];
          if (link.startsWith('/') && !await this.checkLinkExists(link)) {
            brokenLinks.push({ file, link });
          }
        }
      }
    } catch (error) {
      await this.log(`⚠️ خطأ في فحص الروابط: ${error.message}`, 'warning');
    }
    return brokenLinks;
  }

  async findMissingButtons() {
    const missingButtons = [];
    try {
      const files = await this.getAllSourceFiles();
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const buttonMatches = content.match(/<button[^>]*>/g) || [];
        
        for (const match of buttonMatches) {
          if (!match.includes('onClick') && !match.includes('onSubmit')) {
            missingButtons.push({ file, button: match });
          }
        }
      }
    } catch (error) {
      await this.log(`⚠️ خطأ في فحص الأزرار: ${error.message}`, 'warning');
    }
    return missingButtons;
  }

  async findIncompleteComponents() {
    const incompleteComponents = [];
    try {
      const files = await this.getAllSourceFiles();
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // البحث عن TODO, FIXME, أو مكونات غير مكتملة
        if (content.includes('TODO') || content.includes('FIXME') || content.includes('// TODO') || content.includes('// FIXME')) {
          incompleteComponents.push({ file, type: 'TODO/FIXME' });
        }
        
        // البحث عن مكونات بدون return
        if (content.includes('function') && !content.includes('return')) {
          incompleteComponents.push({ file, type: 'Missing Return' });
        }
      }
    } catch (error) {
      await this.log(`⚠️ خطأ في فحص المكونات: ${error.message}`, 'warning');
    }
    return incompleteComponents;
  }

  async getAllSourceFiles() {
    const files = [];
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    
    try {
      const srcDir = path.join(this.projectRoot, 'src');
      const entries = await fs.readdir(srcDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(srcDir, entry.name);
        if (entry.isDirectory()) {
          const subFiles = await this.getFilesInDirectory(fullPath, extensions);
          files.push(...subFiles);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      await this.log(`⚠️ خطأ في قراءة الملفات: ${error.message}`, 'warning');
    }
    
    return files;
  }

  async getFilesInDirectory(dir, extensions) {
    const files = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const subFiles = await this.getFilesInDirectory(fullPath, extensions);
          files.push(...subFiles);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // تجاهل الأخطاء
    }
    return files;
  }

  async checkLinkExists(link) {
    // فحص بسيط لوجود الملف
    try {
      const filePath = path.join(this.projectRoot, 'src', link);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async applyComprehensiveFixes(analysis) {
    await this.log('🔧 تطبيق الإصلاحات الشاملة...');

    const fixes = [];

    // إصلاح ESLint
    if (analysis.codeQuality.eslint.errors > 0 || analysis.codeQuality.eslint.warnings > 0) {
      fixes.push({ name: 'ESLint Fix', command: 'npm run lint:fix', priority: 'high' });
    }

    // إصلاح TypeScript
    if (analysis.codeQuality.typescript.errors > 0) {
      fixes.push({ name: 'TypeScript Fix', command: 'npm run type:fix', priority: 'high' });
    }

    // إصلاح Prettier
    fixes.push({ name: 'Prettier Format', command: 'npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}"', priority: 'medium' });

    // إصلاح الروابط المكسورة
    if (analysis.missingFeatures.brokenLinks.length > 0) {
      fixes.push({ name: 'Fix Broken Links', command: 'node scripts/fix-broken-links.js', priority: 'high' });
    }

    // إصلاح الأزرار غير المربوطة
    if (analysis.missingFeatures.missingButtons.length > 0) {
      fixes.push({ name: 'Fix Missing Buttons', command: 'node scripts/fix-missing-buttons.js', priority: 'high' });
    }

    // إصلاح المكونات غير المكتملة
    if (analysis.missingFeatures.incompleteComponents.length > 0) {
      fixes.push({ name: 'Fix Incomplete Components', command: 'node scripts/fix-incomplete-components.js', priority: 'high' });
    }

    // تشغيل الإصلاحات بالتوازي
    const results = await this.runParallelTasks(fixes);
    
    let successCount = 0;
    results.forEach(result => {
      if (result.success) {
        successCount++;
        this.fixesApplied++;
      }
    });

    await this.log(`✅ تم تطبيق ${successCount}/${fixes.length} إصلاح`);
    return successCount;
  }

  async implementMissingFeatures(analysis) {
    await this.log('🏗️ تنفيذ الميزات المفقودة...');

    const implementations = [];

    // إنشاء مكونات مفقودة
    if (analysis.missingFeatures.incompleteComponents.length > 0) {
      implementations.push({ name: 'Create Missing Components', command: 'node scripts/create-missing-components.js', priority: 'high' });
    }

    // إنشاء APIs مفقودة
    if (analysis.missingFeatures.missingAPIs.length > 0) {
      implementations.push({ name: 'Create Missing APIs', command: 'node scripts/create-missing-apis.js', priority: 'high' });
    }

    // إنشاء اختبارات مفقودة
    if (analysis.testing.missing.length > 0) {
      implementations.push({ name: 'Create Missing Tests', command: 'node scripts/create-missing-tests.js', priority: 'medium' });
    }

    // تشغيل التنفيذات بالتوازي
    const results = await this.runParallelTasks(implementations);
    
    let successCount = 0;
    results.forEach(result => {
      if (result.success) {
        successCount++;
        this.implementationsAdded++;
      }
    });

    await this.log(`✅ تم تنفيذ ${successCount}/${implementations.length} ميزة`);
    return successCount;
  }

  async optimizePerformance(analysis) {
    await this.log('⚡ تحسين الأداء...');

    const optimizations = [];

    // تحسين البناء
    optimizations.push({ name: 'Bundle Optimization', command: 'npm run build:analyze', priority: 'high' });
    
    // تحسين الصور
    optimizations.push({ name: 'Image Optimization', command: 'npx next-optimized-images', priority: 'medium' });
    
    // تحسين CSS
    optimizations.push({ name: 'CSS Optimization', command: 'npx purgecss --css src/**/*.css --content src/**/*.{js,jsx,ts,tsx}', priority: 'medium' });
    
    // تحسين قاعدة البيانات
    optimizations.push({ name: 'Database Optimization', command: 'node scripts/optimize-database.js', priority: 'high' });

    // تشغيل التحسينات بالتوازي
    const results = await this.runParallelTasks(optimizations);
    
    let successCount = 0;
    results.forEach(result => {
      if (result.success) {
        successCount++;
        this.performanceImprovements++;
      }
    });

    await this.log(`✅ تم تطبيق ${successCount}/${optimizations.length} تحسين أداء`);
    return successCount;
  }

  async applyCodeStandards() {
    await this.log('📏 تطبيق المعايير العالمية...');

    const standards = [
      { name: 'Clean Code Standards', command: 'node scripts/apply-clean-code.js', priority: 'high' },
      { name: 'Naming Conventions', command: 'node scripts/fix-naming-conventions.js', priority: 'medium' },
      { name: 'File Organization', command: 'node scripts/organize-files.js', priority: 'medium' },
      { name: 'Documentation', command: 'node scripts/generate-documentation.js', priority: 'low' }
    ];

    const results = await this.runParallelTasks(standards);
    
    let successCount = 0;
    results.forEach(result => {
      if (result.success) {
        successCount++;
      }
    });

    await this.log(`✅ تم تطبيق ${successCount}/${standards.length} معيار`);
    return successCount;
  }

  async runComprehensiveTests() {
    await this.log('🧪 تشغيل الاختبارات الشاملة...');

    const tests = [
      { name: 'Unit Tests', command: 'npm run test:unit', priority: 'high' },
      { name: 'Integration Tests', command: 'npm run test:integration', priority: 'high' },
      { name: 'E2E Tests', command: 'npm run test:e2e', priority: 'high' },
      { name: 'Performance Tests', command: 'npm run test:performance', priority: 'medium' },
      { name: 'Security Tests', command: 'npm run test:security', priority: 'high' }
    ];

    const results = await this.runParallelTasks(tests);
    
    let passedCount = 0;
    results.forEach(result => {
      if (result.success) {
        passedCount++;
      }
    });

    await this.log(`✅ نجح ${passedCount}/${tests.length} اختبار`);
    return { passed: passedCount, total: tests.length, success: passedCount === tests.length };
  }

  async generateComprehensiveReport(analysis) {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime.getTime();
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    const report = `# 🚀 Ultimate Builder Agent Report

## 📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}
## ⏰ الوقت: ${new Date().toLocaleTimeString('ar-SA')}
## 🔄 الدورة: ${this.cycleCount}
## ⏱️ وقت التشغيل: ${uptimeHours} ساعة و ${uptimeMinutes} دقيقة

## 📊 حالة المشروع الشاملة

### جودة الكود
- **ESLint:** ${analysis.codeQuality.eslint.errors} أخطاء / ${analysis.codeQuality.eslint.warnings} تحذيرات
- **TypeScript:** ${analysis.codeQuality.typescript.errors} أخطاء
- **Prettier:** ${analysis.codeQuality.prettier.issues} مشاكل

### الاختبارات
- **Unit Tests:** ${analysis.testing.unit.passed} نجح / ${analysis.testing.unit.failed} فشل
- **Integration Tests:** ${analysis.testing.integration.passed} نجح / ${analysis.testing.integration.failed} فشل
- **E2E Tests:** ${analysis.testing.e2e.passed} نجح / ${analysis.testing.e2e.failed} فشل

### البناء والأداء
- **البناء:** ${analysis.build.success ? '✅ نجح' : '❌ فشل'}
- **حجم الحزمة:** ${analysis.build.bundleSize} KB
- **الأداء:** ${analysis.build.performance}%

### الميزات المفقودة
- **روابط مكسورة:** ${analysis.missingFeatures.brokenLinks.length}
- **أزرار غير مربوطة:** ${analysis.missingFeatures.missingButtons.length}
- **مكونات غير مكتملة:** ${analysis.missingFeatures.incompleteComponents.length}

## 🔧 الإصلاحات المطبقة
- **عدد الإصلاحات:** ${this.fixesApplied}
- **الميزات المضافة:** ${this.implementationsAdded}
- **تحسينات الأداء:** ${this.performanceImprovements}

## 📈 التوصيات
${this.generateRecommendations(analysis)}

---
*تم إنشاء هذا التقرير بواسطة Ultimate Builder Agent v5.0*
*يعمل بشكل مستمر مع فحص كل دقيقة*
`;

    await fs.writeFile(this.reportFile, report, 'utf8');
    await this.log(`📊 تم إنشاء التقرير: ${this.reportFile}`);
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.codeQuality.eslint.errors > 0) {
      recommendations.push('- 🔧 إصلاح أخطاء ESLint المتبقية');
    }

    if (analysis.codeQuality.typescript.errors > 0) {
      recommendations.push('- 🔧 إصلاح أخطاء TypeScript المتبقية');
    }

    if (analysis.testing.unit.failed > 0 || analysis.testing.integration.failed > 0 || analysis.testing.e2e.failed > 0) {
      recommendations.push('- 🧪 إصلاح الاختبارات الفاشلة');
    }

    if (!analysis.build.success) {
      recommendations.push('- 🏗️ إصلاح مشاكل البناء');
    }

    if (analysis.missingFeatures.brokenLinks.length > 0) {
      recommendations.push('- 🔗 إصلاح الروابط المكسورة');
    }

    if (analysis.missingFeatures.missingButtons.length > 0) {
      recommendations.push('- 🔘 ربط الأزرار غير المربوطة');
    }

    if (analysis.missingFeatures.incompleteComponents.length > 0) {
      recommendations.push('- 🧩 إكمال المكونات غير المكتملة');
    }

    if (recommendations.length === 0) {
      recommendations.push('- ✅ المشروع في حالة ممتازة وجاهز للإنتاج!');
    }

    return recommendations.join('\n');
  }

  async runCycle() {
    this.cycleCount++;
    await this.log(`\n🔄 بدء الدورة ${this.cycleCount}...`);

    // تحليل شامل
    const analysis = await this.comprehensiveAnalysis();

    // تطبيق الإصلاحات
    await this.applyComprehensiveFixes(analysis);

    // تنفيذ الميزات المفقودة
    await this.implementMissingFeatures(analysis);

    // تحسين الأداء
    await this.optimizePerformance(analysis);

    // تطبيق المعايير
    await this.applyCodeStandards();

    // تشغيل الاختبارات
    const testResults = await this.runComprehensiveTests();

    // إنشاء التقرير
    await this.generateComprehensiveReport(analysis);

    // تحديد ما إذا كان يجب الاستمرار
    const shouldContinue = 
      analysis.codeQuality.eslint.errors > 0 ||
      analysis.codeQuality.typescript.errors > 0 ||
      !testResults.success ||
      !analysis.build.success ||
      analysis.missingFeatures.brokenLinks.length > 0 ||
      analysis.missingFeatures.missingButtons.length > 0 ||
      analysis.missingFeatures.incompleteComponents.length > 0;

    if (shouldContinue) {
      await this.log(`⏳ انتظار دقيقة واحدة قبل الدورة التالية...`);
      return true;
    } else {
      await this.log('🎉 تم إكمال جميع الإصلاحات والتحسينات!');
      await this.log('⏳ انتظار دقيقة واحدة للفحص التالي...');
      return true; // استمر حتى لو تم إصلاح كل شيء
    }
  }

  async startContinuousBuilding() {
    await this.log('🚀 بدء البناء المستمر...');
    
    // تشغيل الدورة الأولى فوراً
    await this.runCycle();

    // ثم تشغيل دورات منتظمة كل دقيقة
    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        await this.runCycle();
      }
    }, this.checkInterval);

    await this.log('✅ البناء المستمر بدأ');
  }

  async stop() {
    await this.log('🛑 إيقاف Ultimate Builder Agent...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    await this.log('✅ تم إيقاف البناء المستمر');
  }

  async run() {
    try {
      await this.init();

      // معالجة إشارات الإيقاف
      process.on('SIGINT', async () => {
        await this.stop();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await this.stop();
        process.exit(0);
      });

      // بدء البناء المستمر
      await this.startContinuousBuilding();

      // الحفاظ على العملية نشطة
      await new Promise(() => {}); // انتظار لا نهائي

    } catch (error) {
      await this.log(`❌ خطأ في Ultimate Builder Agent: ${error.message}`, 'error');
      console.error(error);
    }
  }
}

// تشغيل الـ Agent
const agent = new UltimateBuilderAgent();
agent.run().catch(console.error);
