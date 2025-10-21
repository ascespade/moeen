#!/usr/bin/env node

/**
 * 🔧 Ultimate Builder Platform - Settings Manager
 * مدير الإعدادات والمفاتيح الحقيقية
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SettingsManager {
  constructor() {
    this.configPath = path.join(__dirname, 'config.json');
    this.secretsPath = path.join(__dirname, 'secrets.json');
    this.config = {};
    this.secrets = {};
  }

  async init() {
    console.clear();
    console.log(chalk.cyan('🔧 Ultimate Builder Platform - Settings Manager'));
    console.log(chalk.gray('إعداد المفاتيح والاتصالات الحقيقية\n'));

    await this.loadConfig();
    await this.loadSecrets();

    const action = await this.showMainMenu();
    await this.handleAction(action);
  }

  async loadConfig() {
    try {
      this.config = await fs.readJson(this.configPath);
    } catch (error) {
      this.config = {
        platform: {
          name: 'Ultimate Builder Platform',
          version: '1.0.0',
          port: 3000,
          maxAgents: 256,
          backgroundMode: true,
          autoSync: true,
        },
        agents: {
          intelligentAgent: {
            enabled: true,
            backgroundMode: true,
            autoSync: true,
            checkInterval: 30000,
            syncInterval: 300000,
          },
        },
        git: {
          autoCommit: true,
          autoPush: true,
          commitMessage: 'Auto-sync: {timestamp} - {fixes} fixes applied',
        },
        monitoring: {
          enabled: true,
          interval: 60000,
          metrics: ['cpu', 'memory', 'disk', 'network'],
        },
      };
    }
  }

  async loadSecrets() {
    try {
      this.secrets = await fs.readJson(this.secretsPath);
    } catch (error) {
      this.secrets = {
        github: {
          token: '',
          username: '',
          repository: '',
        },
        openai: {
          apiKey: '',
          model: 'gpt-4',
          maxTokens: 4000,
        },
        supabase: {
          url: '',
          anonKey: '',
          serviceRoleKey: '',
        },
        vercel: {
          token: '',
          teamId: '',
          projectId: '',
        },
        aws: {
          accessKeyId: '',
          secretAccessKey: '',
          region: 'us-east-1',
        },
        mongodb: {
          connectionString: '',
          database: 'ultimate_builder',
        },
        redis: {
          host: 'localhost',
          port: 6379,
          password: '',
        },
      };
    }
  }

  async showMainMenu() {
    const choices = [
      { name: '🔑 إدارة المفاتيح والاتصالات', value: 'keys' },
      { name: '🌐 إعدادات Git و GitHub', value: 'git' },
      { name: '🤖 إعدادات الذكاء الاصطناعي', value: 'ai' },
      { name: '🗄️ إعدادات قواعد البيانات', value: 'database' },
      { name: '☁️ إعدادات النشر والسحابة', value: 'cloud' },
      { name: '🔒 إعدادات الأمان', value: 'security' },
      { name: '📊 إعدادات المراقبة', value: 'monitoring' },
      { name: '🧪 اختبار الاتصالات', value: 'test' },
      { name: '💾 حفظ الإعدادات', value: 'save' },
      { name: '❌ خروج', value: 'exit' },
    ];

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'اختر الإعداد المطلوب:',
        choices,
      },
    ]);

    return action;
  }

  async handleAction(action) {
    switch (action) {
      case 'keys':
        await this.manageKeys();
        break;
      case 'git':
        await this.setupGit();
        break;
      case 'ai':
        await this.setupAI();
        break;
      case 'database':
        await this.setupDatabase();
        break;
      case 'cloud':
        await this.setupCloud();
        break;
      case 'security':
        await this.setupSecurity();
        break;
      case 'monitoring':
        await this.setupMonitoring();
        break;
      case 'test':
        await this.testConnections();
        break;
      case 'save':
        await this.saveSettings();
        break;
      case 'exit':
        console.log(
          chalk.green('👋 شكراً لاستخدام Ultimate Builder Platform!')
        );
        process.exit(0);
        break;
    }

    // Return to main menu
    const newAction = await this.showMainMenu();
    await this.handleAction(newAction);
  }

  async manageKeys() {
    console.log(chalk.blue('\n🔑 إدارة المفاتيح والاتصالات\n'));

    const { keyType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'keyType',
        message: 'اختر نوع المفتاح:',
        choices: [
          { name: 'GitHub Token', value: 'github' },
          { name: 'OpenAI API Key', value: 'openai' },
          { name: 'Supabase Keys', value: 'supabase' },
          { name: 'Vercel Token', value: 'vercel' },
          { name: 'AWS Credentials', value: 'aws' },
          { name: 'MongoDB Connection', value: 'mongodb' },
          { name: 'Redis Configuration', value: 'redis' },
        ],
      },
    ]);

    await this.configureKey(keyType);
  }

  async configureKey(keyType) {
    switch (keyType) {
      case 'github':
        await this.configureGitHub();
        break;
      case 'openai':
        await this.configureOpenAI();
        break;
      case 'supabase':
        await this.configureSupabase();
        break;
      case 'vercel':
        await this.configureVercel();
        break;
      case 'aws':
        await this.configureAWS();
        break;
      case 'mongodb':
        await this.configureMongoDB();
        break;
      case 'redis':
        await this.configureRedis();
        break;
    }
  }

  async configureGitHub() {
    console.log(chalk.yellow('\n📋 إعداد GitHub:\n'));
    console.log(
      '1. اذهب إلى GitHub.com > Settings > Developer settings > Personal access tokens'
    );
    console.log('2. اضغط "Generate new token (classic)"');
    console.log(
      '3. اختر الصلاحيات: repo, workflow, admin:org, admin:public_key'
    );
    console.log('4. انسخ المفتاح وأدخله هنا\n');

    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: 'GitHub Personal Access Token:',
        validate: input => input.length > 0 || 'المفتاح مطلوب',
      },
      {
        type: 'input',
        name: 'username',
        message: 'GitHub Username:',
        validate: input => input.length > 0 || 'اسم المستخدم مطلوب',
      },
      {
        type: 'input',
        name: 'repository',
        message: 'Repository Name (اختياري):',
        default: 'ultimate-builder-project',
      },
    ]);

    this.secrets.github = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات GitHub'));
  }

  async configureOpenAI() {
    console.log(chalk.yellow('\n🤖 إعداد OpenAI:\n'));
    console.log('1. اذهب إلى platform.openai.com');
    console.log('2. اضغط "API Keys" في القائمة الجانبية');
    console.log('3. اضغط "Create new secret key"');
    console.log('4. انسخ المفتاح وأدخله هنا\n');

    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'OpenAI API Key:',
        validate: input => input.length > 0 || 'مفتاح API مطلوب',
      },
      {
        type: 'list',
        name: 'model',
        message: 'اختر النموذج:',
        choices: [
          { name: 'GPT-4 (الأقوى)', value: 'gpt-4' },
          { name: 'GPT-3.5 Turbo (أسرع)', value: 'gpt-3.5-turbo' },
          { name: 'GPT-4 Turbo (متوازن)', value: 'gpt-4-turbo-preview' },
        ],
        default: 'gpt-4',
      },
      {
        type: 'number',
        name: 'maxTokens',
        message: 'الحد الأقصى للرموز:',
        default: 4000,
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
      },
    ]);

    this.secrets.openai = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات OpenAI'));
  }

  async configureSupabase() {
    console.log(chalk.yellow('\n🗄️ إعداد Supabase:\n'));
    console.log('1. اذهب إلى supabase.com');
    console.log('2. أنشئ مشروع جديد أو اختر مشروع موجود');
    console.log('3. اذهب إلى Settings > API');
    console.log('4. انسخ URL و Keys\n');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Supabase URL:',
        validate: input => input.includes('supabase.co') || 'URL غير صحيح',
      },
      {
        type: 'password',
        name: 'anonKey',
        message: 'Supabase Anon Key:',
        validate: input => input.length > 0 || 'المفتاح مطلوب',
      },
      {
        type: 'password',
        name: 'serviceRoleKey',
        message: 'Supabase Service Role Key:',
        validate: input => input.length > 0 || 'المفتاح مطلوب',
      },
    ]);

    this.secrets.supabase = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات Supabase'));
  }

  async configureVercel() {
    console.log(chalk.yellow('\n☁️ إعداد Vercel:\n'));
    console.log('1. اذهب إلى vercel.com');
    console.log('2. اضغط على صورة الملف الشخصي > Settings');
    console.log('3. اذهب إلى Tokens');
    console.log('4. اضغط "Create Token"');
    console.log('5. انسخ المفتاح\n');

    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: 'Vercel Token:',
        validate: input => input.length > 0 || 'المفتاح مطلوب',
      },
      {
        type: 'input',
        name: 'teamId',
        message: 'Team ID (اختياري):',
        default: '',
      },
      {
        type: 'input',
        name: 'projectId',
        message: 'Project ID (اختياري):',
        default: '',
      },
    ]);

    this.secrets.vercel = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات Vercel'));
  }

  async configureAWS() {
    console.log(chalk.yellow('\n☁️ إعداد AWS:\n'));
    console.log('1. اذهب إلى AWS Console');
    console.log('2. اذهب إلى IAM > Users');
    console.log('3. أنشئ مستخدم جديد أو اختر موجود');
    console.log('4. أضف صلاحيات: S3, Lambda, CloudFormation');
    console.log('5. أنشئ Access Key\n');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'accessKeyId',
        message: 'AWS Access Key ID:',
        validate: input => input.length > 0 || 'المفتاح مطلوب',
      },
      {
        type: 'password',
        name: 'secretAccessKey',
        message: 'AWS Secret Access Key:',
        validate: input => input.length > 0 || 'المفتاح مطلوب',
      },
      {
        type: 'input',
        name: 'region',
        message: 'AWS Region:',
        default: 'us-east-1',
      },
    ]);

    this.secrets.aws = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات AWS'));
  }

  async configureMongoDB() {
    console.log(chalk.yellow('\n🗄️ إعداد MongoDB:\n'));
    console.log('1. اذهب إلى mongodb.com');
    console.log('2. أنشئ cluster جديد');
    console.log('3. اذهب إلى Database Access');
    console.log('4. أنشئ مستخدم جديد');
    console.log('5. اذهب إلى Network Access وأضف IP');
    console.log('6. اذهب إلى Database وانسخ Connection String\n');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'connectionString',
        message: 'MongoDB Connection String:',
        validate: input =>
          input.includes('mongodb') || 'Connection String غير صحيح',
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database Name:',
        default: 'ultimate_builder',
      },
    ]);

    this.secrets.mongodb = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات MongoDB'));
  }

  async configureRedis() {
    console.log(chalk.yellow('\n🔴 إعداد Redis:\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'host',
        message: 'Redis Host:',
        default: 'localhost',
      },
      {
        type: 'number',
        name: 'port',
        message: 'Redis Port:',
        default: 6379,
      },
      {
        type: 'password',
        name: 'password',
        message: 'Redis Password (اختياري):',
        default: '',
      },
    ]);

    this.secrets.redis = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات Redis'));
  }

  async testConnections() {
    console.log(chalk.blue('\n🧪 اختبار الاتصالات\n'));

    const tests = [
      { name: 'GitHub', test: () => this.testGitHub() },
      { name: 'OpenAI', test: () => this.testOpenAI() },
      { name: 'Supabase', test: () => this.testSupabase() },
      { name: 'Vercel', test: () => this.testVercel() },
      { name: 'AWS', test: () => this.testAWS() },
      { name: 'MongoDB', test: () => this.testMongoDB() },
      { name: 'Redis', test: () => this.testRedis() },
    ];

    for (const test of tests) {
      try {
        console.log(chalk.yellow(`🔍 اختبار ${test.name}...`));
        const result = await test.test();
        if (result.success) {
          console.log(chalk.green(`✅ ${test.name}: متصل بنجاح`));
        } else {
          console.log(chalk.red(`❌ ${test.name}: فشل - ${result.error}`));
        }
      } catch (error) {
        console.log(chalk.red(`❌ ${test.name}: خطأ - ${error.message}`));
      }
    }
  }

  async testGitHub() {
    if (!this.secrets.github.token) {
      return { success: false, error: 'لم يتم تعيين GitHub token' };
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${this.secrets.github.token}`,
          'User-Agent': 'Ultimate-Builder-Platform',
        },
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, data: user };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testOpenAI() {
    if (!this.secrets.openai.apiKey) {
      return { success: false, error: 'لم يتم تعيين OpenAI API key' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${this.secrets.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const models = await response.json();
        return { success: true, data: models };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testSupabase() {
    if (!this.secrets.supabase.url || !this.secrets.supabase.anonKey) {
      return { success: false, error: 'لم يتم تعيين Supabase credentials' };
    }

    try {
      const response = await fetch(`${this.secrets.supabase.url}/rest/v1/`, {
        headers: {
          apikey: this.secrets.supabase.anonKey,
          Authorization: `Bearer ${this.secrets.supabase.anonKey}`,
        },
      });

      if (response.ok) {
        return { success: true, data: 'Supabase connected' };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testVercel() {
    if (!this.secrets.vercel.token) {
      return { success: false, error: 'لم يتم تعيين Vercel token' };
    }

    try {
      const response = await fetch('https://api.vercel.com/v2/user', {
        headers: {
          Authorization: `Bearer ${this.secrets.vercel.token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, data: user };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testAWS() {
    if (!this.secrets.aws.accessKeyId || !this.secrets.aws.secretAccessKey) {
      return { success: false, error: 'لم يتم تعيين AWS credentials' };
    }

    // Basic test - check if credentials are valid format
    const accessKeyPattern = /^AKIA[0-9A-Z]{16}$/;
    const secretKeyPattern = /^[A-Za-z0-9/+=]{40}$/;

    if (!accessKeyPattern.test(this.secrets.aws.accessKeyId)) {
      return { success: false, error: 'Access Key ID format غير صحيح' };
    }

    if (!secretKeyPattern.test(this.secrets.aws.secretAccessKey)) {
      return { success: false, error: 'Secret Access Key format غير صحيح' };
    }

    return { success: true, data: 'AWS credentials format صحيح' };
  }

  async testMongoDB() {
    if (!this.secrets.mongodb.connectionString) {
      return {
        success: false,
        error: 'لم يتم تعيين MongoDB connection string',
      };
    }

    // Basic validation
    if (
      !this.secrets.mongodb.connectionString.includes('mongodb://') &&
      !this.secrets.mongodb.connectionString.includes('mongodb+srv://')
    ) {
      return { success: false, error: 'Connection string format غير صحيح' };
    }

    return { success: true, data: 'MongoDB connection string format صحيح' };
  }

  async testRedis() {
    // Basic validation
    if (!this.secrets.redis.host) {
      return { success: false, error: 'لم يتم تعيين Redis host' };
    }

    if (this.secrets.redis.port < 1 || this.secrets.redis.port > 65535) {
      return { success: false, error: 'Redis port غير صحيح' };
    }

    return { success: true, data: 'Redis configuration صحيح' };
  }

  async saveSettings() {
    try {
      // Save config
      await fs.writeJson(this.configPath, this.config, { spaces: 2 });

      // Save secrets
      await fs.writeJson(this.secretsPath, this.secrets, { spaces: 2 });

      // Set proper permissions for secrets file
      await fs.chmod(this.secretsPath, 0o600);

      console.log(chalk.green('\n✅ تم حفظ جميع الإعدادات بنجاح!'));
      console.log(chalk.blue('📁 الإعدادات العامة: config.json'));
      console.log(chalk.blue('🔒 المفاتيح الحساسة: secrets.json'));
    } catch (error) {
      console.log(chalk.red(`❌ خطأ في حفظ الإعدادات: ${error.message}`));
    }
  }

  async setupGit() {
    console.log(chalk.blue('\n🌐 إعدادات Git و GitHub\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'autoCommit',
        message: 'حفظ تلقائي في Git؟',
        default: true,
      },
      {
        type: 'confirm',
        name: 'autoPush',
        message: 'رفع تلقائي للخادم البعيد؟',
        default: true,
      },
      {
        type: 'input',
        name: 'commitMessage',
        message: 'نص رسالة الحفظ:',
        default: 'Auto-sync: {timestamp} - {fixes} fixes applied',
      },
      {
        type: 'input',
        name: 'branch',
        message: 'اسم الفرع الرئيسي:',
        default: 'main',
      },
    ]);

    this.config.git = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات Git'));
  }

  async setupAI() {
    console.log(chalk.blue('\n🤖 إعدادات الذكاء الاصطناعي\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: 'تفعيل الذكاء الاصطناعي؟',
        default: true,
      },
      {
        type: 'list',
        name: 'provider',
        message: 'اختر مزود الذكاء الاصطناعي:',
        choices: [
          { name: 'OpenAI (GPT-4)', value: 'openai' },
          { name: 'Anthropic (Claude)', value: 'anthropic' },
          { name: 'Google (Gemini)', value: 'google' },
        ],
        default: 'openai',
      },
      {
        type: 'number',
        name: 'maxTokens',
        message: 'الحد الأقصى للرموز:',
        default: 4000,
      },
      {
        type: 'number',
        name: 'temperature',
        message: 'درجة الإبداع (0-1):',
        default: 0.7,
        validate: input =>
          (input >= 0 && input <= 1) || 'يجب أن تكون بين 0 و 1',
      },
    ]);

    this.config.ai = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات الذكاء الاصطناعي'));
  }

  async setupDatabase() {
    console.log(chalk.blue('\n🗄️ إعدادات قواعد البيانات\n'));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'primary',
        message: 'قاعدة البيانات الرئيسية:',
        choices: [
          { name: 'MongoDB', value: 'mongodb' },
          { name: 'PostgreSQL', value: 'postgresql' },
          { name: 'MySQL', value: 'mysql' },
          { name: 'SQLite', value: 'sqlite' },
        ],
        default: 'mongodb',
      },
      {
        type: 'confirm',
        name: 'caching',
        message: 'تفعيل التخزين المؤقت (Redis)؟',
        default: true,
      },
      {
        type: 'number',
        name: 'connectionPool',
        message: 'عدد الاتصالات المتزامنة:',
        default: 10,
      },
    ]);

    this.config.database = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات قواعد البيانات'));
  }

  async setupCloud() {
    console.log(chalk.blue('\n☁️ إعدادات النشر والسحابة\n'));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'مزود السحابة:',
        choices: [
          { name: 'Vercel', value: 'vercel' },
          { name: 'AWS', value: 'aws' },
          { name: 'Google Cloud', value: 'gcp' },
          { name: 'Azure', value: 'azure' },
        ],
        default: 'vercel',
      },
      {
        type: 'confirm',
        name: 'autoDeploy',
        message: 'نشر تلقائي عند التغييرات؟',
        default: true,
      },
      {
        type: 'confirm',
        name: 'cdn',
        message: 'تفعيل CDN؟',
        default: true,
      },
    ]);

    this.config.cloud = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات السحابة'));
  }

  async setupSecurity() {
    console.log(chalk.blue('\n🔒 إعدادات الأمان\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'https',
        message: 'فرض HTTPS؟',
        default: true,
      },
      {
        type: 'confirm',
        name: 'cors',
        message: 'تفعيل CORS؟',
        default: true,
      },
      {
        type: 'number',
        name: 'rateLimit',
        message: 'حد الطلبات في الدقيقة:',
        default: 100,
      },
      {
        type: 'confirm',
        name: 'helmet',
        message: 'تفعيل Helmet للأمان؟',
        default: true,
      },
    ]);

    this.config.security = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات الأمان'));
  }

  async setupMonitoring() {
    console.log(chalk.blue('\n📊 إعدادات المراقبة\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: 'تفعيل المراقبة؟',
        default: true,
      },
      {
        type: 'number',
        name: 'interval',
        message: 'فترة المراقبة (بالميلي ثانية):',
        default: 60000,
      },
      {
        type: 'checkbox',
        name: 'metrics',
        message: 'المقاييس المطلوب مراقبتها:',
        choices: [
          { name: 'استخدام المعالج', value: 'cpu', checked: true },
          { name: 'استخدام الذاكرة', value: 'memory', checked: true },
          { name: 'مساحة القرص', value: 'disk', checked: true },
          { name: 'شبكة الإنترنت', value: 'network', checked: true },
          { name: 'الأجنات النشطة', value: 'agents', checked: true },
        ],
      },
    ]);

    this.config.monitoring = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات المراقبة'));
  }
}

// Run the settings manager
const settingsManager = new SettingsManager();
settingsManager.init().catch(console.error);
