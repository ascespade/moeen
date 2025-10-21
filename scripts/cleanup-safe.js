#!/usr/bin/env node

/**
 * Safe Cleanup Script for NextJS Project
 * Performs safe cleanup operations without breaking the project
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SafeCleanup {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.cleanupStats = {
      filesRemoved: 0,
      directoriesRemoved: 0,
      bytesFreed: 0,
      errors: []
    };
  }

  async run() {
    console.log('🧽 Starting Safe Cleanup Process...\n');

    try {
      // Clean up build artifacts
      await this.cleanBuildArtifacts();
      
      // Clean up temporary files
      await this.cleanTempFiles();
      
      // Clean up logs
      await this.cleanLogs();
      
      // Clean up cache
      await this.cleanCache();
      
      // Clean up node_modules/.cache
      await this.cleanNodeModulesCache();
      
      // Clean up test artifacts
      await this.cleanTestArtifacts();
      
      // Clean up old backups
      await this.cleanOldBackups();

      console.log('\n✅ Safe Cleanup Completed Successfully!');
      console.log(`📊 Cleanup Statistics:`);
      console.log(`   • Files removed: ${this.cleanupStats.filesRemoved}`);
      console.log(`   • Directories removed: ${this.cleanupStats.directoriesRemoved}`);
      console.log(`   • Space freed: ${this.formatBytes(this.cleanupStats.bytesFreed)}`);
      
      if (this.cleanupStats.errors.length > 0) {
        console.log(`   • Errors encountered: ${this.cleanupStats.errors.length}`);
        this.cleanupStats.errors.forEach(error => {
          console.log(`     - ${error}`);
        });
      }

    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      process.exit(1);
    }
  }

  async cleanBuildArtifacts() {
    console.log('   🏗️  Cleaning build artifacts...');
    
    const buildDirs = [
      '.next',
      'out',
      'dist',
      'build'
    ];

    for (const dir of buildDirs) {
      await this.removeDirectory(path.join(this.projectRoot, dir));
    }
  }

  async cleanTempFiles() {
    console.log('   🗂️  Cleaning temporary files...');
    
    const tempPatterns = [
      '**/*.tmp',
      '**/*.temp',
      '**/.DS_Store',
      '**/Thumbs.db',
      '**/*.log.tmp'
    ];

    // Clean common temp files
    const tempFiles = [
      '.env.local.tmp',
      'temp-*.json',
      '*.swp',
      '*.swo',
      '*~'
    ];

    for (const pattern of tempFiles) {
      await this.removeFilesByPattern(pattern);
    }
  }

  async cleanLogs() {
    console.log('   📝 Cleaning log files...');
    
    const logDirs = [
      'logs',
      'log',
      '*.log'
    ];

    for (const dir of logDirs) {
      if (dir.includes('*')) {
        await this.removeFilesByPattern(dir);
      } else {
        await this.removeDirectory(path.join(this.projectRoot, dir));
      }
    }
  }

  async cleanCache() {
    console.log('   💾 Cleaning cache directories...');
    
    const cacheDirs = [
      '.cache',
      'cache',
      '.turbo',
      '.swc',
      'node_modules/.cache'
    ];

    for (const dir of cacheDirs) {
      await this.removeDirectory(path.join(this.projectRoot, dir));
    }
  }

  async cleanNodeModulesCache() {
    console.log('   📦 Cleaning node_modules cache...');
    
    const nodeModulesCache = path.join(this.projectRoot, 'node_modules', '.cache');
    await this.removeDirectory(nodeModulesCache);
  }

  async cleanTestArtifacts() {
    console.log('   🧪 Cleaning test artifacts...');
    
    const testDirs = [
      'test-results',
      'playwright-report',
      'coverage',
      '.nyc_output',
      'junit.xml',
      'test-results.xml'
    ];

    for (const dir of testDirs) {
      await this.removeDirectory(path.join(this.projectRoot, dir));
    }
  }

  async cleanOldBackups() {
    console.log('   💾 Cleaning old backups...');
    
    const backupDir = path.join(this.projectRoot, 'backups');
    
    try {
      const stats = await fs.stat(backupDir);
      if (stats.isDirectory()) {
        const files = await fs.readdir(backupDir);
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        for (const file of files) {
          const filePath = path.join(backupDir, file);
          const fileStats = await fs.stat(filePath);
          
          if (now - fileStats.mtime.getTime() > maxAge) {
            await this.removeFile(filePath);
          }
        }
      }
    } catch (error) {
      // Backup directory doesn't exist or can't be accessed
      console.log('     ℹ️  No backup directory found or accessible');
    }
  }

  async removeDirectory(dirPath) {
    try {
      const stats = await fs.stat(dirPath);
      if (stats.isDirectory()) {
        await fs.rm(dirPath, { recursive: true, force: true });
        this.cleanupStats.directoriesRemoved++;
        console.log(`     ✅ Removed directory: ${path.basename(dirPath)}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.cleanupStats.errors.push(`Failed to remove directory ${dirPath}: ${error.message}`);
      }
    }
  }

  async removeFile(filePath) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        await fs.unlink(filePath);
        this.cleanupStats.filesRemoved++;
        this.cleanupStats.bytesFreed += stats.size;
        console.log(`     ✅ Removed file: ${path.basename(filePath)}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.cleanupStats.errors.push(`Failed to remove file ${filePath}: ${error.message}`);
      }
    }
  }

  async removeFilesByPattern(pattern) {
    // This is a simplified implementation
    // In a real scenario, you might want to use glob patterns
    try {
      const files = await this.findFilesByPattern(pattern);
      for (const file of files) {
        await this.removeFile(file);
      }
    } catch (error) {
      // Pattern matching failed, continue
    }
  }

  async findFilesByPattern(pattern) {
    // Simplified pattern matching - in production, use a proper glob library
    const files = [];
    
    try {
      const walkDir = async (dir) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await walkDir(fullPath);
          } else if (entry.isFile()) {
            // Simple pattern matching
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              if (regex.test(entry.name)) {
                files.push(fullPath);
              }
            } else if (entry.name === pattern) {
              files.push(fullPath);
            }
          }
        }
      };
      
      await walkDir(this.projectRoot);
    } catch (error) {
      // Directory walk failed
    }
    
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the cleanup
const cleanup = new SafeCleanup();
cleanup.run().catch(console.error);
