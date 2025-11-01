#!/bin/bash

###############################################################################
# Moeen Monitor Agent - Startup Script
###############################################################################

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MONITOR_SCRIPT="$PROJECT_ROOT/monitor/moeen-monitor-agent.mjs"
PID_FILE="$PROJECT_ROOT/monitor/.monitor.pid"
LOG_FILE="$PROJECT_ROOT/logs/monitor-agent.log"

# Ensure directories exist
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$PROJECT_ROOT/monitor/reports"
mkdir -p "$PROJECT_ROOT/monitor/learning"
mkdir -p "$PROJECT_ROOT/monitor/agents"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Monitor agent is already running (PID: $PID)${NC}"
        echo "Use 'npm run monitor:stop' to stop it first."
        exit 1
    else
        # Stale PID file, remove it
        rm -f "$PID_FILE"
    fi
fi

echo -e "${GREEN}🤖 Starting Moeen Monitor Agent...${NC}"
echo "Project: moeen"
echo "Script: $MONITOR_SCRIPT"
echo "Log: $LOG_FILE"
echo ""

# Start the monitor in background
nohup node "$MONITOR_SCRIPT" continuous >> "$LOG_FILE" 2>&1 &
MONITOR_PID=$!

# Save PID
echo "$MONITOR_PID" > "$PID_FILE"

echo -e "${GREEN}✅ Monitor agent started successfully!${NC}"
echo "PID: $MONITOR_PID"
echo "Log file: $LOG_FILE"
echo ""
echo "Commands:"
echo "  - View logs: tail -f $LOG_FILE"
echo "  - Stop monitor: npm run monitor:stop"
echo "  - Check status: npm run monitor:status"
echo ""

# Wait a moment and check if it's still running
sleep 2
if ps -p "$MONITOR_PID" > /dev/null 2>&1; then
    echo -e "${GREEN}🟢 Monitor is running${NC}"
else
    echo -e "${RED}❌ Monitor failed to start. Check logs: $LOG_FILE${NC}"
    rm -f "$PID_FILE"
    exit 1
fi
