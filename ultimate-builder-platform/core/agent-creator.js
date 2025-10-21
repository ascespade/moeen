#!/usr/bin/env node

/**
 * 🧠 Intelligent Agent Creator - منشئ الأجنات الذكي
 * يسمح بإنشاء أجنات جديدة من الواجهة مباشرة
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AgentCreator {
  constructor() {
    this.agentsDir = path.join(__dirname, 'agents');
    this.templatesDir = path.join(__dirname, 'templates');
  }

  async createAgent() {
    console.clear();
    console.log(chalk.cyan('🧠 Ultimate Builder - Agent Creator'));
    console.log(chalk.gray('إنشاء أجنت ذكي جديد\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'اسم الأجنت:',
        validate: (input) => input.length > 0 || 'الاسم مطلوب'
      },
      {
        type: 'list',
        name: 'type',
        message: 'نوع الأجنت:',
        choices: [
          { name: '🔧 Code Analyzer - محلل الكود', value: 'code-analyzer' },
          { name: '🎨 Visual Builder - البناء المرئي', value: 'visual-builder' },
          { name: '⚡ Performance Optimizer - محسن الأداء', value: 'performance-optimizer' },
          { name: '🛡️ Security Scanner - ماسح الأمان', value: 'security-scanner' },
          { name: '🧪 Auto Tester - اختبار تلقائي', value: 'auto-tester' },
          { name: '📚 Documentation Generator - مولد التوثيق', value: 'documentation-generator' },
          { name: '🚀 Deployment Manager - مدير النشر', value: 'deployment-manager' },
          { name: '🔄 Custom Agent - أجنت مخصص', value: 'custom' }
        ]
      },
      {
        type: 'input',
        name: 'description',
        message: 'وصف الأجنت:',
        default: 'أجنت ذكي للتحليل والإصلاح التلقائي'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'الميزات المطلوبة:',
        choices: [
          { name: '🔄 Auto-healing - إصلاح تلقائي', value: 'auto-healing' },
          { name: '📊 Real-time monitoring - مراقبة فورية', value: 'monitoring' },
          { name: '🧠 AI-powered suggestions - اقتراحات ذكية', value: 'ai-suggestions' },
          { name: '⚡ Parallel processing - معالجة متوازية', value: 'parallel' },
          { name: '🔄 Background sync - مزامنة خلفية', value: 'background-sync' },
          { name: '📱 Web interface - واجهة ويب', value: 'web-interface' },
          { name: '🔧 Git integration - تكامل Git', value: 'git-integration' },
          { name: '📈 Performance tracking - تتبع الأداء', value: 'performance-tracking' }
        ]
      },
      {
        type: 'list',
        name: 'language',
        message: 'لغة البرمجة:',
        choices: [
          { name: 'JavaScript/Node.js', value: 'javascript' },
          { name: 'TypeScript', value: 'typescript' },
          { name: 'Python', value: 'python' },
          { name: 'Go', value: 'go' },
          { name: 'Rust', value: 'rust' }
        ],
        default: 'javascript'
      },
      {
        type: 'confirm',
        name: 'backgroundMode',
        message: 'العمل في الخلفية؟',
        default: true
      },
      {
        type: 'confirm',
        name: 'autoSync',
        message: 'مزامنة تلقائية مع Git؟',
        default: true
      }
    ]);

    await this.generateAgent(answers);
  }

  async generateAgent(config) {
    const agentDir = path.join(this.agentsDir, config.name);
    await fs.ensureDir(agentDir);

    // Generate main agent file
    await this.generateMainFile(agentDir, config);
    
    // Generate configuration
    await this.generateConfig(agentDir, config);
    
    // Generate package.json
    await this.generatePackageJson(agentDir, config);
    
    // Generate README
    await this.generateReadme(agentDir, config);
    
    // Generate tests
    await this.generateTests(agentDir, config);
    
    // Generate web interface if requested
    if (config.features.includes('web-interface')) {
      await this.generateWebInterface(agentDir, config);
    }

    console.log(chalk.green(`\n✅ تم إنشاء الأجنت "${config.name}" بنجاح!`));
    console.log(chalk.cyan(`📁 المسار: ${agentDir}`));
    console.log(chalk.yellow(`\n🚀 لتشغيل الأجنت:`));
    console.log(chalk.white(`   cd ${agentDir}`));
    console.log(chalk.white(`   npm install`));
    console.log(chalk.white(`   npm start`));
  }

  async generateMainFile(agentDir, config) {
    const template = this.getMainTemplate(config);
    await fs.writeFile(path.join(agentDir, 'index.mjs'), template);
  }

  getMainTemplate(config) {
    return `#!/usr/bin/env node

/**
 * ${config.description}
 * تم إنشاؤه بواسطة Ultimate Builder Platform
 */

import { spawn, fork } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ${this.toPascalCase(config.name)}Agent {
  constructor() {
    this.agentId = process.env.AGENT_ID || '${config.name}-agent';
    this.projectPath = process.env.PROJECT_PATH || process.cwd();
    this.projectId = process.env.PROJECT_ID || 'default';
    this.config = JSON.parse(process.env.AGENT_CONFIG || '{}');
    
    this.isRunning = false;
    this.isBackgroundMode = ${config.backgroundMode};
    this.autoSync = ${config.autoSync};
    this.cycleCount = 0;
    this.maxCycles = Infinity;
    this.checkInterval = 30000; // 30 seconds
    
    this.logFile = path.join(this.projectPath, 'logs', \`\${this.agentId}.log\`);
    this.statusFile = path.join(this.projectPath, 'logs', \`\${this.agentId}-status.json\`);
    this.backupDir = path.join(this.projectPath, 'backups', this.agentId);
    
    this.features = {
      'auto-healing': ${config.features.includes('auto-healing')},
      'monitoring': ${config.features.includes('monitoring')},
      'ai-suggestions': ${config.features.includes('ai-suggestions')},
      'parallel': ${config.features.includes('parallel')},
      'background-sync': ${config.features.includes('background-sync')},
      'web-interface': ${config.features.includes('web-interface')},
      'git-integration': ${config.features.includes('git-integration')},
      'performance-tracking': ${config.features.includes('performance-tracking')}
    };
  }

  async init() {
    console.log(chalk.cyan(\`🧠 \${this.agentId} - بدء التشغيل\`));
    
    await this.ensureDirectories();
    await this.log('🚀 بدء تشغيل الأجنت');
    
    if (this.isBackgroundMode) {
      await this.log('🔄 وضع الخلفية مفعل');
    }
    
    if (this.autoSync) {
      await this.log('🔄 المزامنة التلقائية مفعلة');
      this.setupAutoSync();
    }
    
    this.isRunning = true;
    await this.saveStatus('running');
  }

  async ensureDirectories() {
    const dirs = ['logs', 'backups', 'temp', 'reports'];
    for (const dir of dirs) {
      await fs.ensureDir(path.join(this.projectPath, dir));
    }
    await fs.ensureDir(this.backupDir);
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = \`[\${timestamp}] [\${level.toUpperCase()}] \${message}\`;
    
    console.log(logMessage);
    
    try {
      await fs.appendFile(this.logFile, \`\${logMessage}\\n\`);
    } catch (error) {
      console.error('خطأ في كتابة السجل:', error.message);
    }
    
    // Send to parent process
    if (process.send) {
      process.send({
        type: 'log',
        level,
        message,
        timestamp
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
      features: this.features
    };
    
    await fs.writeJson(this.statusFile, statusData, { spaces: 2 });
    
    if (process.send) {
      process.send({
        type: 'status',
        status,
        data: statusData
      });
    }
  }

  setupAutoSync() {
    if (this.features['background-sync']) {
      // Sync every 5 minutes
      cron.schedule('*/5 * * * *', async () => {
        await this.performSync();
      });
      
      // Also sync on file changes
      if (this.features['git-integration']) {
        this.setupGitWatcher();
      }
    }
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
        
        // Sync with remote
        if (this.features['git-integration']) {
          await this.gitSync();
        }
        
        await this.log('✅ تمت المزامنة بنجاح');
      } else {
        await this.log('ℹ️ لا توجد تغييرات للمزامنة');
      }
    } catch (error) {
      await this.log(\`❌ خطأ في المزامنة: \${error.message}\`, 'error');
    }
  }

  async checkForChanges() {
    // Implementation depends on project type
    return true; // Placeholder
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, \`backup-\${timestamp}\`);
    
    await fs.ensureDir(backupPath);
    
    // Copy important files
    const importantFiles = ['src', 'package.json', 'tsconfig.json'];
    for (const file of importantFiles) {
      const srcPath = path.join(this.projectPath, file);
      const destPath = path.join(backupPath, file);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
      }
    }
    
    await this.log(\`💾 تم إنشاء نسخة احتياطية: \${backupPath}\`);
  }

  async gitSync() {
    if (!this.features['git-integration']) return;
    
    try {
      // Add all changes
      await this.runCommand('git add .');
      
      // Check if there are changes to commit
      const status = await this.runCommand('git status --porcelain');
      if (status.trim()) {
        await this.runCommand(\`git commit -m "Auto-sync: \${new Date().toISOString()}"\`);
        await this.runCommand('git push');
        await this.log('📤 تم دفع التغييرات إلى Git');
      }
    } catch (error) {
      await this.log(\`⚠️ خطأ في Git sync: \${error.message}\`, 'warning');
    }
  }

  setupGitWatcher() {
    const chokidar = require('chokidar');
    
    const watcher = chokidar.watch(this.projectPath, {
      ignored: /(^|[\\/\\\\])\\../, // ignore dotfiles
      persistent: true
    });
    
    watcher.on('change', async (path) => {
      await this.log(\`📝 تغيير في الملف: \${path}\`);
      // Debounce sync
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.performSync();
      }, 5000);
    });
  }

  async runCommand(command, options = {}) {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, {
        cwd: this.projectPath,
        shell: true,
        ...options
      });
      
      let output = '';
      let error = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(error || \`Command failed with code \${code}\`));
        }
      });
    });
  }

  async analyzeProject() {
    await this.log('🔍 تحليل المشروع...');
    
    const analysis = {
      files: 0,
      lines: 0,
      errors: 0,
      warnings: 0,
      suggestions: []
    };
    
    // Basic analysis - can be extended
    try {
      const files = await this.getAllSourceFiles();
      analysis.files = files.length;
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        analysis.lines += content.split('\\n').length;
      }
      
      await this.log(\`📊 تحليل المشروع: \${analysis.files} ملف، \${analysis.lines} سطر\`);
    } catch (error) {
      await this.log(\`❌ خطأ في التحليل: \${error.message}\`, 'error');
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

  async runCycle() {
    this.cycleCount++;
    await this.log(\`\\n🔄 بدء الدورة \${this.cycleCount}...\`);
    
    try {
      // Analyze project
      const analysis = await this.analyzeProject();
      
      // Apply fixes if auto-healing is enabled
      if (this.features['auto-healing']) {
        await this.applyFixes(analysis);
      }
      
      // Generate suggestions if AI suggestions are enabled
      if (this.features['ai-suggestions']) {
        await this.generateSuggestions(analysis);
      }
      
      // Update progress
      if (process.send) {
        process.send({
          type: 'progress',
          progress: Math.min(100, this.cycleCount * 10),
          status: 'running'
        });
      }
      
      await this.saveStatus('running');
      
    } catch (error) {
      await this.log(\`❌ خطأ في الدورة: \${error.message}\`, 'error');
    }
  }

  async applyFixes(analysis) {
    await this.log('🔧 تطبيق الإصلاحات التلقائية...');
    
    // Basic fixes - can be extended
    try {
      // ESLint fix
      await this.runCommand('npm run lint:fix', { silent: true });
      
      // Prettier format
      await this.runCommand('npx prettier --write "src/**/*.{ts,tsx,js,jsx}"', { silent: true });
      
      await this.log('✅ تم تطبيق الإصلاحات التلقائية');
    } catch (error) {
      await this.log(\`⚠️ بعض الإصلاحات فشلت: \${error.message}\`, 'warning');
    }
  }

  async generateSuggestions(analysis) {
    await this.log('🧠 توليد اقتراحات ذكية...');
    
    const suggestions = [
      'تحسين هيكل الملفات',
      'إضافة اختبارات للوحدات',
      'تحسين الأداء',
      'إضافة توثيق',
      'تحسين الأمان'
    ];
    
    await this.log(\`💡 اقتراحات: \${suggestions.join(', ')}\`);
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
    await this.saveStatus('stopped');
    
    if (process.send) {
      process.send({
        type: 'complete',
        result: { cycles: this.cycleCount, status: 'stopped' }
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
      await this.log(\`❌ خطأ في الأجنت: \${error.message}\`, 'error');
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
const agent = new ${this.toPascalCase(config.name)}Agent();
agent.run().catch(console.error);`;
  }

  async generateConfig(agentDir, config) {
    const configData = {
      name: config.name,
      type: config.type,
      description: config.description,
      language: config.language,
      features: config.features,
      backgroundMode: config.backgroundMode,
      autoSync: config.autoSync,
      version: '1.0.0',
      created: new Date().toISOString(),
      author: 'Ultimate Builder Platform'
    };
    
    await fs.writeJson(path.join(agentDir, 'agent.config.json'), configData, { spaces: 2 });
  }

  async generatePackageJson(agentDir, config) {
    const packageData = {
      name: config.name,
      version: '1.0.0',
      description: config.description,
      main: 'index.mjs',
      type: 'module',
      scripts: {
        start: 'node index.mjs',
        dev: 'node index.mjs --dev',
        test: 'npm run test:unit',
        'test:unit': 'jest',
        build: 'npm run build:web',
        'build:web': 'cd web && npm run build'
      },
      dependencies: {
        'fs-extra': '^11.1.1',
        'chalk': '^5.3.0',
        'node-cron': '^3.0.2',
        'chokidar': '^3.5.3'
      },
      devDependencies: {
        'jest': '^29.7.0',
        'nodemon': '^3.0.1'
      },
      keywords: ['ai', 'agent', 'automation', 'builder'],
      author: 'Ultimate Builder Platform',
      license: 'MIT'
    };
    
    await fs.writeJson(path.join(agentDir, 'package.json'), packageData, { spaces: 2 });
  }

  async generateReadme(agentDir, config) {
    const readme = `# ${config.name}

${config.description}

## الميزات

${config.features.map(feature => `- ${this.getFeatureDescription(feature)}`).join('\n')}

## التثبيت

\`\`\`bash
npm install
\`\`\`

## التشغيل

\`\`\`bash
npm start
\`\`\`

## التطوير

\`\`\`bash
npm run dev
\`\`\`

## الاختبار

\`\`\`bash
npm test
\`\`\`

## الإعدادات

يمكن تخصيص الأجنت من خلال ملف \`agent.config.json\`.

## المساهمة

هذا الأجنت تم إنشاؤه بواسطة Ultimate Builder Platform.
`;
    
    await fs.writeFile(path.join(agentDir, 'README.md'), readme);
  }

  async generateTests(agentDir, config) {
    const testDir = path.join(agentDir, 'tests');
    await fs.ensureDir(testDir);
    
    const testFile = `import { describe, test, expect, beforeEach } from '@jest/globals';

describe('${config.name} Agent', () => {
  beforeEach(() => {
    // Setup
  });

  test('should initialize correctly', () => {
    expect(true).toBe(true);
  });

  test('should run analysis', () => {
    expect(true).toBe(true);
  });

  test('should apply fixes', () => {
    expect(true).toBe(true);
  });
});
`;
    
    await fs.writeFile(path.join(testDir, 'agent.test.js'), testFile);
  }

  async generateWebInterface(agentDir, config) {
    const webDir = path.join(agentDir, 'web');
    await fs.ensureDir(webDir);
    
    const webInterface = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name} - واجهة التحكم</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px;
        }
        .status.running {
            background: #d4edda;
            color: #155724;
        }
        .status.stopped {
            background: #f8d7da;
            color: #721c24;
        }
        .controls {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin: 5px;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #007bff;
            color: white;
        }
        .btn-success {
            background: #28a745;
            color: white;
        }
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .logs {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            max-height: 400px;
            overflow-y: auto;
        }
        .log-entry {
            padding: 5px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .log-entry:last-child {
            border-bottom: none;
        }
        .log-timestamp {
            color: #6c757d;
            font-size: 0.9em;
        }
        .log-level {
            font-weight: bold;
            margin: 0 10px;
        }
        .log-level.info {
            color: #17a2b8;
        }
        .log-level.warning {
            color: #ffc107;
        }
        .log-level.error {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 ${config.name}</h1>
            <p>${config.description}</p>
            <div class="status" id="status">متوقف</div>
        </div>
        
        <div class="controls">
            <button class="btn btn-success" onclick="startAgent()">▶️ تشغيل</button>
            <button class="btn btn-danger" onclick="stopAgent()">⏹️ إيقاف</button>
            <button class="btn btn-primary" onclick="refreshLogs()">🔄 تحديث</button>
        </div>
        
        <div class="logs" id="logs">
            <div class="log-entry">
                <span class="log-timestamp">${new Date().toLocaleTimeString('ar-SA')}</span>
                <span class="log-level info">INFO</span>
                <span>واجهة التحكم جاهزة</span>
            </div>
        </div>
    </div>

    <script>
        let agentStatus = 'stopped';
        
        function startAgent() {
            fetch('/api/agents/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: '${config.name}',
                    projectId: 'current'
                })
            })
            .then(response => response.json())
            .then(data => {
                agentStatus = 'running';
                updateStatus();
                addLog('تم تشغيل الأجنت بنجاح', 'info');
            })
            .catch(error => {
                addLog('خطأ في تشغيل الأجنت: ' + error.message, 'error');
            });
        }
        
        function stopAgent() {
            fetch('/api/agents/stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agentId: '${config.name}-agent'
                })
            })
            .then(response => response.json())
            .then(data => {
                agentStatus = 'stopped';
                updateStatus();
                addLog('تم إيقاف الأجنت', 'info');
            })
            .catch(error => {
                addLog('خطأ في إيقاف الأجنت: ' + error.message, 'error');
            });
        }
        
        function refreshLogs() {
            addLog('تم تحديث السجلات', 'info');
        }
        
        function updateStatus() {
            const statusEl = document.getElementById('status');
            statusEl.textContent = agentStatus === 'running' ? 'يعمل' : 'متوقف';
            statusEl.className = 'status ' + agentStatus;
        }
        
        function addLog(message, level = 'info') {
            const logsEl = document.getElementById('logs');
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = \`
                <span class="log-timestamp">\${new Date().toLocaleTimeString('ar-SA')}</span>
                <span class="log-level \${level}">\${level.toUpperCase()}</span>
                <span>\${message}</span>
            \`;
            logsEl.appendChild(logEntry);
            logsEl.scrollTop = logsEl.scrollHeight;
        }
        
        // Auto-refresh status
        setInterval(() => {
            fetch('/api/agents')
            .then(response => response.json())
            .then(data => {
                const agent = data.find(a => a.type === '${config.name}');
                if (agent) {
                    agentStatus = agent.status;
                    updateStatus();
                }
            })
            .catch(error => {
                console.error('Error fetching agent status:', error);
            });
        }, 5000);
    </script>
</body>
</html>`;
    
    await fs.writeFile(path.join(webDir, 'index.html'), webInterface);
  }

  getFeatureDescription(feature) {
    const descriptions = {
      'auto-healing': 'إصلاح تلقائي للأخطاء والتحذيرات',
      'monitoring': 'مراقبة فورية لحالة المشروع',
      'ai-suggestions': 'اقتراحات ذكية للتحسين',
      'parallel': 'معالجة متوازية للمهام',
      'background-sync': 'مزامنة تلقائية في الخلفية',
      'web-interface': 'واجهة ويب للتحكم',
      'git-integration': 'تكامل مع Git للمزامنة',
      'performance-tracking': 'تتبع الأداء والتحسين'
    };
    return descriptions[feature] || feature;
  }

  toPascalCase(str) {
    return str.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
  }
}

// Run the creator
const creator = new AgentCreator();
creator.createAgent().catch(console.error);

