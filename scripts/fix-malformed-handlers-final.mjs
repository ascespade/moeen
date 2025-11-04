#!/usr/bin/env node

/**
 * Fix All Malformed Handlers (onChange/onClick with aria-label in wrong place)
 * ????? ???? ??? handlers ???????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Malformed Handlers...\n');

const allFiles = [
  ...await glob('src/**/*.{tsx,ts}', { cwd: projectRoot }),
];

let stats = {
  onChange: 0,
  onClick: 0,
  onKeyDown: 0,
  total: 0,
};

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix: onChange={e = aria-label="..." aria-invalid="true"> handler}
    // To: onChange={(e) => handler} aria-label="..." aria-invalid="true"
    const malformedOnChangePattern = /onChange=\{e\s*=\s*aria-label=["']([^"']+)["'](?:\s+aria-invalid=["']([^"']+)["'])?\s*>\s*([^}]+)\}/g;
    if (malformedOnChangePattern.test(content)) {
      content = content.replace(malformedOnChangePattern, (match, ariaLabel, ariaInvalid, handler) => {
        let result = `onChange={(e) => ${handler.trim()}} aria-label="${ariaLabel}"`;
        if (ariaInvalid) {
          result += ` aria-invalid="${ariaInvalid}"`;
        }
        return result;
      });
      stats.onChange++;
      modified = true;
    }

    // Fix: onClick={() => { handler} aria-label="{...}"
    // To: onClick={() => { handler}} aria-label="..."
    const malformedOnClickPattern = /onClick=\{\(\)\s*=>\s*\{([^}]+)\}\s*aria-label=["']([^"']+)["']/g;
    if (malformedOnClickPattern.test(content)) {
      content = content.replace(malformedOnClickPattern, (match, handler, ariaLabel) => {
        return `onClick={() => { ${handler.trim()} }} aria-label="${ariaLabel}"`;
      });
      stats.onClick++;
      modified = true;
    }

    // Fix: onKeyDown={(e) = aria-label="..."> { handler }}
    // To: onKeyDown={(e) => { handler }}
    const malformedOnKeyDownPattern = /onKeyDown=\{\(e\)\s*=\s*aria-label=["']([^"']+)["']\s*>\s*\{([^}]+)\}\}/g;
    if (malformedOnKeyDownPattern.test(content)) {
      content = content.replace(malformedOnKeyDownPattern, (match, ariaLabel, handler) => {
        return `onKeyDown={(e) => { ${handler.trim()} }}`;
      });
      stats.onKeyDown++;
      modified = true;
    }

    // Fix: onClick={async () aria-label="..." { handler }}
    // To: onClick={async () => { handler }} aria-label="..."
    const malformedAsyncOnClickPattern = /onClick=\{async\s+\(\)\s+aria-label=["']([^"']+)["']\s+([^}]+)\}/g;
    if (malformedAsyncOnClickPattern.test(content)) {
      content = content.replace(malformedAsyncOnClickPattern, (match, ariaLabel, handler) => {
        return `onClick={async () => { ${handler.trim()} }} aria-label="${ariaLabel}"`;
      });
      stats.onClick++;
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      if (stats.total < 50) {
        console.log(`  ? Fixed: ${file}`);
      }
      stats.total++;
    }
  } catch (error) {
    // Skip
  }
}

console.log('\n' + '='.repeat(70));
console.log('?? Fix Summary');
console.log('='.repeat(70));
console.log(`? Fixed malformed onChange: ${stats.onChange} files`);
console.log(`? Fixed malformed onClick: ${stats.onClick} files`);
console.log(`? Fixed malformed onKeyDown: ${stats.onKeyDown} files`);
console.log(`?? Total Files Fixed: ${stats.total}`);
console.log('='.repeat(70) + '\n');
