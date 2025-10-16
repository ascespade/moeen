#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

class FrontendRollback {
  constructor(timestamp) {
    this.timestamp = timestamp;
    this.projectRoot = process.cwd();
    this.quarantineDir = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
      "frontend",
      timestamp,
    );
  }

  /**
   * Main rollback execution
   */
  async run() {
    try {
      console.log(
        `🔄 FrontendRollback starting for session: ${this.timestamp}`,
      );

      // Check if quarantine directory exists
      await this.checkQuarantineExists();

      // Find all metadata files
      const metadataFiles = await this.findMetadataFiles();

      if (metadataFiles.length === 0) {
        console.log("❌ No files found to rollback");
        return;
      }

      console.log(`📦 Found ${metadataFiles.length} files to restore`);

      // Restore each file
      let restored = 0;
      let failed = 0;

      for (const metadataFile of metadataFiles) {
        try {
          await this.restoreFile(metadataFile);
          restored++;
        } catch (error) {
          console.error(`❌ Failed to restore ${metadataFile}:`, error.message);
          failed++;
        }
      }

      console.log(
        `✅ Rollback completed: ${restored} restored, ${failed} failed`,
      );

      // Clean up quarantine directory
      await this.cleanupQuarantine();
    } catch (error) {
      console.error("❌ Rollback failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Check if quarantine directory exists
   */
  async checkQuarantineExists() {
    try {
      await fs.access(this.quarantineDir);
    } catch (error) {
      throw new Error(`Quarantine directory not found: ${this.quarantineDir}`);
    }
  }

  /**
   * Find all metadata files in quarantine directory
   */
  async findMetadataFiles() {
    const metadataFiles = [];

    const findInDir = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await findInDir(fullPath);
        } else if (entry.name.endsWith(".metadata.json")) {
          metadataFiles.push(fullPath);
        }
      }
    };

    await findInDir(this.quarantineDir);
    return metadataFiles;
  }

  /**
   * Restore a single file from metadata
   */
  async restoreFile(metadataFile) {
    const metadata = JSON.parse(await fs.readFile(metadataFile, "utf8"));
    const { originalPath, quarantinePath, hash, movedAt } = metadata;

    console.log(
      `🔄 Restoring: ${path.relative(this.projectRoot, originalPath)}`,
    );

    // Verify file integrity
    const currentContent = await fs.readFile(quarantinePath, "utf8");
    const currentHash = crypto
      .createHash("sha256")
      .update(currentContent)
      .digest("hex");

    if (currentHash !== hash) {
      throw new Error(`File integrity check failed for ${originalPath}`);
    }

    // Create target directory if it doesn't exist
    const targetDir = path.dirname(originalPath);
    await fs.mkdir(targetDir, { recursive: true });

    // Check if target file already exists
    try {
      await fs.access(originalPath);
      console.log(`⚠️ Target file already exists: ${originalPath}`);
      console.log(`   Moving existing file to backup: ${originalPath}.backup`);
      await fs.rename(originalPath, originalPath + ".backup");
    } catch (error) {
      // File doesn't exist, that's fine
    }

    // Restore file
    await fs.rename(quarantinePath, originalPath);

    // Remove metadata file
    await fs.unlink(metadataFile);

    console.log(
      `✅ Restored: ${path.relative(this.projectRoot, originalPath)}`,
    );
  }

  /**
   * Clean up empty quarantine directory
   */
  async cleanupQuarantine() {
    try {
      // Check if directory is empty
      const entries = await fs.readdir(this.quarantineDir);

      if (entries.length === 0) {
        await fs.rmdir(this.quarantineDir);
        console.log(
          `🧹 Cleaned up empty quarantine directory: ${this.quarantineDir}`,
        );
      } else {
        console.log(
          `⚠️ Quarantine directory not empty, keeping: ${this.quarantineDir}`,
        );
        console.log(`   Remaining files: ${entries.join(", ")}`);
      }
    } catch (error) {
      console.warn(
        `⚠️ Could not clean up quarantine directory: ${error.message}`,
      );
    }
  }

  /**
   * List available rollback sessions
   */
  static async listSessions() {
    const projectRoot = process.cwd();
    const frontendQuarantineDir = path.join(
      projectRoot,
      "src",
      ".shared_quarantine",
      "frontend",
    );

    try {
      const entries = await fs.readdir(frontendQuarantineDir, {
        withFileTypes: true,
      });
      const sessions = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
        .reverse(); // Most recent first

      if (sessions.length === 0) {
        console.log("📭 No rollback sessions available");
        return [];
      }

      console.log("📋 Available rollback sessions:");
      for (const session of sessions) {
        const sessionDir = path.join(frontendQuarantineDir, session);
        const metadataFiles = await this.findMetadataFilesInDir(sessionDir);
        console.log(`  - ${session} (${metadataFiles.length} files)`);
      }

      return sessions;
    } catch (error) {
      console.log("📭 No rollback sessions available");
      return [];
    }
  }

  /**
   * Find metadata files in a specific directory
   */
  static async findMetadataFilesInDir(dir) {
    const metadataFiles = [];

    const findInDir = async (currentDir) => {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            await findInDir(fullPath);
          } else if (entry.name.endsWith(".metadata.json")) {
            metadataFiles.push(fullPath);
          }
        }
      } catch (error) {
        // Ignore errors when traversing directories
      }
    };

    await findInDir(dir);
    return metadataFiles;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--list") || args.includes("-l")) {
    FrontendRollback.listSessions().catch(console.error);
  } else if (args.length === 0) {
    console.log("Usage: node rollback-frontend.js <timestamp>");
    console.log("       node rollback-frontend.js --list");
    console.log("");
    console.log("Examples:");
    console.log("  node rollback-frontend.js 2025-10-16T10-30-45-123Z");
    console.log("  node rollback-frontend.js --list");
    process.exit(1);
  } else {
    const timestamp = args[0];
    const rollback = new FrontendRollback(timestamp);
    rollback.run().catch(console.error);
  }
}

module.exports = FrontendRollback;
