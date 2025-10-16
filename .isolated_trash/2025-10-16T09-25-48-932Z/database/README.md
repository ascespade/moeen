# 🗄️ Healthcare Database Schema & Migration Guide

## 📋 Overview

This directory contains the complete database schema, seed data, and migration scripts for the Moeen Healthcare Platform. The database is designed to support a comprehensive healthcare management system with multi-language support, role-based access control, and full audit capabilities.

## 🏗️ Database Architecture

### **Core Features:**

- **25+ Tables** with complete relationships
- **30+ Indexes** for optimal performance
- **Row Level Security (RLS)** for data protection
- **Multi-language Support** (Arabic/English)
- **Audit Logging** for compliance
- **File Management** with security
- **Payment Processing** integration
- **Insurance Claims** management
- **Chatbot System** support
- **CRM Integration**

### **Database Structure:**

```
database/
├── schema/
│   └── complete_schema.sql          # Main database schema
├── seeds/
│   ├── 01_roles_and_users.sql      # User roles and accounts
│   ├── 02_doctors_and_patients.sql # Healthcare entities
│   ├── 03_appointments_and_medical_records.sql # Medical data
│   ├── 04_payments_and_insurance.sql # Financial data
│   └── 05_notifications_and_system_data.sql # System data
├── migrations/
│   ├── run_all_migrations.sh       # Complete migration script
│   ├── rollback_migration.sh       # Rollback script
│   └── validate_schema.sh          # Schema validation
└── README.md                       # This file
```

## 🚀 Quick Start

### **Prerequisites:**

- PostgreSQL 12+ or Supabase
- Bash shell (Linux/macOS/WSL)
- Database credentials

### **1. Set Environment Variables:**

```bash
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="moeen_healthcare"
export DB_USER="postgres"
export DB_PASSWORD="your_password"
```

### **2. Run Complete Migration:**

```bash
# Make scripts executable
chmod +x database/migrations/*.sh

# Run complete migration
./database/migrations/run_all_migrations.sh
```

### **3. Validate Schema:**

```bash
# Validate database schema
./database/migrations/validate_schema.sh
```

## 📊 Database Schema Details

### **Core Tables:**

#### **Users & Authentication:**

- `users` - User accounts with roles
- `roles` - Role definitions and permissions

#### **Healthcare Entities:**

- `patients` - Patient profiles and medical info
- `doctors` - Doctor profiles and specialties
- `appointments` - Appointment scheduling and management

#### **Medical Records:**

- `medical_records` - Medical documentation
- `file_uploads` - File management system

#### **Financial:**

- `payments` - Payment processing
- `insurance_claims` - Insurance claim management

#### **Communication:**

- `notifications` - System notifications
- `notification_templates` - Message templates

#### **System Administration:**

- `audit_logs` - Activity logging
- `system_settings` - Configuration
- `system_metrics` - Performance monitoring

#### **Internationalization:**

- `languages` - Supported languages
- `translations` - Multi-language content

#### **Reports & Analytics:**

- `reports` - Generated reports
- `system_metrics` - Performance data

#### **Chatbot System:**

- `chatbot_flows` - Conversation flows
- `chatbot_conversations` - Chat sessions
- `chatbot_messages` - Individual messages

#### **CRM Integration:**

- `crm_leads` - Lead management
- `crm_activities` - Activity tracking

### **Key Features:**

#### **🔒 Security:**

- Row Level Security (RLS) policies
- Encrypted sensitive data
- Audit logging for all changes
- Role-based access control

#### **🌍 Internationalization:**

- Arabic and English support
- RTL layout support
- Dynamic translation system
- Cultural date/time formatting

#### **📈 Performance:**

- Optimized indexes
- Query performance monitoring
- Connection pooling
- Caching strategies

#### **🔍 Compliance:**

- HIPAA-ready data protection
- GDPR compliance features
- Complete audit trail
- Data retention policies

## 🛠️ Migration Scripts

### **1. Complete Migration (`run_all_migrations.sh`):**

- Creates complete database schema
- Inserts all seed data
- Validates schema integrity
- Creates backup before migration
- Provides detailed logging

### **2. Rollback (`rollback_migration.sh`):**

- Restores from backup
- Drops all tables (destructive)
- Safe rollback options

### **3. Validation (`validate_schema.sh`):**

- Validates table structure
- Checks data integrity
- Verifies RLS policies
- Tests functions and triggers
- Provides statistics

## 📝 Seed Data

### **Sample Data Includes:**

- **10 Users** (Admin, Supervisor, Staff, Doctors, Patients)
- **3 Doctors** (Internal Medicine, Pediatrics, Cardiology)
- **4 Patients** (Various medical conditions)
- **6 Appointments** (Completed and pending)
- **8 Medical Records** (Diagnoses, prescriptions, lab results)
- **4 Insurance Claims** (Various statuses)
- **4 Payments** (Different methods)
- **6 Notifications** (Various types)
- **50+ Translations** (Arabic/English)
- **10+ System Settings** (Configuration)

## 🔧 Configuration

### **Environment Variables:**

```bash
# Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moeen_healthcare
DB_USER=postgres
DB_PASSWORD=your_password

# Optional: Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### **Database Settings:**

- **Character Set:** UTF-8
- **Collation:** Arabic/English
- **Timezone:** Asia/Riyadh
- **Extensions:** uuid-ossp, pgcrypto

## 📊 Performance Optimization

### **Indexes:**

- Primary key indexes
- Foreign key indexes
- Search optimization indexes
- Composite indexes for complex queries

### **Views:**

- `patient_dashboard` - Patient overview
- `doctor_dashboard` - Doctor overview
- `appointment_details` - Appointment details

### **Functions:**

- `update_updated_at_column()` - Auto-update timestamps
- Custom functions for complex operations

## 🔍 Monitoring & Maintenance

### **Audit Logging:**

- All user actions logged
- Data changes tracked
- Security events monitored
- Performance metrics collected

### **Backup Strategy:**

- Automated daily backups
- Point-in-time recovery
- Cross-region replication
- Encryption at rest

### **Health Checks:**

- Database connectivity
- Query performance
- Index usage
- Storage utilization

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Connection Failed:**

```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d postgres
```

#### **2. Permission Denied:**

```bash
# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE moeen_healthcare TO your_user;"
```

#### **3. Migration Failed:**

```bash
# Check logs
tail -f database/migrations/migration_*.log

# Rollback and retry
./database/migrations/rollback_migration.sh
./database/migrations/run_all_migrations.sh
```

#### **4. Validation Errors:**

```bash
# Run validation
./database/migrations/validate_schema.sh

# Check specific issues
psql $DATABASE_URL -c "SELECT * FROM information_schema.tables WHERE table_schema = 'public';"
```

## 📚 Additional Resources

### **Documentation:**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Healthcare Data Standards](https://www.hl7.org/)

### **Security:**

- [OWASP Database Security](https://owasp.org/www-project-database-security/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/for-professionals/security/index.html)

### **Performance:**

- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Database Indexing Best Practices](https://use-the-index-luke.com/)

## 🤝 Support

For issues or questions:

1. Check the logs first
2. Review this documentation
3. Run validation scripts
4. Contact the development team

## 📄 License

This database schema is part of the Moeen Healthcare Platform and is proprietary software.

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Database Version:** PostgreSQL 12+ / Supabase
