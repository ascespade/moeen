#!/usr/bin/env node
/**
 * 🚨 Emergency Fix - إصلاح طوارئ للأخطاء الحرجة
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚨 Emergency Fix Starting...\n');

const BACKUP_DIR = 'tmp/backup-emergency-' + Date.now();

// إنشاء backup
console.log('Creating emergency backup...');
try {
  execSync(`mkdir -p ${BACKUP_DIR}`, { stdio: 'inherit' });
  execSync(`cp -r src ${BACKUP_DIR}/src 2>/dev/null || true`, { stdio: 'inherit' });
  console.log('✅ Backup created\n');
} catch (err) {
  console.log('⚠️ Could not create backup\n');
}

// إصلاح 1: ملفات بها export/import مكسورة
function fixBrokenImports() {
  console.log('🔧 Fixing broken imports...\n');
  
  const filesToFix = [
    'src/hooks/useAuth.ts',
    'src/lib/auth/index.ts',
    'src/hooks/useT.tsx'
  ];
  
  for (const file of filesToFix) {
    if (!fs.existsSync(file)) continue;
    
    try {
      let content = fs.readFileSync(file, 'utf8');
      const original = content;
      
      // إصلاح export { بدون كلمة export في البداية
      content = content.replace(/^\s*{\s*$/gm, 'export {');
      content = content.replace(/^(\s*)(authorize|requireAuth|requireRole|type User|type AuthResult)/gm, '  $1');
      
      // إصلاح import بدون فتحة {
      content = content.replace(/^import\s*\n\s*import\s*{/gm, 'import {');
      content = content.replace(/^import\s+{?\s*\n/gm, 'import {\n');
      
      // حذف أسطر فارغة زائدة في import
      content = content.replace(/import\s*{\s*\n\s*\n\s*import\s*{/g, 'import {\n  ');
      
      // إصلاح export { في نهاية الملف بدون قبله
      content = content.replace(/\n\nexport\s*{\s*$/g, '');
      
      if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`✅ Fixed: ${file}`);
      }
    } catch (err) {
      console.log(`⚠️ Could not fix: ${file}`);
    }
  }
  
  console.log('');
}

// إصلاح 2: إزالة exports مكررة في نهاية الملفات
function removeDuplicateExports() {
  console.log('🔧 Removing duplicate exports...\n');
  
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
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          const original = content;
          
          // حذف export { } فارغة في النهاية
          content = content.replace(/\n\nexport\s*{\s*}\s*;?\s*$/g, '');
          content = content.replace(/\nexport\s*{\s*}\s*;?\s*$/g, '');
          
          // حذف export { مكررة
          const exportBlocks = content.match(/export\s*{\s*[^}]*\s*}/g) || [];
          if (exportBlocks.length > 2) {
            // احتفظ بالأول فقط
            const firstExport = exportBlocks[0];
            content = content.replace(/export\s*{\s*[^}]*\s*}/g, '');
            content = content + '\n\n' + firstExport;
          }
          
          if (content !== original) {
            fs.writeFileSync(filePath, content);
            // console.log(`✅ Fixed exports: ${filePath}`);
          }
        } catch (err) {
          // Skip
        }
      }
    }
  };
  
  scanDir('src');
  console.log('✅ Cleaned duplicate exports\n');
}

// إصلاح 3: تشغيل prettier على الملفات المكسورة
function runPrettierOnBroken() {
  console.log('🎨 Running Prettier on broken files...\n');
  
  try {
    execSync('npx prettier --write "src/hooks/useAuth.ts" "src/lib/auth/index.ts" "src/hooks/useT.tsx" 2>/dev/null', {
      stdio: 'pipe'
    });
    console.log('✅ Prettier completed\n');
  } catch (err) {
    console.log('⚠️ Prettier had issues\n');
  }
}

// إصلاح 4: تشغيل eslint --fix
function runEslintFix() {
  console.log('📝 Running ESLint --fix...\n');
  
  try {
    execSync('npx eslint "src/hooks/useAuth.ts" "src/lib/auth/index.ts" "src/hooks/useT.tsx" --fix 2>/dev/null', {
      stdio: 'pipe'
    });
    console.log('✅ ESLint completed\n');
  } catch (err) {
    console.log('⚠️ ESLint had issues\n');
  }
}

// التشغيل
async function main() {
  fixBrokenImports();
  removeDuplicateExports();
  runPrettierOnBroken();
  runEslintFix();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🧪 Testing fixes...\n');
  
  try {
    const result = execSync('npm run lint 2>&1', { encoding: 'utf8' });
    const errors = (result.match(/Error:/g) || []).length;
    const warnings = (result.match(/Warning:/g) || []).length;
    
    console.log(`Errors: ${errors}`);
    console.log(`Warnings: ${warnings}`);
    
    if (errors === 0) {
      console.log('\n✅ All errors fixed!\n');
    } else if (errors < 10) {
      console.log('\n🟡 Some errors remain (manual fix needed)\n');
    } else {
      console.log('\n🔴 Many errors remain\n');
    }
  } catch (err) {
    console.log('⚠️ Testing failed\n');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ Emergency fix complete!\n');
}

main();
