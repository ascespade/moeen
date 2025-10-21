#!/usr/bin/env ts-node

/**
 * Comprehensive Test Runner - مشغل الاختبارات الشامل
 * Runs all tests with Supabase integration and generates detailed reports
 */

import { execSync } from 'child_process';
import { testHelper } from './tests/helpers/supabase-test-helper';
import { reportGenerator } from './tests/helpers/test-report-generator';
import fs from 'fs';
import path from 'path';

interface TestSuite {
  name: string;
  command: string;
  description: string;
}

const testSuites: TestSuite[] = [
  {
    name: 'authentication',
    command:
      'npx playwright test --project=chromium tests/e2e/auth.spec.ts --reporter=json',
    description: 'Authentication Module Tests',
  },
  {
    name: 'admin',
    command:
      'npx playwright test --project=chromium tests/e2e/admin.spec.ts --reporter=json',
    description: 'Admin Panel Tests',
  },
  {
    name: 'dashboard',
    command:
      'npx playwright test --project=chromium tests/e2e/dashboard.spec.ts --reporter=json',
    description: 'Dashboard Tests',
  },
  {
    name: 'supabase-integration',
    command:
      'npx playwright test --project=chromium tests/e2e/supabase-integration.spec.ts --reporter=json',
    description: 'Supabase Integration Tests',
  },
];

async function runTestSuite(
  suite: TestSuite
): Promise<{ success: boolean; output: string; duration: number }> {
  console.log(`\n🧪 Running ${suite.description}...`);
  const startTime = Date.now();

  try {
    const output = execSync(suite.command, {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    const duration = Date.now() - startTime;
    console.log(
      `✅ ${suite.description} completed in ${Math.round(duration / 1000)}s`
    );

    return { success: true, output, duration };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.log(
      `❌ ${suite.description} failed after ${Math.round(duration / 1000)}s`
    );

    return {
      success: false,
      output: error.stdout || error.message,
      duration,
    };
  }
}

async function generateComprehensiveReport(results: any[]) {
  console.log('\n📊 Generating comprehensive test report...');

  // Get database statistics
  const dbStats = await testHelper.getDatabaseStats();

  // Calculate overall statistics
  const totalTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.total || 0),
    0
  );
  const passedTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.passed || 0),
    0
  );
  const failedTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.failed || 0),
    0
  );
  const skippedTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.skipped || 0),
    0
  );
  const totalDuration = results.reduce(
    (sum, result) => sum + result.duration,
    0
  );

  const report = {
    summary: {
      totalTestSuites: testSuites.length,
      totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      duration: totalDuration,
      timestamp: new Date().toISOString(),
      successRate: Math.round((passedTests / totalTests) * 100),
    },
    databaseStats: dbStats,
    testSuites: results.map((result, index) => ({
      name: testSuites[index].name,
      description: testSuites[index].description,
      success: result.success,
      duration: result.duration,
      stats: result.json?.stats || {},
      tests: result.json?.tests || [],
    })),
    recommendations: generateRecommendations(results, dbStats),
    coverage: calculateCoverage(results),
  };

  // Save report
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(
    process.cwd(),
    'test-reports',
    `comprehensive-report-${timestamp}.json`
  );

  // Ensure directory exists
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Generate HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlPath = reportPath.replace('.json', '.html');
  fs.writeFileSync(htmlPath, htmlReport);

  console.log(`📄 Comprehensive report saved to: ${reportPath}`);
  console.log(`🌐 HTML report saved to: ${htmlPath}`);

  return report;
}

function generateRecommendations(results: any[], dbStats: any): string[] {
  const recommendations: string[] = [];

  const failedSuites = results.filter(r => !r.success);
  if (failedSuites.length > 0) {
    recommendations.push(`Fix ${failedSuites.length} failed test suites`);
  }

  const totalTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.total || 0),
    0
  );
  const passedTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.passed || 0),
    0
  );
  const successRate = (passedTests / totalTests) * 100;

  if (successRate < 90) {
    recommendations.push(
      `Improve test success rate (currently ${Math.round(successRate)}%)`
    );
  }

  if (dbStats.totalUsers === 0) {
    recommendations.push(
      'Add user creation tests to verify database integration'
    );
  }

  const slowSuites = results.filter(r => r.duration > 60000);
  if (slowSuites.length > 0) {
    recommendations.push(
      `Optimize ${slowSuites.length} slow test suites (>60s)`
    );
  }

  return recommendations;
}

function calculateCoverage(results: any[]): any {
  const totalTests = results.reduce(
    (sum, result) => sum + (result.json?.stats?.total || 0),
    0
  );
  if (totalTests === 0) return {};

  const authTests =
    results.find(r => r.suiteName === 'authentication')?.json?.stats?.total ||
    0;
  const adminTests =
    results.find(r => r.suiteName === 'admin')?.json?.stats?.total || 0;
  const dashboardTests =
    results.find(r => r.suiteName === 'dashboard')?.json?.stats?.total || 0;
  const integrationTests =
    results.find(r => r.suiteName === 'supabase-integration')?.json?.stats
      ?.total || 0;

  return {
    authentication: Math.round((authTests / totalTests) * 100),
    adminPanel: Math.round((adminTests / totalTests) * 100),
    dashboard: Math.round((dashboardTests / totalTests) * 100),
    databaseIntegration: Math.round((integrationTests / totalTests) * 100),
  };
}

function generateHtmlReport(report: any): string {
  const { summary, databaseStats, testSuites, recommendations, coverage } =
    report;

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير الاختبارات الشامل - Comprehensive Test Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            direction: rtl;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 3em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            padding: 40px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .summary-card:hover {
            transform: translateY(-5px);
        }
        .summary-card h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.1em;
        }
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .success-rate { color: #17a2b8; }
        .coverage {
            padding: 40px;
            background: white;
        }
        .coverage h2 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2em;
        }
        .coverage-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        .coverage-item {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-radius: 12px;
            border-left: 5px solid #667eea;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .coverage-item h4 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.2em;
        }
        .coverage-bar {
            width: 100%;
            height: 25px;
            background: #e9ecef;
            border-radius: 12px;
            overflow: hidden;
            margin: 15px 0;
        }
        .coverage-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.8s ease;
            border-radius: 12px;
        }
        .test-suites {
            padding: 40px;
            background: #f8f9fa;
        }
        .test-suites h2 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2em;
        }
        .suite-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
        }
        .suite-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-left: 5px solid #667eea;
        }
        .suite-card.success {
            border-left-color: #28a745;
        }
        .suite-card.failed {
            border-left-color: #dc3545;
        }
        .suite-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .suite-name {
            font-weight: bold;
            font-size: 1.2em;
            color: #333;
        }
        .suite-status {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .suite-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 15px;
        }
        .stat {
            text-align: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .stat-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 0.9em;
            color: #666;
        }
        .recommendations {
            padding: 40px;
            background: #fff3cd;
            border-top: 3px solid #ffeaa7;
        }
        .recommendations h2 {
            color: #856404;
            margin-bottom: 20px;
            text-align: center;
            font-size: 2em;
        }
        .recommendations ul {
            margin: 0;
            padding-right: 20px;
        }
        .recommendations li {
            margin-bottom: 12px;
            color: #856404;
            font-size: 1.1em;
        }
        .footer {
            padding: 30px;
            text-align: center;
            background: #f8f9fa;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
        }
        .footer h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .db-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .db-stat {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .db-stat-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #667eea;
        }
        .db-stat-label {
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>تقرير الاختبارات الشامل</h1>
            <p>Comprehensive Test Report with Supabase Integration</p>
            <p>Generated on ${new Date().toLocaleDateString('ar-SA')} at ${new Date().toLocaleTimeString('ar-SA')}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>إجمالي الاختبارات</h3>
                <div class="number">${summary.totalTests}</div>
            </div>
            <div class="summary-card">
                <h3>نجحت</h3>
                <div class="number passed">${summary.passed}</div>
            </div>
            <div class="summary-card">
                <h3>فشلت</h3>
                <div class="number failed">${summary.failed}</div>
            </div>
            <div class="summary-card">
                <h3>تم تخطيها</h3>
                <div class="number skipped">${summary.skipped}</div>
            </div>
            <div class="summary-card">
                <h3>معدل النجاح</h3>
                <div class="number success-rate">${summary.successRate}%</div>
            </div>
            <div class="summary-card">
                <h3>المدة الزمنية</h3>
                <div class="number">${Math.round(summary.duration / 1000)}s</div>
            </div>
        </div>

        <div class="coverage">
            <h2>تغطية الاختبارات</h2>
            <div class="coverage-grid">
                <div class="coverage-item">
                    <h4>المصادقة والتسجيل</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.authentication || 0}%"></div>
                    </div>
                    <p>${coverage.authentication || 0}%</p>
                </div>
                <div class="coverage-item">
                    <h4>لوحة الإدارة</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.adminPanel || 0}%"></div>
                    </div>
                    <p>${coverage.adminPanel || 0}%</p>
                </div>
                <div class="coverage-item">
                    <h4>لوحة التحكم</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.dashboard || 0}%"></div>
                    </div>
                    <p>${coverage.dashboard || 0}%</p>
                </div>
                <div class="coverage-item">
                    <h4>تكامل قاعدة البيانات</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.databaseIntegration || 0}%"></div>
                    </div>
                    <p>${coverage.databaseIntegration || 0}%</p>
                </div>
            </div>
        </div>

        <div class="test-suites">
            <h2>نتائج مجموعات الاختبارات</h2>
            <div class="suite-grid">
                ${testSuites
                  .map(
                    suite => `
                    <div class="suite-card ${suite.success ? 'success' : 'failed'}">
                        <div class="suite-header">
                            <div class="suite-name">${suite.description}</div>
                            <div class="suite-status ${suite.success ? 'passed' : 'failed'}">
                                ${suite.success ? 'نجح' : 'فشل'}
                            </div>
                        </div>
                        <p><strong>المدة:</strong> ${Math.round(suite.duration / 1000)}s</p>
                        <div class="suite-stats">
                            <div class="stat">
                                <div class="stat-value">${suite.stats.total || 0}</div>
                                <div class="stat-label">إجمالي</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value passed">${suite.stats.passed || 0}</div>
                                <div class="stat-label">نجحت</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value failed">${suite.stats.failed || 0}</div>
                                <div class="stat-label">فشلت</div>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join('')}
            </div>
        </div>

        <div class="recommendations">
            <h2>التوصيات</h2>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <div class="footer">
            <h3>إحصائيات قاعدة البيانات</h3>
            <div class="db-stats">
                <div class="db-stat">
                    <div class="db-stat-value">${databaseStats.totalUsers}</div>
                    <div class="db-stat-label">المستخدمين</div>
                </div>
                <div class="db-stat">
                    <div class="db-stat-value">${databaseStats.totalPatients}</div>
                    <div class="db-stat-label">المرضى</div>
                </div>
                <div class="db-stat">
                    <div class="db-stat-value">${databaseStats.totalAuditLogs}</div>
                    <div class="db-stat-label">سجلات التدقيق</div>
                </div>
                <div class="db-stat">
                    <div class="db-stat-value">${databaseStats.recentUsers}</div>
                    <div class="db-stat-label">مستخدمين جدد</div>
                </div>
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                تم إنشاء التقرير بواسطة نظام الاختبارات الشامل مع تكامل Supabase
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

async function main() {
  console.log('🚀 Starting Comprehensive Test Suite with Supabase Integration');
  console.log('='.repeat(80));

  const startTime = Date.now();
  const results: any[] = [];

  try {
    // Run each test suite
    for (const suite of testSuites) {
      const result = await runTestSuite(suite);

      // Try to parse JSON output
      let jsonOutput = null;
      try {
        jsonOutput = JSON.parse(result.output);
      } catch (e) {
        console.warn(`⚠️  Could not parse JSON output for ${suite.name}`);
      }

      results.push({
        suiteName: suite.name,
        success: result.success,
        duration: result.duration,
        output: result.output,
        json: jsonOutput,
      });
    }

    // Generate comprehensive report
    const report = await generateComprehensiveReport(results);

    const totalDuration = Date.now() - startTime;
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Total Test Suites: ${report.summary.totalTestSuites}`);
    console.log(`🧪 Total Tests: ${report.summary.totalTests}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⏭️  Skipped: ${report.summary.skipped}`);
    console.log(`📈 Success Rate: ${report.summary.successRate}%`);
    console.log(`⏱️  Total Duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`🗄️  Database Users: ${report.databaseStats.totalUsers}`);
    console.log(`🏥 Database Patients: ${report.databaseStats.totalPatients}`);
    console.log(`📝 Audit Logs: ${report.databaseStats.totalAuditLogs}`);
    console.log('='.repeat(80));

    if (report.summary.failed > 0) {
      console.log(
        '⚠️  Some tests failed. Check the detailed report for more information.'
      );
      process.exit(1);
    } else {
      console.log('🎉 All tests passed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
