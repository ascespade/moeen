#!/usr/bin/env node

/**
 * Generate Project Tree
 * ????? ???? ??????? ????????
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const ignoreDirs = [
  'node_modules',
  '.next',
  '.git',
  '.archive',
  'coverage',
  'test-results',
  'playwright-report',
  'tmp',
  'temp',
  '.cache',
];

const ignoreFiles = [
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.tmp',
  '*.temp',
];

function shouldIgnore(name, isDir) {
  if (ignoreDirs.includes(name)) return true;
  if (!isDir && ignoreFiles.some(pattern => name.includes(pattern))) return true;
  if (name.startsWith('.')) return true;
  return false;
}

function generateTree(dir, prefix = '', isLast = true) {
  const items = readdirSync(dir)
    .filter(item => !shouldIgnore(item, statSync(join(dir, item)).isDirectory()))
    .sort();

  let tree = '';

  items.forEach((item, index) => {
    const path = join(dir, item);
    const isDir = statSync(path).isDirectory();
    const isLastItem = index === items.length - 1;
    const connector = isLastItem ? '??? ' : '??? ';
    const nextPrefix = isLastItem ? '    ' : '?   ';

    tree += prefix + connector + item + (isDir ? '/' : '') + '\n';

    if (isDir && !shouldIgnore(item, true)) {
      tree += generateTree(path, prefix + nextPrefix, isLastItem);
    }
  });

  return tree;
}

const tree = generateTree(projectRoot);
const fullTree = basename(projectRoot) + '/\n' + tree;

console.log('?? Project Tree Generated\n');
console.log(fullTree);

writeFileSync(join(projectRoot, 'PROJECT_TREE.txt'), fullTree);
console.log('\n? Tree saved to: PROJECT_TREE.txt\n');
