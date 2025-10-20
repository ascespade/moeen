#!/bin/bash

# === 🧠 AI Smart Cleaner + Codemod Runner ===
# Intelligent project cleanup, reorganization, and import fixing
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
APPLY_CHANGES=false
VERBOSE=false
BACKUP_ENABLED=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --apply)
      APPLY_CHANGES=true
      DRY_RUN=false
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      APPLY_CHANGES=false
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

# Check if we have uncommitted changes
check_uncommitted_changes() {
  if ! git diff-index --quiet HEAD --; then
    log_warning "You have uncommitted changes!"
    if [[ "$APPLY_CHANGES" == "true" ]]; then
      log_info "Proceeding with uncommitted changes..."
    else
      log_info "Consider committing changes before running cleanup"
    fi
  fi
}

# Detect project type
detect_project() {
  log_step "Detecting project type..."
  
  if [[ -f "$PROJECT_ROOT/package.json" ]]; then
    if grep -q '"next"' "$PROJECT_ROOT/package.json"; then
      PROJECT_TYPE="nextjs"
      log_success "Detected Next.js project"
    elif grep -q '"react"' "$PROJECT_ROOT/package.json"; then
      PROJECT_TYPE="react"
      log_success "Detected React project"
    else
      PROJECT_TYPE="nodejs"
      log_success "Detected Node.js project"
    fi
  elif [[ -f "$PROJECT_ROOT/pyproject.toml" ]] || [[ -f "$PROJECT_ROOT/requirements.txt" ]]; then
    PROJECT_TYPE="python"
    log_success "Detected Python project"
  elif [[ -f "$PROJECT_ROOT/Cargo.toml" ]]; then
    PROJECT_TYPE="rust"
    log_success "Detected Rust project"
  else
    PROJECT_TYPE="unknown"
    log_warning "Unknown project type"
  fi
  
  echo "$PROJECT_TYPE" > "$SCRIPT_DIR/.project_type"
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
  local backup_path="$backup_dir/backup_$timestamp"
  
  mkdir -p "$backup_dir"
  
  # Create a git bundle as backup
  git bundle create "$backup_path.bundle" HEAD
  
  # Also create a tar backup of current state
  tar -czf "$backup_path.tar.gz" --exclude="node_modules" --exclude=".git" --exclude=".next" .
  
  log_success "Backup created: $backup_path"
  echo "$backup_path" > "$SCRIPT_DIR/.last_backup"
}

# Build dependency graph
build_dependency_graph() {
  log_step "Building dependency graph..."
  
  cd "$PROJECT_ROOT"
  node "$SCRIPT_DIR/build_dependency_graph.js" > "$SCRIPT_DIR/dependency_graph.json"
  
  if [[ $? -eq 0 ]]; then
    log_success "Dependency graph built successfully"
  else
    log_error "Failed to build dependency graph"
    exit 1
  fi
}

# Identify dead files
identify_dead_files() {
  log_step "Identifying dead files..."
  
  cd "$PROJECT_ROOT"
  node "$SCRIPT_DIR/identify_dead_files.js" > "$SCRIPT_DIR/.smart-cleaner-candidates.json"
  
  if [[ $? -eq 0 ]]; then
    log_success "Dead files identified"
    
    # Show summary
    local dead_count=$(jq '.dead_files | length' "$SCRIPT_DIR/.smart-cleaner-candidates.json" 2>/dev/null || echo "0")
    local unused_count=$(jq '.unused_dependencies | length' "$SCRIPT_DIR/.smart-cleaner-candidates.json" 2>/dev/null || echo "0")
    
    log_info "Found $dead_count dead files and $unused_count unused dependencies"
  else
    log_error "Failed to identify dead files"
    exit 1
  fi
}

# Safe remove or move files
safe_remove_or_move() {
  log_step "Processing file removals and moves..."
  
  cd "$PROJECT_ROOT"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "DRY RUN: Would process removals and moves"
    node "$SCRIPT_DIR/safe_remove_or_move.js" --dry-run
  else
    log_warning "APPLYING CHANGES: Processing removals and moves"
    node "$SCRIPT_DIR/safe_remove_or_move.js" --apply
  fi
}

# Refactor project structure
refactor_structure() {
  log_step "Refactoring project structure..."
  
  cd "$PROJECT_ROOT"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "DRY RUN: Would refactor structure"
    node "$SCRIPT_DIR/refactor_structure.js" --dry-run
  else
    log_warning "APPLYING CHANGES: Refactoring structure"
    node "$SCRIPT_DIR/refactor_structure.js" --apply
  fi
}

# Format and lint
format_and_lint() {
  log_step "Formatting and linting code..."
  
  cd "$PROJECT_ROOT"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "DRY RUN: Would format and lint"
    node "$SCRIPT_DIR/format_and_lint.js" --dry-run
  else
    log_warning "APPLYING CHANGES: Formatting and linting"
    node "$SCRIPT_DIR/format_and_lint.js" --apply
  fi
}

# Run checks
run_checks() {
  log_step "Running project checks..."
  
  cd "$PROJECT_ROOT"
  node "$SCRIPT_DIR/run_checks.js"
  
  if [[ $? -eq 0 ]]; then
    log_success "All checks passed"
  else
    log_warning "Some checks failed - see output above"
  fi
}

# Generate report
generate_report() {
  log_step "Generating cleanup report..."
  
  cd "$PROJECT_ROOT"
  node "$SCRIPT_DIR/generate_report.js" > "$PROJECT_ROOT/cleanup-report.json"
  
  if [[ $? -eq 0 ]]; then
    log_success "Cleanup report generated: cleanup-report.json"
  else
    log_error "Failed to generate report"
  fi
}

# Main execution
main() {
  echo -e "${CYAN}"
  echo "🧠 AI Smart Cleaner + Codemod Runner"
  echo "====================================="
  echo -e "${NC}"
  
  log_info "Starting smart cleanup process..."
  log_info "Mode: $([ "$DRY_RUN" == "true" ] && echo "DRY RUN" || echo "APPLY CHANGES")"
  log_info "Project root: $PROJECT_ROOT"
  
  # Pre-flight checks
  check_git_repo
  check_uncommitted_changes
  
  # Detect project type
  detect_project
  
  # Create backup if applying changes
  if [[ "$APPLY_CHANGES" == "true" ]]; then
    create_backup
  fi
  
  # Run cleanup steps
  build_dependency_graph
  identify_dead_files
  
  # Show candidates for review
  if [[ -f "$SCRIPT_DIR/.smart-cleaner-candidates.json" ]]; then
    log_info "Review candidates in: $SCRIPT_DIR/.smart-cleaner-candidates.json"
    
    if [[ "$DRY_RUN" == "true" ]]; then
      log_info "Run with --apply to apply changes"
    fi
  fi
  
  # Process changes
  safe_remove_or_move
  refactor_structure
  format_and_lint
  
  # Post-cleanup checks
  run_checks
  generate_report
  
  echo -e "${CYAN}"
  echo "🎉 Smart cleanup completed!"
  echo "=========================="
  echo -e "${NC}"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "This was a dry run. Use --apply to make actual changes."
  else
    log_success "Changes have been applied!"
    log_info "Review the cleanup-report.json for details"
  fi
  
  log_info "Next steps:"
  log_info "1. Review cleanup-report.json"
  log_info "2. Run: tools/smart-cleaner/fix_imports.sh"
  log_info "3. Test: npm run build && npm test"
  log_info "4. Commit changes if satisfied"
}

# Run main function
main "$@"
