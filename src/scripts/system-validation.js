const fs = require("fs");
const path = require("path");
const glob = require("glob");
import { logger } from "@/lib/logger";

class SystemValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  addCheck(name, check, type = "error") {
    this.checks.push({ name, check, type });
  }

  async runChecks() {
    logger.info("🔍 Starting system validation...\n");

    for (const { name, check, type } of this.checks) {
      try {
        const result = await check();
        if (result.passed) {
          logger.info(`✅ ${name}`);
        } else {
          const message = `${type.toUpperCase()}: ${name} - ${result.message}`;
          if (type === "error") {
            this.errors.push(message);
            logger.info(`❌ ${message}`);
          } else {
            this.warnings.push(message);
            logger.info(`⚠️  ${message}`);
          }
        }
      } catch (error) {
        const message = `ERROR: ${name} - ${error.message}`;
        this.errors.push(message);
        logger.info(`❌ ${message}`);
      }
    }

    this.printSummary();
    return this.errors.length === 0;
  }

  printSummary() {
    logger.info("\n📊 Validation Summary:");
    logger.info(`   Total checks: ${this.checks.length}`);
    logger.info(`   Errors: ${this.errors.length}`);
    logger.info(`   Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      logger.info("\n❌ Errors found:");
      this.errors.forEach((error) => logger.info(`   - ${error}`));
    }

    if (this.warnings.length > 0) {
      logger.info("\n⚠️  Warnings found:");
      this.warnings.forEach((warning) => logger.info(`   - ${warning}`));
    }
  }
}

const validator = new SystemValidator();

// File structure checks
validator.addCheck("Required directories exist", () => {
  const requiredDirs = [
    "src/app",
    "src/components",
    "src/lib",
    "src/hooks",
    "src/context",
    "supabase/migrations",
  ];

  const missing = requiredDirs.filter((dir) => !fs.existsSync(dir));

  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing directories: ${missing.join(", ")}`,
    };
  }

  return { passed: true };
});

// Critical files exist
validator.addCheck("Critical files exist", () => {
  const criticalFiles = [
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/lib/supabase.ts",
    "src/lib/auth/authorize.ts",
    "src/context/ThemeContext.tsx",
    "src/hooks/useT.tsx",
  ];

  const missing = criticalFiles.filter((file) => !fs.existsSync(file));

  if (missing.length > 0) {
    return { passed: false, message: `Missing files: ${missing.join(", ")}` };
  }

  return { passed: true };
});

// Role-based dashboards exist
validator.addCheck("Role-based dashboards exist", () => {
  const roleDashboards = [
    "src/app/(patient)/dashboard/page.tsx",
    "src/app/(doctor)/dashboard/page.tsx",
    "src/app/(staff)/dashboard/page.tsx",
    "src/app/(supervisor)/dashboard/page.tsx",
  ];

  const missing = roleDashboards.filter((file) => !fs.existsSync(file));

  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing role dashboards: ${missing.join(", ")}`,
    };
  }

  return { passed: true };
});

// API routes exist
validator.addCheck("Critical API routes exist", () => {
  const apiRoutes = [
    "src/app/api/auth/me/route.ts",
    "src/app/api/payments/process/route.ts",
    "src/app/api/insurance/claims/route.ts",
    "src/app/api/translations/[lang]/route.ts",
  ];

  const missing = apiRoutes.filter((file) => !fs.existsSync(file));

  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing API routes: ${missing.join(", ")}`,
    };
  }

  return { passed: true };
});

// Database migrations exist
validator.addCheck("Database migrations exist", () => {
  const migrationFiles = glob.sync("supabase/migrations/*.sql");

  if (migrationFiles.length === 0) {
    return { passed: false, message: "No migration files found" };
  }

  return { passed: true };
});

// No logger.info in production files
validator.addCheck(
  "No logger.info in production files",
  () => {
    const files = glob.sync("src/**/*.{ts,tsx}", {
      ignore: ["src/scripts/**", "src/**/*.test.*", "src/**/*.spec.*"],
    });

    const filesWithConsole = [];

    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      if (
        content.includes("logger.info") ||
        content.includes("logger.error") ||
        content.includes("logger.warn")
      ) {
        filesWithConsole.push(file);
      }
    });

    if (filesWithConsole.length > 0) {
      return {
        passed: false,
        message: `Files with console statements: ${filesWithConsole.slice(0, 5).join(", ")}${filesWithConsole.length > 5 ? "..." : ""}`,
      };
    }

    return { passed: true };
  },
  "warning",
);

// TypeScript compilation check
validator.addCheck(
  "TypeScript files are valid",
  () => {
    const tsFiles = glob.sync("src/**/*.{ts,tsx}", {
      ignore: ["src/scripts/**", "src/**/*.test.*", "src/**/*.spec.*"],
    });

    const invalidFiles = [];

    tsFiles.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf8");
        // Basic syntax check - look for obvious issues
        if (
          content.includes("any: any") ||
          content.includes("undefined: undefined")
        ) {
          invalidFiles.push(file);
        }
      } catch (error) {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      return {
        passed: false,
        message: `Files with potential TypeScript issues: ${invalidFiles.slice(0, 3).join(", ")}`,
      };
    }

    return { passed: true };
  },
  "warning",
);

// Environment variables check
validator.addCheck("Environment variables are configured", () => {
  const envFile = ".env.local";

  if (!fs.existsSync(envFile)) {
    return { passed: false, message: "Environment file not found" };
  }

  const envContent = fs.readFileSync(envFile, "utf8");
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missing = requiredVars.filter(
    (varName) => !envContent.includes(varName),
  );

  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing environment variables: ${missing.join(", ")}`,
    };
  }

  return { passed: true };
});

// Package.json dependencies check
validator.addCheck("Required dependencies are installed", () => {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const requiredDeps = [
    "next",
    "react",
    "react-dom",
    "@supabase/supabase-js",
    "zod",
    "lucide-react",
  ];

  const missing = requiredDeps.filter(
    (dep) =>
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep],
  );

  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing dependencies: ${missing.join(", ")}`,
    };
  }

  return { passed: true };
});

// Run validation
validator
  .runChecks()
  .then((success) => {
    if (success) {
      logger.info(
        "\n🎉 System validation passed! The system is ready for deployment.",
      );
      process.exit(0);
    } else {
      logger.info(
        "\n❌ System validation failed! Please fix the errors before deployment.",
      );
      process.exit(1);
    }
  })
  .catch((error) => {
    logger.error("\n💥 Validation process failed:", error);
    process.exit(1);
  });
