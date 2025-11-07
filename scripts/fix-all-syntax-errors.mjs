#!/usr/bin/env node

/**
 * Fix All Syntax Errors
 * ????? ???? ????? syntax
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Syntax Errors...\n');

const apiFiles = await glob('src/app/api/**/*.ts', { cwd: projectRoot });
let fixedCount = 0;
let errorCount = 0;

for (const file of apiFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix missing closing parenthesis in NextResponse.json calls
    // Pattern: NextResponse.json({ ... }, { status: ..., headers: { ... } };
    const patterns = [
      // Pattern 1: Missing closing paren before semicolon
      {
        regex:
          /NextResponse\.json\([^)]+\)\s*,\s*\{\s*status:\s*\d+[^}]*headers:\s*\{[^}]*\}\s*\}\s*;/g,
        fix: match => {
          if (!match.includes('});')) {
            return match.replace(/;\s*$/, '});');
          }
          return match;
        },
      },
      // Pattern 2: Missing closing paren in return statements
      {
        regex:
          /return\s+NextResponse\.json\([^)]+\),\s*\{\s*status:\s*\d+[^}]*\}\s*;/g,
        fix: match => {
          if (!match.includes('});')) {
            return match.replace(/;\s*$/, '});');
          }
          return match;
        },
      },
      // Pattern 3: Fix broken import statements
      {
        regex: /import\s+[^;]+}\s*from\s+['"]@\//g,
        fix: match => {
          if (!match.includes(';')) {
            return match + ';';
          }
          return match;
        },
      },
      // Pattern 4: Fix incomplete const declarations
      {
        regex: /const\s+\{[^}]*\}\s*=\s*await\s+authorize\([^)]*\)\s*$/gm,
        fix: match => {
          if (!match.includes(';')) {
            return match + ';';
          }
          return match;
        },
      },
    ];

    // Apply fixes
    for (const pattern of patterns) {
      const matches = content.match(pattern.regex);
      if (matches) {
        for (const match of matches) {
          const fixed = pattern.fix(match);
          if (fixed !== match) {
            content = content.replace(match, fixed);
            modified = true;
          }
        }
      }
    }

    // Manual fixes for specific patterns
    // Fix: } }; -> } });
    content = content.replace(/\}\s*\}\s*;/g, '} });');

    // Fix: headers: { ... } }; -> headers: { ... } });
    content = content.replace(/headers:\s*\{[^}]*\}\s*\}\s*;/g, match => {
      if (!match.includes('});')) {
        return match.replace(/;\s*$/, '});');
      }
      return match;
    });

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      console.log(`  ? Fixed: ${file}`);
    }
  } catch (error) {
    errorCount++;
    console.log(`  ? Error fixing ${file}: ${error.message}`);
  }
}

console.log(`\n?? Summary: Fixed ${fixedCount} files, ${errorCount} errors\n`);
