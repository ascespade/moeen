/**
 * Safe Cleanup Checker
 * يتحقق من الملفات قبل نقلها إلى quarantine
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// قائمة الملفات الحرجة التي لا يجب حذفها أبداً
const CRITICAL_FILES = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.cjs',
  '.gitignore',
  'README.md',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'STYLING_GUIDE.md',
];

// قائمة المجلدات الحرجة
const CRITICAL_DIRS = [
  'src/app',
  'src/components',
  'src/lib',
  'src/styles/design-system',
  'node_modules',
  '.git',
  '.next',
  'scripts',
  '_extracted',
];

export function checkBeforeMove(filePath) {
  try {
    // تحقق 1: هل الملف في القائمة الحرجة؟
    if (CRITICAL_FILES.some(cf => filePath.endsWith(cf))) {
      return { safe: false, reason: 'Critical file' };
    }
    
    // تحقق 2: هل الملف في مجلد حرج؟
    if (CRITICAL_DIRS.some(cd => filePath.includes(cd))) {
      return { safe: false, reason: 'In critical directory' };
    }
    
    // تحقق 3: هل الملف موجود؟
    if (!fs.existsSync(filePath)) {
      return { safe: false, reason: 'File does not exist' };
    }
    
    // تحقق 4: هل الملف مستخدم في الكود؟
    const isUsed = checkFileUsage(filePath);
    if (isUsed) {
      return { safe: false, reason: 'File is imported/used' };
    }
    
    // تحقق 5: هل الملف تم تعديله مؤخراً؟
    const stats = fs.statSync(filePath);
    const daysSinceModified = (Date.now() - stats.mtime) / (1000 * 60 * 60 * 24);
    if (daysSinceModified < 7) {
      return { safe: false, reason: 'Recently modified' };
    }
    
    return { safe: true, reason: 'Safe to move' };
  } catch (error) {
    return { safe: false, reason: `Error checking file: ${error.message}` };
  }
}

function checkFileUsage(filePath) {
  try {
    // فحص إذا كان الملف مستورد في أي ملف آخر
    const fileName = path.basename(filePath, path.extname(filePath));
    const searchPattern = `import.*${fileName}|require.*${fileName}|from.*${fileName}`;
    
    // البحث في ملفات TypeScript/JavaScript
    const result = execSync(`grep -r "${searchPattern}" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || true`, 
      { encoding: 'utf8', cwd: process.cwd() });
    
    return result.trim().length > 0;
  } catch (error) {
    // في حالة فشل البحث، نفترض أن الملف مستخدم (أمان إضافي)
    return true;
  }
}

export function createBackup(filePath) {
  const backupPath = path.join('_quarantine/backup', filePath);
  const backupDir = path.dirname(backupPath);
  
  // إنشاء المجلد إذا لم يكن موجوداً
  fs.mkdirSync(backupDir, { recursive: true });
  
  // نسخ الملف
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

export function moveToQuarantine(filePath, category) {
  const quarantinePath = path.join('_quarantine', category, filePath);
  const quarantineDir = path.dirname(quarantinePath);
  
  // إنشاء المجلد إذا لم يكن موجوداً
  fs.mkdirSync(quarantineDir, { recursive: true });
  
  // نقل الملف
  fs.renameSync(filePath, quarantinePath);
  return quarantinePath;
}
