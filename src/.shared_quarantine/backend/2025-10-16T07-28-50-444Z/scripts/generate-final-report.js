#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class FinalReportGenerator {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.reportsDir = path.join(this.workspaceRoot, 'reports');
    this.logsDir = path.join(this.workspaceRoot, 'logs');
    this.tempDir = path.join(this.workspaceRoot, 'temp');
    this.finalReportFile = path.join(this.reportsDir, 'final-report.json');
  }

  async loadExecutionReport() {
    const executionReportFile = path.join(
      this.reportsDir,
      'master-execution-report.json'
    );

    if (fs.existsSync(executionReportFile)) {
      const data = fs.readFileSync(executionReportFile, 'utf8');
      return JSON.parse(data);
    }

    return null;
  }

  async loadFileCleanupReport() {
    const fileCleanupReportFile = path.join(
      this.reportsDir,
      'file-cleanup-report.json'
    );

    if (fs.existsSync(fileCleanupReportFile)) {
      const data = fs.readFileSync(fileCleanupReportFile, 'utf8');
      return JSON.parse(data);
    }

    return null;
  }

  async loadSocialMediaReport() {
    const socialMediaReportFile = path.join(
      this.reportsDir,
      'social-media-report.json'
    );

    if (fs.existsSync(socialMediaReportFile)) {
      const data = fs.readFileSync(socialMediaReportFile, 'utf8');
      return JSON.parse(data);
    }

    return null;
  }

  async loadWorkflowTestResults() {
    const workflowTestFile = path.join(
      this.tempDir,
      'workflow-test-results.json'
    );

    if (fs.existsSync(workflowTestFile)) {
      const data = fs.readFileSync(workflowTestFile, 'utf8');
      return JSON.parse(data);
    }

    return null;
  }

  async getSystemStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    // Check disk usage
    try {
      const { exec } = require('child_process');

      status.diskUsage = await new Promise(resolve => {
        exec('df -h', (error, stdout) => {
          if (error) {
            resolve({ error: error.message });
          } else {
            resolve({ output: stdout });
          }
        });
      });
    } catch (error) {
      status.diskUsage = { error: error.message };
    }

    return status;
  }

  async getLogSummary() {
    const logFiles = [
      'cursor-agent.log',
      'file-cleanup.log',
      'n8n-workflow.log',
      'social-media.log',
      'master-executor.log',
    ];

    const logSummary = {};

    for (const logFile of logFiles) {
      const logPath = path.join(this.logsDir, logFile);

      if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath);
        const content = fs.readFileSync(logPath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());

        logSummary[logFile] = {
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          lineCount: lines.length,
          lastEntry: lines[lines.length - 1] || null,
        };
      } else {
        logSummary[logFile] = {
          exists: false,
        };
      }
    }

    return logSummary;
  }

  async generateFinalReport() {
    console.log('Generating final report...');

    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        generator: 'FinalReportGenerator',
      },
      execution: await this.loadExecutionReport(),
      fileCleanup: await this.loadFileCleanupReport(),
      socialMedia: await this.loadSocialMediaReport(),
      workflowTests: await this.loadWorkflowTestResults(),
      systemStatus: await this.getSystemStatus(),
      logs: await this.getLogSummary(),
      summary: {
        overallStatus: 'unknown',
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        warnings: [],
        recommendations: [],
      },
    };

    // Calculate summary
    if (report.execution) {
      report.summary.totalTasks = report.execution.modules.length;
      report.summary.completedTasks = report.execution.modules.filter(
        m => m.success
      ).length;
      report.summary.failedTasks = report.execution.modules.filter(
        m => !m.success
      ).length;

      if (report.summary.failedTasks === 0) {
        report.summary.overallStatus = 'success';
      } else if (report.summary.completedTasks > 0) {
        report.summary.overallStatus = 'partial';
      } else {
        report.summary.overallStatus = 'failed';
      }
    }

    // Add warnings and recommendations
    if (report.summary.failedTasks > 0) {
      report.summary.warnings.push(
        `${report.summary.failedTasks} modules failed execution`
      );
    }

    if (report.socialMedia && report.socialMedia.summary) {
      if (report.socialMedia.summary.failedPosts > 0) {
        report.summary.warnings.push(
          `${report.socialMedia.summary.failedPosts} social media posts failed`
        );
      }
    }

    if (report.workflowTests && report.workflowTests.errors) {
      if (report.workflowTests.errors.length > 0) {
        report.summary.warnings.push(
          `${report.workflowTests.errors.length} workflow errors detected`
        );
      }
    }

    // Add recommendations
    if (report.summary.overallStatus === 'success') {
      report.summary.recommendations.push(
        'All systems operational - consider scaling up automation'
      );
    } else if (report.summary.overallStatus === 'partial') {
      report.summary.recommendations.push(
        'Some modules failed - review logs and retry failed modules'
      );
    } else {
      report.summary.recommendations.push(
        'Multiple failures detected - check system configuration and dependencies'
      );
    }

    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }

    // Save final report
    fs.writeFileSync(this.finalReportFile, JSON.stringify(report, null, 2));

    console.log(`Final report generated: ${this.finalReportFile}`);

    return report;
  }
}

// Main execution
if (require.main === module) {
  const generator = new FinalReportGenerator();

  generator
    .generateFinalReport()
    .then(report => {
      console.log('Final report generation completed');
      console.log(`Overall Status: ${report.summary.overallStatus}`);
      console.log(
        `Completed Tasks: ${report.summary.completedTasks}/${report.summary.totalTasks}`
      );

      if (report.summary.warnings.length > 0) {
        console.log('Warnings:');
        report.summary.warnings.forEach(warning =>
          console.log(`  - ${warning}`)
        );
      }

      if (report.summary.recommendations.length > 0) {
        console.log('Recommendations:');
        report.summary.recommendations.forEach(rec =>
          console.log(`  - ${rec}`)
        );
      }
    })
    .catch(error => {
      console.error('Final report generation failed:', error);
      process.exit(1);
    });
}

module.exports = FinalReportGenerator;
