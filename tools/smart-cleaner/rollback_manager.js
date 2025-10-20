import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

#!/usr/bin/env node

/**
 * Rollback Manager
 * Manages rollback operations for the Smart Cleaner
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RollbackManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.rollbackDir = path.join(projectRoot, '.smart-cleaner-backups');
    this.rollbackDataFile = path.join(__dirname, '.rollback-data.json');
  }

  async createRollbackPoint(description = 'Smart Cleaner Rollback Point') {
    console.log('💾 Creating rollback point...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rollbackPoint = {
      id: `rollback_${timestamp}`,
      description,
      timestamp: new Date().toISOString(),
      projectRoot: this.projectRoot,
      gitCommit: this.getCurrentGitCommit(),
      files: await this.snapshotFiles(),
      operations: []
    };
    
    // Save rollback point
    const rollbackPath = path.join(this.rollbackDir, `${rollbackPoint.id}.json`);
    fs.mkdirSync(path.dirname(rollbackPath), { recursive: true });
    fs.writeFileSync(rollbackPath, JSON.stringify(rollbackPoint, null, 2));
    
    console.log(`✅ Rollback point created: ${rollbackPoint.id}`);
    return rollbackPoint;
  }

  async snapshotFiles() {
    console.log('  📸 Snapshotting files...');
    
    const files = [];
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx,json,css}',
      'app/**/*.{ts,tsx,js,jsx,json,css}',
      'pages/**/*.{ts,tsx,js,jsx,json,css}',
      'components/**/*.{ts,tsx,js,jsx,json,css}',
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'next.config.ts'
    ];

    for (const pattern of patterns) {
      const matches = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of matches) {
        const filePath = path.join(this.projectRoot, file);
        
        try {
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          
          files.push({
            path: file,
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
            content: content,
            hash: this.hashContent(content)
          });
        } catch (error) {
          console.warn(`Warning: Could not snapshot ${file}:`, error.message);
        }
      }
    }
    
    return files;
  }

  hashContent(content) {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  getCurrentGitCommit() {
    try {
      return execSync('git rev-parse HEAD', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim();
    } catch (error) {
      return null;
    }
  }

  async addOperation(operation) {
    console.log('  📝 Adding operation to rollback data...');
    
    const rollbackData = await this.loadRollbackData();
    
    if (!rollbackData) {
      console.error('❌ No rollback data found');
      return false;
    }
    
    rollbackData.operations.push({
      ...operation,
      timestamp: new Date().toISOString()
    });
    
    await this.saveRollbackData(rollbackData);
    return true;
  }

  async loadRollbackData() {
    if (!fs.existsSync(this.rollbackDataFile)) {
      return null;
    }
    
    try {
      return JSON.parse(fs.readFileSync(this.rollbackDataFile, 'utf8'));
    } catch (error) {
      console.error('Error loading rollback data:', error.message);
      return null;
    }
  }

  async saveRollbackData(rollbackData) {
    fs.writeFileSync(this.rollbackDataFile, JSON.stringify(rollbackData, null, 2));
  }

  async rollback(rollbackId = null) {
    console.log('🔄 Starting rollback...');
    
    let rollbackData;
    
    if (rollbackId) {
      // Load specific rollback point
      const rollbackPath = path.join(this.rollbackDir, `${rollbackId}.json`);
      
      if (!fs.existsSync(rollbackPath)) {
        console.error(`❌ Rollback point not found: ${rollbackId}`);
        return false;
      }
      
      rollbackData = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
    } else {
      // Load current rollback data
      rollbackData = await this.loadRollbackData();
      
      if (!rollbackData) {
        console.error('❌ No rollback data found');
        return false;
      }
    }
    
    try {
      // Restore files
      await this.restoreFiles(rollbackData.files);
      
      // Restore git state if available
      if (rollbackData.gitCommit) {
        await this.restoreGitState(rollbackData.gitCommit);
      }
      
      console.log('✅ Rollback completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      return false;
    }
  }

  async restoreFiles(files) {
    console.log('  📁 Restoring files...');
    
    for (const file of files) {
      const filePath = path.join(this.projectRoot, file.path);
      
      try {
        // Create directory if it doesn't exist
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        
        // Write file content
        fs.writeFileSync(filePath, file.content);
        console.log(`    ✅ Restored: ${file.path}`);
      } catch (error) {
        console.error(`    ❌ Failed to restore ${file.path}:`, error.message);
      }
    }
  }

  async restoreGitState(commitHash) {
    console.log('  🔄 Restoring git state...');
    
    try {
      execSync(`git reset --hard ${commitHash}`, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      console.log(`    ✅ Git state restored to ${commitHash}`);
    } catch (error) {
      console.error('    ❌ Failed to restore git state:', error.message);
    }
  }

  async listRollbackPoints() {
    console.log('📋 Available rollback points:');
    
    if (!fs.existsSync(this.rollbackDir)) {
      console.log('  No rollback points found');
      return [];
    }
    
    const files = fs.readdirSync(this.rollbackDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(this.rollbackDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return {
          id: data.id,
          description: data.description,
          timestamp: data.timestamp,
          operations: data.operations.length
        };
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    for (const point of files) {
      console.log(`  • ${point.id}`);
      console.log(`    Description: ${point.description}`);
      console.log(`    Created: ${point.timestamp}`);
      console.log(`    Operations: ${point.operations}`);
      console.log('');
    }
    
    return files;
  }

  async cleanupOldRollbackPoints(keepCount = 5) {
    console.log(`🧹 Cleaning up old rollback points (keeping ${keepCount} most recent)...`);
    
    const rollbackPoints = await this.listRollbackPoints();
    
    if (rollbackPoints.length <= keepCount) {
      console.log('  No cleanup needed');
      return;
    }
    
    const toDelete = rollbackPoints.slice(keepCount);
    
    for (const point of toDelete) {
      const filePath = path.join(this.rollbackDir, `${point.id}.json`);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`  🗑️  Deleted: ${point.id}`);
      }
    }
    
    console.log(`✅ Cleaned up ${toDelete.length} old rollback points`);
  }

  async validateRollbackPoint(rollbackId) {
    console.log(`🔍 Validating rollback point: ${rollbackId}`);
    
    const rollbackPath = path.join(this.rollbackDir, `${rollbackId}.json`);
    
    if (!fs.existsSync(rollbackPath)) {
      console.error(`❌ Rollback point not found: ${rollbackId}`);
      return false;
    }
    
    try {
      const rollbackData = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
      
      // Validate structure
      const requiredFields = ['id', 'timestamp', 'files', 'operations'];
      for (const field of requiredFields) {
        if (!rollbackData[field]) {
          console.error(`❌ Missing required field: ${field}`);
          return false;
        }
      }
      
      // Validate files
      let validFiles = 0;
      for (const file of rollbackData.files) {
        if (file.path && file.content && file.hash) {
          validFiles++;
        }
      }
      
      console.log(`✅ Rollback point is valid`);
      console.log(`  Files: ${validFiles}/${rollbackData.files.length}`);
      console.log(`  Operations: ${rollbackData.operations.length}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Invalid rollback point: ${error.message}`);
      return false;
    }
  }

  async getRollbackStats() {
    console.log('📊 Rollback Statistics:');
    
    const rollbackPoints = await this.listRollbackPoints();
    
    if (rollbackPoints.length === 0) {
      console.log('  No rollback points found');
      return;
    }
    
    const totalOperations = rollbackPoints.reduce((sum, point) => sum + point.operations, 0);
    const avgOperations = Math.round(totalOperations / rollbackPoints.length);
    
    console.log(`  Total rollback points: ${rollbackPoints.length}`);
    console.log(`  Total operations: ${totalOperations}`);
    console.log(`  Average operations per point: ${avgOperations}`);
    
    // Show recent activity
    const recent = rollbackPoints.slice(0, 3);
    console.log('\n  Recent rollback points:');
    for (const point of recent) {
      console.log(`    • ${point.id} (${point.operations} operations)`);
    }
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const action = process.argv[3] || 'list';
  const manager = new RollbackManager(projectRoot);
  
  switch (action) {
    case 'create':
      const description = process.argv[4] || 'Manual rollback point';
      manager.createRollbackPoint(description);
      break;
    case 'list':
      manager.listRollbackPoints();
      break;
    case 'rollback':
      const rollbackId = process.argv[4];
      manager.rollback(rollbackId);
      break;
    case 'cleanup':
      const keepCount = parseInt(process.argv[4]) || 5;
      manager.cleanupOldRollbackPoints(keepCount);
      break;
    case 'validate':
      const validateId = process.argv[4];
      if (!validateId) {
        console.error('Please specify rollback point ID to validate');
        process.exit(1);
      }
      manager.validateRollbackPoint(validateId);
      break;
    case 'stats':
      manager.getRollbackStats();
      break;
    default:
      console.log('Usage: node rollback_manager.js [create|list|rollback|cleanup|validate|stats] [options]');
      process.exit(1);
  }
}

export default RollbackManager;
