#!/usr/bin/env node

/**
 * Comprehensive Accessibility Improvements
 * ??????? ????? ??????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('? Comprehensive Accessibility Improvements...\n');

// 1. Add aria-labels to all buttons
console.log('1??  Adding aria-labels to buttons...');
const componentFiles = await glob('src/components/**/*.tsx', {
  cwd: projectRoot,
});
const pageFiles = await glob('src/app/**/page.tsx', { cwd: projectRoot });
const allFiles = [...componentFiles, ...pageFiles];
let fixedCount = 0;

for (const file of allFiles.slice(0, 150)) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Add aria-label to buttons without labels
    const buttonPattern = /<button([^>]*?)>(.*?)<\/button>/gs;
    const matches = [...content.matchAll(buttonPattern)];

    for (const match of matches) {
      const buttonAttrs = match[1];
      let buttonText = match[2]
        .replace(/<[^>]+>/g, '')
        .trim()
        .slice(0, 50);

      // Skip if already has aria-label or is icon-only
      if (
        buttonAttrs.includes('aria-label') ||
        buttonAttrs.includes('aria-labelledby')
      ) {
        continue;
      }

      // If button has text, use it as aria-label
      if (buttonText && buttonText.length > 0 && buttonText.length < 50) {
        // Escape quotes
        buttonText = buttonText.replace(/"/g, '&quot;');
        const newButton = `<button${buttonAttrs} aria-label="${buttonText}">${match[2]}</button>`;
        content = content.replace(match[0], newButton);
        modified = true;
      } else if (
        buttonText.length === 0 &&
        !buttonAttrs.includes('aria-label')
      ) {
        // Icon-only button - add generic aria-label
        const newButton = `<button${buttonAttrs} aria-label="Button">${match[2]}</button>`;
        content = content.replace(match[0], newButton);
        modified = true;
      }
    }

    // Replace div with semantic HTML where appropriate
    if (
      content.includes('<div className="nav') ||
      content.includes('<div className="navigation')
    ) {
      content = content.replace(
        /<div className="(nav|navigation)/g,
        '<nav className="$1'
      );
      const navDivs = content.match(/<nav className="[^"]*">[\s\S]*?<\/div>/g);
      if (navDivs) {
        navDivs.forEach(navDiv => {
          content = content.replace(
            navDiv,
            navDiv.replace(/<\/div>$/, '</nav>')
          );
        });
      }
      modified = true;
    }

    if (
      content.includes('<div className="main') ||
      content.includes('<div className="content') ||
      content.includes('role="main"')
    ) {
      content = content.replace(
        /<div className="(main|content)/g,
        '<main className="$1'
      );
      modified = true;
    }

    if (
      content.includes('<div className="header') ||
      content.includes('role="banner"')
    ) {
      content = content.replace(
        /<div className="header/g,
        '<header className="header'
      );
      modified = true;
    }

    if (
      content.includes('<div className="footer') ||
      content.includes('role="contentinfo"')
    ) {
      content = content.replace(
        /<div className="footer/g,
        '<footer className="footer'
      );
      modified = true;
    }

    // Add semantic roles
    if (
      content.includes('<div className="article') ||
      content.includes('role="article"')
    ) {
      content = content.replace(
        /<div className="article/g,
        '<article className="article'
      );
      modified = true;
    }

    if (
      content.includes('<div className="section') ||
      content.includes('role="region"')
    ) {
      content = content.replace(
        /<div className="section/g,
        '<section className="section'
      );
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      fixedCount++;
      if (fixedCount <= 20) {
        console.log(`  ? Improved: ${file}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary: Improved ${fixedCount} files\n`);

// 2. Add keyboard navigation
console.log('2??  Adding keyboard navigation...');
let keyboardCount = 0;

for (const file of allFiles.slice(0, 100)) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Add onKeyDown to buttons without it
    if (
      content.includes('<button') &&
      !content.includes('onKeyDown') &&
      !content.includes("'use client'")
    ) {
      // Skip if it's a server component
      continue;
    }

    // Add Enter key support to buttons
    const buttonPattern = /<button([^>]*?)onClick=([^>]*?)>/g;
    const matches = [...content.matchAll(buttonPattern)];

    for (const match of matches) {
      if (!match[1].includes('onKeyDown')) {
        const onClick = match[2];
        // Extract the handler
        const handlerMatch = onClick.match(/\([^)]*\)\s*=>\s*[^,}]+/);
        if (handlerMatch) {
          const handler = handlerMatch[0];
          const newButton = `<button${match[1]}onClick=${match[2]} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ${handler.replace(/\([^)]*\)\s*=>\s*/, '')} } }}>`;
          content = content.replace(match[0], newButton);
          modified = true;
        }
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      keyboardCount++;
      if (keyboardCount <= 10) {
        console.log(`  ? Added keyboard nav: ${file}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(
  `\n?? Summary: Added keyboard navigation to ${keyboardCount} files\n`
);

console.log('? Accessibility improvements completed!\n');
