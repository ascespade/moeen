#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const fixes = [
  {
    name: 'Fix Badge destructive variant',
    pattern: /(variant\s*:\s*statusColorMap\[.*?\].*?destructive)/g,
    files: ['src/app/**/*.tsx'],
    action: (content) => {
      // Replace color maps that include 'destructive' with 'error'
      return content.replace(/statusColorMap\s*=\s*{([^}]+)}/gs, (match) => {
        return match.replace(/'destructive'/g, "'error'");
      });
    }
  },
  {
    name: 'Fix priority color maps',
    files: ['src/app/**/*.tsx'],
    action: (content) => {
      return content.replace(/priorityColorMap\s*=\s*{([^}]+)}/gs, (match) => {
        return match.replace(/'destructive'/g, "'error'");
      });
    }
  }
];

function walkDir(dir, callback) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath, callback);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

let totalFixed = 0;

console.log('🔧 Starting self-healing type fixes...\n');

walkDir('./src/app', (filePath) => {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Fix destructive variant in colorMaps
    if (content.includes('statusColorMap') || content.includes('priorityColorMap')) {
      const newContent = content
        .replace(/(\w+ColorMap\s*=\s*{[^}]*)'destructive'([^}]*})/g, "$1'error'$2");
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Fixed: ${filePath}`);
      totalFixed++;
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✨ Fixed ${totalFixed} files`);
