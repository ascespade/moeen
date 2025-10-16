#!/usr/bin/env node
// shared-infrastructure.js
// Shared utilities for all cleanup agents (FrontendCleaner, BackendCleaner, SharedVerifier)

const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const winston = require("winston");

class SharedInfrastructure {
  constructor() {
    this.workspaceRoot = path.join(__dirname, "../..");
    this.quarantineDir = path.join(
      this.workspaceRoot,
      "src",
      ".shared_quarantine",
    );
    this.lockFile = path.join(this.quarantineDir, ".lock");
    this.usageMapFile = path.join(this.quarantineDir, "usage-map.json");
    this.cleanupLogFile = path.join(this.quarantineDir, "cleanup-log.json");
    this.logsDir = path.join(this.workspaceRoot, "logs");

    this.setupLogger();
  }

  setupLogger() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(this.logsDir, "cleanup-agents.log"),
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  async initializeQuarantineSystem() {
    try {
      // Create quarantine directory structure
      const dirs = [
        this.quarantineDir,
        path.join(this.quarantineDir, "frontend"),
        path.join(this.quarantineDir, "backend"),
        path.join(this.quarantineDir, "shared"),
        this.logsDir,
      ];

      for (const dir of dirs) {
        await fs.mkdir(dir, { recursive: true });
      }

      // Initialize usage map if it doesn't exist
      try {
        await fs.access(this.usageMapFile);
      } catch {
        await fs.writeFile(
          this.usageMapFile,
          JSON.stringify(
            {
              frontend: {},
              backend: {},
              shared: {},
              crossReferences: {},
              lastUpdated: new Date().toISOString(),
            },
            null,
            2,
          ),
        );
      }

      // Initialize cleanup log if it doesn't exist
      try {
        await fs.access(this.cleanupLogFile);
      } catch {
        await fs.writeFile(
          this.cleanupLogFile,
          JSON.stringify(
            {
              sessions: [],
              totalFilesMoved: 0,
              totalSizeRecovered: 0,
              lastCleanup: null,
            },
            null,
            2,
          ),
        );
      }

      this.logger.info("✅ Quarantine system initialized");
    } catch (error) {
      this.logger.error("❌ Failed to initialize quarantine system:", error);
      throw error;
    }
  }

  async acquireLock(agentName, timeoutMs = 30000) {
    const startTime = Date.now();
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        // Check if lock exists
        try {
          const lockData = await fs.readFile(this.lockFile, "utf8");
          const lock = JSON.parse(lockData);

          // Check if lock is expired (older than 5 minutes)
          const lockAge = Date.now() - new Date(lock.timestamp).getTime();
          if (lockAge > 300000) {
            // 5 minutes
            this.logger.warn(`⚠️ Removing expired lock from ${lock.agent}`);
            await fs.unlink(this.lockFile);
          } else if (lock.agent !== agentName) {
            // Another agent has the lock
            if (Date.now() - startTime > timeoutMs) {
              throw new Error(
                `Lock acquisition timeout. Lock held by ${lock.agent}`,
              );
            }

            const backoffDelay = Math.min(1000 * Math.pow(2, retries), 5000);
            this.logger.info(
              `⏳ Waiting for lock (held by ${lock.agent}), retrying in ${backoffDelay}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            retries++;
            continue;
          }
        } catch (error) {
          // Lock file doesn't exist, we can acquire it
        }

        // Create lock
        const lockData = {
          agent: agentName,
          timestamp: new Date().toISOString(),
          pid: process.pid,
        };

        await fs.writeFile(this.lockFile, JSON.stringify(lockData, null, 2));
        this.logger.info(`🔒 Lock acquired by ${agentName}`);
        return true;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          throw new Error(
            `Failed to acquire lock after ${maxRetries} retries: ${error.message}`,
          );
        }

        const backoffDelay = Math.min(1000 * Math.pow(2, retries), 5000);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }

    return false;
  }

  async releaseLock(agentName) {
    try {
      const lockData = await fs.readFile(this.lockFile, "utf8");
      const lock = JSON.parse(lockData);

      if (lock.agent === agentName) {
        await fs.unlink(this.lockFile);
        this.logger.info(`🔓 Lock released by ${agentName}`);
        return true;
      } else {
        this.logger.warn(`⚠️ Attempted to release lock held by ${lock.agent}`);
        return false;
      }
    } catch (error) {
      this.logger.error("❌ Failed to release lock:", error);
      return false;
    }
  }

  async readUsageMap() {
    try {
      const data = await fs.readFile(this.usageMapFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      this.logger.error("❌ Failed to read usage map:", error);
      return {
        frontend: {},
        backend: {},
        shared: {},
        crossReferences: {},
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  async updateUsageMap(agentName, findings) {
    try {
      const usageMap = await this.readUsageMap();
      usageMap[agentName] = findings;
      usageMap.lastUpdated = new Date().toISOString();

      await fs.writeFile(this.usageMapFile, JSON.stringify(usageMap, null, 2));
      this.logger.info(`📝 Usage map updated by ${agentName}`);
      return usageMap;
    } catch (error) {
      this.logger.error("❌ Failed to update usage map:", error);
      throw error;
    }
  }

  async logCleanupAction(agentName, action, details) {
    try {
      const logData = await fs.readFile(this.cleanupLogFile, "utf8");
      const log = JSON.parse(logData);

      const session = {
        agent: agentName,
        action,
        timestamp: new Date().toISOString(),
        details,
      };

      log.sessions.push(session);
      log.lastCleanup = new Date().toISOString();

      if (action === "move") {
        log.totalFilesMoved += details.filesMoved || 0;
        log.totalSizeRecovered += details.sizeRecovered || 0;
      }

      await fs.writeFile(this.cleanupLogFile, JSON.stringify(log, null, 2));
      this.logger.info(`📋 Cleanup action logged: ${agentName} - ${action}`);
    } catch (error) {
      this.logger.error("❌ Failed to log cleanup action:", error);
    }
  }

  generateFileHash(filePath) {
    try {
      const content = require("fs").readFileSync(filePath);
      return crypto.createHash("sha256").update(content).digest("hex");
    } catch (error) {
      this.logger.warn(
        `⚠️ Could not generate hash for ${filePath}:`,
        error.message,
      );
      return null;
    }
  }

  async moveFileToQuarantine(sourcePath, agentName, preserveStructure = true) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const quarantineSubDir = path.join(
        this.quarantineDir,
        agentName,
        timestamp,
      );

      // Create quarantine subdirectory
      await fs.mkdir(quarantineSubDir, { recursive: true });

      let targetPath;
      if (preserveStructure) {
        // Preserve relative path structure
        const relativePath = path.relative(this.workspaceRoot, sourcePath);
        targetPath = path.join(quarantineSubDir, relativePath);

        // Create subdirectories if needed
        const targetDir = path.dirname(targetPath);
        await fs.mkdir(targetDir, { recursive: true });
      } else {
        // Just move to quarantine root
        const fileName = path.basename(sourcePath);
        targetPath = path.join(quarantineSubDir, fileName);
      }

      // Move file
      await fs.rename(sourcePath, targetPath);

      // Get file stats
      const stats = await fs.stat(targetPath);

      this.logger.info(`📦 Moved ${sourcePath} -> ${targetPath}`);

      return {
        sourcePath,
        targetPath,
        size: stats.size,
        hash: this.generateFileHash(targetPath),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`❌ Failed to move file ${sourcePath}:`, error);
      throw error;
    }
  }

  async generateRollbackScript(sessionId) {
    try {
      const logData = await fs.readFile(this.cleanupLogFile, "utf8");
      const log = JSON.parse(logData);

      const sessionActions = log.sessions.filter(
        (s) =>
          s.timestamp.includes(sessionId) ||
          s.timestamp.includes(sessionId.split("-")[0]),
      );

      const rollbackCommands = [];
      rollbackCommands.push("#!/bin/bash");
      rollbackCommands.push("# Rollback script generated by SharedVerifier");
      rollbackCommands.push(`# Session: ${sessionId}`);
      rollbackCommands.push(`# Generated: ${new Date().toISOString()}`);
      rollbackCommands.push("");

      // Reverse order for rollback
      const moveActions = sessionActions
        .filter((s) => s.action === "move")
        .reverse();

      for (const action of moveActions) {
        if (action.details.movedFiles) {
          for (const file of action.details.movedFiles) {
            rollbackCommands.push(`# Restoring ${file.sourcePath}`);
            rollbackCommands.push(`mkdir -p "$(dirname "${file.sourcePath}")"`);
            rollbackCommands.push(
              `mv "${file.targetPath}" "${file.sourcePath}"`,
            );
            rollbackCommands.push("");
          }
        }
      }

      const rollbackScriptPath = path.join(
        this.logsDir,
        `rollback-${sessionId}.sh`,
      );
      await fs.writeFile(rollbackScriptPath, rollbackCommands.join("\n"));

      // Make executable
      await fs.chmod(rollbackScriptPath, "755");

      this.logger.info(`📜 Rollback script generated: ${rollbackScriptPath}`);
      return rollbackScriptPath;
    } catch (error) {
      this.logger.error("❌ Failed to generate rollback script:", error);
      throw error;
    }
  }

  validateNamingConvention(filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    const ext = path.extname(filePath);

    const violations = [];

    // Check file naming (kebab-case for non-component files)
    if (ext === ".tsx" || ext === ".jsx") {
      // React components should be UpperCamelCase
      if (!/^[A-Z][a-zA-Z0-9]*\.(tsx|jsx)$/.test(fileName)) {
        violations.push(`Component file should be UpperCamelCase: ${fileName}`);
      }
    } else if (ext === ".ts" || ext === ".js") {
      // Other files should be kebab-case
      if (!/^[a-z0-9]+(-[a-z0-9]+)*\.(ts|js)$/.test(fileName)) {
        violations.push(`File should be kebab-case: ${fileName}`);
      }
    }

    // Check directory naming (lowercase)
    if (dirName !== "src" && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dirName)) {
      violations.push(`Directory should be lowercase: ${dirName}`);
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async cleanup() {
    try {
      await this.releaseLock("shared-infrastructure");
      this.logger.info("🧹 Shared infrastructure cleanup completed");
    } catch (error) {
      this.logger.error("❌ Cleanup error:", error);
    }
  }
}

module.exports = SharedInfrastructure;
