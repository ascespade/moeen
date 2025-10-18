const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Files to clean up
const patterns = ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"];

// Console methods to replace
const consoleMethods = ["log", "error", "warn", "info", "debug"];

// Replacement mapping
const replacements = {
  "logger.info": "logger.info",
  "logger.error": "logger.error",
  "logger.warn": "logger.warn",
  "logger.info": "logger.info",
  "logger.debug": "logger.debug",
};

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Replace console methods with logger
    for (const [consoleMethod, loggerMethod] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${consoleMethod}\\b`, "g");
      if (content.includes(consoleMethod)) {
        content = content.replace(regex, loggerMethod);
        modified = true;
      }
    }

    // Add logger import if needed
    if (modified && !content.includes("import { logger }")) {
      const importStatement = "import { logger } from '@/lib/logger';\n";

      // Find the best place to add the import
      const lines = content.split("\n");
      let insertIndex = 0;

      // Find last import statement
      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].startsWith("import ") ||
          (lines[i].startsWith("const ") && lines[i].includes("require("))
        ) {
          insertIndex = i + 1;
        }
      }

      lines.splice(insertIndex, 0, importStatement);
      content = lines.join("\n");
    }

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      logger.info(`✅ Cleaned: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🧹 Starting console.log cleanup...");

  let totalFiles = 0;
  let cleanedFiles = 0;

  patterns.forEach((pattern) => {
    const files = glob.sync(pattern, {
      ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
    });

    files.forEach((file) => {
      totalFiles++;
      if (cleanFile(file)) {
        cleanedFiles++;
      }
    });
  });

  logger.info(`\n📊 Cleanup Summary:`);
  logger.info(`   Total files processed: ${totalFiles}`);
  logger.info(`   Files cleaned: ${cleanedFiles}`);
  logger.info(`   Files unchanged: ${totalFiles - cleanedFiles}`);

  if (cleanedFiles > 0) {
    logger.info("\n✅ Console log cleanup completed successfully!");
  } else {
    logger.info("\n✨ No console logs found to clean up.");
  }
}

main();
