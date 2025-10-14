#!/usr/bin/env node
// file-cleanup-advanced.js
// Advanced file cleanup and management system with retry mechanisms
// Handles temp files, log rotation, archiving, and file indexing

const fs = require('fs').promises;
const path = require('path');
const winston = require('winston');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/file-cleanup.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class AdvancedFileCleanup {
  constructor() {
    this.config = {
      retentionDays: parseInt(process.env.CLEANUP_RETENTION_DAYS) || 7,
      tempDirs: ['/workspace/temp', '/workspace/logs', './temp', './logs'],
      archiveDir: './archives',
      maxRetries: 3,
      retryDelay: 5000,
      batchSize: 100,
      indexFile: './temp/file-index.json'
    };
    this.stats = {
      filesProcessed: 0,
      filesDeleted: 0,
      filesArchived: 0,
      errors: 0,
      lastRun: null,
      totalSizeFreed: 0
    };
    this.fileIndex = new Map();
    this.isRunning = false;
  }

  async start() {
    logger.info('🧹 Starting Advanced File Cleanup System...');
    this.isRunning = true;
    
    try {
      // Initialize directories
      await this.initializeDirectories();
      
      // Load existing file index
      await this.loadFileIndex();
      
      // Schedule cleanup tasks
      this.scheduleCleanupTasks();
      
      // Start monitoring
      this.startFileMonitoring();
      
      logger.info('✅ Advanced File Cleanup System started successfully');
      
      // Keep process alive
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());
      
    } catch (error) {
      logger.error('❌ Failed to start File Cleanup System:', error);
      process.exit(1);
    }
  }

  async initializeDirectories() {
    logger.info('📁 Initializing directories...');
    
    const dirs = [
      this.config.archiveDir,
      './logs',
      './temp',
      './archives/logs',
      './archives/temp'
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        logger.info(`✅ Created directory: ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          logger.error(`❌ Failed to create directory ${dir}:`, error);
        }
      }
    }
  }

  async loadFileIndex() {
    try {
      const indexData = await fs.readFile(this.config.indexFile, 'utf8');
      const index = JSON.parse(indexData);
      this.fileIndex = new Map(Object.entries(index));
      logger.info(`📋 Loaded file index with ${this.fileIndex.size} entries`);
    } catch (error) {
      logger.info('📋 No existing file index found, starting fresh');
      this.fileIndex = new Map();
    }
  }

  async saveFileIndex() {
    try {
      const indexData = Object.fromEntries(this.fileIndex);
      await fs.writeFile(this.config.indexFile, JSON.stringify(indexData, null, 2));
      logger.info(`💾 Saved file index with ${this.fileIndex.size} entries`);
    } catch (error) {
      logger.error('❌ Failed to save file index:', error);
    }
  }

  scheduleCleanupTasks() {
    logger.info('⏰ Scheduling cleanup tasks...');
    
    // Daily cleanup at 2 AM
    cron.schedule('0 2 * * *', async () => {
      logger.info('🌙 Starting scheduled daily cleanup...');
      await this.performFullCleanup();
    });

    // Hourly temp file cleanup
    cron.schedule('0 * * * *', async () => {
      logger.info('🕐 Starting hourly temp cleanup...');
      await this.performTempCleanup();
    });

    // Weekly archive cleanup
    cron.schedule('0 3 * * 0', async () => {
      logger.info('📦 Starting weekly archive cleanup...');
      await this.performArchiveCleanup();
    });

    // Every 5 minutes - update file index
    cron.schedule('*/5 * * * *', async () => {
      await this.updateFileIndex();
    });
  }

  async performFullCleanup() {
    logger.info('🧹 Starting full cleanup...');
    this.stats.lastRun = new Date();
    
    try {
      // Clean temp directories
      await this.cleanupDirectory('./temp', true);
      await this.cleanupDirectory('./logs', false);
      
      // Archive important logs
      await this.archiveImportantLogs();
      
      // Update file index
      await this.updateFileIndex();
      
      // Save statistics
      await this.saveStatistics();
      
      logger.info('✅ Full cleanup completed successfully');
      
    } catch (error) {
      logger.error('❌ Full cleanup failed:', error);
      this.stats.errors++;
    }
  }

  async performTempCleanup() {
    logger.info('🗑️ Starting temp cleanup...');
    
    try {
      await this.cleanupDirectory('./temp', true);
      logger.info('✅ Temp cleanup completed');
    } catch (error) {
      logger.error('❌ Temp cleanup failed:', error);
      this.stats.errors++;
    }
  }

  async performArchiveCleanup() {
    logger.info('📦 Starting archive cleanup...');
    
    try {
      const archiveDir = this.config.archiveDir;
      const files = await fs.readdir(archiveDir);
      
      for (const file of files) {
        const filePath = path.join(archiveDir, file);
        const stats = await fs.stat(filePath);
        
        // Delete archives older than 30 days
        const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (ageInDays > 30) {
          await this.deleteFile(filePath);
          logger.info(`🗑️ Deleted old archive: ${file}`);
        }
      }
      
      logger.info('✅ Archive cleanup completed');
    } catch (error) {
      logger.error('❌ Archive cleanup failed:', error);
      this.stats.errors++;
    }
  }

  async cleanupDirectory(dirPath, isTempDir = false) {
    try {
      const files = await fs.readdir(dirPath);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
      
      let processed = 0;
      let deleted = 0;
      let archived = 0;
      let sizeFreed = 0;
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          if (stats.isDirectory()) {
            // Recursively clean subdirectories
            await this.cleanupDirectory(filePath, isTempDir);
            continue;
          }
          
          processed++;
          this.stats.filesProcessed++;
          
          // Check if file is older than retention period
          if (stats.mtime < cutoffDate) {
            const fileSize = stats.size;
            
            if (isTempDir) {
              // Delete temp files directly
              await this.deleteFile(filePath);
              deleted++;
              sizeFreed += fileSize;
            } else {
              // Archive important files before deletion
              const shouldArchive = this.shouldArchiveFile(filePath, stats);
              
              if (shouldArchive) {
                await this.archiveFile(filePath);
                archived++;
              }
              
              await this.deleteFile(filePath);
              deleted++;
              sizeFreed += fileSize;
            }
            
            logger.info(`🗑️ Cleaned file: ${file} (${this.formatBytes(fileSize)})`);
          }
          
          // Update file index
          this.fileIndex.set(filePath, {
            path: filePath,
            size: stats.size,
            mtime: stats.mtime,
            lastChecked: new Date()
          });
          
        } catch (error) {
          logger.error(`❌ Error processing file ${filePath}:`, error);
          this.stats.errors++;
        }
      }
      
      this.stats.filesDeleted += deleted;
      this.stats.filesArchived += archived;
      this.stats.totalSizeFreed += sizeFreed;
      
      logger.info(`📊 Directory ${dirPath}: ${processed} processed, ${deleted} deleted, ${archived} archived, ${this.formatBytes(sizeFreed)} freed`);
      
    } catch (error) {
      logger.error(`❌ Error cleaning directory ${dirPath}:`, error);
      this.stats.errors++;
    }
  }

  shouldArchiveFile(filePath, stats) {
    // Archive important log files and configuration files
    const importantExtensions = ['.log', '.json', '.sql', '.md', '.txt'];
    const importantPatterns = ['error', 'access', 'audit', 'config'];
    
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath).toLowerCase();
    
    return importantExtensions.includes(ext) || 
           importantPatterns.some(pattern => fileName.includes(pattern));
  }

  async archiveFile(filePath) {
    try {
      const fileName = path.basename(filePath);
      const timestamp = new Date().toISOString().split('T')[0];
      const archiveFileName = `${timestamp}_${fileName}`;
      const archivePath = path.join(this.config.archiveDir, archiveFileName);
      
      await fs.copyFile(filePath, archivePath);
      logger.info(`📦 Archived file: ${fileName} -> ${archiveFileName}`);
      
    } catch (error) {
      logger.error(`❌ Failed to archive file ${filePath}:`, error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    let retries = 0;
    
    while (retries < this.config.maxRetries) {
      try {
        await fs.unlink(filePath);
        this.fileIndex.delete(filePath);
        return;
      } catch (error) {
        retries++;
        if (retries >= this.config.maxRetries) {
          logger.error(`❌ Failed to delete file ${filePath} after ${this.config.maxRetries} retries:`, error);
          throw error;
        }
        
        logger.warn(`⚠️ Retry ${retries}/${this.config.maxRetries} for deleting ${filePath}`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
      }
    }
  }

  async updateFileIndex() {
    try {
      const directories = ['./temp', './logs', './scripts', './src'];
      let indexed = 0;
      
      for (const dir of directories) {
        try {
          await this.indexDirectory(dir);
          indexed++;
        } catch (error) {
          logger.error(`❌ Failed to index directory ${dir}:`, error);
        }
      }
      
      await this.saveFileIndex();
      logger.info(`📋 Updated file index: ${indexed} directories indexed`);
      
    } catch (error) {
      logger.error('❌ Failed to update file index:', error);
    }
  }

  async indexDirectory(dirPath) {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        
        if (file.isDirectory()) {
          await this.indexDirectory(filePath);
        } else {
          try {
            const stats = await fs.stat(filePath);
            this.fileIndex.set(filePath, {
              path: filePath,
              size: stats.size,
              mtime: stats.mtime,
              lastChecked: new Date()
            });
          } catch (error) {
            // Skip files that can't be accessed
          }
        }
      }
    } catch (error) {
      // Directory might not exist or be accessible
    }
  }

  async archiveImportantLogs() {
    logger.info('📦 Archiving important logs...');
    
    try {
      const logDir = './logs';
      const files = await fs.readdir(logDir);
      
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = await fs.stat(filePath);
        
        // Archive logs older than 3 days
        const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (ageInDays > 3 && stats.size > 0) {
          await this.archiveFile(filePath);
        }
      }
      
      logger.info('✅ Important logs archived');
    } catch (error) {
      logger.error('❌ Failed to archive important logs:', error);
    }
  }

  startFileMonitoring() {
    logger.info('👁️ Starting file monitoring...');
    
    // Monitor for new files in temp directories
    setInterval(async () => {
      try {
        await this.monitorTempFiles();
      } catch (error) {
        logger.error('❌ File monitoring error:', error);
      }
    }, 300000); // Every 5 minutes
  }

  async monitorTempFiles() {
    const tempDirs = ['./temp', './logs'];
    
    for (const dir of tempDirs) {
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          
          // Check if file is growing rapidly (potential issue)
          if (stats.size > 100 * 1024 * 1024) { // 100MB
            logger.warn(`⚠️ Large file detected: ${filePath} (${this.formatBytes(stats.size)})`);
          }
        }
      } catch (error) {
        // Directory might not exist
      }
    }
  }

  async saveStatistics() {
    try {
      const statsData = {
        ...this.stats,
        timestamp: new Date().toISOString(),
        fileIndexSize: this.fileIndex.size
      };
      
      await fs.writeFile('./logs/cleanup-stats.json', JSON.stringify(statsData, null, 2));
      
      // Store in Supabase
      await supabase
        .from('system_metrics')
        .insert({
          service_name: 'file-cleanup',
          metrics: statsData,
          timestamp: new Date().toISOString()
        });
      
      logger.info('📊 Statistics saved');
    } catch (error) {
      logger.error('❌ Failed to save statistics:', error);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async shutdown() {
    logger.info('🛑 Shutting down File Cleanup System...');
    this.isRunning = false;
    
    // Save final statistics
    await this.saveStatistics();
    await this.saveFileIndex();
    
    logger.info('✅ File Cleanup System shutdown complete');
    process.exit(0);
  }

  // Public API
  getStats() {
    return {
      ...this.stats,
      fileIndexSize: this.fileIndex.size,
      isRunning: this.isRunning
    };
  }

  async forceCleanup() {
    logger.info('🧹 Force cleanup requested...');
    await this.performFullCleanup();
  }
}

// Start the cleanup system if this file is run directly
if (require.main === module) {
  const cleanup = new AdvancedFileCleanup();
  cleanup.start().catch(error => {
    logger.error('❌ Failed to start cleanup system:', error);
    process.exit(1);
  });
}

module.exports = AdvancedFileCleanup;
