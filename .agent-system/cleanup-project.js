#!/usr/bin/env node
/**
 * 🧹 Cleanup Project - تنظيف آمن للمشروع
 * يحذف الملفات غير المستخدمة، الملفات المؤقتة، والتبعيات القديمة
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🧹 Cleanup Project Agent Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP_DIR = 'tmp/backup-cleanup-' + Date.now();
const LOG_FILE = 'tmp/cleanup-project.log';

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (err) {
    // Ignore
  }
}

// النسخ الاحتياطي
function createBackup() {
  log('Creating backup...', 'info');
  try {
    execSync(`mkdir -p ${BACKUP_DIR}`, { stdio: 'inherit' });
    execSync(`cp -r src ${BACKUP_DIR}/src 2>/dev/null || true`, { stdio: 'inherit' });
    log(`✅ Backup created at ${BACKUP_DIR}`, 'success');
    return true;
  } catch (error) {
    log(`❌ Backup failed: ${error.message}`, 'error');
    return false;
  }
}

// حذف ملفات البناء القديمة
function cleanBuildFiles() {
  log('\n🗑️  Cleaning build files...', 'info');
  
  let deleted = 0;
  
  const dirsToClean = [
    '.next',
    'out',
    'dist',
    'build'
  ];
  
  try {
    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        const size = getDirSize(dir);
        execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
        log(`   ✅ Deleted: ${dir}/ (${formatSize(size)})`, 'success');
        deleted++;
      }
    }
    
    log(`\n   Deleted ${deleted} build directories\n`, 'info');
    return deleted;
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    return deleted;
  }
}

// حذف ملفات مؤقتة
function cleanTempFiles() {
  log('🗂️  Cleaning temporary files...', 'info');
  
  let deleted = 0;
  
  const patterns = [
    '**/*.log',
    '**/*.tmp',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.swp',
    '**/*.swo',
    '**/*~'
  ];
  
  try {
    // حذف ملفات backup قديمة (أكثر من 7 أيام)
    if (fs.existsSync('tmp')) {
      const files = fs.readdirSync('tmp');
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      for (const file of files) {
        if (file.startsWith('backup-')) {
          const filePath = path.join('tmp', file);
          const stats = fs.statSync(filePath);
          const age = now - stats.mtimeMs;
          
          if (age > sevenDays) {
            execSync(`rm -rf ${filePath}`, { stdio: 'inherit' });
            log(`   ✅ Deleted old backup: ${file}`, 'success');
            deleted++;
          }
        }
      }
    }
    
    log(`\n   Deleted ${deleted} temporary files\n`, 'info');
    return deleted;
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    return deleted;
  }
}

// حذف node_modules غير المستخدمة
function cleanNodeModules() {
  log('📦 Cleaning node_modules...', 'info');
  
  try {
    if (fs.existsSync('node_modules')) {
      const size = getDirSize('node_modules');
      log(`   Current size: ${formatSize(size)}`, 'info');
      
      // إعادة التثبيت النظيف
      log('   Running npm prune...', 'info');
      execSync('npm prune', { stdio: 'pipe' });
      
      const newSize = getDirSize('node_modules');
      const saved = size - newSize;
      
      if (saved > 0) {
        log(`   ✅ Saved: ${formatSize(saved)}`, 'success');
      } else {
        log(`   ✅ Already clean`, 'success');
      }
      
      log('', 'info');
      return saved > 0;
    }
    
    return false;
    
  } catch (error) {
    log(`   ⚠️  Could not clean node_modules: ${error.message}`, 'warn');
    return false;
  }
}

// البحث عن ملفات غير مستخدمة
function findUnusedFiles() {
  log('🔍 Finding unused files...', 'info');
  
  const unusedFiles = [];
  
  try {
    // البحث عن ملفات test غير مستخدمة
    const findFiles = (dir, pattern) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          if (!['node_modules', '.next', '.git'].includes(file)) {
            findFiles(filePath, pattern);
          }
        } else if (file.match(pattern)) {
          unusedFiles.push(filePath);
        }
      }
    };
    
    // أنماط الملفات غير المستخدمة عادة
    const patterns = [
      /\.test\.ts$/,
      /\.spec\.ts$/,
      /\.test\.tsx$/,
      /\.spec\.tsx$/,
      /\.stories\.tsx$/,
      /\.example\./,
      /\.sample\./
    ];
    
    for (const pattern of patterns) {
      findFiles('src', pattern);
    }
    
    if (unusedFiles.length > 0) {
      log(`\n   ⚠️  Found ${unusedFiles.length} potential unused files:`, 'warn');
      unusedFiles.slice(0, 10).forEach(file => {
        log(`      ${file}`, 'warn');
      });
      if (unusedFiles.length > 10) {
        log(`      ... and ${unusedFiles.length - 10} more`, 'warn');
      }
      log(`\n   💡 Review these files manually before deletion`, 'info');
    } else {
      log('   ✅ No obvious unused files found', 'success');
    }
    
    log('', 'info');
    return unusedFiles.length;
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    return 0;
  }
}

// تحليل الحجم
function analyzeSize() {
  log('📊 Analyzing project size...', 'info');
  
  try {
    const dirs = {
      'src': getDirSize('src'),
      'node_modules': getDirSize('node_modules'),
      '.next': getDirSize('.next'),
      'public': getDirSize('public')
    };
    
    const total = Object.values(dirs).reduce((sum, size) => sum + size, 0);
    
    log(`\n   Project size breakdown:`, 'info');
    for (const [dir, size] of Object.entries(dirs)) {
      if (size > 0) {
        const percentage = ((size / total) * 100).toFixed(1);
        log(`      ${dir.padEnd(15)} ${formatSize(size).padEnd(12)} (${percentage}%)`, 'info');
      }
    }
    log(`      ${'TOTAL'.padEnd(15)} ${formatSize(total)}`, 'info');
    
    log('', 'info');
    return dirs;
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    return {};
  }
}

// مساعد: حساب حجم المجلد
function getDirSize(dirPath) {
  let size = 0;
  
  try {
    if (!fs.existsSync(dirPath)) return 0;
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (error) {
    // Ignore
  }
  
  return size;
}

// مساعد: تنسيق الحجم
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// تنظيف package.json
function cleanPackageJson() {
  log('📄 Checking package.json...', 'info');
  
  try {
    const packagePath = 'package.json';
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // فحص التبعيات المكررة
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    const duplicates = deps.filter(dep => devDeps.includes(dep));
    
    if (duplicates.length > 0) {
      log(`\n   ⚠️  Found ${duplicates.length} duplicate dependencies:`, 'warn');
      duplicates.forEach(dep => {
        log(`      ${dep}`, 'warn');
      });
      log(`\n   💡 Consider moving to devDependencies or removing`, 'info');
    } else {
      log('   ✅ No duplicate dependencies', 'success');
    }
    
    log('', 'info');
    return duplicates.length;
    
  } catch (error) {
    log(`   ⚠️  Could not check package.json: ${error.message}`, 'warn');
    return 0;
  }
}

// التقرير النهائي
function generateReport(results) {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('\n📊 Cleanup Report:\n', 'info');
  
  log(`   Build directories deleted: ${results.buildFiles}`, 'info');
  log(`   Temporary files deleted: ${results.tempFiles}`, 'info');
  log(`   Node modules cleaned: ${results.nodeModules ? '✅' : '⚠️'}`, 'info');
  log(`   Unused files found: ${results.unusedFiles}`, 'info');
  log(`   Duplicate dependencies: ${results.duplicates}`, 'info');
  
  const total = results.buildFiles + results.tempFiles;
  log(`\n   Total deletions: ${total}`, 'info');
  
  if (results.sizeSaved > 0) {
    log(`   💾 Space saved: ${formatSize(results.sizeSaved)}`, 'success');
  }
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
  
  // حفظ التقرير
  const report = {
    timestamp: new Date().toISOString(),
    results,
    total
  };
  
  fs.writeFileSync('tmp/cleanup-project-report.json', JSON.stringify(report, null, 2));
  log('📁 Report saved: tmp/cleanup-project-report.json\n', 'info');
}

// التشغيل الرئيسي
async function main() {
  const results = {
    buildFiles: 0,
    tempFiles: 0,
    nodeModules: false,
    unusedFiles: 0,
    duplicates: 0,
    sizeSaved: 0
  };
  
  try {
    // نسخة احتياطية
    if (!createBackup()) {
      log('❌ Backup failed, aborting...', 'error');
      process.exit(1);
    }
    
    // تحليل الحجم قبل
    const sizeBefore = analyzeSize();
    const totalBefore = Object.values(sizeBefore).reduce((sum, size) => sum + size, 0);
    
    // التنظيف
    results.buildFiles = cleanBuildFiles();
    results.tempFiles = cleanTempFiles();
    results.nodeModules = cleanNodeModules();
    results.unusedFiles = findUnusedFiles();
    results.duplicates = cleanPackageJson();
    
    // تحليل الحجم بعد
    const sizeAfter = analyzeSize();
    const totalAfter = Object.values(sizeAfter).reduce((sum, size) => sum + size, 0);
    results.sizeSaved = totalBefore - totalAfter;
    
    // التقرير
    generateReport(results);
    
    log('✅ Project cleanup complete!\n', 'success');
    process.exit(0);
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// تشغيل
if (require.main === module) {
  main();
}

module.exports = { main };
