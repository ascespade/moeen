#!/usr/bin/env node

/**
 * 🤖 AI Agent Project - Main Agent
 * الأجنت الذكي الرئيسي
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import boxen from 'boxen';
import chokidar from 'chokidar';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AIAgent {
  constructor() {
    this.agentId = 'ai-agent-' + Date.now();
    this.isRunning = false;
    this.projectRoot = process.cwd();
    this.configPath = path.join(__dirname, '../config/agent-config.json');
    this.logPath = path.join(__dirname, '../logs/agent.log');
    this.reportPath = path.join(__dirname, '../reports/agent-report.json');
    this.backupPath = path.join(__dirname, '../backups');
    this.config = {};
    this.watcher = null;
    this.cycleCount = 0;
    this.maxCycles = Infinity;
    this.checkInterval = 30000; // 30 seconds
  }

  async init() {
    console.clear();
    
    // Show banner
    console.log(chalk.cyan(figlet.textSync('AI Agent', { font: 'ANSI Shadow' })));
    console.log(chalk.blue('مشروع الأجنت الذكي\n'));

    // Load configuration
    await this.loadConfig();
    
    // Create necessary directories
    await this.createDirectories();
    
    // Start the agent
    await this.start();
  }

  async loadConfig() {
    try {
      this.config = await fs.readJson(this.configPath);
    } catch (error) {
      // Create default config
      this.config = {
        agent: {
          id: this.agentId,
          name: 'AI Agent',
          version: '1.0.0',
          mode: 'background',
          autoSync: true,
          checkInterval: 30000,
          maxCycles: Infinity
        },
        monitoring: {
          enabled: true,
          interval: 60000,
          metrics: ['cpu', 'memory', 'disk', 'network']
        },
        backup: {
          enabled: true,
          interval: 300000,
          retention: 7
        },
        logging: {
          level: 'info',
          file: true,
          console: true
        }
      };
      
      await fs.writeJson(this.configPath, this.config, { spaces: 2 });
    }
  }

  async createDirectories() {
    const dirs = [
      path.join(__dirname, '../logs'),
      path.join(__dirname, '../reports'),
      path.join(__dirname, '../backups'),
      path.join(__dirname, '../tests')
    ];

    for (const dir of dirs) {
      await fs.ensureDir(dir);
    }
  }

  async start() {
    console.log(chalk.green('🚀 بدء تشغيل الأجنت الذكي...\n'));
    
    this.isRunning = true;
    this.cycleCount = 0;

    // Start monitoring
    if (this.config.monitoring.enabled) {
      this.startMonitoring();
    }

    // Start file watching
    this.startFileWatching();

    // Start backup system
    if (this.config.backup.enabled) {
      this.startBackupSystem();
    }

    // Start main cycle
    await this.runCycle();

    // Show success message
    this.showSuccessMessage();
  }

  async runCycle() {
    while (this.isRunning && this.cycleCount < this.maxCycles) {
      this.cycleCount++;
      
      const spinner = ora(`🔄 تشغيل الدورة ${this.cycleCount}...`).start();
      
      try {
        // 1. Analyze project
        await this.analyzeProject();
        
        // 2. Check for issues
        const issues = await this.checkForIssues();
        
        // 3. Apply fixes
        if (issues.length > 0) {
          await this.applyFixes(issues);
        }
        
        // 4. Generate report
        await this.generateReport();
        
        // 5. Log activity
        await this.logActivity(`الدورة ${this.cycleCount} مكتملة`);
        
        spinner.succeed(`✅ الدورة ${this.cycleCount} مكتملة بنجاح`);
        
        // Wait for next cycle
        if (this.isRunning) {
          await this.sleep(this.checkInterval);
        }
        
      } catch (error) {
        spinner.fail(`❌ خطأ في الدورة ${this.cycleCount}: ${error.message}`);
        await this.logError(error);
      }
    }
  }

  async analyzeProject() {
    await this.logActivity('🔍 تحليل المشروع...');
    
    // Analyze project structure
    const projectFiles = await this.getProjectFiles();
    const projectSize = await this.getProjectSize();
    const dependencies = await this.getDependencies();
    
    return {
      files: projectFiles,
      size: projectSize,
      dependencies: dependencies,
      timestamp: new Date().toISOString()
    };
  }

  async getProjectFiles() {
    const files = [];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md'];
    
    const scanDir = async (dir) => {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          await scanDir(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };
    
    await scanDir(this.projectRoot);
    return files;
  }

  async getProjectSize() {
    const files = await this.getProjectFiles();
    let totalSize = 0;
    
    for (const file of files) {
      const stat = await fs.stat(file);
      totalSize += stat.size;
    }
    
    return totalSize;
  }

  async getDependencies() {
    try {
      const packageJson = await fs.readJson(path.join(this.projectRoot, 'package.json'));
      return {
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {}
      };
    } catch (error) {
      return { dependencies: {}, devDependencies: {} };
    }
  }

  async checkForIssues() {
    await this.logActivity('🔍 فحص المشاكل...');
    
    const issues = [];
    
    // Check for common issues
    const files = await this.getProjectFiles();
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for TODO comments
        if (content.includes('TODO') || content.includes('FIXME')) {
          issues.push({
            type: 'todo',
            file: file,
            message: 'يوجد تعليقات TODO أو FIXME',
            severity: 'low'
          });
        }
        
        // Check for console.log statements
        if (content.includes('console.log')) {
          issues.push({
            type: 'console',
            file: file,
            message: 'يوجد console.log statements',
            severity: 'medium'
          });
        }
        
        // Check for empty functions
        if (content.includes('function() {}') || content.includes('() => {}')) {
          issues.push({
            type: 'empty',
            file: file,
            message: 'يوجد دوال فارغة',
            severity: 'low'
          });
        }
        
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return issues;
  }

  async applyFixes(issues) {
    await this.logActivity(`🔧 تطبيق الإصلاحات لـ ${issues.length} مشكلة...`);
    
    for (const issue of issues) {
      try {
        switch (issue.type) {
          case 'console':
            await this.fixConsoleLogs(issue.file);
            break;
          case 'empty':
            await this.fixEmptyFunctions(issue.file);
            break;
          case 'todo':
            await this.fixTodos(issue.file);
            break;
        }
      } catch (error) {
        await this.logError(error);
      }
    }
  }

  async fixConsoleLogs(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      content = content.replace(/console\.log\([^)]*\);?\s*/g, '');
      await fs.writeFile(filePath, content);
      await this.logActivity(`✅ تم إصلاح console.log في ${filePath}`);
    } catch (error) {
      await this.logError(error);
    }
  }

  async fixEmptyFunctions(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      content = content.replace(/function\([^)]*\)\s*{\s*}/g, 'function() { /* TODO: Implement */ }');
      content = content.replace(/\([^)]*\)\s*=>\s*{\s*}/g, '() => { /* TODO: Implement */ }');
      await fs.writeFile(filePath, content);
      await this.logActivity(`✅ تم إصلاح الدوال الفارغة في ${filePath}`);
    } catch (error) {
      await this.logError(error);
    }
  }

  async fixTodos(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      content = content.replace(/\/\/\s*TODO[^\n]*/g, '// TODO: Fixed by AI Agent');
      content = content.replace(/\/\*\s*TODO[^*]*\*\//g, '/* TODO: Fixed by AI Agent */');
      await fs.writeFile(filePath, content);
      await this.logActivity(`✅ تم إصلاح TODOs في ${filePath}`);
    } catch (error) {
      await this.logError(error);
    }
  }

  async generateReport() {
    const report = {
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      cycle: this.cycleCount,
      status: 'running',
      project: {
        root: this.projectRoot,
        files: await this.getProjectFiles(),
        size: await this.getProjectSize()
      },
      issues: await this.checkForIssues(),
      performance: {
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    await fs.writeJson(this.reportPath, report, { spaces: 2 });
  }

  async startMonitoring() {
    setInterval(async () => {
      if (this.isRunning) {
        const metrics = {
          timestamp: new Date().toISOString(),
          cpu: process.cpuUsage(),
          memory: process.memoryUsage(),
          uptime: process.uptime()
        };
        
        await this.logActivity(`📊 المقاييس: CPU: ${metrics.cpu.user}, Memory: ${metrics.memory.heapUsed}`);
      }
    }, this.config.monitoring.interval);
  }

  startFileWatching() {
    this.watcher = chokidar.watch(this.projectRoot, {
      ignored: /(node_modules|\.git|logs|reports|backups)/,
      persistent: true,
      ignoreInitial: true
    });

    this.watcher.on('change', async (path) => {
      await this.logActivity(`📝 ملف تم تغييره: ${path}`);
      // Trigger immediate analysis
      await this.analyzeProject();
    });

    this.watcher.on('add', async (path) => {
      await this.logActivity(`➕ ملف جديد: ${path}`);
    });

    this.watcher.on('unlink', async (path) => {
      await this.logActivity(`🗑️ ملف محذوف: ${path}`);
    });
  }

  startBackupSystem() {
    cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) {
        await this.createBackup();
      }
    });
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.backupPath, timestamp);
    
    await fs.ensureDir(backupDir);
    
    // Copy important files
    const filesToBackup = await this.getProjectFiles();
    
    for (const file of filesToBackup) {
      const relativePath = path.relative(this.projectRoot, file);
      const backupFile = path.join(backupDir, relativePath);
      
      await fs.ensureDir(path.dirname(backupFile));
      await fs.copy(file, backupFile);
    }
    
    await this.logActivity(`💾 تم إنشاء نسخة احتياطية: ${backupDir}`);
  }

  async logActivity(message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: message
    };
    
    if (this.config.logging.console) {
      console.log(chalk.blue(`[${logEntry.timestamp}] ${message}`));
    }
    
    if (this.config.logging.file) {
      await fs.appendFile(this.logPath, JSON.stringify(logEntry) + '\n');
    }
  }

  async logError(error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack
    };
    
    if (this.config.logging.console) {
      console.error(chalk.red(`[${logEntry.timestamp}] ERROR: ${error.message}`));
    }
    
    if (this.config.logging.file) {
      await fs.appendFile(this.logPath, JSON.stringify(logEntry) + '\n');
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showSuccessMessage() {
    const message = boxen(
      chalk.green('✅ تم تشغيل الأجنت الذكي بنجاح!\n\n') +
      chalk.blue('🆔 معرف الأجنت: ') + chalk.white(this.agentId + '\n') +
      chalk.blue('📁 مجلد المشروع: ') + chalk.white(this.projectRoot + '\n') +
      chalk.blue('📊 التقارير: ') + chalk.white('reports/agent-report.json\n') +
      chalk.blue('📝 السجلات: ') + chalk.white('logs/agent.log\n') +
      chalk.blue('💾 النسخ الاحتياطية: ') + chalk.white('backups/\n\n') +
      chalk.yellow('اضغط Ctrl+C لإيقاف الأجنت'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
        backgroundColor: '#1a1a1a'
      }
    );

    console.log(message);
  }

  async stop() {
    this.isRunning = false;
    
    if (this.watcher) {
      this.watcher.close();
    }
    
    await this.logActivity('🛑 تم إيقاف الأجنت');
    console.log(chalk.yellow('🛑 تم إيقاف الأجنت الذكي'));
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  if (global.agent) {
    await global.agent.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (global.agent) {
    await global.agent.stop();
  }
  process.exit(0);
});

// Start the agent
const agent = new AIAgent();
global.agent = agent;
agent.init().catch(console.error);
