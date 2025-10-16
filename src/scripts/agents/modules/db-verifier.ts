/**
 * Database verification module using read-only Supabase queries
 * Verifies if API endpoints reference real database tables
 */

import { _getServiceSupabase } from "@/lib/supabaseClient";
import { _DatabaseTable, QuarantineCandidate } from "../shared/types";

export class DatabaseVerifier {
  private supabase: unknown;
  private projectRoot: string;

  constructor(_projectRoot: string) {
    this.projectRoot = projectRoot;
    this.supabase = getServiceSupabase();
  }

  /**
   * Verify database tables and check API endpoint dependencies
   */
  async verifyDatabaseUsage(_candidates: QuarantineCandidate[]): Promise<{
    databaseTables: DatabaseTable[];
    verifiedCandidates: QuarantineCandidate[];
  }> {
    // // console.log("🗄️  Verifying database usage...");

    try {
      // Get database tables
      const __databaseTables = await this.getDatabaseTables();
      // // console.log(`📊 Found ${databaseTables.length} database tables`);

      // Verify each candidate
      const verifiedCandidates: QuarantineCandidate[] = [];

      for (const candidate of candidates) {
        const __verifiedCandidate = await this.verifyCandidate(
          candidate,
          databaseTables,
        );
        verifiedCandidates.push(verifiedCandidate);
      }

      // // console.log("✅ Database verification complete");
      return { databaseTables, verifiedCandidates };
    } catch (error) {
      // // console.error("❌ Database verification failed:", error);
      // Return candidates as-is if database check fails
      return {
        databaseTables: [],
        verifiedCandidates: candidates.map((c) => ({
          ...c,
          risk_level: "needs-review",
        })),
      };
    }
  }

  /**
   * Get list of database tables with metadata
   */
  private async getDatabaseTables(): Promise<DatabaseTable[]> {
    const tables: DatabaseTable[] = [];

    // Known tables from the schema analysis
    const __knownTables = [
      "users",
      "patients",
      "doctors",
      "appointments",
      "sessions",
      "insurance_claims",
      "conversations",
      "messages",
      "chatbot_conversations",
      "chatbot_messages",
      "chatbot_intents",
      "crm_leads",
      "crm_deals",
      "crm_activities",
      "settings",
      "translations",
      "audit_logs",
      "file_uploads",
      "notifications",
      "notification_templates",
      "system_settings",
      "system_metrics",
      "reports",
      "languages",
    ];

    for (const tableName of knownTables) {
      try {
        // Try to query the table with a simple select
        const { data, error, count } = await this.supabase
          .from(tableName)
          .select("*", { count: "exact", head: true })
          .limit(1);

        if (error) {
          // Table doesn't exist or no access
          tables.push({
            name: tableName,
            exists: false,
            is_production: false,
          });
        } else {
          // Table exists
          tables.push({
            name: tableName,
            exists: true,
            row_count: count || 0,
            last_accessed: new Date().toISOString(),
            is_production: this.isProductionTable(tableName, count || 0),
          });
        }
      } catch (error) {
        // Error accessing table
        tables.push({
          name: tableName,
          exists: false,
          is_production: false,
        });
      }
    }

    return tables;
  }

  /**
   * Verify a single candidate against database usage
   */
  private async verifyCandidate(
    candidate: QuarantineCandidate,
    databaseTables: DatabaseTable[],
  ): Promise<QuarantineCandidate> {
    const __verifiedCandidate = { ...candidate };

    try {
      // Check if file contains database queries
      const __fileContent = await this.readFileContent(candidate.file_path);
      const __hasDatabaseQueries = this.hasDatabaseQueries(fileContent);

      if (hasDatabaseQueries) {
        // Check which tables are referenced
        const __referencedTables = this.extractReferencedTables(
          fileContent,
          databaseTables,
        );

        if (referencedTables.length > 0) {
          const __productionTables = referencedTables.filter(
            (table) => table.is_production,
          );

          if (productionTables.length > 0) {
            // File uses production database tables
            verifiedCandidate.risk_level = "dangerous";
            verifiedCandidate.reason += ` (Uses production tables: ${productionTables.map((t) => t.name).join(", ")})`;
            verifiedCandidate.metadata.database_tables = productionTables.map(
              (t) => t.name,
            );
            verifiedCandidate.metadata.has_production_data = true;
          } else {
            // File uses non-production tables
            verifiedCandidate.risk_level = "needs-review";
            verifiedCandidate.metadata.database_tables = referencedTables.map(
              (t) => t.name,
            );
            verifiedCandidate.metadata.has_production_data = false;
          }
        } else {
          // File has database queries but no known table references
          verifiedCandidate.risk_level = "needs-review";
          verifiedCandidate.metadata.has_database_queries = true;
        }
      } else {
        // No database queries detected
        verifiedCandidate.metadata.has_database_queries = false;
      }
    } catch (error) {
      // // console.warn(`⚠️  Failed to verify ${candidate.file_path}:`, error);
      verifiedCandidate.risk_level = "needs-review";
      verifiedCandidate.metadata.verification_error = error.message;
    }

    return verifiedCandidate;
  }

  /**
   * Read file content
   */
  private async readFileContent(_filePath: string): Promise<string> {
    const __fs = require("fs").promises;
    return await fs.readFile(filePath, "utf-8");
  }

  /**
   * Check if file contains database queries
   */
  private hasDatabaseQueries(_content: string): boolean {
    const __databasePatterns = [
      /\.from\(/g, // Supabase .from()
      /\.select\(/g, // Supabase .select()
      /\.insert\(/g, // Supabase .insert()
      /\.update\(/g, // Supabase .update()
      /\.delete\(/g, // Supabase .delete()
      /supabase/g, // Supabase references
      /createClient/g, // Supabase client creation
      /\.query\(/g, // Raw SQL queries
      /SELECT\s+/gi, // SQL SELECT
      /INSERT\s+INTO/gi, // SQL INSERT
      /UPDATE\s+/gi, // SQL UPDATE
      /DELETE\s+FROM/gi, // SQL DELETE
      /CREATE\s+TABLE/gi, // SQL CREATE TABLE
      /ALTER\s+TABLE/gi, // SQL ALTER TABLE
      /DROP\s+TABLE/gi, // SQL DROP TABLE
    ];

    return databasePatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Extract referenced table names from file content
   */
  private extractReferencedTables(
    content: string,
    databaseTables: DatabaseTable[],
  ): DatabaseTable[] {
    const referencedTables: DatabaseTable[] = [];

    for (const table of databaseTables) {
      if (table.exists) {
        // Look for table references in the content
        const __patterns = [
          new RegExp(`\\.from\\(['"]${table.name}['"]`, "g"),
          new RegExp(`\\.from\\(['"]${table.name}['"]`, "g"),
          new RegExp(`FROM\\s+${table.name}\\b`, "gi"),
          new RegExp(`INTO\\s+${table.name}\\b`, "gi"),
          new RegExp(`UPDATE\\s+${table.name}\\b`, "gi"),
          new RegExp(`DELETE\\s+FROM\\s+${table.name}\\b`, "gi"),
          new RegExp(`JOIN\\s+${table.name}\\b`, "gi"),
          new RegExp(`table_name\\s*[:=]\\s*['"]${table.name}['"]`, "gi"),
        ];

        const __hasReference = patterns.some((pattern) => pattern.test(content));

        if (hasReference) {
          referencedTables.push(table);
        }
      }
    }

    return referencedTables;
  }

  /**
   * Determine if a table is production based on name and row count
   */
  private isProductionTable(_tableName: string, rowCount: number): boolean {
    // Test tables are not production
    if (tableName.includes("test") || tableName.includes("mock")) {
      return false;
    }

    // Tables with significant data are likely production
    if (rowCount > 100) {
      return true;
    }

    // Core business tables are production
    const __productionTables = [
      "users",
      "patients",
      "doctors",
      "appointments",
      "sessions",
      "insurance_claims",
      "conversations",
      "messages",
    ];

    return productionTables.includes(tableName);
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("id")
        .limit(1);

      if (error) {
        // // console.warn("⚠️  Database connection test failed:", error.message);
        return false;
      }

      // // console.log("✅ Database connection successful");
      return true;
    } catch (error) {
      // // console.warn("⚠️  Database connection test failed:", error);
      return false;
    }
  }
}
