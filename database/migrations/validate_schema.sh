#!/bin/bash

# ========================================
# DATABASE SCHEMA VALIDATION SCRIPT
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

# Database URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Log file
LOG_FILE="database/migrations/validation_$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}DATABASE SCHEMA VALIDATION SCRIPT${NC}"
echo -e "${BLUE}سكريبت التحقق من صحة قاعدة البيانات${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to log messages
log_message() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to check database connection
check_connection() {
    log_message "${YELLOW}Checking database connection...${NC}"
    
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        log_message "${GREEN}✓ Database connection successful${NC}"
        return 0
    else
        log_message "${RED}✗ Database connection failed${NC}"
        return 1
    fi
}

# Function to validate tables
validate_tables() {
    log_message "${YELLOW}Validating database tables...${NC}"
    
    local required_tables=(
        "users"
        "roles"
        "patients"
        "doctors"
        "appointments"
        "medical_records"
        "file_uploads"
        "insurance_claims"
        "payments"
        "notifications"
        "notification_templates"
        "audit_logs"
        "system_settings"
        "languages"
        "translations"
        "reports"
        "system_metrics"
        "chatbot_flows"
        "chatbot_conversations"
        "chatbot_messages"
        "crm_leads"
        "crm_activities"
    )
    
    local missing_tables=()
    local existing_tables=()
    
    for table in "${required_tables[@]}"; do
        if psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$table');" | grep -q "t"; then
            log_message "${GREEN}✓ Table exists: $table${NC}"
            existing_tables+=("$table")
        else
            log_message "${RED}✗ Table missing: $table${NC}"
            missing_tables+=("$table")
        fi
    done
    
    log_message "${BLUE}Table validation summary:${NC}"
    log_message "${GREEN}  Existing tables: ${#existing_tables[@]}${NC}"
    log_message "${RED}  Missing tables: ${#missing_tables[@]}${NC}"
    
    if [ ${#missing_tables[@]} -gt 0 ]; then
        log_message "${RED}Missing tables: ${missing_tables[*]}${NC}"
        return 1
    fi
    
    return 0
}

# Function to validate indexes
validate_indexes() {
    log_message "${YELLOW}Validating database indexes...${NC}"
    
    local required_indexes=(
        "idx_users_email"
        "idx_users_role"
        "idx_patients_user_id"
        "idx_patients_medical_record"
        "idx_doctors_user_id"
        "idx_doctors_license"
        "idx_appointments_patient_id"
        "idx_appointments_doctor_id"
        "idx_appointments_scheduled_at"
        "idx_medical_records_patient_id"
        "idx_notifications_user_id"
        "idx_audit_logs_user_id"
        "idx_translations_language_code"
    )
    
    local missing_indexes=()
    local existing_indexes=()
    
    for index in "${required_indexes[@]}"; do
        if psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = '$index');" | grep -q "t"; then
            log_message "${GREEN}✓ Index exists: $index${NC}"
            existing_indexes+=("$index")
        else
            log_message "${RED}✗ Index missing: $index${NC}"
            missing_indexes+=("$index")
        fi
    done
    
    log_message "${BLUE}Index validation summary:${NC}"
    log_message "${GREEN}  Existing indexes: ${#existing_indexes[@]}${NC}"
    log_message "${RED}  Missing indexes: ${#missing_indexes[@]}${NC}"
    
    if [ ${#missing_indexes[@]} -gt 0 ]; then
        log_message "${RED}Missing indexes: ${missing_indexes[*]}${NC}"
        return 1
    fi
    
    return 0
}

# Function to validate data integrity
validate_data_integrity() {
    log_message "${YELLOW}Validating data integrity...${NC}"
    
    local integrity_checks=(
        "SELECT COUNT(*) FROM users WHERE role NOT IN ('patient', 'doctor', 'staff', 'supervisor', 'admin');"
        "SELECT COUNT(*) FROM patients WHERE user_id NOT IN (SELECT id FROM users);"
        "SELECT COUNT(*) FROM doctors WHERE user_id NOT IN (SELECT id FROM users);"
        "SELECT COUNT(*) FROM appointments WHERE patient_id NOT IN (SELECT id FROM patients);"
        "SELECT COUNT(*) FROM appointments WHERE doctor_id NOT IN (SELECT id FROM doctors);"
        "SELECT COUNT(*) FROM medical_records WHERE patient_id NOT IN (SELECT id FROM patients);"
        "SELECT COUNT(*) FROM medical_records WHERE doctor_id NOT IN (SELECT id FROM doctors);"
        "SELECT COUNT(*) FROM notifications WHERE user_id NOT IN (SELECT id FROM users);"
        "SELECT COUNT(*) FROM payments WHERE patient_id NOT IN (SELECT id FROM patients);"
        "SELECT COUNT(*) FROM insurance_claims WHERE patient_id NOT IN (SELECT id FROM patients);"
    )
    
    local failed_checks=0
    
    for check in "${integrity_checks[@]}"; do
        local result=$(psql "$DATABASE_URL" -t -c "$check" 2>/dev/null | xargs)
        if [ "$result" = "0" ]; then
            log_message "${GREEN}✓ Data integrity check passed${NC}"
        else
            log_message "${RED}✗ Data integrity check failed: $result violations${NC}"
            ((failed_checks++))
        fi
    done
    
    if [ $failed_checks -eq 0 ]; then
        log_message "${GREEN}✓ All data integrity checks passed${NC}"
        return 0
    else
        log_message "${RED}✗ $failed_checks data integrity checks failed${NC}"
        return 1
    fi
}

# Function to validate RLS policies
validate_rls_policies() {
    log_message "${YELLOW}Validating RLS policies...${NC}"
    
    local tables_with_rls=(
        "users"
        "patients"
        "doctors"
        "appointments"
        "medical_records"
        "notifications"
        "audit_logs"
    )
    
    local missing_policies=()
    
    for table in "${tables_with_rls[@]}"; do
        if psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM pg_policies WHERE tablename = '$table');" | grep -q "t"; then
            log_message "${GREEN}✓ RLS policies exist for: $table${NC}"
        else
            log_message "${RED}✗ RLS policies missing for: $table${NC}"
            missing_policies+=("$table")
        fi
    done
    
    if [ ${#missing_policies[@]} -eq 0 ]; then
        log_message "${GREEN}✓ All RLS policies are in place${NC}"
        return 0
    else
        log_message "${RED}✗ RLS policies missing for: ${missing_policies[*]}${NC}"
        return 1
    fi
}

# Function to validate functions and triggers
validate_functions_triggers() {
    log_message "${YELLOW}Validating functions and triggers...${NC}"
    
    # Check for update_updated_at_column function
    if psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column');" | grep -q "t"; then
        log_message "${GREEN}✓ Function exists: update_updated_at_column${NC}"
    else
        log_message "${RED}✗ Function missing: update_updated_at_column${NC}"
        return 1
    fi
    
    # Check for triggers
    local tables_with_triggers=(
        "users"
        "patients"
        "doctors"
        "appointments"
        "medical_records"
        "insurance_claims"
        "payments"
        "notification_templates"
        "system_settings"
        "translations"
        "chatbot_flows"
        "crm_leads"
    )
    
    local missing_triggers=()
    
    for table in "${tables_with_triggers[@]}"; do
        if psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_${table}_updated_at');" | grep -q "t"; then
            log_message "${GREEN}✓ Trigger exists for: $table${NC}"
        else
            log_message "${RED}✗ Trigger missing for: $table${NC}"
            missing_triggers+=("$table")
        fi
    done
    
    if [ ${#missing_triggers[@]} -eq 0 ]; then
        log_message "${GREEN}✓ All triggers are in place${NC}"
        return 0
    else
        log_message "${RED}✗ Triggers missing for: ${missing_triggers[*]}${NC}"
        return 1
    fi
}

# Function to get database statistics
get_database_stats() {
    log_message "${YELLOW}Database Statistics:${NC}"
    
    local stats_queries=(
        "Total Tables:SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
        "Total Indexes:SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';"
        "Total Functions:SELECT COUNT(*) FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');"
        "Total Triggers:SELECT COUNT(*) FROM pg_trigger WHERE tgrelid IN (SELECT oid FROM pg_class WHERE relkind = 'r' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'));"
        "Total RLS Policies:SELECT COUNT(*) FROM pg_policies;"
        "Database Size:SELECT pg_size_pretty(pg_database_size('$DB_NAME'));"
    )
    
    for stat_info in "${stats_queries[@]}"; do
        IFS=':' read -r label query <<< "$stat_info"
        local result=$(psql "$DATABASE_URL" -t -c "$query" 2>/dev/null | xargs)
        log_message "${BLUE}  $label: $result${NC}"
    done
}

# Main execution
main() {
    log_message "${BLUE}Starting schema validation...${NC}"
    log_message "${BLUE}Database: $DB_NAME${NC}"
    log_message "${BLUE}Host: $DB_HOST:$DB_PORT${NC}"
    log_message "${BLUE}User: $DB_USER${NC}"
    log_message "${BLUE}Log file: $LOG_FILE${NC}"
    echo ""
    
    local validation_passed=true
    
    # Check connection
    if ! check_connection; then
        log_message "${RED}✗ Cannot proceed without database connection${NC}"
        exit 1
    fi
    
    # Validate tables
    if ! validate_tables; then
        validation_passed=false
    fi
    
    # Validate indexes
    if ! validate_indexes; then
        validation_passed=false
    fi
    
    # Validate data integrity
    if ! validate_data_integrity; then
        validation_passed=false
    fi
    
    # Validate RLS policies
    if ! validate_rls_policies; then
        validation_passed=false
    fi
    
    # Validate functions and triggers
    if ! validate_functions_triggers; then
        validation_passed=false
    fi
    
    # Get database statistics
    get_database_stats
    
    # Final result
    log_message "${BLUE}========================================${NC}"
    if [ "$validation_passed" = true ]; then
        log_message "${GREEN}VALIDATION PASSED!${NC}"
        log_message "${GREEN}تم التحقق بنجاح!${NC}"
        log_message "${GREEN}Database schema is valid and ready for use.${NC}"
    else
        log_message "${RED}VALIDATION FAILED!${NC}"
        log_message "${RED}فشل التحقق!${NC}"
        log_message "${RED}Please check the issues above and fix them.${NC}"
        exit 1
    fi
    log_message "${BLUE}========================================${NC}"
}

# Run main function
main "$@"