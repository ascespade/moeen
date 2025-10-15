#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class FileCleanupManager {
  constructor() {
    this.workspaceRoot = path.join(__dirname, "..");
    this.tempDir = path.join(this.workspaceRoot, "temp");
    this.logsDir = path.join(this.workspaceRoot, "logs");
    this.archiveDir = path.join(this.workspaceRoot, "archive");
    this.logFile = path.join(this.logsDir, "file-cleanup.log");
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] File Cleanup: ${message}\n`;

    // Ensure logs directory exists
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async cleanupOldFiles() {
    this.log("Starting file cleanup process...");

    let totalCleaned = 0;
    let totalArchived = 0;

    // Clean up temp directory
    const tempCleaned = await this.cleanupDirectory(this.tempDir, 7);
    totalCleaned += tempCleaned;

    // Clean up logs directory
    const logsCleaned = await this.cleanupDirectory(this.logsDir, 7);
    totalCleaned += logsCleaned;

    // Archive important logs
    const archived = await this.archiveImportantLogs();
    totalArchived += archived;

    this.log(
      `Cleanup completed: ${totalCleaned} files deleted, ${totalArchived} files archived`,
    );

    return {
      deleted: totalCleaned,
      archived: totalArchived,
      timestamp: new Date().toISOString(),
    };
  }

  async cleanupDirectory(dirPath, maxAgeDays) {
    if (!fs.existsSync(dirPath)) {
      this.log(`Directory does not exist: ${dirPath}`);
      return 0;
    }

    let cleanedCount = 0;
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000; // Convert to milliseconds

    try {
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          const age = Date.now() - stats.mtime.getTime();

          if (age > maxAge) {
            fs.unlinkSync(filePath);
            cleanedCount++;
            this.log(`Deleted old file: ${file}`);
          }
        } else if (stats.isDirectory()) {
          // Recursively clean subdirectories
          const subCleaned = await this.cleanupDirectory(filePath, maxAgeDays);
          cleanedCount += subCleaned;

          // Remove empty directories
          try {
            const remainingFiles = fs.readdirSync(filePath);
            if (remainingFiles.length === 0) {
              fs.rmdirSync(filePath);
              this.log(`Removed empty directory: ${file}`);
            }
          } catch (error) {
            // Directory not empty or other error, skip
          }
        }
      }
    } catch (error) {
      this.log(`Error cleaning directory ${dirPath}: ${error.message}`);
    }

    return cleanedCount;
  }

  async archiveImportantLogs() {
    this.log("Archiving important logs...");

    // Ensure archive directory exists
    if (!fs.existsSync(this.archiveDir)) {
      fs.mkdirSync(this.archiveDir, { recursive: true });
    }

    let archivedCount = 0;
    const importantLogs = [
      "cursor-agent.log",
      "file-cleanup.log",
      "n8n-workflow.log",
      "social-media.log",
      "dashboard.log",
    ];

    for (const logFile of importantLogs) {
      const sourcePath = path.join(this.logsDir, logFile);

      if (fs.existsSync(sourcePath)) {
        const stats = fs.statSync(sourcePath);
        const age = Date.now() - stats.mtime.getTime();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

        if (age > maxAge) {
          const archivePath = path.join(
            this.archiveDir,
            `${logFile}.${Date.now()}`,
          );
          fs.copyFileSync(sourcePath, archivePath);
          fs.unlinkSync(sourcePath);
          archivedCount++;
          this.log(`Archived log file: ${logFile}`);
        }
      }
    }

    return archivedCount;
  }

  async updateFileIndex() {
    this.log("Updating file index...");

    const fileIndex = {
      timestamp: new Date().toISOString(),
      workspace: this.workspaceRoot,
      files: [],
      directories: [],
    };

    // Scan workspace
    this.scanDirectory(
      this.workspaceRoot,
      fileIndex.files,
      fileIndex.directories,
    );

    // Save file index
    const indexFile = path.join(this.tempDir, "file-index.json");
    fs.writeFileSync(indexFile, JSON.stringify(fileIndex, null, 2));

    this.log(
      `File index updated with ${fileIndex.files.length} files and ${fileIndex.directories.length} directories`,
    );

    return fileIndex;
  }

  scanDirectory(dirPath, fileList, dirList) {
    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          // Skip common directories that don't need indexing
          if (
            ![
              "node_modules",
              ".git",
              ".next",
              "dist",
              "build",
              "coverage",
            ].includes(item)
          ) {
            const relativePath = path.relative(this.workspaceRoot, itemPath);
            dirList.push({
              path: relativePath,
              created: stats.birthtime.toISOString(),
              modified: stats.mtime.toISOString(),
            });

            // Recursively scan subdirectory
            this.scanDirectory(itemPath, fileList, dirList);
          }
        } else {
          const relativePath = path.relative(this.workspaceRoot, itemPath);
          fileList.push({
            path: relativePath,
            size: stats.size,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            extension: path.extname(item),
          });
        }
      }
    } catch (error) {
      this.log(`Error scanning directory ${dirPath}: ${error.message}`);
    }
  }

  async generateCleanupReport() {
    this.log("Generating cleanup report...");

    const report = {
      timestamp: new Date().toISOString(),
      workspace: this.workspaceRoot,
      cleanup: await this.cleanupOldFiles(),
      fileIndex: await this.updateFileIndex(),
      diskUsage: await this.getDiskUsage(),
    };

    // Save report
    const reportFile = path.join(
      this.workspaceRoot,
      "reports",
      "file-cleanup-report.json",
    );
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Cleanup report saved to: ${reportFile}`);

    return report;
  }

  async getDiskUsage() {
    try {
      const { exec } = require("child_process");

      return new Promise((resolve) => {
        exec("df -h", (error, stdout) => {
          if (error) {
            resolve({ error: error.message });
          } else {
            resolve({ output: stdout });
          }
        });
      });
    } catch (error) {
      return { error: error.message };
    }
  }
}

// Main execution
if (require.main === module) {
  const cleanupManager = new FileCleanupManager();

  cleanupManager
    .generateCleanupReport()
    .then((report) => {
      console.log("File cleanup completed successfully");
      console.log(JSON.stringify(report, null, 2));
    })
    .catch((error) => {
      console.error("File cleanup failed:", error);
      process.exit(1);
    });
}

module.exports = FileCleanupManager;
