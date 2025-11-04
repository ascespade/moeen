#!/bin/bash

# Automated Admin Tests Runner
# تشغيل اختبارات الادمن تلقائياً

echo "🚀 Starting Admin Tests..."
echo "================================"

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server is not running on port 3000"
    echo "Please start the server first: npm run dev"
    exit 1
fi

# Run tests
npx playwright test tests/admin.spec.ts tests/admin-comprehensive.spec.ts --reporter=list,html

echo ""
echo "✅ Tests completed!"
echo "📊 View report: playwright-report/index.html"
