#!/usr/bin/env node

/**
 * Fix All Final Syntax Errors
 * ????? ???? ????? ??????? ????????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Final Syntax Errors...\n');

const allFiles = [...(await glob('src/**/*.{tsx,ts}', { cwd: projectRoot }))];

let stats = {
  inputclassName: 0,
  buttonclassName: 0,
  malformedOnChange: 0,
  malformedOnClick: 0,
  malformedOnKeyDown: 0,
  brokenJSX: 0,
  total: 0,
};

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix inputclassName -> input className
    if (content.includes('inputclassName')) {
      content = content.replace(/<inputclassName/g, '<input className');
      stats.inputclassName++;
      modified = true;
    }

    // Fix buttonclassName -> button className
    if (content.includes('buttonclassName')) {
      content = content.replace(/<buttonclassName/g, '<button className');
      stats.buttonclassName++;
      modified = true;
    }

    // Fix: onChange={e = aria-invalid="true"> handler}
    const malformedOnChangePattern =
      /onChange=\{e\s*=\s*aria-invalid=["']([^"']+)["']\s*>\s*([^}]+)\}/g;
    if (malformedOnChangePattern.test(content)) {
      content = content.replace(
        malformedOnChangePattern,
        (match, ariaInvalid, handler) => {
          // Extract setter from handler
          const setterMatch = handler.match(/set([^(]+)\(([^)]+)\)/);
          if (setterMatch) {
            const setter = setterMatch[1];
            const value = setterMatch[2];
            return `onChange={(e) => set${setter}(${value})}`;
          }
          // Try to extract from handler directly
          const handlerMatch = handler.match(/updateService\(([^)]+)\)/);
          if (handlerMatch) {
            return `onChange={(e) => ${handler.trim()}}`;
          }
          return `onChange={(e) => ${handler.trim()}}`;
        }
      );
      stats.malformedOnChange++;
      modified = true;
    }

    // Fix: onClick={() => { handler} aria-label="{...}"
    const malformedOnClickPattern =
      /onClick=\{\(\)\s*=>\s*\{([^}]+)\}\s*aria-label=["']([^"']+)["']/g;
    if (malformedOnClickPattern.test(content)) {
      content = content.replace(
        malformedOnClickPattern,
        (match, handler, ariaLabel) => {
          return `onClick={() => { ${handler.trim()} }} aria-label="${ariaLabel}"`;
        }
      );
      stats.malformedOnClick++;
      modified = true;
    }

    // Fix: onKeyDown={(e) = aria-label="{...}"> { handler }}
    const malformedOnKeyDownPattern =
      /onKeyDown=\{\(e\)\s*=\s*aria-label=["']([^"']+)["']\s*>\s*\{([^}]+)\}\}/g;
    if (malformedOnKeyDownPattern.test(content)) {
      content = content.replace(
        malformedOnKeyDownPattern,
        (match, ariaLabel, handler) => {
          return `onKeyDown={(e) => { ${handler.trim()} }}`;
        }
      );
      stats.malformedOnKeyDown++;
      modified = true;
    }

    // Fix: .map(<section=> -> .map((section) =>
    const malformedMapPattern = /\.map\(<(\w+)=>/g;
    if (malformedMapPattern.test(content)) {
      content = content.replace(malformedMapPattern, (match, varName) => {
        return `.map((${varName}) =>`;
      });
      stats.brokenJSX++;
      modified = true;
    }

    // Fix: standalone div/main/header/etc without opening <
    const standaloneTagPattern =
      /(return\s*\([^<]*?|\)\s*=>\s*\{[^<]*?|\.map\([^<]*?)(div|main|header|aside|section|footer|article|nav)\s+(?!className|id|role|aria|onClick|onKeyDown|onChange|key|ref)/g;
    if (standaloneTagPattern.test(content)) {
      content = content.replace(standaloneTagPattern, (match, before, tag) => {
        // Only fix if it's not already a proper tag
        if (!before.includes(`<${tag}`) && !before.includes(`</${tag}`)) {
          return `${before}<${tag}`;
        }
        return match;
      });
      stats.brokenJSX++;
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
console.log(`? Fixed inputclassName: ${stats.inputclassName} files`);
console.log(`? Fixed buttonclassName: ${stats.buttonclassName} files`);
console.log(`? Fixed malformed onChange: ${stats.malformedOnChange} files`);
console.log(`? Fixed malformed onClick: ${stats.malformedOnClick} files`);
console.log(`? Fixed malformed onKeyDown: ${stats.malformedOnKeyDown} files`);
console.log(`? Fixed broken JSX: ${stats.brokenJSX} files`);
console.log(`?? Total Files Fixed: ${stats.total}`);
console.log('='.repeat(70) + '\n');
