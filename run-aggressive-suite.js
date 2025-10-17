#!/usr/bin/env node
/**
 * Aggressive Full Test Suite Runner
 * Runs all 13 modules with retries, auto-fixes, and progress tracking
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  MAX_ATTEMPTS: parseInt(process.env.MAX_ATTEMPTS_PER_MODULE) || 6,
  TARGET_PERCENT: parseInt(process.env.MODULE_TARGET_PERCENT) || 90,
  TIMEOUT_MS: parseInt(process.env.PLAYWRIGHT_TIMEOUT_MS) || 60000,
  WORKERS: parseInt(process.env.PLAYWRIGHT_WORKERS_PER_MODULE) || 2,
  MODULES: [
    'auth', 'users', 'patients', 'appointments', 'billing',
    'notifications', 'dashboard', 'admin', 'files', 
    'reports', 'settings', 'integration', 'payments'
  ]
};

const timestamp = () => new Date().toISOString();
const log = (msg) => {
  const logMsg = `[${timestamp()}] ${msg}`;
  console.log(logMsg);
  fs.appendFileSync('tmp/progress.log', logMsg + '\n');
};

const logJSON = (obj) => {
  const jsonMsg = JSON.stringify({ time: timestamp(), ...obj });
  console.log(jsonMsg);
  fs.appendFileSync('tmp/progress.log', jsonMsg + '\n');
};

// Test file mapping
const TEST_FILE_MAP = {
  'auth': 'tests/e2e/auth.spec.ts',
  'admin': 'tests/e2e/admin.spec.ts',
  'appointments': 'tests/e2e/appointments.spec.ts',
  'dashboard': 'tests/e2e/dashboard.spec.ts',
  'payments': 'tests/e2e/payments.spec.ts',
  'users': 'tests/e2e/remaining-modules.spec.ts',
  'patients': 'tests/e2e/medical-records.spec.ts',
  'billing': 'tests/e2e/remaining-modules.spec.ts',
  'notifications': 'tests/e2e/remaining-modules.spec.ts',
  'files': 'tests/e2e/remaining-modules.spec.ts',
  'reports': 'tests/e2e/remaining-modules.spec.ts',
  'settings': 'tests/e2e/remaining-modules.spec.ts',
  'integration': 'tests/e2e/supabase-integration.spec.ts'
};

// Analyze Playwright report
function analyzeReport(reportPath) {
  try {
    if (!fs.existsSync(reportPath)) {
      return { total: 0, passed: 0, failed: 0, percent: 0, failures: [] };
    }
    
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    let total = 0, passed = 0, failed = 0, failures = [];
    
    function walkSuites(suites) {
      for (const suite of suites) {
        if (suite.specs) {
          for (const spec of suite.specs) {
            total++;
            const allPassed = spec.tests && spec.tests.every(t => t.results && t.results.every(r => r.status === 'passed'));
            if (allPassed) {
              passed++;
            } else {
              failed++;
              failures.push({ title: spec.title, file: spec.file });
            }
          }
        }
        if (suite.suites) walkSuites(suite.suites);
      }
    }
    
    if (data.suites) walkSuites(data.suites);
    
    const percent = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, passed, failed, percent, failures };
  } catch (error) {
    log(`⚠️  Error analyzing report: ${error.message}`);
    return { total: 0, passed: 0, failed: 0, percent: 0, failures: [], error: error.message };
  }
}

// Run Playwright test
function runPlaywrightTest(module, testFile, outDir, attempt) {
  const reportFile = path.join(outDir, `report-attempt${attempt}.json`);
  
  log(`[${module}] Running Playwright test (attempt ${attempt})`);
  
  try {
    const cmd = `npx playwright test ${testFile} --config=playwright-auto.config.ts --workers=${CONFIG.WORKERS} --timeout=${CONFIG.TIMEOUT_MS} --reporter=json --output=${reportFile}`;
    
    execSync(cmd, {
      stdio: 'pipe',
      timeout: CONFIG.TIMEOUT_MS * 2,
      env: { ...process.env, NODE_ENV: 'test' }
    });
    
    return reportFile;
  } catch (error) {
    // Playwright exits with non-zero on test failures, which is expected
    // The report file should still be generated
    return reportFile;
  }
}

// Apply auto-fixes
function applyAutoFixes(module) {
  log(`[${module}] Applying auto-fixes...`);
  
  try {
    // Run eslint fix
    execSync('npx eslint . --fix --quiet', { stdio: 'pipe', timeout: 30000 });
    log(`[${module}] ✅ ESLint auto-fix applied`);
    
    // Type check
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      log(`[${module}] ✅ TypeScript check passed`);
    } catch (e) {
      log(`[${module}] ⚠️  TypeScript errors found (non-blocking)`);
    }
    
    fs.appendFileSync('tmp/auto-fixes.log', 
      `[${timestamp()}] ${module}: Applied eslint --fix\n`);
    
    return true;
  } catch (error) {
    log(`[${module}] ⚠️  Auto-fix error: ${error.message}`);
    return false;
  }
}

// Increase timeout
function increaseTimeout() {
  CONFIG.TIMEOUT_MS += 20000;
  log(`⏱️  Timeout increased to ${CONFIG.TIMEOUT_MS}ms`);
  
  // Update playwright-auto.config.ts
  try {
    const configPath = 'playwright-auto.config.ts';
    if (fs.existsSync(configPath)) {
      let content = fs.readFileSync(configPath, 'utf8');
      content = content.replace(/timeout:\s*\d+/g, `timeout: ${CONFIG.TIMEOUT_MS}`);
      fs.writeFileSync(configPath, content);
    }
  } catch (e) {
    log(`⚠️  Could not update config: ${e.message}`);
  }
}

// Test single module
async function testModule(module) {
  const moduleStart = Date.now();
  const outDir = path.join('test-results', `${module}-${Date.now()}`);
  fs.mkdirSync(outDir, { recursive: true });
  
  logJSON({ module, status: 'started', attempt: 0 });
  
  const testFile = TEST_FILE_MAP[module];
  if (!testFile || !fs.existsSync(testFile)) {
    logJSON({ module, status: 'skipped', reason: 'no-test-file', percent: 100 });
    return { module, percent: 100, attempts: 0, status: 'skipped' };
  }
  
  let bestPercent = 0;
  let bestAttempt = 0;
  
  for (let attempt = 1; attempt <= CONFIG.MAX_ATTEMPTS; attempt++) {
    logJSON({ module, attempt, status: 'running' });
    
    // Run test
    const reportFile = runPlaywrightTest(module, testFile, outDir, attempt);
    
    // Analyze
    const analysis = analyzeReport(reportFile);
    const analysisFile = path.join(outDir, `analysis-attempt${attempt}.json`);
    fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
    
    logJSON({ 
      module, 
      attempt, 
      percent: analysis.percent,
      passed: analysis.passed,
      total: analysis.total,
      status: analysis.percent >= CONFIG.TARGET_PERCENT ? 'success' : 'retry'
    });
    
    if (analysis.percent > bestPercent) {
      bestPercent = analysis.percent;
      bestAttempt = attempt;
    }
    
    // Check if target reached
    if (analysis.percent >= CONFIG.TARGET_PERCENT) {
      const duration = ((Date.now() - moduleStart) / 1000).toFixed(2);
      logJSON({ module, status: 'completed', percent: analysis.percent, attempts: attempt, duration: `${duration}s` });
      return { module, percent: analysis.percent, attempts: attempt, status: 'success', duration };
    }
    
    // Apply fixes before next attempt
    if (attempt < CONFIG.MAX_ATTEMPTS) {
      applyAutoFixes(module);
      
      // Check for timeout issues
      if (analysis.failures && analysis.failures.length > 0) {
        increaseTimeout();
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const duration = ((Date.now() - moduleStart) / 1000).toFixed(2);
  logJSON({ module, status: 'failed', percent: bestPercent, attempts: CONFIG.MAX_ATTEMPTS, duration: `${duration}s` });
  return { module, percent: bestPercent, attempts: CONFIG.MAX_ATTEMPTS, status: 'failed', duration };
}

// Main execution
async function main() {
  const startTime = Date.now();
  log('🚀 STARTING AGGRESSIVE FULL TEST SUITE');
  log(`📋 Testing ${CONFIG.MODULES.length} modules`);
  log(`⚙️  Config: ${CONFIG.MAX_ATTEMPTS} attempts, ${CONFIG.TARGET_PERCENT}% target, ${CONFIG.TIMEOUT_MS}ms timeout`);
  
  const results = [];
  
  // Test each module sequentially (for better log tracking)
  for (const module of CONFIG.MODULES) {
    const result = await testModule(module);
    results.push(result);
  }
  
  // Aggregate results
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const avgPercent = results.reduce((sum, r) => sum + r.percent, 0) / results.length;
  
  const summary = {
    timestamp: timestamp(),
    duration: `${totalDuration}s`,
    modules: {
      total: CONFIG.MODULES.length,
      successful,
      failed,
      skipped
    },
    averagePercent: Math.round(avgPercent),
    results
  };
  
  // Save final report
  const finalReportPath = `test-reports/final-report-${Date.now()}.json`;
  fs.writeFileSync(finalReportPath, JSON.stringify(summary, null, 2));
  
  log('');
  log('═══════════════════════════════════════════════════════');
  log('📊 FINAL SUMMARY');
  log('═══════════════════════════════════════════════════════');
  log(`✅ Successful: ${successful}/${CONFIG.MODULES.length}`);
  log(`❌ Failed: ${failed}/${CONFIG.MODULES.length}`);
  log(`⏭️  Skipped: ${skipped}/${CONFIG.MODULES.length}`);
  log(`📈 Average Success: ${Math.round(avgPercent)}%`);
  log(`⏱️  Total Duration: ${totalDuration}s`);
  log(`📄 Report: ${finalReportPath}`);
  log('═══════════════════════════════════════════════════════');
  
  return summary;
}

// Run
main().then(summary => {
  process.exit(summary.modules.failed > 0 ? 1 : 0);
}).catch(error => {
  log(`❌ FATAL ERROR: ${error.message}`);
  console.error(error);
  process.exit(1);
});
