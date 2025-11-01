#!/usr/bin/env tsx
/**
 * QA & Testing Agent - Main Test Runner
 * Part of Daddy Dodi Framework AI v2.0.0
 * 
 * This script runs all tests in the correct order and generates comprehensive reports
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestModule {
  id: string;
  name: string;
  command: string;
  critical: boolean;
  timeout: number;
}

interface TestResult {
  module: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  exitCode?: number;
  output?: string;
  error?: string;
}

interface QAReport {
  timestamp: string;
  project: string;
  framework: string;
  version: string;
  testResults: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    criticalFailures: number;
  };
  recommendations: string[];
}

class QATestRunner {
  private results: TestResult[] = [];
  private startTime: number = Date.now();

  private modules: TestModule[] = [
    {
      id: 'env-check',
      name: 'Environment Variables Check',
      command: 'node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL ? \'✓ Supabase URL found\' : \'✗ Missing Supabase URL\')"',
      critical: true,
      timeout: 5000,
    },
    {
      id: 'supabase',
      name: 'Supabase Connection & Integration',
      command: 'tsx tests/supabase-connection-test.ts',
      critical: true,
      timeout: 60000,
    },
    {
      id: 'unit-tests',
      name: 'Unit Tests',
      command: 'npm run test:unit',
      critical: false,
      timeout: 120000,
    },
    {
      id: 'e2e-tests',
      name: 'E2E Tests (Playwright)',
      command: 'npm run test',
      critical: true,
      timeout: 300000,
    },
  ];

  private log(message: string, level: 'info' | 'success' | 'error' | 'warn' = 'info'): void {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warn: '\x1b[33m',
    };
    const reset = '\x1b[0m';
    console.log(`${colors[level]}${message}${reset}`);
  }

  private async runModule(module: TestModule): Promise<TestResult> {
    const startTime = Date.now();
    
    this.log(`\n${'═'.repeat(60)}`, 'info');
    this.log(`Testing: ${module.name}`, 'info');
    this.log(`Command: ${module.command}`, 'info');
    this.log(`Critical: ${module.critical ? 'Yes' : 'No'}`, 'info');
    this.log('═'.repeat(60), 'info');

    try {
      const output = execSync(module.command, {
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: module.timeout,
        cwd: process.cwd(),
      });

      const duration = Date.now() - startTime;
      
      this.log(`✅ PASSED: ${module.name} (${duration}ms)`, 'success');
      
      return {
        module: module.name,
        status: 'passed',
        duration,
        exitCode: 0,
        output: output.slice(0, 1000), // Limit output size
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorMessage = error.message || 'Unknown error';
      
      this.log(`❌ FAILED: ${module.name} (${duration}ms)`, 'error');
      this.log(`Error: ${errorMessage}`, 'error');

      return {
        module: module.name,
        status: 'failed',
        duration,
        exitCode: error.status || 1,
        error: errorMessage,
        output: error.stdout?.toString().slice(0, 1000),
      };
    }
  }

  private async runAllTests(): Promise<void> {
    this.log('\n╔════════════════════════════════════════════════════════╗', 'info');
    this.log('║        QA & TESTING AGENT - COMPREHENSIVE TEST         ║', 'info');
    this.log('║         Daddy Dodi Framework AI v2.0.0                 ║', 'info');
    this.log('╚════════════════════════════════════════════════════════╝\n', 'info');

    let criticalFailure = false;

    for (const module of this.modules) {
      if (criticalFailure && module.critical) {
        this.log(`⊘ SKIPPED: ${module.name} (due to previous critical failure)`, 'warn');
        this.results.push({
          module: module.name,
          status: 'skipped',
          duration: 0,
        });
        continue;
      }

      const result = await this.runModule(module);
      this.results.push(result);

      if (result.status === 'failed' && module.critical) {
        criticalFailure = true;
        this.log('🚨 CRITICAL TEST FAILED - Subsequent tests may be affected', 'error');
      }
    }
  }

  private generateReport(): QAReport {
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length,
      criticalFailures: this.results.filter(r => r.status === 'failed' && 
        this.modules.find(m => m.name === r.module)?.critical).length,
    };

    const recommendations: string[] = [];

    if (summary.failed > 0) {
      recommendations.push('❌ Some tests failed. Review the failed test logs before merging.');
    }
    
    if (summary.criticalFailures > 0) {
      recommendations.push('🚨 CRITICAL: Critical tests failed. DO NOT MERGE until fixed.');
    }

    if (summary.skipped > 0) {
      recommendations.push('⚠️ Some tests were skipped. Ensure all tests run successfully.');
    }

    if (summary.failed === 0 && summary.skipped === 0) {
      recommendations.push('✅ All tests passed! Ready for merge.');
    }

    return {
      timestamp: new Date().toISOString(),
      project: 'moeen',
      framework: 'Daddy Dodi Framework AI',
      version: '2.0.0',
      testResults: this.results,
      summary,
      recommendations,
    };
  }

  private saveReport(report: QAReport): void {
    const logsDir = path.join(process.cwd(), 'logs');
    fs.mkdirSync(logsDir, { recursive: true });

    // Save main report
    const reportPath = path.join(logsDir, 'tests_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Save Playwright results if available
    const playwrightResultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    if (fs.existsSync(playwrightResultsPath)) {
      const playwrightResults = fs.readFileSync(playwrightResultsPath, 'utf-8');
      fs.writeFileSync(
        path.join(logsDir, 'playwright_results.json'),
        playwrightResults
      );
    }

    this.log('\n📄 Reports Generated:', 'success');
    this.log(`   - ${reportPath}`, 'info');
    this.log(`   - ${path.join(logsDir, 'supabase_tests.json')}`, 'info');
    if (fs.existsSync(playwrightResultsPath)) {
      this.log(`   - ${path.join(logsDir, 'playwright_results.json')}`, 'info');
    }
  }

  private printSummary(report: QAReport): void {
    const totalDuration = Date.now() - this.startTime;

    this.log('\n' + '═'.repeat(60), 'info');
    this.log('FINAL TEST SUMMARY', 'info');
    this.log('═'.repeat(60), 'info');
    this.log(`Total Tests: ${report.summary.total}`, 'info');
    this.log(`✅ Passed: ${report.summary.passed}`, 'success');
    this.log(`❌ Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'info');
    this.log(`⊘ Skipped: ${report.summary.skipped}`, 'warn');
    this.log(`🚨 Critical Failures: ${report.summary.criticalFailures}`, 
      report.summary.criticalFailures > 0 ? 'error' : 'success');
    this.log(`⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s`, 'info');
    
    if (report.recommendations.length > 0) {
      this.log('\n📋 RECOMMENDATIONS:', 'info');
      report.recommendations.forEach(rec => this.log(`   ${rec}`, 'info'));
    }
    
    this.log('═'.repeat(60) + '\n', 'info');
  }

  async run(): Promise<void> {
    try {
      await this.runAllTests();
      const report = this.generateReport();
      this.saveReport(report);
      this.printSummary(report);

      // Exit with error code if critical tests failed
      if (report.summary.criticalFailures > 0) {
        this.log('🚫 MERGE REJECTED: Critical tests failed', 'error');
        process.exit(1);
      } else if (report.summary.failed > 0) {
        this.log('⚠️  WARNING: Some tests failed, but no critical failures', 'warn');
        process.exit(1);
      } else {
        this.log('✅ ALL TESTS PASSED - Ready for merge!', 'success');
        process.exit(0);
      }
    } catch (error) {
      this.log(`Fatal error: ${error}`, 'error');
      process.exit(1);
    }
  }
}

// Run tests
const runner = new QATestRunner();
runner.run();
