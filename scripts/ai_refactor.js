/**
 * Orchestrate project-wide refactoring:
 * 1. Run ESLint with --fix
 * 2. Run Prettier
 * 3. Execute replace-console.js
 * Handle errors gracefully
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to import logger, fallback to console if not available
let logger;
try {
  const loggerModule = await import('../src/lib/logger.ts');
  logger = loggerModule.logger || loggerModule.log || loggerModule.default;
} catch (e) {
  try {
    const loggerModule = await import('../src/lib/logger.js');
    logger = loggerModule.logger || loggerModule.log || loggerModule.default;
  } catch (e2) {
    logger = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
    };
  }
}

function runCommand(command, description) {
  try {
    logger.info(`Running: ${description}`);
    logger.debug(`Command: ${command}`);
    
    execSync(command, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
    });
    
    logger.info(`✓ Completed: ${description}`);
    return true;
  } catch (error) {
    logger.error(`✗ Failed: ${description}`, error);
    return false;
  }
}

async function runReplaceConsole() {
  try {
    logger.info('Running: Replace console.log with logger calls');
    
    const replaceConsoleScript = path.resolve(__dirname, 'replace-console.js');
    execSync(`node ${replaceConsoleScript}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
    });
    
    logger.info('✓ Completed: Replace console.log with logger calls');
    return true;
  } catch (error) {
    logger.error('✗ Failed: Replace console.log with logger calls', error);
    return false;
  }
}

async function main() {
  logger.info('Starting AI refactor process...');
  
  const results = {
    eslint: false,
    prettier: false,
    replaceConsole: false,
  };
  
  // Step 1: Run ESLint with --fix
  results.eslint = runCommand('npm run lint:fix', 'ESLint auto-fix');
  
  // Step 2: Run Prettier
  results.prettier = runCommand('npm run format', 'Prettier formatting');
  
  // Step 3: Run replace-console.js
  results.replaceConsole = await runReplaceConsole();
  
  // Summary
  logger.info('\n=== Refactor Summary ===');
  logger.info(`ESLint: ${results.eslint ? '✓ Success' : '✗ Failed'}`);
  logger.info(`Prettier: ${results.prettier ? '✓ Success' : '✗ Failed'}`);
  logger.info(`Replace Console: ${results.replaceConsole ? '✓ Success' : '✗ Failed'}`);
  
  const allSuccessful = results.eslint && results.prettier && results.replaceConsole;
  
  if (allSuccessful) {
    logger.info('\n✓ All refactoring steps completed successfully');
    process.exit(0);
  } else {
    logger.warn('\n⚠ Some refactoring steps failed, but continuing...');
    process.exit(0); // Exit with 0 to allow continuation in sync_all.js
  }
}

main().catch((error) => {
  logger.error('Fatal error in ai_refactor.js', error);
  process.exit(1);
});
