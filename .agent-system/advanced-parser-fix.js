#!/usr/bin/env node
/**
 * 🔧 Advanced Parser Fix - إصلاح متقدم لأخطاء الـ parsing
 * يحلل الأخطاء ويصلحها تلقائياً
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔧 Advanced Parser Fix Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP_DIR = 'tmp/backup-parser-' + Date.now();
const LOG_FILE = 'tmp/parser-fix.log';

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (err) {}
}

// إنشاء backup
function createBackup() {
  log('Creating backup...', 'info');
  try {
    execSync(`mkdir -p ${BACKUP_DIR}`, { stdio: 'pipe' });
    execSync(`cp -r src ${BACKUP_DIR}/src 2>/dev/null || true`, { stdio: 'pipe' });
    log('✅ Backup created', 'success');
    return true;
  } catch (error) {
    log('❌ Backup failed', 'error');
    return false;
  }
}

// الحصول على قائمة الأخطاء من ESLint
function getParsingErrors() {
  log('🔍 Analyzing parsing errors...', 'info');
  
  try {
    execSync('npm run lint', { stdio: 'pipe', encoding: 'utf8' });
  } catch (error) {
    const output = error.stdout || '';
    const errors = [];
    
    const lines = output.split('\n');
    let currentFile = null;
    
    for (const line of lines) {
      // اسم الملف
      if (line.startsWith('./src/') && !line.includes('Error') && !line.includes('Warning')) {
        currentFile = line.trim();
      }
      // خطأ parsing
      else if (line.includes('Error: Parsing error:') && currentFile) {
        const match = line.match(/(\d+):(\d+)\s+Error: Parsing error: (.+)/);
        if (match) {
          errors.push({
            file: currentFile,
            line: parseInt(match[1]),
            column: parseInt(match[2]),
            message: match[3]
          });
        }
      }
    }
    
    log(`Found ${errors.length} parsing errors`, 'info');
    return errors;
  }
}

// إصلاح ملف واحد
function fixFile(filepath) {
  try {
    if (!fs.existsSync(filepath)) return false;
    
    let content = fs.readFileSync(filepath, 'utf8');
    const original = content;
    let fixed = false;
    
    // إصلاح 1: useState<Type>('') بدون قيمة افتراضية صحيحة
    // ',' expected في useState
    const useStatePattern = /useState<([^>]+)>\s*\(\s*['"]{2}\s*\)/g;
    if (useStatePattern.test(content)) {
      content = content.replace(
        /useState<string>\s*\(\s*['"]{2}\s*\)/g,
        "useState<string>('')"
      );
      content = content.replace(
        /useState<([^>]+)>\s*\(\s*['"]{2}\s*\)/g,
        "useState<$1>('' as any)"
      );
      fixed = true;
    }
    
    // إصلاح 2: object property مكسور
    // Property or signature expected
    content = content.replace(
      /{\s*\n\s*\n\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
      '{\n  $1:'
    );
    
    // إصلاح 3: حذف export/import فارغة أو مكسورة
    content = content.replace(/\nexport\s*{\s*}\s*;?\s*$/g, '');
    content = content.replace(/\nimport\s*{\s*}\s*from\s*['"]/g, '\n// Removed empty import from "');
    
    // إصلاح 4: ';' expected
    // إضافة ; في نهاية السطور التي تحتاجها
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // إذا السطر ينتهي بـ ) أو } وليس فيه ; والسطر التالي يبدأ بكلمة جديدة
      if (line.trim() && 
          (line.trim().endsWith(')') || line.trim().endsWith('}')) &&
          !line.trim().endsWith(';') &&
          !line.trim().endsWith(',') &&
          !line.trim().endsWith('{') &&
          i + 1 < lines.length) {
        
        const nextLine = lines[i + 1].trim();
        if (nextLine && !nextLine.startsWith('.') && !nextLine.startsWith(')') && 
            !nextLine.startsWith('}') && !nextLine.startsWith(',')) {
          // أضف ;
          line = line.trimEnd() + ';';
          fixed = true;
        }
      }
      
      newLines.push(line);
    }
    
    content = newLines.join('\n');
    
    // إصلاح 5: Expression expected
    // عادة بسبب قوسين مفقودين أو زائدين
    content = content.replace(/useState<([^>]+)>\(\s*\)/g, 'useState<$1>(null)');
    
    // إصلاح 6: Identifier expected
    // حذف سطور فارغة في import/export blocks
    content = content.replace(/import\s*{\s*\n\s*\n/g, 'import {\n  ');
    content = content.replace(/export\s*{\s*\n\s*\n/g, 'export {\n  ');
    
    // حفظ إذا تغير
    if (content !== original) {
      fs.writeFileSync(filepath, content);
      return true;
    }
    
    return false;
  } catch (err) {
    log(`Error fixing ${filepath}: ${err.message}`, 'error');
    return false;
  }
}

// إصلاح كل الملفات
function fixAllFiles() {
  log('\n🔧 Fixing all files with parsing errors...\n', 'info');
  
  const errors = getParsingErrors();
  const uniqueFiles = [...new Set(errors.map(e => e.file))];
  
  log(`Processing ${uniqueFiles.length} unique files...\n`, 'info');
  
  let fixedCount = 0;
  
  for (const file of uniqueFiles) {
    if (fixFile(file)) {
      log(`   ✅ Fixed: ${file}`, 'success');
      fixedCount++;
    }
  }
  
  log(`\n✅ Fixed ${fixedCount} files\n`, 'success');
  return fixedCount;
}

// تشغيل prettier بعد الإصلاح
function runPrettier() {
  log('🎨 Running Prettier...', 'info');
  
  try {
    execSync('npx prettier --write "src/**/*.{ts,tsx}" 2>/dev/null', {
      stdio: 'pipe',
      timeout: 120000
    });
    log('✅ Prettier completed\n', 'success');
    return true;
  } catch (err) {
    log('⚠️  Prettier had issues\n', 'warn');
    return false;
  }
}

// فحص النتائج
function verifyFixes() {
  log('🧪 Verifying fixes...\n', 'info');
  
  try {
    const result = execSync('npm run lint 2>&1', { encoding: 'utf8' });
    const errors = (result.match(/Error:/g) || []).length;
    const warnings = (result.match(/Warning:/g) || []).length;
    
    log(`Errors: ${errors}`, errors === 0 ? 'success' : 'warn');
    log(`Warnings: ${warnings}\n`, 'info');
    
    return { errors, warnings };
  } catch (err) {
    const output = err.stdout || '';
    const errors = (output.match(/Error:/g) || []).length;
    const warnings = (output.match(/Warning:/g) || []).length;
    
    log(`Errors: ${errors}`, errors === 0 ? 'success' : 'warn');
    log(`Warnings: ${warnings}\n`, 'info');
    
    return { errors, warnings };
  }
}

// تشغيل رئيسي
async function main() {
  try {
    // Backup
    if (!createBackup()) {
      log('⚠️  Proceeding without backup...', 'warn');
    }
    
    // إصلاح المرحلة 1
    const fixed1 = fixAllFiles();
    
    // Prettier
    runPrettier();
    
    // إصلاح المرحلة 2 (بعد prettier)
    const fixed2 = fixAllFiles();
    
    // التحقق
    const results = verifyFixes();
    
    // التقرير النهائي
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    log('\n📊 Parser Fix Report:\n', 'info');
    log(`   Files fixed (Phase 1): ${fixed1}`, 'info');
    log(`   Files fixed (Phase 2): ${fixed2}`, 'info');
    log(`   Total files fixed: ${fixed1 + fixed2}`, 'info');
    log(`   Final errors: ${results.errors}`, results.errors === 0 ? 'success' : 'warn');
    log(`   Final warnings: ${results.warnings}`, 'info');
    
    const improvement = results.errors === 0 ? 100 : Math.max(0, 100 - (results.errors / 332 * 100));
    log(`   Improvement: ${improvement.toFixed(1)}%\n`, 'info');
    
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
    
    if (results.errors === 0) {
      log('🎉 All parsing errors fixed!\n', 'success');
    } else if (results.errors < 50) {
      log('🟡 Most errors fixed, some remain\n', 'warn');
    } else {
      log('🔴 Many errors remain, needs deeper fix\n', 'error');
    }
    
    // حفظ التقرير
    const report = {
      timestamp: new Date().toISOString(),
      fixedPhase1: fixed1,
      fixedPhase2: fixed2,
      totalFixed: fixed1 + fixed2,
      finalErrors: results.errors,
      finalWarnings: results.warnings,
      improvement: improvement
    };
    
    fs.writeFileSync('tmp/parser-fix-report.json', JSON.stringify(report, null, 2));
    log('📁 Report saved: tmp/parser-fix-report.json\n', 'info');
    
    process.exit(results.errors === 0 ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// تشغيل
if (require.main === module) {
  main();
}

module.exports = { main, fixFile, fixAllFiles };
