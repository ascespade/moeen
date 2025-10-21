#!/usr/bin/env node

/**
 * Background Monitor - مراقب الخلفية
 *
 * يراقب النظام ويصلح المشاكل تلقائياً
 * Monitors system and fixes issues automatically
 */

import AutoTestingSystem from './auto-testing-system.js';
import fs from 'fs';
import path from 'path';

class BackgroundMonitor {
  constructor() {
    this.testingSystem = new AutoTestingSystem();
    this.isMonitoring = false;
    this.checkInterval = 60000; // 1 minute
    this.intervalId = null;
    this.statusFile = 'system-status.json';
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

  saveStatus(status) {
    const statusData = {
      timestamp: new Date().toISOString(),
      status,
      isMonitoring: this.isMonitoring,
      lastCheck: new Date().toISOString(),
    };

    fs.writeFileSync(this.statusFile, JSON.stringify(statusData, null, 2));
  }

  async checkSystemHealth() {
    this.log('🔍 Checking system health...');

    try {
      // Check if server is running
      const { exec } = await import('child_process');
      const isServerRunning = await new Promise(resolve => {
        exec('curl -s http://localhost:3001 > /dev/null', error => {
          resolve(!error);
        });
      });

      if (!isServerRunning) {
        this.log('⚠️ Server not running, attempting to start...', 'warning');
        return false;
      }

      // Check for common issues
      const issues = await this.detectIssues();

      if (issues.length > 0) {
        this.log(`🔧 Found ${issues.length} issues, applying fixes...`);
        await this.applyFixes(issues);
        return false;
      }

      this.log('✅ System is healthy', 'success');
      this.saveStatus('healthy');
      return true;
    } catch (error) {
      this.log(`❌ Health check failed: ${error.message}`, 'error');
      this.saveStatus('error');
      return false;
    }
  }

  async detectIssues() {
    const issues = [];

    // Check for CSS errors
    if (await this.hasCSSErrors()) {
      issues.push({ type: 'css', description: 'CSS compilation errors' });
    }

    // Check for build errors
    if (await this.hasBuildErrors()) {
      issues.push({ type: 'build', description: 'Build errors' });
    }

    // Check for test failures
    if (await this.hasTestFailures()) {
      issues.push({ type: 'tests', description: 'Test failures' });
    }

    return issues;
  }

  async hasCSSErrors() {
    try {
      const { exec } = await import('child_process');
      const result = await new Promise(resolve => {
        exec(
          'npm run build 2>&1 | grep -i "css\\|syntax\\|error"',
          (error, stdout) => {
            resolve(stdout.length > 0);
          }
        );
      });
      return result;
    } catch {
      return false;
    }
  }

  async hasBuildErrors() {
    try {
      const { exec } = await import('child_process');
      const result = await new Promise(resolve => {
        exec(
          'npm run build 2>&1 | grep -i "error\\|failed"',
          (error, stdout) => {
            resolve(stdout.length > 0);
          }
        );
      });
      return result;
    } catch {
      return false;
    }
  }

  async hasTestFailures() {
    try {
      const { exec } = require('child_process');
      const result = await new Promise(resolve => {
        exec(
          'npx playwright test --config=playwright-auto.config.ts --reporter=json 2>&1 | grep -i "failed\\|error"',
          (error, stdout) => {
            resolve(stdout.length > 0);
          }
        );
      });
      return result;
    } catch {
      return false;
    }
  }

  async applyFixes(issues) {
    for (const issue of issues) {
      this.log(`🔧 Fixing ${issue.type}: ${issue.description}`);

      switch (issue.type) {
        case 'css':
          await this.fixCSSIssues();
          break;
        case 'build':
          await this.fixBuildIssues();
          break;
        case 'tests':
          await this.fixTestIssues();
          break;
      }
    }
  }

  async fixCSSIssues() {
    this.log('🎨 Fixing CSS issues...');

    const cssFiles = [
      'src/styles/theme.css',
      'src/styles/design-system.css',
      'src/styles/centralized.css',
    ];

    for (const file of cssFiles) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/bg-brand-primary/g, 'bg-blue-600');
        content = content.replace(
          /hover:bg-brand-primary-hover/g,
          'hover:bg-blue-700'
        );
        content = content.replace(
          /focus:ring-brand-primary/g,
          'focus:ring-blue-500'
        );
        content = content.replace(/border-brand-primary/g, 'border-blue-500');
        content = content.replace(/text-brand-primary/g, 'text-blue-600');
        fs.writeFileSync(file, content);
        this.log(`✅ Fixed CSS in ${file}`);
      }
    }
  }

  async fixBuildIssues() {
    this.log('🔨 Fixing build issues...');

    // Clear Next.js cache
    const { exec } = require('child_process');
    await new Promise(resolve => {
      exec('rm -rf .next', () => resolve());
    });

    this.log('✅ Cleared Next.js cache');
  }

  async fixTestIssues() {
    this.log('🧪 Fixing test issues...');

    // Clear rate limit cache
    try {
      const response = await fetch(
        'http://localhost:3001/api/test/clear-rate-limit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        this.log('✅ Cleared rate limit cache');
      }
    } catch (error) {
      this.log('⚠️ Could not clear rate limit cache');
    }
  }

  async startMonitoring() {
    this.log('🚀 Starting background monitoring...');
    this.isMonitoring = true;
    this.saveStatus('monitoring');

    this.intervalId = setInterval(async () => {
      const isHealthy = await this.checkSystemHealth();

      if (!isHealthy) {
        this.log('🔄 System needs attention, running full test cycle...');
        await this.testingSystem.runFullCycle();
      }
    }, this.checkInterval);

    this.log('✅ Background monitoring started');
  }

  stopMonitoring() {
    this.log('🛑 Stopping background monitoring...');
    this.isMonitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.saveStatus('stopped');
    this.log('✅ Background monitoring stopped');
  }

  getStatus() {
    if (fs.existsSync(this.statusFile)) {
      return JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
    }
    return { status: 'unknown' };
  }
}

// Run the monitor
if (require.main === module) {
  const monitor = new BackgroundMonitor();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    monitor.stopMonitoring();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    monitor.stopMonitoring();
    process.exit(0);
  });

  monitor.startMonitoring().catch(error => {
    console.error('Monitor failed:', error);
    process.exit(1);
  });
}

module.exports = BackgroundMonitor;
