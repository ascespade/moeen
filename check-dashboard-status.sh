#!/bin/bash

# Check Dashboard System Status
# فحص حالة نظام لوحة التحكم

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  📊 Progress Dashboard System Status                      ║"
echo "║     حالة نظام لوحة تتبع التقدم                           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check dashboard server
echo "🔍 Checking services..."
echo ""

DASH_RUNNING=$(ps aux | grep "dashboard-server" | grep -v grep | wc -l)
MONITOR_RUNNING=$(ps aux | grep "background-monitor" | grep -v grep | wc -l)

if [ $DASH_RUNNING -gt 0 ]; then
    echo "✅ Dashboard Server: RUNNING"
    ps aux | grep "dashboard-server" | grep -v grep | awk '{print "   PID: " $2 " | CPU: " $3 "% | Memory: " $4 "%"}'
else
    echo "❌ Dashboard Server: NOT RUNNING"
fi

echo ""

if [ $MONITOR_RUNNING -gt 0 ]; then
    echo "✅ Background Monitor: RUNNING"
    ps aux | grep "background-monitor" | grep -v grep | awk '{print "   PID: " $2 " | CPU: " $3 "% | Memory: " $4 "%"}'
else
    echo "❌ Background Monitor: NOT RUNNING"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if port 3001 is accessible
echo "🌐 Testing connectivity..."
HEALTH_CHECK=$(curl -s http://localhost:3001/api/health 2>/dev/null)
if [ -n "$HEALTH_CHECK" ]; then
    echo "✅ Dashboard is accessible at http://localhost:3001"
    echo ""
    echo "📊 Health Status:"
    echo "$HEALTH_CHECK" | grep -o '"status":"[^"]*"' | sed 's/"status":"//;s/"$//' | awk '{print "   Status: " $0}'
    echo "$HEALTH_CHECK" | grep -o '"database":"[^"]*"' | sed 's/"database":"//;s/"$//' | awk '{print "   Database: " $0}'
    echo "$HEALTH_CHECK" | grep -o '"uptime":[0-9.]*' | sed 's/"uptime"://' | awk '{printf "   Uptime: %.2f seconds\n", $0}'
else
    echo "⚠️  Dashboard is not responding on port 3001"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check system status file
if [ -f /workspace/system-status.json ]; then
    echo "📝 Monitor Status:"
    cat /workspace/system-status.json | grep -o '"status":"[^"]*"' | sed 's/"status":"//;s/"$//' | awk '{print "   Status: " $0}'
    cat /workspace/system-status.json | grep -o '"isMonitoring":[^,}]*' | sed 's/"isMonitoring"://' | awk '{print "   Monitoring: " $0}'
    cat /workspace/system-status.json | grep -o '"lastCheck":"[^"]*"' | sed 's/"lastCheck":"//;s/"$//' | awk '{print "   Last Check: " $0}'
else
    echo "⚠️  System status file not found"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check log files
echo "📄 Recent Logs:"
if [ -f /tmp/dashboard.log ]; then
    echo ""
    echo "Dashboard Server (last 5 lines):"
    tail -5 /tmp/dashboard.log | sed 's/^/   /'
fi

if [ -f /tmp/monitor.log ]; then
    echo ""
    echo "Background Monitor (last 5 lines):"
    tail -5 /tmp/monitor.log | sed 's/^/   /'
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Commands:                                                 ║"
echo "║  • Start:   ./start-dashboard.sh                           ║"
echo "║  • Stop:    ./stop-dashboard.sh                            ║"
echo "║  • Status:  ./check-dashboard-status.sh                    ║"
echo "║  • Logs:    tail -f /tmp/dashboard.log                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

