#!/bin/bash

# Auto Testing and Improvement System
# نظام الاختبار والتحسين التلقائي

echo "🚀 Starting Auto Testing and Improvement System..."
echo "بدء نظام الاختبار والتحسين التلقائي..."

# Make scripts executable
chmod +x auto-testing-system.js
chmod +x background-monitor.js
chmod +x scripts/reset-test-users.js

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install Playwright browsers if needed
if [ ! -d "node_modules/.cache/playwright" ]; then
    echo "🎭 Installing Playwright browsers..."
    npx playwright install
fi

# Start the background monitor
echo "🔄 Starting background monitor..."
node background-monitor.js &

# Start the auto testing system
echo "🧪 Starting auto testing system..."
node auto-testing-system.js &

# Keep the script running
echo "✅ Auto system started! Press Ctrl+C to stop."
echo "تم تشغيل النظام التلقائي! اضغط Ctrl+C للإيقاف."

# Wait for user interrupt
trap 'echo "🛑 Stopping auto system..."; kill $(jobs -p); exit 0' INT

# Keep running
wait
