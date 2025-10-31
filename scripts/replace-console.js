/**
 * Replace console.log|info|warn|error|debug with logger.* calls
 * Imports logger from src/lib/logger.ts
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to import logger, fallback to console if not available
let logger;
try {
  // Try importing from TypeScript file (if ts-node or similar is configured)
  const loggerModule = await import('../src/lib/logger.ts');
  logger = loggerModule.logger || loggerModule.log || loggerModule.default;
} catch (e) {
  try {
    // Try importing from JavaScript file
    const loggerModule = await import('../src/lib/logger.js');
    logger = loggerModule.logger || loggerModule.log || loggerModule.default;
  } catch (e2) {
    // Fallback to console
    logger = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
    };
    logger.warn('Logger not found, using console as fallback');
  }
}

const CONSOLE_PATTERNS = [
  { regex: /console\.log\s*\(/g, replacement: 'logger.info(' },
  { regex: /console\.info\s*\(/g, replacement: 'logger.info(' },
  { regex: /console\.warn\s*\(/g, replacement: 'logger.warn(' },
  { regex: /console\.error\s*\(/g, replacement: 'logger.error(' },
  { regex: /console\.debug\s*\(/g, replacement: 'logger.debug(' },
];

const LOGGER_IMPORT = "import { logger } from '../src/lib/logger.js';\n";
const LOGGER_IMPORT_TS = "import { logger } from '../src/lib/logger.ts';\n";

async function hasLoggerImport(content) {
  return (
    content.includes("from '../src/lib/logger") ||
    content.includes('from "../src/lib/logger') ||
    content.includes("from '@/lib/logger") ||
    content.includes('from "@/lib/logger')
  );
}

async function addLoggerImport(content, filePath) {
  // Check if it's a TypeScript file
  const isTS = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    } else if (lastImportIndex !== -1 && lines[i].trim() && !lines[i].trim().startsWith('//')) {
      break;
    }
  }
  
  const importLine = isTS ? LOGGER_IMPORT_TS : LOGGER_IMPORT;
  
  if (lastImportIndex === -1) {
    return importLine + content;
  }
  
  lines.splice(lastImportIndex + 1, 0, importLine.trim());
  return lines.join('\n');
}

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    let modified = content;
    let hasChanges = false;
    
    // Check if file needs logger import
    const needsImport = !(await hasLoggerImport(content));
    
    // Replace console.* with logger.*
    for (const { regex, replacement } of CONSOLE_PATTERNS) {
      if (regex.test(modified)) {
        modified = modified.replace(regex, replacement);
        hasChanges = true;
      }
    }
    
    // Add logger import if needed and changes were made
    if (hasChanges && needsImport) {
      modified = await addLoggerImport(modified, filePath);
    }
    
    if (hasChanges) {
      await fs.writeFile(filePath, modified, 'utf8');
      logger.info(`Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error(`Error processing ${filePath}`, error);
    return false;
  }
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  
  // Search for TypeScript and JavaScript files
  const patterns = [
    'src/**/*.{js,jsx,ts,tsx}',
    'scripts/**/*.{js,mjs}',
  ];
  
  // Exclude node_modules, .next, and other build directories
  const ignore = [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/*.d.ts',
  ];
  
  logger.info('Starting console.log replacement...');
  
  let totalProcessed = 0;
  let totalUpdated = 0;
  
  for (const pattern of patterns) {
    const files = await glob(pattern, {
      cwd: projectRoot,
      ignore,
      absolute: true,
    });
    
    for (const file of files) {
      totalProcessed++;
      const updated = await processFile(file);
      if (updated) {
        totalUpdated++;
      }
    }
  }
  
  logger.info(`Processing complete. Processed: ${totalProcessed}, Updated: ${totalUpdated}`);
}

main().catch((error) => {
  logger.error('Fatal error in replace-console.js', error);
  process.exit(1);
});
