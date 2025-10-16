#!/usr/bin/env node

const { spawn } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

// Import shared utilities
const FileLock = require("./lib/file-lock");
const UsageMapManager = require("./lib/usage-map");

class MultiAgentCoordinator {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.parallel = options.parallel || false;
    this.agents = options.agents || ["frontend", "backend", "shared"];

    this.fileLock = new FileLock();
    this.usageMap = new UsageMapManager();

    this.results = {
      startTime: new Date(),
      endTime: null,
      timeTaken: 0,
      agents: {},
      totalFilesScanned: 0,
      totalFilesMoved: 0,
      totalFilesSkipped: 0,
      conflicts: [],
      warnings: [],
    };
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log("🚀 Multi-Agent Cleanup Coordinator Starting...");
      console.log(`🤖 Agents: ${this.agents.join(", ")}`);
      console.log(`🔍 Mode: ${this.dryRun ? "DRY RUN" : "EXECUTE"}`);
      console.log(`⚡ Parallel: ${this.parallel ? "ENABLED" : "DISABLED"}`);

      // Step 1: Pre-flight checks
      await this.preFlightChecks();

      // Step 2: Run agents
      if (this.parallel) {
        await this.runAgentsParallel();
      } else {
        await this.runAgentsSequential();
      }

      // Step 3: Generate unified report
      await this.generateUnifiedReport();

      // Step 4: Update global usage map
      await this.updateGlobalUsageMap();

      this.results.endTime = new Date();
      this.results.timeTaken = this.results.endTime - this.results.startTime;

      console.log("✅ Multi-Agent Cleanup completed successfully");
      this.printSummary();
    } catch (error) {
      console.error("❌ Multi-Agent Cleanup failed:", error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Pre-flight checks
   */
  async preFlightChecks() {
    console.log("\n🔍 Step 1: Pre-flight checks...");

    // Check if quarantine directory exists
    const quarantineDir = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
    );
    try {
      await fs.access(quarantineDir);
    } catch (error) {
      console.log("📁 Creating quarantine directory...");
      await fs.mkdir(quarantineDir, { recursive: true });
      await fs.mkdir(path.join(quarantineDir, "frontend"), { recursive: true });
      await fs.mkdir(path.join(quarantineDir, "backend"), { recursive: true });
      await fs.mkdir(path.join(quarantineDir, "shared"), { recursive: true });
    }

    // Check if usage map exists
    const usageMapPath = path.join(quarantineDir, "usage-map.json");
    try {
      await fs.access(usageMapPath);
    } catch (error) {
      console.log("📝 Creating usage map...");
      await fs.writeFile(
        usageMapPath,
        JSON.stringify(
          {
            agentUpdates: {},
            fileReferences: {},
            lastUpdated: null,
            version: "1.0.0",
          },
          null,
          2,
        ),
      );
    }

    // Check if cleanup log exists
    const cleanupLogPath = path.join(quarantineDir, "cleanup-log.json");
    try {
      await fs.access(cleanupLogPath);
    } catch (error) {
      console.log("📋 Creating cleanup log...");
      await fs.writeFile(cleanupLogPath, JSON.stringify([], null, 2));
    }

    // Check if rollback commands file exists
    const rollbackPath = path.join(quarantineDir, "rollback-commands.json");
    try {
      await fs.access(rollbackPath);
    } catch (error) {
      console.log("🔄 Creating rollback commands file...");
      await fs.writeFile(rollbackPath, JSON.stringify([], null, 2));
    }

    console.log("✅ Pre-flight checks completed");
  }

  /**
   * Run agents sequentially
   */
  async runAgentsSequential() {
    console.log("\n🔄 Step 2: Running agents sequentially...");

    for (const agent of this.agents) {
      console.log(`\n🤖 Running ${agent} agent...`);
      const agentResult = await this.runAgent(agent);
      this.results.agents[agent] = agentResult;

      // Update totals
      this.results.totalFilesScanned += agentResult.filesScanned || 0;
      this.results.totalFilesMoved += agentResult.filesMoved || 0;
      this.results.totalFilesSkipped += agentResult.filesSkipped || 0;

      if (agentResult.conflicts) {
        this.results.conflicts.push(...agentResult.conflicts);
      }

      if (agentResult.warnings) {
        this.results.warnings.push(...agentResult.warnings);
      }
    }

    console.log("✅ All agents completed");
  }

  /**
   * Run agents in parallel
   */
  async runAgentsParallel() {
    console.log("\n🔄 Step 2: Running agents in parallel...");

    const agentPromises = this.agents.map(async (agent) => {
      console.log(`🤖 Starting ${agent} agent...`);
      const agentResult = await this.runAgent(agent);
      this.results.agents[agent] = agentResult;
      return agentResult;
    });

    const agentResults = await Promise.all(agentPromises);

    // Update totals
    agentResults.forEach((result) => {
      this.results.totalFilesScanned += result.filesScanned || 0;
      this.results.totalFilesMoved += result.filesMoved || 0;
      this.results.totalFilesSkipped += result.filesSkipped || 0;

      if (result.conflicts) {
        this.results.conflicts.push(...result.conflicts);
      }

      if (result.warnings) {
        this.results.warnings.push(...result.warnings);
      }
    });

    console.log("✅ All agents completed");
  }

  /**
   * Run a single agent
   */
  async runAgent(agentName) {
    const startTime = Date.now();

    try {
      const command = this.getAgentCommand(agentName);
      const result = await this.executeCommand(command);

      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      return {
        success: true,
        timeTaken,
        filesScanned: result.filesScanned || 0,
        filesMoved: result.filesMoved || 0,
        filesSkipped: result.filesSkipped || 0,
        conflicts: result.conflicts || [],
        warnings: result.warnings || [],
        output: result.output,
      };
    } catch (error) {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      return {
        success: false,
        timeTaken,
        error: error.message,
        filesScanned: 0,
        filesMoved: 0,
        filesSkipped: 0,
        conflicts: [],
        warnings: [],
      };
    }
  }

  /**
   * Get agent command
   */
  getAgentCommand(agentName) {
    const baseArgs = this.dryRun ? ["--dry-run"] : [];
    if (this.verbose) {
      baseArgs.push("--verbose");
    }

    switch (agentName) {
      case "frontend":
        return {
          command: "node",
          args: ["scripts/agents/frontend-cleaner.js", ...baseArgs],
        };
      case "backend":
        return {
          command: "tsx",
          args: ["src/scripts/agents/backend-cleaner.ts", ...baseArgs],
        };
      case "shared":
        return {
          command: "node",
          args: ["scripts/agents/shared-verifier.js", ...baseArgs],
        };
      default:
        throw new Error(`Unknown agent: ${agentName}`);
    }
  }

  /**
   * Execute command
   */
  async executeCommand({ command, args }) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: this.projectRoot,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let output = "";
      let errorOutput = "";

      child.stdout.on("data", (data) => {
        const text = data.toString();
        output += text;
        if (this.verbose) {
          console.log(text);
        }
      });

      child.stderr.on("data", (data) => {
        const text = data.toString();
        errorOutput += text;
        if (this.verbose) {
          console.error(text);
        }
      });

      child.on("close", (code) => {
        if (code === 0) {
          // Parse output for statistics
          const stats = this.parseAgentOutput(output);
          resolve({
            ...stats,
            output: output,
            errorOutput: errorOutput,
          });
        } else {
          reject(new Error(`Agent failed with code ${code}: ${errorOutput}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Parse agent output for statistics
   */
  parseAgentOutput(output) {
    const stats = {
      filesScanned: 0,
      filesMoved: 0,
      filesSkipped: 0,
      conflicts: [],
      warnings: [],
    };

    // Parse summary lines
    const lines = output.split("\n");
    for (const line of lines) {
      if (line.includes("Total files scanned:")) {
        const match = line.match(/(\d+)/);
        if (match) stats.filesScanned = parseInt(match[1]);
      } else if (line.includes("Files moved:")) {
        const match = line.match(/(\d+)/);
        if (match) stats.filesMoved = parseInt(match[1]);
      } else if (line.includes("Files skipped:")) {
        const match = line.match(/(\d+)/);
        if (match) stats.filesSkipped = parseInt(match[1]);
      }
    }

    return stats;
  }

  /**
   * Generate unified report
   */
  async generateUnifiedReport() {
    console.log("\n📊 Step 3: Generating unified report...");

    const report = {
      coordinator: "Multi-Agent Cleanup",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      parallel: this.parallel,
      agents: this.agents,
      results: this.results,
    };

    // Write to logs directory
    const logsDir = path.join(this.projectRoot, "logs");
    await fs.mkdir(logsDir, { recursive: true });

    const reportFile = path.join(logsDir, "multi_agent_cleanup.log");
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));

    console.log(`✅ Unified report written to ${reportFile}`);
  }

  /**
   * Update global usage map
   */
  async updateGlobalUsageMap() {
    console.log("\n📝 Step 4: Updating global usage map...");

    const status = this.dryRun ? "dry-run" : "completed";
    const allMovedFiles = Object.values(this.results.agents)
      .filter((agent) => agent.success)
      .flatMap((agent) => agent.filesMoved || []);

    await this.usageMap.updateAgentStatus(
      "MultiAgentCoordinator",
      status,
      allMovedFiles,
    );

    // Append to cleanup log
    await this.appendToCleanupLog();

    console.log("✅ Global usage map updated");
  }

  /**
   * Append to cleanup log
   */
  async appendToCleanupLog() {
    const logEntry = {
      coordinator: "Multi-Agent Cleanup",
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? "dry-run" : "execute",
      parallel: this.parallel,
      agents: this.agents,
      totalFilesScanned: this.results.totalFilesScanned,
      totalFilesMoved: this.results.totalFilesMoved,
      totalFilesSkipped: this.results.totalFilesSkipped,
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
   * Print summary
   */
  printSummary() {
    console.log("\n📊 Multi-Agent Cleanup Summary:");
    console.log(`  🤖 Agents run: ${this.agents.join(", ")}`);
    console.log(`  📁 Total files scanned: ${this.results.totalFilesScanned}`);
    console.log(`  📦 Total files moved: ${this.results.totalFilesMoved}`);
    console.log(`  ⏭️ Total files skipped: ${this.results.totalFilesSkipped}`);
    console.log(`  ⚠️ Total warnings: ${this.results.warnings.length}`);
    console.log(
      `  ⏱️ Total time taken: ${(this.results.timeTaken / 1000).toFixed(2)}s`,
    );

    console.log("\n🤖 Agent Results:");
    for (const [agentName, result] of Object.entries(this.results.agents)) {
      const status = result.success ? "✅" : "❌";
      console.log(
        `  ${status} ${agentName}: ${result.filesMoved || 0} moved, ${result.filesSkipped || 0} skipped (${(result.timeTaken / 1000).toFixed(2)}s)`,
      );
      if (!result.success) {
        console.log(`    Error: ${result.error}`);
      }
    }

    if (this.results.conflicts.length > 0 && this.verbose) {
      console.log("\n⚠️ Conflicts:");
      this.results.conflicts.forEach((conflict) => {
        console.log(`  - ${conflict.file}: ${conflict.reason}`);
      });
    }

    if (this.results.warnings.length > 0 && this.verbose) {
      console.log("\n⚠️ Warnings:");
      this.results.warnings.forEach((warning) => {
        console.log(`  - ${warning.file}: ${warning.warning}`);
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
    parallel: args.includes("--parallel") || args.includes("-p"),
    agents: args.includes("--frontend-only")
      ? ["frontend"]
      : args.includes("--backend-only")
        ? ["backend"]
        : args.includes("--shared-only")
          ? ["shared"]
          : ["frontend", "backend", "shared"],
  };

  const coordinator = new MultiAgentCoordinator(options);
  coordinator.run().catch(console.error);
}

module.exports = MultiAgentCoordinator;
