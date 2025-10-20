const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive test suite execution...');

// Test configuration
const testConfig = {
  timeout: 60000,
  retries: 2,
  workers: 4,
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ]
};

// Create test results directory
if (!fs.existsSync('test-results')) {
  fs.mkdirSync('test-results', { recursive: true });
}

// Function to run tests for a specific module
function runModuleTests(moduleName) {
  console.log(`\n📋 Running tests for ${moduleName} module...`);
  
  try {
    const testFile = `tests/modules/${moduleName}/${moduleName}.spec.ts`;
    
    if (!fs.existsSync(testFile)) {
      console.log(`❌ Test file not found: ${testFile}`);
      return { success: false, error: 'Test file not found' };
    }

    // Run the tests
    const command = `npx playwright test ${testFile} --timeout=${testConfig.timeout} --retries=${testConfig.retries} --workers=${testConfig.workers}`;
    
    console.log(`Running: ${command}`);
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    console.log(`✅ ${moduleName} tests completed successfully`);
    return { success: true, output };
    
  } catch (error) {
    console.log(`❌ ${moduleName} tests failed:`, error.message);
    return { success: false, error: error.message, output: error.stdout };
  }
}

// Function to fix common test issues
function fixTestIssues(moduleName) {
  console.log(`🔧 Fixing issues for ${moduleName} module...`);
  
  const testFile = `tests/modules/${moduleName}/${moduleName}.spec.ts`;
  
  if (!fs.existsSync(testFile)) {
    return;
  }
  
  let content = fs.readFileSync(testFile, 'utf8');
  
  // Fix common issues
  const fixes = [
    // Fix import paths
    {
      pattern: /import { realDB } from '@\/lib\/supabase-real';/g,
      replacement: "import { realDB } from '../../../src/lib/supabase-real';"
    },
    // Fix API paths
    {
      pattern: /\/api\//g,
      replacement: '/api/'
    },
    // Fix page paths
    {
      pattern: /\/([a-z-]+)\//g,
      replacement: '/$1/'
    }
  ];
  
  fixes.forEach(fix => {
    content = content.replace(fix.pattern, fix.replacement);
  });
  
  fs.writeFileSync(testFile, content);
  console.log(`✅ Fixed issues in ${testFile}`);
}

// Main execution
async function runAllTests() {
  const modules = [
    'authentication',
    'patients', 
    'doctors',
    'appointments',
    'sessions',
    'medical-records',
    'insurance',
    'progress-tracking',
    'training',
    'notifications',
    'dashboard',
    'admin',
    'chatbot',
    'crm',
    'reports',
    'settings'
  ];
  
  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  console.log(`\n🎯 Running tests for ${modules.length} modules...`);
  
  for (const module of modules) {
    // Fix issues first
    fixTestIssues(module);
    
    // Run tests
    const result = runModuleTests(module);
    results.push({ module, ...result });
    
    if (result.success) {
      passedTests++;
      console.log(`✅ ${module}: PASSED`);
    } else {
      failedTests++;
      console.log(`❌ ${module}: FAILED - ${result.error}`);
    }
    
    totalTests++;
  }
  
  // Generate summary report
  console.log('\n📊 TEST EXECUTION SUMMARY');
  console.log('========================');
  console.log(`Total Modules: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  
  // Save detailed results
  const summary = {
    timestamp: new Date().toISOString(),
    totalModules: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: (passedTests / totalTests) * 100,
    results: results
  };
  
  fs.writeFileSync('test-results/summary.json', JSON.stringify(summary, null, 2));
  
  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Results Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        .module { margin: 10px 0; padding: 10px; border-radius: 3px; }
        .passed { background: #d4edda; border-left: 4px solid #28a745; }
        .failed { background: #f8d7da; border-left: 4px solid #dc3545; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Comprehensive Test Suite Results</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="stats">
        <div class="stat">
            <h3>${totalTests}</h3>
            <p>Total Modules</p>
        </div>
        <div class="stat">
            <h3 style="color: #28a745;">${passedTests}</h3>
            <p>Passed</p>
        </div>
        <div class="stat">
            <h3 style="color: #dc3545;">${failedTests}</h3>
            <p>Failed</p>
        </div>
        <div class="stat">
            <h3>${((passedTests / totalTests) * 100).toFixed(2)}%</h3>
            <p>Success Rate</p>
        </div>
    </div>
    
    <h2>Module Results</h2>
    ${results.map(result => `
        <div class="module ${result.success ? 'passed' : 'failed'}">
            <h3>${result.module}</h3>
            <p>Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}</p>
            ${result.error ? `<p>Error: ${result.error}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>
  `;
  
  fs.writeFileSync('test-results/index.html', htmlReport);
  
  console.log('\n📄 Reports generated:');
  console.log('- test-results/index.html');
  console.log('- test-results/summary.json');
  console.log('- test-results/results.json');
  console.log('- test-results/results.xml');
  
  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. Check the detailed reports for more information.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed successfully!');
  }
}

// Run the tests
runAllTests().catch(console.error);
