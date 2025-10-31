/**
 * Update agent status by reading status files from agents/ directory
 * Aggregates status into AGENT_STATUS.json and appends to PROJECT_LOG.md
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
const STATUS_FILE = path.resolve(__dirname, '..', 'AGENT_STATUS.json');
const PROJECT_LOG = path.resolve(__dirname, '..', 'PROJECT_LOG.md');

async function ensureDirectory(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
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
        file: filePath,
      });
      
      logger.debug(`Read status for agent: ${agentName}`);
    } catch (error) {
      logger.warn(`Failed to read status file ${filePath}`, error);
    }
  }
  
  return agents;
}

async function updateAgentStatusFile(agents) {
  const aggregatedStatus = {
    lastUpdated: new Date().toISOString(),
    totalAgents: agents.length,
    agents: agents.map((agent) => ({
      name: agent.name,
      status: agent.status,
      lastUpdated: agent.lastUpdated,
      metadata: agent.metadata,
    })),
    summary: {
      active: agents.filter((a) => a.status === 'active').length,
      inactive: agents.filter((a) => a.status === 'inactive').length,
      error: agents.filter((a) => a.status === 'error').length,
      unknown: agents.filter((a) => a.status === 'unknown').length,
    },
  };
  
  await fs.writeFile(STATUS_FILE, JSON.stringify(aggregatedStatus, null, 2), 'utf8');
  logger.info(`Updated ${STATUS_FILE}`);
  
  return aggregatedStatus;
}

async function appendToProjectLog(agents, aggregatedStatus) {
  const timestamp = new Date().toISOString();
  const logEntry = `## Agent Status Update - ${new Date(timestamp).toLocaleString()}

**Summary:**
- Total Agents: ${aggregatedStatus.totalAgents}
- Active: ${aggregatedStatus.summary.active}
- Inactive: ${aggregatedStatus.summary.inactive}
- Error: ${aggregatedStatus.summary.error}
- Unknown: ${aggregatedStatus.summary.unknown}

**Agents:**
${agents
  .map(
    (agent) => `- **${agent.name}**: ${agent.status} (Last Updated: ${agent.lastUpdated})`
  )
  .join('\n')}

---

`;
  
  try {
    // Check if file exists, create if not
    let existingContent = '';
    try {
      existingContent = await fs.readFile(PROJECT_LOG, 'utf8');
    } catch {
      // File doesn't exist, create it with header
      existingContent = `# Project Log

This file contains automated updates and status changes.

---

`;
    }
    
    await fs.writeFile(PROJECT_LOG, logEntry + existingContent, 'utf8');
    logger.info(`Appended entry to ${PROJECT_LOG}`);
  } catch (error) {
    logger.error(`Failed to append to ${PROJECT_LOG}`, error);
  }
}

async function main() {
  try {
    logger.info('Starting agent status update...');
    
    // Read all agent status files
    const agents = await readAgentStatusFiles();
    
    if (agents.length === 0) {
      logger.warn('No agent status files found');
      return;
    }
    
    // Update aggregated status file
    const aggregatedStatus = await updateAgentStatusFile(agents);
    
    // Append to project log
    await appendToProjectLog(agents, aggregatedStatus);
    
    logger.info('Agent status update complete');
  } catch (error) {
    logger.error('Error in update_status.js', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Fatal error in update_status.js', error);
  process.exit(1);
});
