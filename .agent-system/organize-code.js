#!/usr/bin/env node
/**
 * 🎨 Organize Code - تنظيم آمن للكود
 * ينظم الكود داخل الملفات: imports, exports, functions, types
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🎨 Organize Code Agent Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP_DIR = 'tmp/backup-code-' + Date.now();
const LOG_FILE = 'tmp/organize-code.log';

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
    execSync(`cp -r src ${BACKUP_DIR}/src`, { stdio: 'inherit' });
    log(`✅ Backup created at ${BACKUP_DIR}`, 'success');
    return true;
  } catch (error) {
    log(`❌ Backup failed: ${error.message}`, 'error');
    return false;
  }
}

// تنظيم الـ imports
function organizeImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // استخراج الـ imports
    const importLines = [];
    const otherLines = [];
    let inImportSection = true;
    
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('import ') || line.trim().startsWith('import{')) {
        importLines.push(line);
      } else if (line.trim() === '') {
        if (inImportSection) {
          importLines.push(line);
        } else {
          otherLines.push(line);
        }
      } else {
        inImportSection = false;
        otherLines.push(line);
      }
    }
    
    // تصنيف الـ imports
    const reactImports = [];
    const nextImports = [];
    const externalImports = [];
    const internalImports = [];
    const relativeImports = [];
    
    for (const line of importLines) {
      if (line.includes('from "react"') || line.includes("from 'react'")) {
        reactImports.push(line);
      } else if (line.includes('from "next') || line.includes("from 'next")) {
        nextImports.push(line);
      } else if (line.includes('from "@/')) {
        internalImports.push(line);
      } else if (line.includes('from "./') || line.includes('from "../')) {
        relativeImports.push(line);
      } else if (line.trim().startsWith('import ')) {
        externalImports.push(line);
      }
    }
    
    // إعادة ترتيب
    const orderedImports = [
      ...reactImports,
      reactImports.length > 0 ? '' : null,
      ...nextImports,
      nextImports.length > 0 ? '' : null,
      ...externalImports,
      externalImports.length > 0 ? '' : null,
      ...internalImports,
      internalImports.length > 0 ? '' : null,
      ...relativeImports
    ].filter(line => line !== null);
    
    // إعادة بناء الملف
    const newContent = [...orderedImports, '', ...otherLines].join('\n');
    
    if (newContent !== original) {
      fs.writeFileSync(filePath, newContent);
      return true;
    }
    
    return false;
    
  } catch (error) {
    log(`   ⚠️  Error organizing imports in ${filePath}: ${error.message}`, 'warn');
    return false;
  }
}

// تنظيف التعليقات المكررة
function cleanComments(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // إزالة التعليقات المكررة
    const lines = content.split('\n');
    const seenComments = new Set();
    const newLines = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // تخطي التعليقات المكررة
      if (trimmed.startsWith('//')) {
        if (seenComments.has(trimmed)) {
          continue; // تخطي
        }
        seenComments.add(trimmed);
      } else {
        seenComments.clear(); // مسح عند سطر جديد
      }
      
      newLines.push(line);
    }
    
    content = newLines.join('\n');
    
    // إزالة الأسطر الفارغة المتعددة (أكثر من 2)
    content = content.replace(/\n{3,}/g, '\n\n');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
    
  } catch (error) {
    return false;
  }
}

// إزالة console.log (اختياري - معلق)
function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // إزالة console.log فقط (ليس console.error أو console.warn)
    // معلق حالياً - يمكن تفعيله إذا أردت
    // content = content.replace(/console\.log\([^)]*\);?\n?/g, '');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
    
  } catch (error) {
    return false;
  }
}

// تنظيف unused imports
function removeUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // استخراج الـ imports
    const importRegex = /import\s+({[^}]+}|[^,\s]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    const imports = [];
    
    while ((match = importRegex.exec(content)) !== null) {
      const importedItems = match[1].replace(/[{}]/g, '').split(',').map(s => s.trim());
      imports.push({ items: importedItems, line: match[0] });
    }
    
    // فحص الاستخدام
    for (const imp of imports) {
      const allUnused = imp.items.every(item => {
        // تخطي الـ types
        if (item.startsWith('type ')) return false;
        
        // البحث عن الاستخدام
        const itemName = item.split(' as ')[0].trim();
        const usageRegex = new RegExp(`\\b${itemName}\\b`, 'g');
        const matches = content.match(usageRegex) || [];
        
        // إذا استخدم مرة واحدة فقط (في الـ import نفسه)
        return matches.length <= 1;
      });
      
      if (allUnused) {
        // إزالة السطر
        content = content.replace(imp.line + '\n', '');
        content = content.replace(imp.line, '');
      }
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
    
  } catch (error) {
    return false;
  }
}

// تنظيم الملفات
function organizeFiles() {
  log('\n📝 Organizing code in files...', 'info');
  
  let organized = 0;
  let cleaned = 0;
  
  try {
    const scanDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          if (!['node_modules', '.next', '.git', 'tmp'].includes(file)) {
            scanDir(filePath);
          }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          // تنظيم imports
          if (organizeImports(filePath)) {
            log(`   ✅ Organized imports: ${filePath}`, 'success');
            organized++;
          }
          
          // تنظيف التعليقات
          if (cleanComments(filePath)) {
            cleaned++;
          }
          
          // إزالة unused imports (اختياري)
          // removeUnusedImports(filePath);
        }
      }
    };
    
    scanDir('src');
    
    log(`\n   Organized ${organized} files`, 'info');
    log(`   Cleaned ${cleaned} files\n`, 'info');
    
    return { organized, cleaned };
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    return { organized, cleaned };
  }
}

// تنظيم exports
function organizeExports() {
  log('📤 Organizing exports...', 'info');
  
  let fixed = 0;
  
  try {
    const scanDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          if (!['node_modules', '.next', '.git', 'tmp'].includes(file)) {
            scanDir(filePath);
          }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          let content = fs.readFileSync(filePath, 'utf8');
          const original = content;
          
          // تجميع الـ exports في النهاية
          const exportLines = [];
          const otherLines = [];
          
          const lines = content.split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('export {') || 
                line.trim().startsWith('export type {')) {
              exportLines.push(line);
            } else {
              otherLines.push(line);
            }
          }
          
          if (exportLines.length > 0) {
            // إعادة ترتيب: الكود أولاً، ثم الـ exports
            const newContent = [...otherLines, '', ...exportLines].join('\n');
            
            if (newContent !== original) {
              fs.writeFileSync(filePath, newContent);
              log(`   ✅ Organized exports: ${filePath}`, 'success');
              fixed++;
            }
          }
        }
      }
    };
    
    scanDir('src');
    
    log(`\n   Fixed ${fixed} files\n`, 'info');
    return fixed;
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'error');
    return fixed;
  }
}

// تشغيل Prettier
function runPrettier() {
  log('🎨 Running Prettier...', 'info');
  
  try {
    execSync('npx prettier --write "src/**/*.{ts,tsx,js,jsx}"', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    log('   ✅ Prettier completed\n', 'success');
    return true;
  } catch (error) {
    log('   ⚠️  Prettier had some issues\n', 'warn');
    return false;
  }
}

// التقرير النهائي
function generateReport(results) {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('\n📊 Code Organization Report:\n', 'info');
  
  log(`   Files with organized imports: ${results.organized}`, 'info');
  log(`   Files cleaned: ${results.cleaned}`, 'info');
  log(`   Files with organized exports: ${results.exports}`, 'info');
  log(`   Prettier: ${results.prettier ? '✅' : '⚠️'}`, 'info');
  
  const total = results.organized + results.cleaned + results.exports;
  log(`\n   Total actions: ${total}`, 'info');
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
  
  // حفظ التقرير
  const report = {
    timestamp: new Date().toISOString(),
    results,
    total
  };
  
  fs.writeFileSync('tmp/organize-code-report.json', JSON.stringify(report, null, 2));
  log('📁 Report saved: tmp/organize-code-report.json\n', 'info');
}

// التشغيل الرئيسي
async function main() {
  const results = {
    organized: 0,
    cleaned: 0,
    exports: 0,
    prettier: false
  };
  
  try {
    // نسخة احتياطية
    if (!createBackup()) {
      log('❌ Backup failed, aborting...', 'error');
      process.exit(1);
    }
    
    // تنظيم الملفات
    const fileResults = organizeFiles();
    results.organized = fileResults.organized;
    results.cleaned = fileResults.cleaned;
    
    // تنظيم exports
    results.exports = organizeExports();
    
    // Prettier
    results.prettier = runPrettier();
    
    // التقرير
    generateReport(results);
    
    log('✅ Code organization complete!\n', 'success');
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
