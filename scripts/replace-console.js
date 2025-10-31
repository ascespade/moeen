#!/usr/bin/env node
/**
 * Safe search-and-replace: replace console.* with logger.*
 * Preserves all arguments and formatting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'glob';
const { glob } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = process.cwd() || __dirname.replace('/scripts', '');
const patterns = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
];

// Exclude patterns
const excludePatterns = [
  'node_modules/**',
  '.next/**',
  'dist/**',
  'build/**',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/test/**',
  '**/tests/**',
];

// Console methods to replace
const consoleMethods = ['log', 'info', 'warn', 'error', 'debug'];

let totalReplacements = 0;
let filesModified = 0;

async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    // Check if file already imports logger
    const hasLoggerImport =
      content.includes("from '@/lib/logger'") ||
      content.includes("from '../lib/logger'") ||
      content.includes("from '../../lib/logger'") ||
      content.includes("import { logger }");

    // Replace console.* with logger.*
    consoleMethods.forEach((method) => {
      const regex = new RegExp(
        `console\\.${method}\\s*\\(`,
        'g'
      );
      const matches = content.match(regex);
      if (matches) {
        fileReplacements += matches.length;
        content = content.replace(regex, `logger.${method}(`);
        modified = true;
      }
    });

    // Add logger import if needed and file was modified
    if (modified && !hasLoggerImport) {
      // Determine relative path to logger
      const relativePath = path.relative(
        path.dirname(filePath),
        path.join(root, 'src', 'lib', 'logger')
      );
      const importPath =
        relativePath.startsWith('.') || relativePath.startsWith('..')
          ? relativePath.replace(/\\/g, '/').replace(/\.ts$/, '')
          : `@/lib/logger`;

      // Add import at the top (after existing imports if any)
      const importStatement = `import { logger } from '${importPath}';\n`;
      
      // Try to insert after last import statement
      const importRegex = /(import\s+.*?from\s+['"][^'"]+['"];?\s*\n)/g;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        // Find position of last import
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        content =
          content.slice(0, insertIndex) +
          importStatement +
          content.slice(insertIndex);
      } else {
        // No imports found, add at the top
        content = importStatement + content;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      totalReplacements += fileReplacements;
      console.log(
        `✓ ${filePath.replace(root + '/', '')} (${fileReplacements} replacements)`
      );
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔍 Searching for console.* statements...\n');

  for (const pattern of patterns) {
    try {
      const result = await glob(pattern, {
        cwd: root,
        ignore: excludePatterns,
        absolute: true,
      });
      
      const files = Array.isArray(result) ? result : [];
      
      for (const file of files) {
        await processFile(file);
      }
    } catch (error) {
      console.error(`Error processing pattern ${pattern}:`, error.message);
    }
  }

  console.log(`\n✅ Complete: ${totalReplacements} replacements in ${filesModified} files`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
