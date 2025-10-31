/**
 * Orchestrate full sync cycle:
 * 1. Update status
 * 2. Evaluate performance
 * 3. Refactor agents
 * 4. Run AI refactor
 * 5. Run Playwright tests
 * 6. Update status again
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

const PROJECT_ROOT = path.resolve(__dirname, '..');

function runScript(scriptName, description) {
  try {
    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`Step: ${description}`);
    logger.info(`${'='.repeat(60)}`);
    
    const scriptPath = path.resolve(__dirname, scriptName);
    execSync(`node ${scriptPath}`, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });
    
    logger.info(`✓ Completed: ${description}`);
    return true;
  } catch (error) {
    logger.error(`✗ Failed: ${description}`, error);
    // Continue execution even if step fails
    return false;
  }
}

function runNpmScript(npmScript, description) {
  try {
    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`Step: ${description}`);
    logger.info(`${'='.repeat(60)}`);
    
    execSync(`npm run ${npmScript}`, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });
    
    logger.info(`✓ Completed: ${description}`);
    return true;
  } catch (error) {
    logger.error(`✗ Failed: ${description}`, error);
    // Continue execution even if step fails
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  
  logger.info('\n');
  logger.info('╔══════════════════════════════════════════════════════════╗');
  logger.info('║         Agent Management Sync Cycle Starting             ║');
  logger.info('╚══════════════════════════════════════════════════════════╝');
  logger.info('');
  
  const results = {
    updateStatus1: false,
    evaluatePerformance: false,
    refactorAgents: false,
    aiRefactor: false,
    runTests: false,
    updateStatus2: false,
  };
  
  // Step 1: Update status
  results.updateStatus1 = runScript('update_status.js', '1. Update Agent Status');
  
  // Step 2: Evaluate performance
  results.evaluatePerformance = runScript(
    'evaluate_performance.js',
    '2. Evaluate Agent Performance'
  );
  
  // Step 3: Refactor agents (only if evaluation was successful)
  if (results.evaluatePerformance) {
    results.refactorAgents = runScript('ai_refactor_agents.js', '3. Refactor Low-Scoring Agents');
  } else {
    logger.warn('Skipping agent refactoring (evaluation step failed)');
  }
  
  // Step 4: Run AI refactor
  results.aiRefactor = runScript('ai_refactor.js', '4. Run Project-Wide AI Refactor');
  
  // Step 5: Run Playwright tests
  results.runTests = runNpmScript('test', '5. Run Playwright Tests');
  
  // Step 6: Update status again (final status after all operations)
  results.updateStatus2 = runScript('update_status.js', '6. Update Final Agent Status');
  
  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  logger.info('\n');
  logger.info('╔══════════════════════════════════════════════════════════╗');
  logger.info('║              Sync Cycle Summary                          ║');
  logger.info('╚══════════════════════════════════════════════════════════╝');
  logger.info('');
  logger.info(`Duration: ${duration}s`);
  logger.info('');
  logger.info('Results:');
  logger.info(`  1. Update Status (initial):     ${results.updateStatus1 ? '✓' : '✗'}`);
  logger.info(`  2. Evaluate Performance:        ${results.evaluatePerformance ? '✓' : '✗'}`);
  logger.info(`  3. Refactor Agents:             ${results.refactorAgents ? '✓' : '✗'}`);
  logger.info(`  4. AI Refactor:                 ${results.aiRefactor ? '✓' : '✗'}`);
  logger.info(`  5. Run Tests:                   ${results.runTests ? '✓' : '✗'}`);
  logger.info(`  6. Update Status (final):       ${results.updateStatus2 ? '✓' : '✗'}`);
  logger.info('');
  
  const successfulSteps = Object.values(results).filter((r) => r).length;
  const totalSteps = Object.keys(results).length;
  
  logger.info(`Completed: ${successfulSteps}/${totalSteps} steps`);
  logger.info('');
  
  if (successfulSteps === totalSteps) {
    logger.info('✓ All sync cycle steps completed successfully');
    process.exit(0);
  } else {
    logger.warn(`⚠ Sync cycle completed with ${totalSteps - successfulSteps} failed step(s)`);
    // Exit with 0 to allow for partial success scenarios
    process.exit(0);
  }
}

main().catch((error) => {
  logger.error('Fatal error in sync_all.js', error);
  process.exit(1);
});
