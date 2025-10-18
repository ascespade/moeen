/**
 * Global Teardown - التنظيف العام
 * Runs after all tests to clean up the testing environment
 */

import { testHelper } from './helpers/supabase-test-helper';
import { reportGenerator } from './helpers/test-report-generator';

async function globalTeardown() {
  // console.log('🧹 Starting global test teardown...');

  try {
    // Generate final test report
    // console.log('📊 Generating test report...');
    const report = await reportGenerator.generateReport();
    const reportPath = await reportGenerator.saveReport(report);
    // console.log(`📄 Test report saved to: ${reportPath}`

    // Clean up all test data
    // console.log('🗑️ Cleaning up test data...');
    await testHelper.cleanup();

    // Get final database stats
    const finalStats = await testHelper.getDatabaseStats();
    // console.log(`📈 Final database stats: ${finalStats.totalUsers} users, ${finalStats.totalPatients} patients`

    // console.log('✅ Global teardown completed successfully');
  } catch (error) {
    // console.error('❌ Global teardown failed:', error);
    // Don't throw error to avoid masking test failures
  }
}

export default globalTeardown;
