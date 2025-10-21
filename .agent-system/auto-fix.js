#!/usr/bin/env node
/**
 * Intelligent Auto-Fix Agent System
 * Automatically fixes TypeScript, ESLint, and other errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const config = require('./config.json');

console.log('\n🤖 Auto-Fix Agent System Starting...\n');
console.log(
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
);

const LOG_FILE = 'tmp/auto-fix.log';
const BACKUP_DIR = `tmp/backup-${Date.now()}`;

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);

  try {
    fs.appendFileSync(LOG_FILE, `${logMessage}\n`);
  } catch (err) {
    // Ignore
  }
}

function exec(command, options = {}) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

function createBackup() {
  if (!config.create_backup) return;

  log('Creating backup...', 'info');
  exec(`mkdir -p ${BACKUP_DIR}`);
  exec(`cp -r src ${BACKUP_DIR}/src`);
  log(`✅ Backup created at ${BACKUP_DIR}`, 'success');
}

function fixESLint() {
  log('\n📝 Fixing ESLint issues...', 'info');

  const result = exec('npx eslint . --fix --ext .ts,.tsx,.js,.jsx', {
    silent: true,
  });

  if (result.success) {
    log('✅ ESLint auto-fix completed', 'success');
    return true;
  } else {
    log('⚠️  Some ESLint issues could not be auto-fixed', 'warn');
    return false;
  }
}

function fixPrettier() {
  log('\n🎨 Formatting with Prettier...', 'info');

  const result = exec('npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}"', {
    silent: true,
  });

  if (result.success) {
    log('✅ Prettier formatting completed', 'success');
    return true;
  } else {
    log('⚠️  Prettier formatting failed', 'warn');
    return false;
  }
}

function fixTypeScript() {
  log('\n🔷 Checking TypeScript errors...', 'info');

  const result = exec('npx tsc --noEmit', { silent: true });

  if (result.success) {
    log('✅ No TypeScript errors found', 'success');
    return { success: true, errors: [] };
  } else {
    const errors = parseTypeScriptErrors(result.output + (result.error || ''));
    log(`⚠️  Found ${errors.length} TypeScript errors`, 'warn');
    return { success: false, errors };
  }
}

function parseTypeScriptErrors(output) {
  const errors = [];
  const lines = output.split('\n');

  for (const line of lines) {
    if (line.includes('error TS')) {
      errors.push(line.trim());
    }
  }

  return errors;
}

function fixUnusedImports() {
  log('\n🧹 Removing unused imports...', 'info');

  // Use ts-unused-exports or similar tool
  const result = exec('npx eslint . --fix --rule "no-unused-vars: error"', {
    silent: true,
  });

  if (result.success) {
    log('✅ Unused imports cleaned', 'success');
    return true;
  } else {
    log('⚠️  Could not auto-remove all unused imports', 'warn');
    return false;
  }
}

function checkBuild() {
  log('\n🏗️  Checking build...', 'info');

  const result = exec('npm run build', { silent: true });

  if (result.success) {
    log('✅ Build successful', 'success');
    return true;
  } else {
    log('❌ Build failed', 'error');
    return false;
  }
}

function generateReport(results) {
  log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'info'
  );
  log('\n📊 Auto-Fix Report:', 'info');
  log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    'info'
  );

  for (const [task, success] of Object.entries(results)) {
    const icon = success ? '✅' : '❌';
    log(`${icon} ${task}`, success ? 'success' : 'error');
  }

  const successCount = Object.values(results).filter(v => v).length;
  const totalCount = Object.keys(results).length;
  const successRate = Math.round((successCount / totalCount) * 100);

  log(
    `\n📈 Success Rate: ${successRate}% (${successCount}/${totalCount})\n`,
    'info'
  );

  if (successRate === 100) {
    log('🎉 All fixes applied successfully!', 'success');
  } else if (successRate >= 70) {
    log(
      '🟡 Most fixes applied, some manual intervention may be needed',
      'warn'
    );
  } else {
    log('🔴 Many issues remain, manual fixes required', 'error');
  }

  log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    'info'
  );

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    results,
    successRate,
    successCount,
    totalCount,
  };

  fs.writeFileSync('tmp/auto-fix-report.json', JSON.stringify(report, null, 2));
  log('📁 Report saved: tmp/auto-fix-report.json\n', 'info');

  return successRate;
}

async function main() {
  const results = {};

  try {
    // Create backup
    createBackup();

    // Fix ESLint
    results['ESLint Fix'] = fixESLint();

    // Fix Prettier
    results['Prettier Format'] = fixPrettier();

    // Fix unused imports
    results['Unused Imports'] = fixUnusedImports();

    // Check TypeScript
    const tsResult = fixTypeScript();
    results['TypeScript Check'] = tsResult.success;

    if (!tsResult.success && tsResult.errors.length > 0) {
      log('\n🔍 TypeScript Errors Found:', 'warn');
      tsResult.errors.slice(0, 10).forEach(err => log(`   ${err}`, 'warn'));
      if (tsResult.errors.length > 10) {
        log(`   ... and ${tsResult.errors.length - 10} more`, 'warn');
      }
    }

    // Check build
    results['Build Check'] = checkBuild();

    // Generate report
    const successRate = generateReport(results);

    process.exit(successRate === 100 ? 0 : 1);
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = { main };
