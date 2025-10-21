#!/usr/bin/env node

/**
 * 🚀 Ultimate Builder Platform - Main Entry Point
 * نقطة الدخول الرئيسية للمنصة
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
  console.log(chalk.blue('🚀 بدء تشغيل المنصة...\n'));

  // Start the platform
  startPlatform();
}

async function startPlatform() {
  try {
    // Start core server
    const server = spawn('node', ['core/server.js'], {
      cwd: __dirname,
      stdio: 'pipe',
    });

    server.stdout.on('data', data => {
      const output = data.toString();
      if (output.includes('Server running')) {
        console.log(chalk.green('✅ الخادم الأساسي يعمل على المنفذ 3000'));
        showSuccessMessage();
      }
    });

    server.stderr.on('data', data => {
      console.error(chalk.red('خطأ في الخادم:'), data.toString());
    });

    server.on('error', error => {
      console.error(chalk.red('❌ فشل في بدء الخادم:'), error);
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 إيقاف المنصة...'));
      server.kill('SIGTERM');
      process.exit(0);
    });
  } catch (error) {
    console.error(chalk.red('❌ خطأ في تشغيل المنصة:'), error);
    process.exit(1);
  }
}

function showSuccessMessage() {
  const message = boxen(
    chalk.green('✅ تم تشغيل المنصة بنجاح!\n\n') +
      chalk.blue('🌐 واجهة الويب: ') +
      chalk.white('http://localhost:3000\n') +
      chalk.blue('🔧 إدارة الإعدادات: ') +
      chalk.white('node core/settings-manager.js\n') +
      chalk.blue('⚙️ إعدادات المشروع: ') +
      chalk.white('node settings.js\n') +
      chalk.blue('📊 المراقبة: ') +
      chalk.white('نشطة\n\n') +
      chalk.yellow('اضغط Ctrl+C لإيقاف المنصة'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a',
    }
  );

  console.log(message);
}
