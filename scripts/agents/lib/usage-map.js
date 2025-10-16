const fs = require("fs").promises;
const path = require("path");

class UsageMapManager {
  constructor(usageMapPath = "src/.shared_quarantine/usage-map.json") {
    this.usageMapPath = usageMapPath;
  }

  /**
   * Read the current usage map
   */
  async read() {
    try {
      const data = await fs.readFile(this.usageMapPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        // Return default structure if file doesn't exist
        return {
          agentUpdates: {},
          fileReferences: {},
          lastUpdated: null,
          version: "1.0.0",
        };
      }
      throw error;
    }
  }

  /**
   * Write the usage map
   */
  async write(usageMap) {
    usageMap.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.usageMapPath, JSON.stringify(usageMap, null, 2));
  }

  /**
   * Update agent status in usage map
   */
  async updateAgentStatus(agentName, status, movedFiles = []) {
    const usageMap = await this.read();

    usageMap.agentUpdates[agentName] = {
      lastRun: new Date().toISOString(),
      status,
      movedFiles,
      pid: process.pid,
    };

    await this.write(usageMap);
    return usageMap;
  }

  /**
   * Check if a file is referenced by other agents
   */
  async isFileReferencedByOtherAgents(
    filePath,
    currentAgent = "FrontendCleaner",
  ) {
    const usageMap = await this.read();

    // Check fileReferences for the specific file
    if (usageMap.fileReferences[filePath]) {
      const references = usageMap.fileReferences[filePath];
      return references.some((ref) => ref.agent !== currentAgent);
    }

    // Check if any other agent has this file in their movedFiles
    for (const [agentName, agentData] of Object.entries(
      usageMap.agentUpdates,
    )) {
      if (agentName !== currentAgent && agentData.movedFiles) {
        if (agentData.movedFiles.includes(filePath)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Add file reference for an agent
   */
  async addFileReference(filePath, agentName, status = "candidate") {
    const usageMap = await this.read();

    if (!usageMap.fileReferences[filePath]) {
      usageMap.fileReferences[filePath] = [];
    }

    // Check if reference already exists
    const existingRef = usageMap.fileReferences[filePath].find(
      (ref) => ref.agent === agentName,
    );
    if (existingRef) {
      existingRef.status = status;
      existingRef.timestamp = new Date().toISOString();
    } else {
      usageMap.fileReferences[filePath].push({
        agent: agentName,
        status,
        timestamp: new Date().toISOString(),
      });
    }

    await this.write(usageMap);
  }

  /**
   * Remove file reference
   */
  async removeFileReference(filePath, agentName) {
    const usageMap = await this.read();

    if (usageMap.fileReferences[filePath]) {
      usageMap.fileReferences[filePath] = usageMap.fileReferences[
        filePath
      ].filter((ref) => ref.agent !== agentName);

      // Clean up empty file references
      if (usageMap.fileReferences[filePath].length === 0) {
        delete usageMap.fileReferences[filePath];
      }
    }

    await this.write(usageMap);
  }

  /**
   * Get conflicts for a list of files
   */
  async getConflicts(files, currentAgent = "FrontendCleaner") {
    const conflicts = [];

    for (const file of files) {
      const isReferenced = await this.isFileReferencedByOtherAgents(
        file,
        currentAgent,
      );
      if (isReferenced) {
        conflicts.push({
          file,
          reason: "Referenced by other agent",
          agent: currentAgent,
        });
      }
    }

    return conflicts;
  }

  /**
   * Clean up old entries (older than 30 days)
   */
  async cleanup() {
    const usageMap = await this.read();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Clean up old agent updates
    for (const [agentName, agentData] of Object.entries(
      usageMap.agentUpdates,
    )) {
      if (new Date(agentData.lastRun) < thirtyDaysAgo) {
        delete usageMap.agentUpdates[agentName];
      }
    }

    // Clean up old file references
    for (const [filePath, references] of Object.entries(
      usageMap.fileReferences,
    )) {
      const validReferences = references.filter(
        (ref) => new Date(ref.timestamp) > thirtyDaysAgo,
      );

      if (validReferences.length === 0) {
        delete usageMap.fileReferences[filePath];
      } else {
        usageMap.fileReferences[filePath] = validReferences;
      }
    }

    await this.write(usageMap);
  }

  /**
   * Get agent statistics
   */
  async getAgentStats() {
    const usageMap = await this.read();
    const stats = {};

    for (const [agentName, agentData] of Object.entries(
      usageMap.agentUpdates,
    )) {
      stats[agentName] = {
        lastRun: agentData.lastRun,
        status: agentData.status,
        filesMoved: agentData.movedFiles ? agentData.movedFiles.length : 0,
        pid: agentData.pid,
      };
    }

    return stats;
  }
}

module.exports = UsageMapManager;
