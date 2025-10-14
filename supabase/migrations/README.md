# Database Migration Guide

## Overview

This directory contains all database migrations for the Moeen healthcare platform. Migrations are organized by module and include CUID implementation, chatbot system, CRM, and system administration features.

## Migration Files

### Core Healthcare Tables
- `001_add_public_id_core_tables.sql` - Adds public_id columns to existing healthcare tables
- `002_add_public_id_appointments.sql` - (Legacy) Appointment public_id migration
- `003_add_public_id_sessions.sql` - (Legacy) Session public_id migration
- `004_user_preferences.sql` - User preferences table

### Chatbot System
- `010_chatbot_tables.sql` - Core chatbot tables (flows, nodes, edges, templates, integrations)
- `011_chatbot_indexes.sql` - Performance indexes for chatbot tables
- `012_chatbot_rls.sql` - Row Level Security policies for chatbot tables

### CRM System
- `020_crm_tables.sql` - CRM tables (leads, deals, activities)
- `021_crm_indexes.sql` - Performance indexes for CRM tables
- `022_crm_rls.sql` - Row Level Security policies for CRM tables

### System Administration
- `030_system_admin_tables.sql` - System tables (notifications, audit logs, roles, settings)
- `031_system_rls.sql` - Row Level Security policies for system tables

## Scripts

### `scripts/backfill-public-ids.js`
Backfills public_id values for existing records.

**Usage:**
```bash
# Dry run (safe)
DRY_RUN=true node scripts/backfill-public-ids.js

# Actual backfill
node scripts/backfill-public-ids.js
```

### `scripts/validate-schema.js`
Validates database schema integrity.

**Usage:**
```bash
node scripts/validate-schema.js
```

### `scripts/apply-migrations.sh`
Applies all migrations with backup and validation.

**Usage:**
```bash
# Set environment variables first
export DATABASE_URL="postgresql://..."
export SUPABASE_PROJECT_REF="your-project-ref"

# Run migrations
./scripts/apply-migrations.sh
```

## Environment Variables

Required environment variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/moeen_db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_REF=your-project-ref
```

## Safety Features

- ✅ All migrations are idempotent (use `IF NOT EXISTS`)
- ✅ Automatic backups before migrations
- ✅ Dry-run mode for backfill operations
- ✅ Transaction safety with rollback on errors
- ✅ Schema validation after each migration
- ✅ Comprehensive error logging

## CUID Implementation

The system uses a hybrid CUID approach:

1. **Legacy CUID**: Custom implementation for backward compatibility
2. **Production CUID**: `@paralleldrive/cuid2` for new implementations
3. **Public IDs**: Prefixed identifiers for API use (e.g., `pat_xyz123`)

### Entity Prefixes

- `pat_` - Patients
- `apt_` - Appointments
- `ses_` - Sessions
- `clm_` - Insurance Claims
- `flw_` - Chatbot Flows
- `nod_` - Chatbot Nodes
- `edg_` - Chatbot Edges
- `cnv_` - Conversations
- `msg_` - Messages
- `led_` - CRM Leads
- `del_` - CRM Deals
- `act_` - CRM Activities
- `ntf_` - Notifications
- `aud_` - Audit Logs
- `rol_` - Roles
- `set_` - Settings

## Rollback Procedures

If you need to rollback migrations:

1. **Restore from backup:**
   ```bash
   psql $DATABASE_URL < backup/migrations/pre_migration_backup.sql
   ```

2. **Manual rollback (if needed):**
   ```sql
   -- Example: Remove public_id columns
   ALTER TABLE patients DROP COLUMN IF EXISTS public_id;
   ALTER TABLE appointments DROP COLUMN IF EXISTS public_id;
   -- ... etc
   ```

## Validation

After running migrations, validate the schema:

```bash
# Check schema integrity
node scripts/validate-schema.js

# Test application
npm run build
npm run dev
```

## Troubleshooting

### Common Issues

1. **Migration fails**: Check logs in `logs/` directory
2. **Backfill errors**: Use dry-run mode first
3. **Permission issues**: Ensure database user has necessary privileges
4. **Connection errors**: Verify DATABASE_URL format

### Logs

All operations are logged to:
- `logs/migration.log` - Migration operations
- `logs/backfill.log` - Backfill operations
- `logs/validation.log` - Schema validation results

## Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Test with dry-run mode
4. Contact the development team
