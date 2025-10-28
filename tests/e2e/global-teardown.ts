// tests/e2e/global-teardown.ts
// Global Teardown for Playwright Tests
// Cleans up test data and resources

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');

  try {
    // Clean up test data
    await cleanupTestData();

    // Clean up test files
    await cleanupTestFiles();

    // Generate test report
    await generateTestReport();

    console.log('✅ Global test teardown completed successfully');
  } catch (error) {
    console.error('❌ Global test teardown failed:', error);
    throw error;
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');

  try {
    // Delete test users
    await supabase.from('users').delete().like('email', 'test-%@example.com');

    // Delete test patients
    await supabase
      .from('patients')
      .delete()
      .like('email', 'patient%@example.com');

    // Delete test doctors
    await supabase
      .from('doctors')
      .delete()
      .like('email', 'doctor%@example.com');

    // Delete test roles
    await supabase.from('roles').delete().like('name', 'test_%');

    // Delete test chatbot flows
    await supabase.from('chatbot_flows').delete().like('public_id', 'test-%');

    // Delete test workflows
    await supabase
      .from('workflow_validation')
      .delete()
      .like('workflow_id', 'test-%');

    // Delete test appointments
    await supabase
      .from('appointments')
      .delete()
      .like('notes', 'Test appointment%');

    // Delete test notifications
    await supabase
      .from('notifications')
      .delete()
      .like('message', 'Test notification%');

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Test data cleanup failed:', error);
    throw error;
  }
}

async function cleanupTestFiles() {
  console.log('📁 Cleaning up test files...');

  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Clean up test screenshots
    const screenshotDir = './test-results/screenshots';
    try {
      const files = await fs.readdir(screenshotDir);
      for (const file of files) {
        await fs.unlink(path.join(screenshotDir, file));
      }
    } catch (error) {
      // Directory might not exist
    }

    // Clean up test videos
    const videoDir = './test-results/videos';
    try {
      const files = await fs.readdir(videoDir);
      for (const file of files) {
        await fs.unlink(path.join(videoDir, file));
      }
    } catch (error) {
      // Directory might not exist
    }

    // Clean up test traces
    const traceDir = './test-results/traces';
    try {
      const files = await fs.readdir(traceDir);
      for (const file of files) {
        await fs.unlink(path.join(traceDir, file));
      }
    } catch (error) {
      // Directory might not exist
    }

    console.log('✅ Test files cleanup completed');
  } catch (error) {
    console.error('❌ Test files cleanup failed:', error);
    throw error;
  }
}

async function generateTestReport() {
  console.log('📊 Generating test report...');

  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Read test results
    const resultsPath = './test-results/results.json';
    try {
      const resultsData = await fs.readFile(resultsPath, 'utf8');
      const results = JSON.parse(resultsData);

      // Generate summary report
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        suites:
          results.suites?.map(suite => ({
            title: suite.title,
            tests: suite.tests?.length || 0,
            passed:
              suite.tests?.filter(t => t.outcome === 'passed').length || 0,
            failed:
              suite.tests?.filter(t => t.outcome === 'failed').length || 0,
          })) || [],
      };

      // Save summary report
      await fs.writeFile(
        './test-results/summary.json',
        JSON.stringify(summary, null, 2)
      );

      console.log('✅ Test report generated');
    } catch (error) {
      console.log('⚠️ No test results found to generate report');
    }
  } catch (error) {
    console.error('❌ Test report generation failed:', error);
    throw error;
  }
}

export default globalTeardown;
