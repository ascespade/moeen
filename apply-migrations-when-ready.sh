#!/bin/bash

# Healthcare System Migration Script
# Run this when Supabase connection is restored

echo "🚀 Healthcare System Migration Script"
echo "====================================="

# Check if connection is working
echo "🔍 Testing Supabase connection..."
if node test-supabase-connection.js; then
    echo "✅ Connection successful! Starting migrations..."
else
    echo "❌ Connection failed. Please check Supabase status and try again."
    exit 1
fi

echo ""
echo "📋 Applying migrations in order..."

# Phase 1: Core Tables
echo "🏥 Phase 1: Creating core healthcare tables..."
node apply-single-migration.js 001_create_core_tables_fixed.sql

# Phase 2: Performance Indexes
echo "📊 Phase 2: Adding performance indexes..."
node apply-single-migration.js 002_performance_indexes.sql

# Phase 3: System Administration
echo "⚙️ Phase 3: System administration tables..."
node apply-single-migration.js 030_system_admin_tables.sql
node apply-single-migration.js 031_system_rls.sql
node apply-single-migration.js 032_dynamic_content_tables.sql
node apply-single-migration.js 033_roles_users_system.sql
node apply-single-migration.js 034_patients_doctors_appointments.sql
node apply-single-migration.js 035_insurance_payments_claims.sql
node apply-single-migration.js 036_medical_records_files.sql
node apply-single-migration.js 036_reports_metrics.sql

# Phase 4: Chatbot System
echo "🤖 Phase 4: Chatbot system tables..."
node apply-single-migration.js 010_chatbot_tables.sql
node apply-single-migration.js 011_chatbot_indexes.sql
node apply-single-migration.js 012_chatbot_rls.sql
node apply-single-migration.js 037_chatbot_system.sql

# Phase 5: CRM System
echo "💼 Phase 5: CRM system tables..."
node apply-single-migration.js 020_crm_tables.sql
node apply-single-migration.js 021_crm_indexes.sql
node apply-single-migration.js 022_crm_rls.sql

echo ""
echo "🎉 All migrations completed!"
echo "🔍 Testing final schema..."
node scripts/validate-schema.js

echo ""
echo "✅ Migration process finished!"
echo "🚀 You can now start the application with: npm run dev"
