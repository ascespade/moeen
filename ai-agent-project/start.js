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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();

// Show banner
console.log(chalk.cyan(figlet.textSync('AI Agent', { font: 'ANSI Shadow' })));
console.log(chalk.blue('مشروع الأجنت الذكي\n'));

// Check if we're in the right directory
const requiredFiles = ['package.json', 'src/index.js', 'config/agent-config.json'];
const missingFiles = requiredFiles.filter(file => 
  !require('fs').existsSync(path.join(__dirname, file))
);

if (missingFiles.length > 0) {
  console.log(chalk.red('❌ ملفات مفقودة:'));
  missingFiles.forEach(file => console.log(chalk.red(`   - ${file}`)));
  console.log(chalk.yellow('\n💡 تأكد من أنك في مجلد المشروع الصحيح'));
  process.exit(1);
}

// Check if node_modules exists
if (!require('fs').existsSync(path.join(__dirname, 'node_modules'))) {
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
  console.log(chalk.blue('🚀 بدء تشغيل الأجنت...\n'));
  
  // Start the agent
  startAgent();
}

function startAgent() {
  const agent = spawn('node', ['src/index.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  agent.on('error', (error) => {
    console.error(chalk.red('❌ فشل في بدء الأجنت:'), error);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 إيقاف الأجنت...'));
    agent.kill('SIGTERM');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n🛑 إيقاف الأجنت...'));
    agent.kill('SIGTERM');
    process.exit(0);
  });
}
