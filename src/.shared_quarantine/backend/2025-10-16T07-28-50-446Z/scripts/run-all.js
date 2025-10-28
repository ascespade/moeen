#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class MasterExecutor {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.logFile = path.join(this.workspaceRoot, 'logs', 'master-executor.log');
    this.reportFile = path.join(
      this.workspaceRoot,
      'reports',
      'master-execution-report.json'
    );
    this.startTime = new Date();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Master Executor: ${message}\n`;

    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async runScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      this.log(`Running script: ${scriptPath}`);

      const child = spawn('node', [scriptPath, ...args], {
        cwd: this.workspaceRoot,
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
        if (code === 0) {
          this.log(`Script completed successfully: ${scriptPath}`);
          resolve({ success: true, stdout, stderr });
        } else {
          this.log(`Script failed with code ${code}: ${scriptPath}`);
          resolve({ success: false, code, stdout, stderr });
        }
      });

      child.on('error', error => {
        this.log(`Script error: ${scriptPath} - ${error.message}`);
        reject(error);
      });
    });
  }

  async executeModule(moduleName, scriptPath, args = []) {
    this.log(`Executing module: ${moduleName}`);

    const startTime = new Date();

    try {
      const result = await this.runScript(scriptPath, args);
      const endTime = new Date();
      const duration = endTime - startTime;

      return {
        module: moduleName,
        success: result.success,
        duration: duration,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        stdout: result.stdout,
        stderr: result.stderr,
        error: result.success ? null : `Script failed with code ${result.code}`,
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime - startTime;

      return {
        module: moduleName,
        success: false,
        duration: duration,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        error: error.message,
      };
    }
  }

  async executeAllModules() {
    this.log('Starting master execution...');

    const modules = [
      {
        name: 'File Cleanup and Management',
        script: 'scripts/file-cleanup.js',
        args: [],
      },
      {
        name: 'N8n Workflow Integration',
        script: 'scripts/n8n-workflow-manager.js',
        args: [],
      },
      {
        name: 'Social Media Automation',
        script: 'scripts/social-media-automation.js',
        args: [],
      },
      {
        name: 'Admin Module',
        script: 'scripts/admin-module.js',
        args: [],
      },
      {
        name: 'Enhancements',
        script: 'scripts/enhancements.js',
        args: [],
      },
    ];

    const results = [];

    for (const module of modules) {
      const result = await this.executeModule(
        module.name,
        module.script,
        module.args
      );
      results.push(result);

      // Log result
      if (result.success) {
        this.log(`✓ ${module.name} completed successfully`);
      } else {
        this.log(`✗ ${module.name} failed: ${result.error}`);
      }
    }

    return results;
  }

  async generateFinalReport() {
    this.log('Generating final report...');

    const endTime = new Date();
    const totalDuration = endTime - this.startTime;

    const report = {
      execution: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalDuration: totalDuration,
        status: 'completed',
      },
      modules: await this.executeAllModules(),
      summary: {
        totalModules: 0,
        successfulModules: 0,
        failedModules: 0,
        totalDuration: totalDuration,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
      },
    };

    // Calculate summary
    report.summary.totalModules = report.modules.length;
    report.summary.successfulModules = report.modules.filter(
      m => m.success
    ).length;
    report.summary.failedModules = report.modules.filter(
      m => !m.success
    ).length;

    // Save report
    const reportsDir = path.dirname(this.reportFile);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));

    this.log(`Final report saved to: ${this.reportFile}`);

    return report;
  }

  async run() {
    try {
      this.log('Master execution started');

      const report = await this.generateFinalReport();

      // Log summary
      this.log(
        `Execution completed: ${report.summary.successfulModules}/${report.summary.totalModules} modules successful`
      );

      if (report.summary.failedModules > 0) {
        this.log(
          `Failed modules: ${report.modules
            .filter(m => !m.success)
            .map(m => m.module)
            .join(', ')}`
        );
      }

      return report;
    } catch (error) {
      this.log(`Master execution failed: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
if (require.main === module) {
  const executor = new MasterExecutor();

  executor
    .run()
    .then(report => {
      console.log('Master execution completed successfully');
      console.log(JSON.stringify(report, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Master execution failed:', error);
      process.exit(1);
    });
}

module.exports = MasterExecutor;
