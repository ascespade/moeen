#!/bin/bash

# Ultimate E2E Self-Healing Runner
# Main entry point for the comprehensive test and fix system

set -e

echo "🚀 Starting Ultimate E2E Self-Healing Runner"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from the project root."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install Playwright browsers if needed
if [ ! -d "node_modules/.cache/ms-playwright" ]; then
    echo "🎭 Installing Playwright browsers..."
    npx playwright install
fi

# Set environment variables if not set
export NODE_ENV=${NODE_ENV:-development}
export BASE_URL=${BASE_URL:-http://localhost:3000}

# Run the main orchestrator
echo "🔧 Starting AI Orchestrator..."
node scripts/ai_orchestrator.mjs

echo "✅ Ultimate E2E Self-Healing Runner completed"