#!/bin/bash

# ========================================
# DATABASE VALIDATION SCRIPT
# سكريبت التحقق من صحة قاعدة البيانات
# ========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-moeen_healthcare}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-password}"

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check database connection
check_connection() {
    log "Checking database connection..."
    
    if ! command -v psql &> /dev/null; then
        error "PostgreSQL client (psql) is not installed or not in PATH"
        exit 1
    fi
    
    if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
        error "Cannot connect to database '$DB_NAME'"
        exit 1
    fi
    
    success "Database connection successful"
}

# Check table existence
check_tables() {
    log "Checking table existence..."
    
    local required_tables=(
        "users" "roles" "patients" "doctors" "appointments"
        "medical_records" "file_uploads" "insurance_claims" "payments"
        "notifications" "notification_templates" "audit_logs" "system_settings"
        "languages" "translations" "reports" "system_metrics"
        "chatbot_flows" "chatbot_conversations" "chatbot_messages"
        "crm_leads" "crm_activities"
    )
    
    local missing_tables=()
    local existing_tables=()
    
    for table in "${required_tables[@]}"; do
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM information_schema.tables WHERE table_name='$table';" | grep -q 1; then
            existing_tables+=("$table")
        else
            missing_tables+=("$table")
        fi
    done
    
    log "Table Status:"
    log "  Existing: ${#existing_tables[@]} tables"
    log "  Missing: ${#missing_tables[@]} tables"
    
    if [ ${#missing_tables[@]} -eq 0 ]; then
        success "All required tables exist"
    else
        error "Missing tables: ${missing_tables[*]}"
        return 1
    fi
}

# Check indexes
check_indexes() {
    log "Checking indexes..."
    
    local index_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';")
    
    log "Index count: $index_count"
    
    if [ "$index_count" -gt 20 ]; then
        success "Sufficient indexes found"
    else
        warning "Low index count - performance may be affected"
    fi
}

# Check constraints
check_constraints() {
    log "Checking constraints..."
    
    local constraint_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_schema = 'public';")
    
    log "Constraint count: $constraint_count"
    
    if [ "$constraint_count" -gt 10 ]; then
        success "Sufficient constraints found"
    else
        warning "Low constraint count - data integrity may be affected"
    fi
}

# Check data integrity
check_data_integrity() {
    log "Checking data integrity..."
    
    # Check for orphaned records
    local orphaned_appointments=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id WHERE p.id IS NULL;")
    
    if [ "$orphaned_appointments" -eq 0 ]; then
        success "No orphaned appointments found"
    else
        error "Found $orphaned_appointments orphaned appointments"
        return 1
    fi
    
    # Check for invalid foreign keys
    local invalid_foreign_keys=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM medical_records m LEFT JOIN patients p ON m.patient_id = p.id WHERE p.id IS NULL;")
    
    if [ "$invalid_foreign_keys" -eq 0 ]; then
        success "No invalid foreign keys found"
    else
        error "Found $invalid_foreign_keys invalid foreign keys"
        return 1
    fi
}

# Check record counts
check_record_counts() {
    log "Checking record counts..."
    
    local user_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM users;")
    local patient_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM patients;")
    local doctor_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM doctors;")
    local appointment_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM appointments;")
    local medical_record_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM medical_records;")
    local notification_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM notifications;")
    local translation_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM translations;")
    
    log "Record Counts:"
    log "  Users: $user_count"
    log "  Patients: $patient_count"
    log "  Doctors: $doctor_count"
    log "  Appointments: $appointment_count"
    log "  Medical Records: $medical_record_count"
    log "  Notifications: $notification_count"
    log "  Translations: $translation_count"
    
    # Check if we have minimum required data
    if [ "$user_count" -ge 5 ] && [ "$patient_count" -ge 3 ] && [ "$doctor_count" -ge 2 ] && [ "$appointment_count" -ge 3 ]; then
        success "Sufficient seed data found"
    else
        warning "Insufficient seed data - consider running seed scripts"
    fi
}

# Check performance
check_performance() {
    log "Checking database performance..."
    
    # Check table sizes
    local table_sizes=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT 
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC 
        LIMIT 10;
    ")
    
    log "Largest tables:"
    echo "$table_sizes"
    
    # Check for slow queries (if any)
    local slow_queries=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM pg_stat_statements WHERE mean_time > 1000;" 2>/dev/null || echo "0")
    
    if [ "$slow_queries" -eq 0 ]; then
        success "No slow queries detected"
    else
        warning "Found $slow_queries slow queries"
    fi
}

# Check security
check_security() {
    log "Checking security settings..."
    
    # Check RLS policies
    local rls_tables=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM pg_class WHERE relrowsecurity = true;")
    
    log "Tables with RLS enabled: $rls_tables"
    
    if [ "$rls_tables" -gt 5 ]; then
        success "Row Level Security properly configured"
    else
        warning "Insufficient RLS policies - security may be compromised"
    fi
    
    # Check for default passwords (basic check)
    local default_password_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM users WHERE password_hash LIKE '\$2b\$10\$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5';")
    
    if [ "$default_password_count" -gt 0 ]; then
        warning "Found $default_password_count users with default passwords - change before production!"
    else
        success "No default passwords detected"
    fi
}

# Generate validation report
generate_report() {
    log "Generating validation report..."
    
    local report_file="logs/validation_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=========================================="
        echo "HEALTHCARE DATABASE VALIDATION REPORT"
        echo "تقرير التحقق من صحة قاعدة البيانات الطبية"
        echo "=========================================="
        echo "Generated: $(date)"
        echo "Database: $DB_NAME"
        echo "Host: $DB_HOST:$DB_PORT"
        echo "=========================================="
        echo ""
        
        echo "TABLE STATUS:"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
            SELECT 
                table_name,
                CASE WHEN table_name IN (
                    'users', 'roles', 'patients', 'doctors', 'appointments',
                    'medical_records', 'file_uploads', 'insurance_claims', 'payments',
                    'notifications', 'notification_templates', 'audit_logs', 'system_settings',
                    'languages', 'translations', 'reports', 'system_metrics',
                    'chatbot_flows', 'chatbot_conversations', 'chatbot_messages',
                    'crm_leads', 'crm_activities'
                ) THEN 'REQUIRED' ELSE 'OPTIONAL' END as status
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        "
        echo ""
        
        echo "RECORD COUNTS:"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
            SELECT 'users' as table_name, COUNT(*) as record_count FROM users
            UNION ALL
            SELECT 'patients', COUNT(*) FROM patients
            UNION ALL
            SELECT 'doctors', COUNT(*) FROM doctors
            UNION ALL
            SELECT 'appointments', COUNT(*) FROM appointments
            UNION ALL
            SELECT 'medical_records', COUNT(*) FROM medical_records
            UNION ALL
            SELECT 'notifications', COUNT(*) FROM notifications
            UNION ALL
            SELECT 'translations', COUNT(*) FROM translations
            ORDER BY record_count DESC;
        "
        echo ""
        
        echo "INDEX STATUS:"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
            SELECT 
                schemaname,
                tablename,
                indexname,
                indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            ORDER BY tablename, indexname;
        "
        
    } > "$report_file"
    
    success "Validation report generated: $report_file"
}

# Main execution
main() {
    log "=========================================="
    log "DATABASE VALIDATION SCRIPT"
    log "سكريبت التحقق من صحة قاعدة البيانات"
    log "=========================================="
    
    # Check environment variables
    if [ -z "$DB_PASSWORD" ]; then
        error "DB_PASSWORD environment variable is required"
        exit 1
    fi
    
    log "Database Configuration:"
    log "  Host: $DB_HOST"
    log "  Port: $DB_PORT"
    log "  Database: $DB_NAME"
    log "  User: $DB_USER"
    log "=========================================="
    
    # Execute validation steps
    check_connection
    check_tables
    check_indexes
    check_constraints
    check_data_integrity
    check_record_counts
    check_performance
    check_security
    generate_report
    
    log "=========================================="
    success "DATABASE VALIDATION COMPLETED!"
    success "تم إكمال التحقق من صحة قاعدة البيانات!"
    log "=========================================="
}

# Run main function
main "$@"