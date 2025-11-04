#!/usr/bin/env node

/**
 * Apply Database Changes
 * ????? ????????? ??? ????? ????????
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection string
const dbUrl = process.env.DATABASE_URL || 
  'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

// Parse the connection string manually
const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (!match) {
  throw new Error('Invalid database URL format');
}

const [, user, password, host, port, database] = match;

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { 
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000,
  query_timeout: 30000
});

async function applyChanges() {
  try {
    console.log('?? Connecting to database...\n');
    await client.connect();
    console.log('? Connected successfully!\n');

    // List of fixes to apply
    const fixes = [];

    // Fix 1: Ensure missing_translations table exists
    fixes.push({
      name: 'Create missing_translations table',
      sql: `
        CREATE TABLE IF NOT EXISTS missing_translations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          language TEXT NOT NULL,
          key TEXT NOT NULL,
          requested_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      check: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'missing_translations'
        );
      `
    });

    // Fix 2: Ensure call_requests table exists with correct structure
    fixes.push({
      name: 'Create call_requests table',
      sql: `
        CREATE TABLE IF NOT EXISTS call_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          requester_id UUID NOT NULL REFERENCES users(id),
          assigned_to UUID REFERENCES users(id),
          reason TEXT,
          priority TEXT DEFAULT 'high',
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
      check: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'call_requests'
        );
      `
    });

    // Fix 3: Ensure notification_logs table exists
    fixes.push({
      name: 'Create notification_logs table',
      sql: `
        CREATE TABLE IF NOT EXISTS notification_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          recipient_id UUID REFERENCES users(id),
          channel TEXT NOT NULL,
          status TEXT NOT NULL,
          message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
      check: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'notification_logs'
        );
      `
    });

    // Fix 4: Add indexes for better performance
    fixes.push({
      name: 'Add indexes for optimization',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_missing_translations_language ON missing_translations(language);
        CREATE INDEX IF NOT EXISTS idx_missing_translations_key ON missing_translations(key);
        CREATE INDEX IF NOT EXISTS idx_call_requests_requester ON call_requests(requester_id);
        CREATE INDEX IF NOT EXISTS idx_call_requests_assigned ON call_requests(assigned_to);
        CREATE INDEX IF NOT EXISTS idx_call_requests_status ON call_requests(status);
        CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON notification_logs(recipient_id);
      `,
      check: null
    });

    // Fix 5: Ensure get_on_duty_supervisor function exists
    fixes.push({
      name: 'Create get_on_duty_supervisor function',
      sql: `
        CREATE OR REPLACE FUNCTION get_on_duty_supervisor()
        RETURNS UUID AS $$
        DECLARE
          supervisor_id UUID;
        BEGIN
          SELECT id INTO supervisor_id
          FROM users
          WHERE role = 'supervisor'
            AND status = 'active'
          ORDER BY created_at ASC
          LIMIT 1;
          
          RETURN supervisor_id;
        END;
        $$ LANGUAGE plpgsql;
      `,
      check: `
        SELECT EXISTS (
          SELECT FROM pg_proc 
          WHERE proname = 'get_on_duty_supervisor'
        );
      `
    });

    // Apply fixes
    console.log('?? Applying fixes...\n');
    
    for (const fix of fixes) {
      try {
        // Check if already exists
        if (fix.check) {
          const checkResult = await client.query(fix.check);
          const exists = checkResult.rows[0].exists;
          
          if (exists && fix.name.includes('table')) {
            console.log(`??  ${fix.name} - Already exists, skipping...`);
            continue;
          }
        }

        // Apply the fix
        await client.query(fix.sql);
        console.log(`? ${fix.name} - Applied successfully`);
      } catch (error) {
        console.error(`? ${fix.name} - Failed:`, error.message);
        // Continue with other fixes
      }
    }

    // Verify changes
    console.log('\n?? Verifying changes...\n');
    
    const verifyQueries = [
      { name: 'missing_translations table', sql: `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'missing_translations'` },
      { name: 'call_requests table', sql: `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'call_requests'` },
      { name: 'notification_logs table', sql: `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'notification_logs'` },
      { name: 'get_on_duty_supervisor function', sql: `SELECT COUNT(*) FROM pg_proc WHERE proname = 'get_on_duty_supervisor'` },
    ];

    for (const verify of verifyQueries) {
      try {
        const result = await client.query(verify.sql);
        const count = parseInt(result.rows[0].count);
        if (count > 0) {
          console.log(`? ${verify.name} - Verified`);
        } else {
          console.log(`??  ${verify.name} - Not found`);
        }
      } catch (error) {
        console.error(`? ${verify.name} - Error:`, error.message);
      }
    }

    // Get table statistics
    console.log('\n?? Database Statistics:\n');
    const statsQuery = `
      SELECT 
        COUNT(*) as total_tables,
        (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public') as total_functions,
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as total_indexes
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;
    
    const stats = await client.query(statsQuery);
    console.log(`   Tables: ${stats.rows[0].total_tables}`);
    console.log(`   Functions: ${stats.rows[0].total_functions}`);
    console.log(`   Indexes: ${stats.rows[0].total_indexes}`);

    await client.end();
    console.log('\n? All changes applied successfully!\n');

  } catch (error) {
    console.error('? Error applying changes:', error.message);
    if (client) await client.end();
    process.exit(1);
  }
}

// Run
applyChanges().then(() => {
  console.log('?? Done!');
  process.exit(0);
}).catch((error) => {
  console.error('? Failed:', error);
  process.exit(1);
});
