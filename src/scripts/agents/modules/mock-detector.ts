/**
 * Keyword-based scanner to identify mock/seed/test files
 * Detects files that are likely candidates for quarantine
 */

import * as fs from "fs";
import * as path from "path";
import { _QuarantineCandidate } from "../shared/types";

export class MockDetector {
  private projectRoot: string;
  private scope: string[];

  // Keywords to look for in file names and content
  private fileNameKeywords = [
    "mock",
    "seed",
    "fixture",
    "sample",
    "test-data",
    "test",
    "demo",
    "dummy",
    "fake",
    "stub",
    "temp",
    "temporary",
    "backup",
    "old",
  ];

  private contentKeywords = [
    "mock",
    "seed",
    "fixture",
    "sample",
    "test-data",
    "demo",
    "dummy",
    "fake",
    "stub",
    "placeholder",
    "temporary",
    "// TODO:",
    "// FIXME:",
    "// HACK:",
    "// // console.log",
    "// // console.warn",
    "// // console.error",
    "debugger",
  ];

  // File patterns that are likely test/seed files
  private filePatterns = [
    /test.*\.(ts|js|tsx|jsx)$/i,
    /spec.*\.(ts|js|tsx|jsx)$/i,
    /seed.*\.(ts|js|tsx|jsx)$/i,
    /mock.*\.(ts|js|tsx|jsx)$/i,
    /fixture.*\.(ts|js|tsx|jsx)$/i,
    /sample.*\.(ts|js|tsx|jsx)$/i,
    /demo.*\.(ts|js|tsx|jsx)$/i,
    /temp.*\.(ts|js|tsx|jsx)$/i,
    /backup.*\.(ts|js|tsx|jsx)$/i,
    /old.*\.(ts|js|tsx|jsx)$/i,
  ];

  // Directory patterns that are likely test/seed directories
  private directoryPatterns = [
    /\/test\//i,
    /\/tests\//i,
    /\/spec\//i,
    /\/specs\//i,
    /\/seed\//i,
    /\/seeds\//i,
    /\/mock\//i,
    /\/mocks\//i,
    /\/fixture\//i,
    /\/fixtures\//i,
    /\/sample\//i,
    /\/samples\//i,
    /\/demo\//i,
    /\/demos\//i,
    /\/temp\//i,
    /\/temporary\//i,
    /\/backup\//i,
    /\/old\//i,
  ];

  constructor(_projectRoot: string, scope: string[]) {
    this.projectRoot = projectRoot;
    this.scope = scope;
  }

  /**
   * Scan for mock/seed/test files in the specified scope
   */
  async detectCandidates(): Promise<QuarantineCandidate[]> {
    // // console.log("🔍 Detecting mock/seed/test files...");

    const candidates: QuarantineCandidate[] = [];
    const __files = await this.getAllFilesInScope();

    // // console.log(
      `📁 Scanning ${files.length} files for test/mock/seed patterns`,
    );

    for (const filePath of files) {
      try {
        const __candidate = await this.analyzeFile(filePath);
        if (candidate) {
          candidates.push(candidate);
        }
      } catch (error) {
        // // console.warn(`⚠️  Failed to analyze ${filePath}:`, error);
      }
    }

    // // console.log(
      `✅ Mock detection complete - found ${candidates.length} candidates`,
    );
    return candidates;
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
        file.endsWith(".jsx") ||
        file.endsWith(".json") ||
        file.endsWith(".sql"),
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
        // Skip common exclusions
        if (
          ![
            "node_modules",
            ".git",
            ".next",
            "dist",
            "build",
            ".shared_quarantine",
          ].includes(entry.name)
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
   * Analyze a single file for mock/seed/test patterns
   */
  private async analyzeFile(
    filePath: string,
  ): Promise<QuarantineCandidate | null> {
    const __fileName = path.basename(filePath);
    const __relativePath = path.relative(this.projectRoot, filePath);

    let score = 0;
    let reasons: string[] = [];
    let category = "";
    let riskLevel: "safe" | "needs-review" | "dangerous" = "safe";

    // Check file name patterns
    const __fileNameMatch = this.filePatterns.some((pattern) =>
      pattern.test(fileName),
    );
    if (fileNameMatch) {
      score += 30;
      reasons.push(`File name matches test/mock/seed pattern: ${fileName}`);
      category = this.categorizeByFileName(fileName);
    }

    // Check directory patterns
    const __directoryMatch = this.directoryPatterns.some((pattern) =>
      pattern.test(relativePath),
    );
    if (directoryMatch) {
      score += 25;
      reasons.push(`File is in test/mock/seed directory: ${relativePath}`);
      if (!category) category = this.categorizeByDirectory(relativePath);
    }

    // Check file name keywords
    const __fileNameKeywords = this.fileNameKeywords.filter((keyword) =>
      fileName.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (fileNameKeywords.length > 0) {
      score += fileNameKeywords.length * 10;
      reasons.push(
        `File name contains keywords: ${fileNameKeywords.join(", ")}`,
      );
      if (!category) category = this.categorizeByKeywords(fileNameKeywords);
    }

    // Check file content
    try {
      const __content = await fs.promises.readFile(filePath, "utf-8");
      const __contentAnalysis = this.analyzeContent(content, filePath);

      if (contentAnalysis.score > 0) {
        score += contentAnalysis.score;
        reasons.push(...contentAnalysis.reasons);
        if (!category) category = contentAnalysis.category;
      }

      // Check for specific patterns in content
      if (this.isTestFile(content)) {
        score += 20;
        reasons.push("File contains test patterns");
        category = "test";
      }

      if (this.isSeedFile(content)) {
        score += 25;
        reasons.push("File contains seed data patterns");
        category = "seed";
      }

      if (this.isMockFile(content)) {
        score += 20;
        reasons.push("File contains mock patterns");
        category = "mock";
      }
    } catch (error) {
      // If we can't read the file, skip content analysis
      // // console.warn(`⚠️  Could not read file content: ${filePath}`);
    }

    // Determine risk level based on score and file type
    if (score >= 50) {
      riskLevel = "safe"; // High confidence it's a test/mock file
    } else if (score >= 20) {
      riskLevel = "needs-review"; // Medium confidence
    } else {
      return null; // Not a candidate
    }

    // Special cases for known file types
    if (filePath.includes("/api/test/")) {
      score += 30;
      reasons.push("File is in API test directory");
      category = "test";
      riskLevel = "safe";
    }

    if (
      filePath.includes("seed-") &&
      (filePath.endsWith(".js") || filePath.endsWith(".ts"))
    ) {
      score += 40;
      reasons.push("File is a seed script");
      category = "seed";
      riskLevel = "needs-review";
    }

    // Only return if we have a reasonable score
    if (score < 15) {
      return null;
    }

    return {
      file_path: filePath,
      reason: reasons.join("; "),
      category: category || "unknown",
      risk_level: riskLevel,
      confidence: Math.min(100, score),
      dependencies: [],
      dependents: [],
      metadata: {
        detection_score: score,
        file_name_keywords: fileNameKeywords,
        directory_match: directoryMatch,
        file_name_match: fileNameMatch,
        relative_path: relativePath,
      },
    };
  }

  /**
   * Analyze file content for test/mock/seed patterns
   */
  private analyzeContent(
    content: string,
    filePath: string,
  ): {
    score: number;
    reasons: string[];
    category: string;
  } {
    let score = 0;
    const reasons: string[] = [];
    let category = "";

    // Count keyword occurrences
    const __keywordCounts = this.contentKeywords.map((keyword) => ({
      keyword,
      count: (content.match(new RegExp(keyword, "gi")) || []).length,
    }));

    const __totalKeywords = keywordCounts.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    if (totalKeywords > 0) {
      score += Math.min(30, totalKeywords * 2);
      const __foundKeywords = keywordCounts
        .filter((item) => item.count > 0)
        .map((item) => `${item.keyword}(${item.count})`)
        .join(", ");
      reasons.push(`Content contains keywords: ${foundKeywords}`);
    }

    // Check for specific patterns
    if (
      content.includes("describe(") ||
      content.includes("it(") ||
      content.includes("test(")
    ) {
      score += 25;
      reasons.push("Contains test framework patterns");
      category = "test";
    }

    if (
      content.includes("jest") ||
      content.includes("vitest") ||
      content.includes("mocha")
    ) {
      score += 20;
      reasons.push("Contains test runner references");
      category = "test";
    }

    if (content.includes("expect(") || content.includes("assert(")) {
      score += 20;
      reasons.push("Contains assertion patterns");
      category = "test";
    }

    if (
      content.includes("beforeEach") ||
      content.includes("afterEach") ||
      content.includes("beforeAll") ||
      content.includes("afterAll")
    ) {
      score += 15;
      reasons.push("Contains test lifecycle hooks");
      category = "test";
    }

    if (
      content.includes("mock") ||
      content.includes("stub") ||
      content.includes("spy")
    ) {
      score += 15;
      reasons.push("Contains mocking patterns");
      if (!category) category = "mock";
    }

    if (
      content.includes("seed") ||
      content.includes("fixture") ||
      content.includes("sample")
    ) {
      score += 20;
      reasons.push("Contains seed/fixture patterns");
      if (!category) category = "seed";
    }

    // Check for development-only code
    if (
      content.includes("process.env.NODE_ENV") &&
      content.includes("development")
    ) {
      score += 10;
      reasons.push("Contains development-only code");
    }

    if (
      content.includes("// // console.log") ||
      content.includes("// // console.warn") ||
      content.includes("// // console.error")
    ) {
      const __consoleCount = (content.match(/console\.(log|warn|error)/g) || [])
        .length;
      if (consoleCount > 5) {
        score += 10;
        reasons.push(`Contains many console statements (${consoleCount})`);
      }
    }

    return { score, reasons, category };
  }

  /**
   * Check if file is a test file based on content
   */
  private isTestFile(_content: string): boolean {
    const __testPatterns = [
      /describe\s*\(/,
      /it\s*\(/,
      /test\s*\(/,
      /expect\s*\(/,
      /assert\s*\(/,
      /beforeEach\s*\(/,
      /afterEach\s*\(/,
      /beforeAll\s*\(/,
      /afterAll\s*\(/,
    ];

    return testPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Check if file is a seed file based on content
   */
  private isSeedFile(_content: string): boolean {
    const __seedPatterns = [
      /seed\s*\(/,
      /\.insert\s*\(/,
      /\.upsert\s*\(/,
      /INSERT\s+INTO/gi,
      /seed.*data/gi,
      /sample.*data/gi,
      /fixture.*data/gi,
    ];

    return seedPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Check if file is a mock file based on content
   */
  private isMockFile(_content: string): boolean {
    const __mockPatterns = [
      /mock\s*\(/,
      /jest\.mock/,
      /vi\.mock/,
      /sinon\.stub/,
      /sinon\.spy/,
      /mockImplementation/,
      /mockReturnValue/,
      /mockResolvedValue/,
    ];

    return mockPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Categorize file based on file name
   */
  private categorizeByFileName(_fileName: string): string {
    const __lowerName = fileName.toLowerCase();

    if (lowerName.includes("test") || lowerName.includes("spec")) return "test";
    if (lowerName.includes("seed")) return "seed";
    if (lowerName.includes("mock")) return "mock";
    if (lowerName.includes("fixture")) return "fixture";
    if (lowerName.includes("sample")) return "sample";
    if (lowerName.includes("demo")) return "demo";

    return "unknown";
  }

  /**
   * Categorize file based on directory
   */
  private categorizeByDirectory(_relativePath: string): string {
    const __lowerPath = relativePath.toLowerCase();

    if (lowerPath.includes("/test/") || lowerPath.includes("/tests/"))
      return "test";
    if (lowerPath.includes("/seed/") || lowerPath.includes("/seeds/"))
      return "seed";
    if (lowerPath.includes("/mock/") || lowerPath.includes("/mocks/"))
      return "mock";
    if (lowerPath.includes("/fixture/") || lowerPath.includes("/fixtures/"))
      return "fixture";
    if (lowerPath.includes("/sample/") || lowerPath.includes("/samples/"))
      return "sample";
    if (lowerPath.includes("/demo/") || lowerPath.includes("/demos/"))
      return "demo";

    return "unknown";
  }

  /**
   * Categorize file based on keywords
   */
  private categorizeByKeywords(_keywords: string[]): string {
    if (keywords.some((k) => k.includes("test"))) return "test";
    if (keywords.some((k) => k.includes("seed"))) return "seed";
    if (keywords.some((k) => k.includes("mock"))) return "mock";
    if (keywords.some((k) => k.includes("fixture"))) return "fixture";
    if (keywords.some((k) => k.includes("sample"))) return "sample";
    if (keywords.some((k) => k.includes("demo"))) return "demo";

    return "unknown";
  }
}
