#!/bin/bash

# ========================================
# COMPLETE DATABASE MIGRATION SCRIPT
# سكريبت إكمال هجرة قاعدة البيانات
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
LOG_FILE="database/migrations/migration_$(date +%Y%m%d_%H%M%S).log"

# Create logs directory if it doesn't exist
mkdir -p database/migrations/logs

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}HEALTHCARE DATABASE MIGRATION SCRIPT${NC}"
echo -e "${BLUE}سكريبت هجرة قاعدة البيانات الطبية${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to log messages
log_message() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to check if database exists
check_database() {
    log_message "${YELLOW}Checking database connection...${NC}"
    
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        log_message "${GREEN}✓ Database connection successful${NC}"
        return 0
    else
        log_message "${RED}✗ Database connection failed${NC}"
        log_message "${YELLOW}Creating database...${NC}"
        
        # Create database if it doesn't exist
        PGPASSWORD="$DB_PASSWORD" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" || {
            log_message "${RED}✗ Failed to create database${NC}"
            exit 1
        }
        
        log_message "${GREEN}✓ Database created successfully${NC}"
        return 0
    fi
}

# Function to run SQL file
run_sql_file() {
    local file="$1"
    local description="$2"
    
    if [ ! -f "$file" ]; then
        log_message "${RED}✗ File not found: $file${NC}"
        return 1
    fi
    
    log_message "${YELLOW}Running: $description${NC}"
    log_message "${BLUE}File: $file${NC}"
    
    if psql "$DATABASE_URL" -f "$file" >> "$LOG_FILE" 2>&1; then
        log_message "${GREEN}✓ $description completed successfully${NC}"
        return 0
    else
        log_message "${RED}✗ $description failed${NC}"
        return 1
    fi
}

# Function to create backup
create_backup() {
    log_message "${YELLOW}Creating database backup...${NC}"
    
    local backup_file="database/backups/backup_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p database/backups
    
    if pg_dump "$DATABASE_URL" > "$backup_file" 2>/dev/null; then
        log_message "${GREEN}✓ Backup created: $backup_file${NC}"
        echo "$backup_file" > database/backups/latest_backup.txt
    else
        log_message "${YELLOW}⚠ Backup creation failed (continuing anyway)${NC}"
    fi
}

# Function to validate schema
validate_schema() {
    log_message "${YELLOW}Validating database schema...${NC}"
    
    local validation_queries=(
        "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"
        "SELECT COUNT(*) as user_count FROM users;"
        "SELECT COUNT(*) as patient_count FROM patients;"
        "SELECT COUNT(*) as doctor_count FROM doctors;"
        "SELECT COUNT(*) as appointment_count FROM appointments;"
        "SELECT COUNT(*) as medical_record_count FROM medical_records;"
        "SELECT COUNT(*) as notification_count FROM notifications;"
        "SELECT COUNT(*) as translation_count FROM translations;"
    )
    
    for query in "${validation_queries[@]}"; do
        local result=$(psql "$DATABASE_URL" -t -c "$query" 2>/dev/null | xargs)
        if [ -n "$result" ] && [ "$result" != "0" ]; then
            log_message "${GREEN}✓ Query result: $result${NC}"
        else
            log_message "${YELLOW}⚠ Query result: $result${NC}"
        fi
    done
}

# Main execution
main() {
    log_message "${BLUE}Starting migration process...${NC}"
    log_message "${BLUE}Database: $DB_NAME${NC}"
    log_message "${BLUE}Host: $DB_HOST:$DB_PORT${NC}"
    log_message "${BLUE}User: $DB_USER${NC}"
    log_message "${BLUE}Log file: $LOG_FILE${NC}"
    echo ""
    
    # Step 1: Check database connection
    if ! check_database; then
        log_message "${RED}✗ Database check failed. Exiting.${NC}"
        exit 1
    fi
    
    # Step 2: Create backup
    create_backup
    
    # Step 3: Run main schema
    log_message "${BLUE}Step 1: Creating main database schema...${NC}"
    if ! run_sql_file "database/schema/complete_schema.sql" "Main database schema"; then
        log_message "${RED}✗ Schema creation failed. Exiting.${NC}"
        exit 1
    fi
    
    # Step 4: Run seed data
    log_message "${BLUE}Step 2: Inserting seed data...${NC}"
    
    # Run seed files in order
    local seed_files=(
        "database/seeds/01_roles_and_users.sql:Roles and Users"
        "database/seeds/02_doctors_and_patients.sql:Doctors and Patients"
        "database/seeds/03_appointments_and_medical_records.sql:Appointments and Medical Records"
        "database/seeds/04_payments_and_insurance.sql:Payments and Insurance"
        "database/seeds/05_notifications_and_system_data.sql:Notifications and System Data"
    )
    
    for seed_info in "${seed_files[@]}"; do
        IFS=':' read -r file description <<< "$seed_info"
        if ! run_sql_file "$file" "$description"; then
            log_message "${RED}✗ Seed data insertion failed: $description${NC}"
            exit 1
        fi
    done
    
    # Step 5: Validate schema
    validate_schema
    
    # Step 6: Final summary
    log_message "${BLUE}========================================${NC}"
    log_message "${GREEN}MIGRATION COMPLETED SUCCESSFULLY!${NC}"
    log_message "${GREEN}تم إكمال الهجرة بنجاح!${NC}"
    log_message "${BLUE}========================================${NC}"
    
    # Display summary statistics
    log_message "${YELLOW}Database Summary:${NC}"
    
    local stats_queries=(
        "users:SELECT COUNT(*) FROM users;"
        "patients:SELECT COUNT(*) FROM patients;"
        "doctors:SELECT COUNT(*) FROM doctors;"
        "appointments:SELECT COUNT(*) FROM appointments;"
        "medical_records:SELECT COUNT(*) FROM medical_records;"
        "notifications:SELECT COUNT(*) FROM notifications;"
        "translations:SELECT COUNT(*) FROM translations;"
        "system_settings:SELECT COUNT(*) FROM system_settings;"
    )
    
    for stat_info in "${stats_queries[@]}"; do
        IFS=':' read -r table query <<< "$stat_info"
        local count=$(psql "$DATABASE_URL" -t -c "$query" 2>/dev/null | xargs)
        log_message "${GREEN}  $table: $count records${NC}"
    done
    
    log_message "${BLUE}========================================${NC}"
    log_message "${GREEN}Database is ready for use!${NC}"
    log_message "${GREEN}قاعدة البيانات جاهزة للاستخدام!${NC}"
    log_message "${BLUE}========================================${NC}"
}

# Run main function
main "$@"