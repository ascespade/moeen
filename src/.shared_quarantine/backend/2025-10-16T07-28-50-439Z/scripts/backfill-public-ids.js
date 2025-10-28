#!/usr/bin/env node
const { Client } = require("pg");
const { generatePublicId } = require("./cuid-standalone");

const DRY_RUN = process.env.DRY_RUN === "true";
const BATCH_SIZE = 500;

async function backfillTable(client, tableName, prefix) {
  console.log(`\n🔄 Processing ${tableName}...`);
  let totalUpdated = 0;

  while (true) {
    const { rows } = await client.query(
      `SELECT id FROM ${tableName} WHERE public_id IS NULL LIMIT $1`,
      [BATCH_SIZE],
    );

    if (rows.length === 0) break;

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would update ${rows.length} records`);
      totalUpdated += rows.length;
      continue;
    }

    await client.query("BEGIN");
    try {
      for (const row of rows) {
        const publicId = generatePublicId(prefix);
        await client.query(
          `UPDATE ${tableName} SET public_id = $1 WHERE id = $2`,
          [publicId, row.id],
        );
      }
      await client.query("COMMIT");
      totalUpdated += rows.length;
      console.log(`  ✅ Updated ${totalUpdated} total`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`  ❌ Error: ${error.message}`);
      throw error;
    }
  }

  return totalUpdated;
}

async function main() {
  require("dotenv").config();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectId = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  const client = new Client({
    host: `${projectId}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: process.env.SUPABASE_SERVICE_ROLE,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("🔗 Connected to database");

  if (DRY_RUN) {
    console.log("⚠️  DRY RUN MODE - No changes will be made\n");
  }

  const tables = [
    { name: "patients", prefix: "pat" },
    { name: "doctors", prefix: "doc" },
    { name: "appointments", prefix: "apt" },
    { name: "sessions", prefix: "ses" },
    { name: "insurance_claims", prefix: "clm" },
  ];

  for (const table of tables) {
    await backfillTable(client, table.name, table.prefix);
  }

  await client.end();
  console.log("\n✅ Backfill complete!");
}

main().catch(console.error);
