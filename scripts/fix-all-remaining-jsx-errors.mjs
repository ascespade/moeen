#!/usr/bin/env node

/**
 * Fix All Remaining JSX Errors (broken HTML in TS code)
 * ????? ???? ????? JSX ???????? (HTML ????? ?? ??? TS)
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All Remaining JSX Errors...\n');

const allFiles = [
  ...await glob('src/**/*.{tsx,ts}', { cwd: projectRoot }),
];

let stats = {
  brokenHTML: 0,
  skipLinks: 0,
  liveRegions: 0,
  total: 0,
};

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix broken HTML inserted in TS code (not in return statement)
    // Pattern: return statement or function body with HTML not in JSX
    
    // Fix: <div aria-live=...> in middle of TS code (not in return)
    const brokenHTMLPattern = /(return\s+\([^<]*?|<div\s+aria-live=["']polite["']\s+aria-atomic=["']true["']\s+className=["']sr-only["']>[\s\S]*?<\/div>[\s\S]*?<a\s+href=["']#main-content["'][\s\S]*?<\/a>[\s\S]*?)(div|main|header|aside|section|footer|article|nav)\s*(?!className|id|role|aria|onClick|onKeyDown|onChange)/g;
    
    // More specific: Fix broken HTML between return and proper JSX
    const brokenReturnPattern = /return\s*\([^<]*?<div\s+aria-live=["']polite["']\s+aria-atomic=["']true["']\s+className=["']sr-only["']>[\s\S]*?<\/div>[\s\S]*?<a\s+href=["']#main-content["'][\s\S]*?<\/a>[\s\S]*?(div|main|header|aside|section|footer|article|nav)(?!\s*className)/g;
    
    if (brokenReturnPattern.test(content)) {
      // Remove broken HTML that was inserted in wrong place
      content = content.replace(
        /<div\s+aria-live=["']polite["']\s+aria-atomic=["']true["']\s+className=["']sr-only["']>[\s\S]*?<\/div>[\s\S]*?<a\s+href=["']#main-content["'][\s\S]*?<\/a>[\s\S]*?(div|main|header|aside|section|footer|article|nav)(?!\s*className)/g,
        (match, tag) => {
          // Keep only the tag
          return `<${tag}`;
        }
      );
      stats.brokenHTML++;
      modified = true;
    }

    // Fix: standalone div/main/header/etc without opening <
    const standaloneTagPattern = /(return\s*\([^<]*?|\)\s*=>\s*\{[^<]*?)(div|main|header|aside|section|footer|article|nav)\s+(?!className|id|role|aria|onClick|onKeyDown|onChange)/g;
    if (standaloneTagPattern.test(content)) {
      content = content.replace(standaloneTagPattern, (match, before, tag) => {
        return `${before}<${tag}`;
      });
      stats.brokenHTML++;
      modified = true;
    }

    // Fix: broken aria-label with question marks
    const brokenAriaLabelPattern = /aria-label=["']\?\?\?+["']/g;
    if (brokenAriaLabelPattern.test(content)) {
      // Try to infer proper label from context
      content = content.replace(brokenAriaLabelPattern, (match) => {
        // Check context
        const beforeMatch = content.substring(Math.max(0, content.indexOf(match) - 100), content.indexOf(match));
        const afterMatch = content.substring(content.indexOf(match) + match.length, Math.min(content.length, content.indexOf(match) + match.length + 100));
        
        let label = '????';
        if (beforeMatch.includes('button') || afterMatch.includes('button')) label = '??';
        else if (beforeMatch.includes('link') || afterMatch.includes('a href')) label = '????';
        else if (beforeMatch.includes('input') || afterMatch.includes('input')) label = '??? ?????';
        else if (beforeMatch.includes('search') || afterMatch.includes('search')) label = '???';
        
        return `aria-label="${label}"`;
      });
      stats.brokenHTML++;
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
console.log(`? Fixed broken HTML: ${stats.brokenHTML} files`);
console.log(`? Fixed skip links: ${stats.skipLinks} files`);
console.log(`? Fixed live regions: ${stats.liveRegions} files`);
console.log(`?? Total Files Fixed: ${stats.total}`);
console.log('='.repeat(70) + '\n');
