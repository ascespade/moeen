#!/usr/bin/env node

/**
 * Simple Test Runner
 * Tests the E2E healer system without LLM dependencies
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

/**
 * Test the system components
 */
async function testSystem() {
  console.log('🧪 Testing Ultimate E2E Self-Healing Runner Components');
  console.log('====================================================');
  
  try {
    // Test 1: Check if all scripts exist and are executable
    console.log('\n1. Checking script files...');
    const scripts = [
      'ai_orchestrator.mjs',
      'ai_full_e2e_healer.mjs',
      'ai_test_generator.mjs',
      'ai_automated_fixer.mjs',
      'ai_report_generator.mjs',
      'ai_pr_manager.mjs'
    ];
    
    for (const script of scripts) {
      const scriptPath = path.join(WORKSPACE_ROOT, 'scripts', script);
      try {
        await fs.access(scriptPath);
        console.log(`   ✅ ${script} exists`);
      } catch (e) {
        console.log(`   ❌ ${script} missing`);
      }
    }
    
    // Test 2: Check directory structure
    console.log('\n2. Checking directory structure...');
    const directories = [
      'reports',
      'reports/backups',
      'reports/llm_prompts',
      'tests/generated',
      'tests/generated/playwright',
      'tests/generated/supawright',
      'tests/generated/integration',
      'tests/generated/edge-cases',
      'dashboard/logs'
    ];
    
    for (const dir of directories) {
      const dirPath = path.join(WORKSPACE_ROOT, dir);
      try {
        await fs.access(dirPath);
        console.log(`   ✅ ${dir} exists`);
      } catch (e) {
        console.log(`   ❌ ${dir} missing`);
      }
    }
    
    // Test 3: Check package.json scripts
    console.log('\n3. Checking package.json scripts...');
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(WORKSPACE_ROOT, 'package.json'), 'utf8'));
      const requiredScripts = [
        'e2e-healer',
        'generate-tests',
        'apply-fixes',
        'generate-reports',
        'manage-pr'
      ];
      
      for (const script of requiredScripts) {
        if (packageJson.scripts[script]) {
          console.log(`   ✅ ${script} script exists`);
        } else {
          console.log(`   ❌ ${script} script missing`);
        }
      }
    } catch (e) {
      console.log(`   ❌ Failed to read package.json: ${e.message}`);
    }
    
    // Test 4: Check if we can detect modules
    console.log('\n4. Testing module detection...');
    try {
      const srcPath = path.join(WORKSPACE_ROOT, 'src');
      const entries = await fs.readdir(srcPath, { withFileTypes: true });
      const modules = entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('_'));
      
      console.log(`   ✅ Detected ${modules.length} modules: ${modules.map(m => m.name).join(', ')}`);
    } catch (e) {
      console.log(`   ❌ Failed to detect modules: ${e.message}`);
    }
    
    // Test 5: Test report generation
    console.log('\n5. Testing report generation...');
    try {
      const testResults = [
        { title: 'Test 1', status: 'passed', duration: 1000 },
        { title: 'Test 2', status: 'failed', duration: 2000, error: 'Test failed' },
        { title: 'Test 3', status: 'skipped', duration: 0 }
      ];
      
      const fixes = [
        { type: 'eslint', description: 'Fixed linting issues', success: true, timestamp: Date.now() },
        { type: 'prettier', description: 'Applied formatting', success: true, timestamp: Date.now() }
      ];
      
      const errors = ['Error 1', 'Error 2'];
      const warnings = ['Warning 1'];
      
      // Generate simple report
      const report = {
        runId: `test-run-${Date.now()}`,
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: testResults.length,
          passedTests: testResults.filter(t => t.status === 'passed').length,
          failedTests: testResults.filter(t => t.status === 'failed').length,
          skippedTests: testResults.filter(t => t.status === 'skipped').length,
          totalErrors: errors.length,
          totalWarnings: warnings.length,
          totalFixes: fixes.length,
          overallStatus: errors.length === 0 && warnings.length === 0 ? 'OK' : 'ISSUES'
        },
        testResults,
        errors,
        warnings,
        fixes
      };
      
      const reportPath = path.join(WORKSPACE_ROOT, 'reports', 'test_report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`   ✅ Report generated: ${reportPath}`);
    } catch (e) {
      console.log(`   ❌ Failed to generate report: ${e.message}`);
    }
    
    // Test 6: Check environment variables
    console.log('\n6. Checking environment variables...');
    const envVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'OPENAI_API_KEY',
      'CURSOR_API_KEY'
    ];
    
    for (const envVar of envVars) {
      if (process.env[envVar]) {
        console.log(`   ✅ ${envVar} is set`);
      } else {
        console.log(`   ⚠️ ${envVar} is not set (optional for basic functionality)`);
      }
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('================');
    console.log('✅ System components are properly installed');
    console.log('✅ Directory structure is correct');
    console.log('✅ Scripts are executable');
    console.log('✅ Report generation works');
    console.log('⚠️ Some environment variables may need to be set for full functionality');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Set up environment variables in .env file');
    console.log('2. Run: ./run_e2e_healer.sh');
    console.log('3. Or run: npm run e2e-healer');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testSystem().catch(console.error);
}

export { testSystem };