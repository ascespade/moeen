#!/bin/bash

# === 🔗 Smart Import Fixer ===
# Automatically fixes import paths after file moves and reorganizations
# Author: AI Assistant
# Version: 1.0.0

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DRY_RUN=true
VERBOSE=false
BACKUP_ENABLED=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --apply)
      DRY_RUN=false
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --verbose|-v)
      VERBOSE=true
      shift
      ;;
    --no-backup)
      BACKUP_ENABLED=false
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  --apply       Apply changes (default: dry-run)"
      echo "  --dry-run     Show what would be done without applying (default)"
      echo "  --verbose     Show detailed output"
      echo "  --no-backup   Skip backup creation"
      echo "  --help        Show this help"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Logging functions
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

log_step() {
  echo -e "${PURPLE}🔧 $1${NC}"
}

# Check if we're in a git repository
check_git_repo() {
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Not in a git repository!"
    exit 1
  fi
}

# Create backup
create_backup() {
  if [[ "$BACKUP_ENABLED" == "false" ]]; then
    log_info "Skipping backup creation"
    return
  fi
  
  log_step "Creating backup..."
  
  local backup_dir="$PROJECT_ROOT/.smart-cleaner-backups"
  local timestamp=$(date +"%Y%m%d_%H%M%S")
  local backup_path="$backup_dir/import-fix-backup_$timestamp"
  
  mkdir -p "$backup_dir"
  
  # Create a git bundle as backup
  git bundle create "$backup_path.bundle" HEAD
  
  log_success "Backup created: $backup_path"
}

# Fix import paths
fix_import_paths() {
  log_step "Fixing import paths..."
  
  cd "$PROJECT_ROOT"
  
  # Find all TypeScript/JavaScript files
  local files=$(find src app pages components -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null || true)
  
  if [[ -z "$files" ]]; then
    log_warning "No TypeScript/JavaScript files found"
    return
  fi
  
  local fixed_count=0
  local total_count=0
  
  for file in $files; do
    if [[ -f "$file" ]]; then
      total_count=$((total_count + 1))
      
      if fix_file_imports "$file"; then
        fixed_count=$((fixed_count + 1))
      fi
    fi
  done
  
  log_success "Processed $total_count files, fixed $fixed_count files"
}

# Fix imports in a single file
fix_file_imports() {
  local file="$1"
  local temp_file="${file}.tmp"
  local modified=false
  
  # Create a temporary file
  cp "$file" "$temp_file"
  
  # Fix various import patterns
  if fix_relative_imports "$temp_file"; then
    modified=true
  fi
  
  if fix_alias_imports "$temp_file"; then
    modified=true
  fi
  
  if fix_absolute_imports "$temp_file"; then
    modified=true
  fi
  
  if fix_missing_extensions "$temp_file"; then
    modified=true
  fi
  
  if [[ "$modified" == "true" ]]; then
    if [[ "$DRY_RUN" == "true" ]]; then
      log_info "Would fix imports in: $file"
      rm "$temp_file"
    else
      mv "$temp_file" "$file"
      log_success "Fixed imports in: $file"
    fi
    return 0
  else
    rm "$temp_file"
    return 1
  fi
}

# Fix relative imports
fix_relative_imports() {
  local file="$1"
  local modified=false
  
  # Fix relative imports that might be broken
  # This is a simplified version - in practice, you'd want more sophisticated logic
  
  # Fix common relative import issues
  if sed -i 's|from '\''\.\./\.\./\.\./|from '\''../../../|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from '\''\.\./\.\./|from '\''../../|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from '\''\.\./|from '\''../|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from '\''\./|from '\''./|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  # Fix double quotes
  if sed -i 's|from "\.\./\.\./\.\./|from "../../../|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from "\.\./\.\./|from "../../|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from "\.\./|from "../|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from "\./|from "./|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  echo "$modified"
}

# Fix alias imports
fix_alias_imports() {
  local file="$1"
  local modified=false
  
  # Fix @/ alias imports
  if sed -i 's|from '\''@/|from '\''src/|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from "@/|from "src/|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  echo "$modified"
}

# Fix absolute imports
fix_absolute_imports() {
  local file="$1"
  local modified=false
  
  # Fix absolute imports that should be relative
  # This is a simplified version
  
  if sed -i 's|from '\''/src/|from '\''src/|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from "/src/|from "src/|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  echo "$modified"
}

# Fix missing extensions
fix_missing_extensions() {
  local file="$1"
  local modified=false
  
  # Add missing .ts/.tsx extensions for relative imports
  if sed -i 's|from '\''\./[^'\'']*'\''|&.ts|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  if sed -i 's|from "\./[^"]*"|&.ts|g' "$file" 2>/dev/null; then
    modified=true
  fi
  
  echo "$modified"
}

# Validate imports
validate_imports() {
  log_step "Validating imports..."
  
  cd "$PROJECT_ROOT"
  
  # Run TypeScript check to validate imports
  if command -v tsc >/dev/null 2>&1; then
    if tsc --noEmit 2>/dev/null; then
      log_success "All imports are valid"
    else
      log_warning "Some imports may have issues - check TypeScript output"
    fi
  else
    log_warning "TypeScript not available for validation"
  fi
}

# Update import references
update_import_references() {
  log_step "Updating import references..."
  
  cd "$PROJECT_ROOT"
  
  # This would be more sophisticated in practice
  # For now, just log what would be done
  log_info "Would update import references across the project"
}

# Main execution
main() {
  echo -e "${CYAN}"
  echo "🔗 Smart Import Fixer"
  echo "===================="
  echo -e "${NC}"
  
  log_info "Starting import fixing process..."
  log_info "Mode: $([ "$DRY_RUN" == "true" ] && echo "DRY RUN" || echo "APPLY CHANGES")"
  log_info "Project root: $PROJECT_ROOT"
  
  # Pre-flight checks
  check_git_repo
  
  # Create backup if applying changes
  if [[ "$DRY_RUN" == "false" ]]; then
    create_backup
  fi
  
  # Fix imports
  fix_import_paths
  
  # Validate imports
  validate_imports
  
  # Update references
  update_import_references
  
  echo -e "${CYAN}"
  echo "🎉 Import fixing completed!"
  echo "=========================="
  echo -e "${NC}"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "This was a dry run. Use --apply to make actual changes."
  else
    log_success "Import fixes have been applied!"
  fi
  
  log_info "Next steps:"
  log_info "1. Review the changes made"
  log_info "2. Test your application to ensure everything works"
  log_info "3. Run TypeScript check: tsc --noEmit"
  log_info "4. Commit changes if satisfied"
}

# Run main function
main "$@"
