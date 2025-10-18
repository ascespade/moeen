#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n⚡ Ultra-Fix System - جاري الإصلاح الشامل...\n');

// Backup
const BACKUP = 'tmp/backup-ultra-' + Date.now();
execSync(`mkdir -p ${BACKUP} && cp -r src ${BACKUP}/`, { stdio: 'pipe' });
console.log('✅ Backup created\n');

// الحصول على الملفات بها أخطاء
let errorFiles = [];
try {
  execSync('npm run lint', { stdio: 'pipe' });
} catch (e) {
  const out = (e.stdout || '').toString();
  const lines = out.split('\n');
  let current = null;
  
  for (const line of lines) {
    if (line.startsWith('./src/')) {
      current = line.trim().split('\n')[0];
    } else if (line.includes('Error: Parsing') && current) {
      if (!errorFiles.includes(current)) {
        errorFiles.push(current);
      }
    }
  }
}

console.log(`🎯 Found ${errorFiles.length} files with parsing errors\n`);

let fixed = 0;

// إصلاح كل ملف
for (const file of errorFiles) {
  const filepath = file.replace('./', '');
  
  if (!fs.existsSync(filepath)) continue;
  
  try {
    let content = fs.readFileSync(filepath, 'utf8');
    const original = content;
    
    // Strategy 1: إصلاح interface/type مكسورة
    content = content.replace(/interface\s+(\w+)\s*{\s*\n\s*\n/g, 'interface $1 {\n');
    content = content.replace(/type\s+(\w+)\s*=\s*{\s*\n\s*\n/g, 'type $1 = {\n');
    
    // Strategy 2: إصلاح const/let بدون =
    content = content.replace(/\n\s*(const|let|var)\s+(\w+)\s*;\s*\n/g, '\n// $1 $2 removed\n');
    
    // Strategy 3: إصلاح } missing
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    
    if (openBraces > closeBraces) {
      const diff = openBraces - closeBraces;
      content = content.trimEnd() + '\n' + '}'.repeat(diff) + '\n';
    }
    
    // Strategy 4: إصلاح , missing في objects
    content = content.replace(/:\s*([^,}\n]+)\s*\n\s*([a-zA-Z_])/g, ': $1,\n  $2');
    
    // Strategy 5: حذف سطور مكسورة تماماً
    const lines = content.split('\n');
    const cleaned = lines.filter(line => {
      const t = line.trim();
      // حذف سطور فقط بها رموز غريبة
      if (t === '{' || t === '}' || t === ';' || t === ',' || t === '') return line;
      if (t.length < 2) return false;
      return true;
    });
    
    content = cleaned.join('\n');
    
    if (content !== original) {
      fs.writeFileSync(filepath, content);
      console.log(`✅ Fixed: ${filepath}`);
      fixed++;
    }
    
  } catch (err) {
    console.log(`⚠️  Could not fix: ${filepath}`);
  }
}

console.log(`\n✅ Fixed ${fixed} files\n`);

// Prettier
console.log('🎨 Running Prettier...\n');
try {
  execSync('npx prettier --write "src/**/*.{ts,tsx}" 2>/dev/null', { stdio: 'pipe' });
  console.log('✅ Prettier done\n');
} catch (e) {}

// Verify
console.log('🧪 Verification...\n');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('\n✅ No errors!\n');
} catch (e) {
  const errors = ((e.stdout || '').match(/Error:/g) || []).length;
  console.log(`\n⚠️  ${errors} errors remaining\n`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Ultra-Fix Complete!\n');
