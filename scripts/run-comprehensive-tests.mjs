import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const TEST_RESULTS_DIR = path.join(projectRoot, 'reports', 'test-results');
const LOG_FILE = path.join(projectRoot, 'logs', 'comprehensive-tests.log');

// Helper to execute shell commands
async function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot, ...options }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Helper to log messages
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  
  try {
    await fs.appendFile(LOG_FILE, logMessage + '\n', 'utf8');
  } catch (err) {
    console.error(`Failed to write to log file: ${err.message}`);
  }
}

// Function to run unit tests
async function runUnitTests() {
  log('🧪 Running unit tests...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run test:unit');
    log('✅ Unit tests completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Unit tests failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run integration tests
async function runIntegrationTests() {
  log('🔗 Running integration tests...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run test:integration');
    log('✅ Integration tests completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Integration tests failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run E2E tests
async function runE2ETests() {
  log('🌐 Running E2E tests...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run test:e2e');
    log('✅ E2E tests completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ E2E tests failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run Playwright tests
async function runPlaywrightTests() {
  log('🎭 Running Playwright tests...');
  
  try {
    const { stdout, stderr } = await executeCommand('npx playwright test --reporter=html');
    log('✅ Playwright tests completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Playwright tests failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run Supawright tests
async function runSupawrightTests() {
  log('🔍 Running Supawright tests...');
  
  try {
    const { stdout, stderr } = await executeCommand('npx supawright test');
    log('✅ Supawright tests completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Supawright tests failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run comprehensive tests
async function runComprehensiveTests() {
  log('🧪 Running comprehensive tests...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run test:comprehensive');
    log('✅ Comprehensive tests completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Comprehensive tests failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run linting
async function runLinting() {
  log('🔍 Running linting...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run lint:check');
    log('✅ Linting completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Linting failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run type checking
async function runTypeChecking() {
  log('🔍 Running type checking...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run type:check');
    log('✅ Type checking completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Type checking failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to run build
async function runBuild() {
  log('🏗️ Running build...');
  
  try {
    const { stdout, stderr } = await executeCommand('npm run build');
    log('✅ Build completed successfully');
    return { success: true, output: stdout, error: stderr };
  } catch (e) {
    log(`❌ Build failed: ${e.message}`, 'ERROR');
    return { success: false, output: e.stdout, error: e.stderr };
  }
}

// Function to generate test report
async function generateTestReport(results) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    summary: {
      total: Object.keys(results).length,
      passed: Object.values(results).filter(r => r.success).length,
      failed: Object.values(results).filter(r => !r.success).length
    },
    results
  };
  
  // Save JSON report
  const jsonFile = path.join(TEST_RESULTS_DIR, `test-results-${Date.now()}.json`);
  await fs.writeFile(jsonFile, JSON.stringify(report, null, 2), 'utf8');
  
  // Generate HTML report
  const html = generateHTMLReport(report);
  const htmlFile = path.join(TEST_RESULTS_DIR, 'test-results.html');
  await fs.writeFile(htmlFile, html, 'utf8');
  
  log(`📊 Test report generated: ${htmlFile}`);
  
  return report;
}

// Function to generate HTML report
function generateHTMLReport(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
        .summary-item { text-align: center; padding: 20px; border-radius: 8px; }
        .summary-item.passed { background-color: #d4edda; border: 1px solid #c3e6cb; }
        .summary-item.failed { background-color: #f8d7da; border: 1px solid #f5c6cb; }
        .summary-item.total { background-color: #d1ecf1; border: 1px solid #bee5eb; }
        .test-section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .test-section h3 { margin-top: 0; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }
        .status.success { background-color: #28a745; }
        .status.failed { background-color: #dc3545; }
        .output { background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px; font-family: monospace; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Comprehensive Test Results</h1>
            <p>Generated: ${report.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="summary-item total">
                <h3>Total Tests</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.total}</div>
            </div>
            <div class="summary-item passed">
                <h3>Passed</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.passed}</div>
            </div>
            <div class="summary-item failed">
                <h3>Failed</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.failed}</div>
            </div>
        </div>
        
        ${Object.entries(report.results).map(([name, result]) => `
        <div class="test-section">
            <h3>${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
            <p>
                <span class="status ${result.success ? 'success' : 'failed'}">
                    ${result.success ? 'PASSED' : 'FAILED'}
                </span>
            </p>
            ${result.output ? `<div class="output">${result.output}</div>` : ''}
            ${result.error ? `<div class="output" style="background-color: #f8d7da;">${result.error}</div>` : ''}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  
  // Ensure directories exist
  await fs.mkdir(TEST_RESULTS_DIR, { recursive: true }).catch(() => {});
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true }).catch(() => {});
  
  log(`🚀 Starting comprehensive test suite: ${testType}`);
  
  const results = {};
  
  try {
    switch (testType) {
      case 'unit':
        results.unitTests = await runUnitTests();
        break;
        
      case 'integration':
        results.integrationTests = await runIntegrationTests();
        break;
        
      case 'e2e':
        results.e2eTests = await runE2ETests();
        break;
        
      case 'playwright':
        results.playwrightTests = await runPlaywrightTests();
        break;
        
      case 'supawright':
        results.supawrightTests = await runSupawrightTests();
        break;
        
      case 'comprehensive':
        results.comprehensiveTests = await runComprehensiveTests();
        break;
        
      case 'lint':
        results.linting = await runLinting();
        break;
        
      case 'types':
        results.typeChecking = await runTypeChecking();
        break;
        
      case 'build':
        results.build = await runBuild();
        break;
        
      case 'all':
      default:
        results.unitTests = await runUnitTests();
        results.integrationTests = await runIntegrationTests();
        results.e2eTests = await runE2ETests();
        results.playwrightTests = await runPlaywrightTests();
        results.supawrightTests = await runSupawrightTests();
        results.comprehensiveTests = await runComprehensiveTests();
        results.linting = await runLinting();
        results.typeChecking = await runTypeChecking();
        results.build = await runBuild();
        break;
    }
    
    // Generate report
    const report = await generateTestReport(results);
    
    // Log summary
    log(`📊 Test Summary: ${report.summary.passed}/${report.summary.total} passed`);
    
    if (report.summary.failed > 0) {
      log(`❌ ${report.summary.failed} tests failed`, 'ERROR');
      process.exit(1);
    } else {
      log('✅ All tests passed!');
      process.exit(0);
    }
    
  } catch (err) {
    log(`❌ Test suite failed: ${err.message}`, 'ERROR');
    process.exit(1);
  }
}

main().catch(console.error);
