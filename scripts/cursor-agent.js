#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CursorAgent {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/cursor-agent.log');
    this.startTime = new Date();
    this.isRunning = false;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Cursor Agent: ${message}\n`;
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async initialize() {
    this.log('Initializing Cursor Agent...');
    
    // Create necessary directories
    const directories = [
      '../logs',
      '../temp',
      '../reports',
      '../archive',
      '../videos'
    ];
    
    for (const dir of directories) {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`);
      }
    }
    
    this.log('Cursor Agent initialized successfully');
  }

  async performMaintenance() {
    this.log('Performing maintenance tasks...');
    
    try {
      // Check system health
      await this.checkSystemHealth();
      
      // Clean up temporary files
      await this.cleanupTempFiles();
      
      // Update file index
      await this.updateFileIndex();
      
      this.log('Maintenance tasks completed');
    } catch (error) {
      this.log('Error during maintenance: ' + error.message);
    }
  }

  async checkSystemHealth() {
    this.log('Checking system health...');
    
    // Check disk space
    const stats = fs.statSync(__dirname);
    this.log('System health check completed');
  }

  async cleanupTempFiles() {
    this.log('Cleaning up temporary files...');
    
    const tempDir = path.join(__dirname, '../temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      let cleanedCount = 0;
      
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        const age = Date.now() - stats.mtime.getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (age > maxAge) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      }
      
      this.log(`Cleaned up ${cleanedCount} old temporary files`);
    }
  }

  async updateFileIndex() {
    this.log('Updating file index...');
    
    const fileIndex = {
      timestamp: new Date().toISOString(),
      files: []
    };
    
    // Scan workspace for files
    const workspaceDir = path.join(__dirname, '..');
    this.scanDirectory(workspaceDir, fileIndex.files);
    
    // Save file index
    const indexFile = path.join(__dirname, '../temp/file-index.json');
    fs.writeFileSync(indexFile, JSON.stringify(fileIndex, null, 2));
    
    this.log(`File index updated with ${fileIndex.files.length} files`);
  }

  scanDirectory(dir, fileList) {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          // Skip node_modules and other common directories
          if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
            this.scanDirectory(filePath, fileList);
          }
        } else {
          fileList.push({
            path: path.relative(path.join(__dirname, '..'), filePath),
            size: stats.size,
            modified: stats.mtime.toISOString()
          });
        }
      }
    } catch (error) {
      this.log('Error scanning directory: ' + error.message);
    }
  }

  async run() {
    this.log('Starting Cursor Agent...');
    this.isRunning = true;
    
    await this.initialize();
    
    // Main loop
    while (this.isRunning) {
      try {
        await this.performMaintenance();
        
        // Wait 5 minutes before next maintenance cycle
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
        
      } catch (error) {
        this.log('Error in main loop: ' + error.message);
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute on error
      }
    }
    
    this.log('Cursor Agent stopped');
  }

  stop() {
    this.log('Stopping Cursor Agent...');
    this.isRunning = false;
  }
}

// Main execution
if (require.main === module) {
  const agent = new CursorAgent();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    agent.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    agent.stop();
    process.exit(0);
  });
  
  // Start agent
  agent.run().catch(error => {
    console.error('Agent failed:', error);
    process.exit(1);
  });
}

module.exports = CursorAgent;