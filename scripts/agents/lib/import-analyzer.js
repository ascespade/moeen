const fs = require("fs").promises;
const path = require("path");
const glob = require("glob");

// Import TypeScript parser
let parser;
try {
  const { ESLint } = require("eslint");
  parser = new ESLint({
    useEslintrc: false,
    baseConfig: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  });
} catch (error) {
  console.warn("⚠️ ESLint not available, falling back to regex parsing");
}

class ImportAnalyzer {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.importGraph = new Map(); // file -> Set of dependencies
    this.reverseGraph = new Map(); // file -> Set of dependents
    this.entryPoints = new Set();
    this.fileContents = new Map();
  }

  /**
   * Build complete import graph for all TypeScript/JavaScript files
   */
  async buildImportGraph(
    scopeDirs = ["src/app", "src/components", "src/hooks", "src/styles"],
  ) {
    console.log("🔍 Building import graph...");

    // Find all relevant files
    const filePatterns = scopeDirs.map((dir) => `${dir}/**/*.{ts,tsx,js,jsx}`);
    const allFiles = [];

    for (const pattern of filePatterns) {
      const files = await new Promise((resolve, reject) => {
        glob(pattern, { cwd: this.projectRoot }, (err, matches) => {
          if (err) reject(err);
          else resolve(matches);
        });
      });
      allFiles.push(...files);
    }

    console.log(`📁 Found ${allFiles.length} files to analyze`);

    // Parse each file and extract imports
    for (const file of allFiles) {
      await this.analyzeFile(file);
    }

    // Identify entry points
    this.identifyEntryPoints();

    console.log(`🎯 Identified ${this.entryPoints.size} entry points`);
    console.log(`📊 Import graph contains ${this.importGraph.size} files`);

    return {
      importGraph: this.importGraph,
      reverseGraph: this.reverseGraph,
      entryPoints: this.entryPoints,
      fileContents: this.fileContents,
    };
  }

  /**
   * Analyze a single file for imports
   */
  async analyzeFile(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      const content = await fs.readFile(fullPath, "utf8");
      this.fileContents.set(filePath, content);

      const imports = this.extractImports(content, filePath);

      // Normalize file path for graph
      const normalizedPath = this.normalizePath(filePath);
      this.importGraph.set(normalizedPath, new Set());
      this.reverseGraph.set(normalizedPath, new Set());

      // Add imports to graph
      for (const importPath of imports) {
        const resolvedPath = this.resolveImportPath(importPath, filePath);
        if (resolvedPath) {
          this.importGraph.get(normalizedPath).add(resolvedPath);

          // Build reverse graph
          if (!this.reverseGraph.has(resolvedPath)) {
            this.reverseGraph.set(resolvedPath, new Set());
          }
          this.reverseGraph.get(resolvedPath).add(normalizedPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error analyzing ${filePath}:`, error.message);
    }
  }

  /**
   * Extract imports from file content
   */
  extractImports(content, filePath) {
    const imports = new Set();

    // Static imports
    const staticImportRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = staticImportRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    // Dynamic imports
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    // require() calls
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    // Template literal imports (for dynamic paths)
    const templateImportRegex = /import\s*\(\s*`([^`]+)`\s*\)/g;
    while ((match = templateImportRegex.exec(content)) !== null) {
      // Extract variable parts and add as potential imports
      const template = match[1];
      if (template.includes("${")) {
        // This is a dynamic template, we'll handle it in verification step
        imports.add(`DYNAMIC:${template}`);
      } else {
        imports.add(template);
      }
    }

    return Array.from(imports);
  }

  /**
   * Resolve import path to actual file path
   */
  resolveImportPath(importPath, fromFile) {
    // Skip external packages
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      return null;
    }

    // Handle dynamic imports
    if (importPath.startsWith("DYNAMIC:")) {
      return `DYNAMIC:${importPath.substring(8)}`;
    }

    const fromDir = path.dirname(fromFile);
    let resolvedPath;

    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      resolvedPath = path.resolve(fromDir, importPath);
    } else if (importPath.startsWith("/")) {
      resolvedPath = path.resolve(this.projectRoot, importPath.substring(1));
    } else {
      return null;
    }

    // Try different extensions
    const extensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      "/index.ts",
      "/index.tsx",
      "/index.js",
      "/index.jsx",
    ];

    for (const ext of extensions) {
      const testPath = resolvedPath + ext;
      if (this.fileExists(testPath)) {
        return this.normalizePath(path.relative(this.projectRoot, testPath));
      }
    }

    // Check if it's a directory with index file
    if (this.fileExists(resolvedPath)) {
      return this.normalizePath(path.relative(this.projectRoot, resolvedPath));
    }

    return null;
  }

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    try {
      require("fs").accessSync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Normalize file path for consistent comparison
   */
  normalizePath(filePath) {
    return filePath.replace(/\\/g, "/").replace(/\/$/, "");
  }

  /**
   * Identify entry points (Next.js App Router files)
   */
  identifyEntryPoints() {
    const entryPointPatterns = [
      "src/app/page.tsx",
      "src/app/layout.tsx",
      "src/app/not-found.tsx",
      "src/app/error.tsx",
      "src/app/global-error.tsx",
      "src/app/loading.tsx",
      "src/app/template.tsx",
    ];

    // Add all page.tsx files
    const pageFiles = Array.from(this.importGraph.keys()).filter(
      (key) => key.endsWith("/page.tsx") || key.endsWith("/page.jsx"),
    );

    // Add all layout.tsx files
    const layoutFiles = Array.from(this.importGraph.keys()).filter(
      (key) => key.endsWith("/layout.tsx") || key.endsWith("/layout.jsx"),
    );

    // Add all route.ts files (API routes)
    const routeFiles = Array.from(this.importGraph.keys()).filter(
      (key) => key.endsWith("/route.ts") || key.endsWith("/route.js"),
    );

    // Add specific entry points
    for (const pattern of entryPointPatterns) {
      if (this.importGraph.has(pattern)) {
        this.entryPoints.add(pattern);
      }
    }

    // Add discovered page, layout, and route files
    [...pageFiles, ...layoutFiles, ...routeFiles].forEach((file) => {
      this.entryPoints.add(file);
    });

    // Add any files that are not imported by anything (top-level files)
    // BUT exclude files in components directory that are not explicitly entry points
    for (const [file, dependents] of this.reverseGraph.entries()) {
      if (dependents.size === 0 && !file.includes("node_modules")) {
        // Only add as entry point if it's in app directory or is a known entry point pattern
        if (file.startsWith("src/app/") || this.isKnownEntryPoint(file)) {
          this.entryPoints.add(file);
        }
      }
    }
  }

  /**
   * Find unused files by traversing from entry points
   */
  findUnusedFiles() {
    const usedFiles = new Set();
    const queue = Array.from(this.entryPoints);

    // BFS traversal from entry points
    while (queue.length > 0) {
      const currentFile = queue.shift();
      if (usedFiles.has(currentFile)) continue;

      usedFiles.add(currentFile);

      // Add all dependencies to queue
      const dependencies = this.importGraph.get(currentFile) || new Set();
      for (const dep of dependencies) {
        if (!usedFiles.has(dep) && !dep.startsWith("DYNAMIC:")) {
          queue.push(dep);
        }
      }
    }

    // Find unused files
    const allFiles = new Set([...this.importGraph.keys()]);
    const unusedFiles = Array.from(allFiles).filter(
      (file) => !usedFiles.has(file) && !this.isProtectedFile(file),
    );

    return {
      usedFiles: Array.from(usedFiles),
      unusedFiles,
      totalFiles: allFiles.size,
    };
  }

  /**
   * Check if file is a known entry point pattern
   */
  isKnownEntryPoint(filePath) {
    const entryPointPatterns = [
      /\/page\.(tsx?|jsx?)$/,
      /\/layout\.(tsx?|jsx?)$/,
      /\/loading\.(tsx?|jsx?)$/,
      /\/error\.(tsx?|jsx?)$/,
      /\/not-found\.(tsx?|jsx?)$/,
      /\/global-error\.(tsx?|jsx?)$/,
      /\/template\.(tsx?|jsx?)$/,
      /\/route\.(ts|js)$/,
      /\/middleware\.(ts|js)$/,
      /\/instrumentation\.(ts|js)$/,
    ];

    return entryPointPatterns.some((pattern) => pattern.test(filePath));
  }

  /**
   * Check if file matches protected patterns
   */
  isProtectedFile(filePath) {
    const protectedPatterns = [
      // Next.js App Router files
      /\/page\.(tsx?|jsx?)$/,
      /\/layout\.(tsx?|jsx?)$/,
      /\/loading\.(tsx?|jsx?)$/,
      /\/error\.(tsx?|jsx?)$/,
      /\/not-found\.(tsx?|jsx?)$/,
      /\/global-error\.(tsx?|jsx?)$/,
      /\/template\.(tsx?|jsx?)$/,
      /\/route\.(ts|js)$/,

      // Test files
      /\.(test|spec)\.(tsx?|jsx?|ts|js)$/,
      /\.stories\.(tsx?|jsx?|ts|js)$/,
      /__tests__\//,
      /__mocks__\//,

      // Type definitions
      /\.d\.ts$/,

      // Config files
      /middleware\.(ts|js)$/,
      /instrumentation\.(ts|js)$/,

      // Special Next.js files
      /opengraph-image\.(tsx?|jsx?|png|jpg|jpeg)$/,
      /icon\.(tsx?|jsx?|png|jpg|jpeg)$/,
      /apple-icon\.(tsx?|jsx?|png|jpg|jpeg)$/,
    ];

    return protectedPatterns.some((pattern) => pattern.test(filePath));
  }

  /**
   * Get file dependencies
   */
  getDependencies(filePath) {
    return this.importGraph.get(filePath) || new Set();
  }

  /**
   * Get file dependents
   */
  getDependents(filePath) {
    return this.reverseGraph.get(filePath) || new Set();
  }
}

module.exports = ImportAnalyzer;
