#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

class AdvancedMonitoring {
  constructor() {
    this.workspaceRoot = path.join(__dirname, "..");
    this.logFile = path.join(
      this.workspaceRoot,
      "logs",
      "advanced-monitoring.log",
    );
    this.metricsFile = path.join(
      this.workspaceRoot,
      "temp",
      "monitoring-metrics.json",
    );
    this.alertsFile = path.join(this.workspaceRoot, "temp", "alerts.json");
    this.thresholds = {
      memoryUsage: 100 * 1024 * 1024, // 100MB
      cpuUsage: 80, // 80%
      diskUsage: 90, // 90%
      responseTime: 5000, // 5 seconds
      errorRate: 10, // 10%
    };
  }

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] Advanced Monitoring: ${message}\n`;

    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async collectSystemMetrics() {
    this.log("Collecting system metrics...");

    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      performance: {
        cpuUsage: await this.getCPUUsage(),
        diskUsage: await this.getDiskUsage(),
        networkLatency: await this.getNetworkLatency(),
      },
      application: {
        activeProcesses: await this.getActiveProcesses(),
        fileSystemHealth: await this.getFileSystemHealth(),
        logFileSizes: await this.getLogFileSizes(),
      },
    };

    return metrics;
  }

  async getCPUUsage() {
    return new Promise((resolve) => {
      exec("ps -o pid,pcpu,pmem,comm -p " + process.pid, (error, stdout) => {
        if (error) {
          resolve(0);
        } else {
          const lines = stdout.trim().split("\n");
          if (lines.length > 1) {
            const values = lines[1].trim().split(/\s+/);
            resolve(parseFloat(values[1]) || 0);
          } else {
            resolve(0);
          }
        }
      });
    });
  }

  async getDiskUsage() {
    return new Promise((resolve) => {
      exec("df -h", (error, stdout) => {
        if (error) {
          resolve({ error: error.message });
        } else {
          resolve({ output: stdout });
        }
      });
    });
  }

  async getNetworkLatency() {
    return new Promise((resolve) => {
      exec("ping -c 1 8.8.8.8", (error, stdout) => {
        if (error) {
          resolve({ error: error.message });
        } else {
          const match = stdout.match(/time=(\d+\.?\d*)/);
          resolve({ latency: match ? parseFloat(match[1]) : 0 });
        }
      });
    });
  }

  async getActiveProcesses() {
    return new Promise((resolve) => {
      exec("ps aux | grep node | grep -v grep | wc -l", (error, stdout) => {
        if (error) {
          resolve(0);
        } else {
          resolve(parseInt(stdout.trim()) || 0);
        }
      });
    });
  }

  async getFileSystemHealth() {
    const health = {
      tempDir: fs.existsSync(path.join(this.workspaceRoot, "temp")),
      logsDir: fs.existsSync(path.join(this.workspaceRoot, "logs")),
      reportsDir: fs.existsSync(path.join(this.workspaceRoot, "reports")),
      configDir: fs.existsSync(path.join(this.workspaceRoot, "config")),
    };

    return health;
  }

  async getLogFileSizes() {
    const logDir = path.join(this.workspaceRoot, "logs");
    const sizes = {};

    if (fs.existsSync(logDir)) {
      const files = fs.readdirSync(logDir);
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        sizes[file] = stats.size;
      }
    }

    return sizes;
  }

  async analyzeMetrics(metrics) {
    this.log("Analyzing metrics for anomalies...");

    const alerts = [];

    // Memory usage check
    if (metrics.system.memory.heapUsed > this.thresholds.memoryUsage) {
      alerts.push({
        type: "memory_usage",
        severity: "warning",
        message: `High memory usage: ${Math.round(metrics.system.memory.heapUsed / 1024 / 1024)}MB`,
        value: metrics.system.memory.heapUsed,
        threshold: this.thresholds.memoryUsage,
      });
    }

    // CPU usage check
    if (metrics.performance.cpuUsage > this.thresholds.cpuUsage) {
      alerts.push({
        type: "cpu_usage",
        severity: "warning",
        message: `High CPU usage: ${metrics.performance.cpuUsage}%`,
        value: metrics.performance.cpuUsage,
        threshold: this.thresholds.cpuUsage,
      });
    }

    // File system health check
    const fsHealth = metrics.application.fileSystemHealth;
    const missingDirs = Object.entries(fsHealth).filter(
      ([dir, exists]) => !exists,
    );
    if (missingDirs.length > 0) {
      alerts.push({
        type: "filesystem_health",
        severity: "error",
        message: `Missing directories: ${missingDirs.map(([dir]) => dir).join(", ")}`,
        value: missingDirs.length,
        threshold: 0,
      });
    }

    // Log file size check
    const logSizes = metrics.application.logFileSizes;
    for (const [file, size] of Object.entries(logSizes)) {
      if (size > 50 * 1024 * 1024) {
        // 50MB
        alerts.push({
          type: "log_file_size",
          severity: "info",
          message: `Large log file: ${file} (${Math.round(size / 1024 / 1024)}MB)`,
          value: size,
          threshold: 50 * 1024 * 1024,
        });
      }
    }

    return alerts;
  }

  async processAlerts(alerts) {
    this.log(`Processing ${alerts.length} alerts...`);

    for (const alert of alerts) {
      this.log(
        `Alert [${alert.severity.toUpperCase()}]: ${alert.message}`,
        alert.severity,
      );

      // Auto-fix certain types of alerts
      if (alert.type === "filesystem_health") {
        await this.fixFileSystemHealth();
      } else if (alert.type === "log_file_size") {
        await this.rotateLogFile(alert.message.split(": ")[1]);
      }
    }

    // Save alerts for reporting
    const alertsData = {
      timestamp: new Date().toISOString(),
      alerts: alerts,
      totalAlerts: alerts.length,
      severityCounts: {
        error: alerts.filter((a) => a.severity === "error").length,
        warning: alerts.filter((a) => a.severity === "warning").length,
        info: alerts.filter((a) => a.severity === "info").length,
      },
    };

    fs.writeFileSync(this.alertsFile, JSON.stringify(alertsData, null, 2));
  }

  async fixFileSystemHealth() {
    this.log("Fixing file system health...");

    const dirs = [
      "temp",
      "logs",
      "reports",
      "config",
      "sandbox",
      "learning",
      "backups",
    ];

    for (const dir of dirs) {
      const dirPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        this.log(`Created missing directory: ${dir}`);
      }
    }
  }

  async rotateLogFile(filename) {
    this.log(`Rotating log file: ${filename}`);

    const logPath = path.join(this.workspaceRoot, "logs", filename);
    const backupPath = path.join(
      this.workspaceRoot,
      "backups",
      `${filename}.${Date.now()}`,
    );

    if (fs.existsSync(logPath)) {
      // Create backup
      fs.copyFileSync(logPath, backupPath);

      // Clear original file
      fs.writeFileSync(logPath, "");

      this.log(`Log file rotated: ${filename} -> ${backupPath}`);
    }
  }

  async generateMonitoringReport() {
    this.log("Generating monitoring report...");

    const metrics = await this.collectSystemMetrics();
    const alerts = await this.analyzeMetrics(metrics);
    await this.processAlerts(alerts);

    const report = {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      alerts: alerts,
      summary: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter((a) => a.severity === "error").length,
        warningAlerts: alerts.filter((a) => a.severity === "warning").length,
        infoAlerts: alerts.filter((a) => a.severity === "info").length,
        systemHealth: alerts.length === 0 ? "healthy" : "degraded",
      },
    };

    // Save metrics
    fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));

    // Save report
    const reportFile = path.join(
      this.workspaceRoot,
      "reports",
      "monitoring-report.json",
    );
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Monitoring report saved: ${reportFile}`);
    return report;
  }

  async startMonitoring() {
    this.log("Starting advanced monitoring...");

    // Initial metrics collection
    await this.generateMonitoringReport();

    // Set up continuous monitoring
    const monitoringInterval = setInterval(async () => {
      try {
        await this.generateMonitoringReport();
      } catch (error) {
        this.log(`Monitoring error: ${error.message}`, "error");
      }
    }, 60000); // Every minute

    // Cleanup on exit
    process.on("SIGINT", () => {
      clearInterval(monitoringInterval);
      this.log("Monitoring stopped");
    });

    process.on("SIGTERM", () => {
      clearInterval(monitoringInterval);
      this.log("Monitoring stopped");
    });
  }
}

// Main execution
if (require.main === module) {
  const monitoring = new AdvancedMonitoring();
  monitoring.startMonitoring().catch((error) => {
    console.error("Monitoring failed:", error);
    process.exit(1);
  });
}

module.exports = AdvancedMonitoring;
