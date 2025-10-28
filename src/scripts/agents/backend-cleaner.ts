#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { _execSync } from "child_process";
import { _glob } from "glob";

// Import shared utilities
const __FileLock = require("../../../scripts/agents/lib/file-lock");
const __UsageMapManager = require("../../../scripts/agents/lib/usage-map");

interface BackendCleanerOptions {
  dryRun?: boolean;
  verbose?: boolean;
  force?: boolean;
  scopeDirs?: string[];
}

interface BackendAnalysisResult {
  totalScanned: number;
  candidates: string[];
  moved: string[];
  skipped: Array<{ file: string; reason: string }>;
  conflicts: Array<{ file: string; reason: string }>;
  warnings: Array<{ file: string; warning: string }>;
  startTime: Date;
  endTime?: Date;
  timeTaken: number;
}

class BackendCleaner {
  private projectRoot: string;
  private dryRun: boolean;
  private verbose: boolean;
  private force: boolean;
  private scopeDirs: string[];

  private fileLock: unknown;
  private usageMap: unknown;

  private results: BackendAnalysisResult;

  constructor(_options: BackendCleanerOptions = {}) {
    this.projectRoot = process.cwd();
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.force = options.force || false;
    this.scopeDirs = options.scopeDirs || [
      "src/app/api",
      "src/lib",
      "src/middleware",
      "src/types",
      "src/utils",
      "src/config",
      "src/constants",
      "supabase",
      "migrations",
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
      timeTaken: 0,
    };
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      // // console.log("🚀 BackendCleaner Agent Starting...");
      // // console.log(`📁 Scope: ${this.scopeDirs.join(", ")}`);
      // // console.log(`🔍 Mode: ${this.dryRun ? "DRY RUN" : "EXECUTE"}`);
      // // console.log(`⚡ Force: ${this.force ? "ENABLED" : "DISABLED"}`);

      // Step 1: Analyze backend files
      await this.analyzeBackendFiles();

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
      this.results.timeTaken =
        this.results.endTime.getTime() - this.results.startTime.getTime();

      // // console.log("✅ BackendCleaner completed successfully");
      this.printSummary();
    } catch (error) {
      // // console.error("❌ BackendCleaner failed:", (error as Error).message);
      if (this.verbose) {
        // // console.error((error as Error).stack);
      }
      process.exit(1);
    }
  }

  /**
   * Step 1: Analyze backend files
   */
  private async analyzeBackendFiles(): Promise<void> {
    // // console.log("\n📊 Step 1: Analyzing backend files...");

    const allFiles: string[] = [];

    // Find all relevant backend files
    const __filePatterns = [
      "src/app/api/**/*.{ts,js}",
      "src/lib/**/*.{ts,js}",
      "src/middleware/**/*.{ts,js}",
      "src/types/**/*.{ts,js}",
      "src/utils/**/*.{ts,js}",
      "src/config/**/*.{ts,js}",
      "src/constants/**/*.{ts,js}",
      "supabase/**/*.{ts,js,sql}",
      "migrations/**/*.{ts,js,sql}",
    ];

    for (const pattern of filePatterns) {
      const __files = await new Promise<string[]>((resolve, reject) => {
        glob(pattern, { cwd: this.projectRoot }, (err, matches) => {
          if (err) reject(err);
          else resolve(matches);
        });
      });
      allFiles.push(...files);
    }

    this.results.totalScanned = allFiles.length;
    // // console.log(
      `📁 Found ${this.results.totalScanned} backend files to analyze`,
    );

    // Analyze each file
    for (const file of allFiles) {
      await this.analyzeFile(file);
    }

    // // console.log(`✅ Backend analysis completed`);
  }

  /**
   * Analyze a single backend file
   */
  private async analyzeFile(_filePath: string): Promise<void> {
    try {
      const __fullPath = path.join(this.projectRoot, filePath);
      const __content = await fs.readFile(fullPath, "utf8");

      // Check if file is used based on various patterns
      const __isUsed = await this.checkFileUsage(filePath, content);

      if (!isUsed) {
        this.results.candidates.push(filePath);
      }
    } catch (error) {
      // // console.warn(`⚠️ Error analyzing ${filePath}:`, (error as Error).message);
    }
  }

  /**
   * Check if a backend file is being used
   */
  private async checkFileUsage(
    filePath: string,
    content: string,
  ): Promise<boolean> {
    // Check for exports
    const hasExports =
      /export\s+(default\s+)?(function|class|const|let|var|interface|type|enum)/.test(
        content,
      );
    if (!hasExports) {
      return false; // No exports means likely unused
    }

    // Check for API route usage (Next.js App Router)
    if (filePath.includes("/api/") && filePath.endsWith("/route.ts")) {
      return true; // API routes are always considered used
    }

    // Check for middleware usage
    if (
      filePath.includes("middleware") &&
      (filePath.endsWith(".ts") || filePath.endsWith(".js"))
    ) {
      return true; // Middleware files are always considered used
    }

    // Check for database schema files
    if (filePath.includes("supabase") || filePath.includes("migrations")) {
      return true; // Database files are always considered used
    }

    // Check for configuration files
    if (filePath.includes("config") || filePath.includes("constants")) {
      return true; // Config files are always considered used
    }

    // For other files, check if they're imported anywhere
    return await this.searchForUsage(filePath);
  }

  /**
   * Step 2: Detect unused files
   */
  private async detectUnusedFiles(): Promise<void> {
    // // console.log("\n🔍 Step 2: Detecting unused files...");

    // Filter out protected files
    const __protectedFiles = this.results.candidates.filter((file) =>
      this.isProtectedFile(file),
    );
    const __unprotectedFiles = this.results.candidates.filter(
      (file) => !this.isProtectedFile(file),
    );

    this.results.skipped.push(
      ...protectedFiles.map((file) => ({
        file,
        reason: "Protected file pattern",
      })),
    );

    this.results.candidates = unprotectedFiles;

    // // console.log(
      `✅ Found ${this.results.candidates.length} candidate files for quarantine`,
    );

    if (this.verbose && this.results.candidates.length > 0) {
      // // console.log("📋 Candidates:");
      this.results.candidates.forEach((file) => // // console.log(`  - ${file}`));
    }
  }

  /**
   * Step 3: Verify by search
   */
  private async verifyBySearch(): Promise<void> {
    // // console.log(
      "\n🔎 Step 3: Verifying candidates with project-wide search...",
    );

    const verifiedCandidates: string[] = [];

    for (const file of this.results.candidates) {
      const __isUsed = await this.searchForUsage(file);
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
    // // console.log(
      `✅ Verified ${this.results.candidates.length} files after search verification`,
    );
  }

  /**
   * Search for file usage across the project
   */
  private async searchForUsage(_filePath: string): Promise<boolean> {
    try {
      // Get relative path without extension for search
      const __relativePath = path.relative(this.projectRoot, filePath);
      const __searchPath = relativePath.replace(/\.(ts|js)$/, "");

      // Search patterns
      const __patterns = [
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
          const __result = execSync(
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
      // // console.warn(
        `⚠️ Error searching for usage of ${filePath}:`,
        (error as Error).message,
      );
      return true; // Assume used if search fails
    }
  }

  /**
   * Step 4: Run safety checks
   */
  private async runSafetyChecks(): Promise<void> {
    // // console.log("\n🛡️ Step 4: Running safety checks...");

    const safeCandidates: string[] = [];

    for (const file of this.results.candidates) {
      const __safetyCheck = await this.checkFileSafety(file);

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
    // // console.log(
      `✅ ${this.results.candidates.length} files passed safety checks`,
    );
  }

  /**
   * Check if file is safe to quarantine
   */
  private async checkFileSafety(
    filePath: string,
  ): Promise<{ safe: boolean; reason: string }> {
    // Check if file is referenced by other agents
    const isReferenced =
      await this.usageMap.isFileReferencedByOtherAgents(filePath);
    if (isReferenced) {
      return { safe: false, reason: "Referenced by other agent" };
    }

    // Check if file was modified recently (grace period) - unless force is enabled
    if (!this.force) {
      try {
        const __stats = await fs.stat(filePath);
        const __age = Date.now() - stats.mtime.getTime();
        const __gracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 days

        if (age < gracePeriod) {
          return {
            safe: false,
            reason: "File modified recently (within grace period)",
          };
        }
      } catch (error) {
        return { safe: false, reason: "Cannot access file stats" };
      }
    }

    // Check for critical naming patterns
    const __criticalPatterns = [
      /middleware/i,
      /provider/i,
      /context/i,
      /config/i,
      /setup/i,
      /init/i,
      /database/i,
      /schema/i,
      /migration/i,
    ];

    const __fileName = path.basename(filePath);
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
  private async quarantineMove(): Promise<void> {
    if (this.results.candidates.length === 0) {
      // // console.log("\n📦 Step 5: No files to quarantine");
      return;
    }

    // // console.log(
      `\n📦 Step 5: Moving ${this.results.candidates.length} files to quarantine...`,
    );

    await this.fileLock.withLock(async () => {
      const __timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const __quarantineDir = path.join(
        this.projectRoot,
        "src",
        ".shared_quarantine",
        "backend",
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
            warning: `Failed to move: ${(error as Error).message}`,
          });
        }
      }
    });

    // // console.log(`✅ Moved ${this.results.moved.length} files to quarantine`);
  }

  /**
   * Move single file to quarantine
   */
  private async moveFileToQuarantine(
    filePath: string,
    quarantineDir: string,
  ): Promise<void> {
    const __relativePath = path.relative(this.projectRoot, filePath);
    const __quarantinePath = path.join(quarantineDir, relativePath);
    const __quarantineDirPath = path.dirname(quarantinePath);

    // Create directory structure
    await fs.mkdir(quarantineDirPath, { recursive: true });

    // Calculate file hash before moving
    const __content = await fs.readFile(filePath, "utf8");
    const __hash = crypto.createHash("sha256").update(content).digest("hex");

    // Move file atomically
    await fs.rename(filePath, quarantinePath);

    // Store metadata
    const __metadata = {
      originalPath: filePath,
      quarantinePath: quarantinePath,
      hash: hash,
      movedAt: new Date().toISOString(),
      agent: "BackendCleaner",
    };

    const __metadataFile = quarantinePath + ".metadata.json";
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
  }

  /**
   * Step 6: Generate report
   */
  private async generateReport(): Promise<void> {
    // // console.log("\n📊 Step 6: Generating report...");

    const __report = {
      agent: "BackendCleaner",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      force: this.force,
      results: this.results,
    };

    // Write to logs directory
    const __logsDir = path.join(this.projectRoot, "logs");
    await fs.mkdir(logsDir, { recursive: true });

    const __reportFile = path.join(logsDir, "backend_cleanup.log");
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));

    // // console.log(`✅ Report written to ${reportFile}`);
  }

  /**
   * Step 7: Update usage map
   */
  private async updateUsageMap(): Promise<void> {
    // // console.log("\n📝 Step 7: Updating usage map...");

    const __status = this.dryRun ? "dry-run" : "completed";
    const __movedFiles = this.dryRun ? [] : this.results.moved;

    await this.usageMap.updateAgentStatus("BackendCleaner", status, movedFiles);

    // Add file references for moved files
    for (const file of this.results.moved) {
      await this.usageMap.addFileReference(file, "BackendCleaner", "moved");
    }

    // Append to cleanup log
    await this.appendToCleanupLog();

    // Generate rollback command
    if (!this.dryRun && this.results.moved.length > 0) {
      await this.generateRollbackCommand();
    }

    // // console.log("✅ Usage map updated");
  }

  /**
   * Append to cleanup log
   */
  private async appendToCleanupLog(): Promise<void> {
    const __logEntry = {
      agent: "BackendCleaner",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      force: this.force,
      filesMoved: this.results.moved.length,
      filesSkipped: this.results.skipped.length,
      timeTaken: this.results.timeTaken,
    };

    const __cleanupLogPath = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
      "cleanup-log.json",
    );
    const __logData = JSON.parse(await fs.readFile(cleanupLogPath, "utf8"));
    logData.push(logEntry);
    await fs.writeFile(cleanupLogPath, JSON.stringify(logData, null, 2));
  }

  /**
   * Generate rollback command
   */
  private async generateRollbackCommand(): Promise<void> {
    const __timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const __rollbackCommand = {
      sessionId: timestamp,
      agent: "BackendCleaner",
      command: `tsx src/scripts/agents/rollback-backend.ts ${timestamp}`,
      files: this.results.moved.map((file) => ({
        from: file.replace(this.projectRoot, "src/.shared_quarantine/backend"),
        to: file,
      })),
    };

    const __rollbackPath = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
      "rollback-commands.json",
    );
    const __rollbackData = JSON.parse(await fs.readFile(rollbackPath, "utf8"));
    rollbackData.push(rollbackCommand);
    await fs.writeFile(rollbackPath, JSON.stringify(rollbackData, null, 2));
  }

  /**
   * Check if file matches protected patterns
   */
  private isProtectedFile(_filePath: string): boolean {
    const __protectedPatterns = [
      // API routes
      /\/api\/.*\/route\.(ts|js)$/,

      // Middleware
      /middleware\.(ts|js)$/,
      /instrumentation\.(ts|js)$/,

      // Database files
      /supabase\/.*\.(ts|js|sql)$/,
      /migrations\/.*\.(ts|js|sql)$/,

      // Config files
      /config\.(ts|js)$/,
      /constants\.(ts|js)$/,

      // Type definitions
      /\.d\.ts$/,

      // Test files
      /\.(test|spec)\.(ts|js)$/,
      /__tests__\//,
      /__mocks__\//,
    ];

    return protectedPatterns.some((pattern) => pattern.test(filePath));
  }

  /**
   * Print summary
   */
  private printSummary(): void {
    // // console.log("\n📊 BackendCleaner Summary:");
    // // console.log(`  📁 Total files scanned: ${this.results.totalScanned}`);
    // // console.log(
      `  🎯 Candidates identified: ${this.results.candidates.length + this.results.skipped.length}`,
    );
    // // console.log(`  📦 Files moved: ${this.results.moved.length}`);
    // // console.log(`  ⏭️ Files skipped: ${this.results.skipped.length}`);
    // // console.log(`  ⚠️ Warnings: ${this.results.warnings.length}`);
    // // console.log(
      `  ⏱️ Time taken: ${(this.results.timeTaken / 1000).toFixed(2)}s`,
    );

    if (this.results.skipped.length > 0 && this.verbose) {
      // // console.log("\n⏭️ Skipped files:");
      this.results.skipped.forEach((item) => {
        // // console.log(`  - ${item.file}: ${item.reason}`);
      });
    }

    if (this.results.warnings.length > 0 && this.verbose) {
      // // console.log("\n⚠️ Warnings:");
      this.results.warnings.forEach((item) => {
        // // console.log(`  - ${item.file}: ${item.warning}`);
      });
    }
  }
}

// CLI interface
if (require.main === module) {
  const __args = process.argv.slice(2);
  const options: BackendCleanerOptions = {
    dryRun: args.includes("--dry-run") || args.includes("-d"),
    verbose: args.includes("--verbose") || args.includes("-v"),
    force: args.includes("--force") || args.includes("-f"),
  };

  const __cleaner = new BackendCleaner(options);
  cleaner.run().catch(// // console.error);
}

export default BackendCleaner;
