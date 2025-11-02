#!/usr/bin/env node
/**
 * Enterprise Database Audit - Comprehensive Database Assessment
 * فحص قاعدة البيانات الشامل
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = join(__dirname, '..');

const REPORT_DIR = join(workspaceRoot, 'reports', 'enterprise-audit');
const REPORT_FILE = join(REPORT_DIR, 'database-audit-report.json');

import { mkdirSync, writeFileSync } from 'fs';
try {
  mkdirSync(REPORT_DIR, { recursive: true });
} catch (e) {}

class DatabaseAuditor {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      findings: [],
      summary: {
        tables: 0,
        indexes: 0,
        foreignKeys: 0,
        rlsPolicies: 0,
        constraints: 0,
        issues: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
      },
      schema: {
        tables: [],
        indexes: [],
        foreignKeys: [],
        rlsPolicies: [],
        constraints: [],
      },
      recommendations: [],
      score: 0,
    };
  }

  addFinding(severity, title, description, table = null, recommendation = null) {
    const finding = {
      id: `DB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      severity,
      title,
      description,
      table,
      recommendation,
      timestamp: new Date().toISOString(),
    };

    this.report.findings.push(finding);
    this.report.summary.issues[severity]++;
  }

  analyzeMigrationFile(filePath) {
    console.log(`📄 Analyzing migration file: ${filePath}`);
    const content = readFileSync(filePath, 'utf-8');

    // Extract tables
    const tableMatches = content.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/gi);
    const tables = [];
    for (const match of tableMatches) {
      if (!tables.includes(match[1])) {
        tables.push(match[1]);
      }
    }
    this.report.schema.tables = tables;
    this.report.summary.tables = tables.length;

    // Extract indexes
    const indexMatches = content.matchAll(/CREATE (?:UNIQUE )?INDEX (?:IF NOT EXISTS )?(\w+)/gi);
    const indexes = [];
    for (const match of indexMatches) {
      indexes.push(match[1]);
    }
    this.report.schema.indexes = indexes;
    this.report.summary.indexes = indexes.length;

    // Extract foreign keys
    const fkMatches = content.matchAll(/REFERENCES (\w+)\((\w+)\)/gi);
    const foreignKeys = [];
    for (const match of fkMatches) {
      foreignKeys.push({
        referencedTable: match[1],
        referencedColumn: match[2],
      });
    }
    this.report.schema.foreignKeys = foreignKeys;
    this.report.summary.foreignKeys = foreignKeys.length;

    // Check for RLS
    const rlsMatches = content.matchAll(/ENABLE ROW LEVEL SECURITY|CREATE POLICY.*ON (\w+)/gi);
    const rlsTables = new Set();
    let policyCount = 0;
    
    // Check for ENABLE ROW LEVEL SECURITY
    if (content.includes('ENABLE ROW LEVEL SECURITY') || content.includes('enable row level security')) {
      // Find tables with RLS enabled
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('ENABLE ROW LEVEL SECURITY') || line.includes('enable row level security')) {
          // Look for previous CREATE TABLE statement
          for (let i = index - 1; i >= Math.max(0, index - 20); i--) {
            const tableMatch = lines[i].match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i);
            if (tableMatch) {
              rlsTables.add(tableMatch[1]);
              break;
            }
          }
        }
      });
    }

    // Count policies
    const policyMatches = content.matchAll(/CREATE POLICY (\w+) ON (\w+)/gi);
    for (const match of policyMatches) {
      policyCount++;
      rlsTables.add(match[2]);
    }

    this.report.schema.rlsPolicies = Array.from(rlsTables);
    this.report.summary.rlsPolicies = policyCount;

    // Check for constraints
    const constraintPatterns = [
      { pattern: /PRIMARY KEY/gi, name: 'PRIMARY KEY' },
      { pattern: /UNIQUE/gi, name: 'UNIQUE' },
      { pattern: /NOT NULL/gi, name: 'NOT NULL' },
      { pattern: /CHECK/gi, name: 'CHECK' },
    ];

    let constraintCount = 0;
    constraintPatterns.forEach(({ pattern }) => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        constraintCount++;
      }
    });
    this.report.summary.constraints = constraintCount;

    // Analyze each table
    tables.forEach(table => {
      this.analyzeTable(content, table);
    });

    // Check RLS coverage
    const sensitiveTables = ['users', 'patients', 'doctors', 'medical_records', 'appointments', 'audit_logs'];
    sensitiveTables.forEach(table => {
      if (tables.includes(table) && !rlsTables.has(table)) {
        this.addFinding(
          'critical',
          `RLS Not Enabled on Sensitive Table: ${table}`,
          `Row Level Security is not enabled on the ${table} table, which may contain sensitive data`,
          table,
          `Enable RLS on ${table} table and create appropriate policies for each role`
        );
      }
    });

    // Check for indexes on foreign keys
    foreignKeys.forEach((fk, index) => {
      const fkColumnPattern = new RegExp(`\\b${fk.referencedTable}\\s*\\(.*?\\b${fk.referencedColumn}\\b`, 'i');
      // This is a simplified check - in reality, need to check actual FK columns
    });

    // Check for missing indexes on commonly queried columns
    if (tables.includes('users')) {
      if (!indexes.some(idx => idx.includes('email'))) {
        this.addFinding(
          'medium',
          'Missing Index on users.email',
          'The users.email column should have an index for faster lookups',
          'users',
          'Create index: CREATE INDEX idx_users_email ON users(email);'
        );
      }
    }

    if (tables.includes('appointments')) {
      if (!indexes.some(idx => idx.includes('appointment_date'))) {
        this.addFinding(
          'medium',
          'Missing Index on appointments.appointment_date',
          'The appointments.appointment_date column should be indexed for date range queries',
          'appointments',
          'Create index: CREATE INDEX idx_appointments_date ON appointments(appointment_date);'
        );
      }
    }

    // Check for missing timestamps
    const tablesNeedingTimestamps = ['users', 'patients', 'doctors', 'appointments'];
    tablesNeedingTimestamps.forEach(table => {
      if (tables.includes(table)) {
        const tableDef = this.extractTableDefinition(content, table);
        if (tableDef && !tableDef.includes('created_at') && !tableDef.includes('updated_at')) {
          this.addFinding(
            'low',
            `Missing Timestamps on ${table}`,
            `The ${table} table should have created_at and updated_at columns for auditing`,
            table,
            `Add created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() and updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`
          );
        }
      }
    });

    // Check for soft deletes
    sensitiveTables.forEach(table => {
      if (tables.includes(table)) {
        const tableDef = this.extractTableDefinition(content, table);
        if (tableDef && !tableDef.includes('deleted_at') && !tableDef.includes('status')) {
          this.addFinding(
            'medium',
            `Missing Soft Delete on ${table}`,
            `The ${table} table should support soft deletes for data recovery and compliance`,
            table,
            `Add deleted_at TIMESTAMP WITH TIME ZONE or status VARCHAR column`
          );
        }
      }
    });

    // Check for audit trail
    if (!tables.includes('audit_logs')) {
      this.addFinding(
        'high',
        'Missing Audit Logs Table',
        'No audit_logs table found. Audit logging is required for compliance (HIPAA, GDPR)',
        null,
        'Create audit_logs table to track all changes to sensitive data'
      );
    }

    // Check for backup strategy mentions
    if (!content.includes('backup') && !content.includes('BACKUP')) {
      this.addFinding(
        'info',
        'Backup Strategy Documentation',
        'No backup strategy documented in migrations',
        null,
        'Document backup strategy and recovery procedures'
      );
    }
  }

  extractTableDefinition(content, tableName) {
    const tableRegex = new RegExp(`CREATE TABLE[\\s\\S]*?${tableName}[\\s\\S]*?\\((.*?)\\)`, 'i');
    const match = content.match(tableRegex);
    return match ? match[1] : null;
  }

  analyzeTable(content, tableName) {
    const tableDef = this.extractTableDefinition(content, tableName);
    if (!tableDef) return;

    // Check for primary key
    if (!tableDef.includes('PRIMARY KEY') && !tableDef.includes('SERIAL PRIMARY KEY')) {
      this.addFinding(
        'critical',
        `Missing Primary Key on ${tableName}`,
        `The ${tableName} table does not have a primary key defined`,
        tableName,
        `Add PRIMARY KEY constraint to ${tableName} table`
      );
    }

    // Check for appropriate data types
    if (tableName === 'users' || tableName === 'patients') {
      if (tableDef.includes('email') && !tableDef.match(/email.*VARCHAR\(255\)|email.*TEXT/i)) {
        this.addFinding(
          'low',
          `Email Column Size on ${tableName}`,
          `Ensure email column can accommodate standard email addresses (255 characters)`,
          tableName,
          'Use VARCHAR(255) for email columns'
        );
      }

      if (tableDef.includes('password') && !tableDef.includes('password_hash')) {
        this.addFinding(
          'critical',
          `Potential Plain Text Password on ${tableName}`,
          `Password column found - ensure it is named password_hash and stores hashed values only`,
          tableName,
          'Never store plain text passwords. Use password_hash column with bcrypt/scrypt/argon2'
        );
      }
    }
  }

  checkPerformance() {
    console.log('⚡ Checking database performance considerations...');

    // Check for missing indexes on foreign keys
    this.report.schema.foreignKeys.forEach(fk => {
      const hasIndex = this.report.schema.indexes.some(idx => 
        idx.includes(fk.referencedTable) || idx.includes(fk.referencedColumn)
      );
      
      if (!hasIndex) {
        this.addFinding(
          'medium',
          `Missing Index on Foreign Key: ${fk.referencedTable}.${fk.referencedColumn}`,
          `Foreign key columns should be indexed for join performance`,
          fk.referencedTable,
          `Create index on foreign key column: CREATE INDEX idx_${fk.referencedTable}_${fk.referencedColumn} ON ...`
        );
      }
    });

    // Check for proper use of SERIAL vs UUID
    // This would require deeper analysis of table definitions
  }

  checkDataIntegrity() {
    console.log('🔒 Checking data integrity...');

    // Check for foreign key constraints
    if (this.report.summary.foreignKeys === 0) {
      this.addFinding(
        'high',
        'No Foreign Key Constraints Found',
        'Foreign key constraints are essential for referential integrity',
        null,
        'Add FOREIGN KEY constraints to maintain referential integrity'
      );
    }

    // Check for unique constraints on critical fields
    const criticalUniques = [
      { table: 'users', column: 'email' },
      { table: 'patients', column: 'email' },
    ];

    // This is a simplified check - would need deeper analysis
  }

  checkCompliance() {
    console.log('📋 Checking compliance requirements...');

    // HIPAA Requirements
    if (this.report.schema.tables.some(t => t.includes('patient') || t.includes('medical'))) {
      // Check for encryption at rest (would need to check Supabase settings)
      this.addFinding(
        'info',
        'HIPAA: Verify Encryption at Rest',
        'Ensure database encryption at rest is enabled in Supabase',
        null,
        'Verify Supabase encryption at rest is enabled in project settings'
      );

      // Check for access logging
      if (!this.report.schema.tables.includes('audit_logs')) {
        this.addFinding(
          'high',
          'HIPAA: Missing Audit Logging',
          'HIPAA requires comprehensive audit logging for PHI access',
          null,
          'Implement audit_logs table to track all PHI access'
        );
      }
    }

    // GDPR Requirements
    this.addFinding(
      'info',
      'GDPR: Data Deletion Capability',
      'Ensure data deletion functionality exists for GDPR Right to Erasure',
      null,
      'Implement user data deletion with proper cascade handling'
    );
  }

  calculateScore() {
    let score = 100;
    
    // Deduct points based on findings
    this.report.findings.forEach(finding => {
      switch (finding.severity) {
        case 'critical':
          score -= 10;
          break;
        case 'high':
          score -= 5;
          break;
        case 'medium':
          score -= 2;
          break;
        case 'low':
          score -= 1;
          break;
      }
    });

    this.report.score = Math.max(0, Math.min(100, score));
    
    if (this.report.score >= 90) {
      this.report.scoreLevel = 'Excellent';
    } else if (this.report.score >= 75) {
      this.report.scoreLevel = 'Good';
    } else if (this.report.score >= 60) {
      this.report.scoreLevel = 'Fair';
    } else {
      this.report.scoreLevel = 'Needs Improvement';
    }
  }

  async audit() {
    console.log('🚀 Starting Enterprise Database Audit...\n');

    // Find and analyze migration files
    const migrationFiles = [
      join(workspaceRoot, 'supabase/00_complete_migration.sql'),
    ];

    migrationFiles.forEach(file => {
      if (existsSync(file)) {
        this.analyzeMigrationFile(file);
      }
    });

    // Additional checks
    this.checkPerformance();
    this.checkDataIntegrity();
    this.checkCompliance();

    // Calculate score
    this.calculateScore();

    // Generate summary
    this.report.summary.totalFindings = this.report.findings.length;

    // Save report
    writeFileSync(REPORT_FILE, JSON.stringify(this.report, null, 2), 'utf-8');

    console.log('\n✅ Database audit complete!');
    console.log(`📄 Report saved to: ${REPORT_FILE}`);
    console.log(`\n📊 Database Score: ${this.report.score}/100 (${this.report.scoreLevel})`);
    console.log(`\n📋 Schema Summary:`);
    console.log(`   Tables: ${this.report.summary.tables}`);
    console.log(`   Indexes: ${this.report.summary.indexes}`);
    console.log(`   Foreign Keys: ${this.report.summary.foreignKeys}`);
    console.log(`   RLS Policies: ${this.report.summary.rlsPolicies}`);
    console.log(`\n📋 Issues:`);
    console.log(`   Critical: ${this.report.summary.issues.critical}`);
    console.log(`   High: ${this.report.summary.issues.high}`);
    console.log(`   Medium: ${this.report.summary.issues.medium}`);
    console.log(`   Low: ${this.report.summary.issues.low}`);

    return this.report;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new DatabaseAuditor();
  auditor.audit().catch(console.error);
}

export default DatabaseAuditor;
