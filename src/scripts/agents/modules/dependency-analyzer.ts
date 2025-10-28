/**
 * AST-based dependency analyzer for TypeScript/JavaScript files
 * Maps imports/exports and builds dependency graph
 */

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { _DependencyNode, UsageMap, QuarantineCandidate } from "../shared/types";

export class DependencyAnalyzer {
  private projectRoot: string;
  private scope: string[];
  private fileCache: Map<string, string> = new Map();

  constructor(_projectRoot: string, scope: string[]) {
    this.projectRoot = projectRoot;
    this.scope = scope;
  }

  /**
   * Analyze all files in scope and build dependency graph
   */
  async analyzeDependencies(): Promise<{
    dependencyGraph: DependencyNode[];
    usageMap: UsageMap;
    candidates: QuarantineCandidate[];
  }> {
    // // console.log("🔍 Analyzing dependencies...");

    const __files = await this.getAllFilesInScope();
    // // console.log(`📁 Found ${files.length} files to analyze`);

    const dependencyGraph: DependencyNode[] = [];
    const usageMap: UsageMap = {};
    const candidates: QuarantineCandidate[] = [];

    // Analyze each file
    for (const filePath of files) {
      try {
        const __node = await this.analyzeFile(filePath);
        if (node) {
          dependencyGraph.push(node);
          usageMap[filePath] = {
            imports: node.imports,
            exports: node.exports,
            dependents: node.dependents,
            is_shared: node.is_shared,
            usage_count: node.dependents.length,
          };
        }
      } catch (error) {
        // // console.warn(`⚠️  Failed to analyze ${filePath}:`, error);
      }
    }

    // Build dependent relationships
    this.buildDependentRelationships(dependencyGraph);

    // Identify quarantine candidates
    candidates.push(...this.identifyCandidates(dependencyGraph, usageMap));

    // // console.log(`✅ Dependency analysis complete`);
    // // console.log(`📊 Found ${candidates.length} quarantine candidates`);
    // // console.log(
      `🔗 Built dependency graph with ${dependencyGraph.length} nodes`,
    );

    return { dependencyGraph, usageMap, candidates };
  }

  /**
   * Get all files in the specified scope
   */
  private async getAllFilesInScope(): Promise<string[]> {
    const files: string[] = [];

    for (const scopePath of this.scope) {
      const __fullPath = path.resolve(this.projectRoot, scopePath);
      if (fs.existsSync(fullPath)) {
        const __scopeFiles = await this.getFilesRecursively(fullPath);
        files.push(...scopeFiles);
      }
    }

    return files.filter(
      (file) =>
        file.endsWith(".ts") ||
        file.endsWith(".tsx") ||
        file.endsWith(".js") ||
        file.endsWith(".jsx"),
    );
  }

  /**
   * Recursively get all files in a directory
   */
  private async getFilesRecursively(_dir: string): Promise<string[]> {
    const files: string[] = [];
    const __entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const __fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .git, and other common exclusions
        if (
          !["node_modules", ".git", ".next", "dist", "build"].includes(
            entry.name,
          )
        ) {
          const __subFiles = await this.getFilesRecursively(fullPath);
          files.push(...subFiles);
        }
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Analyze a single file and extract dependencies
   */
  private async analyzeFile(_filePath: string): Promise<DependencyNode | null> {
    try {
      const __sourceCode = await this.getFileContent(filePath);
      const __sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
      );

      const imports: string[] = [];
      const exports: string[] = [];

      // Visit all nodes in the AST
      const __visit = (_node: ts.Node) => {
        // Handle import declarations
        if (ts.isImportDeclaration(node)) {
          const __moduleSpecifier = node.moduleSpecifier;
          if (ts.isStringLiteral(moduleSpecifier)) {
            const __importPath = this.resolveImportPath(
              moduleSpecifier.text,
              filePath,
            );
            if (importPath) {
              imports.push(importPath);
            }
          }
        }

        // Handle export declarations
        if (ts.isExportDeclaration(node)) {
          const __moduleSpecifier = node.moduleSpecifier;
          if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
            const __exportPath = this.resolveImportPath(
              moduleSpecifier.text,
              filePath,
            );
            if (exportPath) {
              exports.push(exportPath);
            }
          }
        }

        // Handle named exports
        if (ts.isExportDeclaration(node) && !node.moduleSpecifier) {
          // This is a re-export from the same file
          if (node.exportClause && ts.isNamedExports(node.exportClause)) {
            node.exportClause.elements.forEach((element) => {
              exports.push(element.name.text);
            });
          }
        }

        // Handle export assignments
        if (ts.isExportAssignment(node)) {
          exports.push("default");
        }

        // Continue visiting child nodes
        ts.forEachChild(node, visit);
      };

      visit(sourceFile);

      // Determine if this is an entry point (API route, main file, etc.)
      const __isEntryPoint = this.isEntryPoint(filePath);

      // Calculate risk score based on various factors
      const __riskScore = this.calculateRiskScore(
        filePath,
        imports,
        exports,
        isEntryPoint,
      );

      return {
        file_path: filePath,
        imports: imports.filter(
          (imp) =>
            imp.startsWith("/") ||
            imp.startsWith("./") ||
            imp.startsWith("../"),
        ),
        exports: exports,
        dependents: [], // Will be filled later
        is_entry_point: isEntryPoint,
        is_shared: false, // Will be determined later
        risk_score: riskScore,
      };
    } catch (error) {
      // // console.warn(`⚠️  Failed to parse ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get file content with caching
   */
  private async getFileContent(_filePath: string): Promise<string> {
    if (this.fileCache.has(filePath)) {
      return this.fileCache.get(filePath)!;
    }

    const __content = await fs.promises.readFile(filePath, "utf-8");
    this.fileCache.set(filePath, content);
    return content;
  }

  /**
   * Resolve import path to absolute path
   */
  private resolveImportPath(
    importPath: string,
    fromFile: string,
  ): string | null {
    // Skip external packages
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      return null;
    }

    const __fromDir = path.dirname(fromFile);
    let resolvedPath: string;

    if (importPath.startsWith("/")) {
      // Absolute path from project root
      resolvedPath = path.resolve(this.projectRoot, importPath);
    } else {
      // Relative path
      resolvedPath = path.resolve(fromDir, importPath);
    }

    // Try different extensions
    const __extensions = [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.js"];

    for (const ext of extensions) {
      const __testPath = resolvedPath + ext;
      if (fs.existsSync(testPath)) {
        return testPath;
      }
    }

    // If no extension found, return the resolved path as-is
    return resolvedPath;
  }

  /**
   * Determine if a file is an entry point
   */
  private isEntryPoint(_filePath: string): boolean {
    // API routes
    if (filePath.includes("/api/") && filePath.endsWith("/route.ts")) {
      return true;
    }

    // Main application files
    if (filePath.endsWith("page.tsx") || filePath.endsWith("layout.tsx")) {
      return true;
    }

    // Configuration files
    if (
      filePath.endsWith("next.config.js") ||
      filePath.endsWith("tailwind.config.js")
    ) {
      return true;
    }

    return false;
  }

  /**
   * Calculate risk score for a file
   */
  private calculateRiskScore(
    filePath: string,
    imports: string[],
    exports: string[],
    isEntryPoint: boolean,
  ): number {
    let score = 0;

    // Higher risk for entry points
    if (isEntryPoint) {
      score += 50;
    }

    // Higher risk for files with many exports
    score += exports.length * 2;

    // Higher risk for files in critical directories
    if (filePath.includes("/api/")) {
      score += 30;
    }

    if (filePath.includes("/lib/")) {
      score += 20;
    }

    // Lower risk for test files
    if (filePath.includes("test") || filePath.includes("spec")) {
      score -= 20;
    }

    // Lower risk for seed/mock files
    if (filePath.includes("seed") || filePath.includes("mock")) {
      score -= 30;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Build dependent relationships between files
   */
  private buildDependentRelationships(_dependencyGraph: DependencyNode[]): void {
    const __fileMap = new Map<string, DependencyNode>();

    // Create file map for quick lookup
    dependencyGraph.forEach((node) => {
      fileMap.set(node.file_path, node);
    });

    // Build dependent relationships
    dependencyGraph.forEach((node) => {
      node.imports.forEach((importPath) => {
        const __importedNode = fileMap.get(importPath);
        if (importedNode) {
          importedNode.dependents.push(node.file_path);
        }
      });
    });

    // Determine shared files (used by multiple other files)
    dependencyGraph.forEach((node) => {
      node.is_shared = node.dependents.length > 1;
    });
  }

  /**
   * Identify quarantine candidates based on dependency analysis
   */
  private identifyCandidates(
    dependencyGraph: DependencyNode[],
    usageMap: UsageMap,
  ): QuarantineCandidate[] {
    const candidates: QuarantineCandidate[] = [];

    dependencyGraph.forEach((node) => {
      // Skip entry points
      if (node.is_entry_point) {
        return;
      }

      // Skip shared files (used by multiple files)
      if (node.is_shared) {
        return;
      }

      // Identify candidates based on various criteria
      let reason = "";
      let category = "";
      let riskLevel: "safe" | "needs-review" | "dangerous" = "safe";

      // Test files
      if (node.file_path.includes("test") || node.file_path.includes("spec")) {
        reason = "Test file with no dependents";
        category = "test";
        riskLevel = "safe";
      }

      // Seed files
      else if (node.file_path.includes("seed")) {
        reason = "Seed file with no dependents";
        category = "seed";
        riskLevel = "needs-review";
      }

      // Mock files
      else if (node.file_path.includes("mock")) {
        reason = "Mock file with no dependents";
        category = "mock";
        riskLevel = "safe";
      }

      // Unused files
      else if (node.dependents.length === 0 && node.risk_score < 30) {
        reason = "File with no dependents and low risk score";
        category = "unused";
        riskLevel = "needs-review";
      }

      // Only add if we have a reason
      if (reason) {
        candidates.push({
          file_path: node.file_path,
          reason,
          category,
          risk_level: riskLevel,
          confidence: this.calculateConfidence(node, usageMap),
          dependencies: node.imports,
          dependents: node.dependents,
          metadata: {
            risk_score: node.risk_score,
            is_entry_point: node.is_entry_point,
            is_shared: node.is_shared,
            export_count: node.exports.length,
            import_count: node.imports.length,
          },
        });
      }
    });

    return candidates;
  }

  /**
   * Calculate confidence score for a candidate
   */
  private calculateConfidence(
    node: DependencyNode,
    usageMap: UsageMap,
  ): number {
    let confidence = 100;

    // Reduce confidence for files with high risk score
    confidence -= node.risk_score * 0.3;

    // Reduce confidence for files with many exports
    confidence -= node.exports.length * 5;

    // Reduce confidence for files in critical directories
    if (node.file_path.includes("/api/")) {
      confidence -= 20;
    }

    if (node.file_path.includes("/lib/")) {
      confidence -= 15;
    }

    return Math.max(0, Math.min(100, confidence));
  }
}
