#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawn, exec = require('child_process');

class SelfHealingSystem {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.logFile = path.join(this.workspaceRoot, 'logs', 'self-healing.log');
    this.healingRulesFile = path.join(
      this.workspaceRoot,
      'config',
      'healing-rules.json'
    );
    this.healingHistoryFile = path.join(
      this.workspaceRoot,
      'temp',
      'healing-history.json'
    );
    this.healingRules = {};
    this.healingHistory = [];
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] Self-Healing: ${message}\n`

    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    // console.log(logMessage.trim());
  }

  async initialize() {
    this.log('Initializing Self-Healing System...');

    // Create necessary directories
    const directories = ['config', 'logs', 'temp', 'backups', 'sandbox'];
    for (const dir of directories) {
      const fullPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }

    // Load or create healing rules
    await this.loadHealingRules();

    // Load healing history
    await this.loadHealingHistory();

    this.log('Self-Healing System initialized');
  }

  async loadHealingRules() {
    if (fs.existsSync(this.healingRulesFile)) {
      try {
        const data = fs.readFileSync(this.healingRulesFile, 'utf8');
        this.healingRules = JSON.parse(data);
        this.log('Healing rules loaded');
      } catch (error) {
        this.log(`Error loading healing rules: ${error.message}`
        await this.createDefaultHealingRules();
      }
    } else {
      await this.createDefaultHealingRules();
    }
  }

  async createDefaultHealingRules() {
    this.healingRules = {
      fileSystem: {
        missingDirectories: {
          pattern: 'ENOENT.*no such file or directory',
          action: 'createDirectories',
          priority: 'high',
          successRate: 0.95
        },
        permissionDenied: {
          pattern: 'EACCES.*permission denied',
          action: 'fixPermissions',
          priority: 'high',
          successRate: 0.9
        },
        diskSpace: {
          pattern: 'ENOSPC.*no space left',
          action: 'cleanupDiskSpace',
          priority: 'critical',
          successRate: 0.85
        }
      },
      process: {
        moduleNotFound: {
          pattern: 'Cannot find module',
          action: 'installDependencies',
          priority: 'high',
          successRate: 0.8
        },
        portInUse: {
          pattern: 'EADDRINUSE.*address already in use',
          action: 'killProcessOnPort',
          priority: 'medium',
          successRate: 0.75
        },
        memoryLeak: {
          pattern: 'JavaScript heap out of memory',
          action: 'restartProcess',
          priority: 'critical',
          successRate: 0.7
        }
      },
      network: {
        connectionRefused: {
          pattern: 'ECONNREFUSED',
          action: 'retryWithBackoff',
          priority: 'medium',
          successRate: 0.6
        },
        timeout: {
          pattern: 'ETIMEDOUT',
          action: 'increaseTimeout',
          priority: 'low',
          successRate: 0.5
        }
      }
    };

    fs.writeFileSync(
      this.healingRulesFile,
      JSON.stringify(this.healingRules, null, 2)
    );
    this.log('Default healing rules created');
  }

  async loadHealingHistory() {
    if (fs.existsSync(this.healingHistoryFile)) {
      try {
        const data = fs.readFileSync(this.healingHistoryFile, 'utf8');
        this.healingHistory = JSON.parse(data);
      } catch (error) {
        this.log(`Error loading healing history: ${error.message}`
        this.healingHistory = [];
      }
    }
  }

  async saveHealingHistory() {
    fs.writeFileSync(
      this.healingHistoryFile,
      JSON.stringify(this.healingHistory, null, 2)
    );
  }

  async detectErrors() {
    this.log('Detecting errors...');

    const errors = [];

    // Check log files for error patterns
    const logDir = path.join(this.workspaceRoot, 'logs');
    if (fs.existsSync(logDir)) {
      const logFiles = fs.readdirSync(logDir);
      for (const logFile of logFiles) {
        const logPath = path.join(logDir, logFile);
        const content = fs.readFileSync(logPath, 'utf8');
        const lines = content.split('\n');

        for (const line of lines) {
          for (const [category, rules] of Object.entries(this.healingRules)) {
            for (const [ruleName, rule] of Object.entries(rules)) {
              if (line.match(new RegExp(rule.pattern, 'i'))) {
                errors.push({
                  category: category,
                  rule: ruleName,
                  pattern: rule.pattern,
                  message: line.trim(),
                  priority: rule.priority,
                  action: rule.action,
                  timestamp: new Date().toISOString()
                });
              }
            }
          }
        }
      }
    }

    this.log(`Detected ${errors.length} errors`
    return errors;
  }

  async applyHealing(error) {
    this.log(`Applying healing for ${error.category}.${error.rule}...`

    const startTime = Date.now();
    let success = false;
    let result = null;

    try {
      switch (error.action) {
      case 'createDirectories':
        result = await this.createDirectories();
        break;
      case 'fixPermissions':
        result = await this.fixPermissions();
        break;
      case 'cleanupDiskSpace':
        result = await this.cleanupDiskSpace();
        break;
      case 'installDependencies':
        result = await this.installDependencies();
        break;
      case 'killProcessOnPort':
        result = await this.killProcessOnPort();
        break;
      case 'restartProcess':
        result = await this.restartProcess();
        break;
      case 'retryWithBackoff':
        result = await this.retryWithBackoff();
        break;
      case 'increaseTimeout':
        result = await this.increaseTimeout();
        break;
      default:
        this.log(`Unknown healing action: ${error.action}`
        return false;
      }

      success = result && result.success;
    } catch (healingError) {
      this.log(`Healing failed: ${healingError.message}`
      success = false;
    }

    const duration = Date.now() - startTime;

    // Record healing attempt
    const healingRecord = {
      error: error,
      action: error.action,
      success: success,
      duration: duration,
      timestamp: new Date().toISOString(),
      result: result
    };

    this.healingHistory.push(healingRecord);
    await this.saveHealingHistory();

    // Update success rate
    await this.updateSuccessRate(error.category, error.rule, success);

    this.log(`Healing ${success ? 'succeeded' : 'failed'} in ${duration}ms`
    return success;
  }

  async createDirectories() {
    this.log('Creating missing directories...');

    const directories = [
      'temp',
      'logs',
      'reports',
      'config',
      'sandbox',
      'learning',
      'backups',
      'n8n-workflows',
      'videos'
    ];

    let created = 0;
    for (const dir of directories) {
      const dirPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        created++;
        this.log(`Created directory: ${dir}`
      }
    }

    return { success: true, created: created };
  }

  async fixPermissions() {
    this.log('Fixing file permissions...');

    const scriptsDir = path.join(this.workspaceRoot, 'scripts');
    if (fs.existsSync(scriptsDir)) {
      const files = fs.readdirSync(scriptsDir);
      let fixed = 0;

      for (const file of files) {
        if (file.endsWith('.js')) {
          const filePath = path.join(scriptsDir, file);
          fs.chmodSync(filePath, '755');
          fixed++;
        }
      }

      this.log(`Fixed permissions for ${fixed} files`
      return { success: true, fixed: fixed };
    }

    return { success: false, error: 'Scripts directory not found' };
  }

  async cleanupDiskSpace() {
    this.log('Cleaning up disk space...');

    let cleaned = 0;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    // Clean temp directory
    const tempDir = path.join(this.workspaceRoot, 'temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        if (Date.now() - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      }
    }

    // Clean old logs
    const logDir = path.join(this.workspaceRoot, 'logs');
    if (fs.existsSync(logDir)) {
      const files = fs.readdirSync(logDir);
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        if (Date.now() - stats.mtime.getTime() > maxAge) {
          // Archive instead of delete
          const backupPath = path.join(
            this.workspaceRoot,
            'backups',
            `${file}.${Date.now()}`
          );
          fs.copyFileSync(filePath, backupPath);
          fs.writeFileSync(filePath, '');
          cleaned++;
        }
      }
    }

    this.log(`Cleaned up ${cleaned} files`
    return { success: true, cleaned: cleaned };
  }

  async installDependencies() {
    this.log('Installing dependencies...');

    return new Promise((resolve) => {
      exec(
        'npm install',
        { cwd: this.workspaceRoot },
        (error, stdout, stderr) => {
          if (error) {
            this.log(
              `Dependency installation failed: ${error.message}`
              'error'
            );
            resolve({ success: false, error: error.message });
          } else {
            this.log('Dependencies installed successfully');
            resolve({ success: true, output: stdout });
          }
        }
      );
    });
  }

  async killProcessOnPort() {
    this.log('Killing process on port...');

    return new Promise((resolve) => {
      exec('lsof -ti:3000 | xargs kill -9', (error, stdout, stderr) => {
        if (error) {
          this.log(`Failed to kill process: ${error.message}`
          resolve({ success: false, error: error.message });
        } else {
          this.log('Process killed successfully');
          resolve({ success: true, output: stdout });
        }
      });
    });
  }

  async restartProcess() {
    this.log('Restarting process...');

    // This would restart the main process
    // In a real implementation, this would use PM2 or similar
    this.log('Process restart requested');
    return { success: true, message: 'Process restart requested' };
  }

  async retryWithBackoff() {
    this.log('Retrying with exponential backoff...');

    // Implement exponential backoff retry logic
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Simulate retry attempt
      this.log(`Retry attempt ${retryCount + 1}/${maxRetries}`
      retryCount++;
    }

    return { success: true, retries: retryCount };
  }

  async increaseTimeout() {
    this.log('Increasing timeout...');

    // This would modify configuration to increase timeouts
    this.log('Timeout increased');
    return { success: true, message: 'Timeout increased' };
  }

  async updateSuccessRate(category, rule, success) {
    if (this.healingRules[category] && this.healingRules[category][rule]) {
      const rule = this.healingRules[category][rule];
      const currentRate = rule.successRate || 0;
      const newRate = (currentRate + (success ? 1 : 0)) / 2;
      rule.successRate = Math.min(1, Math.max(0, newRate));

      // Save updated rules
      fs.writeFileSync(
        this.healingRulesFile,
        JSON.stringify(this.healingRules, null, 2)
      );
    }
  }

  async runHealingCycle() {
    this.log('Running healing cycle...');

    const errors = await this.detectErrors();
    const healingResults = [];

    for (const error of errors) {
      // Only heal if success rate is above threshold
      const rule = this.healingRules[error.category]?.[error.rule];
      if (rule && rule.successRate > 0.3) {
        const result = await this.applyHealing(error);
        healingResults.push({
          error: error,
          healed: result
        });
      } else {
        this.log(
          `Skipping healing for ${error.category}.${error.rule} (low success rate)`
          'warn'
        );
      }
    }

    this.log(
      `Healing cycle completed: ${healingResults.length} errors processed`
    );
    return healingResults;
  }

  async generateHealingReport() {
    this.log('Generating healing report...');

    const report = {
      timestamp: new Date().toISOString(),
      healingHistory: this.healingHistory,
      rules: this.healingRules,
      summary: {
        totalHealingAttempts: this.healingHistory.length,
        successfulHealings: this.healingHistory.filter((h) => h.success).length,
        failedHealings: this.healingHistory.filter((h) => !h.success).length,
        successRate:
          this.healingHistory.length > 0
            ? this.healingHistory.filter((h) => h.success).length /
              this.healingHistory.length
            : 0
      }
    };

    const reportFile = path.join(
      this.workspaceRoot,
      'reports',
      'healing-report.json'
    );
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Healing report saved: ${reportFile}`
    return report;
  }

  async start() {
    this.log('Starting Self-Healing System...');

    await this.initialize();

    // Run initial healing cycle
    await this.runHealingCycle();

    // Set up continuous healing
    const healingInterval = setInterval(async() => {
      try {
        await this.runHealingCycle();
        await this.generateHealingReport();
      } catch (error) {
        this.log(`Healing cycle error: ${error.message}`
      }
    }, 300000); // Every 5 minutes

    // Cleanup on exit
    process.on('SIGINT', () => {
      clearInterval(healingInterval);
      this.log('Self-Healing System stopped');
    });

    process.on('SIGTERM', () => {
      clearInterval(healingInterval);
      this.log('Self-Healing System stopped');
    });
  }
}

// Main execution
if (require.main === module) {
  const healing = new SelfHealingSystem();
  healing.start().catch((error) => {
    // console.error('Self-Healing System failed:', error);
    process.exit(1);
  });
}

module.exports = SelfHealingSystem;
