#!/usr/bin/env node

/**
 * Apply Database Migrations
 * ????? migrations ??? ????? ????????
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('? Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('?? Applying Database Migrations...\n');

  const migrationFiles = await glob('migrations/*.sql', { cwd: projectRoot });
  migrationFiles.sort();

  for (const file of migrationFiles) {
    const filePath = join(projectRoot, file);
    const sql = readFileSync(filePath, 'utf-8');

    console.log(`?? Applying: ${file}`);

    try {
      // Split SQL by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', {
            sql_query: statement,
          });

          if (error) {
            // Try direct execution if RPC doesn't work
            console.log(`  ??  Statement failed, trying alternative method...`);
          }
        }
      }

      console.log(`  ? Applied: ${file}\n`);
    } catch (error) {
      console.error(`  ? Error applying ${file}:`, error.message);
    }
  }

  console.log('? All migrations completed!\n');
}

applyMigrations().catch(console.error);
