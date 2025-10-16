/**
 * Safe file mover with metadata tracking and rollback script generation
 * Executes the quarantine process with comprehensive logging and safety checks
 */

import * as fs from "fs";
import * as path from "path";
import {
  QuarantineSession,
  QuarantineCandidate,
  QuarantinedFile,
  PossibleBreak,
  UsageMap,
} from "../shared/types";
import { _QuarantineManager } from "../shared/quarantine-manager";

export class QuarantineExecutor {
  private quarantineManager: QuarantineManager;
  private dryRun: boolean;
  private verbose: boolean;

  constructor(
    quarantineDir: string,
    dryRun: boolean = false,
    verbose: boolean = false,
  ) {
    this.quarantineManager = new QuarantineManager(quarantineDir);
    this.dryRun = dryRun;
    this.verbose = verbose;
  }

  /**
   * Execute quarantine process for safe candidates
   */
  async executeQuarantine(
    safeCandidates: QuarantineCandidate[],
    riskyCandidates: QuarantineCandidate[],
    possibleBreaks: PossibleBreak[],
    usageMap: UsageMap,
  ): Promise<{
    session: QuarantineSession;
    quarantinedFiles: QuarantinedFile[];
    skippedFiles: QuarantineCandidate[];
  }> {
    // // console.log("🚀 Starting quarantine execution...");

    if (this.dryRun) {
      // // console.log("🔍 DRY RUN MODE - No files will be moved");
    }

    // Create quarantine session
    const __session = await this.quarantineManager.createSession("backend");
    // // console.log(`📁 Created quarantine session: ${session.id}`);

    const quarantinedFiles: QuarantinedFile[] = [];
    const skippedFiles: QuarantineCandidate[] = [];

    // Process safe candidates first
    // // console.log(`\n📦 Processing ${safeCandidates.length} safe candidates...`);
    for (const candidate of safeCandidates) {
      try {
        if (this.dryRun) {
          // // console.log(`🔍 [DRY RUN] Would quarantine: ${candidate.file_path}`);
          quarantinedFiles.push(this.createMockQuarantinedFile(candidate));
        } else {
          const __quarantinedFile = await this.quarantineFile(candidate, session);
          quarantinedFiles.push(quarantinedFile);
          // // console.log(`✅ Quarantined: ${candidate.file_path}`);
        }
      } catch (error) {
        // // console.error(`❌ Failed to quarantine ${candidate.file_path}:`, error);
        skippedFiles.push(candidate);
      }
    }

    // Process risky candidates with additional checks
    // // console.log(
      `\n⚠️  Processing ${riskyCandidates.length} risky candidates...`,
    );
    for (const candidate of riskyCandidates) {
      try {
        const __shouldQuarantine = await this.shouldQuarantineRiskyCandidate(
          candidate,
          possibleBreaks,
        );

        if (shouldQuarantine) {
          if (this.dryRun) {
            // // console.log(
              `🔍 [DRY RUN] Would quarantine (risky): ${candidate.file_path}`,
            );
            quarantinedFiles.push(this.createMockQuarantinedFile(candidate));
          } else {
            const __quarantinedFile = await this.quarantineFile(
              candidate,
              session,
            );
            quarantinedFiles.push(quarantinedFile);
            // // console.log(`⚠️  Quarantined (risky): ${candidate.file_path}`);
          }
        } else {
          // // console.log(`⏭️  Skipped (too risky): ${candidate.file_path}`);
          skippedFiles.push(candidate);
        }
      } catch (error) {
        // // console.error(
          `❌ Failed to process risky candidate ${candidate.file_path}:`,
          error,
        );
        skippedFiles.push(candidate);
      }
    }

    // Save session data
    if (!this.dryRun) {
      await this.saveSessionData(session, possibleBreaks, usageMap);
      await this.quarantineManager.updateCleanupLog(session);
      // // console.log(`📊 Session data saved to: ${session.quarantine_dir}`);
    }

    // // console.log(`\n✅ Quarantine execution complete!`);
    // // console.log(`📦 Quarantined: ${quarantinedFiles.length} files`);
    // // console.log(`⏭️  Skipped: ${skippedFiles.length} files`);

    return { session, quarantinedFiles, skippedFiles };
  }

  /**
   * Quarantine a single file
   */
  private async quarantineFile(
    candidate: QuarantineCandidate,
    session: QuarantineSession,
  ): Promise<QuarantinedFile> {
    const __metadata = {
      ...candidate.metadata,
      quarantined_at: new Date().toISOString(),
      quarantine_reason: candidate.reason,
      original_risk_level: candidate.risk_level,
      original_confidence: candidate.confidence,
    };

    return await this.quarantineManager.quarantineFile(
      candidate.file_path,
      session,
      candidate.reason,
      candidate.category,
      candidate.risk_level,
      metadata,
    );
  }

  /**
   * Determine if a risky candidate should be quarantined
   */
  private async shouldQuarantineRiskyCandidate(
    candidate: QuarantineCandidate,
    possibleBreaks: PossibleBreak[],
  ): Promise<boolean> {
    // Get breaks related to this candidate
    const __candidateBreaks = possibleBreaks.filter(
      (breakItem) => breakItem.file_path === candidate.file_path,
    );

    // Don't quarantine if there are critical breaks
    const __hasCriticalBreaks = candidateBreaks.some(
      (breakItem) => breakItem.severity === "critical",
    );

    if (hasCriticalBreaks) {
      // // console.log(
        `🚫 Skipping ${candidate.file_path} - has critical breaking changes`,
      );
      return false;
    }

    // Don't quarantine if it's a shared file with many dependents
    if (candidate.dependents && candidate.dependents.length > 3) {
      // // console.log(
        `🚫 Skipping ${candidate.file_path} - shared file with ${candidate.dependents.length} dependents`,
      );
      return false;
    }

    // Don't quarantine if it has database dependencies
    if (
      candidate.metadata?.has_database_queries ||
      candidate.metadata?.has_production_data
    ) {
      // // console.log(
        `🚫 Skipping ${candidate.file_path} - has database dependencies`,
      );
      return false;
    }

    // Quarantine if confidence is high enough
    if (candidate.confidence >= 80) {
      // // console.log(
        `✅ Quarantining ${candidate.file_path} - high confidence (${candidate.confidence}%)`,
      );
      return true;
    }

    // Quarantine if it's clearly a test/mock file
    if (candidate.category === "test" || candidate.category === "mock") {
      // // console.log(`✅ Quarantining ${candidate.file_path} - test/mock file`);
      return true;
    }

    // // console.log(
      `⏭️  Skipping ${candidate.file_path} - low confidence (${candidate.confidence}%)`,
    );
    return false;
  }

  /**
   * Save session data and reports
   */
  private async saveSessionData(
    session: QuarantineSession,
    possibleBreaks: PossibleBreak[],
    usageMap: UsageMap,
  ): Promise<void> {
    // Save manifest
    await this.quarantineManager.saveManifest(session);

    // Save usage map
    await this.quarantineManager.saveUsageMap(session, usageMap);

    // Save possible breaks report
    await this.quarantineManager.savePossibleBreaks(session, possibleBreaks);

    // Generate rollback script
    await this.quarantineManager.generateRollbackScript(session);

    // Generate detailed summary
    await this.generateDetailedSummary(session, possibleBreaks);
  }

  /**
   * Generate detailed summary report
   */
  private async generateDetailedSummary(
    session: QuarantineSession,
    possibleBreaks: PossibleBreak[],
  ): Promise<void> {
    const __summaryPath = path.join(session.quarantine_dir, "summary.md");

    let content = `# Backend Cleanup Summary\n\n`;
    content += `**Session ID**: ${session.id}\n`;
    content += `**Agent**: ${session.agent}\n`;
    content += `**Timestamp**: ${session.timestamp}\n`;
    content += `**Duration**: ${session.duration_ms}ms\n\n`;

    content += `## 📊 Statistics\n\n`;
    content += `- **Files Quarantined**: ${session.files_quarantined}\n`;
    content += `- **Size Recovered**: ${this.formatBytes(session.size_recovered_bytes)}\n`;
    content += `- **Categories**:\n`;

    Object.entries(session.manifest.summary.categories).forEach(
      ([category, count]) => {
        content += `  - ${category}: ${count}\n`;
      },
    );

    content += `\n- **Risk Levels**:\n`;
    Object.entries(session.manifest.summary.risk_levels).forEach(
      ([level, count]) => {
        content += `  - ${level}: ${count}\n`;
      },
    );

    content += `\n## 📁 Quarantined Files\n\n`;
    session.manifest.files.forEach((file, index) => {
      content += `### ${index + 1}. ${file.original_path}\n\n`;
      content += `- **Category**: ${file.category}\n`;
      content += `- **Risk Level**: ${file.risk_level}\n`;
      content += `- **Reason**: ${file.reason}\n`;
      content += `- **Size**: ${this.formatBytes(file.size_bytes)}\n`;
      content += `- **Dependencies**: ${file.dependencies.length}\n`;
      content += `- **Dependents**: ${file.dependents.length}\n\n`;
    });

    if (possibleBreaks.length > 0) {
      content += `\n## ⚠️ Breaking Changes\n\n`;
      content += `Found ${possibleBreaks.length} potential breaking changes. See \`possibleBreaks.md\` for details.\n\n`;
    }

    content += `\n## 🔄 Rollback\n\n`;
    content += `To rollback this cleanup session, run:\n\n`;
    content += `\`\`\`bash\n`;
    content += `./rollback.sh\n`;
    content += `\`\`\`\n\n`;

    await fs.promises.writeFile(summaryPath, content);
  }

  /**
   * Create a mock quarantined file for dry run
   */
  private createMockQuarantinedFile(
    candidate: QuarantineCandidate,
  ): QuarantinedFile {
    return {
      original_path: candidate.file_path,
      quarantine_path: `[DRY RUN] ${candidate.file_path}`,
      file_hash: "dry-run-hash",
      size_bytes: 0,
      reason: candidate.reason,
      category: candidate.category as any,
      risk_level: candidate.risk_level,
      dependencies: candidate.dependencies || [],
      dependents: candidate.dependents || [],
      moved_at: new Date().toISOString(),
      metadata: candidate.metadata || {},
    };
  }

  /**
   * Format bytes to human readable string
   */
  private formatBytes(_bytes: number): string {
    const __sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const __i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }

  /**
   * Get quarantine statistics
   */
  getQuarantineStats(_quarantinedFiles: QuarantinedFile[]): {
    totalFiles: number;
    totalSize: number;
    categories: Record<string, number>;
    riskLevels: Record<string, number>;
  } {
    const __stats = {
      totalFiles: quarantinedFiles.length,
      totalSize: quarantinedFiles.reduce(
        (sum, file) => sum + file.size_bytes,
        0,
      ),
      categories: {} as Record<string, number>,
      riskLevels: {} as Record<string, number>,
    };

    quarantinedFiles.forEach((file) => {
      stats.categories[file.category] =
        (stats.categories[file.category] || 0) + 1;
      stats.riskLevels[file.risk_level] =
        (stats.riskLevels[file.risk_level] || 0) + 1;
    });

    return stats;
  }
}
