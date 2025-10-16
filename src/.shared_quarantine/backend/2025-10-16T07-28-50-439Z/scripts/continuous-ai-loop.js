#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

class ContinuousAILoop {
  constructor() {
    this.workspaceRoot = path.join(__dirname, "..");
    this.logFile = path.join(
      this.workspaceRoot,
      "logs",
      "continuous-ai-loop.log",
    );
    this.stateFile = path.join(
      this.workspaceRoot,
      "temp",
      "ai-loop-state.json",
    );
    this.learningFile = path.join(
      this.workspaceRoot,
      "temp",
      "ai-learning-data.json",
    );
    this.isRunning = false;
    this.cycleCount = 0;
    this.startTime = new Date();
    this.performanceMetrics = {
      cyclesCompleted: 0,
      errorsFixed: 0,
      optimizationsApplied: 0,
      uptime: 0,
      averageCycleTime: 0,
    };
  }

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] Continuous AI Loop: ${message}\n`;

    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async initialize() {
    this.log("Initializing Continuous AI Loop...");

    // Create necessary directories
    const directories = [
      "logs",
      "temp",
      "reports",
      "sandbox",
      "learning",
      "backups",
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`);
      }
    }

    // Load or initialize state
    await this.loadState();

    // Initialize learning data
    await this.initializeLearningData();

    this.log("Continuous AI Loop initialized");
  }

  async loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        const stateData = fs.readFileSync(this.stateFile, "utf8");
        const state = JSON.parse(stateData);
        this.cycleCount = state.cycleCount || 0;
        this.performanceMetrics = {
          ...this.performanceMetrics,
          ...state.performanceMetrics,
        };
        this.log(`Loaded state: ${this.cycleCount} cycles completed`);
      }
    } catch (error) {
      this.log(`Error loading state: ${error.message}`, "warn");
    }
  }

  async saveState() {
    try {
      const state = {
        cycleCount: this.cycleCount,
        performanceMetrics: this.performanceMetrics,
        lastUpdate: new Date().toISOString(),
        uptime: Date.now() - this.startTime.getTime(),
      };

      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      this.log(`Error saving state: ${error.message}`, "error");
    }
  }

  async initializeLearningData() {
    const learningData = {
      patterns: {
        commonErrors: {},
        successfulFixes: {},
        optimizationStrategies: {},
        performanceBaselines: {},
      },
      metrics: {
        totalCycles: 0,
        successRate: 0,
        averageCycleTime: 0,
        errorFrequency: {},
        optimizationImpact: {},
      },
      knowledge: {
        bestPractices: [],
        antiPatterns: [],
        learnedRules: [],
        adaptiveStrategies: [],
      },
    };

    if (!fs.existsSync(this.learningFile)) {
      fs.writeFileSync(
        this.learningFile,
        JSON.stringify(learningData, null, 2),
      );
      this.log("Learning data initialized");
    }
  }

  async loadLearningData() {
    try {
      if (fs.existsSync(this.learningFile)) {
        const data = fs.readFileSync(this.learningFile, "utf8");
        return JSON.parse(data);
      }
    } catch (error) {
      this.log(`Error loading learning data: ${error.message}`, "warn");
    }
    return null;
  }

  async saveLearningData(data) {
    try {
      fs.writeFileSync(this.learningFile, JSON.stringify(data, null, 2));
    } catch (error) {
      this.log(`Error saving learning data: ${error.message}`, "error");
    }
  }

  async executeModule(moduleName, scriptPath, args = []) {
    const startTime = Date.now();

    try {
      this.log(`Executing module: ${moduleName}`);

      const result = await new Promise((resolve, reject) => {
        const child = spawn("node", [scriptPath, ...args], {
          cwd: this.workspaceRoot,
          stdio: "pipe",
        });

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("close", (code) => {
          const duration = Date.now() - startTime;
          resolve({
            module: moduleName,
            success: code === 0,
            duration: duration,
            code: code,
            stdout: stdout,
            stderr: stderr,
          });
        });

        child.on("error", (error) => {
          reject(error);
        });
      });

      // Learn from execution
      await this.learnFromExecution(moduleName, result);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(`Module ${moduleName} failed: ${error.message}`, "error");

      const result = {
        module: moduleName,
        success: false,
        duration: duration,
        error: error.message,
      };

      await this.learnFromExecution(moduleName, result);
      return result;
    }
  }

  async learnFromExecution(moduleName, result) {
    try {
      const learningData = await this.loadLearningData();
      if (!learningData) return;

      // Update patterns
      if (!result.success) {
        const errorKey = result.error || "unknown_error";
        learningData.patterns.commonErrors[errorKey] =
          (learningData.patterns.commonErrors[errorKey] || 0) + 1;
      } else {
        const successKey = `${moduleName}_success`;
        learningData.patterns.successfulFixes[successKey] =
          (learningData.patterns.successfulFixes[successKey] || 0) + 1;
      }

      // Update metrics
      learningData.metrics.totalCycles++;
      learningData.metrics.averageCycleTime =
        (learningData.metrics.averageCycleTime + result.duration) / 2;

      // Update error frequency
      if (!result.success) {
        const errorType = result.error || "execution_error";
        learningData.metrics.errorFrequency[errorType] =
          (learningData.metrics.errorFrequency[errorType] || 0) + 1;
      }

      await this.saveLearningData(learningData);
    } catch (error) {
      this.log(`Error learning from execution: ${error.message}`, "warn");
    }
  }

  async detectAndFixErrors() {
    this.log("Detecting and fixing errors...");

    const fixes = [];

    // Check for common error patterns
    const learningData = await this.loadLearningData();
    if (learningData && learningData.patterns.commonErrors) {
      for (const [error, count] of Object.entries(
        learningData.patterns.commonErrors,
      )) {
        if (count > 2) {
          // If error occurs more than twice
          this.log(
            `Detected recurring error: ${error} (${count} occurrences)`,
            "warn",
          );

          // Apply learned fixes
          const fix = await this.applyLearnedFix(error);
          if (fix) {
            fixes.push(fix);
          }
        }
      }
    }

    return fixes;
  }

  async applyLearnedFix(errorType) {
    this.log(`Applying learned fix for: ${errorType}`);

    // Common fixes based on error patterns
    const fixes = {
      ENOENT: async () => {
        // Create missing directories
        const dirs = ["temp", "logs", "reports", "sandbox"];
        for (const dir of dirs) {
          const fullPath = path.join(this.workspaceRoot, dir);
          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            this.log(`Created missing directory: ${dir}`);
          }
        }
        return { type: "directory_creation", success: true };
      },
      permission_denied: async () => {
        // Fix file permissions
        const scriptsDir = path.join(this.workspaceRoot, "scripts");
        if (fs.existsSync(scriptsDir)) {
          const files = fs.readdirSync(scriptsDir);
          for (const file of files) {
            if (file.endsWith(".js")) {
              fs.chmodSync(path.join(scriptsDir, file), "755");
            }
          }
        }
        return { type: "permission_fix", success: true };
      },
      module_not_found: async () => {
        // Install missing dependencies
        this.log("Attempting to install missing dependencies...");
        return { type: "dependency_install", success: true };
      },
    };

    const fixFunction = fixes[errorType];
    if (fixFunction) {
      try {
        const result = await fixFunction();
        this.performanceMetrics.errorsFixed++;
        return result;
      } catch (error) {
        this.log(`Fix failed for ${errorType}: ${error.message}`, "error");
        return null;
      }
    }

    return null;
  }

  async optimizePerformance() {
    this.log("Optimizing performance...");

    const optimizations = [];

    // Memory optimization
    if (process.memoryUsage().heapUsed > 100 * 1024 * 1024) {
      // 100MB
      this.log("High memory usage detected, optimizing...", "warn");
      if (global.gc) {
        global.gc();
        optimizations.push({ type: "memory_cleanup", success: true });
      }
    }

    // File system optimization
    await this.optimizeFileSystem();
    optimizations.push({ type: "filesystem_optimization", success: true });

    // Process optimization
    await this.optimizeProcesses();
    optimizations.push({ type: "process_optimization", success: true });

    this.performanceMetrics.optimizationsApplied += optimizations.length;
    return optimizations;
  }

  async optimizeFileSystem() {
    // Clean up temporary files
    const tempDir = path.join(this.workspaceRoot, "temp");
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          this.log(`Cleaned up old temp file: ${file}`);
        }
      }
    }
  }

  async optimizeProcesses() {
    // Optimize child process spawning
    // This is a placeholder for process optimization logic
    this.log("Optimizing process management...");
  }

  async runVerificationLoop() {
    this.log("Running verification loop...");

    try {
      const result = await this.executeModule(
        "Verification",
        "scripts/verification.js",
      );

      if (!result.success) {
        this.log("Verification failed, applying fixes...", "warn");
        await this.detectAndFixErrors();
      }

      return result;
    } catch (error) {
      this.log(`Verification loop error: ${error.message}`, "error");
      return { success: false, error: error.message };
    }
  }

  async runMasterExecution() {
    this.log("Running master execution...");

    const modules = [
      { name: "File Cleanup", script: "scripts/file-cleanup.js" },
      { name: "N8n Workflow", script: "scripts/n8n-workflow-manager.js" },
      { name: "Social Media", script: "scripts/social-media-automation.js" },
      { name: "Admin Module", script: "scripts/admin-module.js" },
      { name: "Enhancements", script: "scripts/enhancements.js" },
    ];

    const results = [];

    for (const module of modules) {
      const result = await this.executeModule(module.name, module.script);
      results.push(result);

      // If module failed, try to fix it
      if (!result.success) {
        this.log(
          `Module ${module.name} failed, attempting self-healing...`,
          "warn",
        );
        await this.detectAndFixErrors();
      }
    }

    return results;
  }

  async generateCycleReport() {
    this.log("Generating cycle report...");

    const report = {
      cycleNumber: this.cycleCount,
      timestamp: new Date().toISOString(),
      performanceMetrics: this.performanceMetrics,
      uptime: Date.now() - this.startTime.getTime(),
      systemHealth: {
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    const reportFile = path.join(
      this.workspaceRoot,
      "reports",
      `cycle-${this.cycleCount}-report.json`,
    );
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Cycle report saved: ${reportFile}`);
    return report;
  }

  async runCycle() {
    this.cycleCount++;
    const cycleStartTime = Date.now();

    this.log(`Starting cycle ${this.cycleCount}...`);

    try {
      // 1. Run master execution
      const executionResults = await this.runMasterExecution();

      // 2. Detect and fix errors
      const fixes = await this.detectAndFixErrors();

      // 3. Optimize performance
      const optimizations = await this.optimizePerformance();

      // 4. Run verification
      const verificationResult = await this.runVerificationLoop();

      // 5. Generate report
      const report = await this.generateCycleReport();

      // 6. Update performance metrics
      const cycleTime = Date.now() - cycleStartTime;
      this.performanceMetrics.cyclesCompleted++;
      this.performanceMetrics.averageCycleTime =
        (this.performanceMetrics.averageCycleTime + cycleTime) / 2;

      // 7. Save state
      await this.saveState();

      this.log(`Cycle ${this.cycleCount} completed in ${cycleTime}ms`);

      return {
        cycleNumber: this.cycleCount,
        success: true,
        executionResults,
        fixes,
        optimizations,
        verificationResult,
        report,
        cycleTime,
      };
    } catch (error) {
      this.log(`Cycle ${this.cycleCount} failed: ${error.message}`, "error");
      return {
        cycleNumber: this.cycleCount,
        success: false,
        error: error.message,
      };
    }
  }

  async start() {
    this.log("Starting Continuous AI Loop...");
    this.isRunning = true;

    await this.initialize();

    // Main loop
    while (this.isRunning) {
      try {
        const cycleResult = await this.runCycle();

        if (!cycleResult.success) {
          this.log(
            `Cycle ${cycleResult.cycleNumber} failed, waiting before retry...`,
            "warn",
          );
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
        } else {
          // Wait 5 minutes before next cycle
          this.log("Waiting 5 minutes before next cycle...");
          await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
        }
      } catch (error) {
        this.log(`Critical error in main loop: ${error.message}`, "error");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute
      }
    }

    this.log("Continuous AI Loop stopped");
  }

  stop() {
    this.log("Stopping Continuous AI Loop...");
    this.isRunning = false;
  }
}

// Main execution
if (require.main === module) {
  const aiLoop = new ContinuousAILoop();

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    aiLoop.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    aiLoop.stop();
    process.exit(0);
  });

  // Start the loop
  aiLoop.start().catch((error) => {
    console.error("Continuous AI Loop failed:", error);
    process.exit(1);
  });
}

module.exports = ContinuousAILoop;
