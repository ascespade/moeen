#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n🔧 Fixing Remaining 5 Files...\n');

const BACKUP = 'tmp/backup-remaining-' + Date.now();
execSync(`mkdir -p ${BACKUP} && cp -r src ${BACKUP}/`, { stdio: 'pipe' });
console.log('✅ Backup\n');

const files = [
  'src/app/(admin)/admin/dashboard/page.tsx',
  'src/app/(admin)/admin/page.tsx',
  'src/app/(admin)/admin/roles/page.tsx',
  'src/app/(admin)/admin/therapists/schedules/page.tsx',
  'src/app/(admin)/admin/users/page.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Fix all interface definitions - ensure they have closing }
  content = content.replace(/(interface\s+\w+\s*{[^}]*)(interface\s+\w+)/g, '$1}\n\n$2');
  
  // Fix Role[] = [ pattern
  content = content.replace(/(const\s+\w+:\s*\w+\[\]\s*=\s*\[)/g, '$1\n  {');
  
  //Fix missing } before const
  content = content.replace(/(\w+:\s*[^;]+;)\s*\n\s*(const\s+\w+)/g, '$1\n}\n\n$2');
  
  // Fix JSX - wrap in fragment if needed
  if (content.includes('112:26')) { // users page specific
    content = content.replace(/(return\s*\(\s*<div)/g, 'return (\n    <>\n      $1');
    content = content.replace(/(\s*<\/div>\s*\);)/g, '$1\n    </>\n  );');
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`✅ ${file}`);
  }
}

console.log('\n✅ Done\n');

// Prettier
try {
  execSync('npx prettier --write "src/app/(admin)/admin/*.tsx" 2>/dev/null', { stdio: 'pipe' });
  console.log('✅ Prettier\n');
} catch (err) {}

// Build
try {
  execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
  console.log('✅ BUILD SUCCESS!\n');
  process.exit(0);
} catch (err) {
  console.log('⚠️  Build checking...\n');
  process.exit(1);
}
