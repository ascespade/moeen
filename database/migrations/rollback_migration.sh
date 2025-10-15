#!/bin/bash

# ========================================
# DATABASE ROLLBACK SCRIPT
# سكريبت التراجع عن قاعدة البيانات
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
LOG_FILE="database/migrations/rollback_$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}DATABASE ROLLBACK SCRIPT${NC}"
echo -e "${BLUE}سكريبت التراجع عن قاعدة البيانات${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to log messages
log_message() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to check if backup exists
check_backup() {
    local backup_file="database/backups/latest_backup.txt"
    if [ -f "$backup_file" ]; then
        local latest_backup=$(cat "$backup_file")
        if [ -f "$latest_backup" ]; then
            log_message "${GREEN}✓ Found backup: $latest_backup${NC}"
            echo "$latest_backup"
            return 0
        fi
    fi
    
    log_message "${RED}✗ No backup found${NC}"
    return 1
}

# Function to restore from backup
restore_from_backup() {
    local backup_file="$1"
    
    log_message "${YELLOW}Restoring database from backup...${NC}"
    log_message "${BLUE}Backup file: $backup_file${NC}"
    
    # Drop existing database
    log_message "${YELLOW}Dropping existing database...${NC}"
    PGPASSWORD="$DB_PASSWORD" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" --if-exists || {
        log_message "${YELLOW}⚠ Database doesn't exist or couldn't be dropped${NC}"
    }
    
    # Create new database
    log_message "${YELLOW}Creating new database...${NC}"
    PGPASSWORD="$DB_PASSWORD" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" || {
        log_message "${RED}✗ Failed to create database${NC}"
        exit 1
    }
    
    # Restore from backup
    log_message "${YELLOW}Restoring data from backup...${NC}"
    if psql "$DATABASE_URL" < "$backup_file" >> "$LOG_FILE" 2>&1; then
        log_message "${GREEN}✓ Database restored successfully${NC}"
        return 0
    else
        log_message "${RED}✗ Database restoration failed${NC}"
        return 1
    fi
}

# Function to drop all tables
drop_all_tables() {
    log_message "${YELLOW}Dropping all tables...${NC}"
    
    local drop_script="
    -- Drop all tables in reverse dependency order
    DROP TABLE IF EXISTS chatbot_messages CASCADE;
    DROP TABLE IF EXISTS chatbot_conversations CASCADE;
    DROP TABLE IF EXISTS chatbot_flows CASCADE;
    DROP TABLE IF EXISTS crm_activities CASCADE;
    DROP TABLE IF EXISTS crm_leads CASCADE;
    DROP TABLE IF EXISTS system_metrics CASCADE;
    DROP TABLE IF EXISTS reports CASCADE;
    DROP TABLE IF EXISTS translations CASCADE;
    DROP TABLE IF EXISTS languages CASCADE;
    DROP TABLE IF EXISTS system_settings CASCADE;
    DROP TABLE IF EXISTS audit_logs CASCADE;
    DROP TABLE IF EXISTS notification_templates CASCADE;
    DROP TABLE IF EXISTS notifications CASCADE;
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS insurance_claims CASCADE;
    DROP TABLE IF EXISTS file_uploads CASCADE;
    DROP TABLE IF EXISTS medical_records CASCADE;
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TABLE IF EXISTS doctors CASCADE;
    DROP TABLE IF EXISTS patients CASCADE;
    DROP TABLE IF EXISTS roles CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    -- Drop views
    DROP VIEW IF EXISTS appointment_details CASCADE;
    DROP VIEW IF EXISTS doctor_dashboard CASCADE;
    DROP VIEW IF EXISTS patient_dashboard CASCADE;
    
    -- Drop functions
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    
    -- Drop extensions
    DROP EXTENSION IF EXISTS \"uuid-ossp\" CASCADE;
    DROP EXTENSION IF EXISTS \"pgcrypto\" CASCADE;
    "
    
    if echo "$drop_script" | psql "$DATABASE_URL" >> "$LOG_FILE" 2>&1; then
        log_message "${GREEN}✓ All tables dropped successfully${NC}"
        return 0
    else
        log_message "${RED}✗ Failed to drop tables${NC}"
        return 1
    fi
}

# Function to show rollback options
show_options() {
    log_message "${YELLOW}Rollback Options:${NC}"
    log_message "${BLUE}1. Restore from backup (recommended)${NC}"
    log_message "${BLUE}2. Drop all tables (destructive)${NC}"
    log_message "${BLUE}3. Exit without changes${NC}"
    echo ""
}

# Main execution
main() {
    log_message "${BLUE}Starting rollback process...${NC}"
    log_message "${BLUE}Database: $DB_NAME${NC}"
    log_message "${BLUE}Host: $DB_HOST:$DB_PORT${NC}"
    log_message "${BLUE}User: $DB_USER${NC}"
    log_message "${BLUE}Log file: $LOG_FILE${NC}"
    echo ""
    
    # Check if database exists
    if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        log_message "${RED}✗ Database does not exist or connection failed${NC}"
        exit 1
    fi
    
    # Show options
    show_options
    
    # Get user choice
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            log_message "${YELLOW}Option 1: Restore from backup${NC}"
            if backup_file=$(check_backup); then
                if restore_from_backup "$backup_file"; then
                    log_message "${GREEN}✓ Rollback completed successfully${NC}"
                else
                    log_message "${RED}✗ Rollback failed${NC}"
                    exit 1
                fi
            else
                log_message "${RED}✗ No backup available for restoration${NC}"
                exit 1
            fi
            ;;
        2)
            log_message "${YELLOW}Option 2: Drop all tables${NC}"
            read -p "Are you sure you want to drop all tables? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                if drop_all_tables; then
                    log_message "${GREEN}✓ All tables dropped successfully${NC}"
                else
                    log_message "${RED}✗ Failed to drop tables${NC}"
                    exit 1
                fi
            else
                log_message "${YELLOW}Operation cancelled${NC}"
                exit 0
            fi
            ;;
        3)
            log_message "${YELLOW}Exiting without changes${NC}"
            exit 0
            ;;
        *)
            log_message "${RED}Invalid choice. Exiting.${NC}"
            exit 1
            ;;
    esac
    
    log_message "${BLUE}========================================${NC}"
    log_message "${GREEN}ROLLBACK COMPLETED!${NC}"
    log_message "${GREEN}تم إكمال التراجع!${NC}"
    log_message "${BLUE}========================================${NC}"
}

# Run main function
main "$@"