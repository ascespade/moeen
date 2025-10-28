# Database Migrations - Moeen Healthcare System

## Overview
This directory contains the authoritative database migrations for the Moeen Healthcare Management System.

**Total Migrations**: 33 files (001-083)

## Migration Structure

### Core System Migrations (001-005)
- `001_create_roles_users.sql` - User roles and authentication system
- `002_patients_doctors_appointments.sql` - Core medical entities
- `003_insurance_payments_claims.sql` - Financial and insurance system
- `004_translations.sql` - Internationalization support
- `005_reports_metrics.sql` - Reporting and analytics

### Module Enhancements (040-052)
- `040_appointments_module_enhancement.sql` - Enhanced appointment system
- `041_appointments_triggers_functions.sql` - Appointment triggers and functions
- `042_medical_records_enhancement.sql` - Enhanced medical records
- `043_medical_records_triggers_functions.sql` - Medical records triggers
- `044_payments_module_enhancement.sql` - Enhanced payment system
- `045_payments_triggers_functions.sql` - Payment triggers and functions
- `046_chatbot_ai_enhancement.sql` - AI chatbot system
- `047_chatbot_triggers_functions.sql` - Chatbot triggers and functions
- `048_crm_enhancement.sql` - CRM system enhancement
- `049_crm_triggers_functions.sql` - CRM triggers and functions
- `050_conversations_enhancement.sql` - Conversation system
- `051_insurance_analytics_notifications.sql` - Insurance analytics
- `052_settings_admin_final.sql` - Final admin settings

### Advanced Features (053-083)
- `053_integration_configs.sql` - Integration configurations
- `054_crm_and_health_tables.sql` - CRM and health tables
- `060_rls_policies_complete.sql` - Row Level Security policies
- `070_session_types.sql` - Session type definitions
- `071_therapist_schedules.sql` - Therapist scheduling
- `072_iep_system.sql` - Individual Education Plans
- `073_supervisor_notifications.sql` - Supervisor notification system
- `074_soft_delete_system.sql` - Soft delete functionality
- `075_reminder_system.sql` - Reminder system
- `076_booking_validation.sql` - Booking validation
- `077_search_functions.sql` - Search functionality
- `080_dynamic_settings_system.sql` - Dynamic settings
- `083_dynamic_dashboard_statistics.sql` - Dynamic dashboard statistics

## Running Migrations

### Prerequisites
- PostgreSQL database (Supabase or local)
- Connection credentials in environment variables

### Apply All Migrations
```bash
npm run migrate
```

### Apply Specific Migration
```bash
npm run migrate:single <migration_number>
```

### Check Migration Status
```bash
npm run migrate:status
```

### Rollback Migration
```bash
npm run migrate:rollback <migration_number>
```

## Migration Order

Migrations must be applied in numerical order:
1. Core tables first (001-005)
2. Then module enhancements (040-052)
3. Finally advanced features (053-083)

## Database Schema Overview

### Core Tables
- `users` - User accounts and profiles
- `roles` - User roles and permissions
- `patients` - Patient information
- `doctors` - Doctor profiles and schedules
- `appointments` - Appointment scheduling
- `medical_records` - Medical history and records
- `insurance_claims` - Insurance processing
- `payments` - Payment transactions
- `notifications` - System notifications
- `reports` - Generated reports
- `settings` - System configuration

### Advanced Tables
- `crm_contacts` - CRM contact management
- `crm_deals` - Sales and deal tracking
- `crm_activities` - Activity logging
- `chatbot_conversations` - AI chatbot data
- `conversations` - Communication threads
- `family_support` - Family communication
- `therapy_sessions` - Therapy management
- `progress_tracking` - Patient progress
- `analytics_events` - System analytics
- `security_audits` - Security logging
- `iep_documents` - Individual education plans
- `supervisor_notifications` - Supervisor alerts
- `dynamic_settings` - Dynamic configurations
- `dashboard_statistics` - Dashboard analytics

## Important Notes

- Always backup database before running migrations
- Test migrations in development environment first
- Never modify existing migration files
- Use transactions for complex migrations
- Document any breaking changes
- Follow naming convention: `{number}_{module}_{description}.sql`

## Migration Guidelines

### Creating New Migrations
1. Use sequential numbering (084, 085, etc.)
2. Include descriptive names
3. Add proper comments
4. Test on development environment first
5. Include rollback procedures

### Naming Convention
```
{number}_{module}_{description}.sql
```

Examples:
- `084_user_preferences.sql`
- `085_advanced_analytics.sql`
- `086_mobile_app_support.sql`

## Migration Status

- **Total Migrations**: 33
- **Applied**: Check with `npm run migrate:status`
- **Last Updated**: January 2025

---

_For technical support, refer to the developer guide or contact the database team._

