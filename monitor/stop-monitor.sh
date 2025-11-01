#!/bin/bash

###############################################################################
# Moeen Monitor Agent - Stop Script
###############################################################################

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$PROJECT_ROOT/monitor/.monitor.pid"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ ! -f "$PID_FILE" ]; then
    echo -e "${YELLOW}⚠️  No PID file found. Monitor may not be running.${NC}"
    
    # Check for running monitor processes
    PIDS=$(pgrep -f "moeen-monitor-agent.mjs" || echo "")
    if [ -n "$PIDS" ]; then
        echo -e "${YELLOW}Found running monitor processes:${NC}"
        echo "$PIDS"
        read -p "Kill these processes? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill $PIDS
            echo -e "${GREEN}✅ Processes terminated${NC}"
        fi
    else
        echo "No monitor processes found."
    fi
    exit 0
fi

PID=$(cat "$PID_FILE")

if ps -p "$PID" > /dev/null 2>&1; then
    echo -e "${YELLOW}🛑 Stopping monitor agent (PID: $PID)...${NC}"
    kill "$PID"
    
    # Wait for graceful shutdown
    COUNTER=0
    while ps -p "$PID" > /dev/null 2>&1 && [ $COUNTER -lt 10 ]; do
        sleep 1
        COUNTER=$((COUNTER + 1))
        echo -n "."
    done
    echo ""
    
    # Force kill if still running
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${RED}⚠️  Forcing termination...${NC}"
        kill -9 "$PID"
    fi
    
    echo -e "${GREEN}✅ Monitor agent stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Process $PID is not running${NC}"
fi

# Remove PID file
rm -f "$PID_FILE"
echo "PID file removed"
