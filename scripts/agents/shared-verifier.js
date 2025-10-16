#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");
const { glob } = require("glob");

// Import shared utilities
const FileLock = require("./lib/file-lock");
const UsageMapManager = require("./lib/usage-map");

class SharedVerifier {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.scopeDirs = options.scopeDirs || [
      "src/types",
      "src/utils",
      "src/constants",
      "src/config",
      "src/lib",
      "src/hooks",
      "src/context",
      "src/core",
    ];

    this.fileLock = new FileLock();
    this.usageMap = new UsageMapManager();

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
      console.log("🚀 SharedVerifier Agent Starting...");
      console.log(`📁 Scope: ${this.scopeDirs.join(", ")}`);
      console.log(`🔍 Mode: ${this.dryRun ? "DRY RUN" : "EXECUTE"}`);

      // Step 1: Analyze shared files
      await this.analyzeSharedFiles();

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

      console.log("✅ SharedVerifier completed successfully");
      this.printSummary();
    } catch (error) {
      console.error("❌ SharedVerifier failed:", error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Step 1: Analyze shared files
   */
  async analyzeSharedFiles() {
    console.log("\n📊 Step 1: Analyzing shared files...");

    const allFiles = [];

    // Find all relevant shared files
    const filePatterns = this.scopeDirs.map(
      (dir) => `${dir}/**/*.{ts,tsx,js,jsx}`,
    );

    for (const pattern of filePatterns) {
      const files = await new Promise((resolve, reject) => {
        glob(pattern, { cwd: this.projectRoot }, (err, matches) => {
          if (err) reject(err);
          else resolve(matches);
        });
      });
      allFiles.push(...files);
    }

    this.results.totalScanned = allFiles.length;
    console.log(
      `📁 Found ${this.results.totalScanned} shared files to analyze`,
    );

    // Analyze each file
    for (const file of allFiles) {
      await this.analyzeFile(file);
    }

    console.log(`✅ Shared analysis completed`);
  }

  /**
   * Analyze a single shared file
   */
  async analyzeFile(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      const content = await fs.readFile(fullPath, "utf8");

      // Check if file is used based on various patterns
      const isUsed = await this.checkFileUsage(filePath, content);

      if (!isUsed) {
        this.results.candidates.push(filePath);
      }
    } catch (error) {
      console.warn(`⚠️ Error analyzing ${filePath}:`, error.message);
    }
  }

  /**
   * Check if a shared file is being used
   */
  async checkFileUsage(filePath, content) {
    // Check for exports
    const hasExports =
      /export\s+(default\s+)?(function|class|const|let|var|interface|type|enum)/.test(
        content,
      );
    if (!hasExports) {
      return false; // No exports means likely unused
    }

    // Check for type definitions (always consider used if they have exports)
    if (
      filePath.includes("/types/") &&
      (filePath.endsWith(".ts") || filePath.endsWith(".d.ts"))
    ) {
      return true; // Type files with exports are always considered used
    }

    // Check for utility functions
    if (
      filePath.includes("/utils/") &&
      (filePath.endsWith(".ts") || filePath.endsWith(".js"))
    ) {
      // Check if it's imported anywhere
      return await this.searchForUsage(filePath);
    }

    // Check for constants
    if (
      filePath.includes("/constants/") &&
      (filePath.endsWith(".ts") || filePath.endsWith(".js"))
    ) {
      return true; // Constants are always considered used
    }

    // Check for configuration files
    if (
      filePath.includes("/config/") &&
      (filePath.endsWith(".ts") || filePath.endsWith(".js"))
    ) {
      return true; // Config files are always considered used
    }

    // Check for context providers
    if (
      filePath.includes("/context/") &&
      (filePath.endsWith(".tsx") || filePath.endsWith(".jsx"))
    ) {
      return true; // Context providers are always considered used
    }

    // Check for core modules
    if (
      filePath.includes("/core/") &&
      (filePath.endsWith(".ts") || filePath.endsWith(".js"))
    ) {
      return true; // Core modules are always considered used
    }

    // For other files, check if they're imported anywhere
    return await this.searchForUsage(filePath);
  }

  /**
   * Step 2: Detect unused files
   */
  async detectUnusedFiles() {
    console.log("\n🔍 Step 2: Detecting unused files...");

    // Filter out protected files
    const protectedFiles = this.results.candidates.filter((file) =>
      this.isProtectedFile(file),
    );
    const unprotectedFiles = this.results.candidates.filter(
      (file) => !this.isProtectedFile(file),
    );

    this.results.skipped.push(
      ...protectedFiles.map((file) => ({
        file,
        reason: "Protected file pattern",
      })),
    );

    this.results.candidates = unprotectedFiles;

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
      /types/i,
      /constants/i,
      /core/i,
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
        "shared",
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
      agent: "SharedVerifier",
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
      agent: "SharedVerifier",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      results: this.results,
    };

    // Write to logs directory
    const logsDir = path.join(this.projectRoot, "logs");
    await fs.mkdir(logsDir, { recursive: true });

    const reportFile = path.join(logsDir, "shared_cleanup.log");
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

    await this.usageMap.updateAgentStatus("SharedVerifier", status, movedFiles);

    // Add file references for moved files
    for (const file of this.results.moved) {
      await this.usageMap.addFileReference(file, "SharedVerifier", "moved");
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
      agent: "SharedVerifier",
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
      agent: "SharedVerifier",
      command: `node scripts/agents/rollback-shared.js ${timestamp}`,
      files: this.results.moved.map((file) => ({
        from: file.replace(this.projectRoot, "src/.shared_quarantine/shared"),
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
   * Check if file matches protected patterns
   */
  isProtectedFile(filePath) {
    const protectedPatterns = [
      // Type definitions
      /\.d\.ts$/,

      // Test files
      /\.(test|spec)\.(tsx?|jsx?|ts|js)$/,
      /__tests__\//,
      /__mocks__\//,

      // Config files
      /config\.(ts|js)$/,
      /constants\.(ts|js)$/,

      // Context providers
      /context\/.*Provider\.(tsx|jsx)$/,

      // Core modules
      /core\/.*\.(ts|js)$/,

      // Index files
      /index\.(ts|js)$/,
    ];

    return protectedPatterns.some((pattern) => pattern.test(filePath));
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log("\n📊 SharedVerifier Summary:");
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

  const verifier = new SharedVerifier(options);
  verifier.run().catch(console.error);
}

module.exports = SharedVerifier;
