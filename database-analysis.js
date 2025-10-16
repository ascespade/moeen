#!/usr/bin/env node

/**
 * Comprehensive Database Analysis Script
 * This script analyzes the complete database structure including:
 * - Tables and columns
 * - Constraints and relationships
 * - Indexes and performance
 * - RLS policies
 * - Data integrity
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDatabase() {
  console.log("🔍 Starting comprehensive database analysis...\n");

  try {
    // 1. Get all tables
    console.log("📋 1. DATABASE TABLES");
    console.log("=".repeat(50));

    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name, table_type")
      .eq("table_schema", "public")
      .order("table_name");

    if (tablesError) {
      console.error("Error fetching tables:", tablesError);
      return;
    }

    console.log(`Found ${tables.length} tables:`);
    tables.forEach((table) => {
      console.log(`  - ${table.table_name} (${table.table_type})`);
    });

    // 2. Get table columns and constraints
    console.log("\n📊 2. TABLE STRUCTURE & CONSTRAINTS");
    console.log("=".repeat(50));

    for (const table of tables) {
      if (table.table_type === "BASE TABLE") {
        console.log(`\n📋 Table: ${table.table_name}`);

        // Get columns
        const { data: columns, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select(
            "column_name, data_type, is_nullable, column_default, character_maximum_length",
          )
          .eq("table_schema", "public")
          .eq("table_name", table.table_name)
          .order("ordinal_position");

        if (columnsError) {
          console.error(
            `Error fetching columns for ${table.table_name}:`,
            columnsError,
          );
          continue;
        }

        console.log("  Columns:");
        columns.forEach((col) => {
          const nullable = col.is_nullable === "YES" ? "NULL" : "NOT NULL";
          const length = col.character_maximum_length
            ? `(${col.character_maximum_length})`
            : "";
          const defaultVal = col.column_default
            ? ` DEFAULT ${col.column_default}`
            : "";
          console.log(
            `    - ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`,
          );
        });

        // Get primary keys
        const { data: primaryKeys, error: pkError } = await supabase
          .from("information_schema.key_column_usage")
          .select("column_name")
          .eq("table_schema", "public")
          .eq("table_name", table.table_name)
          .eq(
            "constraint_name",
            (
              await supabase
                .from("information_schema.table_constraints")
                .select("constraint_name")
                .eq("table_schema", "public")
                .eq("table_name", table.table_name)
                .eq("constraint_type", "PRIMARY KEY")
                .single()
            ).data?.constraint_name,
          );

        if (primaryKeys && primaryKeys.length > 0) {
          console.log("  Primary Keys:");
          primaryKeys.forEach((pk) => {
            console.log(`    - ${pk.column_name}`);
          });
        }

        // Get foreign keys
        const { data: foreignKeys, error: fkError } = await supabase
          .from("information_schema.key_column_usage")
          .select("column_name, constraint_name")
          .eq("table_schema", "public")
          .eq("table_name", table.table_name);

        if (foreignKeys && foreignKeys.length > 0) {
          console.log("  Foreign Keys:");
          for (const fk of foreignKeys) {
            const { data: refTable } = await supabase
              .from("information_schema.constraint_column_usage")
              .select("table_name, column_name")
              .eq("constraint_name", fk.constraint_name)
              .single();

            if (refTable) {
              console.log(
                `    - ${fk.column_name} -> ${refTable.table_name}.${refTable.column_name}`,
              );
            }
          }
        }
      }
    }

    // 3. Check indexes
    console.log("\n🔍 3. DATABASE INDEXES");
    console.log("=".repeat(50));

    const { data: indexes, error: indexesError } = await supabase
      .from("pg_indexes")
      .select("tablename, indexname, indexdef")
      .eq("schemaname", "public")
      .order("tablename");

    if (indexesError) {
      console.error("Error fetching indexes:", indexesError);
    } else {
      console.log(`Found ${indexes.length} indexes:`);
      indexes.forEach((index) => {
        console.log(`  - ${index.tablename}.${index.indexname}`);
      });
    }

    // 4. Check RLS policies
    console.log("\n🔒 4. ROW LEVEL SECURITY POLICIES");
    console.log("=".repeat(50));

    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("tablename, policyname, permissive, roles, cmd, qual")
      .eq("schemaname", "public")
      .order("tablename");

    if (policiesError) {
      console.error("Error fetching policies:", policiesError);
    } else {
      console.log(`Found ${policies.length} RLS policies:`);
      policies.forEach((policy) => {
        console.log(
          `  - ${policy.tablename}.${policy.policyname} (${policy.cmd})`,
        );
      });
    }

    // 5. Check for data integrity issues
    console.log("\n🔍 5. DATA INTEGRITY CHECK");
    console.log("=".repeat(50));

    // Check for orphaned records
    const integrityChecks = [
      {
        name: "Orphaned conversations without users",
        query: `SELECT COUNT(*) as count FROM conversations c 
                LEFT JOIN users u ON c.assigned_to = u.id 
                WHERE c.assigned_to IS NOT NULL AND u.id IS NULL`,
      },
      {
        name: "Orphaned messages without conversations",
        query: `SELECT COUNT(*) as count FROM messages m 
                LEFT JOIN conversations c ON m.conversation_id = c.id 
                WHERE c.id IS NULL`,
      },
      {
        name: "Orphaned appointments without patients",
        query: `SELECT COUNT(*) as count FROM appointments a 
                LEFT JOIN patients p ON a.patient_id = p.id 
                WHERE p.id IS NULL`,
      },
    ];

    for (const check of integrityChecks) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", {
          sql: check.query,
        });
        if (error) {
          console.log(`  ❌ ${check.name}: Error - ${error.message}`);
        } else {
          const count = data?.[0]?.count || 0;
          console.log(
            `  ${count > 0 ? "⚠️" : "✅"} ${check.name}: ${count} issues found`,
          );
        }
      } catch (err) {
        console.log(`  ❌ ${check.name}: ${err.message}`);
      }
    }

    // 6. Check system health
    console.log("\n💚 6. SYSTEM HEALTH");
    console.log("=".repeat(50));

    const healthChecks = [
      {
        name: "Total users",
        query: "SELECT COUNT(*) as count FROM users",
      },
      {
        name: "Total conversations",
        query: "SELECT COUNT(*) as count FROM conversations",
      },
      {
        name: "Total appointments",
        query: "SELECT COUNT(*) as count FROM appointments",
      },
      {
        name: "Total patients",
        query: "SELECT COUNT(*) as count FROM patients",
      },
    ];

    for (const check of healthChecks) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", {
          sql: check.query,
        });
        if (error) {
          console.log(`  ❌ ${check.name}: Error - ${error.message}`);
        } else {
          const count = data?.[0]?.count || 0;
          console.log(`  ✅ ${check.name}: ${count}`);
        }
      } catch (err) {
        console.log(`  ❌ ${check.name}: ${err.message}`);
      }
    }

    console.log("\n✅ Database analysis completed!");
  } catch (error) {
    console.error("❌ Analysis failed:", error);
  }
}

// Run the analysis
analyzeDatabase();
