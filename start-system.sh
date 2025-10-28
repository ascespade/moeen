#!/bin/bash

# 🚀 Ultimate AI CI/CD System - Quick Start Script
# This script starts the complete CI/CD monitoring system

echo "🚀 Starting Ultimate AI CI/CD System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN is not set. Some features may not work properly."
fi

if [ -z "$CURSOR_API_KEY" ]; then
    echo "⚠️  CURSOR_API_KEY is not set. Assistant features may not work properly."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p reports
mkdir -p dashboard
mkdir -p logs

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.js
chmod +x scripts/*.sh

# Start live dashboard in background
echo "🎯 Starting live dashboard..."
npm run dashboard:live &
DASHBOARD_PID=$!

# Wait a moment for dashboard to start
sleep 3

# Generate initial report
echo "📊 Generating initial report..."
npm run report:generate

# Display system status
echo ""
echo "✅ Ultimate AI CI/CD System started successfully!"
echo ""
echo "📊 Live Dashboard: http://localhost:3000/dashboard"
echo "📁 Reports Directory: ./reports/"
echo "📁 Dashboard Directory: ./dashboard/"
echo ""
echo "🔧 Available Commands:"
echo "  npm run dashboard:live     - Start live dashboard"
echo "  npm run dashboard:update   - Update dashboard data"
echo "  npm run report:generate    - Generate comprehensive report"
echo ""
echo "🛑 To stop the system, press Ctrl+C"
echo ""

# Keep script running
trap "echo '🛑 Stopping system...'; kill $DASHBOARD_PID 2>/dev/null; exit 0" INT TERM

# Wait for dashboard process
wait $DASHBOARD_PID
