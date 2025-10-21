#!/usr/bin/env node

/**
 * 🚀 AI Agent Project - Quick Start
 * التشغيل السريع لمشروع الأجنت
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();

// Show banner
console.log(chalk.cyan(figlet.textSync('AI Agent', { font: 'ANSI Shadow' })));
console.log(chalk.blue('مشروع الأجنت الذكي\n'));

// Show quick start options
const message = boxen(
  chalk.green('🚀 AI Agent Project - Quick Start\n\n') +
  chalk.blue('اختر طريقة التشغيل:\n\n') +
  chalk.white('1. ') + chalk.cyan('npm start') + chalk.gray(' - تشغيل الأجنت\n') +
  chalk.white('2. ') + chalk.cyan('npm run dev') + chalk.gray(' - تشغيل في وضع التطوير\n') +
  chalk.white('3. ') + chalk.cyan('npm test') + chalk.gray(' - تشغيل الاختبارات\n') +
  chalk.white('4. ') + chalk.cyan('node start.js') + chalk.gray(' - تشغيل مباشر\n\n') +
  chalk.yellow('💡 نصائح:\n') +
  chalk.gray('• تأكد من تثبيت التبعيات أولاً: ') + chalk.white('npm install\n') +
  chalk.gray('• يمكنك تخصيص الإعدادات في: ') + chalk.white('config/agent-config.json\n') +
  chalk.gray('• السجلات ستكون في: ') + chalk.white('logs/agent.log\n') +
  chalk.gray('• التقارير ستكون في: ') + chalk.white('reports/agent-report.json'),
  {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    backgroundColor: '#1a1a1a'
  }
);

console.log(message);

// Check if we're in the right directory
const requiredFiles = ['package.json', 'src/index.js', 'config/agent-config.json'];
const missingFiles = requiredFiles.filter(file => 
  !fs.existsSync(path.join(__dirname, file))
);

if (missingFiles.length > 0) {
  console.log(chalk.red('❌ ملفات مفقودة:'));
  missingFiles.forEach(file => console.log(chalk.red(`   - ${file}`)));
  console.log(chalk.yellow('\n💡 تأكد من أنك في مجلد المشروع الصحيح'));
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log(chalk.yellow('⚠️  لم يتم العثور على node_modules'));
  console.log(chalk.blue('🔧 جاري تثبيت التبعيات...\n'));
  
  const install = spawn('npm', ['install'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  install.on('close', (code) => {
    if (code === 0) {
      console.log(chalk.green('\n✅ تم تثبيت التبعيات بنجاح!'));
      console.log(chalk.blue('🚀 يمكنك الآن تشغيل الأجنت باستخدام: npm start'));
    } else {
      console.log(chalk.red('\n❌ فشل في تثبيت التبعيات'));
      process.exit(1);
    }
  });
} else {
  console.log(chalk.green('✅ التبعيات جاهزة'));
  console.log(chalk.blue('🚀 يمكنك تشغيل الأجنت الآن!'));
}
