#!/usr/bin/env node

/**
 * Fix Generated Tests - Add Supabase credentials validation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = path.join(__dirname, '..', 'tests', 'generated');

function fixTestFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file has the problematic pattern without the fix
  if (
    content.includes('const supabase = createClient(supabaseUrl, supabaseKey);')
  ) {
    if (!content.includes('if (!supabaseUrl || !supabaseKey) {')) {
      // Add the fix before the createClient line
      const insertFix = `if (!supabaseUrl || !supabaseKey) {
  test.skip('Supabase credentials not provided');
}

`;

      content = content.replace(
        'const supabase = createClient(supabaseUrl, supabaseKey);',
        `${insertFix}const supabase = createClient(supabaseUrl, supabaseKey);`
      );

      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function findTestFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findTestFiles(filePath));
    } else if (file.endsWith('.spec.ts')) {
      results.push(filePath);
    }
  });

  return results;
}

// Main execution
console.log('🔧 Fixing generated tests...\n');

const testFiles = findTestFiles(testDir);
let fixedCount = 0;
let skippedCount = 0;

testFiles.forEach(file => {
  if (fixTestFile(file)) {
    console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
    fixedCount++;
  } else {
    skippedCount++;
  }
});

console.log(
  `\n✨ Done! Fixed ${fixedCount} files, skipped ${skippedCount} files`
);
