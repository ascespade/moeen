/**
 * Side-effect analyzer to detect potential breaking changes
 * Analyzes the impact of quarantining files on the codebase
 */

import {
  DependencyNode,
  QuarantineCandidate,
  PossibleBreak,
  UsageMap,
} from "../shared/types";

export class ImpactAnalyzer {
  private dependencyGraph: DependencyNode[];
  private usageMap: UsageMap;

  constructor(_dependencyGraph: DependencyNode[], usageMap: UsageMap) {
    this.dependencyGraph = dependencyGraph;
    this.usageMap = usageMap;
  }

  /**
   * Analyze the impact of quarantining candidates
   */
  analyzeImpact(_candidates: QuarantineCandidate[]): {
    possibleBreaks: PossibleBreak[];
    safeCandidates: QuarantineCandidate[];
    riskyCandidates: QuarantineCandidate[];
  } {
    // // console.log("🔍 Analyzing potential breaking changes...");

    const possibleBreaks: PossibleBreak[] = [];
    const safeCandidates: QuarantineCandidate[] = [];
    const riskyCandidates: QuarantineCandidate[] = [];

    for (const candidate of candidates) {
      const __impact = this.analyzeCandidateImpact(candidate);

      if (impact.breaks.length > 0) {
        possibleBreaks.push(...impact.breaks);
        riskyCandidates.push(candidate);
      } else {
        safeCandidates.push(candidate);
      }
    }

    // // console.log(`✅ Impact analysis complete`);
    // // console.log(
      `⚠️  Found ${possibleBreaks.length} potential breaking changes`,
    );
    // // console.log(
      `✅ ${safeCandidates.length} candidates are safe to quarantine`,
    );
    // // console.log(`⚠️  ${riskyCandidates.length} candidates need review`);

    return { possibleBreaks, safeCandidates, riskyCandidates };
  }

  /**
   * Analyze the impact of quarantining a single candidate
   */
  private analyzeCandidateImpact(_candidate: QuarantineCandidate): {
    breaks: PossibleBreak[];
    affectedFiles: string[];
  } {
    const breaks: PossibleBreak[] = [];
    const affectedFiles: string[] = [];

    // Check for import errors
    const __importBreaks = this.checkImportBreaks(candidate);
    breaks.push(...importBreaks);
    affectedFiles.push(...importBreaks.flatMap((b) => b.affected_files));

    // Check for runtime errors
    const __runtimeBreaks = this.checkRuntimeBreaks(candidate);
    breaks.push(...runtimeBreaks);
    affectedFiles.push(...runtimeBreaks.flatMap((b) => b.affected_files));

    // Check for missing exports
    const __exportBreaks = this.checkExportBreaks(candidate);
    breaks.push(...exportBreaks);
    affectedFiles.push(...exportBreaks.flatMap((b) => b.affected_files));

    // Check for database errors
    const __databaseBreaks = this.checkDatabaseBreaks(candidate);
    breaks.push(...databaseBreaks);
    affectedFiles.push(...databaseBreaks.flatMap((b) => b.affected_files));

    return {
      breaks,
      affectedFiles: [...new Set(affectedFiles)],
    };
  }

  /**
   * Check for import-related breaking changes
   */
  private checkImportBreaks(_candidate: QuarantineCandidate): PossibleBreak[] {
    const breaks: PossibleBreak[] = [];
    const __dependents = candidate.dependents || [];

    for (const dependentPath of dependents) {
      const __usage = this.usageMap[dependentPath];
      if (!usage) continue;

      // Check if the dependent file imports from the candidate
      const __importsCandidate = usage.imports.includes(candidate.file_path);

      if (importsCandidate) {
        breaks.push({
          file_path: candidate.file_path,
          break_type: "import_error",
          severity: this.calculateSeverity(candidate, dependentPath),
          description: `File ${dependentPath} imports from ${candidate.file_path}, which will be quarantined`,
          affected_files: [dependentPath],
          suggested_fix: `Update import in ${dependentPath} to point to a replacement file or remove the import`,
        });
      }
    }

    return breaks;
  }

  /**
   * Check for runtime-related breaking changes
   */
  private checkRuntimeBreaks(_candidate: QuarantineCandidate): PossibleBreak[] {
    const breaks: PossibleBreak[] = [];

    // Check if candidate is an API route
    if (
      candidate.file_path.includes("/api/") &&
      candidate.file_path.endsWith("/route.ts")
    ) {
      breaks.push({
        file_path: candidate.file_path,
        break_type: "runtime_error",
        severity: "high",
        description: `API route ${candidate.file_path} will be quarantined, breaking API endpoints`,
        affected_files: [],
        suggested_fix:
          "Ensure API route is not needed or replace with alternative implementation",
      });
    }

    // Check if candidate is a critical service
    if (
      candidate.file_path.includes("/lib/") &&
      this.isCriticalService(candidate.file_path)
    ) {
      breaks.push({
        file_path: candidate.file_path,
        break_type: "runtime_error",
        severity: "high",
        description: `Critical service ${candidate.file_path} will be quarantined`,
        affected_files: candidate.dependents || [],
        suggested_fix:
          "Replace with alternative service or ensure no dependencies exist",
      });
    }

    return breaks;
  }

  /**
   * Check for missing export-related breaking changes
   */
  private checkExportBreaks(_candidate: QuarantineCandidate): PossibleBreak[] {
    const breaks: PossibleBreak[] = [];
    const __dependents = candidate.dependents || [];

    // Find files that might be importing specific exports from the candidate
    for (const dependentPath of dependents) {
      const __usage = this.usageMap[dependentPath];
      if (!usage) continue;

      // This is a simplified check - in a real implementation, you'd parse the actual imports
      // to see what specific exports are being used
      if (usage.imports.includes(candidate.file_path)) {
        breaks.push({
          file_path: candidate.file_path,
          break_type: "missing_export",
          severity: "medium",
          description: `File ${dependentPath} may be importing specific exports from ${candidate.file_path}`,
          affected_files: [dependentPath],
          suggested_fix: `Check what exports are being used from ${candidate.file_path} and ensure they're available elsewhere`,
        });
      }
    }

    return breaks;
  }

  /**
   * Check for database-related breaking changes
   */
  private checkDatabaseBreaks(_candidate: QuarantineCandidate): PossibleBreak[] {
    const breaks: PossibleBreak[] = [];

    // Check if candidate has database dependencies
    const __hasDatabaseQueries = candidate.metadata?.has_database_queries;
    const __hasProductionData = candidate.metadata?.has_production_data;
    const __databaseTables = candidate.metadata?.database_tables || [];

    if (hasDatabaseQueries) {
      breaks.push({
        file_path: candidate.file_path,
        break_type: "database_error",
        severity: hasProductionData ? "critical" : "high",
        description: `File ${candidate.file_path} contains database queries and will be quarantined`,
        affected_files: candidate.dependents || [],
        suggested_fix: hasProductionData
          ? "CRITICAL: This file interacts with production data. Ensure no active dependencies before quarantining."
          : "Ensure database queries are not needed or move to a replacement file",
      });
    }

    if (databaseTables.length > 0) {
      breaks.push({
        file_path: candidate.file_path,
        break_type: "database_error",
        severity: "high",
        description: `File ${candidate.file_path} references database tables: ${databaseTables.join(", ")}`,
        affected_files: candidate.dependents || [],
        suggested_fix:
          "Verify that these database interactions are not needed by other parts of the system",
      });
    }

    return breaks;
  }

  /**
   * Calculate severity based on candidate and affected file
   */
  private calculateSeverity(
    candidate: QuarantineCandidate,
    affectedFile: string,
  ): "low" | "medium" | "high" | "critical" {
    // Critical if affecting API routes or critical services
    if (
      affectedFile.includes("/api/") ||
      this.isCriticalService(affectedFile)
    ) {
      return "critical";
    }

    // High if candidate is high risk or affects many files
    if (
      candidate.risk_level === "dangerous" ||
      (candidate.dependents?.length || 0) > 5
    ) {
      return "high";
    }

    // Medium if candidate is medium risk
    if (candidate.risk_level === "needs-review") {
      return "medium";
    }

    // Low for safe candidates
    return "low";
  }

  /**
   * Check if a file is a critical service
   */
  private isCriticalService(_filePath: string): boolean {
    const __criticalPatterns = [
      /\/lib\/auth\//,
      /\/lib\/database/,
      /\/lib\/supabase/,
      /\/lib\/security/,
      /\/middleware/,
      /\/config\//,
    ];

    return criticalPatterns.some((pattern) => pattern.test(filePath));
  }

  /**
   * Get summary of impact analysis
   */
  getImpactSummary(_possibleBreaks: PossibleBreak[]): {
    totalBreaks: number;
    criticalBreaks: number;
    highBreaks: number;
    mediumBreaks: number;
    lowBreaks: number;
    affectedFiles: string[];
  } {
    const __severityCounts = possibleBreaks.reduce(
      (acc, breakItem) => {
        acc[breakItem.severity]++;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 },
    );

    const __affectedFiles = [
      ...new Set(possibleBreaks.flatMap((b) => b.affected_files)),
    ];

    return {
      totalBreaks: possibleBreaks.length,
      criticalBreaks: severityCounts.critical,
      highBreaks: severityCounts.high,
      mediumBreaks: severityCounts.medium,
      lowBreaks: severityCounts.low,
      affectedFiles,
    };
  }

  /**
   * Generate detailed impact report
   */
  generateImpactReport(_possibleBreaks: PossibleBreak[]): string {
    let report = "# Impact Analysis Report\n\n";
    report += `Generated at: ${new Date().toISOString()}\n\n`;

    if (possibleBreaks.length === 0) {
      report += "## ✅ No Breaking Changes Detected\n\n";
      report += "All candidates appear to be safe to quarantine.\n";
      return report;
    }

    const __summary = this.getImpactSummary(possibleBreaks);

    report += "## 📊 Impact Summary\n\n";
    report += `- **Total Breaking Changes**: ${summary.totalBreaks}\n`;
    report += `- **Critical**: ${summary.criticalBreaks}\n`;
    report += `- **High**: ${summary.highBreaks}\n`;
    report += `- **Medium**: ${summary.mediumBreaks}\n`;
    report += `- **Low**: ${summary.lowBreaks}\n`;
    report += `- **Affected Files**: ${summary.affectedFiles.length}\n\n`;

    // Group breaks by severity
    const __breaksBySeverity = possibleBreaks.reduce(
      (acc, breakItem) => {
        if (!acc[breakItem.severity]) acc[breakItem.severity] = [];
        acc[breakItem.severity].push(breakItem);
        return acc;
      },
      {} as Record<string, PossibleBreak[]>,
    );

    // Report by severity (critical first)
    const __severityOrder = ["critical", "high", "medium", "low"];

    for (const severity of severityOrder) {
      const __breaks = breaksBySeverity[severity] || [];
      if (breaks.length === 0) continue;

      report += `## ${severity.toUpperCase()} Severity Issues (${breaks.length})\n\n`;

      breaks.forEach((breakItem, index) => {
        report += `### ${index + 1}. ${breakItem.file_path}\n\n`;
        report += `- **Type**: ${breakItem.break_type}\n`;
        report += `- **Description**: ${breakItem.description}\n`;

        if (breakItem.affected_files.length > 0) {
          report += `- **Affected Files**:\n`;
          breakItem.affected_files.forEach((file) => {
            report += `  - \`${file}\`\n`;
          });
        }

        if (breakItem.suggested_fix) {
          report += `- **Suggested Fix**: ${breakItem.suggested_fix}\n`;
        }

        report += `\n`;
      });
    }

    return report;
  }
}
