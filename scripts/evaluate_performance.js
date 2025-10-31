/**
 * Evaluate agent performance based on tests, recent fixes, and activity
 * Scoring: Tests (60%), Recent fixes (20%), Activity (20%)
 * Generates AGENTS_EVALUATION.json
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

const AGENTS_DIR = path.resolve(__dirname, '..', 'agents');
const EVALUATION_FILE = path.resolve(__dirname, '..', 'AGENTS_EVALUATION.json');

// Scoring weights
const WEIGHTS = {
  tests: 0.6,
  recentFixes: 0.2,
  activity: 0.2,
};

async function ensureDirectory(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
}

function calculateTestScore(agentStatus) {
  // Extract test information from metadata
  const metadata = agentStatus.metadata || {};
  const testPassRate = metadata.testPassRate || 0;
  const totalTests = metadata.totalTests || 0;
  const passedTests = metadata.passedTests || 0;
  
  // Calculate score based on pass rate and test count
  let score = 0;
  
  if (totalTests > 0) {
    score = passedTests / totalTests;
  } else if (testPassRate > 0) {
    score = testPassRate / 100;
  }
  
  // Bonus for having tests (even if some fail)
  if (totalTests > 0 && score > 0) {
    score = Math.min(score * 1.1, 1.0); // 10% bonus, capped at 1.0
  }
  
  return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
}

function calculateRecentFixesScore(agentStatus) {
  const metadata = agentStatus.metadata || {};
  const recentFixes = metadata.recentFixes || [];
  const lastFixDate = metadata.lastFixDate;
  
  // Score based on number of recent fixes (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let score = 0;
  
  if (recentFixes.length > 0) {
    const recentCount = recentFixes.filter((fix) => {
      const fixDate = new Date(fix.date || lastFixDate || 0);
      return fixDate >= thirtyDaysAgo;
    }).length;
    
    // Score: 1 fix = 0.2, 2 fixes = 0.4, 3+ fixes = 1.0
    score = Math.min(recentCount * 0.33, 1.0);
  } else if (lastFixDate) {
    const fixDate = new Date(lastFixDate);
    if (fixDate >= thirtyDaysAgo) {
      score = 0.2; // One fix in last 30 days
    }
  }
  
  return Math.max(0, Math.min(1, score));
}

function calculateActivityScore(agentStatus) {
  const lastUpdated = new Date(agentStatus.lastUpdated || 0);
  const now = new Date();
  const daysSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60 * 24);
  
  // Score decreases with time since last update
  // 0 days = 1.0, 7 days = 0.5, 30 days = 0.0
  let score = 1.0;
  
  if (daysSinceUpdate > 0) {
    if (daysSinceUpdate <= 7) {
      score = 1.0 - (daysSinceUpdate / 7) * 0.5; // Linear from 1.0 to 0.5
    } else if (daysSinceUpdate <= 30) {
      score = 0.5 - ((daysSinceUpdate - 7) / 23) * 0.5; // Linear from 0.5 to 0.0
    } else {
      score = 0.0;
    }
  }
  
  // Status-based adjustments
  if (agentStatus.status === 'active') {
    score = Math.min(score * 1.1, 1.0); // 10% bonus for active status
  } else if (agentStatus.status === 'error') {
    score = score * 0.5; // 50% penalty for error status
  } else if (agentStatus.status === 'inactive') {
    score = score * 0.7; // 30% penalty for inactive status
  }
  
  return Math.max(0, Math.min(1, score));
}

function calculateOverallScore(agentStatus) {
  const testScore = calculateTestScore(agentStatus);
  const fixesScore = calculateRecentFixesScore(agentStatus);
  const activityScore = calculateActivityScore(agentStatus);
  
  const overallScore =
    testScore * WEIGHTS.tests +
    fixesScore * WEIGHTS.recentFixes +
    activityScore * WEIGHTS.activity;
  
  return {
    overall: Math.round(overallScore * 100) / 100,
    breakdown: {
      tests: Math.round(testScore * 100) / 100,
      recentFixes: Math.round(fixesScore * 100) / 100,
      activity: Math.round(activityScore * 100) / 100,
    },
    weights: WEIGHTS,
  };
}

function generateRecommendations(agentName, score) {
  const recommendations = [];
  
  if (score.breakdown.tests < 0.5) {
    recommendations.push({
      priority: 'high',
      category: 'tests',
      message: 'Improve test coverage and pass rate',
      action: 'Add more tests and fix failing tests',
    });
  }
  
  if (score.breakdown.recentFixes < 0.3) {
    recommendations.push({
      priority: 'medium',
      category: 'fixes',
      message: 'Increase recent fix activity',
      action: 'Address open issues and bugs',
    });
  }
  
  if (score.breakdown.activity < 0.5) {
    recommendations.push({
      priority: 'medium',
      category: 'activity',
      message: 'Improve recent activity',
      action: 'Update agent status and metadata regularly',
    });
  }
  
  if (score.overall < 0.5) {
    recommendations.push({
      priority: 'high',
      category: 'overall',
      message: 'Agent performance is below threshold',
      action: 'Consider refactoring or reviewing agent configuration',
    });
  }
  
  return recommendations;
}

async function readAgentStatusFiles() {
  await ensureDirectory(AGENTS_DIR);
  
  const statusFiles = await glob('**/*_STATUS.json', {
    cwd: AGENTS_DIR,
    absolute: true,
  });
  
  const agents = [];
  
  for (const filePath of statusFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const status = JSON.parse(content);
      const agentName = path.basename(filePath, '_STATUS.json');
      
      agents.push({
        name: agentName,
        status: status.status || 'unknown',
        lastUpdated: status.lastUpdated || new Date().toISOString(),
        metadata: status.metadata || {},
      });
    } catch (error) {
      logger.warn(`Failed to read status file ${filePath}`, error);
    }
  }
  
  return agents;
}

async function main() {
  try {
    logger.info('Starting agent performance evaluation...');
    
    const agents = await readAgentStatusFiles();
    
    if (agents.length === 0) {
      logger.warn('No agent status files found');
      const emptyEvaluation = {
        timestamp: new Date().toISOString(),
        agents: [],
        summary: {
          total: 0,
          averageScore: 0,
        },
      };
      await fs.writeFile(EVALUATION_FILE, JSON.stringify(emptyEvaluation, null, 2), 'utf8');
      return;
    }
    
    const evaluations = [];
    
    for (const agent of agents) {
      const score = calculateOverallScore(agent);
      const recommendations = generateRecommendations(agent.name, score);
      
      evaluations.push({
        name: agent.name,
        status: agent.status,
        score: score.overall,
        breakdown: score.breakdown,
        recommendations,
        lastUpdated: agent.lastUpdated,
      });
    }
    
    // Sort by score (highest first)
    evaluations.sort((a, b) => b.score - a.score);
    
    const averageScore =
      evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;
    
    const evaluation = {
      timestamp: new Date().toISOString(),
      agents: evaluations,
      summary: {
        total: evaluations.length,
        averageScore: Math.round(averageScore * 100) / 100,
        highPerformers: evaluations.filter((e) => e.score >= 0.8).length,
        lowPerformers: evaluations.filter((e) => e.score < 0.5).length,
      },
    };
    
    await fs.writeFile(EVALUATION_FILE, JSON.stringify(evaluation, null, 2), 'utf8');
    
    logger.info(`Evaluation complete. Evaluated ${evaluations.length} agents.`);
    logger.info(`Average score: ${evaluation.summary.averageScore}`);
    logger.info(`Low performers: ${evaluation.summary.lowPerformers}`);
  } catch (error) {
    logger.error('Error in evaluate_performance.js', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Fatal error in evaluate_performance.js', error);
  process.exit(1);
});
