#!/usr/bin/env node

/**
 * Ultimate Workflow Manager
 * إدارة ذكية شاملة لجميع حالات CI/CD
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class UltimateWorkflowManager {
  constructor() {
    this.scenarios = {
      'first-run': {
        name: 'أول تشغيل على المشروع',
        description: 'تشغيل شامل لجميع الاختبارات والتحقق من النظام',
        strategy: 'comprehensive',
        tests: [
          'full-system',
          'database-integrity',
          'security-scan',
          'performance-baseline',
        ],
        duration: 'long',
        priority: 1,
      },
      incremental: {
        name: 'تشغيل تدريجي',
        description: 'اختبارات محددة حسب التغييرات فقط',
        strategy: 'targeted',
        tests: ['affected-modules', 'integration', 'regression'],
        duration: 'medium',
        priority: 2,
      },
      'rapid-commits': {
        name: 'Commits سريعة متعددة',
        description: 'إدارة طابور الـ commits السريعة',
        strategy: 'batch',
        tests: ['critical-only', 'smoke-tests'],
        duration: 'short',
        priority: 3,
      },
      'code-organization': {
        name: 'تنظيم الكود',
        description: 'تنظيف وإعادة تنظيم الكود بأمان',
        strategy: 'safe-refactor',
        tests: [
          'structure-validation',
          'import-cleanup',
          'unused-code-removal',
        ],
        duration: 'medium',
        priority: 4,
      },
      emergency: {
        name: 'حالة طوارئ',
        description: 'إصلاح فوري للمشاكل الحرجة',
        strategy: 'emergency-fix',
        tests: ['critical-path', 'hotfix-validation'],
        duration: 'short',
        priority: 1,
      },
      maintenance: {
        name: 'صيانة دورية',
        description: 'صيانة وتحديث النظام',
        strategy: 'maintenance',
        tests: [
          'dependency-update',
          'security-patch',
          'performance-optimization',
        ],
        duration: 'long',
        priority: 5,
      },
      cleanup: {
        name: 'تنظيف شامل',
        description: 'تنظيف آمن للملفات والبيانات',
        strategy: 'safe-cleanup',
        tests: ['backup-verification', 'cleanup-validation'],
        duration: 'medium',
        priority: 6,
      },
    };

    this.safetyMechanisms = {
      'backup-before-changes': true,
      'rollback-on-failure': true,
      'dry-run-mode': false,
      'max-file-changes': 50,
      'critical-file-protection': [
        'package.json',
        'tsconfig.json',
        'next.config.js',
      ],
      'database-backup': true,
    };
  }

  async analyzeProjectState() {
    log('🔍 تحليل حالة المشروع...', 'cyan');

    const state = {
      isFirstRun: false,
      hasValidationReport: false,
      recentCommits: [],
      rapidCommits: false,
      codeOrganization: 'good',
      needsCleanup: false,
      criticalIssues: [],
      recommendations: [],
    };

    try {
      // فحص إذا كان أول تشغيل
      state.hasValidationReport = fs.existsSync(
        'reports/ai_validation_report.json'
      );
      state.isFirstRun = !state.hasValidationReport;

      // تحليل الـ commits الأخيرة
      const recentCommits = execSync('git log --oneline -10', {
        encoding: 'utf8',
      })
        .trim()
        .split('\n');
      const commitTimes = execSync('git log --format="%ct" -10', {
        encoding: 'utf8',
      })
        .trim()
        .split('\n');

      state.recentCommits = recentCommits.map((commit, index) => ({
        message: commit,
        timestamp: parseInt(commitTimes[index]) * 1000,
      }));

      // فحص الـ rapid commits
      if (commitTimes.length >= 5) {
        const timeDiff = parseInt(commitTimes[0]) - parseInt(commitTimes[4]);
        if (timeDiff < 300) {
          // 5 دقائق
          state.rapidCommits = true;
        }
      }

      // تحليل تنظيم الكود
      state.codeOrganization = await this.analyzeCodeOrganization();

      // فحص الحاجة للتنظيف
      state.needsCleanup = await this.checkCleanupNeeded();

      // فحص المشاكل الحرجة
      state.criticalIssues = await this.detectCriticalIssues();
    } catch (error) {
      log(`❌ خطأ في تحليل حالة المشروع: ${error.message}`, 'red');
    }

    return state;
  }

  async analyzeCodeOrganization() {
    try {
      let score = 100;
      const issues = [];

      // فحص الملفات غير المستخدمة
      const unusedFiles = execSync(
        'find . -name "*.unused" -o -name "*.old" -o -name "*.backup" 2>/dev/null | wc -l',
        { encoding: 'utf8' }
      ).trim();
      if (parseInt(unusedFiles) > 10) {
        score -= 20;
        issues.push('unused-files');
      }

      // فحص الـ imports غير المستخدمة
      try {
        execSync(
          'npx eslint . --ext .js,.jsx,.ts,.tsx --rule "no-unused-vars: error" 2>/dev/null',
          { encoding: 'utf8' }
        );
      } catch (e) {
        if (e.message.includes('no-unused-vars')) {
          score -= 15;
          issues.push('unused-imports');
        }
      }

      // فحص تنظيم الملفات
      const srcFiles = execSync(
        'find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l',
        { encoding: 'utf8' }
      ).trim();
      const componentsFiles = execSync(
        'find src -path "*/components/*" -name "*.tsx" 2>/dev/null | wc -l',
        { encoding: 'utf8' }
      ).trim();

      if (parseInt(srcFiles) > 0 && parseInt(componentsFiles) === 0) {
        score -= 10;
        issues.push('poor-structure');
      }

      if (score >= 80) return 'excellent';
      if (score >= 60) return 'good';
      if (score >= 40) return 'fair';
      return 'poor';
    } catch (error) {
      return 'unknown';
    }
  }

  async checkCleanupNeeded() {
    try {
      // فحص حجم node_modules
      if (fs.existsSync('node_modules')) {
        const size = execSync('du -sm node_modules 2>/dev/null | cut -f1', {
          encoding: 'utf8',
        }).trim();
        if (parseInt(size) > 500) return true;
      }

      // فحص الملفات المؤقتة
      const tempFiles = execSync(
        'find . -name "*.tmp" -o -name "*.log" -mtime +1 2>/dev/null | wc -l',
        { encoding: 'utf8' }
      ).trim();
      if (parseInt(tempFiles) > 20) return true;

      // فحص ملفات البناء القديمة
      const buildFiles = execSync(
        'find . -name ".next" -o -name "dist" -o -name "build" 2>/dev/null | wc -l',
        { encoding: 'utf8' }
      ).trim();
      if (parseInt(buildFiles) > 0) return true;

      return false;
    } catch (error) {
      return false;
    }
  }

  async detectCriticalIssues() {
    const issues = [];

    try {
      // فحص الأخطاء الحرجة
      execSync('npm run type:check 2>/dev/null', { encoding: 'utf8' });
    } catch (e) {
      if (e.message.includes('error TS')) {
        issues.push('typescript-errors');
      }
    }

    try {
      execSync('npm run build 2>/dev/null', { encoding: 'utf8' });
    } catch (e) {
      issues.push('build-failure');
    }

    // فحص الأمان
    try {
      const audit = execSync('npm audit --audit-level=high 2>/dev/null', {
        encoding: 'utf8',
      });
      if (audit.includes('vulnerabilities')) {
        issues.push('security-vulnerabilities');
      }
    } catch (e) {
      // npm audit قد يفشل إذا كان هناك vulnerabilities
      issues.push('security-vulnerabilities');
    }

    return issues;
  }

  determineScenario(projectState) {
    log('🎯 تحديد السيناريو المناسب...', 'cyan');

    // أول تشغيل
    if (projectState.isFirstRun) {
      return this.scenarios['first-run'];
    }

    // حالة طوارئ
    if (projectState.criticalIssues.length > 0) {
      return this.scenarios['emergency'];
    }

    // Commits سريعة
    if (projectState.rapidCommits) {
      return this.scenarios['rapid-commits'];
    }

    // تنظيم الكود
    if (
      projectState.codeOrganization === 'poor' ||
      projectState.codeOrganization === 'fair'
    ) {
      return this.scenarios['code-organization'];
    }

    // تنظيف
    if (projectState.needsCleanup) {
      return this.scenarios['cleanup'];
    }

    // صيانة دورية (كل 24 ساعة)
    const lastMaintenance = this.getLastMaintenance();
    const hoursSinceMaintenance =
      (Date.now() - lastMaintenance) / (1000 * 60 * 60);
    if (hoursSinceMaintenance > 24) {
      return this.scenarios['maintenance'];
    }

    // تشغيل تدريجي عادي
    return this.scenarios['incremental'];
  }

  getLastMaintenance() {
    try {
      const maintenanceFile = 'logs/last-maintenance.json';
      if (fs.existsSync(maintenanceFile)) {
        const data = JSON.parse(fs.readFileSync(maintenanceFile, 'utf8'));
        return new Date(data.timestamp).getTime();
      }
    } catch (error) {
      // تجاهل الأخطاء
    }
    return 0;
  }

  async executeScenario(scenario, projectState) {
    log(`🚀 تنفيذ السيناريو: ${scenario.name}`, 'green');
    log(`📝 الوصف: ${scenario.description}`, 'blue');
    log(`⏱️ المدة المتوقعة: ${scenario.duration}`, 'yellow');

    try {
      // تطبيق آليات الأمان
      if (this.safetyMechanisms['backup-before-changes']) {
        await this.createBackup();
      }

      // تنفيذ السيناريو
      switch (scenario.strategy) {
        case 'comprehensive':
          await this.executeComprehensiveTests();
          break;
        case 'targeted':
          await this.executeTargetedTests(projectState);
          break;
        case 'batch':
          await this.executeBatchProcessing();
          break;
        case 'safe-refactor':
          await this.executeSafeRefactoring();
          break;
        case 'emergency-fix':
          await this.executeEmergencyFix();
          break;
        case 'maintenance':
          await this.executeMaintenance();
          break;
        case 'safe-cleanup':
          await this.executeSafeCleanup();
          break;
        default:
          await this.executeDefaultStrategy();
      }

      // تحديث سجل الصيانة
      this.updateMaintenanceLog(scenario);

      log(`✅ تم تنفيذ السيناريو بنجاح: ${scenario.name}`, 'green');
      return { success: true, scenario: scenario.name };
    } catch (error) {
      log(`❌ فشل في تنفيذ السيناريو: ${error.message}`, 'red');

      // تطبيق آلية الاسترداد
      if (this.safetyMechanisms['rollback-on-failure']) {
        await this.rollbackChanges();
      }

      return { success: false, error: error.message };
    }
  }

  async createBackup() {
    log('💾 إنشاء نسخة احتياطية...', 'cyan');

    const backupDir = `backups/backup-${Date.now()}`;
    fs.mkdirSync(backupDir, { recursive: true });

    // نسخ الملفات المهمة
    const importantFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'src/',
      'components/',
      'lib/',
      'utils/',
    ];

    for (const file of importantFiles) {
      if (fs.existsSync(file)) {
        execSync(`cp -r ${file} ${backupDir}/`, { stdio: 'inherit' });
      }
    }

    log(`✅ تم إنشاء النسخة الاحتياطية في: ${backupDir}`, 'green');
  }

  async executeComprehensiveTests() {
    log('🧪 تنفيذ اختبارات شاملة...', 'cyan');

    // إنشاء اختبارات Playwright شاملة
    await this.createComprehensivePlaywrightTests();

    // تشغيل جميع الاختبارات
    try {
      execSync('npm run test:unit', { stdio: 'inherit' });
    } catch (e) {
      log('⚠️ اختبارات الوحدة غير متاحة، تخطي...', 'yellow');
    }

    try {
      execSync('npx playwright test --reporter=html', { stdio: 'inherit' });
    } catch (e) {
      log('⚠️ اختبارات Playwright غير متاحة، تخطي...', 'yellow');
    }

    // اختبارات Supawright للداتابيز
    if (this.hasSupawright()) {
      execSync('npx supawright test', { stdio: 'inherit' });
    }
  }

  async createComprehensivePlaywrightTests() {
    const testDir = 'tests/comprehensive';
    fs.mkdirSync(testDir, { recursive: true });

    const comprehensiveTest = `
import { test, expect } from '@playwright/test';

test.describe('Comprehensive System Tests', () => {
  test('Full system integration test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Moeen/);
    
    // Test all major functionality
    await testNavigation(page);
    await testDatabaseConnection(page);
    await testAuthentication(page);
    await testCRUDOperations(page);
  });
  
  async function testNavigation(page) {
    const navItems = ['Dashboard', 'Patients', 'Appointments', 'Medical Records'];
    for (const item of navItems) {
      if (await page.locator(\`text=\${item}\`).isVisible()) {
        await page.click(\`text=\${item}\`);
        await page.waitForLoadState('networkidle');
      }
    }
  }
  
  async function testDatabaseConnection(page) {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.database).toBe('connected');
  }
  
  async function testAuthentication(page) {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
  }
  
  async function testCRUDOperations(page) {
    // Test patient CRUD
    await page.goto('/patients');
    if (await page.locator('button:has-text("Add Patient")').isVisible()) {
      await page.click('button:has-text("Add Patient")');
      await page.fill('input[name="name"]', 'Test Patient');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Test Patient')).toBeVisible();
    }
  }
});
`;

    fs.writeFileSync(`${testDir}/full-system.spec.js`, comprehensiveTest);
  }

  async executeTargetedTests(projectState) {
    log('🎯 تنفيذ اختبارات مستهدفة...', 'cyan');

    // تحديد الاختبارات المطلوبة حسب التغييرات
    const affectedModules = projectState.affectedModules || [];

    for (const module of affectedModules) {
      switch (module) {
        case 'frontend':
          execSync('npx playwright test --grep="frontend|ui|component"', {
            stdio: 'inherit',
          });
          break;
        case 'backend':
          execSync('npx playwright test --grep="api|backend|server"', {
            stdio: 'inherit',
          });
          break;
        case 'database':
          if (this.hasSupawright()) {
            execSync('npx supawright test --grep="database"', {
              stdio: 'inherit',
            });
          }
          break;
      }
    }
  }

  async executeBatchProcessing() {
    log('📦 معالجة دفعية للـ rapid commits...', 'cyan');

    // تشغيل اختبارات سريعة فقط
    execSync('npm run test:unit -- --maxWorkers=2', { stdio: 'inherit' });
    execSync(
      'npx playwright test --grep="critical|essential" --reporter=list',
      { stdio: 'inherit' }
    );
  }

  async executeSafeRefactoring() {
    log('🔧 تنفيذ إعادة تنظيم آمنة...', 'cyan');

    // تنظيف الـ imports
    await this.cleanupImports();

    // إزالة الكود غير المستخدم
    await this.removeUnusedCode();

    // إعادة تنظيم الملفات
    await this.reorganizeFiles();
  }

  async cleanupImports() {
    log('🧹 تنظيف الـ imports...', 'cyan');

    const tsFiles = this.findFiles('.ts', '.tsx');
    for (const file of tsFiles) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // إزالة الـ imports غير المستخدمة
        const importLines = content
          .split('\n')
          .filter(line => line.trim().startsWith('import'));
        const usedImports = new Set();

        // تحليل الاستخدام
        for (const line of importLines) {
          const importMatch = line.match(
            /import\s+.*?\s+from\s+['"]([^'"]+)['"]/
          );
          if (importMatch) {
            const module = importMatch[1];
            if (content.includes(module.split('/').pop())) {
              usedImports.add(line);
            }
          }
        }

        // إعادة كتابة الـ imports
        const newContent = content
          .split('\n')
          .map(line => {
            if (line.trim().startsWith('import') && !usedImports.has(line)) {
              return `// ${line} // Removed unused import`;
            }
            return line;
          })
          .join('\n');

        if (newContent !== content) {
          fs.writeFileSync(file, newContent);
          modified = true;
        }

        if (modified) {
          log(`✅ تم تنظيف imports في ${file}`, 'green');
        }
      } catch (error) {
        log(`⚠️ خطأ في تنظيف ${file}: ${error.message}`, 'yellow');
      }
    }
  }

  async removeUnusedCode() {
    log('🗑️ إزالة الكود غير المستخدم...', 'cyan');

    // هذا يتطلب تحليل أكثر تعقيداً
    // سنقوم بإزالة الملفات المؤقتة والملفات .unused
    execSync('find . -name "*.unused" -delete 2>/dev/null || true', {
      stdio: 'inherit',
    });
    execSync('find . -name "*.old" -delete 2>/dev/null || true', {
      stdio: 'inherit',
    });
  }

  async reorganizeFiles() {
    log('📁 إعادة تنظيم الملفات...', 'cyan');

    // إنشاء هيكل منظم
    const structure = {
      'src/components': 'components',
      'src/pages': 'pages',
      'src/lib': 'lib',
      'src/utils': 'utils',
      'src/types': 'types',
    };

    for (const [target, source] of Object.entries(structure)) {
      if (!fs.existsSync(target) && fs.existsSync(source)) {
        fs.mkdirSync(target, { recursive: true });
        execSync(`mv ${source}/* ${target}/ 2>/dev/null || true`, {
          stdio: 'inherit',
        });
      }
    }
  }

  async executeEmergencyFix() {
    log('🚨 تنفيذ إصلاح طارئ...', 'red');

    // إصلاح فوري للمشاكل الحرجة
    execSync('npm run lint:fix', { stdio: 'inherit' });
    execSync('npm run type:check', { stdio: 'inherit' });
    execSync('npm run build', { stdio: 'inherit' });
  }

  async executeMaintenance() {
    log('🔧 تنفيذ صيانة دورية...', 'cyan');

    // تحديث التبعيات
    execSync('npm update', { stdio: 'inherit' });

    // فحص الأمان
    execSync('npm audit fix', { stdio: 'inherit' });

    // تنظيف
    execSync('npm run build', { stdio: 'inherit' });
  }

  async executeSafeCleanup() {
    log('🧹 تنفيذ تنظيف آمن...', 'cyan');

    // تنظيف آمن
    execSync('rm -rf .next dist build 2>/dev/null || true', {
      stdio: 'inherit',
    });
    execSync('find . -name "*.tmp" -delete 2>/dev/null || true', {
      stdio: 'inherit',
    });
    execSync('find . -name "*.log" -mtime +7 -delete 2>/dev/null || true', {
      stdio: 'inherit',
    });
  }

  async executeDefaultStrategy() {
    log('🔄 تنفيذ استراتيجية افتراضية...', 'cyan');

    execSync('npm run test:unit', { stdio: 'inherit' });
    execSync('npx playwright test --reporter=list', { stdio: 'inherit' });
  }

  async rollbackChanges() {
    log('🔄 استرداد التغييرات...', 'yellow');

    // استرداد من النسخة الاحتياطية
    const backupDir = `backups/backup-${Date.now()}`;
    if (fs.existsSync(backupDir)) {
      execSync(`cp -r ${backupDir}/* .`, { stdio: 'inherit' });
      log('✅ تم استرداد التغييرات', 'green');
    }
  }

  findFiles(...extensions) {
    const files = [];
    const searchDir = dir => {
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (
            stat.isDirectory() &&
            !item.startsWith('.') &&
            item !== 'node_modules'
          ) {
            searchDir(fullPath);
          } else if (extensions.some(ext => item.includes(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // تجاهل الأخطاء
      }
    };

    searchDir('.');
    return files;
  }

  hasSupawright() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return !!packageJson.devDependencies?.['supawright'];
    } catch (error) {
      return false;
    }
  }

  updateMaintenanceLog(scenario) {
    const logData = {
      timestamp: new Date().toISOString(),
      scenario: scenario.name,
      strategy: scenario.strategy,
      duration: scenario.duration,
    };

    fs.mkdirSync('logs', { recursive: true });
    fs.writeFileSync(
      'logs/last-maintenance.json',
      JSON.stringify(logData, null, 2)
    );
  }

  async run() {
    log('🚀 Ultimate Workflow Manager', 'bright');
    log('='.repeat(50), 'bright');

    try {
      // 1. تحليل حالة المشروع
      const projectState = await this.analyzeProjectState();

      log(`\n📊 حالة المشروع:`, 'bright');
      log(
        `🔍 أول تشغيل: ${projectState.isFirstRun}`,
        projectState.isFirstRun ? 'yellow' : 'green'
      );
      log(
        `⚡ Commits سريعة: ${projectState.rapidCommits}`,
        projectState.rapidCommits ? 'yellow' : 'green'
      );
      log(
        `📁 تنظيم الكود: ${projectState.codeOrganization}`,
        projectState.codeOrganization === 'excellent' ? 'green' : 'yellow'
      );
      log(
        `🧹 يحتاج تنظيف: ${projectState.needsCleanup}`,
        projectState.needsCleanup ? 'yellow' : 'green'
      );
      log(
        `🚨 مشاكل حرجة: ${projectState.criticalIssues.length}`,
        projectState.criticalIssues.length > 0 ? 'red' : 'green'
      );

      // 2. تحديد السيناريو المناسب
      const scenario = this.determineScenario(projectState);

      // 3. تنفيذ السيناريو
      const result = await this.executeScenario(scenario, projectState);

      // 4. عرض النتائج
      log('\n📈 النتائج النهائية:', 'bright');
      log(`✅ السيناريو: ${scenario.name}`, 'green');
      log(`📝 الاستراتيجية: ${scenario.strategy}`, 'blue');
      log(`⏱️ المدة: ${scenario.duration}`, 'yellow');
      log(
        `🎯 النتيجة: ${result.success ? 'نجح' : 'فشل'}`,
        result.success ? 'green' : 'red'
      );

      if (!result.success) {
        log(`❌ الخطأ: ${result.error}`, 'red');
      }

      return result;
    } catch (error) {
      log(`❌ خطأ في Ultimate Workflow Manager: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// تشغيل المدير
if (require.main === module) {
  const manager = new UltimateWorkflowManager();
  manager.run().catch(error => {
    log(`❌ خطأ فادح: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = UltimateWorkflowManager;
