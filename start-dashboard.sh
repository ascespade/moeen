#!/bin/bash

# Start Dashboard with Background Monitor
# نظام بدء لوحة التحكم مع المراقب التلقائي

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  🚀 Starting Progress Dashboard System                    ║"
echo "║     بدء نظام لوحة تتبع التقدم                            ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Stop any existing processes
echo "🛑 Stopping existing processes..."
pkill -f "background-monitor.js" 2>/dev/null
pkill -f "dashboard-server" 2>/dev/null
pkill -f "python3.*http.server" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Make scripts executable
chmod +x /workspace/dashboard-server-db.js
chmod +x /workspace/background-monitor.js

# Start the enhanced dashboard server with database support
echo "📊 Starting dashboard server on port 3001..."
cd /workspace && node dashboard-server-db.js > /tmp/dashboard.log 2>&1 &
DASH_PID=$!
echo "   Dashboard PID: $DASH_PID"
sleep 3

# Check if dashboard started successfully
if ps -p $DASH_PID > /dev/null; then
    echo "   ✅ Dashboard server started successfully"
    echo "   📝 Logs: /tmp/dashboard.log"
else
    echo "   ❌ Dashboard server failed to start"
    echo "   📝 Check logs: cat /tmp/dashboard.log"
    exit 1
fi

# Start the background monitor
echo ""
echo "🔍 Starting background monitor..."
cd /workspace && node background-monitor.js > /tmp/monitor.log 2>&1 &
MONITOR_PID=$!
echo "   Monitor PID: $MONITOR_PID"
sleep 2

# Check if monitor started successfully
if ps -p $MONITOR_PID > /dev/null; then
    echo "   ✅ Background monitor started successfully"
    echo "   📝 Logs: /tmp/monitor.log"
else
    echo "   ❌ Background monitor failed to start"
    echo "   📝 Check logs: cat /tmp/monitor.log"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  ✅ System Started Successfully!                          ║"
echo "║                                                            ║"
echo "║  📊 Dashboard:    http://localhost:3001                   ║"
echo "║  🔍 Monitor:      Running in background                   ║"
echo "║                                                            ║"
echo "║  📝 View Dashboard Logs:  tail -f /tmp/dashboard.log     ║"
echo "║  📝 View Monitor Logs:    tail -f /tmp/monitor.log       ║"
echo "║                                                            ║"
echo "║  🛑 To stop:      ./stop-dashboard.sh                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Save PIDs for later
echo "$DASH_PID" > /tmp/dashboard.pid
echo "$MONITOR_PID" > /tmp/monitor.pid

# Test the connection
echo "🧪 Testing connection..."
sleep 2
HEALTH=$(curl -s http://localhost:3001/api/health 2>/dev/null)
if [ -n "$HEALTH" ]; then
    echo "   ✅ Dashboard is responding"
    echo "$HEALTH" | grep -o '"status":"[^"]*"' | head -1
    echo "$HEALTH" | grep -o '"database":"[^"]*"' | head -1
else
    echo "   ⚠️  Dashboard not responding yet (may need a few more seconds)"
fi

echo ""
echo "✨ System is ready! Open http://localhost:3001 in your browser"

