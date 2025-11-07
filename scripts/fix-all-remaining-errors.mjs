#!/usr/bin/env node

/**
 * Fix All Remaining Errors
 * ????? ???? ??????? ????????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Remaining Errors...\n');

const apiFiles = await glob('src/app/api/**/*.ts', { cwd: projectRoot });
let fixedCount = 0;

for (const file of apiFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix: });); -> });
    if (content.includes('}););')) {
      content = content.replace(/}\);\);/g, '});');
      modified = true;
    }

    // Fix: }}); -> });
    if (content.includes('}});')) {
      content = content.replace(/\}\}\);\);/g, '});');
      modified = true;
    }

    // Fix: headers: { ... } }}); -> headers: { ... } });
    const headerPattern = /headers:\s*\{[^}]*\}\s*\}\}\);\);/g;
    if (headerPattern.test(content)) {
      content = content.replace(headerPattern, match => {
        return match.replace(/}\);\);/g, '});');
      });
      modified = true;
    }

    // Fix: missing closing paren in NextResponse.json with headers
    const nextResponsePattern =
      /NextResponse\.json\([^)]+\)\s*,\s*\{\s*status:\s*\d+[^}]*headers:\s*\{[^}]*\}\s*\}\s*\);\);/g;
    if (nextResponsePattern.test(content)) {
      content = content.replace(nextResponsePattern, match => {
        return match.replace(/}\);\);/g, '});');
      });
      modified = true;
    }

    // Fix: broken import statements
    const brokenImportPattern = /import\s+[^;]+}\s*from\s+['"]@\/[^;]*$/gm;
    if (brokenImportPattern.test(content)) {
      content = content.replace(brokenImportPattern, match => {
        if (!match.includes(';')) {
          return match + ';';
        }
        return match;
      });
      modified = true;
    }

    // Fix: incomplete const declarations
    const incompleteConstPattern =
      /const\s+\{[^}]*\}\s*=\s*await\s+authorize\([^)]*\)\s*$/gm;
    if (incompleteConstPattern.test(content)) {
      content = content.replace(incompleteConstPattern, match => {
        if (!match.includes(';')) {
          return match + ';';
        }
        return match;
      });
      modified = true;
    }

    // Fix: duplicate code blocks (like " = await authorize(request);" after authorization)
    const duplicateAuthPattern =
      /const\s+\{[^}]*\}\s*=\s*await\s+authorize\([^)]*\);\s*[\s\S]*?=\s*await\s+authorize\([^)]*\);/g;
    if (duplicateAuthPattern.test(content)) {
      // Remove duplicate authorization calls
      const lines = content.split('\n');
      let lastAuthLine = -1;
      const cleanedLines = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('await authorize(request)')) {
          if (lastAuthLine >= 0 && i - lastAuthLine < 10) {
            // Skip duplicate
            continue;
          }
          lastAuthLine = i;
        }
        cleanedLines.push(lines[i]);
      }

      content = cleanedLines.join('\n');
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

// Run build to check
console.log('?? Checking build...\n');
try {
  execSync('npm run build', {
    cwd: projectRoot,
    stdio: 'pipe',
    timeout: 300000,
  });
  console.log('? Build passed!\n');
} catch (error) {
  console.log('??  Build still has errors. Please review.\n');
}
