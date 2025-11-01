#!/bin/bash

###############################################################################
# Moeen Monitor Agent - Status Check Script
###############################################################################

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$PROJECT_ROOT/monitor/.monitor.pid"
DASHBOARD_FILE="$PROJECT_ROOT/monitor/dashboard.json"
LOG_FILE="$PROJECT_ROOT/logs/monitor-agent.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}          🤖 MOEEN MONITOR AGENT STATUS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Status: RUNNING${NC}"
        echo "PID: $PID"
        
        # Get process info
        UPTIME=$(ps -p "$PID" -o etime= | tr -d ' ')
        CPU=$(ps -p "$PID" -o %cpu= | tr -d ' ')
        MEM=$(ps -p "$PID" -o %mem= | tr -d ' ')
        
        echo "Uptime: $UPTIME"
        echo "CPU: ${CPU}%"
        echo "Memory: ${MEM}%"
    else
        echo -e "${RED}❌ Status: NOT RUNNING (stale PID file)${NC}"
        echo "Stale PID: $PID"
    fi
else
    echo -e "${RED}❌ Status: NOT RUNNING${NC}"
    echo "No PID file found"
fi

echo ""
echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"

# Check dashboard
if [ -f "$DASHBOARD_FILE" ]; then
    echo -e "${GREEN}📊 Dashboard Status:${NC}"
    
    # Parse dashboard JSON (requires jq, but fallback to basic parsing)
    if command -v jq &> /dev/null; then
        LAST_UPDATE=$(jq -r '.lastUpdate' "$DASHBOARD_FILE")
        STATUS=$(jq -r '.status' "$DASHBOARD_FILE")
        SCORE=$(jq -r '.score' "$DASHBOARD_FILE")
        ACTIVE_AGENTS=$(jq -r '.agents.active' "$DASHBOARD_FILE")
        TOTAL_AGENTS=$(jq -r '.agents.total' "$DASHBOARD_FILE")
        
        echo "  Last Update: $LAST_UPDATE"
        echo "  Health Status: $STATUS"
        echo "  Health Score: $SCORE/100"
        echo "  Active Agents: $ACTIVE_AGENTS/$TOTAL_AGENTS"
    else
        echo "  Dashboard exists (install 'jq' for detailed view)"
        echo "  Path: $DASHBOARD_FILE"
    fi
else
    echo -e "${YELLOW}⚠️  No dashboard data available yet${NC}"
fi

echo ""
echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"

# Check recent reports
REPORTS_DIR="$PROJECT_ROOT/monitor/reports"
if [ -d "$REPORTS_DIR" ]; then
    REPORT_COUNT=$(find "$REPORTS_DIR" -name "*.json" | wc -l)
    HTML_COUNT=$(find "$REPORTS_DIR" -name "*.html" | wc -l)
    
    echo -e "${GREEN}📝 Reports:${NC}"
    echo "  Total Reports: $REPORT_COUNT"
    echo "  HTML Reports: $HTML_COUNT"
    
    if [ $REPORT_COUNT -gt 0 ]; then
        LATEST_REPORT=$(ls -t "$REPORTS_DIR"/*.html 2>/dev/null | head -1)
        if [ -n "$LATEST_REPORT" ]; then
            echo "  Latest: $(basename "$LATEST_REPORT")"
            echo ""
            echo "  View latest report:"
            echo "    open $LATEST_REPORT"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  No reports directory${NC}"
fi

echo ""
echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"

# Check logs
if [ -f "$LOG_FILE" ]; then
    LOG_SIZE=$(du -h "$LOG_FILE" | cut -f1)
    LOG_LINES=$(wc -l < "$LOG_FILE")
    
    echo -e "${GREEN}📋 Log File:${NC}"
    echo "  Path: $LOG_FILE"
    echo "  Size: $LOG_SIZE"
    echo "  Lines: $LOG_LINES"
    echo ""
    echo "  Last 5 entries:"
    tail -5 "$LOG_FILE" | sed 's/^/    /'
else
    echo -e "${YELLOW}⚠️  No log file found${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Commands:"
echo "  Start:  npm run monitor:start  or  ./monitor/start-monitor.sh"
echo "  Stop:   npm run monitor:stop   or  ./monitor/stop-monitor.sh"
echo "  Logs:   tail -f $LOG_FILE"
echo ""
