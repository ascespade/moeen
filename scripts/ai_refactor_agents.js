/**
 * Read AGENTS_EVALUATION.json and update agent configs in agent_configs/
 * for low-scoring agents. Adds refactor goals to agent configs.
 * Limits to 5 edits per run.
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

const EVALUATION_FILE = path.resolve(__dirname, '..', 'AGENTS_EVALUATION.json');
const AGENT_CONFIGS_DIR = path.resolve(__dirname, '..', 'agent_configs');
const MAX_EDITS_PER_RUN = 5;
const LOW_SCORE_THRESHOLD = 0.5;

async function ensureDirectory(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
}

async function readEvaluation() {
  try {
    const content = await fs.readFile(EVALUATION_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    logger.error(`Failed to read evaluation file: ${EVALUATION_FILE}`, error);
    return null;
  }
}

async function findAgentConfig(agentName) {
  await ensureDirectory(AGENT_CONFIGS_DIR);
  
  // Try multiple possible patterns
  const patterns = [
    `${agentName}.json`,
    `${agentName}_config.json`,
    `**/${agentName}.json`,
    `**/${agentName}_config.json`,
  ];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, {
        cwd: AGENT_CONFIGS_DIR,
        absolute: true,
      });
      
      if (files.length > 0) {
        return files[0];
      }
    } catch (error) {
      // Continue to next pattern
    }
  }
  
  // If not found, create new config file
  return path.resolve(AGENT_CONFIGS_DIR, `${agentName}.json`);
}

function generateRefactorGoals(agentEvaluation) {
  const goals = [];
  
  // Generate goals based on recommendations
  for (const rec of agentEvaluation.recommendations || []) {
    if (rec.priority === 'high') {
      goals.push({
        priority: 'high',
        category: rec.category,
        description: rec.message,
        action: rec.action,
        targetScore: agentEvaluation.score + 0.2, // Aim to improve by 0.2
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      });
    }
  }
  
  // Add general improvement goals if score is very low
  if (agentEvaluation.score < 0.3) {
    goals.push({
      priority: 'critical',
      category: 'overall',
      description: 'Critical performance issues detected',
      action: 'Complete agent refactoring required',
      targetScore: 0.5,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    });
  }
  
  // Add specific goals based on score breakdown
  if (agentEvaluation.breakdown.tests < 0.5) {
    goals.push({
      priority: 'high',
      category: 'tests',
      description: 'Improve test coverage and reliability',
      action: 'Add missing tests and fix failing test cases',
      targetScore: agentEvaluation.breakdown.tests + 0.3,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
    });
  }
  
  return goals;
}

async function updateAgentConfig(configPath, agentEvaluation) {
  let config = {
    name: agentEvaluation.name,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  };
  
  // Try to read existing config
  try {
    const existingContent = await fs.readFile(configPath, 'utf8');
    config = { ...config, ...JSON.parse(existingContent) };
  } catch {
    // Config doesn't exist, use default
    logger.info(`Creating new config for agent: ${agentEvaluation.name}`);
  }
  
  // Update or add refactor goals
  const newGoals = generateRefactorGoals(agentEvaluation);
  const existingGoals = config.refactorGoals || [];
  
  // Merge goals, avoiding duplicates
  const goalMap = new Map();
  
  // Keep existing goals
  for (const goal of existingGoals) {
    const key = `${goal.category}-${goal.priority}`;
    goalMap.set(key, goal);
  }
  
  // Add or update with new goals
  for (const goal of newGoals) {
    const key = `${goal.category}-${goal.priority}`;
    const existing = goalMap.get(key);
    
    if (!existing || goal.priority === 'critical') {
      goalMap.set(key, goal);
    }
  }
  
  config.refactorGoals = Array.from(goalMap.values());
  config.lastEvaluation = {
    score: agentEvaluation.score,
    breakdown: agentEvaluation.breakdown,
    timestamp: agentEvaluation.lastUpdated || new Date().toISOString(),
  };
  config.lastUpdated = new Date().toISOString();
  
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
  logger.info(`Updated config for agent: ${agentEvaluation.name}`);
  
  return true;
}

async function main() {
  try {
    logger.info('Starting AI refactor agents...');
    
    const evaluation = await readEvaluation();
    
    if (!evaluation || !evaluation.agents || evaluation.agents.length === 0) {
      logger.warn('No evaluation data found. Run evaluate_performance.js first.');
      return;
    }
    
    // Filter low-scoring agents
    const lowScoringAgents = evaluation.agents.filter(
      (agent) => agent.score < LOW_SCORE_THRESHOLD
    );
    
    if (lowScoringAgents.length === 0) {
      logger.info('No low-scoring agents found. All agents meet the threshold.');
      return;
    }
    
    logger.info(`Found ${lowScoringAgents.length} low-scoring agents`);
    
    // Limit to MAX_EDITS_PER_RUN
    const agentsToRefactor = lowScoringAgents.slice(0, MAX_EDITS_PER_RUN);
    
    logger.info(`Refactoring ${agentsToRefactor.length} agents (limited to ${MAX_EDITS_PER_RUN})`);
    
    let updatedCount = 0;
    
    for (const agentEvaluation of agentsToRefactor) {
      try {
        const configPath = await findAgentConfig(agentEvaluation.name);
        await updateAgentConfig(configPath, agentEvaluation);
        updatedCount++;
      } catch (error) {
        logger.error(`Failed to update config for ${agentEvaluation.name}`, error);
      }
    }
    
    logger.info(`AI refactor complete. Updated ${updatedCount} agent configs.`);
    
    if (lowScoringAgents.length > MAX_EDITS_PER_RUN) {
      logger.info(
        `Note: ${lowScoringAgents.length - MAX_EDITS_PER_RUN} more agents need refactoring (run again to process more)`
      );
    }
  } catch (error) {
    logger.error('Error in ai_refactor_agents.js', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Fatal error in ai_refactor_agents.js', error);
  process.exit(1);
});
