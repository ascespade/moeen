#!/usr/bin/env node

/**
 * CI Learning Database Manager
 * SQLite-based self-learning memory for CI/CD workflows
 * 
 * Features:
 * - Error pattern recognition
 * - Solution tracking
 * - Performance optimization
 * - Self-healing improvements
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class CILearningDB {
  constructor(dbPath = 'ci_memory.sqlite') {
    this.dbPath = dbPath;
    this.db = null;
    this.isInitialized = false;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Error opening database:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to CI Learning Database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = {
      error_logs: `
        CREATE TABLE IF NOT EXISTS error_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workflow TEXT NOT NULL,
          error_message TEXT NOT NULL,
          error_hash TEXT UNIQUE NOT NULL,
          error_type TEXT NOT NULL,
          fix_action TEXT,
          fixed_by TEXT,
          success BOOLEAN DEFAULT 0,
          confidence_score REAL DEFAULT 0.0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          context TEXT,
          stack_trace TEXT,
          retry_count INTEGER DEFAULT 0,
          resolution_time INTEGER DEFAULT 0
        )
      `,
      improvements: `
        CREATE TABLE IF NOT EXISTS improvements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          component TEXT NOT NULL,
          change_description TEXT NOT NULL,
          commit_hash TEXT,
          result TEXT,
          performance_gain REAL DEFAULT 0.0,
          quality_score REAL DEFAULT 0.0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          workflow_run_id TEXT,
          before_state TEXT,
          after_state TEXT
        )
      `,
      patterns: `
        CREATE TABLE IF NOT EXISTS patterns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pattern_type TEXT NOT NULL,
          pattern_data TEXT NOT NULL,
          frequency INTEGER DEFAULT 1,
          success_rate REAL DEFAULT 0.0,
          last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
          confidence REAL DEFAULT 0.0,
          context TEXT
        )
      `,
      solutions: `
        CREATE TABLE IF NOT EXISTS solutions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          error_hash TEXT NOT NULL,
          solution_type TEXT NOT NULL,
          solution_data TEXT NOT NULL,
          success_count INTEGER DEFAULT 0,
          failure_count INTEGER DEFAULT 0,
          average_resolution_time REAL DEFAULT 0.0,
          last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
          confidence REAL DEFAULT 0.0,
          FOREIGN KEY (error_hash) REFERENCES error_logs (error_hash)
        )
      `,
      performance_metrics: `
        CREATE TABLE IF NOT EXISTS performance_metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workflow TEXT NOT NULL,
          metric_name TEXT NOT NULL,
          metric_value REAL NOT NULL,
          unit TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          context TEXT,
          improvement_percentage REAL DEFAULT 0.0
        )
      `,
      learning_sessions: `
        CREATE TABLE IF NOT EXISTS learning_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT UNIQUE NOT NULL,
          start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          end_time DATETIME,
          errors_analyzed INTEGER DEFAULT 0,
          fixes_applied INTEGER DEFAULT 0,
          success_rate REAL DEFAULT 0.0,
          learning_insights TEXT,
          session_data TEXT
        )
      `
    };

    for (const [tableName, sql] of Object.entries(tables)) {
      await this.runQuery(sql);
      console.log(`✅ Created/verified table: ${tableName}`);
    }

    this.isInitialized = true;
    console.log('🎓 CI Learning Database initialized successfully');
  }

  async runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  generateErrorHash(errorMessage, context = '') {
    return crypto.createHash('sha256')
      .update(errorMessage + context)
      .digest('hex')
      .substring(0, 16);
  }

  async logError(errorData) {
    const {
      workflow,
      errorMessage,
      errorType = 'unknown',
      context = '',
      stackTrace = '',
      fixAction = null,
      fixedBy = null
    } = errorData;

    const errorHash = this.generateErrorHash(errorMessage, context);
    
    try {
      // Check if error already exists
      const existing = await this.getQuery(
        'SELECT * FROM error_logs WHERE error_hash = ?',
        [errorHash]
      );

      if (existing.length > 0) {
        // Update existing error
        await this.runQuery(
          `UPDATE error_logs SET 
           retry_count = retry_count + 1,
           last_seen = CURRENT_TIMESTAMP
           WHERE error_hash = ?`,
          [errorHash]
        );
        console.log(`📝 Updated existing error: ${errorHash}`);
      } else {
        // Insert new error
        await this.runQuery(
          `INSERT INTO error_logs 
           (workflow, error_message, error_hash, error_type, context, stack_trace, fix_action, fixed_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [workflow, errorMessage, errorHash, errorType, context, stackTrace, fixAction, fixedBy]
        );
        console.log(`📝 Logged new error: ${errorHash}`);
      }

      return errorHash;
    } catch (error) {
      console.error('❌ Error logging error:', error.message);
      throw error;
    }
  }

  async recordImprovement(improvementData) {
    const {
      component,
      changeDescription,
      commitHash,
      result,
      performanceGain = 0.0,
      qualityScore = 0.0,
      workflowRunId,
      beforeState = '',
      afterState = ''
    } = improvementData;

    try {
      await this.runQuery(
        `INSERT INTO improvements 
         (component, change_description, commit_hash, result, performance_gain, quality_score, workflow_run_id, before_state, after_state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [component, changeDescription, commitHash, result, performanceGain, qualityScore, workflowRunId, beforeState, afterState]
      );
      console.log(`📈 Recorded improvement for component: ${component}`);
    } catch (error) {
      console.error('❌ Error recording improvement:', error.message);
      throw error;
    }
  }

  async recordSolution(errorHash, solutionData) {
    const {
      solutionType,
      solutionData: solution,
      success = true,
      resolutionTime = 0
    } = solutionData;

    try {
      // Check if solution exists
      const existing = await this.getQuery(
        'SELECT * FROM solutions WHERE error_hash = ? AND solution_type = ?',
        [errorHash, solutionType]
      );

      if (existing.length > 0) {
        // Update existing solution
        const updateFields = success ? 
          'success_count = success_count + 1' : 
          'failure_count = failure_count + 1';
        
        await this.runQuery(
          `UPDATE solutions SET 
           ${updateFields},
           average_resolution_time = (average_resolution_time + ?) / 2,
           last_used = CURRENT_TIMESTAMP,
           confidence = success_count / (success_count + failure_count)
           WHERE error_hash = ? AND solution_type = ?`,
          [resolutionTime, errorHash, solutionType]
        );
      } else {
        // Insert new solution
        await this.runQuery(
          `INSERT INTO solutions 
           (error_hash, solution_type, solution_data, success_count, failure_count, average_resolution_time, confidence)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [errorHash, solutionType, solution, success ? 1 : 0, success ? 0 : 1, resolutionTime, success ? 1.0 : 0.0]
        );
      }

      console.log(`💡 Recorded solution for error: ${errorHash}`);
    } catch (error) {
      console.error('❌ Error recording solution:', error.message);
      throw error;
    }
  }

  async getSimilarErrors(errorMessage, context = '', limit = 5) {
    const errorHash = this.generateErrorHash(errorMessage, context);
    
    try {
      const similar = await this.getQuery(
        `SELECT el.*, s.solution_type, s.solution_data, s.confidence as solution_confidence
         FROM error_logs el
         LEFT JOIN solutions s ON el.error_hash = s.error_hash
         WHERE el.error_message LIKE ? OR el.context LIKE ?
         ORDER BY el.timestamp DESC
         LIMIT ?`,
        [`%${errorMessage}%`, `%${context}%`, limit]
      );
      
      return similar;
    } catch (error) {
      console.error('❌ Error getting similar errors:', error.message);
      return [];
    }
  }

  async getBestSolution(errorHash) {
    try {
      const solutions = await this.getQuery(
        `SELECT * FROM solutions 
         WHERE error_hash = ? 
         ORDER BY confidence DESC, success_count DESC
         LIMIT 1`,
        [errorHash]
      );
      
      return solutions[0] || null;
    } catch (error) {
      console.error('❌ Error getting best solution:', error.message);
      return null;
    }
  }

  async getLearningInsights(limit = 100) {
    try {
      const insights = await this.getQuery(`
        SELECT 
          el.error_type,
          COUNT(*) as frequency,
          AVG(el.resolution_time) as avg_resolution_time,
          AVG(s.confidence) as avg_confidence,
          MAX(el.timestamp) as last_seen
        FROM error_logs el
        LEFT JOIN solutions s ON el.error_hash = s.error_hash
        WHERE el.timestamp > datetime('now', '-30 days')
        GROUP BY el.error_type
        ORDER BY frequency DESC
        LIMIT ?
      `, [limit]);

      return insights;
    } catch (error) {
      console.error('❌ Error getting learning insights:', error.message);
      return [];
    }
  }

  async recordPerformanceMetric(metricData) {
    const {
      workflow,
      metricName,
      metricValue,
      unit,
      context = '',
      improvementPercentage = 0.0
    } = metricData;

    try {
      await this.runQuery(
        `INSERT INTO performance_metrics 
         (workflow, metric_name, metric_value, unit, context, improvement_percentage)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [workflow, metricName, metricValue, unit, context, improvementPercentage]
      );
      console.log(`📊 Recorded performance metric: ${metricName} = ${metricValue} ${unit}`);
    } catch (error) {
      console.error('❌ Error recording performance metric:', error.message);
      throw error;
    }
  }

  async startLearningSession(sessionId) {
    try {
      await this.runQuery(
        'INSERT INTO learning_sessions (session_id) VALUES (?)',
        [sessionId]
      );
      console.log(`🧠 Started learning session: ${sessionId}`);
    } catch (error) {
      console.error('❌ Error starting learning session:', error.message);
      throw error;
    }
  }

  async endLearningSession(sessionId, sessionData) {
    const {
      errorsAnalyzed = 0,
      fixesApplied = 0,
      successRate = 0.0,
      learningInsights = ''
    } = sessionData;

    try {
      await this.runQuery(
        `UPDATE learning_sessions SET 
         end_time = CURRENT_TIMESTAMP,
         errors_analyzed = ?,
         fixes_applied = ?,
         success_rate = ?,
         learning_insights = ?,
         session_data = ?
         WHERE session_id = ?`,
        [errorsAnalyzed, fixesApplied, successRate, learningInsights, JSON.stringify(sessionData), sessionId]
      );
      console.log(`🧠 Ended learning session: ${sessionId}`);
    } catch (error) {
      console.error('❌ Error ending learning session:', error.message);
      throw error;
    }
  }

  async getErrorPatterns() {
    try {
      const patterns = await this.getQuery(`
        SELECT 
          error_type,
          COUNT(*) as frequency,
          AVG(resolution_time) as avg_resolution_time,
          AVG(confidence_score) as avg_confidence,
          MAX(timestamp) as last_seen
        FROM error_logs
        WHERE timestamp > datetime('now', '-7 days')
        GROUP BY error_type
        ORDER BY frequency DESC
      `);
      
      return patterns;
    } catch (error) {
      console.error('❌ Error getting error patterns:', error.message);
      return [];
    }
  }

  async cleanupOldData(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      await this.runQuery(
        'DELETE FROM error_logs WHERE timestamp < ?',
        [cutoffDate.toISOString()]
      );
      
      await this.runQuery(
        'DELETE FROM performance_metrics WHERE timestamp < ?',
        [cutoffDate.toISOString()]
      );
      
      console.log(`🧹 Cleaned up data older than ${daysToKeep} days`);
    } catch (error) {
      console.error('❌ Error cleaning up old data:', error.message);
      throw error;
    }
  }

  async generateReport() {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        summary: {
          totalErrors: await this.getQuery('SELECT COUNT(*) as count FROM error_logs').then(r => r[0].count),
          totalSolutions: await this.getQuery('SELECT COUNT(*) as count FROM solutions').then(r => r[0].count),
          totalImprovements: await this.getQuery('SELECT COUNT(*) as count FROM improvements').then(r => r[0].count),
          totalSessions: await this.getQuery('SELECT COUNT(*) as count FROM learning_sessions').then(r => r[0].count)
        },
        errorPatterns: await this.getErrorPatterns(),
        learningInsights: await this.getLearningInsights(),
        recentActivity: await this.getQuery(`
          SELECT * FROM error_logs 
          WHERE timestamp > datetime('now', '-24 hours')
          ORDER BY timestamp DESC
          LIMIT 10
        `)
      };
      
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error.message);
      return null;
    }
  }

  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
          }
          resolve();
        });
      });
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const db = new CILearningDB();

  async function main() {
    await db.initialize();

    switch (command) {
      case 'init':
        console.log('✅ Database initialized');
        break;
        
      case 'report':
        const report = await db.generateReport();
        console.log(JSON.stringify(report, null, 2));
        break;
        
      case 'cleanup':
        const days = parseInt(process.argv[3]) || 30;
        await db.cleanupOldData(days);
        break;
        
      case 'insights':
        const insights = await db.getLearningInsights();
        console.log(JSON.stringify(insights, null, 2));
        break;
        
      default:
        console.log(`
Usage: node ci-learning-db.js <command> [options]

Commands:
  init                    - Initialize the database
  report                  - Generate learning report
  cleanup [days]          - Clean up old data (default: 30 days)
  insights                - Get learning insights
        `);
    }

    await db.close();
  }

  main().catch(console.error);
}

module.exports = CILearningDB;