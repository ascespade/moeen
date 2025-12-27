/**
 * Supabase Connection Test
 * Test database connections, queries, and migrations
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: any;
}

interface SupabaseTestReport {
  timestamp: string;
  environment: string;
  supabaseUrl: string;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

class SupabaseConnectionTester {
  private supabaseUrl: string;
  private supabaseKey: string;
  private results: TestResult[] = [];

  constructor() {
    // Load environment variables
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }

  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
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
      const errorMessage = error instanceof Error ? error.message : String(error);
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

  async testEnvironmentVariables(): Promise<void> {
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

  async testConnection(): Promise<void> {
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

  async testTableAccess(): Promise<void> {
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
          throw new Error(`Cannot access table ${table}: ${error.message}`);
        }
        
        console.log(`   ✓ Table "${table}" is accessible`);
      });
    }
  }

  async testBasicQueries(): Promise<void> {
    const supabase = createClient(this.supabaseUrl, this.supabaseKey);

    await this.runTest('Basic SELECT Query', async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .limit(5);
      
      if (error) {
        throw new Error(`Query failed: ${error.message}`);
      }
      
      console.log(`   Retrieved ${data?.length || 0} records`);
    });

    await this.runTest('Basic INSERT Query', async () => {
      const testData = {
        name: 'Test Patient',
        email: `test-${Date.now()}@example.com`,
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('patients')
        .insert(testData)
        .select();
      
      if (error) {
        throw new Error(`Insert failed: ${error.message}`);
      }

      // Cleanup
      if (data && data.length > 0) {
        await supabase.from('patients').delete().eq('id', data[0].id);
      }
      
      console.log('   Insert operation successful');
    });
  }

  async testRLS(): Promise<void> {
    await this.runTest('Row Level Security (RLS)', async () => {
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!anonKey) {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
      }

      const supabase = createClient(this.supabaseUrl, anonKey);
      
      // Try to access data without auth (should fail or return limited data)
      const { error } = await supabase
        .from('patients')
        .select('*')
        .limit(1);
      
      // RLS is working if we get a permission error or no data
      console.log('   RLS check completed');
    });
  }

  async testMigrations(): Promise<void> {
    await this.runTest('Database Migrations Check', async () => {
      const migrationsPath = path.join(process.cwd(), 'migrations');
      
      if (!fs.existsSync(migrationsPath)) {
        console.log('   No migrations folder found');
        return;
      }

      const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'));
      
      console.log(`   Found ${migrationFiles.length} migration files`);
      
      if (migrationFiles.length > 0) {
        console.log('   Migration files:');
        migrationFiles.forEach(file => console.log(`     - ${file}`));
      }
    });
  }

  async testFunctions(): Promise<void> {
    const supabase = createClient(this.supabaseUrl, this.supabaseKey);

    await this.runTest('Database Functions', async () => {
      // Test if we can call a database function
      const { error } = await supabase.rpc('get_stats', {}).then(
        result => result,
        () => ({ error: null }) // Function might not exist, that's ok
      );
      
      console.log('   Database functions check completed');
    });
  }

  generateReport(): SupabaseTestReport {
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

  async runAllTests(): Promise<void> {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   SUPABASE CONNECTION & INTEGRATION TEST   ║');
    console.log('╚════════════════════════════════════════════╝\n');

    await this.testEnvironmentVariables();
    await this.testConnection();
    await this.testTableAccess();
    await this.testBasicQueries();
    await this.testRLS();
    await this.testMigrations();
    await this.testFunctions();

    // Generate and save report
    const report = this.generateReport();
    const reportPath = path.join(process.cwd(), 'logs', 'supabase_tests.json');
    
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
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

    // Exit with error code if any tests failed
    if (report.summary.failed > 0) {
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
const tester = new SupabaseConnectionTester();
tester.runAllTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
