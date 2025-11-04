#!/usr/bin/env node

/**
 * Automated Admin Test Monitor
 * مراقب تلقائي لاختبارات الادمن
 * 
 * Monitors console/terminal for errors and runs tests automatically
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const execAsync = promisify(exec);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const MONITOR_INTERVAL = parseInt(process.env.MONITOR_INTERVAL) || 60000; // 1 minute default
const LOG_FILE = '/tmp/admin-test-monitor.log';

class AdminTestMonitor {
  constructor() {
    this.isRunning = false;
    this.lastError = null;
    this.testCount = 0;
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    
    try {
      await writeFile(LOG_FILE, logMessage, { flag: 'a' });
    } catch (err) {
      console.error('Failed to write to log file:', err.message);
    }
  }

  async checkServer() {
    try {
      const response = await fetch(`${BASE_URL}/api/health`).catch(() => 
        fetch(`${BASE_URL}/`).catch(() => null)
      );
      return response !== null && response.status < 500;
    } catch {
      return false;
    }
  }

  async runTests() {
    this.testCount++;
    await this.log(`🧪 Running admin tests (Run #${this.testCount})...`);
    
    try {
      const { stdout, stderr } = await execAsync(
        `cd /home/ubuntu/moeen && npx playwright test tests/admin.spec.ts tests/admin-comprehensive.spec.ts --reporter=list,json 2>&1`,
        { timeout: 120000 }
      );
      
      const output = stdout + stderr;
      
      // Check if tests passed
      if (output.includes('passed') && !output.includes('failed')) {
        await this.log('✅ All admin tests passed!');
        this.lastError = null;
        return true;
      } else {
        await this.log('❌ Some tests failed!');
        await this.log(`Output: ${output.substring(0, 500)}`);
        this.lastError = output;
        return false;
      }
    } catch (error) {
      await this.log(`❌ Test execution failed: ${error.message}`);
      this.lastError = error.message;
      return false;
    }
  }

  async checkConsoleErrors() {
    // This would check browser console, but we'll use server health for now
    const serverHealthy = await this.checkServer();
    
    if (!serverHealthy) {
      await this.log('⚠️  Server health check failed');
      return true; // Error detected
    }
    
    return false;
  }

  async start() {
    await this.log('🚀 Admin Test Monitor Started');
    await this.log(`Monitoring URL: ${BASE_URL}`);
    await this.log(`Check interval: ${MONITOR_INTERVAL}ms`);
    await this.log('Press Ctrl+C to stop');
    await this.log('');
    
    this.isRunning = true;
    
    // Initial test run
    await this.runTests();
    
    // Start monitoring loop
    while (this.isRunning) {
      try {
        // Check for errors
        const hasError = await this.checkConsoleErrors();
        
        if (hasError || this.lastError) {
          await this.log('🔍 Error detected, running tests...');
          await this.runTests();
        } else {
          // Periodic test run
          await this.runTests();
        }
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, MONITOR_INTERVAL));
      } catch (error) {
        await this.log(`❌ Monitor error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  stop() {
    this.isRunning = false;
    this.log('🛑 Monitor stopped');
  }
}

// Handle graceful shutdown
const monitor = new AdminTestMonitor();
process.on('SIGINT', () => {
  monitor.stop();
  process.exit(0);
});
process.on('SIGTERM', () => {
  monitor.stop();
  process.exit(0);
});

// Start monitoring
monitor.start().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
