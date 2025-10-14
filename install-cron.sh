#!/bin/bash

# Install Smart Git Integration Agent as a cron job
# This script sets up the agent to run every 6 hours

SCRIPT_DIR="/workspace"
SCHEDULER_SCRIPT="$SCRIPT_DIR/smart-git-scheduler.sh"
CRON_JOB="0 */6 * * * $SCHEDULER_SCRIPT run >> $SCRIPT_DIR/logs/cron.log 2>&1"

echo "🔧 Installing Smart Git Integration Agent Cron Job..."

# Check if script exists
if [ ! -f "$SCHEDULER_SCRIPT" ]; then
    echo "❌ Scheduler script not found: $SCHEDULER_SCRIPT"
    exit 1
fi

# Make sure script is executable
chmod +x "$SCHEDULER_SCRIPT"

# Create logs directory
mkdir -p "$SCRIPT_DIR/logs"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "smart-git-scheduler"; then
    echo "⚠️  Cron job already exists. Updating..."
    # Remove existing cron job
    crontab -l 2>/dev/null | grep -v "smart-git-scheduler" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job installed successfully!"
echo "📅 Schedule: Every 6 hours"
echo "📝 Logs: $SCRIPT_DIR/logs/cron.log"
echo ""
echo "To view current cron jobs: crontab -l"
echo "To remove cron job: crontab -e (then delete the line)"
echo "To test immediately: $SCHEDULER_SCRIPT run"