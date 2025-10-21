#!/usr/bin/env node

/**
 * ⚙️ Ultimate Builder Platform - Project Settings
 * إعدادات المشروع والتكوين
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectSettings {
  constructor() {
    this.configPath = path.join(__dirname, 'core', 'config.json');
    this.secretsPath = path.join(__dirname, 'core', 'secrets.json');
    this.config = {};
    this.secrets = {};
  }

  async init() {
    console.clear();
    console.log(chalk.cyan('⚙️ Ultimate Builder Platform - Project Settings'));
    console.log(chalk.gray('إعدادات المشروع والتكوين\n'));

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
      };
    }
  }

  async showMainMenu() {
    const choices = [
      { name: '🔧 إعدادات المنصة العامة', value: 'platform' },
      { name: '🤖 إعدادات الأجنات', value: 'agents' },
      { name: '🌐 إعدادات Git و GitHub', value: 'git' },
      { name: '🤖 إعدادات الذكاء الاصطناعي', value: 'ai' },
      { name: '📊 إعدادات المراقبة', value: 'monitoring' },
      { name: '🔒 إعدادات الأمان', value: 'security' },
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
      case 'platform':
        await this.setupPlatform();
        break;
      case 'agents':
        await this.setupAgents();
        break;
      case 'git':
        await this.setupGit();
        break;
      case 'ai':
        await this.setupAI();
        break;
      case 'monitoring':
        await this.setupMonitoring();
        break;
      case 'security':
        await this.setupSecurity();
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

  async setupPlatform() {
    console.log(chalk.blue('\n🔧 إعدادات المنصة العامة\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'اسم المنصة:',
        default: this.config.platform.name,
      },
      {
        type: 'number',
        name: 'port',
        message: 'منفذ الخادم:',
        default: this.config.platform.port,
        validate: input =>
          (input > 0 && input < 65536) || 'يجب أن يكون بين 1 و 65535',
      },
      {
        type: 'number',
        name: 'maxAgents',
        message: 'الحد الأقصى للأجنات:',
        default: this.config.platform.maxAgents,
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
      },
      {
        type: 'confirm',
        name: 'backgroundMode',
        message: 'تفعيل الوضع الخلفي؟',
        default: this.config.platform.backgroundMode,
      },
      {
        type: 'confirm',
        name: 'autoSync',
        message: 'تفعيل المزامنة التلقائية؟',
        default: this.config.platform.autoSync,
      },
    ]);

    this.config.platform = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات المنصة'));
  }

  async setupAgents() {
    console.log(chalk.blue('\n🤖 إعدادات الأجنات\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: 'تفعيل الأجنات الذكية؟',
        default: this.config.agents.intelligentAgent.enabled,
      },
      {
        type: 'confirm',
        name: 'backgroundMode',
        message: 'تفعيل الوضع الخلفي للأجنات؟',
        default: this.config.agents.intelligentAgent.backgroundMode,
      },
      {
        type: 'confirm',
        name: 'autoSync',
        message: 'تفعيل المزامنة التلقائية للأجنات؟',
        default: this.config.agents.intelligentAgent.autoSync,
      },
      {
        type: 'number',
        name: 'checkInterval',
        message: 'فترة فحص الأجنات (بالميلي ثانية):',
        default: this.config.agents.intelligentAgent.checkInterval,
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
      },
      {
        type: 'number',
        name: 'syncInterval',
        message: 'فترة مزامنة الأجنات (بالميلي ثانية):',
        default: this.config.agents.intelligentAgent.syncInterval,
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
      },
    ]);

    this.config.agents.intelligentAgent = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات الأجنات'));
  }

  async setupGit() {
    console.log(chalk.blue('\n🌐 إعدادات Git و GitHub\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'autoCommit',
        message: 'حفظ تلقائي في Git؟',
        default: this.config.git.autoCommit,
      },
      {
        type: 'confirm',
        name: 'autoPush',
        message: 'رفع تلقائي للخادم البعيد؟',
        default: this.config.git.autoPush,
      },
      {
        type: 'input',
        name: 'commitMessage',
        message: 'نص رسالة الحفظ:',
        default: this.config.git.commitMessage,
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
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
      },
    ]);

    this.config.ai = answers;
    console.log(chalk.green('✅ تم حفظ إعدادات الذكاء الاصطناعي'));
  }

  async setupMonitoring() {
    console.log(chalk.blue('\n📊 إعدادات المراقبة\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: 'تفعيل المراقبة؟',
        default: this.config.monitoring.enabled,
      },
      {
        type: 'number',
        name: 'interval',
        message: 'فترة المراقبة (بالميلي ثانية):',
        default: this.config.monitoring.interval,
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
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
        validate: input => input > 0 || 'يجب أن يكون أكبر من 0',
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

  async saveSettings() {
    try {
      // Save config
      await fs.writeJson(this.configPath, this.config, { spaces: 2 });

      // Save secrets
      await fs.writeJson(this.secretsPath, this.secrets, { spaces: 2 });

      // Set proper permissions for secrets file
      await fs.chmod(this.secretsPath, 0o600);

      console.log(chalk.green('\n✅ تم حفظ جميع الإعدادات بنجاح!'));
      console.log(chalk.blue('📁 الإعدادات العامة: core/config.json'));
      console.log(chalk.blue('🔒 المفاتيح الحساسة: core/secrets.json'));
    } catch (error) {
      console.log(chalk.red(`❌ خطأ في حفظ الإعدادات: ${error.message}`));
    }
  }
}

// Run the settings manager
const settings = new ProjectSettings();
settings.init().catch(console.error);
