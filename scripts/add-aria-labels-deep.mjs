#!/usr/bin/env node

/**
 * Deep Aria-Labels Addition
 * ????? aria-labels ???? ????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('? Deep Aria-Labels Addition...\n');

const allFiles = [
  ...(await glob('src/components/**/*.tsx', { cwd: projectRoot })),
  ...(await glob('src/app/**/page.tsx', { cwd: projectRoot })),
];

let totalButtons = 0;
let buttonsWithAria = 0;
let fixedCount = 0;

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Find all buttons
    const buttonPattern = /<button([^>]*?)>(.*?)<\/button>/gs;
    const matches = [...content.matchAll(buttonPattern)];

    for (const match of matches) {
      totalButtons++;
      const attrs = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();

      if (attrs.includes('aria-label') || attrs.includes('aria-labelledby')) {
        buttonsWithAria++;
        continue;
      }

      // Generate aria-label
      let ariaLabel = '';
      if (text && text.length > 0 && text.length < 50) {
        ariaLabel = text.replace(/"/g, '&quot;');
      } else {
        // Try to find icon or image alt
        const iconMatch = text.match(/<[^>]+(?:Icon|icon|Image|img)[^>]*>/);
        if (iconMatch) {
          const altMatch = iconMatch[0].match(/alt=["']([^"']+)["']/);
          if (altMatch) {
            ariaLabel = altMatch[1];
          } else {
            ariaLabel = 'Button';
          }
        } else {
          ariaLabel = 'Button';
        }
      }

      // Add aria-label
      const newAttrs = attrs.trim() + ` aria-label="${ariaLabel}"`;
      const newButton = `<button${newAttrs}>${match[2]}</button>`;
      content = content.replace(match[0], newButton);
      buttonsWithAria++;
      modified = true;
    }

    // Replace div with semantic HTML
    const semanticReplacements = [
      { pattern: /<div className="nav/i, replacement: '<nav className="nav' },
      {
        pattern: /<div className="main/i,
        replacement: '<main className="main',
      },
      {
        pattern: /<div className="header/i,
        replacement: '<header className="header',
      },
      {
        pattern: /<div className="footer/i,
        replacement: '<footer className="footer',
      },
      {
        pattern: /<div className="article/i,
        replacement: '<article className="article',
      },
      {
        pattern: /<div className="section/i,
        replacement: '<section className="section',
      },
    ];

    for (const { pattern, replacement } of semanticReplacements) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }

    // Fix closing tags for semantic HTML
    const semanticPairs = [
      { open: '<nav', close: '</nav>' },
      { open: '<main', close: '</main>' },
      { open: '<header', close: '</header>' },
      { open: '<footer', close: '</footer>' },
      { open: '<article', close: '</article>' },
      { open: '<section', close: '</section>' },
    ];

    for (const { open, close } of semanticPairs) {
      const openPattern = new RegExp(open.replace(/[<>]/g, ''), 'i');
      if (openPattern.test(content)) {
        // Find matching closing div and replace with semantic tag
        const lines = content.split('\n');
        let depth = 0;
        let foundOpen = false;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(open)) {
            foundOpen = true;
            depth = 1;
            // Find matching closing div
            for (let j = i + 1; j < lines.length; j++) {
              if (lines[j].includes(open)) depth++;
              if (lines[j].includes('</div>')) {
                depth--;
                if (depth === 0 && foundOpen) {
                  lines[j] = lines[j].replace('</div>', close);
                  break;
                }
              }
            }
          }
        }

        if (foundOpen) {
          content = lines.join('\n');
          modified = true;
        }
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      if (fixedCount <= 30) {
        console.log(`  ? Fixed: ${file}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary:`);
console.log(`   Total buttons found: ${totalButtons}`);
console.log(
  `   Buttons with aria-label: ${buttonsWithAria} (${totalButtons > 0 ? ((buttonsWithAria / totalButtons) * 100).toFixed(1) : 0}%)`
);
console.log(`   Files improved: ${fixedCount}\n`);
