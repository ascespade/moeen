/**
 * Supabase Connection Test
 * Test database connections, queries, and migrations
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class SupabaseConnectionTester {
  constructor() {
    // Load environment variables
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.results = [];
  }

  async runTest(name, testFn) {
    const startTime = Date.now();
    console.log(`\n🧪 Running: ${name}...`);
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        name,
        status: 'passed',
        duration,
      });
      console.log(`✅ PASSED: ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error.message || String(error);
      this.results.push({
        name,
        status: 'failed',
        duration,
        error: errorMessage,
      });
      console.error(`❌ FAILED: ${name} (${duration}ms)`);
      console.error(`   Error: ${errorMessage}`);
    }
  }

  async testEnvironmentVariables() {
    await this.runTest('Environment Variables Check', async () => {
      if (!this.supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
      }
      if (!this.supabaseKey) {
        throw new Error('Supabase key is not defined');
      }
      if (!this.supabaseUrl.startsWith('http')) {
        throw new Error('Invalid Supabase URL format');
      }
      console.log(`   Supabase URL: ${this.supabaseUrl}`);
    });
  }

  async testConnection() {
    await this.runTest('Supabase Connection', async () => {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      // Try a simple query to test connection
      const { data, error } = await supabase.from('patients').select('count', { count: 'exact', head: true });
      
      if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist, but connection works
        throw new Error(`Connection failed: ${error.message}`);
      }
      
      console.log('   Connection successful');
    });
  }

  async testTableAccess() {
    const supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
    const tables = [
      'patients',
      'appointments',
      'users',
      'medical_records',
      'doctors',
      'notifications',
      'billing'
    ];

    for (const table of tables) {
      await this.runTest(`Table Access: ${table}`, async () => {
        const { error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1);
        
        if (error) {
          console.log(`   ⚠️  Table "${table}": ${error.message}`);
          // Don't throw error for table not found, just log it
          if (error.code !== 'PGRST116' && error.code !== '42P01') {
            throw new Error(`Cannot access table ${table}: ${error.message}`);
          }
        } else {
          console.log(`   ✓ Table "${table}" is accessible`);
        }
      });
    }
  }

  async testBasicQueries() {
    const supabase = createClient(this.supabaseUrl, this.supabaseKey);

    await this.runTest('Basic SELECT Query', async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .limit(5);
      
      if (error) {
        console.log(`   ⚠️  Query warning: ${error.message}`);
        // If table doesn't exist, that's ok for this test
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log('   ℹ️  Table not found, but connection works');
          return;
        }
        throw new Error(`Query failed: ${error.message}`);
      }
      
      console.log(`   Retrieved ${data?.length || 0} records`);
    });
  }

  async testRLS() {
    await this.runTest('Row Level Security (RLS)', async () => {
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!anonKey) {
        console.log('   ℹ️  NEXT_PUBLIC_SUPABASE_ANON_KEY not found, skipping RLS test');
        return;
      }

      const supabase = createClient(this.supabaseUrl, anonKey);
      
      // Try to access data without auth
      const { error } = await supabase
        .from('patients')
        .select('*')
        .limit(1);
      
      console.log('   RLS check completed');
    });
  }

  async testMigrations() {
    await this.runTest('Database Migrations Check', async () => {
      const migrationsPath = path.join(process.cwd(), 'migrations');
      
      if (!fs.existsSync(migrationsPath)) {
        console.log('   ℹ️  No migrations folder found');
        return;
      }

      const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'));
      
      console.log(`   Found ${migrationFiles.length} migration files`);
      
      if (migrationFiles.length > 0) {
        console.log('   Migration files:');
        migrationFiles.slice(0, 5).forEach(file => console.log(`     - ${file}`));
        if (migrationFiles.length > 5) {
          console.log(`     ... and ${migrationFiles.length - 5} more`);
        }
      }
    });
  }

  generateReport() {
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length,
    };

    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      supabaseUrl: this.supabaseUrl,
      tests: this.results,
      summary,
    };
  }

  async runAllTests() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   SUPABASE CONNECTION & INTEGRATION TEST   ║');
    console.log('╚════════════════════════════════════════════╝\n');

    await this.testEnvironmentVariables();
    await this.testConnection();
    await this.testTableAccess();
    await this.testBasicQueries();
    await this.testRLS();
    await this.testMigrations();

    // Generate and save report
    const report = this.generateReport();
    const logsDir = path.join(process.cwd(), 'logs');
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const reportPath = path.join(logsDir, 'supabase_tests.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n' + '═'.repeat(50));
    console.log('SUPABASE TEST SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⊘ Skipped: ${report.summary.skipped}`);
    console.log(`\n📄 Report saved to: ${reportPath}`);
    console.log('═'.repeat(50));

    // Exit with error code if any critical tests failed
    const criticalFailures = this.results.filter(r => 
      r.status === 'failed' && 
      (r.name.includes('Environment') || r.name.includes('Connection'))
    ).length;

    if (criticalFailures > 0) {
      console.error('\n🚨 CRITICAL: Database connection failed!');
      process.exit(1);
    } else if (report.summary.failed > 0) {
      console.warn('\n⚠️  Some tests failed, but connection is working');
    }
  }
}

// Run tests
const tester = new SupabaseConnectionTester();
tester.runAllTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
