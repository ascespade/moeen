#!/usr/bin/env node

/**
 * 🚀 Ultimate Builder Platform - Quick Start
 * التشغيل السريع للمنصة
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();

// Show banner
console.log(
  chalk.cyan(figlet.textSync('Ultimate Builder', { font: 'ANSI Shadow' }))
);
console.log(chalk.blue('منصة البناء الذكية المتقدمة\n'));

// Show quick start options
const message = boxen(
  chalk.green('🚀 Ultimate Builder Platform - Quick Start\n\n') +
    chalk.blue('اختر طريقة التشغيل:\n\n') +
    chalk.white('1. ') +
    chalk.cyan('node run.js') +
    chalk.gray(' - تشغيل كامل للمنصة\n') +
    chalk.white('2. ') +
    chalk.cyan('node core/settings-manager.js') +
    chalk.gray(' - إعداد المفاتيح\n') +
    chalk.white('3. ') +
    chalk.cyan('node settings.js') +
    chalk.gray(' - إعدادات المشروع\n') +
    chalk.white('4. ') +
    chalk.cyan('npm start') +
    chalk.gray(' - تشغيل عبر npm\n\n') +
    chalk.yellow('💡 نصائح:\n') +
    chalk.gray('• تأكد من تثبيت التبعيات أولاً: ') +
    chalk.white('npm install\n') +
    chalk.gray('• قم بإعداد المفاتيح قبل التشغيل\n') +
    chalk.gray('• الواجهة ستكون متاحة على: ') +
    chalk.white('http://localhost:3000'),
  {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    backgroundColor: '#1a1a1a',
  }
);

console.log(message);

// Check if we're in the right directory
const requiredFiles = [
  'package.json',
  'core/server.js',
  'web-interface/dist/index.html',
];
const missingFiles = requiredFiles.filter(
  file => !require('fs').existsSync(path.join(__dirname, file))
);

if (missingFiles.length > 0) {
  console.log(chalk.red('❌ ملفات مفقودة:'));
  missingFiles.forEach(file => console.log(chalk.red(`   - ${file}`)));
  console.log(chalk.yellow('\n💡 تأكد من أنك في مجلد المنصة الصحيح'));
  process.exit(1);
}

// Check if node_modules exists
if (!require('fs').existsSync(path.join(__dirname, 'node_modules'))) {
  console.log(chalk.yellow('⚠️  لم يتم العثور على node_modules'));
  console.log(chalk.blue('🔧 جاري تثبيت التبعيات...\n'));

  const install = spawn('npm', ['install'], {
    cwd: __dirname,
    stdio: 'inherit',
  });

  install.on('close', code => {
    if (code === 0) {
      console.log(chalk.green('\n✅ تم تثبيت التبعيات بنجاح!'));
      console.log(
        chalk.blue('🚀 يمكنك الآن تشغيل المنصة باستخدام: node run.js')
      );
    } else {
      console.log(chalk.red('\n❌ فشل في تثبيت التبعيات'));
      process.exit(1);
    }
  });
} else {
  console.log(chalk.green('✅ التبعيات جاهزة'));
  console.log(chalk.blue('🚀 يمكنك تشغيل المنصة الآن!'));
}
