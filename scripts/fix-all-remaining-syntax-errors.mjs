#!/usr/bin/env node

/**
 * Fix All Remaining Syntax Errors
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

console.log('?? Fixing All Remaining Syntax Errors...\n');

const allFiles = [
  ...await glob('src/**/*.{tsx,ts}', { cwd: projectRoot }),
];

let stats = {
  buttonclassName: 0,
  buttonkey: 0,
  buttononClick: 0,
  inputtype: 0,
  buttontype: 0,
  total: 0,
};

for (const file of allFiles) {
  const filePath = join(projectRoot, file);
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix buttonclassName -> button className
    if (content.includes('buttonclassName')) {
      content = content.replace(/<buttonclassName/g, '<button className');
      stats.buttonclassName++;
      modified = true;
    }

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
console.log(`? Fixed buttonclassName: ${stats.buttonclassName} files`);
console.log(`? Fixed buttonkey: ${stats.buttonkey} files`);
console.log(`? Fixed buttononClick: ${stats.buttononClick} files`);
console.log(`? Fixed inputtype: ${stats.inputtype} files`);
console.log(`? Fixed buttontype: ${stats.buttontype} files`);
console.log(`?? Total Files Fixed: ${stats.total}`);
console.log('='.repeat(70) + '\n');
