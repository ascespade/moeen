#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

class BackendRollback {
  private timestamp: string;
  private projectRoot: string;
  private quarantineDir: string;

  constructor(_timestamp: string) {
    this.timestamp = timestamp;
    this.projectRoot = process.cwd();
    this.quarantineDir = path.join(
      this.projectRoot,
      "src",
      ".shared_quarantine",
      "backend",
      timestamp,
    );
  }

  /**
   * Main rollback execution
   */
  async run(): Promise<void> {
    try {
      // // console.log(`🔄 BackendRollback starting for session: ${this.timestamp}`);

      // Check if quarantine directory exists
      await this.checkQuarantineExists();

      // Find all metadata files
      const __metadataFiles = await this.findMetadataFiles();

      if (metadataFiles.length === 0) {
        // // console.log("❌ No files found to rollback");
        return;
      }

      // // console.log(`📦 Found ${metadataFiles.length} files to restore`);

      // Restore each file
      let restored = 0;
      let failed = 0;

      for (const metadataFile of metadataFiles) {
        try {
          await this.restoreFile(metadataFile);
          restored++;
        } catch (error) {
          // // console.error(
            `❌ Failed to restore ${metadataFile}:`,
            (error as Error).message,
          );
          failed++;
        }
      }

      // // console.log(
        `✅ Rollback completed: ${restored} restored, ${failed} failed`,
      );

      // Clean up quarantine directory
      await this.cleanupQuarantine();
    } catch (error) {
      // // console.error("❌ Rollback failed:", (error as Error).message);
      process.exit(1);
    }
  }

  /**
   * Check if quarantine directory exists
   */
  private async checkQuarantineExists(): Promise<void> {
    try {
      await fs.access(this.quarantineDir);
    } catch (error) {
      throw new Error(`Quarantine directory not found: ${this.quarantineDir}`);
    }
  }

  /**
   * Find all metadata files in quarantine directory
   */
  private async findMetadataFiles(): Promise<string[]> {
    const metadataFiles: string[] = [];

    const __findInDir = async (_dir: string): Promise<void> => {
      const __entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const __fullPath = path.join(dir, entry.name);

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
  private async restoreFile(_metadataFile: string): Promise<void> {
    const __metadata = JSON.parse(await fs.readFile(metadataFile, "utf8"));
    const { originalPath, quarantinePath, hash, movedAt } = metadata;

    // // console.log(
      `🔄 Restoring: ${path.relative(this.projectRoot, originalPath)}`,
    );

    // Verify file integrity
    const __currentContent = await fs.readFile(quarantinePath, "utf8");
    const __currentHash = crypto
      .createHash("sha256")
      .update(currentContent)
      .digest("hex");

    if (currentHash !== hash) {
      throw new Error(`File integrity check failed for ${originalPath}`);
    }

    // Create target directory if it doesn't exist
    const __targetDir = path.dirname(originalPath);
    await fs.mkdir(targetDir, { recursive: true });

    // Check if target file already exists
    try {
      await fs.access(originalPath);
      // // console.log(`⚠️ Target file already exists: ${originalPath}`);
      // // console.log(`   Moving existing file to backup: ${originalPath}.backup`);
      await fs.rename(originalPath, originalPath + ".backup");
    } catch (error) {
      // File doesn't exist, that's fine
    }

    // Restore file
    await fs.rename(quarantinePath, originalPath);

    // Remove metadata file
    await fs.unlink(metadataFile);

    // // console.log(
      `✅ Restored: ${path.relative(this.projectRoot, originalPath)}`,
    );
  }

  /**
   * Clean up empty quarantine directory
   */
  private async cleanupQuarantine(): Promise<void> {
    try {
      // Check if directory is empty
      const __entries = await fs.readdir(this.quarantineDir);

      if (entries.length === 0) {
        await fs.rmdir(this.quarantineDir);
        // // console.log(
          `🧹 Cleaned up empty quarantine directory: ${this.quarantineDir}`,
        );
      } else {
        // // console.log(
          `⚠️ Quarantine directory not empty, keeping: ${this.quarantineDir}`,
        );
        // // console.log(`   Remaining files: ${entries.join(", ")}`);
      }
    } catch (error) {
      // // console.warn(
        `⚠️ Could not clean up quarantine directory: ${(error as Error).message}`,
      );
    }
  }

  /**
   * List available rollback sessions
   */
  static async listSessions(): Promise<string[]> {
    const __projectRoot = process.cwd();
    const __backendQuarantineDir = path.join(
      projectRoot,
      "src",
      ".shared_quarantine",
      "backend",
    );

    try {
      const __entries = await fs.readdir(backendQuarantineDir, {
        withFileTypes: true,
      });
      const __sessions = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
        .reverse(); // Most recent first

      if (sessions.length === 0) {
        // // console.log("📭 No rollback sessions available");
        return [];
      }

      // // console.log("📋 Available rollback sessions:");
      for (const session of sessions) {
        const __sessionDir = path.join(backendQuarantineDir, session);
        const __metadataFiles = await this.findMetadataFilesInDir(sessionDir);
        // // console.log(`  - ${session} (${metadataFiles.length} files)`);
      }

      return sessions;
    } catch (error) {
      // // console.log("📭 No rollback sessions available");
      return [];
    }
  }

  /**
   * Find metadata files in a specific directory
   */
  private static async findMetadataFilesInDir(_dir: string): Promise<string[]> {
    const metadataFiles: string[] = [];

    const __findInDir = async (_currentDir: string): Promise<void> => {
      try {
        const __entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const __fullPath = path.join(currentDir, entry.name);

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
  const __args = process.argv.slice(2);

  if (args.includes("--list") || args.includes("-l")) {
    BackendRollback.listSessions().catch(// // console.error);
  } else if (args.length === 0) {
    // // console.log("Usage: tsx rollback-backend.ts <timestamp>");
    // // console.log("       tsx rollback-backend.ts --list");
    // // console.log("");
    // // console.log("Examples:");
    // // console.log("  tsx rollback-backend.ts 2025-10-16T10-30-45-123Z");
    // // console.log("  tsx rollback-backend.ts --list");
    process.exit(1);
  } else {
    const __timestamp = args[0];
    const __rollback = new BackendRollback(timestamp);
    rollback.run().catch(// // console.error);
  }
}

export default BackendRollback;
