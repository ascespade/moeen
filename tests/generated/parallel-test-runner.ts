/**
 * Parallel Test Runner - مشغل الاختبارات المتوازي
 * Runs all module tests in parallel for maximum efficiency
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestModule {
  name: string;
  path: string;
  priority: number;
  estimatedDuration: number;
}

interface TestResult {
  module: string;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  errors: string[];
}

class ParallelTestRunner {
  private modules: TestModule[] = [
    { name: 'Authentication', path: 'tests/generated/modules/authentication-comprehensive.spec.ts', priority: 1, estimatedDuration: 300 },
    { name: 'Patients', path: 'tests/generated/modules/patients-comprehensive.spec.ts', priority: 1, estimatedDuration: 300 },
    { name: 'Appointments', path: 'tests/generated/modules/appointments-comprehensive.spec.ts', priority: 1, estimatedDuration: 300 },
    { name: 'Medical Records', path: 'tests/generated/modules/medical-records-comprehensive.spec.ts', priority: 2, estimatedDuration: 300 },
    { name: 'Doctors', path: 'tests/generated/modules/doctors-comprehensive.spec.ts', priority: 2, estimatedDuration: 300 },
    { name: 'Dashboard', path: 'tests/generated/modules/dashboard-comprehensive.spec.ts', priority: 2, estimatedDuration: 300 },
    { name: 'Insurance', path: 'tests/generated/modules/insurance-comprehensive.spec.ts', priority: 3, estimatedDuration: 300 },
    { name: 'Notifications', path: 'tests/generated/modules/notifications-comprehensive.spec.ts', priority: 3, estimatedDuration: 300 },
    { name: 'Admin', path: 'tests/generated/modules/admin-comprehensive.spec.ts', priority: 3, estimatedDuration: 300 }
  ];

  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests() {
    console.log('🚀 Starting Parallel Test Execution...');
    this.startTime = Date.now();

    // Group modules by priority for parallel execution
    const priorityGroups = this.groupByPriority();
    
    for (const [priority, modules] of priorityGroups) {
      console.log(`📊 Running Priority ${priority} modules in parallel...`);
      await this.runModulesInParallel(modules);
    }

    await this.generateReport();
  }

  private groupByPriority(): Map<number, TestModule[]> {
    const groups = new Map<number, TestModule[]>();
    
    for (const module of this.modules) {
      if (!groups.has(module.priority)) {
        groups.set(module.priority, []);
      }
      groups.get(module.priority)!.push(module);
    }
    
    return groups;
  }

  private async runModulesInParallel(modules: TestModule[]) {
    const promises = modules.map(module => this.runModule(module));
    await Promise.all(promises);
  }

  private async runModule(module: TestModule): Promise<void> {
    console.log(`🧪 Running ${module.name} tests...`);
    
    try {
      const startTime = Date.now();
      
      // Run the specific test file
      const { stdout, stderr } = await execAsync(`npx playwright test ${module.path} --reporter=json`);
      
      const duration = Date.now() - startTime;
      
      // Parse results (simplified)
      const result: TestResult = {
        module: module.name,
        passed: this.extractPassedCount(stdout),
        failed: this.extractFailedCount(stdout),
        skipped: this.extractSkippedCount(stdout),
        duration: duration,
        errors: this.extractErrors(stderr)
      };
      
      this.results.push(result);
      
      console.log(`✅ ${module.name} completed: ${result.passed} passed, ${result.failed} failed`);
      
    } catch (error) {
      console.error(`❌ ${module.name} failed:`, error);
      
      this.results.push({
        module: module.name,
        passed: 0,
        failed: 1,
        skipped: 0,
        duration: 0,
        errors: [error.toString()]
      });
    }
  }

  private extractPassedCount(output: string): number {
    const match = output.match(/"passed":\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private extractFailedCount(output: string): number {
    const match = output.match(/"failed":\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private extractSkippedCount(output: string): number {
    const match = output.match(/"skipped":\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private extractErrors(output: string): string[] {
    const errors: string[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('Error:') || line.includes('Failed:')) {
        errors.push(line.trim());
      }
    }
    
    return errors;
  }

  private async generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalSkipped = this.results.reduce((sum, r) => sum + r.skipped, 0);
    const totalTests = totalPassed + totalFailed + totalSkipped;
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('================================');
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`✅ Total Passed: ${totalPassed}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`⏭️  Total Skipped: ${totalSkipped}`);
    console.log(`📈 Success Rate: ${successRate.toFixed(2)}%`);
    console.log('\n📋 Module Results:');
    console.log('------------------');

    for (const result of this.results) {
      const status = result.failed === 0 ? '✅' : '❌';
      console.log(`${status} ${result.module}: ${result.passed} passed, ${result.failed} failed (${result.duration}ms)`);
      
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
    }

    // Generate detailed report file
    await this.writeDetailedReport(totalDuration, totalPassed, totalFailed, totalSkipped, successRate);
  }

  private async writeDetailedReport(duration: number, passed: number, failed: number, skipped: number, successRate: number) {
    const report = {
      summary: {
        totalDuration: duration,
        totalPassed: passed,
        totalFailed: failed,
        totalSkipped: skipped,
        totalTests: passed + failed + skipped,
        successRate: successRate,
        timestamp: new Date().toISOString()
      },
      modules: this.results,
      recommendations: this.generateRecommendations()
    };

    const fs = require('fs');
    const path = require('path');
    
    const reportPath = path.join(process.cwd(), 'test-reports', 'comprehensive-test-report.json');
    await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedModules = this.results.filter(r => r.failed > 0);
    if (failedModules.length > 0) {
      recommendations.push(`Focus on fixing ${failedModules.length} modules with failures`);
    }
    
    const slowModules = this.results.filter(r => r.duration > 60000);
    if (slowModules.length > 0) {
      recommendations.push(`Optimize performance for ${slowModules.length} slow modules`);
    }
    
    const successRate = this.results.reduce((sum, r) => sum + (r.passed / (r.passed + r.failed + r.skipped)), 0) / this.results.length;
    if (successRate < 0.95) {
      recommendations.push('Improve test coverage and fix failing tests to achieve 95%+ success rate');
    }
    
    return recommendations;
  }
}

// Export for use in test files
export { ParallelTestRunner };

// Run if called directly
if (require.main === module) {
  const runner = new ParallelTestRunner();
  runner.runAllTests().catch(console.error);
}