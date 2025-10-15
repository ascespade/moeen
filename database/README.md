# 🗄️ Healthcare Database Schema & Migration Guide

## 📋 Overview

This directory contains the complete database schema, seed data, and migration scripts for the Moeen Healthcare Platform. The database is designed to support a comprehensive healthcare management system with multi-language support, role-based access control, and full audit capabilities.

## 🏗️ Database Architecture

### **Core Tables (25+ tables)**
- **Users & Authentication**: `users`, `roles`
- **Healthcare Entities**: `patients`, `doctors`, `appointments`
- **Medical Records**: `medical_records`, `file_uploads`
- **Financial**: `payments`, `insurance_claims`
- **Communication**: `notifications`, `notification_templates`
- **System Administration**: `audit_logs`, `system_settings`
- **Internationalization**: `languages`, `translations`
- **Analytics**: `reports`, `system_metrics`
- **AI/Chatbot**: `chatbot_flows`, `chatbot_conversations`, `chatbot_messages`
- **CRM**: `crm_leads`, `crm_activities`

### **Key Features**
- ✅ **UUID Primary Keys** with human-readable public IDs
- ✅ **Row Level Security (RLS)** for data protection
- ✅ **Comprehensive Indexing** for performance
- ✅ **Audit Logging** for compliance
- ✅ **Multi-language Support** (Arabic/English)
- ✅ **Soft Deletes** and data retention
- ✅ **JSONB Fields** for flexible data storage
- ✅ **Automated Timestamps** with triggers

## 🚀 Quick Start

### **Prerequisites**
```bash
# Required environment variables
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="moeen_healthcare"
export DB_USER="postgres"
export DB_PASSWORD="your_password"
```

### **1. Run Complete Migration**
```bash
# Make scripts executable
chmod +x database/migrations/*.sh

# Run complete migration (schema + seed data)
./database/migrations/run_all_migrations.sh
```

### **2. Validate Database**
```bash
# Validate the migration
./database/migrations/validate_database.sh
```

### **3. Rollback (if needed)**
```bash
# Rollback complete database
./database/migrations/rollback_migration.sh
```

## 📁 Directory Structure

```
database/
├── schema/
│   └── complete_schema.sql          # Complete database schema
├── seeds/
│   ├── 01_roles_and_users.sql      # Users and roles data
│   ├── 02_doctors_and_patients.sql # Healthcare entities
│   ├── 03_appointments_and_medical_records.sql # Medical data
│   ├── 04_payments_and_insurance.sql # Financial data
│   └── 05_notifications_and_system_data.sql # System data
├── migrations/
│   ├── run_all_migrations.sh       # Complete migration script
│   ├── rollback_migration.sh       # Rollback script
│   └── validate_database.sh        # Validation script
└── README.md                       # This file
```

## 🔧 Manual Migration Steps

### **Step 1: Create Database**
```sql
CREATE DATABASE moeen_healthcare;
```

### **Step 2: Run Schema**
```bash
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema/complete_schema.sql
```

### **Step 3: Run Seed Data**
```bash
# Run each seed file in order
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seeds/01_roles_and_users.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seeds/02_doctors_and_patients.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seeds/03_appointments_and_medical_records.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seeds/04_payments_and_insurance.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seeds/05_notifications_and_system_data.sql
```

## 📊 Sample Data Included

### **Users (10 records)**
- 1 Admin user
- 1 Supervisor user
- 2 Staff users
- 3 Doctor users
- 4 Patient users

### **Healthcare Data**
- 3 Doctors with specialties (Internal Medicine, Pediatrics, Cardiology)
- 4 Patients with medical histories
- 6 Appointments (completed and pending)
- 8 Medical records (diagnoses, prescriptions, lab results)
- 5 File uploads

### **Financial Data**
- 4 Insurance claims (various statuses)
- 4 Payments (different methods)

### **System Data**
- 6 Notifications
- 10 Notification templates
- 50+ Translations (Arabic/English)
- 5 Audit log entries
- System settings and configurations

## 🔒 Security Features

### **Row Level Security (RLS)**
- Users can only access their own data
- Patients can view their own medical records
- Doctors can view their patients' data
- Staff have appropriate access levels

### **Data Encryption**
- Password hashing with bcrypt
- Sensitive data encryption support
- Secure file upload handling

### **Audit Logging**
- Complete audit trail for all changes
- User action tracking
- Data modification history

## 🌐 Internationalization

### **Multi-language Support**
- Arabic (RTL) and English (LTR) support
- Database-driven translations
- Language-specific content
- RTL layout considerations

### **Translation Management**
- Namespaced translation keys
- Fallback language support
- Missing key logging
- Translation approval workflow

## 📈 Performance Optimizations

### **Indexing Strategy**
- Primary key indexes on all tables
- Foreign key indexes for relationships
- Composite indexes for common queries
- Partial indexes for filtered data

### **Query Optimization**
- Materialized views for complex reports
- Optimized joins and subqueries
- Efficient pagination support
- Caching-friendly design

## 🔍 Monitoring & Maintenance

### **Health Checks**
- Database connection validation
- Table existence verification
- Data integrity checks
- Performance monitoring

### **Backup Strategy**
- Automated backup before migrations
- Point-in-time recovery support
- Data export capabilities
- Rollback procedures

## 🛠️ Troubleshooting

### **Common Issues**

1. **Connection Failed**
   ```bash
   # Check PostgreSQL service
   sudo systemctl status postgresql
   
   # Verify connection parameters
   psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1;"
   ```

2. **Permission Denied**
   ```bash
   # Grant necessary permissions
   GRANT ALL PRIVILEGES ON DATABASE moeen_healthcare TO $DB_USER;
   ```

3. **Migration Fails**
   ```bash
   # Check logs
   tail -f logs/migration.log
   
   # Rollback and retry
   ./database/migrations/rollback_migration.sh
   ./database/migrations/run_all_migrations.sh
   ```

### **Log Files**
- `logs/migration.log` - Migration operations
- `logs/rollback.log` - Rollback operations
- `logs/validation.log` - Validation results

## 📚 API Integration

### **Connection String**
```javascript
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
```

### **Environment Variables**
```bash
# .env file
DATABASE_URL=postgresql://postgres:password@localhost:5432/moeen_healthcare
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moeen_healthcare
DB_USER=postgres
DB_PASSWORD=password
```

## 🎯 Production Deployment

### **Pre-deployment Checklist**
- [ ] Change default passwords
- [ ] Configure SSL/TLS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test rollback procedures
- [ ] Validate security settings

### **Production Considerations**
- Use connection pooling
- Enable query logging
- Set up automated backups
- Configure monitoring alerts
- Implement data retention policies

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Test with validation script
4. Contact the development team

---

**🎉 The database is now ready for production use with comprehensive healthcare management capabilities!**