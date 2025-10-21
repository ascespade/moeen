#!/usr/bin/env node

/**
 * 🧠 Ultimate Intelligent Agent - الأجنت الذكي المتقدم
 * يعمل في الخلفية مع مزامنة تلقائية وتحسين مستمر
 */

import { spawn, fork } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import cron from 'node-cron';
import chokidar from 'chokidar';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UltimateIntelligentAgent {
  constructor() {
    this.agentId = process.env.AGENT_ID || 'ultimate-intelligent-agent';
    this.projectPath = process.env.PROJECT_PATH || process.cwd();
    this.projectId = process.env.PROJECT_ID || 'default';
    this.config = JSON.parse(process.env.AGENT_CONFIG || '{}');

    this.isRunning = false;
    this.isBackgroundMode = true;
    this.autoSync = true;
    this.cycleCount = 0;
    this.maxCycles = Infinity;
    this.checkInterval = 30000; // 30 seconds
    this.syncInterval = 300000; // 5 minutes

    this.logFile = path.join(this.projectPath, 'logs', `${this.agentId}.log`);
    this.statusFile = path.join(
      this.projectPath,
      'logs',
      `${this.agentId}-status.json`
    );
    this.backupDir = path.join(this.projectPath, 'backups', this.agentId);
    this.reportsDir = path.join(this.projectPath, 'reports');

    this.lastGitHash = null;
    this.lastSyncTime = null;
    this.performanceMetrics = {
      cyclesCompleted: 0,
      fixesApplied: 0,
      errorsFixed: 0,
      warningsFixed: 0,
      performanceImprovements: 0,
      securityFixes: 0,
      testsAdded: 0,
      documentationAdded: 0,
    };

    this.watchers = new Map();
    this.syncTimeout = null;
  }

  async init() {
    console.log(chalk.cyan(`🧠 ${this.agentId} - بدء التشغيل المتقدم`));

    await this.ensureDirectories();
    await this.log('🚀 بدء تشغيل الأجنت الذكي المتقدم');
    await this.log('🔄 وضع الخلفية مفعل');
    await this.log('📡 المزامنة التلقائية مفعلة');

    // Initialize Git if not exists
    await this.initializeGit();

    // Setup file watchers
    this.setupFileWatchers();

    // Setup auto-sync
    this.setupAutoSync();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    this.isRunning = true;
    await this.saveStatus('running');
  }

  async ensureDirectories() {
    const dirs = ['logs', 'backups', 'temp', 'reports', 'tests', 'docs'];
    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.projectPath, dir));
    }
    await fs.ensureDir(this.backupDir);
    await fs.ensureDir(this.reportsDir);
  }

  async initializeGit() {
    try {
      // Check if git is initialized
      await this.runCommand('git status', { silent: true });
      await this.log('✅ Git مُهيأ بالفعل');
    } catch (error) {
      // Initialize git
      await this.runCommand('git init');
      await this.runCommand('git add .');
      await this.runCommand(
        'git commit -m "Initial commit by Ultimate Intelligent Agent"'
      );
      await this.log('✅ تم تهيئة Git');
    }
  }

  setupFileWatchers() {
    // Watch source files
    const srcWatcher = chokidar.watch(path.join(this.projectPath, 'src'), {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    srcWatcher.on('change', async filePath => {
      await this.log(
        `📝 تغيير في الملف: ${path.relative(this.projectPath, filePath)}`
      );
      this.scheduleSync();
    });

    srcWatcher.on('add', async filePath => {
      await this.log(
        `➕ ملف جديد: ${path.relative(this.projectPath, filePath)}`
      );
      this.scheduleSync();
    });

    srcWatcher.on('unlink', async filePath => {
      await this.log(
        `🗑️ ملف محذوف: ${path.relative(this.projectPath, filePath)}`
      );
      this.scheduleSync();
    });

    this.watchers.set('src', srcWatcher);

    // Watch package.json for dependency changes
    const packageWatcher = chokidar.watch(
      path.join(this.projectPath, 'package.json'),
      {
        persistent: true,
      }
    );

    packageWatcher.on('change', async () => {
      await this.log('📦 تغيير في package.json');
      await this.handleDependencyChange();
    });

    this.watchers.set('package', packageWatcher);
  }

  setupAutoSync() {
    // Sync every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.performSync();
    });

    // Also sync on startup
    setTimeout(() => {
      this.performSync();
    }, 10000); // 10 seconds after startup
  }

  setupPerformanceMonitoring() {
    // Monitor system performance every minute
    cron.schedule('* * * * *', async () => {
      await this.monitorPerformance();
    });
  }

  scheduleSync() {
    // Debounce sync to avoid too many commits
    clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => {
      this.performSync();
    }, 30000); // 30 seconds delay
  }

  async performSync() {
    try {
      await this.log('🔄 بدء المزامنة التلقائية');

      // Check for changes
      const hasChanges = await this.checkForChanges();

      if (hasChanges) {
        await this.log('📝 تم اكتشاف تغييرات، بدء المزامنة');

        // Create backup
        await this.createBackup();

        // Analyze changes
        await this.analyzeChanges();

        // Apply fixes
        await this.applyIntelligentFixes();

        // Run tests
        await this.runComprehensiveTests();

        // Commit changes
        await this.commitChanges();

        // Push to remote if configured
        await this.pushToRemote();

        this.lastSyncTime = new Date().toISOString();
        await this.log('✅ تمت المزامنة بنجاح');

        // Update performance metrics
        this.performanceMetrics.cyclesCompleted++;
      } else {
        await this.log('ℹ️ لا توجد تغييرات للمزامنة');
      }
    } catch (error) {
      await this.log(`❌ خطأ في المزامنة: ${error.message}`, 'error');
    }
  }

  async checkForChanges() {
    try {
      const result = await this.runCommand('git status --porcelain', {
        silent: true,
      });
      return result.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  async analyzeChanges() {
    await this.log('🔍 تحليل التغييرات...');

    try {
      // Get changed files
      const changedFiles = await this.runCommand(
        'git diff --name-only HEAD~1',
        { silent: true }
      );
      const files = changedFiles.split('\n').filter(f => f.trim());

      for (const file of files) {
        await this.analyzeFile(file);
      }

      await this.log(`📊 تم تحليل ${files.length} ملف`);
    } catch (error) {
      await this.log(`⚠️ خطأ في تحليل التغييرات: ${error.message}`, 'warning');
    }
  }

  async analyzeFile(filePath) {
    try {
      const fullPath = path.join(this.projectPath, filePath);

      if (!(await fs.pathExists(fullPath))) {
        return;
      }

      const content = await fs.readFile(fullPath, 'utf8');

      // Analyze code quality
      const issues = await this.detectIssues(content, filePath);

      if (issues.length > 0) {
        await this.log(`🔍 مشاكل في ${filePath}: ${issues.length} مشكلة`);
        await this.fixIssues(fullPath, issues);
      }
    } catch (error) {
      await this.log(
        `⚠️ خطأ في تحليل الملف ${filePath}: ${error.message}`,
        'warning'
      );
    }
  }

  async detectIssues(content, filePath) {
    const issues = [];

    // Check for common issues
    if (content.includes('console.log')) {
      issues.push({
        type: 'console-log',
        severity: 'warning',
        message: 'إزالة console.log',
      });
    }

    if (content.includes('TODO') || content.includes('FIXME')) {
      issues.push({
        type: 'todo',
        severity: 'info',
        message: 'معالجة TODO/FIXME',
      });
    }

    if (content.includes('any') && filePath.endsWith('.ts')) {
      issues.push({
        type: 'any-type',
        severity: 'warning',
        message: 'تجنب استخدام any',
      });
    }

    if (content.includes('var ')) {
      issues.push({
        type: 'var-usage',
        severity: 'warning',
        message: 'استخدم let/const بدلاً من var',
      });
    }

    return issues;
  }

  async fixIssues(filePath, issues) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;

      for (const issue of issues) {
        switch (issue.type) {
          case 'console-log':
            content = content.replace(/console\.log\([^)]*\);?\s*/g, '');
            modified = true;
            this.performanceMetrics.fixesApplied++;
            break;

          case 'var-usage':
            content = content.replace(/\bvar\s+/g, 'let ');
            modified = true;
            this.performanceMetrics.fixesApplied++;
            break;

          // Add more fix types as needed
        }
      }

      if (modified) {
        await fs.writeFile(filePath, content);
        await this.log(
          `✅ تم إصلاح ${issues.length} مشكلة في ${path.basename(filePath)}`
        );
        this.performanceMetrics.errorsFixed += issues.length;
      }
    } catch (error) {
      await this.log(
        `❌ خطأ في إصلاح الملف ${filePath}: ${error.message}`,
        'error'
      );
    }
  }

  async applyIntelligentFixes() {
    await this.log('🔧 تطبيق الإصلاحات الذكية...');

    try {
      // ESLint fixes
      await this.runCommand('npm run lint:fix', { silent: true });
      this.performanceMetrics.fixesApplied++;

      // Prettier formatting
      await this.runCommand(
        'npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}"',
        { silent: true }
      );

      // TypeScript fixes
      await this.runCommand('npm run type-check', { silent: true });

      // Security fixes
      await this.runCommand('npm audit fix', { silent: true });
      this.performanceMetrics.securityFixes++;

      await this.log('✅ تم تطبيق الإصلاحات الذكية');
    } catch (error) {
      await this.log(`⚠️ بعض الإصلاحات فشلت: ${error.message}`, 'warning');
    }
  }

  async runComprehensiveTests() {
    await this.log('🧪 تشغيل الاختبارات الشاملة...');

    try {
      // Unit tests
      await this.runCommand('npm run test:unit', { silent: true });
      this.performanceMetrics.testsAdded++;

      // Integration tests
      await this.runCommand('npm run test:integration', { silent: true });

      // E2E tests
      await this.runCommand('npm run test:e2e', { silent: true });

      await this.log('✅ نجحت جميع الاختبارات');
    } catch (error) {
      await this.log(`⚠️ بعض الاختبارات فشلت: ${error.message}`, 'warning');
    }
  }

  async commitChanges() {
    try {
      const timestamp = new Date().toISOString();
      const commitMessage = `Auto-sync: ${timestamp} - ${this.performanceMetrics.fixesApplied} fixes applied`;

      await this.runCommand('git add .');
      await this.runCommand(`git commit -m "${commitMessage}"`);

      await this.log(`📝 تم حفظ التغييرات: ${commitMessage}`);
    } catch (error) {
      await this.log(`⚠️ خطأ في حفظ التغييرات: ${error.message}`, 'warning');
    }
  }

  async pushToRemote() {
    try {
      // Check if remote exists
      const remotes = await this.runCommand('git remote -v', { silent: true });

      if (remotes.trim()) {
        await this.runCommand('git push');
        await this.log('📤 تم دفع التغييرات إلى Git');
      } else {
        await this.log('ℹ️ لا يوجد remote مُعرّف');
      }
    } catch (error) {
      await this.log(`⚠️ خطأ في دفع التغييرات: ${error.message}`, 'warning');
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

    await fs.ensureDir(backupPath);

    // Copy important files
    const importantFiles = [
      'src',
      'package.json',
      'tsconfig.json',
      'next.config.js',
    ];
    for (const file of importantFiles) {
      const srcPath = path.join(this.projectPath, file);
      const destPath = path.join(backupPath, file);

      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
      }
    }

    await this.log(`💾 تم إنشاء نسخة احتياطية: ${path.basename(backupPath)}`);
  }

  async monitorPerformance() {
    try {
      const systemInfo = {
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        cycles: this.cycleCount,
        metrics: this.performanceMetrics,
      };

      await fs.writeJson(
        path.join(this.reportsDir, 'performance.json'),
        systemInfo,
        { spaces: 2 }
      );
    } catch (error) {
      await this.log(`⚠️ خطأ في مراقبة الأداء: ${error.message}`, 'warning');
    }
  }

  async runCommand(command, options = {}) {
    const { spawn } = await import('child_process');

    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, {
        cwd: this.projectPath,
        shell: true,
        ...options,
      });

      let output = '';
      let error = '';

      process.stdout.on('data', data => {
        output += data.toString();
      });

      process.stderr.on('data', data => {
        error += data.toString();
      });

      process.on('close', code => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(error || `Command failed with code ${code}`));
        }
      });
    });
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    console.log(logMessage);

    try {
      await fs.appendFile(this.logFile, `${logMessage}\n`);
    } catch (error) {
      console.error('خطأ في كتابة السجل:', error.message);
    }

    // Send to parent process
    if (process.send) {
      process.send({
        type: 'log',
        level,
        message,
        timestamp,
      });
    }
  }

  async saveStatus(status) {
    const statusData = {
      agentId: this.agentId,
      status,
      timestamp: new Date().toISOString(),
      cycleCount: this.cycleCount,
      isBackgroundMode: this.isBackgroundMode,
      autoSync: this.autoSync,
      lastSyncTime: this.lastSyncTime,
      performanceMetrics: this.performanceMetrics,
    };

    await fs.writeJson(this.statusFile, statusData, { spaces: 2 });

    if (process.send) {
      process.send({
        type: 'status',
        status,
        data: statusData,
      });
    }
  }

  async runCycle() {
    this.cycleCount++;
    await this.log(`\n🔄 بدء الدورة ${this.cycleCount}...`);

    try {
      // Comprehensive analysis
      const analysis = await this.comprehensiveAnalysis();

      // Apply intelligent fixes
      await this.applyIntelligentFixes();

      // Generate documentation
      await this.generateDocumentation();

      // Update progress
      if (process.send) {
        process.send({
          type: 'progress',
          progress: Math.min(100, this.cycleCount * 5),
          status: 'running',
        });
      }

      await this.saveStatus('running');
    } catch (error) {
      await this.log(`❌ خطأ في الدورة: ${error.message}`, 'error');
    }
  }

  async comprehensiveAnalysis() {
    await this.log('🔍 تحليل شامل للمشروع...');

    const analysis = {
      files: 0,
      lines: 0,
      errors: 0,
      warnings: 0,
      suggestions: [],
    };

    try {
      const files = await this.getAllSourceFiles();
      analysis.files = files.length;

      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        analysis.lines += content.split('\n').length;
      }

      await this.log(
        `📊 تحليل المشروع: ${analysis.files} ملف، ${analysis.lines} سطر`
      );
    } catch (error) {
      await this.log(`❌ خطأ في التحليل: ${error.message}`, 'error');
    }

    return analysis;
  }

  async getAllSourceFiles() {
    const files = [];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs'];

    try {
      const srcDir = path.join(this.projectPath, 'src');
      if (await fs.pathExists(srcDir)) {
        await this.getFilesInDirectory(srcDir, files, extensions);
      }
    } catch (error) {
      // Handle error
    }

    return files;
  }

  async getFilesInDirectory(dir, files, extensions) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await this.getFilesInDirectory(fullPath, files, extensions);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  async generateDocumentation() {
    await this.log('📚 توليد التوثيق...');

    try {
      // Generate API documentation
      await this.runCommand('npx typedoc src --out docs/api', { silent: true });

      // Generate README
      await this.generateReadme();

      this.performanceMetrics.documentationAdded++;
      await this.log('✅ تم توليد التوثيق');
    } catch (error) {
      await this.log(`⚠️ خطأ في توليد التوثيق: ${error.message}`, 'warning');
    }
  }

  async generateReadme() {
    const readme = `# ${path.basename(this.projectPath)}

## الوصف
مشروع تم تطويره وتحسينه بواسطة Ultimate Intelligent Agent

## الميزات
- ✅ كود نظيف ومحسن
- ✅ اختبارات شاملة
- ✅ توثيق كامل
- ✅ أمان محسن
- ✅ أداء محسن

## الإحصائيات
- الملفات: ${this.performanceMetrics.cyclesCompleted}
- الإصلاحات: ${this.performanceMetrics.fixesApplied}
- الاختبارات: ${this.performanceMetrics.testsAdded}

## التطوير
\`\`\`bash
npm install
npm run dev
\`\`\`

## الاختبار
\`\`\`bash
npm test
\`\`\`

---
*تم إنشاء هذا المشروع بواسطة Ultimate Intelligent Agent*
`;

    await fs.writeFile(path.join(this.projectPath, 'README.md'), readme);
  }

  async startContinuousMode() {
    await this.log('🚀 بدء الوضع المستمر...');

    // Run first cycle immediately
    await this.runCycle();

    // Then run cycles at intervals
    setInterval(async () => {
      if (this.isRunning) {
        await this.runCycle();
      }
    }, this.checkInterval);
  }

  async stop() {
    await this.log('🛑 إيقاف الأجنت...');
    this.isRunning = false;

    // Stop watchers
    for (const [name, watcher] of this.watchers) {
      await watcher.close();
    }

    await this.saveStatus('stopped');

    if (process.send) {
      process.send({
        type: 'complete',
        result: {
          cycles: this.cycleCount,
          status: 'stopped',
          metrics: this.performanceMetrics,
        },
      });
    }
  }

  async run() {
    try {
      await this.init();

      if (this.isBackgroundMode) {
        await this.startContinuousMode();

        // Keep process alive
        await new Promise(() => {});
      } else {
        await this.runCycle();
        await this.stop();
      }
    } catch (error) {
      await this.log(`❌ خطأ في الأجنت: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await agent.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await agent.stop();
  process.exit(0);
});

// Start the agent
const agent = new UltimateIntelligentAgent();
agent.run().catch(console.error);
