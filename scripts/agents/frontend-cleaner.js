#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const FileLock = require("./lib/file-lock");
const UsageMapManager = require("./lib/usage-map");
const ImportAnalyzer = require("./lib/import-analyzer");

class FrontendCleaner {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.scopeDirs = options.scopeDirs || [
      "src/app",
      "src/components",
      "src/hooks",
      "src/styles",
    ];

    this.fileLock = new FileLock();
    this.usageMap = new UsageMapManager();
    this.importAnalyzer = new ImportAnalyzer(this.projectRoot);

    this.results = {
      totalScanned: 0,
      candidates: [],
      moved: [],
      skipped: [],
      conflicts: [],
      warnings: [],
      startTime: new Date(),
      endTime: null,
      timeTaken: 0,
    };
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log("🚀 FrontendCleaner Agent Starting...");
      console.log(`📁 Scope: ${this.scopeDirs.join(", ")}`);
      console.log(`🔍 Mode: ${this.dryRun ? "DRY RUN" : "EXECUTE"}`);

      // Step 1: Build import graph
      await this.buildImportGraph();

      // Step 2: Detect unused files
      await this.detectUnusedFiles();

      // Step 3: Verify by search
      await this.verifyBySearch();

      // Step 4: Run safety checks
      await this.runSafetyChecks();

      // Step 5: Quarantine move (if not dry run)
      if (!this.dryRun) {
        await this.quarantineMove();
      }

      // Step 6: Generate report
      await this.generateReport();

      // Step 7: Update usage map
      await this.updateUsageMap();

      this.results.endTime = new Date();
      this.results.timeTaken = this.results.endTime - this.results.startTime;

      console.log("✅ FrontendCleaner completed successfully");
      this.printSummary();
    } catch (error) {
      console.error("❌ FrontendCleaner failed:", error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Step 1: Build import graph
   */
  async buildImportGraph() {
    console.log("\n📊 Step 1: Building import graph...");

    const graphData = await this.importAnalyzer.buildImportGraph(
      this.scopeDirs,
    );
    this.importGraph = graphData.importGraph;
    this.reverseGraph = graphData.reverseGraph;
    this.entryPoints = graphData.entryPoints;
    this.fileContents = graphData.fileContents;

    this.results.totalScanned = this.importGraph.size;
    console.log(
      `✅ Import graph built with ${this.results.totalScanned} files`,
    );
  }

  /**
   * Step 2: Detect unused files
   */
  async detectUnusedFiles() {
    console.log("\n🔍 Step 2: Detecting unused files...");

    const analysis = this.importAnalyzer.findUnusedFiles();
    this.results.candidates = analysis.unusedFiles;

    console.log(
      `✅ Found ${this.results.candidates.length} candidate files for quarantine`,
    );

    if (this.verbose && this.results.candidates.length > 0) {
      console.log("📋 Candidates:");
      this.results.candidates.forEach((file) => console.log(`  - ${file}`));
    }
  }

  /**
   * Step 3: Verify by search
   */
  async verifyBySearch() {
    console.log(
      "\n🔎 Step 3: Verifying candidates with project-wide search...",
    );

    const verifiedCandidates = [];

    for (const file of this.results.candidates) {
      const isUsed = await this.searchForUsage(file);
      if (!isUsed) {
        verifiedCandidates.push(file);
      } else {
        this.results.skipped.push({
          file,
          reason: "Found usage in project-wide search",
        });
      }
    }

    this.results.candidates = verifiedCandidates;
    console.log(
      `✅ Verified ${this.results.candidates.length} files after search verification`,
    );
  }

  /**
   * Search for file usage across the project
   */
  async searchForUsage(filePath) {
    try {
      // Get relative path without extension for search
      const relativePath = path.relative(this.projectRoot, filePath);
      const searchPath = relativePath.replace(/\.(tsx?|jsx?)$/, "");

      // Search patterns
      const patterns = [
        `"${searchPath}"`,
        `'${searchPath}'`,
        `\`${searchPath}\``,
        `"${relativePath}"`,
        `'${relativePath}'`,
        `\`${relativePath}\``,
        `import.*${searchPath}`,
        `require.*${searchPath}`,
        `from.*${searchPath}`,
      ];

      for (const pattern of patterns) {
        try {
          const result = execSync(
            `grep -r "${pattern}" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude="*.log" 2>/dev/null || true`,
            { cwd: this.projectRoot, encoding: "utf8" },
          );

          if (result.trim()) {
            return true;
          }
        } catch (error) {
          // Ignore grep errors
        }
      }

      return false;
    } catch (error) {
      console.warn(
        `⚠️ Error searching for usage of ${filePath}:`,
        error.message,
      );
      return true; // Assume used if search fails
    }
  }

  /**
   * Step 4: Run safety checks
   */
  async runSafetyChecks() {
    console.log("\n🛡️ Step 4: Running safety checks...");

    const safeCandidates = [];

    for (const file of this.results.candidates) {
      const safetyCheck = await this.checkFileSafety(file);

      if (safetyCheck.safe) {
        safeCandidates.push(file);
      } else {
        this.results.skipped.push({
          file,
          reason: safetyCheck.reason,
        });
      }
    }

    this.results.candidates = safeCandidates;
    console.log(
      `✅ ${this.results.candidates.length} files passed safety checks`,
    );
  }

  /**
   * Check if file is safe to quarantine
   */
  async checkFileSafety(filePath) {
    // Check if file is referenced by other agents
    const isReferenced =
      await this.usageMap.isFileReferencedByOtherAgents(filePath);
    if (isReferenced) {
      return { safe: false, reason: "Referenced by other agent" };
    }

    // Check if file was modified recently (grace period)
    try {
      const stats = await fs.stat(filePath);
      const age = Date.now() - stats.mtime.getTime();
      const gracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 days

      if (age < gracePeriod) {
        return {
          safe: false,
          reason: "File modified recently (within grace period)",
        };
      }
    } catch (error) {
      return { safe: false, reason: "Cannot access file stats" };
    }

    // Check for critical naming patterns
    const criticalPatterns = [
      /middleware/i,
      /provider/i,
      /context/i,
      /config/i,
      /setup/i,
      /init/i,
    ];

    const fileName = path.basename(filePath);
    if (criticalPatterns.some((pattern) => pattern.test(fileName))) {
      return {
        safe: false,
        reason: "File name suggests critical functionality",
      };
    }

    return { safe: true };
  }

  /**
   * Step 5: Quarantine move
   */
  async quarantineMove() {
    if (this.results.candidates.length === 0) {
      console.log("\n📦 Step 5: No files to quarantine");
      return;
    }

    console.log(
      `\n📦 Step 5: Moving ${this.results.candidates.length} files to quarantine...`,
    );

    await this.fileLock.withLock(async () => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const quarantineDir = path.join(
        this.projectRoot,
        "src",
        ".shared_quarantine",
        "frontend",
        timestamp,
      );

      // Create quarantine directory
      await fs.mkdir(quarantineDir, { recursive: true });

      for (const file of this.results.candidates) {
        try {
          await this.moveFileToQuarantine(file, quarantineDir);
          this.results.moved.push(file);
        } catch (error) {
          this.results.warnings.push({
            file,
            warning: `Failed to move: ${error.message}`,
          });
        }
      }
    });

    console.log(`✅ Moved ${this.results.moved.length} files to quarantine`);
  }

  /**
   * Move single file to quarantine
   */
  async moveFileToQuarantine(filePath, quarantineDir) {
    const relativePath = path.relative(this.projectRoot, filePath);
    const quarantinePath = path.join(quarantineDir, relativePath);
    const quarantineDirPath = path.dirname(quarantinePath);

    // Create directory structure
    await fs.mkdir(quarantineDirPath, { recursive: true });

    // Calculate file hash before moving
    const content = await fs.readFile(filePath, "utf8");
    const hash = crypto.createHash("sha256").update(content).digest("hex");

    // Move file atomically
    await fs.rename(filePath, quarantinePath);

    // Store metadata
    const metadata = {
      originalPath: filePath,
      quarantinePath: quarantinePath,
      hash: hash,
      movedAt: new Date().toISOString(),
      agent: "FrontendCleaner",
    };

    const metadataFile = quarantinePath + ".metadata.json";
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
  }

  /**
   * Step 6: Generate report
   */
  async generateReport() {
    console.log("\n📊 Step 6: Generating report...");

    const report = {
      agent: "FrontendCleaner",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      results: this.results,
    };

    // Write to logs directory
    const logsDir = path.join(this.projectRoot, "logs");
    await fs.mkdir(logsDir, { recursive: true });

    const reportFile = path.join(logsDir, "frontend_cleanup.log");
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));

    console.log(`✅ Report written to ${reportFile}`);
  }

  /**
   * Step 7: Update usage map
   */
  async updateUsageMap() {
    console.log("\n📝 Step 7: Updating usage map...");

    const status = this.dryRun ? "dry-run" : "completed";
    const movedFiles = this.dryRun ? [] : this.results.moved;

    await this.usageMap.updateAgentStatus(
      "FrontendCleaner",
      status,
      movedFiles,
    );

    // Add file references for moved files
    for (const file of this.results.moved) {
      await this.usageMap.addFileReference(file, "FrontendCleaner", "moved");
    }

    // Append to cleanup log
    await this.appendToCleanupLog();

    // Generate rollback command
    if (!this.dryRun && this.results.moved.length > 0) {
      await this.generateRollbackCommand();
    }

    console.log("✅ Usage map updated");
  }

  /**
   * Append to cleanup log
   */
  async appendToCleanupLog() {
    const logEntry = {
      agent: "FrontendCleaner",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      filesMoved: this.results.moved.length,
      filesSkipped: this.results.skipped.length,
      timeTaken: this.results.timeTaken,
    };

    const cleanupLogPath = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
      "cleanup-log.json",
    );
    const logData = JSON.parse(await fs.readFile(cleanupLogPath, "utf8"));
    logData.push(logEntry);
    await fs.writeFile(cleanupLogPath, JSON.stringify(logData, null, 2));
  }

  /**
   * Generate rollback command
   */
  async generateRollbackCommand() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rollbackCommand = {
      sessionId: timestamp,
      agent: "FrontendCleaner",
      command: `node scripts/agents/rollback-frontend.js ${timestamp}`,
      files: this.results.moved.map((file) => ({
        from: file.replace(this.projectRoot, "src/.shared_quarantine/frontend"),
        to: file,
      })),
    };

    const rollbackPath = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
      "rollback-commands.json",
    );
    const rollbackData = JSON.parse(await fs.readFile(rollbackPath, "utf8"));
    rollbackData.push(rollbackCommand);
    await fs.writeFile(rollbackPath, JSON.stringify(rollbackData, null, 2));
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log("\n📊 FrontendCleaner Summary:");
    console.log(`  📁 Total files scanned: ${this.results.totalScanned}`);
    console.log(
      `  🎯 Candidates identified: ${this.results.candidates.length + this.results.skipped.length}`,
    );
    console.log(`  📦 Files moved: ${this.results.moved.length}`);
    console.log(`  ⏭️ Files skipped: ${this.results.skipped.length}`);
    console.log(`  ⚠️ Warnings: ${this.results.warnings.length}`);
    console.log(
      `  ⏱️ Time taken: ${(this.results.timeTaken / 1000).toFixed(2)}s`,
    );

    if (this.results.skipped.length > 0 && this.verbose) {
      console.log("\n⏭️ Skipped files:");
      this.results.skipped.forEach((item) => {
        console.log(`  - ${item.file}: ${item.reason}`);
      });
    }

    if (this.results.warnings.length > 0 && this.verbose) {
      console.log("\n⚠️ Warnings:");
      this.results.warnings.forEach((item) => {
        console.log(`  - ${item.file}: ${item.warning}`);
      });
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes("--dry-run") || args.includes("-d"),
    verbose: args.includes("--verbose") || args.includes("-v"),
  };

  const cleaner = new FrontendCleaner(options);
  cleaner.run().catch(console.error);
}

module.exports = FrontendCleaner;
