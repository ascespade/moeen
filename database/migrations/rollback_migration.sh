#!/bin/bash

# ========================================
# DATABASE ROLLBACK SCRIPT
# سكريبت التراجع عن هجرة قاعدة البيانات
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
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a logs/rollback.log
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a logs/rollback.log
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a logs/rollback.log
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a logs/rollback.log
}

# Confirm rollback
confirm_rollback() {
    echo -e "${YELLOW}WARNING: This will completely remove the healthcare database!${NC}"
    echo -e "${YELLOW}تحذير: هذا سيزيل قاعدة البيانات الطبية بالكامل!${NC}"
    echo ""
    read -p "Are you sure you want to proceed? Type 'YES' to confirm: " confirmation
    
    if [ "$confirmation" != "YES" ]; then
        log "Rollback cancelled by user"
        exit 0
    fi
}

# Drop all tables
drop_tables() {
    log "Dropping all tables..."
    
    local tables=(
        "crm_activities" "crm_leads"
        "chatbot_messages" "chatbot_conversations" "chatbot_flows"
        "system_metrics" "reports"
        "translations" "languages"
        "system_settings" "audit_logs"
        "notification_templates" "notifications"
        "payments" "insurance_claims"
        "file_uploads" "medical_records"
        "appointments" "doctors" "patients"
        "roles" "users"
    )
    
    for table in "${tables[@]}"; do
        log "Dropping table: $table"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "DROP TABLE IF EXISTS $table CASCADE;" || true
    done
    
    success "All tables dropped"
}

# Drop functions and triggers
drop_functions() {
    log "Dropping functions and triggers..."
    
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    " || true
    
    success "Functions and triggers dropped"
}

# Drop views
drop_views() {
    log "Dropping views..."
    
    local views=(
        "appointment_details"
        "doctor_dashboard"
        "patient_dashboard"
    )
    
    for view in "${views[@]}"; do
        log "Dropping view: $view"
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "DROP VIEW IF EXISTS $view CASCADE;" || true
    done
    
    success "All views dropped"
}

# Drop extensions
drop_extensions() {
    log "Dropping extensions..."
    
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        DROP EXTENSION IF EXISTS pgcrypto CASCADE;
        DROP EXTENSION IF EXISTS \"uuid-ossp\" CASCADE;
    " || true
    
    success "Extensions dropped"
}

# Create backup before rollback
create_rollback_backup() {
    log "Creating backup before rollback..."
    
    local backup_file="backups/rollback_backup_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p backups
    
    PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > "$backup_file"
    
    if [ $? -eq 0 ]; then
        success "Rollback backup created: $backup_file"
    else
        warning "Failed to create rollback backup, but continuing..."
    fi
}

# Main execution
main() {
    log "=========================================="
    log "DATABASE ROLLBACK SCRIPT"
    log "سكريبت التراجع عن هجرة قاعدة البيانات"
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
    
    # Confirm rollback
    confirm_rollback
    
    # Execute rollback steps
    create_rollback_backup
    drop_views
    drop_tables
    drop_functions
    drop_extensions
    
    log "=========================================="
    success "DATABASE ROLLBACK COMPLETED SUCCESSFULLY!"
    success "تم إكمال التراجع عن قاعدة البيانات بنجاح!"
    log "=========================================="
    
    log "The healthcare database has been completely removed."
    log "تم إزالة قاعدة البيانات الطبية بالكامل."
    log ""
    log "To recreate the database, run: ./run_all_migrations.sh"
    log "لإعادة إنشاء قاعدة البيانات، قم بتشغيل: ./run_all_migrations.sh"
}

# Run main function
main "$@"