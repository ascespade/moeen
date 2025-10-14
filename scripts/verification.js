#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class VerificationModule {
  constructor() {
    this.workspaceRoot = path.join(__dirname, "..");
    this.logFile = path.join(this.workspaceRoot, "logs", "verification.log");
    this.reportFile = path.join(
      this.workspaceRoot,
      "reports",
      "verification-report.json",
    );
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Verification: ${message}\n`;

    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async checkCursorAgentStatus() {
    this.log("Checking Cursor Agent status...");

    const pidFile = path.join(this.workspaceRoot, "temp", "cursor-agent.pid");
    const logFile = path.join(this.workspaceRoot, "logs", "cursor-agent.log");

    const result = {
      check: "Cursor Agent Status",
      expected: "Cursor Agent running continuously",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      // Check if PID file exists
      if (fs.existsSync(pidFile)) {
        const pid = fs.readFileSync(pidFile, "utf8").trim();
        result.details.pid = pid;

        // Check if process is running (simplified check)
        try {
          const { exec } = require("child_process");
          await new Promise((resolve, reject) => {
            exec(`ps -p ${pid}`, (error) => {
              if (error) {
                result.status = "failed";
                result.issues.push("Process not running");
              } else {
                result.status = "passed";
              }
              resolve();
            });
          });
        } catch (error) {
          result.status = "failed";
          result.issues.push("Failed to check process status");
        }
      } else {
        result.status = "failed";
        result.issues.push("PID file not found");
      }

      // Check log file for recent activity
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        const age = Date.now() - stats.mtime.getTime();
        result.details.lastLogActivity = new Date(stats.mtime).toISOString();

        if (age > 10 * 60 * 1000) {
          // 10 minutes
          result.issues.push("No recent log activity");
        }
      } else {
        result.issues.push("Log file not found");
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`Cursor Agent check: ${result.status}`);
    return result;
  }

  async checkFileCleanup() {
    this.log("Checking file cleanup...");

    const result = {
      check: "File Cleanup",
      expected: "No files older than 7 days in temp/logs directories",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      const tempDir = path.join(this.workspaceRoot, "temp");
      const logsDir = path.join(this.workspaceRoot, "logs");
      const archiveDir = path.join(this.workspaceRoot, "archive");

      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      let oldFilesFound = 0;

      // Check temp directory
      if (fs.existsSync(tempDir)) {
        const tempFiles = fs.readdirSync(tempDir);
        for (const file of tempFiles) {
          const filePath = path.join(tempDir, file);
          const stats = fs.statSync(filePath);
          const age = Date.now() - stats.mtime.getTime();

          if (age > maxAge) {
            oldFilesFound++;
            result.issues.push(`Old file in temp: ${file}`);
          }
        }
      }

      // Check logs directory
      if (fs.existsSync(logsDir)) {
        const logFiles = fs.readdirSync(logsDir);
        for (const file of logFiles) {
          const filePath = path.join(logsDir, file);
          const stats = fs.statSync(filePath);
          const age = Date.now() - stats.mtime.getTime();

          if (age > maxAge) {
            oldFilesFound++;
            result.issues.push(`Old file in logs: ${file}`);
          }
        }
      }

      result.details.oldFilesFound = oldFilesFound;
      result.details.archiveExists = fs.existsSync(archiveDir);

      if (oldFilesFound === 0) {
        result.status = "passed";
      } else {
        result.status = "failed";
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`File cleanup check: ${result.status}`);
    return result;
  }

  async checkWorkflowIntegrity() {
    this.log("Checking workflow integrity...");

    const result = {
      check: "Workflow Integrity",
      expected: "All n8n workflows run without errors",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      const workflowFile = path.join(
        this.workspaceRoot,
        "n8n-workflows",
        "social-media-posting.json",
      );
      const testResultsFile = path.join(
        this.workspaceRoot,
        "temp",
        "workflow-test-results.json",
      );

      // Check if workflow file exists
      if (fs.existsSync(workflowFile)) {
        const workflow = JSON.parse(fs.readFileSync(workflowFile, "utf8"));
        result.details.workflowExists = true;
        result.details.nodeCount = workflow.nodes ? workflow.nodes.length : 0;

        // Validate workflow structure
        if (!workflow.nodes || workflow.nodes.length === 0) {
          result.issues.push("Workflow has no nodes");
        }

        if (!workflow.connections) {
          result.issues.push("Workflow has no connections");
        }
      } else {
        result.issues.push("Workflow file not found");
      }

      // Check test results
      if (fs.existsSync(testResultsFile)) {
        const testResults = JSON.parse(
          fs.readFileSync(testResultsFile, "utf8"),
        );
        result.details.testResults = testResults;

        if (testResults.errors && testResults.errors.length > 0) {
          result.issues.push(
            `${testResults.errors.length} workflow errors found`,
          );
        }
      } else {
        result.issues.push("Workflow test results not found");
      }

      if (result.issues.length === 0) {
        result.status = "passed";
      } else {
        result.status = "failed";
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`Workflow integrity check: ${result.status}`);
    return result;
  }

  async checkSocialMediaPosts() {
    this.log("Checking social media posts...");

    const result = {
      check: "Social Media Posts",
      expected: "3 posts per day published successfully to each platform",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      const scheduleFile = path.join(
        this.workspaceRoot,
        "temp",
        "post-schedule.json",
      );
      const socialMediaReportFile = path.join(
        this.workspaceRoot,
        "reports",
        "social-media-report.json",
      );

      // Check schedule file
      if (fs.existsSync(scheduleFile)) {
        const schedule = JSON.parse(fs.readFileSync(scheduleFile, "utf8"));
        result.details.scheduledPosts = schedule.length;
        result.details.completedPosts = schedule.filter(
          (p) => p.status === "completed",
        ).length;
        result.details.failedPosts = schedule.filter(
          (p) => p.status === "failed",
        ).length;
      } else {
        result.issues.push("Post schedule file not found");
      }

      // Check social media report
      if (fs.existsSync(socialMediaReportFile)) {
        const report = JSON.parse(
          fs.readFileSync(socialMediaReportFile, "utf8"),
        );
        result.details.report = report.summary;

        if (report.summary && report.summary.failedPosts > 0) {
          result.issues.push(`${report.summary.failedPosts} posts failed`);
        }
      } else {
        result.issues.push("Social media report not found");
      }

      if (result.issues.length === 0) {
        result.status = "passed";
      } else {
        result.status = "failed";
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`Social media posts check: ${result.status}`);
    return result;
  }

  async checkDashboardAndReports() {
    this.log("Checking dashboard and reports...");

    const result = {
      check: "Dashboard and Reports",
      expected: "Final report generated and dashboard updated",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      const finalReportFile = path.join(
        this.workspaceRoot,
        "reports",
        "final-report.json",
      );
      const masterReportFile = path.join(
        this.workspaceRoot,
        "reports",
        "master-execution-report.json",
      );

      // Check final report
      if (fs.existsSync(finalReportFile)) {
        const finalReport = JSON.parse(
          fs.readFileSync(finalReportFile, "utf8"),
        );
        result.details.finalReportExists = true;
        result.details.finalReportStatus =
          finalReport.summary?.overallStatus || "unknown";
      } else {
        result.issues.push("Final report not found");
      }

      // Check master execution report
      if (fs.existsSync(masterReportFile)) {
        const masterReport = JSON.parse(
          fs.readFileSync(masterReportFile, "utf8"),
        );
        result.details.masterReportExists = true;
        result.details.masterReportModules = masterReport.modules?.length || 0;
      } else {
        result.issues.push("Master execution report not found");
      }

      if (result.issues.length === 0) {
        result.status = "passed";
      } else {
        result.status = "failed";
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`Dashboard and reports check: ${result.status}`);
    return result;
  }

  async checkAdminPermissions() {
    this.log("Checking admin permissions...");

    const result = {
      check: "Admin Permissions",
      expected: "All users have correct roles",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      const adminReportFile = path.join(
        this.workspaceRoot,
        "reports",
        "admin-report.json",
      );

      if (fs.existsSync(adminReportFile)) {
        const adminReport = JSON.parse(
          fs.readFileSync(adminReportFile, "utf8"),
        );
        result.details.adminReport = adminReport.summary;

        if (adminReport.summary) {
          if (adminReport.summary.invalidUsers > 0) {
            result.issues.push(
              `${adminReport.summary.invalidUsers} users have invalid permissions`,
            );
          }

          if (adminReport.summary.invalidRoles > 0) {
            result.issues.push(
              `${adminReport.summary.invalidRoles} roles are invalid`,
            );
          }

          if (!adminReport.supabaseConnection?.success) {
            result.issues.push("Supabase connection failed");
          }
        }
      } else {
        result.issues.push("Admin report not found");
      }

      if (result.issues.length === 0) {
        result.status = "passed";
      } else {
        result.status = "failed";
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`Admin permissions check: ${result.status}`);
    return result;
  }

  async checkEnhancementsApplied() {
    this.log("Checking enhancements applied...");

    const result = {
      check: "Enhancements Applied",
      expected: "All optimizations active and functioning",
      status: "unknown",
      details: {},
      issues: [],
    };

    try {
      const enhancementsReportFile = path.join(
        this.workspaceRoot,
        "reports",
        "enhancements-report.json",
      );

      if (fs.existsSync(enhancementsReportFile)) {
        const enhancementsReport = JSON.parse(
          fs.readFileSync(enhancementsReportFile, "utf8"),
        );
        result.details.enhancementsReport = enhancementsReport.summary;

        if (enhancementsReport.summary) {
          if (enhancementsReport.summary.failedEnhancements > 0) {
            result.issues.push(
              `${enhancementsReport.summary.failedEnhancements} enhancements failed`,
            );
          }
        }
      } else {
        result.issues.push("Enhancements report not found");
      }

      // Check for enhancement config files
      const configFiles = [
        "config/cache-config.json",
        "config/error-recovery.json",
        "config/logging.json",
        "config/health-checks.json",
      ];

      let missingConfigs = 0;
      for (const configFile of configFiles) {
        if (!fs.existsSync(path.join(this.workspaceRoot, configFile))) {
          missingConfigs++;
          result.issues.push(`Missing config file: ${configFile}`);
        }
      }

      if (result.issues.length === 0) {
        result.status = "passed";
      } else {
        result.status = "failed";
      }
    } catch (error) {
      result.status = "failed";
      result.issues.push(`Error: ${error.message}`);
    }

    this.log(`Enhancements applied check: ${result.status}`);
    return result;
  }

  async runVerification() {
    this.log("Starting verification process...");

    const checks = [
      await this.checkCursorAgentStatus(),
      await this.checkFileCleanup(),
      await this.checkWorkflowIntegrity(),
      await this.checkSocialMediaPosts(),
      await this.checkDashboardAndReports(),
      await this.checkAdminPermissions(),
      await this.checkEnhancementsApplied(),
    ];

    const report = {
      timestamp: new Date().toISOString(),
      checks: checks,
      summary: {
        totalChecks: checks.length,
        passedChecks: checks.filter((c) => c.status === "passed").length,
        failedChecks: checks.filter((c) => c.status === "failed").length,
        overallStatus: "unknown",
      },
    };

    // Determine overall status
    if (report.summary.failedChecks === 0) {
      report.summary.overallStatus = "success";
    } else if (report.summary.passedChecks > 0) {
      report.summary.overallStatus = "partial";
    } else {
      report.summary.overallStatus = "failed";
    }

    // Save verification report
    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));

    this.log(
      `Verification completed: ${report.summary.passedChecks}/${report.summary.totalChecks} checks passed`,
    );

    return report;
  }
}

// Main execution
if (require.main === module) {
  const verification = new VerificationModule();

  verification
    .runVerification()
    .then((report) => {
      console.log("Verification completed");
      console.log(`Overall Status: ${report.summary.overallStatus}`);
      console.log(
        `Passed Checks: ${report.summary.passedChecks}/${report.summary.totalChecks}`,
      );

      if (report.summary.failedChecks > 0) {
        console.log("Failed Checks:");
        report.checks
          .filter((c) => c.status === "failed")
          .forEach((check) => {
            console.log(`  - ${check.check}: ${check.issues.join(", ")}`);
          });
      }
    })
    .catch((error) => {
      console.error("Verification failed:", error);
      process.exit(1);
    });
}

module.exports = VerificationModule;
