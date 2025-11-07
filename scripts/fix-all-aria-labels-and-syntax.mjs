#!/usr/bin/env node

/**
 * Fix All ARIA Labels and Syntax Errors
 * ????? ???? ?????? ARIA ?????? ???????
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Fixing All ARIA Labels and Syntax Errors...\n');

const allFiles = [...(await glob('src/**/*.{tsx,ts}', { cwd: projectRoot }))];

let stats = {
  buttonkey: 0,
  buttononClick: 0,
  inputtype: 0,
  buttontype: 0,
  ariaLabelButton: 0,
  malformedOnChange: 0,
  total: 0,
};

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix buttonkey -> button key=
    if (content.includes('buttonkey=')) {
      content = content.replace(/<buttonkey=/g, '<button key=');
      stats.buttonkey++;
      modified = true;
    }

    // Fix buttononClick -> button onClick
    if (content.includes('buttononClick')) {
      content = content.replace(/<buttononClick/g, '<button onClick');
      stats.buttononClick++;
      modified = true;
    }

    // Fix inputtype -> input type
    if (content.includes('inputtype=')) {
      content = content.replace(/<inputtype=/g, '<input type=');
      stats.inputtype++;
      modified = true;
    }

    // Fix buttontype -> button type
    if (content.includes('buttontype=')) {
      content = content.replace(/<buttontype=/g, '<button type=');
      stats.buttontype++;
      modified = true;
    }

    // Fix aria-label="Button" with proper Arabic labels
    const ariaLabelButtonPattern = /aria-label=["']Button["']/g;
    if (ariaLabelButtonPattern.test(content)) {
      // Try to infer a better label from context
      content = content.replace(ariaLabelButtonPattern, (match, offset) => {
        // Get context around the match
        const before = content.substring(Math.max(0, offset - 100), offset);
        const after = content.substring(
          offset + match.length,
          Math.min(content.length, offset + match.length + 100)
        );

        // Try to find button text or onClick handler context
        let label = '??';

        // Check for onClick handler
        if (before.includes('onClick') || after.includes('onClick')) {
          const onClickMatch = (before + after).match(
            /onClick\s*[=:]\s*\([^)]*\)\s*=>\s*\{?\s*([^}]+)/
          );
          if (onClickMatch) {
            const handler = onClickMatch[1];
            if (handler.includes('delete') || handler.includes('???'))
              label = '???';
            else if (handler.includes('edit') || handler.includes('?????'))
              label = '?????';
            else if (handler.includes('save') || handler.includes('???'))
              label = '???';
            else if (handler.includes('submit') || handler.includes('?????'))
              label = '?????';
            else if (handler.includes('cancel') || handler.includes('?????'))
              label = '?????';
            else if (handler.includes('close') || handler.includes('?????'))
              label = '?????';
            else if (handler.includes('open') || handler.includes('???'))
              label = '???';
          }
        }

        // Check for button text content
        const buttonTextMatch = after.match(/>\s*([^<]+)/);
        if (buttonTextMatch) {
          const text = buttonTextMatch[1].trim().slice(0, 30);
          if (text && text.length > 0) {
            label = text;
          }
        }

        return `aria-label="${label}"`;
      });
      stats.ariaLabelButton++;
      modified = true;
    }

    // Fix malformed onChange: onChange={e = aria-label="..."> -> onChange={(e) => ...} aria-label="..."
    const malformedOnChangePattern =
      /onChange=\{e\s*=\s*aria-label=["']([^"']+)["']\s*>\s*([^}]+)\}/g;
    if (malformedOnChangePattern.test(content)) {
      content = content.replace(
        malformedOnChangePattern,
        (match, ariaLabel, handler) => {
          // Extract setter from handler
          const setterMatch = handler.match(/set([^(]+)\(([^)]+)\)/);
          if (setterMatch) {
            const setter = setterMatch[1];
            const value = setterMatch[2];
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
console.log(`? Fixed buttonkey: ${stats.buttonkey} files`);
console.log(`? Fixed buttononClick: ${stats.buttononClick} files`);
console.log(`? Fixed inputtype: ${stats.inputtype} files`);
console.log(`? Fixed buttontype: ${stats.buttontype} files`);
console.log(`? Fixed aria-label="Button": ${stats.ariaLabelButton} files`);
console.log(
  `? Fixed malformed onChange/onClick: ${stats.malformedOnChange} files`
);
console.log(`?? Total Files Fixed: ${stats.total}`);
console.log('='.repeat(70) + '\n');
