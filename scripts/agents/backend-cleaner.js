#!/usr/bin/env node
// backend-cleaner.js
// Scans backend/API code for unused modules, functions, and utilities

const fs = require("fs").promises;
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const SharedInfrastructure = require("./shared-infrastructure");

class BackendCleaner {
  constructor() {
    this.infrastructure = new SharedInfrastructure();
    this.agentName = "backend";

    this.scope = ["src/lib", "src/middleware", "src/utils", "scripts"];

    this.findings = {
      unusedUtilities: [],
      unusedMiddleware: [],
      unusedApiRoutes: [],
      duplicateFunctions: [],
      orphanedModules: [],
      totalFiles: 0,
      totalSize: 0,
    };
  }

  async run() {
    try {
      this.infrastructure.logger.info("🔍 Starting BackendCleaner agent...");

      // Initialize quarantine system
      await this.infrastructure.initializeQuarantineSystem();

      // Acquire lock
      await this.infrastructure.acquireLock(this.agentName);

      // Scan backend files
      await this.scanBackendFiles();

      // Analyze dependencies
      await this.analyzeDependencies();

      // Find duplicates
      await this.findDuplicates();

      // Move unused files
      await this.moveUnusedFiles();

      // Update usage map
      await this.infrastructure.updateUsageMap(this.agentName, this.findings);

      // Log actions
      await this.infrastructure.logCleanupAction(this.agentName, "scan", {
        filesScanned: this.findings.totalFiles,
        unusedFound:
          this.findings.unusedUtilities.length +
          this.findings.unusedMiddleware.length +
          this.findings.unusedApiRoutes.length +
          this.findings.orphanedModules.length,
        duplicatesFound: this.findings.duplicateFunctions.length,
      });

      this.infrastructure.logger.info(
        "✅ BackendCleaner completed successfully",
      );
      return this.findings;
    } catch (error) {
      this.infrastructure.logger.error("❌ BackendCleaner failed:", error);
      throw error;
    } finally {
      await this.infrastructure.releaseLock(this.agentName);
    }
  }

  async scanBackendFiles() {
    this.infrastructure.logger.info("📁 Scanning backend files...");

    for (const scopeDir of this.scope) {
      const fullPath = path.join(this.infrastructure.workspaceRoot, scopeDir);

      try {
        await this.scanDirectory(fullPath, scopeDir);
      } catch (error) {
        this.infrastructure.logger.warn(
          `⚠️ Could not scan ${scopeDir}:`,
          error.message,
        );
      }
    }
  }

  async scanDirectory(dirPath, relativePath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          await this.scanDirectory(
            fullPath,
            path.join(relativePath, entry.name),
          );
        } else if (this.isBackendFile(entry.name)) {
          await this.analyzeFile(fullPath, relativePath);
        }
      }
    } catch (error) {
      // Directory might not exist
    }
  }

  isBackendFile(fileName) {
    const ext = path.extname(fileName);
    return [".ts", ".js", ".mjs"].includes(ext);
  }

  async analyzeFile(filePath, relativePath) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const stats = await fs.stat(filePath);

      this.findings.totalFiles++;
      this.findings.totalSize += stats.size;

      const fileName = path.basename(filePath);
      const ext = path.extname(filePath);

      // Parse file to extract exports and imports
      const ast = parse(content, {
        sourceType: "module",
        plugins: ["typescript", "decorators-legacy", "classProperties"],
      });

      const fileInfo = {
        path: filePath,
        relativePath,
        fileName,
        size: stats.size,
        exports: [],
        imports: [],
        isUtility: false,
        isMiddleware: false,
        isApiRoute: false,
        isModule: false,
      };

      traverse(ast, {
        ExportNamedDeclaration: (nodePath) => {
          if (nodePath.node.declaration) {
            if (t.isFunctionDeclaration(nodePath.node.declaration)) {
              const name = nodePath.node.declaration.id?.name;
              if (name) {
                fileInfo.exports.push({
                  name,
                  type: "function",
                  isDefault: false,
                });
              }
            } else if (t.isVariableDeclaration(nodePath.node.declaration)) {
              nodePath.node.declaration.declarations.forEach((decl) => {
                if (t.isIdentifier(decl.id)) {
                  const name = decl.id.name;
                  fileInfo.exports.push({
                    name,
                    type: "variable",
                    isDefault: false,
                  });
                }
              });
            } else if (t.isClassDeclaration(nodePath.node.declaration)) {
              const name = nodePath.node.declaration.id?.name;
              if (name) {
                fileInfo.exports.push({
                  name,
                  type: "class",
                  isDefault: false,
                });
              }
            }
          }
        },

        ExportDefaultDeclaration: (nodePath) => {
          if (t.isFunctionDeclaration(nodePath.node.declaration)) {
            const name = nodePath.node.declaration.id?.name;
            if (name) {
              fileInfo.exports.push({
                name,
                type: "function",
                isDefault: true,
              });
            }
          } else if (t.isClassDeclaration(nodePath.node.declaration)) {
            const name = nodePath.node.declaration.id?.name;
            if (name) {
              fileInfo.exports.push({
                name,
                type: "class",
                isDefault: true,
              });
            }
          }
        },

        ImportDeclaration: (nodePath) => {
          const source = nodePath.node.source.value;
          if (!source.startsWith(".") && !source.startsWith("/")) {
            return; // Skip node_modules imports
          }

          nodePath.node.specifiers.forEach((spec) => {
            if (t.isImportSpecifier(spec)) {
              fileInfo.imports.push({
                name: spec.imported.name,
                source,
                type: "named",
              });
            } else if (t.isImportDefaultSpecifier(spec)) {
              fileInfo.imports.push({
                name: spec.local.name,
                source,
                type: "default",
              });
            }
          });
        },
      });

      // Determine file type
      if (
        relativePath.startsWith("src/lib") ||
        relativePath.startsWith("src/utils")
      ) {
        fileInfo.isUtility = true;
      } else if (relativePath.startsWith("src/middleware")) {
        fileInfo.isMiddleware = true;
      } else if (
        relativePath.startsWith("src/app") &&
        (relativePath.includes("/api/") || relativePath.includes("/route"))
      ) {
        fileInfo.isApiRoute = true;
      } else if (relativePath.startsWith("scripts")) {
        fileInfo.isModule = true;
      }

      // Store file info for later analysis
      if (!this.fileRegistry) {
        this.fileRegistry = [];
      }
      this.fileRegistry.push(fileInfo);
    } catch (error) {
      this.infrastructure.logger.warn(
        `⚠️ Could not analyze ${filePath}:`,
        error.message,
      );
    }
  }

  async analyzeDependencies() {
    this.infrastructure.logger.info("🔗 Analyzing dependencies...");

    if (!this.fileRegistry) return;

    // Build import graph
    const importGraph = new Map();
    const exportMap = new Map();

    // First pass: build export map
    for (const file of this.fileRegistry) {
      for (const exp of file.exports) {
        const key = `${file.relativePath}:${exp.name}`;
        exportMap.set(key, file);
      }
    }

    // Second pass: build import graph
    for (const file of this.fileRegistry) {
      const imports = new Set();

      for (const imp of file.imports) {
        // Try to resolve the import
        const resolved = this.resolveImport(imp.source, file.relativePath);
        if (resolved) {
          const key = `${resolved}:${imp.name}`;
          if (exportMap.has(key)) {
            imports.add(key);
          }
        }
      }

      importGraph.set(file.relativePath, imports);
    }

    // Find unused files
    for (const file of this.fileRegistry) {
      const isUsed = this.isFileUsed(file.relativePath, importGraph);

      if (!isUsed) {
        if (file.isUtility) {
          this.findings.unusedUtilities.push(file);
        } else if (file.isMiddleware) {
          this.findings.unusedMiddleware.push(file);
        } else if (file.isApiRoute) {
          this.findings.unusedApiRoutes.push(file);
        } else if (file.isModule) {
          this.findings.orphanedModules.push(file);
        }
      }
    }
  }

  resolveImport(importPath, fromFile) {
    // Simple resolution - in a real implementation, you'd use a proper resolver
    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      const fromDir = path.dirname(fromFile);
      return path.join(fromDir, importPath).replace(/\\/g, "/");
    }
    return null;
  }

  isFileUsed(filePath, importGraph) {
    // Check if file is imported by any other file
    for (const [importingFile, imports] of importGraph) {
      for (const importKey of imports) {
        if (importKey.startsWith(filePath + ":")) {
          return true;
        }
      }
    }

    // Check if it's a main entry point
    if (
      filePath === "src/lib/utils.ts" ||
      filePath === "src/lib/supabase.ts" ||
      filePath === "src/lib/database.ts"
    ) {
      return true; // Assume core utilities are used
    }

    // Check if it's referenced in package.json scripts
    if (filePath.startsWith("scripts/")) {
      return this.isScriptReferenced(filePath);
    }

    return false;
  }

  async isScriptReferenced(scriptPath) {
    try {
      const packageJsonPath = path.join(
        this.infrastructure.workspaceRoot,
        "package.json",
      );
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8"),
      );

      const scripts = packageJson.scripts || {};
      const scriptName = path.basename(scriptPath, path.extname(scriptPath));

      for (const [name, command] of Object.entries(scripts)) {
        if (command.includes(scriptName) || command.includes(scriptPath)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async findDuplicates() {
    this.infrastructure.logger.info("🔍 Finding duplicate functions...");

    if (!this.fileRegistry) return;

    const functionMap = new Map();

    for (const file of this.fileRegistry) {
      for (const exp of file.exports) {
        if (exp.type === "function") {
          const key = exp.name;
          if (functionMap.has(key)) {
            functionMap.get(key).push(file);
          } else {
            functionMap.set(key, [file]);
          }
        }
      }
    }

    // Find duplicates
    for (const [functionName, files] of functionMap) {
      if (files.length > 1) {
        this.findings.duplicateFunctions.push({
          name: functionName,
          files: files,
          count: files.length,
        });
      }
    }
  }

  async moveUnusedFiles() {
    this.infrastructure.logger.info("📦 Moving unused files to quarantine...");

    const allUnused = [
      ...this.findings.unusedUtilities,
      ...this.findings.unusedMiddleware,
      ...this.findings.unusedApiRoutes,
      ...this.findings.orphanedModules,
    ];

    const movedFiles = [];
    let totalSizeMoved = 0;

    for (const file of allUnused) {
      try {
        const moveResult = await this.infrastructure.moveFileToQuarantine(
          file.path,
          this.agentName,
          true, // preserve structure
        );

        movedFiles.push(moveResult);
        totalSizeMoved += file.size;
      } catch (error) {
        this.infrastructure.logger.error(
          `❌ Failed to move ${file.path}:`,
          error,
        );
      }
    }

    // Log move action
    await this.infrastructure.logCleanupAction(this.agentName, "move", {
      filesMoved: movedFiles.length,
      sizeRecovered: totalSizeMoved,
      movedFiles: movedFiles,
    });

    this.infrastructure.logger.info(
      `📊 Moved ${movedFiles.length} files (${this.infrastructure.formatBytes(totalSizeMoved)})`,
    );
  }

  generateReport() {
    return {
      agent: this.agentName,
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.findings.totalFiles,
        totalSize: this.findings.totalSize,
        unusedUtilities: this.findings.unusedUtilities.length,
        unusedMiddleware: this.findings.unusedMiddleware.length,
        unusedApiRoutes: this.findings.unusedApiRoutes.length,
        orphanedModules: this.findings.orphanedModules.length,
        duplicateFunctions: this.findings.duplicateFunctions.length,
      },
      details: this.findings,
    };
  }
}

// Run if called directly
if (require.main === module) {
  const cleaner = new BackendCleaner();
  cleaner
    .run()
    .then(() => {
      console.log("BackendCleaner completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("BackendCleaner failed:", error);
      process.exit(1);
    });
}

module.exports = BackendCleaner;
