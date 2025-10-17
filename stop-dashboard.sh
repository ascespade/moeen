#!/bin/bash

# Stop Dashboard System
# إيقاف نظام لوحة التحكم

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  🛑 Stopping Progress Dashboard System                    ║"
echo "║     إيقاف نظام لوحة تتبع التقدم                          ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Stop dashboard server
echo "📊 Stopping dashboard server..."
pkill -f "dashboard-server" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Dashboard server stopped"
else
    echo "   ℹ️  Dashboard server was not running"
fi

# Stop background monitor
echo "🔍 Stopping background monitor..."
pkill -f "background-monitor" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Background monitor stopped"
else
    echo "   ℹ️  Background monitor was not running"
fi

# Stop any Python HTTP servers
pkill -f "python3.*http.server" 2>/dev/null

# Stop any Next.js dev servers
pkill -f "next dev" 2>/dev/null

# Remove PID files
rm -f /tmp/dashboard.pid /tmp/monitor.pid 2>/dev/null

echo ""
echo "✅ All services stopped successfully"
echo ""

