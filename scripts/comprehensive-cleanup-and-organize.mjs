#!/usr/bin/env node

/**
 * Comprehensive Cleanup and Organization Script
 * ?????? ???? ??????? ????????
 *
 * This script:
 * 1. Identifies and archives old/unused files
 * 2. Removes duplicate documentation
 * 3. Removes unused scripts
 * 4. Fixes .gitignore
 * 5. Organizes project structure
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
  unlinkSync,
  rmdirSync,
  mkdirSync,
} from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Starting Comprehensive Cleanup and Organization...\n');

// Create archive directory
const archiveDir = join(projectRoot, '.archive');
if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const archiveSubDirs = {
  docs: join(archiveDir, 'docs'),
  scripts: join(archiveDir, 'scripts'),
  reports: join(archiveDir, 'reports'),
  sql: join(archiveDir, 'sql'),
  temp: join(archiveDir, 'temp'),
};

Object.values(archiveSubDirs).forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Files to keep (essential files)
const essentialFiles = [
  'README.md',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'eslint.config.js',
  'postcss.config.js',
  'jest.config.js',
  'playwright.config.ts',
  '.gitignore',
  'LICENSE',
  'env.example',
  'docker-compose.yml',
  'Dockerfile.dev',
  'Dockerfile.production',
  'nginx.conf',
];

// Essential documentation files to keep
const essentialDocs = [
  'README.md',
  'docs/README.md',
  'docs/ARCHITECTURE.md',
  'docs/API.md',
  'docs/DEVELOPER_GUIDE.md',
  'WORKFLOWS_DOCUMENTATION.md',
  'ACCOUNTS_TYPES_AND_PERMISSIONS.md',
  'COMPREHENSIVE_FINAL_REPORT.md',
];

// Essential scripts to keep
const essentialScripts = [
  'scripts/apply-workflows-and-permissions.mjs',
  'scripts/run-all-audits-and-tests.mjs',
  'scripts/five-rounds-audit.mjs',
  'scripts/round6-comprehensive-testing.mjs',
  'scripts/final-comprehensive-audit.mjs',
  'scripts/comprehensive-cleanup-and-organize.mjs',
];

// Files to archive
const filesToArchive = [];

// 1. Find and archive duplicate/old documentation
console.log('?? Cleaning up documentation files...');
const rootMdFiles = readdirSync(projectRoot)
  .filter(f => f.endsWith('.md') && !essentialDocs.includes(f))
  .filter(f => {
    const name = f.toLowerCase();
    return (
      name.includes('complete') ||
      name.includes('final') ||
      name.includes('summary') ||
      name.includes('report') ||
      name.includes('audit') ||
      name.includes('improvement') ||
      name.includes('fix') ||
      name.includes('status') ||
      name.includes('plan') ||
      name.includes('guide')
    );
  });

rootMdFiles.forEach(file => {
  const source = join(projectRoot, file);
  const dest = join(archiveSubDirs.docs, file);
  try {
    execSync(`mv "${source}" "${dest}"`, { cwd: projectRoot });
    filesToArchive.push(file);
    console.log(`  ? Archived: ${file}`);
  } catch (error) {
    console.log(`  ??  Failed to archive: ${file}`);
  }
});

// 2. Archive old JSON reports
console.log('\n?? Cleaning up JSON report files...');
const jsonReports = readdirSync(projectRoot)
  .filter(
    f =>
      f.endsWith('.json') &&
      (f.includes('report') || f.includes('audit') || f.includes('summary'))
  )
  .filter(
    f => !['package.json', 'package-lock.json', 'tsconfig.json'].includes(f)
  );

jsonReports.forEach(file => {
  const source = join(projectRoot, file);
  const dest = join(archiveSubDirs.reports, file);
  try {
    execSync(`mv "${source}" "${dest}"`, { cwd: projectRoot });
    filesToArchive.push(file);
    console.log(`  ? Archived: ${file}`);
  } catch (error) {
    console.log(`  ??  Failed to archive: ${file}`);
  }
});

// 3. Archive old SQL files
console.log('\n???  Cleaning up SQL files...');
const sqlFiles = readdirSync(projectRoot).filter(
  f => f.endsWith('.sql') && !f.startsWith('supabase/')
);

sqlFiles.forEach(file => {
  const source = join(projectRoot, file);
  const dest = join(archiveSubDirs.sql, file);
  try {
    execSync(`mv "${source}" "${dest}"`, { cwd: projectRoot });
    filesToArchive.push(file);
    console.log(`  ? Archived: ${file}`);
  } catch (error) {
    console.log(`  ??  Failed to archive: ${file}`);
  }
});

// 4. Archive unused scripts
console.log('\n?? Cleaning up unused scripts...');
const allScripts = readdirSync(join(projectRoot, 'scripts'))
  .filter(f => f.endsWith('.mjs') || f.endsWith('.js') || f.endsWith('.sh'))
  .map(f => `scripts/${f}`);

const scriptsToArchive = allScripts.filter(script => {
  const scriptName = basename(script);
  const isEssential = essentialScripts.some(es =>
    script.includes(basename(es))
  );

  // Archive if:
  // - Not essential
  // - Contains "ai_" prefix (old AI scripts)
  // - Contains "test" or "fix" in name (old test/fix scripts)
  // - Duplicate names
  return (
    !isEssential &&
    (scriptName.startsWith('ai_') ||
      scriptName.includes('_test') ||
      scriptName.includes('_fix') ||
      scriptName.includes('generate') ||
      scriptName.includes('backup') ||
      scriptName.includes('monitoring') ||
      scriptName.includes('dashboard') ||
      scriptName.includes('enterprise') ||
      scriptName.includes('master') ||
      scriptName.includes('comprehensive-fix') ||
      scriptName.includes('comprehensive-audit') ||
      scriptName.includes('expert-audit') ||
      scriptName.includes('prevent-future'))
  );
});

scriptsToArchive.forEach(script => {
  const source = join(projectRoot, script);
  const dest = join(archiveSubDirs.scripts, basename(script));
  try {
    execSync(`mv "${source}" "${dest}"`, { cwd: projectRoot });
    filesToArchive.push(script);
    console.log(`  ? Archived: ${script}`);
  } catch (error) {
    console.log(`  ??  Failed to archive: ${script}`);
  }
});

// 5. Fix .gitignore
console.log('\n?? Fixing .gitignore...');
const gitignorePath = join(projectRoot, '.gitignore');
let gitignoreContent = readFileSync(gitignorePath, 'utf-8');

// Add missing entries
const missingEntries = [
  '# Build outputs',
  '.next/',
  'out/',
  'build/',
  'dist/',
  '',
  '# Test results',
  'test-results/',
  'playwright-report/',
  'coverage/',
  '',
  '# Temporary files',
  'tmp/',
  '*.tmp',
  '*.temp',
  '',
  '# Reports',
  '*.log',
  '',
  '# OS files',
  '.DS_Store',
  'Thumbs.db',
  '',
  '# Archive',
  '.archive/',
];

// Check if entries are missing
missingEntries.forEach(entry => {
  if (!gitignoreContent.includes(entry.trim()) && entry.trim() !== '') {
    gitignoreContent += '\n' + entry;
  }
});

writeFileSync(gitignorePath, gitignoreContent);
console.log('  ? .gitignore updated');

// 6. Remove temporary files
console.log('\n???  Removing temporary files...');
const tempFiles = [
  'package.json.backup',
  'githubcli-archive-keyring.gpg',
  'workflow-monitor-dashboard.html',
  'run-all-tests.sh',
  'test_custom_auth.sh',
  'tsconfig.tsbuildinfo',
];

tempFiles.forEach(file => {
  const filePath = join(projectRoot, file);
  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath);
      console.log(`  ? Removed: ${file}`);
    } catch (error) {
      console.log(`  ??  Failed to remove: ${file}`);
    }
  }
});

// 7. Clean up empty directories
console.log('\n?? Cleaning up empty directories...');
const emptyDirs = ['tmp', 'test-results'];
emptyDirs.forEach(dir => {
  const dirPath = join(projectRoot, dir);
  if (existsSync(dirPath)) {
    try {
      const files = readdirSync(dirPath);
      if (files.length === 0) {
        rmdirSync(dirPath);
        console.log(`  ? Removed empty directory: ${dir}`);
      }
    } catch (error) {
      // Directory not empty or error
    }
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('?? Cleanup Summary');
console.log('='.repeat(70));
console.log(`? Archived files: ${filesToArchive.length}`);
console.log(`? Updated .gitignore`);
console.log(`? Removed temporary files`);
console.log('\n? Cleanup completed!');

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  archivedFiles: filesToArchive,
  totalArchived: filesToArchive.length,
};

writeFileSync(
  join(projectRoot, '.archive', 'cleanup-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n?? Report saved to: .archive/cleanup-report.json\n');
