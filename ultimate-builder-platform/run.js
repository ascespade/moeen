#!/usr/bin/env node

/**
 * 🚀 Ultimate Builder Platform - Run Script
 * سكريبت التشغيل الرئيسي للمنصة
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PlatformRunner {
  constructor() {
    this.processes = new Map();
    this.isRunning = false;
  }

  async init() {
    console.clear();
    
    // Show banner
    console.log(chalk.cyan(figlet.textSync('Ultimate Builder', { font: 'ANSI Shadow' })));
    console.log(chalk.blue('منصة البناء الذكية المتقدمة\n'));

    // Check if we're in the right directory
    if (!this.isPlatformDirectory()) {
      console.log(chalk.red('❌ يجب تشغيل هذا السكريبت من مجلد المنصة'));
      process.exit(1);
    }

    // Check dependencies
    await this.checkDependencies();
    
    // Start the platform
    await this.startPlatform();
  }

  isPlatformDirectory() {
    const requiredFiles = ['package.json', 'core/server.js', 'web-interface/dist/index.html'];
    return requiredFiles.every(file => 
      require('fs').existsSync(path.join(__dirname, file))
    );
  }

  async checkDependencies() {
    const spinner = ora('فحص التبعيات...').start();
    
    try {
      // Check if node_modules exists
      if (!require('fs').existsSync(path.join(__dirname, 'node_modules'))) {
        spinner.fail('لم يتم العثور على node_modules');
        console.log(chalk.yellow('جاري تثبيت التبعيات...'));
        await this.installDependencies();
      }
      
      spinner.succeed('التبعيات جاهزة');
    } catch (error) {
      spinner.fail('خطأ في فحص التبعيات');
      console.error(error);
      process.exit(1);
    }
  }

  async installDependencies() {
    const spinner = ora('تثبيت التبعيات...').start();
    
    return new Promise((resolve, reject) => {
      const install = spawn('npm', ['install'], {
        cwd: __dirname,
        stdio: 'pipe'
      });

      install.on('close', (code) => {
        if (code === 0) {
          spinner.succeed('تم تثبيت التبعيات بنجاح');
          resolve();
        } else {
          spinner.fail('فشل في تثبيت التبعيات');
          reject(new Error('Installation failed'));
        }
      });
    });
  }

  async startPlatform() {
    console.log(chalk.green('🚀 بدء تشغيل المنصة...\n'));

    try {
      // Start core server
      await this.startCoreServer();
      
      // Start web interface
      await this.startWebInterface();
      
      // Start monitoring
      await this.startMonitoring();
      
      this.isRunning = true;
      
      // Show success message
      this.showSuccessMessage();
      
      // Handle graceful shutdown
      this.setupGracefulShutdown();
      
    } catch (error) {
      console.error(chalk.red('❌ خطأ في تشغيل المنصة:'), error);
      process.exit(1);
    }
  }

  async startCoreServer() {
    const spinner = ora('بدء الخادم الأساسي...').start();
    
    return new Promise((resolve, reject) => {
      const server = spawn('node', ['core/server.js'], {
        cwd: __dirname,
        stdio: 'pipe'
      });

      server.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server running')) {
          spinner.succeed('الخادم الأساسي يعمل على المنفذ 3000');
          this.processes.set('core-server', server);
          resolve();
        }
      });

      server.stderr.on('data', (data) => {
        console.error(chalk.red('خطأ في الخادم الأساسي:'), data.toString());
      });

      server.on('error', (error) => {
        spinner.fail('فشل في بدء الخادم الأساسي');
        reject(error);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.processes.has('core-server')) {
          spinner.fail('انتهت مهلة بدء الخادم الأساسي');
          reject(new Error('Server startup timeout'));
        }
      }, 10000);
    });
  }

  async startWebInterface() {
    const spinner = ora('بدء واجهة الويب...').start();
    
    // Web interface is served by the core server
    // Just check if it's accessible
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        spinner.succeed('واجهة الويب متاحة على http://localhost:3000');
      } else {
        throw new Error('Web interface not accessible');
      }
    } catch (error) {
      spinner.fail('فشل في الوصول لواجهة الويب');
      throw error;
    }
  }

  async startMonitoring() {
    const spinner = ora('بدء نظام المراقبة...').start();
    
    // Start monitoring process
    const monitor = spawn('node', ['core/monitor.js'], {
      cwd: __dirname,
      stdio: 'pipe'
    });

    this.processes.set('monitor', monitor);
    spinner.succeed('نظام المراقبة يعمل');
  }

  showSuccessMessage() {
    const message = boxen(
      chalk.green('✅ تم تشغيل المنصة بنجاح!\n\n') +
      chalk.blue('🌐 واجهة الويب: ') + chalk.white('http://localhost:3000\n') +
      chalk.blue('🔧 إدارة الإعدادات: ') + chalk.white('node core/settings-manager.js\n') +
      chalk.blue('⚙️ إعدادات المشروع: ') + chalk.white('node settings.js\n') +
      chalk.blue('📊 المراقبة: ') + chalk.white('نشطة\n\n') +
      chalk.yellow('اضغط Ctrl+C لإيقاف المنصة'),
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

  setupGracefulShutdown() {
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  async shutdown() {
    if (!this.isRunning) return;
    
    console.log(chalk.yellow('\n🛑 إيقاف المنصة...'));
    
    // Stop all processes
    for (const [name, process] of this.processes) {
      console.log(chalk.gray(`إيقاف ${name}...`));
      process.kill('SIGTERM');
    }
    
    // Wait a bit for graceful shutdown
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(chalk.green('✅ تم إيقاف المنصة بنجاح'));
    process.exit(0);
  }
}

// Run the platform
const runner = new PlatformRunner();
runner.init().catch(console.error);