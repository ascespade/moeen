#!/usr/bin/env node

/**
 * Fix All Syntax Errors from Accessibility Scripts
 * ????? ???? ????? ??????? ?? ???????? ??????? ??????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Syntax Errors...\n');

const allFiles = [...(await glob('src/**/*.{tsx,ts}', { cwd: projectRoot }))];

let stats = {
  inputtype: 0,
  buttononClick: 0,
  malformedOnChange: 0,
  malformedOnKeyDown: 0,
  brokenJSX: 0,
  total: 0,
};

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix <inputtype='...' -> <input type='...'
    if (content.includes('inputtype=')) {
      content = content.replace(/<inputtype=/g, '<input type=');
      stats.inputtype++;
      modified = true;
    }

    // Fix <buttontype='...' -> <button type='...'
    if (content.includes('buttontype=')) {
      content = content.replace(/<buttontype=/g, '<button type=');
      stats.buttononClick++;
      modified = true;
    }

    // Fix malformed onChange handlers: onChange={e = aria-label="..."> -> onChange={(e) => ...}
    const malformedOnChangePattern =
      /onChange=\{e\s*=\s*aria-label=["']([^"']+)["']\s*>\s*([^}]+)\}/g;
    if (malformedOnChangePattern.test(content)) {
      content = content.replace(
        malformedOnChangePattern,
        (match, ariaLabel, handler) => {
          // Extract the actual handler logic
          const handlerMatch = handler.match(/set([^(]+)\(([^)]+)\)/);
          if (handlerMatch) {
            const setter = handlerMatch[1];
            const value = handlerMatch[2];
            return `onChange={(e) => set${setter}(${value})} aria-label="${ariaLabel}"`;
          }
          return `onChange={(e) => ${handler}} aria-label="${ariaLabel}"`;
        }
      );
      stats.malformedOnChange++;
      modified = true;
    }

    // Fix malformed onClick in button: onClick={() = aria-label="Button"> -> onClick={() => ...} aria-label="..."
    const malformedOnClickPattern =
      /onClick=\{\(\)\s*=\s*aria-label=["']([^"']+)["']\s*>\s*([^}]+)\}/g;
    if (malformedOnClickPattern.test(content)) {
      content = content.replace(
        malformedOnClickPattern,
        (match, ariaLabel, handler) => {
          return `onClick={() => ${handler}} aria-label="${ariaLabel}"`;
        }
      );
      stats.malformedOnChange++;
      modified = true;
    }

    // Fix broken JSX where content was inserted between < and tag name
    // Pattern: <\n\n<div...> or <\n\n<Badge...>
    const brokenJSXPattern = /<\s*\n\s*\n\s*<([a-zA-Z][a-zA-Z0-9]*)/g;
    if (brokenJSXPattern.test(content)) {
      content = content.replace(brokenJSXPattern, '<$1');
      stats.brokenJSX++;
      modified = true;
    }

    // Fix duplicate onKeyDown handlers that were incorrectly inserted
    const duplicateOnKeyDownPattern =
      /onKeyDown=\{\(e\)\s*=>\s*\{[^}]*\}\s*\}\s*onKeyDown=\{\(e\)\s*=>\s*\{[^}]*\}\s*\}/g;
    if (duplicateOnKeyDownPattern.test(content)) {
      content = content.replace(duplicateOnKeyDownPattern, match => {
        // Keep only the first one
        const firstMatch = match.match(/onKeyDown=\{\(e\)\s*=>\s*\{[^}]+\}\}/);
        return firstMatch ? firstMatch[0] : match;
      });
      stats.malformedOnKeyDown++;
      modified = true;
    }

    // Remove aria-label that was incorrectly inserted in the middle of handlers
    // Pattern: ... aria-label="..." > handler
    const ariaInHandlerPattern =
      /(\w+)\s*aria-label=["']([^"']+)["']\s*>\s*([^<]+)/g;
    if (ariaInHandlerPattern.test(content)) {
      content = content.replace(
        ariaInHandlerPattern,
        (match, before, ariaLabel, after) => {
          // Only fix if it looks like it's in the wrong place
          if (after.includes('set') || after.includes('=>')) {
            return `${before}>${after}`;
          }
          return match;
        }
      );
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      if (stats.total < 50) {
        console.log(`  ? Fixed syntax errors: ${file}`);
      }
      stats.total++;
    }
  } catch (error) {
    // Skip
  }
}

console.log('\n' + '='.repeat(70));
console.log('?? Syntax Error Fix Summary');
console.log('='.repeat(70));
console.log(`? Fixed inputtype: ${stats.inputtype} files`);
console.log(`? Fixed buttontype: ${stats.buttononClick} files`);
console.log(`? Fixed malformed onChange: ${stats.malformedOnChange} files`);
console.log(`? Fixed malformed onKeyDown: ${stats.malformedOnKeyDown} files`);
console.log(`? Fixed broken JSX: ${stats.brokenJSX} files`);
console.log(`?? Total Files Fixed: ${stats.total}`);
console.log('='.repeat(70) + '\n');
