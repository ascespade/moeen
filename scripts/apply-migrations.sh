#!/usr/bin/env bash
set -e

# Apply Database Migrations Script
# This script applies all migrations and runs validation

echo "🚀 Starting database migration process..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is required"
  exit 1
fi

if [ -z "$SUPABASE_PROJECT_REF" ]; then
  echo "❌ Error: SUPABASE_PROJECT_REF environment variable is required"
  exit 1
fi

# Create backup directory
mkdir -p backup/migrations

# Backup existing data
echo "📦 Creating backup..."
pg_dump "$DATABASE_URL" > backup/migrations/pre_migration_backup.sql

# Apply migrations
echo "🔄 Applying migrations..."
for migration in supabase/migrations/*.sql; do
  if [ -f "$migration" ]; then
    echo "  Applying $(basename "$migration")..."
    psql "$DATABASE_URL" -f "$migration"
  fi
done

# Run validation
echo "✅ Running validation..."
node scripts/validate-schema.js

echo "🎉 Migration completed successfully!"
