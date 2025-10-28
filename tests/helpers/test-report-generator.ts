/**
 * Test Report Generator - مولد تقارير الاختبارات
 * Generates comprehensive test reports with database integration details
 */

import { testHelper } from './supabase-test-helper';
import fs from 'fs';
import path from 'path';

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  databaseOperations: DatabaseOperation[];
  screenshots?: string[];
}

export interface DatabaseOperation {
  operation: string;
  table: string;
  success: boolean;
  duration: number;
  error?: string;
}

export interface TestReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    timestamp: string;
  };
  databaseStats: {
    totalUsers: number;
    totalPatients: number;
    totalAuditLogs: number;
    recentUsers: number;
  };
  testResults: TestResult[];
  recommendations: string[];
  coverage: {
    authentication: number;
    userManagement: number;
    patientManagement: number;
    adminPanel: number;
    databaseIntegration: number;
  };
}

export class TestReportGenerator {
  private results: TestResult[] = [];
  private startTime: number = Date.now();

  addTestResult(result: TestResult): void {
    this.results.push(result);
  }

  async generateReport(): Promise<TestReport> {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    // Get database statistics
    const databaseStats = await testHelper.getDatabaseStats();

    // Calculate summary
    const summary = {
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Calculate coverage
    const coverage = this.calculateCoverage();

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    const report: TestReport = {
      summary,
      databaseStats,
      testResults: this.results,
      recommendations,
      coverage,
    };

    return report;
  }

  private calculateCoverage(): TestReport['coverage'] {
    const totalTests = this.results.length;
    if (totalTests === 0) {
      return {
        authentication: 0,
        userManagement: 0,
        patientManagement: 0,
        adminPanel: 0,
        databaseIntegration: 0,
      };
    }

    const authTests = this.results.filter(
      r =>
        r.testName.includes('login') ||
        r.testName.includes('register') ||
        r.testName.includes('forgot-password')
    ).length;

    const userMgmtTests = this.results.filter(
      r => r.testName.includes('user') || r.testName.includes('admin')
    ).length;

    const patientMgmtTests = this.results.filter(r =>
      r.testName.includes('patient')
    ).length;

    const adminTests = this.results.filter(r =>
      r.testName.includes('admin')
    ).length;

    const dbTests = this.results.filter(
      r => r.databaseOperations.length > 0
    ).length;

    return {
      authentication: Math.round((authTests / totalTests) * 100),
      userManagement: Math.round((userMgmtTests / totalTests) * 100),
      patientManagement: Math.round((patientMgmtTests / totalTests) * 100),
      adminPanel: Math.round((adminTests / totalTests) * 100),
      databaseIntegration: Math.round((dbTests / totalTests) * 100),
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const failedTests = this.results.filter(r => r.status === 'failed');

    if (failedTests.length > 0) {
      recommendations.push(
        `Fix ${failedTests.length} failed tests to improve reliability`
      );
    }

    const dbOperationFailures = this.results.filter(r =>
      r.databaseOperations.some(op => !op.success)
    );

    if (dbOperationFailures.length > 0) {
      recommendations.push(
        'Review database operations - some failed during testing'
      );
    }

    const slowTests = this.results.filter(r => r.duration > 10000);
    if (slowTests.length > 0) {
      recommendations.push(
        `Optimize ${slowTests.length} slow tests (>10s) for better performance`
      );
    }

    const coverage = this.calculateCoverage();
    if (coverage.databaseIntegration < 80) {
      recommendations.push('Increase database integration test coverage');
    }

    if (coverage.authentication < 90) {
      recommendations.push('Add more authentication flow tests');
    }

    return recommendations;
  }

  async saveReport(report: TestReport, filename?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFilename = filename || `test-report-${timestamp}.json`;
    const reportPath = path.join(process.cwd(), 'test-reports', reportFilename);

    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Save JSON report
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHtmlReport(report);
    const htmlPath = reportPath.replace('.json', '.html');
    fs.writeFileSync(htmlPath, htmlReport);

    return reportPath;
  }

  private generateHtmlReport(report: TestReport): string {
    const { summary, databaseStats, testResults, recommendations, coverage } =
      report;

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير الاختبارات - Test Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            direction: rtl;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .coverage {
            padding: 30px;
        }
        .coverage h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .coverage-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        .coverage-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .coverage-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
        }
        .coverage-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        .test-results {
            padding: 30px;
        }
        .test-results h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .test-item {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .test-header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .test-name {
            font-weight: bold;
            color: #333;
        }
        .test-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .test-details {
            padding: 20px;
        }
        .database-ops {
            margin-top: 15px;
        }
        .db-op {
            background: #f8f9fa;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            font-family: monospace;
            font-size: 0.9em;
        }
        .recommendations {
            padding: 30px;
            background: #fff3cd;
            border-top: 1px solid #ffeaa7;
        }
        .recommendations h2 {
            color: #856404;
            margin-bottom: 15px;
        }
        .recommendations ul {
            margin: 0;
            padding-right: 20px;
        }
        .recommendations li {
            margin-bottom: 8px;
            color: #856404;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>تقرير الاختبارات الشامل</h1>
            <p>Comprehensive Test Report - ${new Date().toLocaleDateString('ar-SA')}</p>
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
                        <div class="coverage-fill" style="width: ${coverage.authentication}%"></div>
                    </div>
                    <p>${coverage.authentication}%</p>
                </div>
                <div class="coverage-item">
                    <h4>إدارة المستخدمين</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.userManagement}%"></div>
                    </div>
                    <p>${coverage.userManagement}%</p>
                </div>
                <div class="coverage-item">
                    <h4>إدارة المرضى</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.patientManagement}%"></div>
                    </div>
                    <p>${coverage.patientManagement}%</p>
                </div>
                <div class="coverage-item">
                    <h4>لوحة الإدارة</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.adminPanel}%"></div>
                    </div>
                    <p>${coverage.adminPanel}%</p>
                </div>
                <div class="coverage-item">
                    <h4>تكامل قاعدة البيانات</h4>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${coverage.databaseIntegration}%"></div>
                    </div>
                    <p>${coverage.databaseIntegration}%</p>
                </div>
            </div>
        </div>

        <div class="test-results">
            <h2>نتائج الاختبارات التفصيلية</h2>
            ${testResults
              .map(
                result => `
                <div class="test-item">
                    <div class="test-header">
                        <div class="test-name">${result.testName}</div>
                        <div class="test-status ${result.status}">${result.status}</div>
                    </div>
                    <div class="test-details">
                        <p><strong>المدة:</strong> ${result.duration}ms</p>
                        ${result.error ? `<p><strong>الخطأ:</strong> ${result.error}</p>` : ''}
                        ${
                          result.databaseOperations.length > 0
                            ? `
                            <div class="database-ops">
                                <h4>عمليات قاعدة البيانات:</h4>
                                ${result.databaseOperations
                                  .map(
                                    op => `
                                    <div class="db-op">
                                        ${op.operation} → ${op.table} (${op.success ? 'نجح' : 'فشل'}) - ${op.duration}ms
                                        ${op.error ? `<br><small>خطأ: ${op.error}</small>` : ''}
                                    </div>
                                `
                                  )
                                  .join('')}
                            </div>
                        `
                            : ''
                        }
                    </div>
                </div>
            `
              )
              .join('')}
        </div>

        <div class="recommendations">
            <h2>التوصيات</h2>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <div class="footer">
            <p>تم إنشاء التقرير في ${new Date().toLocaleString('ar-SA')}</p>
            <p>إحصائيات قاعدة البيانات: ${databaseStats.totalUsers} مستخدم، ${databaseStats.totalPatients} مريض، ${databaseStats.totalAuditLogs} سجل تدقيق</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}

export const reportGenerator = new TestReportGenerator();
