/**
 * Auto-Fix Design System Violations
 * إصلاح تلقائي لمخالفات نظام التصميم
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { autoFixCSSClasses, validateCSSClasses } from './validator';

const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const IGNORE_DIRS = ['node_modules', '.next', 'dist', 'build', '.git'];

/**
 * Recursively find all component files
 */
function findComponentFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);

    // Skip ignored directories
    if (IGNORE_DIRS.some(ignore => filePath.includes(ignore))) {
      return;
    }

    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      findComponentFiles(filePath, fileList);
    } else if (EXTENSIONS.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Auto-fix CSS classes in a file
 */
function fixFile(filePath: string): { fixed: boolean; changes: number } {
  try {
    const content = readFileSync(filePath, 'utf-8');
    let newContent = content;
    let changes = 0;

    // Fix className attributes
    const classNameRegex = /className\s*=\s*["']([^"']+)["']/g;
    const matches = [...content.matchAll(classNameRegex)];

    for (const match of matches) {
      const originalClasses = match[1];
      const fixedClasses = autoFixCSSClasses(originalClasses);

      if (originalClasses !== fixedClasses) {
        newContent = newContent.replace(
          `className="${originalClasses}"`,
          `className="${fixedClasses}"`
        );
        changes++;
      }
    }

    // Fix template literal className
    const templateRegex = /className\s*=\s*\{`([^`]+)`\}/g;
    const templateMatches = [...content.matchAll(templateRegex)];

    for (const match of templateMatches) {
      const originalClasses = match[1];
      const fixedClasses = autoFixCSSClasses(originalClasses);

      if (originalClasses !== fixedClasses) {
        newContent = newContent.replace(
          `className={\`${originalClasses}\`}`,
          `className={\`${fixedClasses}\`}`
        );
        changes++;
      }
    }

    if (changes > 0) {
      writeFileSync(filePath, newContent, 'utf-8');
      return { fixed: true, changes };
    }

    return { fixed: false, changes: 0 };
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error);
    return { fixed: false, changes: 0 };
  }
}

/**
 * Run auto-fix on all component files
 */
export function runAutoFix(srcDir: string = 'src'): {
  totalFiles: number;
  fixedFiles: number;
  totalChanges: number;
  errors: string[];
} {
  const files = findComponentFiles(srcDir);
  const errors: string[] = [];
  let fixedFiles = 0;
  let totalChanges = 0;

  files.forEach(file => {
    try {
      const result = fixFile(file);
      if (result.fixed) {
        fixedFiles++;
        totalChanges += result.changes;
        console.log(`✅ Fixed: ${file} (${result.changes} changes)`);
      }
    } catch (error: any) {
      errors.push(`${file}: ${error.message}`);
    }
  });

  return {
    totalFiles: files.length,
    fixedFiles,
    totalChanges,
    errors,
  };
}

// Run if called directly
if (require.main === module) {
  const result = runAutoFix();
  console.log('\n📊 Auto-Fix Summary:');
  console.log(`Total files: ${result.totalFiles}`);
  console.log(`Fixed files: ${result.fixedFiles}`);
  console.log(`Total changes: ${result.totalChanges}`);
  if (result.errors.length > 0) {
    console.log(`\n❌ Errors: ${result.errors.length}`);
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
}

