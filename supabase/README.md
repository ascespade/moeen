# Database Schema Files

## Centralized Migration and Seed Files

This directory contains the **centralized** database schema files imported from the live Supabase database.

### Files

1. **`00_complete_migration.sql`** (198 KB)
   - Complete database schema from live database
   - All tables, indexes, constraints, triggers, and functions
   - Imported from project: `socwpqzcalgvpzjwavgh`

2. **`00_complete_seed.sql`** (2 KB)  
   - Initial seed data
   - Roles, languages, and translations

### How to Use

#### Apply to Fresh Database

```bash
# Apply migration (creates all tables)
psql <connection_string> -f 00_complete_migration.sql

# Apply seed data (inserts initial data)
psql <connection_string> -f 00_complete_seed.sql
```

#### Or via Supabase Dashboard

1. Open Supabase SQL Editor
2. Copy contents of `00_complete_migration.sql`
3. Paste and run
4. Repeat for `00_complete_seed.sql`

### What's Included

The schema includes 60+ tables covering:

- **Healthcare**: users, patients, doctors, appointments, medical records
- **CRM**: conversations, messages, customers, leads, deals
- **Payments**: payments, insurance claims, transactions
- **System**: audit logs, settings, translations, roles
- **Chatbot & AI**: flows, conversations, templates, training data
- **Analytics**: reports, metrics, dashboards

### Database Stats

- **Tables**: 60+ tables
- **Views**: 12+ views  
- **Functions**: 40+ functions
- **Enums**: 11 enums
- **Total Size**: ~200 KB

### Notes

- All individual migration files have been consolidated
- Schema is imported from live production database
- Ready for deployment to any environment

---

**Last Updated**: Based on live database schema from project `moeen`

