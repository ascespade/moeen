#!/bin/bash

# Stop Module Testing Script
# سكريبت إيقاف اختبار الموديولات

echo "🛑 Stopping Module Testing System..."

# Stop module testing
if [ -f "module-testing.pid" ]; then
    MODULE_PID=$(cat module-testing.pid)
    if ps -p $MODULE_PID > /dev/null; then
        echo "🛑 Stopping module testing (PID: $MODULE_PID)..."
        kill $MODULE_PID
        rm module-testing.pid
    fi
fi

# Stop background monitor
if [ -f "background-monitor.pid" ]; then
    MONITOR_PID=$(cat background-monitor.pid)
    if ps -p $MONITOR_PID > /dev/null; then
        echo "🛑 Stopping background monitor (PID: $MONITOR_PID)..."
        kill $MONITOR_PID
        rm background-monitor.pid
    fi
fi

# Kill any remaining processes
pkill -f "module-testing-system.js" || true
pkill -f "background-monitor.js" || true

echo "✅ Module testing system stopped!"
echo "📊 Final results saved in module-test-results.json"
