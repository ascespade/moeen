#!/bin/bash

# Run All Tests Script
# تشغيل جميع الاختبارات

set -e

echo "🚀 Starting comprehensive test suite..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dev server is running
echo "📋 Checking if dev server is running..."
if ! curl -s http://localhost:3001 > /dev/null; then
    echo -e "${YELLOW}⚠️  Dev server is not running. Please start it with: npm run dev${NC}"
    echo "   Starting dev server in background..."
    npm run dev &
    sleep 10
fi

echo -e "${GREEN}✅ Dev server is running${NC}"
echo ""

# Run Playwright tests
echo "🧪 Running Playwright E2E tests..."
echo ""

npx playwright test --reporter=list,html || {
    echo -e "${RED}❌ Tests failed!${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"
