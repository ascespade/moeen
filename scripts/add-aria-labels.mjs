#!/usr/bin/env node

/**
 * Add aria-labels to all buttons
 * ????? aria-labels ????? ???????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('? Adding aria-labels...\n');

const componentFiles = await glob('src/components/**/*.tsx', { cwd: projectRoot });
let fixedCount = 0;

for (const file of componentFiles.slice(0, 100)) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Add aria-label to buttons without labels
    const buttonPattern = /<button([^>]*)>(.*?)<\/button>/gs;
    const matches = [...content.matchAll(buttonPattern)];
    
    for (const match of matches) {
      const buttonAttrs = match[1];
      const buttonText = match[2].trim().replace(/<[^>]+>/g, '').slice(0, 50);
      
      if (!buttonAttrs.includes('aria-label') && buttonText && buttonText.length > 0 && buttonText.length < 50) {
        const newButton = `<button${buttonAttrs} aria-label="${buttonText}">${match[2]}</button>`;
        content = content.replace(match[0], newButton);
        modified = true;
      }
    }

    // Replace div with semantic HTML where appropriate
    if (content.includes('<div className="nav') || content.includes('<div className="navigation')) {
      content = content.replace(/<div className="(nav|navigation)/g, '<nav className="$1');
      content = content.replace(/<\/div>\s*<!-- navigation -->/g, '</nav>');
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      if (fixedCount <= 10) {
        console.log(`  ? Improved: ${file}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary: Improved ${fixedCount} components\n`);
