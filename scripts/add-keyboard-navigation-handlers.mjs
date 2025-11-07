#!/usr/bin/env node

/**
 * Add Keyboard Navigation Handlers
 * ????? ??????? ?????? ?????????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('??  Adding Keyboard Navigation Handlers...\n');

const componentFiles = await glob('src/components/**/*.tsx', {
  cwd: projectRoot,
});
let fixedCount = 0;

for (const file of componentFiles.slice(0, 100)) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');

    // Skip server components
    if (!content.includes("'use client'")) continue;

    let modified = false;

    // Add onKeyDown to buttons with onClick
    const buttonPattern = /<button([^>]*?)onClick=\{([^}]+)\}([^>]*?)>/g;
    const matches = [...content.matchAll(buttonPattern)];

    for (const match of matches) {
      const attrs = match[1] + match[3];
      const onClickHandler = match[2];

      // Skip if already has onKeyDown
      if (attrs.includes('onKeyDown')) continue;

      // Create keyboard handler
      const keyboardHandler = ` onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ${onClickHandler.replace(/\([^)]*\)\s*=>\s*/, '() => ')} } }}`;

      const newButton = `<button${match[1]}onClick={${onClickHandler}}${keyboardHandler}${match[3]}>`;
      content = content.replace(match[0], newButton);
      modified = true;
    }

    // Add tabIndex to divs with onClick
    const divPattern = /<div([^>]*?)onClick=\{([^}]+)\}([^>]*?)>/g;
    const divMatches = [...content.matchAll(divPattern)];

    for (const match of divMatches) {
      const attrs = match[1] + match[3];

      // Skip if already has tabIndex
      if (attrs.includes('tabIndex')) continue;

      const newDiv = `<div${match[1]}tabIndex={0} onClick={${match[2]}}${match[3]}>`;
      content = content.replace(match[0], newDiv);
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      if (fixedCount <= 20) {
        console.log(`  ? Added keyboard handlers: ${file}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary: Added keyboard handlers to ${fixedCount} files\n`);
