#!/usr/bin/env node

/**
 * Final Testing System
 * نظام الاختبار النهائي المحسن
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FinalTestingSystem {
  constructor() {
    this.results = {};
    this.isServerReady = false;
    this.serverProcess = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix =
      type === 'error'
        ? '❌'
        : type === 'success'
          ? '✅'
          : type === 'warning'
            ? '⚠️'
            : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async checkServerHealth() {
    try {
      const response = await fetch('http://localhost:3001');
      return response.ok;
    } catch {
      return false;
    }
  }

  async startServer() {
    this.log('🚀 Starting development server...');

    try {
      // Check if server is already running
      if (await this.checkServerHealth()) {
        this.log('✅ Server already running');
        this.isServerReady = true;
        return null;
      }

      // Kill any existing server
      await this.runCommand('pkill -f "next dev" || true');

      // Start new server
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: 'pipe',
      });

      this.serverProcess.stdout.on('data', data => {
        const output = data.toString();
        if (output.includes('Ready in')) {
          this.log('✅ Server started successfully');
          this.isServerReady = true;
        }
      });

      this.serverProcess.stderr.on('data', data => {
        const error = data.toString();
        if (error.includes('Error') || error.includes('Failed')) {
          this.log(`Server error: ${error}`, 'error');
        }
      });

      // Wait for server to be ready
      let attempts = 0;
      while (!this.isServerReady && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isServerReady = await this.checkServerHealth();
        attempts++;
      }

      if (!this.isServerReady) {
        throw new Error('Server failed to start within 30 seconds');
      }

      return this.serverProcess;
    } catch (error) {
      this.log(`Failed to start server: ${error.message}`, 'error');
      throw error;
    }
  }

  async stopServer() {
    if (this.serverProcess) {
      this.log('🛑 Stopping development server...');
      this.serverProcess.kill('SIGINT');
      this.serverProcess = null;
      this.isServerReady = false;
    }
  }

  async runTypeScriptCheck() {
    this.log('🔍 Running TypeScript compilation check...');

    try {
      await this.runCommand('npx tsc --noEmit --skipLibCheck');
      this.log('✅ TypeScript compilation successful');
      return { success: true, errors: 0 };
    } catch (error) {
      const errorCount = (error.stdout.match(/error TS/g) || []).length;
      this.log(`⚠️ TypeScript found ${errorCount} errors`, 'warning');
      return { success: false, errors: errorCount, output: error.stdout };
    }
  }

  async runLinting() {
    this.log('🔍 Running ESLint...');

    try {
      await this.runCommand('npm run lint');
      this.log('✅ ESLint passed');
      return { success: true, errors: 0 };
    } catch (error) {
      this.log('⚠️ ESLint found issues', 'warning');
      return { success: false, errors: 1, output: error.stdout };
    }
  }

  async runBuildTest() {
    this.log('🔨 Testing production build...');

    try {
      await this.runCommand('npm run build');
      this.log('✅ Production build successful');
      return { success: true };
    } catch (error) {
      this.log('❌ Production build failed', 'error');
      return { success: false, output: error.stdout };
    }
  }

  async runE2ETests() {
    this.log('🧪 Running end-to-end tests...');

    try {
      const { stdout, stderr } = await this.runCommand(
        'npx playwright test --config=playwright-auto.config.ts --reporter=json',
        { timeout: 300000 }
      );

      let results;
      try {
        results = JSON.parse(stdout);
      } catch (parseError) {
        this.log('⚠️ Could not parse test results', 'warning');
        return { success: false, error: 'Parse error' };
      }

      const totalTests =
        results.suites?.reduce(
          (total, suite) =>
            total +
            (suite.specs?.reduce(
              (specTotal, spec) => specTotal + (spec.tests?.length || 0),
              0
            ) || 0),
          0
        ) || 0;

      const passedTests =
        results.suites?.reduce(
          (total, suite) =>
            total +
            (suite.specs?.reduce(
              (specTotal, spec) =>
                specTotal +
                (spec.tests?.reduce(
                  (testTotal, test) =>
                    testTotal +
                    (test.results?.filter(r => r.status === 'passed').length ||
                      0),
                  0
                ) || 0),
              0
            ) || 0),
          0
        ) || 0;

      const success = passedTests === totalTests && totalTests > 0;

      if (success) {
        this.log(`✅ All ${passedTests}/${totalTests} tests passed`);
      } else {
        this.log(`❌ ${passedTests}/${totalTests} tests passed`, 'error');
      }

      return {
        success,
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        results,
      };
    } catch (error) {
      this.log(`❌ E2E tests failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async runHealthChecks() {
    this.log('🏥 Running health checks...');

    const healthChecks = [];

    // Check if server responds
    try {
      const response = await fetch('http://localhost:3001');
      healthChecks.push({
        name: 'Server Response',
        status: response.ok ? 'healthy' : 'unhealthy',
        details: `Status: ${response.status}`,
      });
    } catch (error) {
      healthChecks.push({
        name: 'Server Response',
        status: 'unhealthy',
        details: error.message,
      });
    }

    // Check API endpoints
    const apiEndpoints = [
      '/api/auth/login',
      '/api/dashboard/health',
      '/api/test/health',
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`http://localhost:3001${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        healthChecks.push({
          name: `API ${endpoint}`,
          status: response.ok ? 'healthy' : 'unhealthy',
          details: `Status: ${response.status}`,
        });
      } catch (error) {
        healthChecks.push({
          name: `API ${endpoint}`,
          status: 'unhealthy',
          details: error.message,
        });
      }
    }

    const healthyCount = healthChecks.filter(
      check => check.status === 'healthy'
    ).length;
    const totalCount = healthChecks.length;

    this.log(`🏥 Health checks: ${healthyCount}/${totalCount} healthy`);

    return {
      total: totalCount,
      healthy: healthyCount,
      checks: healthChecks,
    };
  }

  async runComprehensiveTest() {
    this.log('🚀 Starting comprehensive system test...');

    const results = {
      timestamp: new Date().toISOString(),
      typescript: null,
      linting: null,
      build: null,
      e2e: null,
      health: null,
      overall: 'pending',
    };

    try {
      // Start server
      await this.startServer();

      // Run all tests
      results.typescript = await this.runTypeScriptCheck();
      results.linting = await this.runLinting();
      results.build = await this.runBuildTest();
      results.e2e = await this.runE2ETests();
      results.health = await this.runHealthChecks();

      // Calculate overall status
      const allPassed = [
        results.typescript.success,
        results.linting.success,
        results.build.success,
        results.e2e.success,
        results.health.healthy > 0,
      ].every(Boolean);

      results.overall = allPassed ? 'success' : 'partial';

      if (allPassed) {
        this.log('🎉 All tests passed! System is fully functional.', 'success');
      } else {
        this.log('⚠️ Some tests failed. System needs attention.', 'warning');
      }

      return results;
    } catch (error) {
      this.log(`❌ Comprehensive test failed: ${error.message}`, 'error');
      results.overall = 'failed';
      results.error = error.message;
      return results;
    } finally {
      await this.stopServer();
    }
  }

  saveResults(results) {
    const report = {
      ...results,
      summary: {
        overall: results.overall,
        typescript: results.typescript?.success ? 'passed' : 'failed',
        linting: results.linting?.success ? 'passed' : 'failed',
        build: results.build?.success ? 'passed' : 'failed',
        e2e: results.e2e?.success ? 'passed' : 'failed',
        health: results.health
          ? `${results.health.healthy}/${results.health.total} healthy`
          : 'unknown',
      },
    };

    fs.writeFileSync(
      'final-test-results.json',
      JSON.stringify(report, null, 2)
    );
    this.log('💾 Final test results saved to final-test-results.json');
  }

  async run() {
    try {
      const results = await this.runComprehensiveTest();
      this.saveResults(results);

      this.log('✅ Final testing system completed!', 'success');

      return results;
    } catch (error) {
      this.log(`❌ Final testing failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the system
if (require.main === module) {
  const system = new FinalTestingSystem();
  system.run().catch(error => {
    console.error('Final testing failed:', error);
    process.exit(1);
  });
}

module.exports = FinalTestingSystem;
