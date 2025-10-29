#!/usr/bin/env bash
#
# run_cursor_agent.sh
# Safe runner for the Cursor Background Audit Agent
#
# Places: expects cursor_background_agent.json at project root (already created in Canvas)
#

set -euo pipefail
IFS=$'\n\t'

CONFIG_FILE="./cursor_background_agent.json"
LOG_DIR=".cursor_audit_logs"
STATUS_FILE=".cursor_audit_status.json"
BACKUP_DIR=".cursor_audit_backups"
DRY_RUN=false
AUTO_PUSH=false

usage(){
  cat <<EOF
Usage: $0 [--dry-run] [--auto-push]

Options:
  --dry-run     Run the agent in dry-run mode (no commits, no destructive changes)
  --auto-push   Allow the runner to push commits to the remote (use with caution)
  --help        Show this help message

Notes:
  - Ensure 'cursor-agent' binary is installed and available in PATH,
    or replace the command below with your agent runner.
  - This script will NOT print secrets. It relies on the environment (Cursor)
    to inject secrets.
  - Start with --dry-run to inspect the proposed changes and reports in ${BACKUP_DIR}.
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --auto-push)
      AUTO_PUSH=true
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      usage
      exit 1
      ;;
  esac
done

# Create necessary directories
mkdir -p "$LOG_DIR" "$BACKUP_DIR"

# Check if cursor-agent is available
if ! command -v cursor-agent >/dev/null 2>&1; then
  echo "cursor-agent not found in PATH. Please install or provide executable named 'cursor-agent'."
  exit 2
fi

# Build run arguments
RUN_ARGS=(--config "$CONFIG_FILE" --project-root ./)
if [ "$DRY_RUN" = true ]; then
  RUN_ARGS+=(--dry-run)
fi
if [ "$AUTO_PUSH" = true ]; then
  echo "Warning: auto-push enabled. Ensure you trust this environment before proceeding."
fi

# Timestamp for this run
TIMESTAMP=$(date +"%Y%m%dT%H%M%S")
LOG_FILE="$LOG_DIR/cursor_agent_run_${TIMESTAMP}.log"

# Run the agent and stream output to log
set +e
cursor-agent "${RUN_ARGS[@]}" 2>&1 | tee "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}
set -e

# Capture status and create a timestamped backup snapshot if present
if [ -f "$STATUS_FILE" ]; then
  cp "$STATUS_FILE" "$BACKUP_DIR/status_${TIMESTAMP}.json"
fi

if [ $EXIT_CODE -eq 0 ]; then
  echo "Cursor agent completed successfully. Log: $LOG_FILE"
else
  echo "Cursor agent exited with code $EXIT_CODE. Check logs: $LOG_FILE"
fi

# Summarize backups available
echo "Backups directory: $BACKUP_DIR"
ls -la "$BACKUP_DIR" || true

# Safety: if not dry-run and auto_push true, optionally push branch created by agent
if [ "$DRY_RUN" = false ] && [ "$AUTO_PUSH" = true ]; then
  echo "Auto-push requested. Looking for git branch prefix 'cursor-audit/' to push."
  
  # find branches and push the latest cursor-audit branch if exists
  BRANCH=$(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads/ | grep '^cursor-audit/' | head -n1 || true)
  if [ -n "$BRANCH" ]; then
    echo "Pushing branch: $BRANCH"
    git push origin "$BRANCH"
  else
    echo "No 'cursor-audit/' branch found to push."
  fi
fi

exit $EXIT_CODE
