import fs from "fs";
import path from "path";
import { glob } from "glob";

/**
 * Validation script to check for hardcoded content violations
 * This ensures all content is dynamic and database-driven
 */

interface Violation {
  file: string;
  line: number;
  content: string;
  type: "hardcoded_string" | "static_array" | "mock_data" | "fallback_data";
  severity: "error" | "warning";
}

class DynamicContentValidator {
  private violations: Violation[] = [];
  private disallowedPatterns = [
    // Hardcoded strings in JSX/TSX (user-facing text)
    /<[^>]*>["'][^"']*["']<\/[^>]*>/g,
    /<[^>]*>["'][^"']*["']/g,
    // Static arrays in components (not utilities)
    /const\s+\w+\s*=\s*\[.*\]/g,
    /export\s+const\s+\w+\s*=\s*\[.*\]/g,
    // Mock data
    /mock|fixture|simulation|sampleData/gi,
    // Fallback data functions
    /getDefault\w+\(\)/g,
    /fallback.*=.*\[/g,
    // JSON imports
    /import\s+.*from\s+.*\.json/g,
    /require\s*\(\s*.*\.json\s*\)/g,
  ];

  private allowedPatterns = [
    // Translation keys
    /t\(I18N_KEYS\./g,
    // Database queries
    /from\('settings'\)/g,
    /from\('translations'\)/g,
    /createClient\(\)/g,
    // Dynamic content manager
    /dynamicContentManager\./g,
    /dynamicThemeManager\./g,
    // Environment variables
    /process\.env\./g,
    // Hooks
    /useI18n\(/g,
    /usePageI18n\(/g,
    // Utility files (exclude from validation)
    /src\/utils\//g,
    /src\/types\//g,
    /src\/scripts\//g,
    /src\/styles\//g,
    /middleware\./g,
    /\.config\./g,
    /\.json/g,
    // Comments and imports
    /^\s*\/\//g,
    /^\s*\/\*/g,
    /^\s*\*/g,
    /^\s*import\s/g,
    /^\s*export\s/g,
  ];

  async validateFile(filePath: string): Promise<void> {
    try {
      // Skip utility files, types, scripts, and config files
      if (this.shouldSkipFile(filePath)) {
        return;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Skip comments and imports
        if (
          line.trim().startsWith("//") ||
          line.trim().startsWith("/*") ||
          line.trim().startsWith("*") ||
          line.trim().startsWith("import ")
        ) {
          return;
        }

        // Check for disallowed patterns
        this.disallowedPatterns.forEach((pattern) => {
          const matches = line.match(pattern);
          if (matches) {
            // Check if this line contains allowed patterns (exceptions)
            const hasAllowedPattern = this.allowedPatterns.some(
              (allowedPattern) =>
                allowedPattern.test(line) || allowedPattern.test(filePath),
            );

            if (!hasAllowedPattern) {
              this.violations.push({
                file: filePath,
                line: index + 1,
                content: line.trim(),
                type: this.getViolationType(pattern),
                severity: "error",
              });
            }
          }
        });
      });
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  private shouldSkipFile(filePath: string): boolean {
    const skipPatterns = [
      /src\/utils\//,
      /src\/types\//,
      /src\/scripts\//,
      /src\/styles\//,
      /src\/__tests__\//,
      /\.test\./,
      /\.spec\./,
      /middleware\./,
      /\.config\./,
      /\.json$/,
      /\.d\.ts$/,
      /node_modules/,
      /dist\//,
      /build\//,
    ];

    return skipPatterns.some((pattern) => pattern.test(filePath));
  }

  private getViolationType(pattern: RegExp): Violation["type"] {
    if (pattern.source.includes("mock|fixture|simulation|sampleData")) {
      return "mock_data";
    }
    if (
      pattern.source.includes("const.*=.*\\[") ||
      pattern.source.includes("export.*=.*\\[")
    ) {
      return "static_array";
    }
    if (
      pattern.source.includes("getDefault") ||
      pattern.source.includes("fallback")
    ) {
      return "fallback_data";
    }
    return "hardcoded_string";
  }

  async validateDirectory(dirPath: string): Promise<void> {
    const files = await glob("**/*.{ts,tsx,js,jsx}", {
      cwd: dirPath,
      ignore: ["node_modules/**", "dist/**", "build/**", "**/*.d.ts"],
    });

    console.log(`🔍 Validating ${files.length} files...`);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      await this.validateFile(fullPath);
    }
  }

  generateReport(): void {
    console.log("\n📊 Dynamic Content Validation Report");
    console.log("=====================================\n");

    if (this.violations.length === 0) {
      console.log(
        "✅ No violations found! All content is dynamic and database-driven.",
      );
      return;
    }

    // Group violations by type
    const violationsByType = this.violations.reduce(
      (acc, violation) => {
        if (!acc[violation.type]) {
          acc[violation.type] = [];
        }
        acc[violation.type].push(violation);
        return acc;
      },
      {} as Record<string, Violation[]>,
    );

    // Print violations by type
    Object.entries(violationsByType).forEach(([type, violations]) => {
      console.log(
        `\n❌ ${type.toUpperCase()} VIOLATIONS (${violations.length}):`,
      );
      console.log("─".repeat(50));

      violations.forEach((violation) => {
        console.log(`📁 ${violation.file}:${violation.line}`);
        console.log(`   ${violation.content}`);
        console.log("");
      });
    });

    console.log(`\n📈 Summary:`);
    console.log(`   Total violations: ${this.violations.length}`);
    console.log(
      `   Error severity: ${this.violations.filter((v) => v.severity === "error").length}`,
    );
    console.log(
      `   Warning severity: ${this.violations.filter((v) => v.severity === "warning").length}`,
    );

    if (this.violations.length > 0) {
      console.log("\n🚨 Build should be blocked due to violations!");
      process.exit(1);
    }
  }

  getViolations(): Violation[] {
    return this.violations;
  }
}

async function main() {
  const validator = new DynamicContentValidator();

  console.log("🔍 Starting dynamic content validation...");

  // Validate src directory
  await validator.validateDirectory("./src");

  // Generate report
  validator.generateReport();
}

// Run validation if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default DynamicContentValidator;
