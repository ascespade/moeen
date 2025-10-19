#!/bin/bash

# Ultimate Aggressive Self-Healing & Test Generator Runner
# This script runs the ai_full_e2e_healer.mjs with proper environment setup

set -e

echo "🚀 Starting Ultimate Aggressive Self-Healing & Test Generator"
echo "=============================================================="

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if the healer script exists
if [ ! -f "scripts/ai_full_e2e_healer.mjs" ]; then
    echo "❌ ai_full_e2e_healer.mjs not found in scripts/ directory."
    exit 1
fi

# Set environment variables if not set
export NODE_ENV=${NODE_ENV:-development}
export BASE_URL=${BASE_URL:-http://localhost:3000}
export MAX_RETRIES_PER_TEST=${MAX_RETRIES_PER_TEST:-10}
export MAX_WORKERS=${MAX_WORKERS:-4}

# Check for required environment variables
echo "🔍 Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL is not set"
fi
if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
fi
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY is not set"
fi
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN is not set"
fi
if [ -z "$CURSOR_API_KEY" ]; then
    echo "⚠️  CURSOR_API_KEY is not set"
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers if needed
echo "🎭 Installing Playwright browsers..."
npx playwright install

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p reports/backups
mkdir -p reports/llm_prompts
mkdir -p tests/generated/playwright
mkdir -p tests/generated/supawright
mkdir -p tests/generated/integration
mkdir -p tests/generated/edge-cases
mkdir -p dashboard/logs

# Make the healer script executable
chmod +x scripts/ai_full_e2e_healer.mjs

# Run the ultimate healer
echo "🔧 Starting AI Full E2E Healer..."
echo "=================================="
node scripts/ai_full_e2e_healer.mjs

echo "✅ Ultimate Aggressive Self-Healing & Test Generator completed"
echo "=============================================================="
echo "📊 Check reports/ directory for detailed results"
echo "🌿 Check for new branches and PRs in your repository"