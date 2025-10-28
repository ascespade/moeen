# 🗄️ Database Migrations

## 📋 Migration Overview
This directory contains all database migration files for the Moeen Medical Center system. Migrations are organized chronologically and by module functionality.

## 📁 Migration Structure

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

## 🚀 Running Migrations

### Apply All Migrations
```bash
npm run migrate
```

### Apply Specific Migration
```bash
npm run migrate:single <migration_number>
```

### Rollback Migration
```bash
npm run migrate:rollback <migration_number>
```

### Check Migration Status
```bash
npm run migrate:status
```

## 📊 Database Schema Overview

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

## 🔧 Migration Guidelines

### Creating New Migrations
1. Use sequential numbering (053, 054, etc.)
2. Include descriptive names
3. Add proper comments
4. Test on development environment first
5. Include rollback procedures

### Migration Naming Convention
```
{number}_{module}_{description}.sql
```

Examples:
- `053_user_preferences.sql`
- `054_advanced_analytics.sql`
- `055_mobile_app_support.sql`

## ⚠️ Important Notes
- Always backup database before running migrations
- Test migrations in development environment first
- Never modify existing migration files
- Use transactions for complex migrations
- Document any breaking changes

## 📈 Migration Status
- **Total Migrations**: 18
- **Applied**: 18
- **Pending**: 0
- **Failed**: 0
- **Last Updated**: October 2024

---
*For technical support, refer to the developer guide or contact the database team.*