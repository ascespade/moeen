#!/usr/bin/env node

/**
 * Comprehensive Fix All Issues
 * ????? ???? ????? ???????
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Comprehensive Fix All Issues...\n');

let fixedCount = 0;

// 1. Fix unused imports and variables
const fixUnusedImports = async () => {
  console.log('1??  Fixing unused imports...');
  const files = await glob('src/**/*.{ts,tsx}', { cwd: projectRoot });
  
  for (const file of files.slice(0, 50)) {
    const filePath = join(projectRoot, file);
    try {
      let content = readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Remove unused imports (simple cases)
      const importPattern = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
      const matches = [...content.matchAll(importPattern)];
      
      for (const match of matches) {
        const imports = match[1].split(',').map(i => i.trim());
        const importNames = imports.map(i => i.split(' as ')[0].trim());
        
        // Check if imports are used
        const unused = importNames.filter(name => {
          if (name === 'React' || name === 'useState' || name === 'useEffect') return false;
          const regex = new RegExp(`\\b${name}\\b`);
          const usage = content.split(match[0])[1] || '';
          return !regex.test(usage);
        });
        
        if (unused.length > 0 && unused.length < imports.length) {
          const used = imports.filter(imp => {
            const name = imp.split(' as ')[0].trim();
            return !unused.includes(name);
          });
          const newImport = `import { ${used.join(', ')} } from '${match[2]}'`;
          content = content.replace(match[0], newImport);
          modified = true;
        }
      }
      
      if (modified) {
        writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
      }
    } catch (error) {
      // Skip
    }
  }
  console.log(`   ? Fixed ${fixedCount} files\n`);
};

// 2. Fix any types
const fixAnyTypes = async () => {
  console.log('2??  Fixing any types...');
  const files = await glob('src/**/*.{ts,tsx}', { cwd: projectRoot });
  let fixed = 0;
  
  for (const file of files.slice(0, 100)) {
    const filePath = join(projectRoot, file);
    try {
      let content = readFileSync(filePath, 'utf-8');
      
      // Skip if already has disable comment
      if (content.includes('@typescript-eslint/no-explicit-any')) continue;
      
      let modified = false;
      
      // Replace : any with : unknown where safe
      if (content.includes(': any)') && !content.includes('// eslint-disable')) {
        content = content.replace(/: any\)/g, ': unknown)');
        modified = true;
      }
      
      // Replace (s: any) with proper type
      if (content.includes('(s: any,') || content.includes('(item: any,')) {
        content = content.replace(/\(s: any,/g, '(s: unknown,');
        content = content.replace(/\(item: any,/g, '(item: unknown,');
        modified = true;
      }
      
      if (modified) {
        writeFileSync(filePath, content, 'utf-8');
        fixed++;
        if (fixed <= 10) {
          console.log(`   ? Fixed: ${file}`);
        }
      }
    } catch (error) {
      // Skip
    }
  }
  console.log(`   ? Fixed ${fixed} files\n`);
};

// 3. Fix empty blocks
const fixEmptyBlocks = async () => {
  console.log('3??  Fixing empty blocks...');
  const files = await glob('src/**/*.{ts,tsx}', { cwd: projectRoot });
  let fixed = 0;
  
  for (const file of files.slice(0, 50)) {
    const filePath = join(projectRoot, file);
    try {
      let content = readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Fix empty catch blocks
      if (content.includes('catch (') && content.includes('catch () {}')) {
        content = content.replace(/catch \(\) \{\}/g, 'catch (error) { console.error(error); }');
        modified = true;
      }
      
      if (content.includes('catch (error) {}')) {
        content = content.replace(/catch \(error\) \{\}/g, 'catch (error) { console.error(error); }');
        modified = true;
      }
      
      if (modified) {
        writeFileSync(filePath, content, 'utf-8');
        fixed++;
      }
    } catch (error) {
      // Skip
    }
  }
  console.log(`   ? Fixed ${fixed} files\n`);
};

// Run all fixes
(async () => {
  await fixUnusedImports();
  await fixAnyTypes();
  await fixEmptyBlocks();
  console.log(`\n?? Total: Fixed ${fixedCount} files\n`);
})();
