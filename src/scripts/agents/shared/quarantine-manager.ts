/**
 * Shared quarantine utilities for file management, logging, and rollback
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import {
  QuarantineSession,
  QuarantineManifest,
  QuarantinedFile,
  CleanupLog,
  UsageMap,
  PossibleBreak,
} from "./types";

export class QuarantineManager {
  private quarantineDir: string;
  private cleanupLogPath: string;
  private sessionId: string;

  constructor(_quarantineDir: string) {
    this.quarantineDir = quarantineDir;
    this.cleanupLogPath = path.join(quarantineDir, "cleanup-log.json");
    this.sessionId = this.generateSessionId();
  }

  /**
   * Create a new quarantine session
   */
  async createSession(_agent: string): Promise<QuarantineSession> {
    const __timestamp = new Date().toISOString();
    const __sessionDir = path.join(
      this.quarantineDir,
      agent,
      this.formatTimestamp(timestamp),
    );

    // Create session directory
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const session: QuarantineSession = {
      id: this.sessionId,
      agent: agent as "backend" | "frontend" | "shared",
      timestamp,
      duration_ms: 0,
      files_quarantined: 0,
      size_recovered_bytes: 0,
      status: "running",
      quarantine_dir: sessionDir,
      rollback_script: path.join(sessionDir, "rollback.sh"),
      manifest: {
        session_id: this.sessionId,
        created_at: timestamp,
        agent,
        files: [],
        usage_map: {},
        summary: {
          total_files: 0,
          total_size_bytes: 0,
          categories: {},
          risk_levels: {},
        },
      },
      possible_breaks: [],
      errors: [],
    };

    return session;
  }

  /**
   * Move a file to quarantine with metadata tracking
   */
  async quarantineFile(
    filePath: string,
    session: QuarantineSession,
    reason: string,
    category: string,
    riskLevel: "safe" | "needs-review" | "dangerous",
    metadata: Record<string, any> = {},
  ): Promise<QuarantinedFile> {
    try {
      const __stats = await fs.promises.stat(filePath);
      const __fileHash = await this.calculateFileHash(filePath);

      // Preserve directory structure within quarantine
      const __relativePath = path.relative(process.cwd(), filePath);
      const __quarantinePath = path.join(session.quarantine_dir, relativePath);
      const __quarantineDir = path.dirname(quarantinePath);

      // Create quarantine directory structure
      await fs.promises.mkdir(quarantineDir, { recursive: true });

      // Move file to quarantine
      await fs.promises.rename(filePath, quarantinePath);

      const quarantinedFile: QuarantinedFile = {
        original_path: filePath,
        quarantine_path: quarantinePath,
        file_hash: fileHash,
        size_bytes: stats.size,
        reason,
        category: category as any,
        risk_level: riskLevel,
        dependencies: metadata.dependencies || [],
        dependents: metadata.dependents || [],
        moved_at: new Date().toISOString(),
        metadata,
      };

      // Update session manifest
      session.manifest.files.push(quarantinedFile);
      session.files_quarantined++;
      session.size_recovered_bytes += stats.size;

      // Update summary
      session.manifest.summary.total_files++;
      session.manifest.summary.total_size_bytes += stats.size;
      session.manifest.summary.categories[category] =
        (session.manifest.summary.categories[category] || 0) + 1;
      session.manifest.summary.risk_levels[riskLevel] =
        (session.manifest.summary.risk_levels[riskLevel] || 0) + 1;

      return quarantinedFile;
    } catch (error) {
      const __errorMsg = `Failed to quarantine file ${filePath}: ${error}`;
      session.errors.push(errorMsg);
      throw new Error(errorMsg);
    }
  }

  /**
   * Generate rollback script for the session
   */
  async generateRollbackScript(_session: QuarantineSession): Promise<void> {
    const __rollbackContent = this.buildRollbackScript(session);
    await fs.promises.writeFile(session.rollback_script, rollbackContent, {
      mode: 0o755,
    });
  }

  /**
   * Update the global cleanup log
   */
  async updateCleanupLog(_session: QuarantineSession): Promise<void> {
    try {
      let cleanupLog: CleanupLog;

      if (fs.existsSync(this.cleanupLogPath)) {
        const __logContent = await fs.promises.readFile(
          this.cleanupLogPath,
          "utf-8",
        );
        cleanupLog = JSON.parse(logContent);
      } else {
        cleanupLog = {
          version: "1.0.0",
          created_at: new Date().toISOString(),
          sessions: [],
          total_files_quarantined: 0,
          total_size_recovered: 0,
          agents: {
            backend: { sessions: 0, files_quarantined: 0, last_run: null },
            frontend: { sessions: 0, files_quarantined: 0, last_run: null },
            shared: { sessions: 0, files_quarantined: 0, last_run: null },
          },
        };
      }

      // Update session status
      session.status = "completed";
      session.duration_ms = Date.now() - new Date(session.timestamp).getTime();

      // Add session to log
      cleanupLog.sessions.push(session);
      cleanupLog.total_files_quarantined += session.files_quarantined;
      cleanupLog.total_size_recovered += session.size_recovered_bytes;

      // Update agent stats
      if (!cleanupLog.agents[session.agent]) {
        cleanupLog.agents[session.agent] = {
          sessions: 0,
          files_quarantined: 0,
          last_run: null,
        };
      }
      cleanupLog.agents[session.agent].sessions++;
      cleanupLog.agents[session.agent].files_quarantined +=
        session.files_quarantined;
      cleanupLog.agents[session.agent].last_run = session.timestamp;

      // Write updated log
      await fs.promises.writeFile(
        this.cleanupLogPath,
        JSON.stringify(cleanupLog, null, 2),
      );
    } catch (error) {
      // // console.error("❌ Failed to update cleanup log:", error);
      throw error;
    }
  }

  /**
   * Save session manifest
   */
  async saveManifest(_session: QuarantineSession): Promise<void> {
    const __manifestPath = path.join(session.quarantine_dir, "manifest.json");
    await fs.promises.writeFile(
      manifestPath,
      JSON.stringify(session.manifest, null, 2),
    );
  }

  /**
   * Save usage map
   */
  async saveUsageMap(
    session: QuarantineSession,
    usageMap: UsageMap,
  ): Promise<void> {
    const __usageMapPath = path.join(session.quarantine_dir, "usage-map.json");
    await fs.promises.writeFile(
      usageMapPath,
      JSON.stringify(usageMap, null, 2),
    );
    session.manifest.usage_map = usageMap;
  }

  /**
   * Save possible breaks report
   */
  async savePossibleBreaks(
    session: QuarantineSession,
    possibleBreaks: PossibleBreak[],
  ): Promise<void> {
    const __breaksPath = path.join(session.quarantine_dir, "possibleBreaks.md");
    const __content = this.buildPossibleBreaksReport(possibleBreaks);
    await fs.promises.writeFile(breaksPath, content);
    session.possible_breaks = possibleBreaks;
  }

  private async calculateFileHash(_filePath: string): Promise<string> {
    const __content = await fs.promises.readFile(filePath);
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatTimestamp(_timestamp: string): string {
    return new Date(timestamp).toISOString().replace(/[:.]/g, "-").slice(0, 19);
  }

  private buildRollbackScript(_session: QuarantineSession): string {
    const __script = `#!/bin/bash
# Rollback script for ${session.agent} cleanup session ${session.id}
# Generated at: ${session.timestamp}

echo "🔄 Rolling back ${session.agent} cleanup session ${session.id}..."

# Create directories if they don't exist
${session.manifest.files
  .map((file) => {
    const __dir = path.dirname(file.original_path);
    return `mkdir -p "${dir}"`;
  })
  .join("\n")}

# Restore files
${session.manifest.files
  .map((file) => {
    return `mv "${file.quarantine_path}" "${file.original_path}"`;
  })
  .join("\n")}

echo "✅ Rollback completed successfully!"
echo "📊 Restored ${session.manifest.files.length} files"
echo "💾 Total size: ${this.formatBytes(session.size_recovered_bytes)}"
`;

    return script;
  }

  private buildPossibleBreaksReport(_possibleBreaks: PossibleBreak[]): string {
    let content = `# Possible Breaking Changes Report\n\n`;
    content += `Generated at: ${new Date().toISOString()}\n\n`;

    if (possibleBreaks.length === 0) {
      content += `## ✅ No Breaking Changes Detected\n\n`;
      content += `All quarantined files appear to be safe to remove.\n`;
      return content;
    }

    content += `## ⚠️ Potential Breaking Changes\n\n`;
    content += `Found ${possibleBreaks.length} potential breaking changes:\n\n`;

    possibleBreaks.forEach((breakItem, index) => {
      content += `### ${index + 1}. ${breakItem.file_path}\n\n`;
      content += `- **Type**: ${breakItem.break_type}\n`;
      content += `- **Severity**: ${breakItem.severity}\n`;
      content += `- **Description**: ${breakItem.description}\n`;

      if (breakItem.affected_files.length > 0) {
        content += `- **Affected Files**:\n`;
        breakItem.affected_files.forEach((file) => {
          content += `  - \`${file}\`\n`;
        });
      }

      if (breakItem.suggested_fix) {
        content += `- **Suggested Fix**: ${breakItem.suggested_fix}\n`;
      }

      content += `\n`;
    });

    return content;
  }

  private formatBytes(_bytes: number): string {
    const __sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const __i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }
}
