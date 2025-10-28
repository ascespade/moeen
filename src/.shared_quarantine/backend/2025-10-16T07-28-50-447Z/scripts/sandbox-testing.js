#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class SandboxTesting {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.sandboxDir = path.join(this.workspaceRoot, 'sandbox');
    this.logFile = path.join(this.workspaceRoot, 'logs', 'sandbox-testing.log');
    this.testResultsFile = path.join(
      this.workspaceRoot,
      'temp',
      'sandbox-test-results.json'
    );
    this.testHistoryFile = path.join(
      this.workspaceRoot,
      'learning',
      'test-history.json'
    );
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] Sandbox Testing: ${message}\n`;

    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async initialize() {
    this.log('Initializing Sandbox Testing...');

    // Create sandbox directory
    if (!fs.existsSync(this.sandboxDir)) {
      fs.mkdirSync(this.sandboxDir, { recursive: true });
    }

    // Create test directories
    const testDirs = ['scripts', 'config', 'temp', 'logs', 'reports'];
    for (const dir of testDirs) {
      const testDir = path.join(this.sandboxDir, dir);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
    }

    this.log('Sandbox Testing initialized');
  }

  async createSandboxEnvironment() {
    this.log('Creating sandbox environment...');

    // Copy essential files to sandbox
    const filesToCopy = [
      'package.json',
      'next.config.js',
      'tailwind.config.js',
      'tsconfig.json',
    ];

    for (const file of filesToCopy) {
      const sourcePath = path.join(this.workspaceRoot, file);
      const destPath = path.join(this.sandboxDir, file);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        this.log(`Copied ${file} to sandbox`);
      }
    }

    // Create sandbox-specific configuration
    await this.createSandboxConfig();

    this.log('Sandbox environment created');
  }

  async createSandboxConfig() {
    const sandboxConfig = {
      environment: 'sandbox',
      database: {
        url: 'sandbox://localhost:5432/sandbox_db',
        enabled: false,
      },
      logging: {
        level: 'debug',
        file: 'sandbox-test.log',
      },
      testing: {
        enabled: true,
        timeout: 30000,
        retries: 3,
      },
    };

    const configFile = path.join(
      this.sandboxDir,
      'config',
      'sandbox-config.json'
    );
    fs.writeFileSync(configFile, JSON.stringify(sandboxConfig, null, 2));
  }

  async runTest(testName, testFunction) {
    this.log(`Running test: ${testName}`);

    const testStartTime = Date.now();
    const testResult = {
      name: testName,
      startTime: new Date().toISOString(),
      success: false,
      duration: 0,
      error: null,
      output: '',
      warnings: [],
    };

    try {
      // Run test in sandbox environment
      const result = await testFunction();

      testResult.success = result.success || false;
      testResult.output = result.output || '';
      testResult.warnings = result.warnings || [];

      if (!testResult.success) {
        testResult.error = result.error || 'Test failed';
      }
    } catch (error) {
      testResult.success = false;
      testResult.error = error.message;
      this.log(`Test ${testName} failed: ${error.message}`, 'error');
    }

    testResult.duration = Date.now() - testStartTime;
    testResult.endTime = new Date().toISOString();

    // Log test result
    if (testResult.success) {
      this.log(`Test ${testName} passed in ${testResult.duration}ms`);
    } else {
      this.log(`Test ${testName} failed: ${testResult.error}`, 'error');
    }

    return testResult;
  }

  async testScriptExecution(scriptPath) {
    return this.runTest(`Script Execution: ${scriptPath}`, async () => {
      return new Promise(resolve => {
        const child = spawn('node', [scriptPath], {
          cwd: this.sandboxDir,
          stdio: 'pipe',
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', data => {
          stdout += data.toString();
        });

        child.stderr.on('data', data => {
          stderr += data.toString();
        });

        child.on('close', code => {
          resolve({
            success: code === 0,
            output: stdout,
            error: code !== 0 ? stderr : null,
          });
        });

        child.on('error', error => {
          resolve({
            success: false,
            error: error.message,
          });
        });
      });
    });
  }

  async testConfigurationChanges(configPath, changes) {
    return this.runTest(`Configuration Changes: ${configPath}`, async () => {
      try {
        // Backup original config
        const backupPath = configPath + '.backup';
        if (fs.existsSync(configPath)) {
          fs.copyFileSync(configPath, backupPath);
        }

        // Apply changes
        let config = {};
        if (fs.existsSync(configPath)) {
          const data = fs.readFileSync(configPath, 'utf8');
          config = JSON.parse(data);
        }

        // Merge changes
        Object.assign(config, changes);

        // Write modified config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        // Test if system still works
        const testResult = await this.testSystemHealth();

        // Restore original config
        if (fs.existsSync(backupPath)) {
          fs.copyFileSync(backupPath, configPath);
          fs.unlinkSync(backupPath);
        }

        return {
          success: testResult.success,
          output: `Configuration changes applied and tested`,
          warnings: testResult.warnings || [],
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    });
  }

  async testSystemHealth() {
    return this.runTest('System Health Check', async () => {
      const healthChecks = [];

      // Check if essential directories exist
      const essentialDirs = ['temp', 'logs', 'reports', 'config'];
      for (const dir of essentialDirs) {
        const dirPath = path.join(this.sandboxDir, dir);
        healthChecks.push({
          check: `Directory ${dir} exists`,
          success: fs.existsSync(dirPath),
        });
      }

      // Check if essential files exist
      const essentialFiles = ['package.json', 'next.config.js'];
      for (const file of essentialFiles) {
        const filePath = path.join(this.sandboxDir, file);
        healthChecks.push({
          check: `File ${file} exists`,
          success: fs.existsSync(filePath),
        });
      }

      const allPassed = healthChecks.every(check => check.success);
      const failedChecks = healthChecks.filter(check => !check.success);

      return {
        success: allPassed,
        output: `Health checks: ${healthChecks.length - failedChecks.length}/${healthChecks.length} passed`,
        warnings: failedChecks.map(check => check.check),
      };
    });
  }

  async testPerformanceOptimization(optimization) {
    return this.runTest(
      `Performance Optimization: ${optimization.type}`,
      async () => {
        const startTime = Date.now();

        try {
          // Apply optimization
          await this.applyOptimization(optimization);

          // Measure performance
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Test if optimization improved performance
          const performanceGain = this.calculatePerformanceGain(
            optimization,
            duration
          );

          return {
            success: performanceGain > 0,
            output: `Optimization applied, performance gain: ${performanceGain}%`,
            warnings: performanceGain < 0 ? ['Performance degraded'] : [],
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
          };
        }
      }
    );
  }

  async applyOptimization(optimization) {
    switch (optimization.type) {
      case 'memory_cleanup':
        if (global.gc) {
          global.gc();
        }
        break;
      case 'file_cleanup':
        await this.cleanupSandboxFiles();
        break;
      case 'config_optimization':
        await this.optimizeSandboxConfig(optimization.config);
        break;
      default:
        throw new Error(`Unknown optimization type: ${optimization.type}`);
    }
  }

  async cleanupSandboxFiles() {
    const tempDir = path.join(this.sandboxDir, 'temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        const age = Date.now() - stats.mtime.getTime();

        if (age > 24 * 60 * 60 * 1000) {
          // 24 hours
          fs.unlinkSync(filePath);
        }
      }
    }
  }

  async optimizeSandboxConfig(configChanges) {
    const configFile = path.join(
      this.sandboxDir,
      'config',
      'sandbox-config.json'
    );
    let config = {};

    if (fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile, 'utf8');
      config = JSON.parse(data);
    }

    Object.assign(config, configChanges);
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  }

  calculatePerformanceGain(optimization, duration) {
    // Simple performance gain calculation
    const baseline = optimization.baseline || 1000; // 1 second baseline
    return ((baseline - duration) / baseline) * 100;
  }

  async runTestSuite() {
    this.log('Running sandbox test suite...');

    const tests = [
      () => this.testSystemHealth(),
      () => this.testScriptExecution('scripts/test-script.js'),
      () =>
        this.testConfigurationChanges(
          path.join(this.sandboxDir, 'config', 'sandbox-config.json'),
          { testing: { timeout: 60000 } }
        ),
      () =>
        this.testPerformanceOptimization({
          type: 'memory_cleanup',
          baseline: 1000,
        }),
    ];

    const results = [];

    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
      } catch (error) {
        results.push({
          name: 'Unknown Test',
          success: false,
          error: error.message,
          duration: 0,
        });
      }
    }

    return results;
  }

  async generateTestReport() {
    this.log('Generating test report...');

    const testResults = await this.runTestSuite();

    const report = {
      timestamp: new Date().toISOString(),
      environment: 'sandbox',
      tests: testResults,
      summary: {
        totalTests: testResults.length,
        passedTests: testResults.filter(t => t.success).length,
        failedTests: testResults.filter(t => !t.success).length,
        successRate:
          testResults.length > 0
            ? testResults.filter(t => t.success).length / testResults.length
            : 0,
        averageDuration:
          testResults.length > 0
            ? testResults.reduce((sum, t) => sum + t.duration, 0) /
              testResults.length
            : 0,
      },
    };

    // Save test results
    fs.writeFileSync(this.testResultsFile, JSON.stringify(report, null, 2));

    // Save to test history
    await this.saveTestHistory(report);

    this.log(
      `Test report generated: ${report.summary.passedTests}/${report.summary.totalTests} tests passed`
    );
    return report;
  }

  async saveTestHistory(report) {
    let history = [];

    if (fs.existsSync(this.testHistoryFile)) {
      try {
        const data = fs.readFileSync(this.testHistoryFile, 'utf8');
        history = JSON.parse(data);
      } catch (error) {
        this.log(`Error loading test history: ${error.message}`, 'warn');
      }
    }

    history.push(report);

    // Keep only last 100 test runs
    if (history.length > 100) {
      history = history.slice(-100);
    }

    fs.writeFileSync(this.testHistoryFile, JSON.stringify(history, null, 2));
  }

  async start() {
    this.log('Starting Sandbox Testing...');

    await this.initialize();
    await this.createSandboxEnvironment();

    // Run initial test suite
    const report = await this.generateTestReport();

    // Set up continuous testing
    const testingInterval = setInterval(async () => {
      try {
        await this.generateTestReport();
      } catch (error) {
        this.log(`Testing error: ${error.message}`, 'error');
      }
    }, 300000); // Every 5 minutes

    // Cleanup on exit
    process.on('SIGINT', () => {
      clearInterval(testingInterval);
      this.log('Sandbox Testing stopped');
    });

    process.on('SIGTERM', () => {
      clearInterval(testingInterval);
      this.log('Sandbox Testing stopped');
    });
  }
}

// Main execution
if (require.main === module) {
  const sandbox = new SandboxTesting();
  sandbox.start().catch(error => {
    console.error('Sandbox Testing failed:', error);
    process.exit(1);
  });
}

module.exports = SandboxTesting;
