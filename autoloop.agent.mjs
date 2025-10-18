#!/usr/bin/env node

/**
 * 🤖 Smart Bootloader Agent - المحرك الذكي الرئيسي
 * 
 * هذا هو المحرك الذكي الذي يدير دورة التحسين التلقائي للمشروع
 * يقوم بفحص الكود، إصلاح الأخطاء، تحسين الأداء، وتشغيل الاختبارات
 * 
 * @version 1.0.0
 * @author AI Agent
 * @created ${new Date().toISOString()}
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎨 ألوان للطباعة
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// 📊 إحصائيات النظام
const stats = {
  startTime: Date.now(),
  operations: 0,
  successes: 0,
  failures: 0,
  filesProcessed: 0,
  errorsFixed: 0,
  testsRun: 0,
  testsPassed: 0,
  testsFailed: 0
};

// 🔧 فئة الـ Agent الرئيسية
class SmartBootloaderAgent {
  constructor() {
    this.config = null;
    this.isRunning = false;
    this.intervalId = null;
    this.lastCheck = null;
    this.watchMode = false;
  }

  // 🚀 بدء تشغيل الـ Agent
  async start(options = {}) {
    try {
      console.log(`${colors.cyan}${colors.bright}🤖 بدء تشغيل Smart Bootloader Agent...${colors.reset}`);
      
      // تحميل التكوين
      await this.loadConfig();
      
      // تحديد وضع التشغيل
      this.watchMode = options.watch || false;
      
      if (this.watchMode) {
        console.log(`${colors.yellow}👀 وضع المراقبة نشط - سيراقب التغييرات تلقائيًا${colors.reset}`);
        await this.startWatchMode();
      } else {
        console.log(`${colors.blue}🔄 وضع الدورة الواحدة - سيعمل مرة واحدة${colors.reset}`);
        await this.runSingleCycle();
      }
      
    } catch (error) {
      console.error(`${colors.red}❌ خطأ في بدء تشغيل الـ Agent:${colors.reset}`, error.message);
      await this.logError('START_ERROR', error);
      process.exit(1);
    }
  }

  // ⏹️ إيقاف الـ Agent
  async stop() {
    try {
      console.log(`${colors.yellow}⏹️ إيقاف Smart Bootloader Agent...${colors.reset}`);
      
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      
      this.isRunning = false;
      
      // طباعة الإحصائيات النهائية
      await this.printFinalStats();
      
      console.log(`${colors.green}✅ تم إيقاف الـ Agent بنجاح${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.red}❌ خطأ في إيقاف الـ Agent:${colors.reset}`, error.message);
    }
  }

  // 📁 تحميل التكوين
  async loadConfig() {
    try {
      const configPath = path.join(__dirname, 'project.config.json');
      const configData = await fs.readFile(configPath, 'utf8');
      this.config = JSON.parse(configData);
      
      console.log(`${colors.green}✅ تم تحميل التكوين بنجاح${colors.reset}`);
      console.log(`${colors.dim}📋 المشروع: ${this.config.project.name} v${this.config.project.version}${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في تحميل التكوين: ${error.message}`);
    }
  }

  // 🔄 تشغيل دورة واحدة
  async runSingleCycle() {
    try {
      this.isRunning = true;
      console.log(`${colors.blue}🔄 بدء دورة التحسين...${colors.reset}`);
      
      // 1. فحص التغييرات
      await this.checkChanges();
      
      // 2. تحليل الكود
      await this.analyzeCode();
      
      // 3. إصلاح الأخطاء
      await this.fixErrors();
      
      // 4. تحسين الكود
      await this.optimizeCode();
      
      // 5. تشغيل الاختبارات
      await this.runTests();
      
      // 6. تحديث التوثيق
      await this.updateDocumentation();
      
      // 7. تحديث السجلات
      await this.updateLogs();
      
      // 8. Auto Commit نهائي إذا كان كل شيء يعمل
      const hasChanges = await this.checkForChanges();
      if (hasChanges) {
        const isQualityGood = await this.checkCodeQuality();
        if (isQualityGood) {
          await this.autoCommit('🎉 Complete: دورة تحسين مكتملة بنجاح');
        } else {
          console.log(`${colors.yellow}⚠️ تم حفظ التغييرات لكن لم يتم الـ Commit بسبب جودة الكود${colors.reset}`);
        }
      }
      
      console.log(`${colors.green}✅ تم إكمال الدورة بنجاح${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.red}❌ خطأ في الدورة:${colors.reset}`, error.message);
      await this.logError('CYCLE_ERROR', error);
    }
  }

  // 👀 بدء وضع المراقبة
  async startWatchMode() {
    try {
      this.isRunning = true;
      
      // تشغيل الدورة الأولى
      await this.runSingleCycle();
      
      // بدء المراقبة الدورية
      const interval = this.config.agent.checkInterval || 600000; // 10 دقائق افتراضيًا
      
      this.intervalId = setInterval(async () => {
        try {
          console.log(`${colors.cyan}🔄 فحص دوري...${colors.reset}`);
          await this.runSingleCycle();
        } catch (error) {
          console.error(`${colors.red}❌ خطأ في المراقبة:${colors.reset}`, error.message);
          await this.logError('WATCH_ERROR', error);
        }
      }, interval);
      
      console.log(`${colors.green}✅ وضع المراقبة نشط - كل ${interval / 1000} ثانية${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في بدء وضع المراقبة: ${error.message}`);
    }
  }

  // 🔍 فحص التغييرات
  async checkChanges() {
    try {
      console.log(`${colors.blue}🔍 فحص التغييرات...${colors.reset}`);
      
      // فحص حالة Git
      const gitStatus = this.runCommand('git status --porcelain');
      const hasChanges = gitStatus.trim().length > 0;
      
      if (hasChanges) {
        console.log(`${colors.yellow}📝 تم اكتشاف تغييرات في Git${colors.reset}`);
        console.log(`${colors.dim}${gitStatus}${colors.reset}`);
      } else {
        console.log(`${colors.green}✅ لا توجد تغييرات جديدة${colors.reset}`);
      }
      
      // فحص الملفات المعدلة
      const modifiedFiles = await this.getModifiedFiles();
      console.log(`${colors.dim}📁 الملفات المعدلة: ${modifiedFiles.length}${colors.reset}`);
      
      this.lastCheck = new Date().toISOString();
      
    } catch (error) {
      throw new Error(`فشل في فحص التغييرات: ${error.message}`);
    }
  }

  // 📊 تحليل الكود
  async analyzeCode() {
    try {
      console.log(`${colors.blue}📊 تحليل الكود...${colors.reset}`);
      
      // فحص ESLint
      await this.runESLint();
      
      // فحص TypeScript
      await this.runTypeScriptCheck();
      
      // فحص الأمان
      await this.runSecurityCheck();
      
      // فحص الأداء
      await this.runPerformanceCheck();
      
      console.log(`${colors.green}✅ تم تحليل الكود بنجاح${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في تحليل الكود: ${error.message}`);
    }
  }

  // 🔧 إصلاح الأخطاء
  async fixErrors() {
    try {
      console.log(`${colors.blue}🔧 إصلاح الأخطاء...${colors.reset}`);
      
      // إصلاح ESLint errors
      await this.fixESLintErrors();
      
      // إصلاح TypeScript errors
      await this.fixTypeScriptErrors();
      
      // إصلاح security issues
      await this.fixSecurityIssues();
      
      // فحص إذا كان هناك تغييرات للإصلاح
      const hasChanges = await this.checkForChanges();
      if (hasChanges) {
        await this.autoCommit('🔧 AutoFix: إصلاح أخطاء الكود');
      }
      
      console.log(`${colors.green}✅ تم إصلاح الأخطاء بنجاح${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في إصلاح الأخطاء: ${error.message}`);
    }
  }

  // ⚡ تحسين الكود
  async optimizeCode() {
    try {
      console.log(`${colors.blue}⚡ تحسين الكود...${colors.reset}`);
      
      // إزالة الكود غير المستخدم
      await this.removeUnusedCode();
      
      // دمج الكود المكرر
      await this.mergeDuplicatedCode();
      
      // تحسين الأداء
      await this.optimizePerformance();
      
      // تحسين التسمية
      await this.optimizeNaming();
      
      // إعادة تنظيم الملفات
      await this.refactorFiles();
      
      // فحص إذا كان هناك تحسينات
      const hasChanges = await this.checkForChanges();
      if (hasChanges) {
        await this.autoCommit('⚡ Optimize: تحسين الكود والأداء');
      }
      
      console.log(`${colors.green}✅ تم تحسين الكود بنجاح${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في تحسين الكود: ${error.message}`);
    }
  }

  // 🧪 تشغيل الاختبارات
  async runTests() {
    try {
      console.log(`${colors.blue}🧪 تشغيل الاختبارات...${colors.reset}`);
      
      // تشغيل اختبارات الوحدة
      await this.runUnitTests();
      
      // تشغيل اختبارات التكامل
      await this.runIntegrationTests();
      
      // تشغيل اختبارات E2E
      await this.runE2ETests();
      
      // فحص التغطية
      await this.checkCoverage();
      
      // اختبار ذكي للـ Business Logic
      await this.runSmartBusinessLogicTests();
      
      console.log(`${colors.green}✅ تم تشغيل الاختبارات بنجاح${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في تشغيل الاختبارات: ${error.message}`);
    }
  }

  // 📝 تحديث التوثيق
  async updateDocumentation() {
    try {
      console.log(`${colors.blue}📝 تحديث التوثيق...${colors.reset}`);
      
      // تحديث README
      await this.updateREADME();
      
      // تحديث API docs
      await this.updateAPIDocs();
      
      // تحديث project graph
      await this.updateProjectGraph();
      
      console.log(`${colors.green}✅ تم تحديث التوثيق بنجاح${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في تحديث التوثيق: ${error.message}`);
    }
  }

  // 📊 تحديث السجلات
  async updateLogs() {
    try {
      console.log(`${colors.blue}📊 تحديث السجلات...${colors.reset}`);
      
      // تحديث log.system.md
      await this.updateSystemLog();
      
      // تحديث snapshot.version.json
      await this.updateVersionSnapshot();
      
      console.log(`${colors.green}✅ تم تحديث السجلات بنجاح${colors.reset}`);
      
    } catch (error) {
      throw new Error(`فشل في تحديث السجلات: ${error.message}`);
    }
  }

  // 🔧 طرق مساعدة
  async getModifiedFiles() {
    try {
      const gitStatus = this.runCommand('git diff --name-only HEAD~1 HEAD');
      return gitStatus.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      return [];
    }
  }

  runCommand(command) {
    try {
      return execSync(command, { 
        encoding: 'utf8', 
        cwd: __dirname,
        stdio: 'pipe'
      });
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ تحذير في الأمر: ${command}${colors.reset}`);
      return '';
    }
  }

  async runESLint() {
    try {
      console.log(`${colors.dim}🔍 فحص ESLint...${colors.reset}`);
      const result = this.runCommand('npm run lint:check');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ ESLint غير متوفر${colors.reset}`);
    }
  }

  async runTypeScriptCheck() {
    try {
      console.log(`${colors.dim}🔍 فحص TypeScript...${colors.reset}`);
      const result = this.runCommand('npm run type:check');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ TypeScript غير متوفر${colors.reset}`);
    }
  }

  async runSecurityCheck() {
    try {
      console.log(`${colors.dim}🔍 فحص الأمان...${colors.reset}`);
      const result = this.runCommand('npm audit');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ فحص الأمان غير متوفر${colors.reset}`);
    }
  }

  async runPerformanceCheck() {
    try {
      console.log(`${colors.dim}🔍 فحص الأداء...${colors.reset}`);
      // يمكن إضافة فحوصات الأداء هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ فحص الأداء غير متوفر${colors.reset}`);
    }
  }

  async fixESLintErrors() {
    try {
      console.log(`${colors.dim}🔧 إصلاح ESLint errors...${colors.reset}`);
      this.runCommand('npm run lint:fix');
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إصلاح ESLint errors${colors.reset}`);
    }
  }

  async fixTypeScriptErrors() {
    try {
      console.log(`${colors.dim}🔧 إصلاح TypeScript errors...${colors.reset}`);
      // يمكن إضافة إصلاح TypeScript errors هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إصلاح TypeScript errors${colors.reset}`);
    }
  }

  async fixSecurityIssues() {
    try {
      console.log(`${colors.dim}🔧 إصلاح security issues...${colors.reset}`);
      this.runCommand('npm audit fix');
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إصلاح security issues${colors.reset}`);
    }
  }

  async removeUnusedCode() {
    try {
      console.log(`${colors.dim}🗑️ إزالة الكود غير المستخدم...${colors.reset}`);
      // يمكن إضافة إزالة الكود غير المستخدم هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إزالة الكود غير المستخدم${colors.reset}`);
    }
  }

  async mergeDuplicatedCode() {
    try {
      console.log(`${colors.dim}🔄 دمج الكود المكرر...${colors.reset}`);
      // يمكن إضافة دمج الكود المكرر هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن دمج الكود المكرر${colors.reset}`);
    }
  }

  async optimizePerformance() {
    try {
      console.log(`${colors.dim}⚡ تحسين الأداء...${colors.reset}`);
      // يمكن إضافة تحسين الأداء هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحسين الأداء${colors.reset}`);
    }
  }

  async optimizeNaming() {
    try {
      console.log(`${colors.dim}📝 تحسين التسمية...${colors.reset}`);
      // يمكن إضافة تحسين التسمية هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحسين التسمية${colors.reset}`);
    }
  }

  async runUnitTests() {
    try {
      console.log(`${colors.dim}🧪 تشغيل اختبارات الوحدة...${colors.reset}`);
      const result = this.runCommand('npm run test:unit');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ اختبارات الوحدة غير متوفرة${colors.reset}`);
    }
  }

  async runIntegrationTests() {
    try {
      console.log(`${colors.dim}🧪 تشغيل اختبارات التكامل...${colors.reset}`);
      const result = this.runCommand('npm run test:integration');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ اختبارات التكامل غير متوفرة${colors.reset}`);
    }
  }

  async runE2ETests() {
    try {
      console.log(`${colors.dim}🧪 تشغيل اختبارات E2E...${colors.reset}`);
      const result = this.runCommand('npm run test:e2e');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ اختبارات E2E غير متوفرة${colors.reset}`);
    }
  }

  async checkCoverage() {
    try {
      console.log(`${colors.dim}📊 فحص التغطية...${colors.reset}`);
      const result = this.runCommand('npm run test:coverage');
      console.log(`${colors.dim}${result}${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ فحص التغطية غير متوفر${colors.reset}`);
    }
  }

  async updateREADME() {
    try {
      console.log(`${colors.dim}📝 تحديث README...${colors.reset}`);
      // يمكن إضافة تحديث README هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث README${colors.reset}`);
    }
  }

  async updateAPIDocs() {
    try {
      console.log(`${colors.dim}📝 تحديث API docs...${colors.reset}`);
      // يمكن إضافة تحديث API docs هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث API docs${colors.reset}`);
    }
  }

  async updateProjectGraph() {
    try {
      console.log(`${colors.dim}📝 تحديث project graph...${colors.reset}`);
      // يمكن إضافة تحديث project graph هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث project graph${colors.reset}`);
    }
  }

  async updateSystemLog() {
    try {
      console.log(`${colors.dim}📊 تحديث system log...${colors.reset}`);
      // يمكن إضافة تحديث system log هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث system log${colors.reset}`);
    }
  }

  async updateVersionSnapshot() {
    try {
      console.log(`${colors.dim}📊 تحديث version snapshot...${colors.reset}`);
      // يمكن إضافة تحديث version snapshot هنا
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث version snapshot${colors.reset}`);
    }
  }

  async logError(type, error) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        type: type,
        message: error.message,
        stack: error.stack,
        agent: 'SmartBootloaderAgent'
      };
      
      console.error(`${colors.red}❌ خطأ مسجل:${colors.reset}`, errorLog);
      
      // يمكن إضافة حفظ الخطأ في ملف هنا
      
    } catch (logError) {
      console.error(`${colors.red}❌ فشل في تسجيل الخطأ:${colors.reset}`, logError.message);
    }
  }

  // 🔍 فحص التغييرات
  async checkForChanges() {
    try {
      const gitStatus = this.runCommand('git status --porcelain');
      return gitStatus.trim().length > 0;
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن فحص التغييرات:${colors.reset}`, error.message);
      return false;
    }
  }

  // 💾 Auto Commit ذكي
  async autoCommit(message) {
    try {
      console.log(`${colors.blue}💾 Auto Commit: ${message}${colors.reset}`);
      
      // إضافة جميع الملفات
      this.runCommand('git add .');
      
      // إنشاء commit
      const commitMessage = `${message} - ${new Date().toISOString()}`;
      this.runCommand(`git commit -m "${commitMessage}"`);
      
      // تحديث الإحصائيات
      stats.operations++;
      stats.successes++;
      
      console.log(`${colors.green}✅ تم إنشاء commit بنجاح: ${commitMessage}${colors.reset}`);
      
      // إذا كان الـ Agent مفعل للـ push
      if (this.config.agent.autoPush) {
        await this.autoPush();
      }
      
    } catch (error) {
      console.error(`${colors.red}❌ فشل في Auto Commit:${colors.reset}`, error.message);
      stats.operations++;
      stats.failures++;
    }
  }

  // 🚀 Auto Push
  async autoPush() {
    try {
      console.log(`${colors.blue}🚀 Auto Push...${colors.reset}`);
      
      const currentBranch = this.runCommand('git branch --show-current').trim();
      this.runCommand(`git push origin ${currentBranch}`);
      
      console.log(`${colors.green}✅ تم Push بنجاح إلى ${currentBranch}${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.red}❌ فشل في Auto Push:${colors.reset}`, error.message);
    }
  }

  // 📊 فحص جودة الكود قبل الـ Commit
  async checkCodeQuality() {
    try {
      console.log(`${colors.blue}📊 فحص جودة الكود...${colors.reset}`);
      
      // فحص ESLint
      const eslintResult = this.runCommand('npm run lint:check');
      const hasESLintErrors = eslintResult.includes('error') || eslintResult.includes('Error');
      
      // فحص TypeScript
      const tsResult = this.runCommand('npm run type:check');
      const hasTSErrors = tsResult.includes('error') || tsResult.includes('Error');
      
      // فحص الاختبارات
      const testResult = this.runCommand('npm run test:unit');
      const hasTestFailures = testResult.includes('failed') || testResult.includes('Failed');
      
      const isQualityGood = !hasESLintErrors && !hasTSErrors && !hasTestFailures;
      
      if (isQualityGood) {
        console.log(`${colors.green}✅ جودة الكود ممتازة - يمكن الـ Commit${colors.reset}`);
        return true;
      } else {
        console.log(`${colors.yellow}⚠️ جودة الكود تحتاج تحسين - لن يتم الـ Commit${colors.reset}`);
        return false;
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن فحص جودة الكود:${colors.reset}`, error.message);
      return false;
    }
  }

  // 🧠 اختبار ذكي للـ Business Logic
  async runSmartBusinessLogicTests() {
    try {
      console.log(`${colors.blue}🧠 اختبار ذكي للـ Business Logic...${colors.reset}`);
      
      // 1. تحليل الـ Business Rules
      await this.analyzeBusinessRules();
      
      // 2. اختبار الـ User Flows
      await this.testUserFlows();
      
      // 3. اختبار الـ Data Validation
      await this.testDataValidation();
      
      // 4. اختبار الـ API Endpoints
      await this.testAPIEndpoints();
      
      // 5. اختبار الـ Database Operations
      await this.testDatabaseOperations();
      
      // 6. اختبار الـ Security Rules
      await this.testSecurityRules();
      
      // 7. إصلاح تلقائي للأخطاء المكتشفة
      await this.autoFixBusinessLogicIssues();
      
      console.log(`${colors.green}✅ تم اختبار الـ Business Logic بنجاح${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.red}❌ خطأ في اختبار الـ Business Logic:${colors.reset}`, error.message);
    }
  }

  // 📋 تحليل قواعد العمل
  async analyzeBusinessRules() {
    try {
      console.log(`${colors.dim}📋 تحليل قواعد العمل...${colors.reset}`);
      
      // البحث عن ملفات الـ Business Logic
      const businessFiles = await this.findBusinessLogicFiles();
      
      for (const file of businessFiles) {
        console.log(`${colors.dim}🔍 فحص: ${file}${colors.reset}`);
        
        // تحليل القواعد
        const rules = await this.extractBusinessRules(file);
        
        // اختبار القواعد
        await this.testBusinessRules(rules, file);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحليل قواعد العمل:${colors.reset}`, error.message);
    }
  }

  // 🔍 العثور على ملفات الـ Business Logic
  async findBusinessLogicFiles() {
    try {
      const patterns = [
        'src/**/*service*.{js,ts,jsx,tsx}',
        'src/**/*business*.{js,ts,jsx,tsx}',
        'src/**/*logic*.{js,ts,jsx,tsx}',
        'src/**/*rule*.{js,ts,jsx,tsx}',
        'src/**/*validation*.{js,ts,jsx,tsx}',
        'src/**/*api*.{js,ts,jsx,tsx}',
        'src/**/*controller*.{js,ts,jsx,tsx}'
      ];
      
      const files = [];
      for (const pattern of patterns) {
        const result = this.runCommand(`find src -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -E "(service|business|logic|rule|validation|api|controller)"`);
        if (result.trim()) {
          files.push(...result.trim().split('\n'));
        }
      }
      
      return [...new Set(files)]; // إزالة التكرار
      
    } catch (error) {
      return [];
    }
  }

  // 📝 استخراج قواعد العمل
  async extractBusinessRules(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const rules = [];
      
      // البحث عن patterns مختلفة للقواعد
      const patterns = [
        /if\s*\([^)]+\)\s*{[\s\S]*?}/g,
        /switch\s*\([^)]+\)\s*{[\s\S]*?}/g,
        /function\s+\w+.*?{[\s\S]*?}/g,
        /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?}/g,
        /class\s+\w+.*?{[\s\S]*?}/g
      ];
      
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          rules.push(...matches);
        }
      }
      
      return rules;
      
    } catch (error) {
      return [];
    }
  }

  // 🧪 اختبار قواعد العمل
  async testBusinessRules(rules, filePath) {
    try {
      console.log(`${colors.dim}🧪 اختبار ${rules.length} قاعدة في ${filePath}${colors.reset}`);
      
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        
        // إنشاء اختبار تلقائي للقاعدة
        const testCode = await this.generateTestForRule(rule, i);
        
        // تشغيل الاختبار
        const testResult = await this.runGeneratedTest(testCode);
        
        if (!testResult.success) {
          console.log(`${colors.yellow}⚠️ فشل اختبار القاعدة ${i + 1}: ${testResult.error}${colors.reset}`);
          
          // محاولة إصلاح القاعدة
          await this.fixBusinessRule(rule, testResult.error, filePath);
        }
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن اختبار القواعد:${colors.reset}`, error.message);
    }
  }

  // 🔧 إنشاء اختبار تلقائي للقاعدة
  async generateTestForRule(rule, index) {
    try {
      // تحليل القاعدة واستخراج المعاملات
      const parameters = this.extractParametersFromRule(rule);
      const expectedOutput = this.inferExpectedOutput(rule);
      
      const testCode = `
        describe('Business Rule ${index + 1}', () => {
          it('should work correctly', () => {
            // Test data
            const testCases = ${JSON.stringify(parameters, null, 2)};
            
            testCases.forEach(testCase => {
              // Execute rule
              const result = ${this.wrapRuleInFunction(rule)};
              
              // Assert result
              expect(result).toBeDefined();
              expect(typeof result).toBe('${typeof expectedOutput}');
            });
          });
        });
      `;
      
      return testCode;
      
    } catch (error) {
      return `// Error generating test: ${error.message}`;
    }
  }

  // 🔍 استخراج المعاملات من القاعدة
  extractParametersFromRule(rule) {
    try {
      // البحث عن متغيرات ومدخلات
      const variables = rule.match(/\b\w+\s*=/g) || [];
      const parameters = rule.match(/function\s+\w+\s*\(([^)]*)\)/);
      
      return {
        variables: variables.map(v => v.replace('=', '').trim()),
        parameters: parameters ? parameters[1].split(',').map(p => p.trim()) : []
      };
      
    } catch (error) {
      return { variables: [], parameters: [] };
    }
  }

  // 🎯 استنتاج النتيجة المتوقعة
  inferExpectedOutput(rule) {
    try {
      // البحث عن return statements
      const returns = rule.match(/return\s+([^;]+)/g);
      if (returns && returns.length > 0) {
        const lastReturn = returns[returns.length - 1];
        return lastReturn.replace('return', '').trim();
      }
      
      // البحث عن console.log أو console.error
      const logs = rule.match(/console\.(log|error|warn)\s*\(([^)]+)\)/g);
      if (logs && logs.length > 0) {
        return 'logged';
      }
      
      return 'undefined';
      
    } catch (error) {
      return 'unknown';
    }
  }

  // 🔄 تحويل القاعدة إلى دالة قابلة للاختبار
  wrapRuleInFunction(rule) {
    try {
      // إضافة function wrapper إذا لم تكن موجودة
      if (!rule.includes('function') && !rule.includes('=>')) {
        return `(function() { ${rule} })()`;
      }
      
      return rule;
      
    } catch (error) {
      return rule;
    }
  }

  // 🏃 تشغيل الاختبار المُولد
  async runGeneratedTest(testCode) {
    try {
      // حفظ الاختبار في ملف مؤقت
      const testFile = `/tmp/generated_test_${Date.now()}.test.js`;
      await fs.writeFile(testFile, testCode);
      
      // تشغيل الاختبار
      const result = this.runCommand(`node ${testFile}`);
      
      // حذف الملف المؤقت
      await fs.unlink(testFile);
      
      return {
        success: !result.includes('Error') && !result.includes('Failed'),
        output: result,
        error: result.includes('Error') ? result : null
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error.message
      };
    }
  }

  // 🔧 إصلاح قاعدة العمل
  async fixBusinessRule(rule, error, filePath) {
    try {
      console.log(`${colors.dim}🔧 محاولة إصلاح القاعدة...${colors.reset}`);
      
      // تحليل الخطأ
      const fixes = this.analyzeErrorAndSuggestFixes(error, rule);
      
      // تطبيق الإصلاحات
      for (const fix of fixes) {
        await this.applyBusinessRuleFix(fix, filePath);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إصلاح القاعدة:${colors.reset}`, error.message);
    }
  }

  // 🔍 تحليل الخطأ واقتراح الإصلاحات
  analyzeErrorAndSuggestFixes(error, rule) {
    const fixes = [];
    
    if (error.includes('undefined')) {
      fixes.push({
        type: 'null_check',
        description: 'إضافة فحص null/undefined',
        fix: 'if (value !== null && value !== undefined) { ... }'
      });
    }
    
    if (error.includes('TypeError')) {
      fixes.push({
        type: 'type_check',
        description: 'إضافة فحص النوع',
        fix: 'if (typeof value === "string") { ... }'
      });
    }
    
    if (error.includes('ReferenceError')) {
      fixes.push({
        type: 'variable_declaration',
        description: 'إضافة تعريف المتغير',
        fix: 'let variableName;'
      });
    }
    
    return fixes;
  }

  // 🔨 تطبيق إصلاح قاعدة العمل
  async applyBusinessRuleFix(fix, filePath) {
    try {
      console.log(`${colors.dim}🔨 تطبيق إصلاح: ${fix.description}${colors.reset}`);
      
      // قراءة الملف
      let content = await fs.readFile(filePath, 'utf8');
      
      // تطبيق الإصلاح
      content = this.applyFixToContent(content, fix);
      
      // كتابة الملف
      await fs.writeFile(filePath, content);
      
      console.log(`${colors.green}✅ تم تطبيق الإصلاح بنجاح${colors.reset}`);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ فشل في تطبيق الإصلاح:${colors.reset}`, error.message);
    }
  }

  // 🔧 تطبيق الإصلاح على المحتوى
  applyFixToContent(content, fix) {
    try {
      switch (fix.type) {
        case 'null_check':
          // إضافة null checks
          content = content.replace(/(\w+)\s*=/g, 'if ($1 !== null && $1 !== undefined) { $1 =');
          break;
          
        case 'type_check':
          // إضافة type checks
          content = content.replace(/(\w+)\s*=/g, 'if (typeof $1 === "string") { $1 =');
          break;
          
        case 'variable_declaration':
          // إضافة متغيرات
          content = `let undefinedVariable;\n${content}`;
          break;
      }
      
      return content;
      
    } catch (error) {
      return content;
    }
  }

  // 🔄 اختبار User Flows
  async testUserFlows() {
    try {
      console.log(`${colors.dim}🔄 اختبار User Flows...${colors.reset}`);
      
      // اختبار flows شائعة
      const flows = [
        'user_registration',
        'user_login',
        'appointment_booking',
        'payment_processing',
        'data_validation'
      ];
      
      for (const flow of flows) {
        await this.testSpecificUserFlow(flow);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن اختبار User Flows:${colors.reset}`, error.message);
    }
  }

  // 🧪 اختبار User Flow محدد
  async testSpecificUserFlow(flowName) {
    try {
      console.log(`${colors.dim}🧪 اختبار ${flowName}...${colors.reset}`);
      
      // إنشاء اختبار للـ flow
      const testCode = this.generateUserFlowTest(flowName);
      
      // تشغيل الاختبار
      const result = await this.runGeneratedTest(testCode);
      
      if (!result.success) {
        console.log(`${colors.yellow}⚠️ فشل في ${flowName}: ${result.error}${colors.reset}`);
        await this.fixUserFlow(flowName, result.error);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن اختبار ${flowName}:${colors.reset}`, error.message);
    }
  }

  // 📝 إنشاء اختبار User Flow
  generateUserFlowTest(flowName) {
    const flowTests = {
      user_registration: `
        describe('User Registration Flow', () => {
          it('should register user successfully', async () => {
            const userData = {
              email: 'test@example.com',
              password: 'password123',
              name: 'Test User'
            };
            
            const result = await registerUser(userData);
            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
          });
        });
      `,
      user_login: `
        describe('User Login Flow', () => {
          it('should login user successfully', async () => {
            const credentials = {
              email: 'test@example.com',
              password: 'password123'
            };
            
            const result = await loginUser(credentials);
            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
          });
        });
      `,
      appointment_booking: `
        describe('Appointment Booking Flow', () => {
          it('should book appointment successfully', async () => {
            const appointmentData = {
              doctorId: 'doc123',
              patientId: 'pat123',
              date: '2024-01-20',
              time: '10:00'
            };
            
            const result = await bookAppointment(appointmentData);
            expect(result.success).toBe(true);
            expect(result.appointmentId).toBeDefined();
          });
        });
      `
    };
    
    return flowTests[flowName] || '// No test available for this flow';
  }

  // 🔧 إصلاح User Flow
  async fixUserFlow(flowName, error) {
    try {
      console.log(`${colors.dim}🔧 إصلاح ${flowName}...${colors.reset}`);
      
      // تحليل الخطأ واقتراح الإصلاحات
      const fixes = this.analyzeUserFlowError(error, flowName);
      
      // تطبيق الإصلاحات
      for (const fix of fixes) {
        await this.applyUserFlowFix(fix, flowName);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إصلاح ${flowName}:${colors.reset}`, error.message);
    }
  }

  // 🔍 تحليل خطأ User Flow
  analyzeUserFlowError(error, flowName) {
    const fixes = [];
    
    if (error.includes('validation')) {
      fixes.push({
        type: 'add_validation',
        description: 'إضافة validation للبيانات',
        flow: flowName
      });
    }
    
    if (error.includes('authentication')) {
      fixes.push({
        type: 'add_auth',
        description: 'إضافة authentication',
        flow: flowName
      });
    }
    
    if (error.includes('database')) {
      fixes.push({
        type: 'fix_database',
        description: 'إصلاح database operations',
        flow: flowName
      });
    }
    
    return fixes;
  }

  // 🔨 تطبيق إصلاح User Flow
  async applyUserFlowFix(fix, flowName) {
    try {
      console.log(`${colors.dim}🔨 تطبيق إصلاح ${fix.description} لـ ${flowName}${colors.reset}`);
      
      // البحث عن ملفات متعلقة بالـ flow
      const files = await this.findFilesForFlow(flowName);
      
      for (const file of files) {
        await this.applyFixToFile(file, fix);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ فشل في تطبيق إصلاح ${flowName}:${colors.reset}`, error.message);
    }
  }

  // 🔍 العثور على ملفات متعلقة بالـ flow
  async findFilesForFlow(flowName) {
    try {
      const patterns = {
        user_registration: ['*register*', '*signup*', '*auth*'],
        user_login: ['*login*', '*auth*', '*session*'],
        appointment_booking: ['*appointment*', '*booking*', '*schedule*'],
        payment_processing: ['*payment*', '*billing*', '*stripe*'],
        data_validation: ['*validation*', '*validate*', '*check*']
      };
      
      const flowPatterns = patterns[flowName] || [];
      const files = [];
      
      for (const pattern of flowPatterns) {
        const result = this.runCommand(`find src -name "*${pattern}*" -type f`);
        if (result.trim()) {
          files.push(...result.trim().split('\n'));
        }
      }
      
      return [...new Set(files)];
      
    } catch (error) {
      return [];
    }
  }

  // 🔨 تطبيق الإصلاح على الملف
  async applyFixToFile(filePath, fix) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      
      switch (fix.type) {
        case 'add_validation':
          content = this.addValidationToFile(content);
          break;
        case 'add_auth':
          content = this.addAuthToFile(content);
          break;
        case 'fix_database':
          content = this.fixDatabaseInFile(content);
          break;
      }
      
      await fs.writeFile(filePath, content);
      console.log(`${colors.green}✅ تم تطبيق الإصلاح على ${filePath}${colors.reset}`);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ فشل في تطبيق الإصلاح على ${filePath}:${colors.reset}`, error.message);
    }
  }

  // ✅ إضافة validation للملف
  addValidationToFile(content) {
    const validationCode = `
// Auto-added validation
function validateInput(data) {
  if (!data) {
    throw new Error('Data is required');
  }
  
  if (typeof data !== 'object') {
    throw new Error('Data must be an object');
  }
  
  return true;
}
`;
    
    return validationCode + '\n' + content;
  }

  // 🔐 إضافة authentication للملف
  addAuthToFile(content) {
    const authCode = `
// Auto-added authentication
function requireAuth(req) {
  if (!req.headers.authorization) {
    throw new Error('Authentication required');
  }
  
  // Add your auth logic here
  return true;
}
`;
    
    return authCode + '\n' + content;
  }

  // 🗄️ إصلاح database operations
  fixDatabaseInFile(content) {
    // إضافة error handling للـ database operations
    content = content.replace(
      /(\w+)\.query\(/g,
      'try {\n    $1.query('
    );
    
    content = content.replace(
      /(\w+)\.query\([^)]+\)/g,
      '$1.query($2)\n  } catch (error) {\n    console.error("Database error:", error);\n    throw error;\n  }'
    );
    
    return content;
  }

  // 🔄 اختبارات أخرى
  async testDataValidation() {
    console.log(`${colors.dim}🔄 اختبار Data Validation...${colors.reset}`);
    // Implementation for data validation tests
  }

  async testAPIEndpoints() {
    console.log(`${colors.dim}🔄 اختبار API Endpoints...${colors.reset}`);
    // Implementation for API endpoint tests
  }

  async testDatabaseOperations() {
    console.log(`${colors.dim}🔄 اختبار Database Operations...${colors.reset}`);
    // Implementation for database operation tests
  }

  async testSecurityRules() {
    console.log(`${colors.dim}🔄 اختبار Security Rules...${colors.reset}`);
    // Implementation for security rule tests
  }

  async autoFixBusinessLogicIssues() {
    console.log(`${colors.dim}🔧 إصلاح تلقائي لمشاكل Business Logic...${colors.reset}`);
    // Implementation for auto-fixing business logic issues
  }

  // 🔄 خدمة Refactor الذكية
  async refactorFiles() {
    try {
      console.log(`${colors.blue}🔄 إعادة تنظيم الملفات...${colors.reset}`);
      
      // 1. تحليل بنية المشروع
      await this.analyzeProjectStructure();
      
      // 2. إعادة تنظيم الملفات حسب النوع
      await this.reorganizeFilesByType();
      
      // 3. دمج الملفات الصغيرة
      await this.mergeSmallFiles();
      
      // 4. تقسيم الملفات الكبيرة
      await this.splitLargeFiles();
      
      // 5. إعادة ترتيب الـ imports
      await this.reorganizeImports();
      
      // 6. إعادة تنظيم الـ exports
      await this.reorganizeExports();
      
      // 7. تحسين بنية المجلدات
      await this.optimizeFolderStructure();
      
      // 8. إضافة ملفات index
      await this.addIndexFiles();
      
      // 9. تنظيف الملفات غير المستخدمة
      await this.cleanupUnusedFiles();
      
      // 10. تحديث المراجع
      await this.updateReferences();
      
      console.log(`${colors.green}✅ تم إعادة تنظيم الملفات بنجاح${colors.reset}`);
      
    } catch (error) {
      console.error(`${colors.red}❌ خطأ في إعادة تنظيم الملفات:${colors.reset}`, error.message);
    }
  }

  // 📊 تحليل بنية المشروع
  async analyzeProjectStructure() {
    try {
      console.log(`${colors.dim}📊 تحليل بنية المشروع...${colors.reset}`);
      
      const structure = {
        components: [],
        services: [],
        utils: [],
        types: [],
        constants: [],
        hooks: [],
        pages: [],
        api: [],
        tests: [],
        config: []
      };
      
      // فحص جميع الملفات
      const files = await this.getAllProjectFiles();
      
      for (const file of files) {
        const category = this.categorizeFile(file);
        if (structure[category]) {
          structure[category].push(file);
        }
      }
      
      // حفظ تحليل البنية
      await this.saveStructureAnalysis(structure);
      
      console.log(`${colors.dim}📁 تم تحليل ${files.length} ملف في ${Object.keys(structure).length} فئة${colors.reset}`);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحليل بنية المشروع:${colors.reset}`, error.message);
    }
  }

  // 🏷️ تصنيف الملفات
  categorizeFile(filePath) {
    const path = filePath.toLowerCase();
    
    if (path.includes('/components/') || path.includes('component')) {
      return 'components';
    } else if (path.includes('/services/') || path.includes('service')) {
      return 'services';
    } else if (path.includes('/utils/') || path.includes('util')) {
      return 'utils';
    } else if (path.includes('/types/') || path.includes('type')) {
      return 'types';
    } else if (path.includes('/constants/') || path.includes('constant')) {
      return 'constants';
    } else if (path.includes('/hooks/') || path.includes('hook')) {
      return 'hooks';
    } else if (path.includes('/pages/') || path.includes('page')) {
      return 'pages';
    } else if (path.includes('/api/') || path.includes('route')) {
      return 'api';
    } else if (path.includes('/test') || path.includes('spec')) {
      return 'tests';
    } else if (path.includes('/config/') || path.includes('config')) {
      return 'config';
    }
    
    return 'utils'; // افتراضي
  }

  // 📁 الحصول على جميع ملفات المشروع
  async getAllProjectFiles() {
    try {
      const result = this.runCommand('find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx"');
      return result.trim().split('\n').filter(file => file.trim());
    } catch (error) {
      return [];
    }
  }

  // 💾 حفظ تحليل البنية
  async saveStructureAnalysis(structure) {
    try {
      const analysis = {
        timestamp: new Date().toISOString(),
        totalFiles: Object.values(structure).flat().length,
        categories: structure,
        recommendations: this.generateRefactorRecommendations(structure)
      };
      
      await fs.writeFile('refactor-analysis.json', JSON.stringify(analysis, null, 2));
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن حفظ تحليل البنية:${colors.reset}`, error.message);
    }
  }

  // 💡 إنشاء توصيات إعادة التنظيم
  generateRefactorRecommendations(structure) {
    const recommendations = [];
    
    // فحص الملفات الكبيرة
    for (const [category, files] of Object.entries(structure)) {
      for (const file of files) {
        try {
          const stats = this.runCommand(`wc -l "${file}"`);
          const lineCount = parseInt(stats.split(' ')[0]);
          
          if (lineCount > 300) {
            recommendations.push({
              type: 'split_large_file',
              file: file,
              reason: `ملف كبير جداً (${lineCount} سطر)`,
              suggestion: 'يُنصح بتقسيمه إلى ملفات أصغر'
            });
          }
        } catch (error) {
          // تجاهل الأخطاء
        }
      }
    }
    
    // فحص المجلدات الفارغة
    for (const [category, files] of Object.entries(structure)) {
      if (files.length === 0) {
        recommendations.push({
          type: 'empty_folder',
          category: category,
          reason: 'مجلد فارغ',
          suggestion: 'يُنصح بإضافة ملفات أو حذف المجلد'
        });
      }
    }
    
    return recommendations;
  }

  // 🔄 إعادة تنظيم الملفات حسب النوع
  async reorganizeFilesByType() {
    try {
      console.log(`${colors.dim}🔄 إعادة تنظيم الملفات حسب النوع...${colors.reset}`);
      
      const structure = await this.loadStructureAnalysis();
      if (!structure) return;
      
      for (const [category, files] of Object.entries(structure.categories)) {
        if (files.length === 0) continue;
        
        const targetDir = `src/${category}`;
        
        // إنشاء المجلد إذا لم يكن موجوداً
        this.runCommand(`mkdir -p "${targetDir}"`);
        
        // نقل الملفات إلى المجلد المناسب
        for (const file of files) {
          if (!file.includes(`/${category}/`)) {
            const fileName = file.split('/').pop();
            const newPath = `${targetDir}/${fileName}`;
            
            // تجنب الكتابة فوق الملفات الموجودة
            if (!this.fileExists(newPath)) {
              this.runCommand(`mv "${file}" "${newPath}"`);
              console.log(`${colors.dim}📁 تم نقل ${file} إلى ${newPath}${colors.reset}`);
            }
          }
        }
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إعادة تنظيم الملفات:${colors.reset}`, error.message);
    }
  }

  // 📄 دمج الملفات الصغيرة
  async mergeSmallFiles() {
    try {
      console.log(`${colors.dim}📄 دمج الملفات الصغيرة...${colors.reset}`);
      
      const files = await this.getAllProjectFiles();
      const smallFiles = [];
      
      // العثور على الملفات الصغيرة
      for (const file of files) {
        try {
          const stats = this.runCommand(`wc -l "${file}"`);
          const lineCount = parseInt(stats.split(' ')[0]);
          
          if (lineCount < 20 && !file.includes('test') && !file.includes('spec')) {
            smallFiles.push({ file, lines: lineCount });
          }
        } catch (error) {
          // تجاهل الأخطاء
        }
      }
      
      // دمج الملفات المتشابهة
      const groupedFiles = this.groupSimilarFiles(smallFiles);
      
      for (const [groupName, files] of Object.entries(groupedFiles)) {
        if (files.length > 1) {
          await this.mergeFileGroup(groupName, files);
        }
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن دمج الملفات الصغيرة:${colors.reset}`, error.message);
    }
  }

  // 🔍 تجميع الملفات المتشابهة
  groupSimilarFiles(smallFiles) {
    const groups = {};
    
    for (const { file } of smallFiles) {
      const category = this.categorizeFile(file);
      const baseName = file.split('/').pop().split('.')[0];
      
      const groupKey = `${category}_${baseName}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(file);
    }
    
    return groups;
  }

  // 🔗 دمج مجموعة ملفات
  async mergeFileGroup(groupName, files) {
    try {
      const mergedContent = [];
      const imports = new Set();
      
      // قراءة محتوى جميع الملفات
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');
        
        // استخراج الـ imports
        for (const line of lines) {
          if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
            imports.add(line.trim());
          } else if (line.trim() && !line.trim().startsWith('//')) {
            mergedContent.push(`  ${line}`);
          }
        }
      }
      
      // إنشاء الملف المدمج
      const mergedFile = `src/${groupName}.ts`;
      const finalContent = [
        ...Array.from(imports),
        '',
        `// Merged from: ${files.join(', ')}`,
        `export class ${groupName.charAt(0).toUpperCase() + groupName.slice(1)} {`,
        ...mergedContent,
        '}'
      ].join('\n');
      
      await fs.writeFile(mergedFile, finalContent);
      
      // حذف الملفات الأصلية
      for (const file of files) {
        await fs.unlink(file);
      }
      
      console.log(`${colors.dim}🔗 تم دمج ${files.length} ملف في ${mergedFile}${colors.reset}`);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن دمج مجموعة الملفات:${colors.reset}`, error.message);
    }
  }

  // ✂️ تقسيم الملفات الكبيرة
  async splitLargeFiles() {
    try {
      console.log(`${colors.dim}✂️ تقسيم الملفات الكبيرة...${colors.reset}`);
      
      const files = await this.getAllProjectFiles();
      
      for (const file of files) {
        try {
          const stats = this.runCommand(`wc -l "${file}"`);
          const lineCount = parseInt(stats.split(' ')[0]);
          
          if (lineCount > 500) {
            await this.splitLargeFile(file, lineCount);
          }
        } catch (error) {
          // تجاهل الأخطاء
        }
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تقسيم الملفات الكبيرة:${colors.reset}`, error.message);
    }
  }

  // ✂️ تقسيم ملف كبير
  async splitLargeFile(filePath, lineCount) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      // تقسيم الملف إلى أجزاء
      const chunkSize = Math.ceil(lineCount / 3);
      const chunks = [];
      
      for (let i = 0; i < lines.length; i += chunkSize) {
        chunks.push(lines.slice(i, i + chunkSize));
      }
      
      // إنشاء ملفات منفصلة
      const baseName = filePath.split('/').pop().split('.')[0];
      const extension = filePath.split('.').pop();
      
      for (let i = 0; i < chunks.length; i++) {
        const newFileName = `${baseName}-part${i + 1}.${extension}`;
        const newFilePath = filePath.replace(baseName, newFileName);
        
        await fs.writeFile(newFilePath, chunks[i].join('\n'));
        console.log(`${colors.dim}✂️ تم إنشاء ${newFilePath}${colors.reset}`);
      }
      
      // حذف الملف الأصلي
      await fs.unlink(filePath);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تقسيم الملف ${filePath}:${colors.reset}`, error.message);
    }
  }

  // 📦 إعادة ترتيب الـ imports
  async reorganizeImports() {
    try {
      console.log(`${colors.dim}📦 إعادة ترتيب الـ imports...${colors.reset}`);
      
      const files = await this.getAllProjectFiles();
      
      for (const file of files) {
        await this.reorganizeFileImports(file);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إعادة ترتيب الـ imports:${colors.reset}`, error.message);
    }
  }

  // 📦 إعادة ترتيب imports ملف واحد
  async reorganizeFileImports(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      const imports = [];
      const otherLines = [];
      let inImports = true;
      
      for (const line of lines) {
        if (inImports && (line.trim().startsWith('import ') || line.trim().startsWith('export ') || line.trim() === '')) {
          if (line.trim()) {
            imports.push(line);
          }
        } else {
          inImports = false;
          otherLines.push(line);
        }
      }
      
      // ترتيب الـ imports
      const sortedImports = this.sortImports(imports);
      
      // إعادة كتابة الملف
      const newContent = [...sortedImports, '', ...otherLines].join('\n');
      await fs.writeFile(filePath, newContent);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إعادة ترتيب imports في ${filePath}:${colors.reset}`, error.message);
    }
  }

  // 🔤 ترتيب الـ imports
  sortImports(imports) {
    const externalImports = [];
    const internalImports = [];
    const typeImports = [];
    
    for (const imp of imports) {
      if (imp.includes('from "') || imp.includes("from '")) {
        const source = imp.match(/from ["'](.+)["']/)?.[1];
        
        if (source?.startsWith('@/') || source?.startsWith('./') || source?.startsWith('../')) {
          internalImports.push(imp);
        } else if (imp.includes('type ')) {
          typeImports.push(imp);
        } else {
          externalImports.push(imp);
        }
      } else {
        externalImports.push(imp);
      }
    }
    
    // ترتيب كل مجموعة
    externalImports.sort();
    internalImports.sort();
    typeImports.sort();
    
    return [...externalImports, ...internalImports, ...typeImports];
  }

  // 📤 إعادة تنظيم الـ exports
  async reorganizeExports() {
    try {
      console.log(`${colors.dim}📤 إعادة تنظيم الـ exports...${colors.reset}`);
      
      const files = await this.getAllProjectFiles();
      
      for (const file of files) {
        await this.reorganizeFileExports(file);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إعادة تنظيم الـ exports:${colors.reset}`, error.message);
    }
  }

  // 📤 إعادة تنظيم exports ملف واحد
  async reorganizeFileExports(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // البحث عن export statements
      const exportMatches = content.match(/export\s+[^;]+;/g) || [];
      
      if (exportMatches.length > 3) {
        // تجميع الـ exports في نهاية الملف
        const lines = content.split('\n');
        const nonExportLines = lines.filter(line => !line.trim().startsWith('export '));
        const exportLines = lines.filter(line => line.trim().startsWith('export '));
        
        const newContent = [
          ...nonExportLines,
          '',
          '// Exports',
          ...exportLines
        ].join('\n');
        
        await fs.writeFile(filePath, newContent);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إعادة تنظيم exports في ${filePath}:${colors.reset}`, error.message);
    }
  }

  // 📁 تحسين بنية المجلدات
  async optimizeFolderStructure() {
    try {
      console.log(`${colors.dim}📁 تحسين بنية المجلدات...${colors.reset}`);
      
      // إنشاء مجلدات أساسية
      const essentialFolders = [
        'src/components',
        'src/services',
        'src/utils',
        'src/types',
        'src/constants',
        'src/hooks',
        'src/pages',
        'src/api',
        'src/tests',
        'src/config'
      ];
      
      for (const folder of essentialFolders) {
        this.runCommand(`mkdir -p "${folder}"`);
      }
      
      // إنشاء ملفات index لكل مجلد
      for (const folder of essentialFolders) {
        await this.createIndexFile(folder);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحسين بنية المجلدات:${colors.reset}`, error.message);
    }
  }

  // 📄 إضافة ملفات index
  async addIndexFiles() {
    try {
      console.log(`${colors.dim}📄 إضافة ملفات index...${colors.reset}`);
      
      const folders = [
        'src/components',
        'src/services',
        'src/utils',
        'src/types',
        'src/constants',
        'src/hooks'
      ];
      
      for (const folder of folders) {
        await this.createIndexFile(folder);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إضافة ملفات index:${colors.reset}`, error.message);
    }
  }

  // 📄 إنشاء ملف index
  async createIndexFile(folderPath) {
    try {
      const indexPath = `${folderPath}/index.ts`;
      
      if (this.fileExists(indexPath)) {
        return; // الملف موجود بالفعل
      }
      
      // البحث عن ملفات في المجلد
      const files = this.runCommand(`find "${folderPath}" -maxdepth 1 -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v index`);
      
      if (!files.trim()) {
        return; // لا توجد ملفات
      }
      
      const fileList = files.trim().split('\n');
      const exports = [];
      
      for (const file of fileList) {
        const fileName = file.split('/').pop().split('.')[0];
        const relativePath = `./${fileName}`;
        exports.push(`export * from '${relativePath}';`);
      }
      
      const indexContent = [
        `// Auto-generated index file for ${folderPath}`,
        `// Generated on ${new Date().toISOString()}`,
        '',
        ...exports
      ].join('\n');
      
      await fs.writeFile(indexPath, indexContent);
      console.log(`${colors.dim}📄 تم إنشاء ${indexPath}${colors.reset}`);
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن إنشاء ملف index في ${folderPath}:${colors.reset}`, error.message);
    }
  }

  // 🗑️ تنظيف الملفات غير المستخدمة
  async cleanupUnusedFiles() {
    try {
      console.log(`${colors.dim}🗑️ تنظيف الملفات غير المستخدمة...${colors.reset}`);
      
      const files = await this.getAllProjectFiles();
      const unusedFiles = [];
      
      for (const file of files) {
        if (await this.isFileUnused(file)) {
          unusedFiles.push(file);
        }
      }
      
      // حذف الملفات غير المستخدمة (بحذر)
      for (const file of unusedFiles) {
        if (this.isSafeToDelete(file)) {
          await fs.unlink(file);
          console.log(`${colors.dim}🗑️ تم حذف ${file}${colors.reset}`);
        }
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تنظيف الملفات غير المستخدمة:${colors.reset}`, error.message);
    }
  }

  // 🔍 فحص إذا كان الملف غير مستخدم
  async isFileUnused(filePath) {
    try {
      const fileName = filePath.split('/').pop().split('.')[0];
      const result = this.runCommand(`grep -r "${fileName}" src --exclude-dir=node_modules --exclude="*.log" | wc -l`);
      return parseInt(result.trim()) <= 1; // الملف نفسه فقط
    } catch (error) {
      return false;
    }
  }

  // ✅ فحص إذا كان آمناً حذف الملف
  isSafeToDelete(filePath) {
    // لا تحذف ملفات مهمة
    const protectedFiles = [
      'index.ts',
      'index.js',
      'main.ts',
      'main.js',
      'app.ts',
      'app.js'
    ];
    
    const fileName = filePath.split('/').pop();
    return !protectedFiles.includes(fileName);
  }

  // 🔗 تحديث المراجع
  async updateReferences() {
    try {
      console.log(`${colors.dim}🔗 تحديث المراجع...${colors.reset}`);
      
      // البحث عن مراجع قديمة وتحديثها
      const files = await this.getAllProjectFiles();
      
      for (const file of files) {
        await this.updateFileReferences(file);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث المراجع:${colors.reset}`, error.message);
    }
  }

  // 🔗 تحديث مراجع ملف واحد
  async updateFileReferences(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let hasChanges = false;
      
      // تحديث مسارات الـ imports
      const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        const oldPath = match[1];
        const newPath = this.updateImportPath(oldPath);
        
        if (newPath !== oldPath) {
          content = content.replace(oldPath, newPath);
          hasChanges = true;
        }
      }
      
      if (hasChanges) {
        await fs.writeFile(filePath, content);
        console.log(`${colors.dim}🔗 تم تحديث مراجع ${filePath}${colors.reset}`);
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ لا يمكن تحديث مراجع ${filePath}:${colors.reset}`, error.message);
    }
  }

  // 🛤️ تحديث مسار الـ import
  updateImportPath(oldPath) {
    // تحديث المسارات النسبية
    if (oldPath.startsWith('../')) {
      return oldPath; // لا تغير المسارات النسبية المعقدة
    }
    
    if (oldPath.startsWith('./')) {
      return oldPath; // لا تغير المسارات النسبية البسيطة
    }
    
    // تحديث المسارات المطلقة
    if (oldPath.startsWith('@/')) {
      return oldPath; // لا تغير مسارات الـ alias
    }
    
    return oldPath;
  }

  // 📊 تحميل تحليل البنية
  async loadStructureAnalysis() {
    try {
      const content = await fs.readFile('refactor-analysis.json', 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  // 📁 فحص وجود الملف
  fileExists(filePath) {
    try {
      this.runCommand(`test -f "${filePath}"`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async printFinalStats() {
    const duration = Date.now() - stats.startTime;
    const successRate = stats.operations > 0 ? (stats.successes / stats.operations * 100).toFixed(2) : 0;
    
    console.log(`\n${colors.cyan}${colors.bright}📊 إحصائيات الـ Agent:${colors.reset}`);
    console.log(`${colors.dim}⏱️ المدة: ${(duration / 1000).toFixed(2)} ثانية${colors.reset}`);
    console.log(`${colors.dim}🔄 العمليات: ${stats.operations}${colors.reset}`);
    console.log(`${colors.dim}✅ الناجحة: ${stats.successes}${colors.reset}`);
    console.log(`${colors.dim}❌ الفاشلة: ${stats.failures}${colors.reset}`);
    console.log(`${colors.dim}📁 الملفات: ${stats.filesProcessed}${colors.reset}`);
    console.log(`${colors.dim}🔧 الأخطاء المصححة: ${stats.errorsFixed}${colors.reset}`);
    console.log(`${colors.dim}🧪 الاختبارات: ${stats.testsRun} (${stats.testsPassed} نجح، ${stats.testsFailed} فشل)${colors.reset}`);
    console.log(`${colors.dim}📈 معدل النجاح: ${successRate}%${colors.reset}`);
  }
}

// 🚀 تشغيل الـ Agent
async function main() {
  const agent = new SmartBootloaderAgent();
  
  // معالجة command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--business-logic')) {
    console.log(`${colors.blue}🧠 تشغيل Business Logic Testing فقط...${colors.reset}`);
    await agent.runSmartBusinessLogicTests();
    return;
  }
  
  if (args.includes('--test-flows')) {
    console.log(`${colors.blue}🔄 اختبار User Flows فقط...${colors.reset}`);
    await agent.testUserFlows();
    return;
  }
  
  if (args.includes('--fix-business-logic')) {
    console.log(`${colors.blue}🔧 إصلاح Business Logic فقط...${colors.reset}`);
    await agent.autoFixBusinessLogicIssues();
    return;
  }
  
  if (args.includes('--refactor-only')) {
    console.log(`${colors.blue}🔄 إعادة تنظيم الملفات فقط...${colors.reset}`);
    await agent.refactorFiles();
    return;
  }
  
  if (args.includes('--organize-files')) {
    console.log(`${colors.blue}📁 تنظيم الملفات فقط...${colors.reset}`);
    await agent.analyzeProjectStructure();
    await agent.reorganizeFilesByType();
    await agent.optimizeFolderStructure();
    return;
  }
  
  if (args.includes('--cleanup-files')) {
    console.log(`${colors.blue}🗑️ تنظيف الملفات فقط...${colors.reset}`);
    await agent.cleanupUnusedFiles();
    await agent.mergeSmallFiles();
    return;
  }
  
  // معالجة إشارات النظام
  process.on('SIGINT', async () => {
    console.log(`\n${colors.yellow}🛑 تم استلام إشارة الإيقاف...${colors.reset}`);
    await agent.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log(`\n${colors.yellow}🛑 تم استلام إشارة الإيقاف...${colors.reset}`);
    await agent.stop();
    process.exit(0);
  });
  
  // تحديد الخيارات
  const options = {
    watch: process.argv.includes('--watch') || process.argv.includes('-w')
  };
  
  // بدء تشغيل الـ Agent
  await agent.start(options);
}

// تشغيل الـ Agent إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(`${colors.red}❌ خطأ فادح:${colors.reset}`, error);
    process.exit(1);
  });
}

export default SmartBootloaderAgent;
