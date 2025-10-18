#!/usr/bin/env node
/**
 * 🚀 Run All - تشغيل كل أنظمة التصليح والتنظيم
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('\n🚀 Running All Agent Systems...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const systems = [
  {
    name: '🤖 Auto-Fix',
    script: 'auto-fix.js',
    description: 'إصلاح الأخطاء تلقائياً'
  },
  {
    name: '🧠 Smart-Fix',
    script: 'smart-fix.js',
    description: 'إصلاحات ذكية'
  },
  {
    name: '📁 Organize Folders',
    script: 'organize-folders.js',
    description: 'تنظيم المجلدات'
  },
  {
    name: '🎨 Organize Code',
    script: 'organize-code.js',
    description: 'تنظيم الكود'
  },
  {
    name: '🧹 Cleanup Project',
    script: 'cleanup-project.js',
    description: 'تنظيف المشروع'
  }
];

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function runSystem(system) {
  log(`\n${system.name} - ${system.description}`);
  log(`Running: ${system.script}...\n`);
  
  try {
    execSync(`node .agent-system/${system.script}`, {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    log(`✅ ${system.name} completed!\n`);
    return true;
  } catch (error) {
    log(`❌ ${system.name} failed: ${error.message}\n`);
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  const results = {};
  
  console.log('📋 Systems to run:\n');
  systems.forEach((sys, i) => {
    console.log(`   ${i + 1}. ${sys.name} - ${sys.description}`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // تشغيل كل نظام
  for (const system of systems) {
    results[system.name] = await runSystem(system);
  }
  
  // النتيجة النهائية
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 Final Summary:\n');
  
  let successCount = 0;
  for (const [name, success] of Object.entries(results)) {
    const icon = success ? '✅' : '❌';
    console.log(`   ${icon} ${name}`);
    if (success) successCount++;
  }
  
  const successRate = Math.round((successCount / systems.length) * 100);
  
  console.log(`\n   Success Rate: ${successRate}% (${successCount}/${systems.length})`);
  console.log(`   Duration: ${duration}s`);
  
  // جمع التقارير
  console.log('\n📁 Reports generated:');
  const reports = [
    'tmp/auto-fix-report.json',
    'tmp/organize-folders-report.json',
    'tmp/organize-code-report.json',
    'tmp/cleanup-project-report.json'
  ];
  
  for (const report of reports) {
    if (fs.existsSync(report)) {
      console.log(`   ✅ ${report}`);
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (successRate === 100) {
    console.log('🎉 All systems completed successfully!\n');
  } else if (successRate >= 70) {
    console.log('🟡 Most systems completed, some issues remain\n');
  } else {
    console.log('🔴 Several systems failed, please review logs\n');
  }
  
  process.exit(successRate === 100 ? 0 : 1);
}

main();
