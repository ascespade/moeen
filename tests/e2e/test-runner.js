#!/usr/bin/env node
// test-runner.js
// Comprehensive Test Runner for All Automation Systems
// Executes Playwright tests with detailed reporting and analysis

const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const winston = require("winston");

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "logs/test-runner.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

class TestRunner {
  constructor() {
    this.config = {
      testSuites: [
        "dashboard.spec.ts",
        "admin.spec.ts",
        "chatbot.spec.ts",
        "automation.spec.ts",
      ],
      browsers: ["chromium", "firefox", "webkit"],
      retries: 2,
      timeout: 30000,
      parallel: true,
      reportDir: "./test-results",
      screenshotsDir: "./test-results/screenshots",
      videosDir: "./test-results/videos",
      tracesDir: "./test-results/traces",
    };

    this.results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      suites: [],
      startTime: null,
      endTime: null,
    };
  }

  async run() {
    logger.info("🚀 Starting comprehensive test run...");

    try {
      // Initialize test environment
      await this.initializeTestEnvironment();

      // Run test suites
      await this.runTestSuites();

      // Generate reports
      await this.generateReports();

      // Analyze results
      await this.analyzeResults();

      logger.info("✅ Test run completed successfully");
    } catch (error) {
      logger.error("❌ Test run failed:", error);
      process.exit(1);
    }
  }

  async initializeTestEnvironment() {
    logger.info("🔧 Initializing test environment...");

    try {
      // Create test result directories
      const dirs = [
        this.config.reportDir,
        this.config.screenshotsDir,
        this.config.videosDir,
        this.config.tracesDir,
        "./logs",
      ];

      for (const dir of dirs) {
        await fs.mkdir(dir, { recursive: true });
      }

      // Install Playwright browsers if needed
      await this.installPlaywrightBrowsers();

      // Verify test environment
      await this.verifyTestEnvironment();

      logger.info("✅ Test environment initialized");
    } catch (error) {
      logger.error("❌ Test environment initialization failed:", error);
      throw error;
    }
  }

  async installPlaywrightBrowsers() {
    logger.info("🌐 Installing Playwright browsers...");

    return new Promise((resolve, reject) => {
      exec("npx playwright install", (error, stdout, stderr) => {
        if (error) {
          logger.error("❌ Failed to install Playwright browsers:", error);
          reject(error);
        } else {
          logger.info("✅ Playwright browsers installed");
          resolve();
        }
      });
    });
  }

  async verifyTestEnvironment() {
    logger.info("🔍 Verifying test environment...");

    try {
      // Check if Playwright is installed
      const { exec } = require("child_process");
      const { promisify } = require("util");
      const execAsync = promisify(exec);

      await execAsync("npx playwright --version");

      // Check if test files exist
      for (const suite of this.config.testSuites) {
        const testFile = path.join("./tests/e2e", suite);
        try {
          await fs.access(testFile);
        } catch (error) {
          logger.warn(`⚠️ Test file not found: ${suite}`);
        }
      }

      logger.info("✅ Test environment verified");
    } catch (error) {
      logger.error("❌ Test environment verification failed:", error);
      throw error;
    }
  }

  async runTestSuites() {
    logger.info("🧪 Running test suites...");

    this.results.startTime = new Date();

    for (const suite of this.config.testSuites) {
      try {
        logger.info(`📋 Running test suite: ${suite}`);
        await this.runTestSuite(suite);
      } catch (error) {
        logger.error(`❌ Test suite ${suite} failed:`, error);
        this.results.failed++;
      }
    }

    this.results.endTime = new Date();
    this.results.duration =
      this.results.endTime.getTime() - this.results.startTime.getTime();
  }

  async runTestSuite(suiteName) {
    return new Promise((resolve, reject) => {
      const command = `npx playwright test tests/e2e/${suiteName} --reporter=json --output-dir=${this.config.reportDir}`;

      exec(
        command,
        { timeout: this.config.timeout },
        async (error, stdout, stderr) => {
          if (error) {
            logger.error(`❌ Test suite ${suiteName} execution failed:`, error);
            reject(error);
          } else {
            try {
              // Parse test results
              const results = await this.parseTestResults(stdout);
              this.results.suites.push({
                name: suiteName,
                ...results,
              });

              this.results.totalTests += results.totalTests || 0;
              this.results.passed += results.passed || 0;
              this.results.failed += results.failed || 0;
              this.results.skipped += results.skipped || 0;

              logger.info(
                `✅ Test suite ${suiteName} completed: ${results.passed || 0} passed, ${results.failed || 0} failed`,
              );
              resolve();
            } catch (parseError) {
              logger.error(
                `❌ Failed to parse results for ${suiteName}:`,
                parseError,
              );
              reject(parseError);
            }
          }
        },
      );
    });
  }

  async parseTestResults(stdout) {
    try {
      // Try to parse JSON output
      const lines = stdout.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("{")) {
          const result = JSON.parse(line);
          return {
            totalTests: result.stats?.total || 0,
            passed: result.stats?.passed || 0,
            failed: result.stats?.failed || 0,
            skipped: result.stats?.skipped || 0,
            duration: result.stats?.duration || 0,
          };
        }
      }

      // Fallback parsing
      return {
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
      };
    } catch (error) {
      logger.error("❌ Failed to parse test results:", error);
      return {
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
      };
    }
  }

  async generateReports() {
    logger.info("📊 Generating test reports...");

    try {
      // Generate HTML report
      await this.generateHtmlReport();

      // Generate JSON report
      await this.generateJsonReport();

      // Generate summary report
      await this.generateSummaryReport();

      logger.info("✅ Test reports generated");
    } catch (error) {
      logger.error("❌ Report generation failed:", error);
    }
  }

  async generateHtmlReport() {
    try {
      const htmlContent = this.createHtmlReport();
      await fs.writeFile(
        path.join(this.config.reportDir, "test-report.html"),
        htmlContent,
      );
      logger.info("📄 HTML report generated");
    } catch (error) {
      logger.error("❌ HTML report generation failed:", error);
    }
  }

  createHtmlReport() {
    const { suites, totalTests, passed, failed, skipped, duration } =
      this.results;

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${new Date().toLocaleString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .card { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 5px; flex: 1; }
        .passed { color: green; }
        .failed { color: red; }
        .skipped { color: orange; }
        .suite { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Duration: ${(duration / 1000).toFixed(2)} seconds</p>
    </div>
    
    <div class="summary">
        <div class="card">
            <h3>Total Tests</h3>
            <p style="font-size: 24px; font-weight: bold;">${totalTests}</p>
        </div>
        <div class="card">
            <h3>Passed</h3>
            <p style="font-size: 24px; font-weight: bold; color: green;">${passed}</p>
        </div>
        <div class="card">
            <h3>Failed</h3>
            <p style="font-size: 24px; font-weight: bold; color: red;">${failed}</p>
        </div>
        <div class="card">
            <h3>Skipped</h3>
            <p style="font-size: 24px; font-weight: bold; color: orange;">${skipped}</p>
        </div>
    </div>
    
    <h2>Test Suites</h2>
    ${suites
      .map(
        (suite) => `
        <div class="suite">
            <h3>${suite.name}</h3>
            <div class="metrics">
                <div>Total: ${suite.totalTests}</div>
                <div class="passed">Passed: ${suite.passed}</div>
                <div class="failed">Failed: ${suite.failed}</div>
                <div class="skipped">Skipped: ${suite.skipped}</div>
                <div>Duration: ${(suite.duration / 1000).toFixed(2)}s</div>
            </div>
        </div>
    `,
      )
      .join("")}
</body>
</html>`;
  }

  async generateJsonReport() {
    try {
      const jsonContent = JSON.stringify(this.results, null, 2);
      await fs.writeFile(
        path.join(this.config.reportDir, "test-results.json"),
        jsonContent,
      );
      logger.info("📄 JSON report generated");
    } catch (error) {
      logger.error("❌ JSON report generation failed:", error);
    }
  }

  async generateSummaryReport() {
    try {
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: this.results.totalTests,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        duration: this.results.duration,
        successRate:
          this.results.totalTests > 0
            ? (this.results.passed / this.results.totalTests) * 100
            : 0,
        suites: this.results.suites.map((suite) => ({
          name: suite.name,
          totalTests: suite.totalTests,
          passed: suite.passed,
          failed: suite.failed,
          skipped: suite.skipped,
          successRate:
            suite.totalTests > 0 ? (suite.passed / suite.totalTests) * 100 : 0,
        })),
      };

      await fs.writeFile(
        path.join(this.config.reportDir, "summary.json"),
        JSON.stringify(summary, null, 2),
      );
      logger.info("📄 Summary report generated");
    } catch (error) {
      logger.error("❌ Summary report generation failed:", error);
    }
  }

  async analyzeResults() {
    logger.info("📈 Analyzing test results...");

    try {
      const { totalTests, passed, failed, skipped } = this.results;
      const successRate = totalTests > 0 ? (passed / totalTests) * 100 : 0;

      logger.info(`📊 Test Results Summary:`);
      logger.info(`   Total Tests: ${totalTests}`);
      logger.info(`   Passed: ${passed} (${successRate.toFixed(2)}%)`);
      logger.info(`   Failed: ${failed}`);
      logger.info(`   Skipped: ${skipped}`);
      logger.info(
        `   Duration: ${(this.results.duration / 1000).toFixed(2)} seconds`,
      );

      // Analyze by suite
      logger.info(`📋 Suite Analysis:`);
      for (const suite of this.results.suites) {
        const suiteSuccessRate =
          suite.totalTests > 0 ? (suite.passed / suite.totalTests) * 100 : 0;
        logger.info(
          `   ${suite.name}: ${suite.passed}/${suite.totalTests} (${suiteSuccessRate.toFixed(2)}%)`,
        );
      }

      // Determine overall status
      if (failed === 0) {
        logger.info("🎉 All tests passed!");
      } else if (successRate >= 90) {
        logger.info("✅ Tests mostly passed with minor issues");
      } else if (successRate >= 70) {
        logger.warn("⚠️ Tests passed but with significant issues");
      } else {
        logger.error("❌ Tests failed with major issues");
      }
    } catch (error) {
      logger.error("❌ Results analysis failed:", error);
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  const testRunner = new TestRunner();
  testRunner.run().catch((error) => {
    logger.error("❌ Test runner failed:", error);
    process.exit(1);
  });
}

module.exports = TestRunner;
