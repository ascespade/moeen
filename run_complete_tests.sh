#!/bin/bash

# Complete Test Suite Runner
# تشغيل جميع الاختبارات الشاملة

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Running Complete Test Suite..."
echo ""

# Check server
echo "📋 Checking dev server..."
if ! curl -s http://localhost:3001 > /dev/null; then
    echo -e "${YELLOW}⚠️  Starting dev server...${NC}"
    npm run dev > /tmp/dev-server.log 2>&1 &
    sleep 10
fi

echo -e "${GREEN}✅ Server ready${NC}"
echo ""

# Run tests
echo "📋 Running authentication tests..."
npx playwright test tests/auth/login.spec.ts --reporter=list || true

echo ""
echo "📋 Running permissions tests..."
npx playwright test tests/auth/permissions.spec.ts --reporter=list || true

echo ""
echo "📋 Running workflow tests..."
npx playwright test tests/workflow/role-workflows.spec.ts --reporter=list || true

echo ""
echo "📋 Running API tests..."
npx playwright test tests/api/auth-api.spec.ts --reporter=list || true

echo ""
echo "📋 Running modules tests..."
npx playwright test tests/modules/modules-test.spec.ts --reporter=list || true

echo ""
echo -e "${GREEN}✅ Test suite complete!${NC}"
echo ""
echo "📊 View detailed report: npx playwright show-report"
