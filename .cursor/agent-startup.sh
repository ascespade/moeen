#!/bin/bash

# Cursor Background Agent Startup Script
echo "🚀 Starting Cursor Background Agent..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start background monitoring
echo "🔍 Starting file monitoring..."
npx nodemon --watch src --ext ts,tsx,js,jsx --exec "npm run lint --fix && npm run format" &

# Start TypeScript checking
echo "🔧 Starting TypeScript checking..."
npx tsc --noEmit --watch &

# Start build monitoring
echo "🏗️ Starting build monitoring..."
npx nodemon --watch src --ext ts,tsx,js,jsx --exec "npm run build" &

echo "✅ Cursor Background Agent started successfully!"
echo "📊 Monitoring: src/**/*.{ts,tsx,js,jsx}"
echo "🔄 Auto-fixing: ESLint, Prettier, TypeScript"
echo "🏗️ Auto-building: On file changes"

# Keep script running
wait