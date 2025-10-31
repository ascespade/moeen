/**
 * Read all agent status files from agents/ directory
 * Output consolidated JSON with agent names and metadata
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

async function readAllAgentStatus() {
  try {
    // Check if agents directory exists
    try {
      await fs.access(AGENTS_DIR);
    } catch {
      logger.warn(`Agents directory does not exist: ${AGENTS_DIR}`);
      return {
        timestamp: new Date().toISOString(),
        agents: [],
        total: 0,
      };
    }
    
    // Find all status files
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
          lastUpdated: status.lastUpdated || null,
          metadata: status.metadata || {},
          file: path.relative(process.cwd(), filePath),
        });
        
        logger.debug(`Read status for agent: ${agentName}`);
      } catch (error) {
        logger.warn(`Failed to read status file ${filePath}`, error);
      }
    }
    
    const consolidated = {
      timestamp: new Date().toISOString(),
      agents: agents,
      total: agents.length,
      summary: {
        active: agents.filter((a) => a.status === 'active').length,
        inactive: agents.filter((a) => a.status === 'inactive').length,
        error: agents.filter((a) => a.status === 'error').length,
        unknown: agents.filter((a) => a.status === 'unknown').length,
      },
    };
    
    return consolidated;
  } catch (error) {
    logger.error('Error reading agent status files', error);
    throw error;
  }
}

async function main() {
  try {
    const consolidated = await readAllAgentStatus();
    
    // Output as JSON to stdout
    console.log(JSON.stringify(consolidated, null, 2));
    
    logger.info(`Read ${consolidated.total} agent status files`);
  } catch (error) {
    logger.error('Fatal error in read_all_status.js', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Fatal error in read_all_status.js', error);
  process.exit(1);
});
