#!/usr/bin/env node

/**
 * Fix All Headers Syntax Errors
 * ????? ???? ????? syntax ?? headers
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Headers Syntax Errors...\n');

const apiFiles = await glob('src/app/api/**/*.ts', { cwd: projectRoot });
let fixedCount = 0;

for (const file of apiFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix pattern: headers: { ... } };
    // Should be: headers: { ... } });
    const pattern1 = /headers:\s*\{[^}]*\}\s*\}\s*;/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, match => {
        if (!match.includes('});')) {
          return match.replace(/;\s*$/, '});');
        }
        return match;
      });
      modified = true;
    }

    // Fix pattern: { status: ..., headers: { ... } };
    // Should be: { status: ..., headers: { ... } });
    const pattern2 = /\{\s*status:\s*\d+[^}]*headers:\s*\{[^}]*\}\s*\}\s*;/g;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, match => {
        if (!match.includes('});')) {
          return match.replace(/;\s*$/, '});');
        }
        return match;
      });
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      console.log(`  ? Fixed: ${file}`);
    }
  } catch (error) {
    console.log(`  ??  Error fixing ${file}: ${error.message}`);
  }
}

console.log(`\n?? Summary: Fixed ${fixedCount} files\n`);
