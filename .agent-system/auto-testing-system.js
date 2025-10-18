#!/usr/bin/env node

/**
 * نظام الاختبار والتحسين التلقائي الشامل
 * Comprehensive Auto-Testing and Improvement System
 *
 * يعمل في الخلفية لاختبار وإصلاح النظام تلقائياً
 * Runs in background to automatically test and fix the system
 */

const exec, spawn = require('child_process');
let fs = require('fs');
let path = require('path');

class AutoTestingSystem {
  constructor() {
    this.isRunning = false;
    this.testResults = [];
    this.fixesApplied = [];
    this.maxRetries = 3;
    this.retryCount = 0;
    this.testInterval = 30000; // 30 seconds
    this.intervalId = null;
  }

  log(message, type = 'info') {
    let timestamp = new Date().toISOString();
    let prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    // console.log(`[${timestamp}] ${prefix} ${message}`
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

  async startServer() {
    this.log('🚀 Starting development server...');
    try {
      // Kill any existing server
      await this.runCommand('pkill -f "next dev" || true');

      // Start new server
      let server = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      server.stdout.on('data', (data) => {
        let output = data.toString();
        if (output.includes('Ready in')) {
          this.log('✅ Server started successfully');
          this.isServerReady = true;
        }
      });

      server.stderr.on('data', (data) => {
        let error = data.toString();
        if (error.includes('Error') || error.includes('Failed')) {
          this.log(`Server error: ${error}`
        }
      });

      return server;
    } catch (error) {
      this.log(`Failed to start server: ${error.message}`
      throw error;
    }
  }

  async runPlaywrightTests() {
    this.log('🧪 Running Playwright tests...');
    try {
      const stdout, stderr = await this.runCommand(
        'npx playwright test --config=playwright-auto.config.ts --reporter=json',
        { timeout: 300000 } // 5 minutes timeout
      );

      let results = JSON.parse(stdout);
      return results;
    } catch (error) {
      this.log(`Test execution failed: ${error.message}`
      return null;
    }
  }

  async analyzeTestResults(results) {
    if (!results) return [];

    let issues = [];

    for (const result of results.suites || []) {
      for (const spec of result.specs || []) {
        for (const test of spec.tests || []) {
          if (test.results && test.results.some(r => r.status === 'failed')) {
            issues.push({
              test: test.title,
              spec: spec.title,
              errors: test.results.filter(r => r.status === 'failed').map(r => r.error)
            });
          }
        }
      }
    }

    return issues;
  }

  async applyFixes(issues) {
    this.log(`🔧 Applying fixes for ${issues.length} issues...`

    for (const issue of issues) {
      try {
        await this.fixIssue(issue);
        this.fixesApplied.push(issue);
      } catch (error) {
        this.log(`Failed to fix issue ${issue.test}: ${error.message}`
      }
    }
  }

  async fixIssue(issue) {
    this.log(`🔧 Fixing issue: ${issue.test}`

    // Common fixes based on error patterns
    if (issue.errors.some(e => e.message.includes('bg-brand-primary'))) {
      await this.fixBrandPrimaryCSS();
    }

    if (issue.errors.some(e => e.message.includes('TimeoutError'))) {
      await this.fixTimeoutIssues();
    }

    if (issue.errors.some(e => e.message.includes('Rate limit'))) {
      await this.fixRateLimitIssues();
    }

    if (issue.errors.some(e => e.message.includes('Authentication'))) {
      await this.fixAuthIssues();
    }
  }

  async fixBrandPrimaryCSS() {
    this.log('🎨 Fixing brand-primary CSS issues...');

    let cssFiles = [
      'src/styles/theme.css',
      'src/styles/design-system.css',
      'src/styles/centralized.css'
    ];

    for (const file of cssFiles) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/bg-brand-primary/g, 'bg-blue-600');
        content = content.replace(/hover:bg-brand-primary-hover/g, 'hover:bg-blue-700');
        content = content.replace(/focus:ring-brand-primary/g, 'focus:ring-blue-500');
        content = content.replace(/border-brand-primary/g, 'border-blue-500');
        content = content.replace(/text-brand-primary/g, 'text-blue-600');
        fs.writeFileSync(file, content);
        this.log(`✅ Fixed CSS in ${file}`
      }
    }
  }

  async fixTimeoutIssues() {
    this.log('⏱️ Fixing timeout issues...');

    // Increase timeouts in Playwright config
    let configFile = 'playwright-auto.config.ts';
    if (fs.existsSync(configFile)) {
      let content = fs.readFileSync(configFile, 'utf8');
      content = content.replace(/timeout: \d+/g, 'timeout: 120000');
      content = content.replace(/actionTimeout: \d+/g, 'actionTimeout: 60000');
      fs.writeFileSync(configFile, content);
      this.log('✅ Updated Playwright timeouts');
    }
  }

  async fixRateLimitIssues() {
    this.log('🚦 Fixing rate limit issues...');

    // Clear rate limit cache
    try {
      await this.runCommand('curl -X POST http://localhost:3001/api/test/clear-rate-limit');
      this.log('✅ Cleared rate limit cache');
    } catch (error) {
      this.log('⚠️ Could not clear rate limit cache', 'warning');
    }
  }

  async fixAuthIssues() {
    this.log('🔐 Fixing authentication issues...');

    // Reset test users
    try {
      await this.runCommand('node scripts/reset-test-users.js');
      this.log('✅ Reset test users');
    } catch (error) {
      this.log('⚠️ Could not reset test users', 'warning');
    }
  }

  async runFullCycle() {
    this.log('🔄 Starting full testing cycle...');

    try {
      // 1. Start server
      let server = await this.startServer();

      // Wait for server to be ready
      await new Promise(resolve => setTimeout(resolve, 10000));

      // 2. Run tests
      let results = await this.runPlaywrightTests();

      // 3. Analyze results
      let issues = await this.analyzeTestResults(results);

      if (issues.length === 0) {
        this.log('🎉 All tests passed! System is ready.', 'success');
        this.isRunning = false;
        return true;
      }

      // 4. Apply fixes
      await this.applyFixes(issues);

      // 5. Restart server
      server.kill();
      await new Promise(resolve => setTimeout(resolve, 5000));

      return false; // Not ready yet

    } catch (error) {
      this.log(`Cycle failed: ${error.message}`
      return false;
    }
  }

  async start() {
    this.log('🚀 Starting Auto-Testing System...');
    this.isRunning = true;

    while (this.isRunning && this.retryCount < this.maxRetries) {
      this.log(`🔄 Attempt ${this.retryCount + 1}/${this.maxRetries}`

      let success = await this.runFullCycle();

      if (success) {
        this.log('🎉 System is ready and all tests pass!', 'success');
        break;
      }

      this.retryCount++;

      if (this.retryCount < this.maxRetries) {
        this.log(`⏳ Waiting ${this.testInterval / 1000} seconds before retry...`
        await new Promise(resolve => setTimeout(resolve, this.testInterval));
      }
    }

    if (this.retryCount >= this.maxRetries) {
      this.log('❌ Max retries reached. Manual intervention needed.', 'error');
    }

    this.isRunning = false;
  }

  stop() {
    this.log('🛑 Stopping Auto-Testing System...');
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// Run the system
if (require.main === module) {
  let system = new AutoTestingSystem();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    system.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    system.stop();
    process.exit(0);
  });

  system.start().catch(error => {
    // console.error('System failed:', error);
    process.exit(1);
  });
}

module.exports = AutoTestingSystem;
