#!/bin/bash

# Module Testing Startup Script
# سكريبت بدء اختبار الموديولات

echo "🚀 Starting Module Testing System..."

# Make scripts executable
chmod +x module-testing-system.js
chmod +x auto-testing-system.js
chmod +x background-monitor.js

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the module testing system in background
echo "🧪 Starting parallel module testing..."
nohup node module-testing-system.js > module-testing.log 2>&1 &
MODULE_PID=$!

# Start the background monitor
echo "👁️ Starting background monitor..."
nohup node background-monitor.js > background-monitor.log 2>&1 &
MONITOR_PID=$!

# Save PIDs for later cleanup
echo $MODULE_PID > module-testing.pid
echo $MONITOR_PID > background-monitor.pid

echo "✅ Module testing system started!"
echo "📊 Module Testing PID: $MODULE_PID"
echo "👁️ Background Monitor PID: $MONITOR_PID"
echo ""
echo "📝 Logs:"
echo "   Module Testing: tail -f module-testing.log"
echo "   Background Monitor: tail -f background-monitor.log"
echo "   Results: cat module-test-results.json"
echo ""
echo "🛑 To stop: ./stop-module-testing.sh"

# Keep script running
wait
