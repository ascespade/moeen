#!/bin/bash

echo "🧪 Running All Tests..."
echo ""

# Check server
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "⚠️  Server not running. Starting..."
    npm run dev &
    sleep 5
fi

echo "✅ Server ready"
echo ""

# Run tests
echo "📋 Running authentication tests..."
npx playwright test tests/auth/login.spec.ts --reporter=list

echo ""
echo "📋 Running permissions tests..."
npx playwright test tests/auth/permissions.spec.ts --reporter=list

echo ""
echo "📋 Running API tests..."
npx playwright test tests/api/auth-api.spec.ts --reporter=list

echo ""
echo "📋 Running modules tests..."
npx playwright test tests/modules/modules-test.spec.ts --reporter=list

echo ""
echo "✅ All tests complete!"
echo ""
echo "📊 View full report: npx playwright show-report"
