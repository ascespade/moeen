#!/bin/bash

echo "🚀 Starting Hybrid Quality Audit System..."
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create reports directory if it doesn't exist
mkdir -p reports
mkdir -p test-results

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# 1️⃣ Install dependencies
print_section "1️⃣ Installing Dependencies"

echo "Checking for required packages..."
REQUIRED_PACKAGES=("playwright" "lighthouse" "axe-core")
MISSING_PACKAGES=()

for pkg in "${REQUIRED_PACKAGES[@]}"; do
    if npm list "$pkg" &>/dev/null; then
        echo -e "${GREEN}✓${NC} $pkg is installed"
    else
        echo -e "${YELLOW}⊘${NC} $pkg is not installed"
        MISSING_PACKAGES+=("$pkg")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
    echo "Installing missing packages..."
    npm install --save-dev "${MISSING_PACKAGES[@]}"
fi

# 2️⃣ Install browsers for Playwright (if needed)
print_section "2️⃣ Setting Up Playwright Browsers"

if ! command_exists playwright; then
    echo "Installing Playwright browsers..."
    npx playwright install --with-deps chromium
else
    echo -e "${GREEN}✓${NC} Playwright browsers are ready"
fi

# 3️⃣ Build the application
print_section "3️⃣ Building Application"

echo "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed! Please fix the errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Build completed successfully"

# 4️⃣ Start the production server
print_section "4️⃣ Starting Production Server"

echo "Starting Next.js production server on port 3001..."
npm run start &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
MAX_WAIT=60
WAIT_TIME=0
while ! curl -s http://localhost:3001 > /dev/null 2>&1; do
    if [ $WAIT_TIME -ge $MAX_WAIT ]; then
        echo -e "${RED}✗ Server failed to start within $MAX_WAIT seconds${NC}"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
    sleep 2
    WAIT_TIME=$((WAIT_TIME + 2))
done

echo -e "${GREEN}✓${NC} Server is running on http://localhost:3001"

# 5️⃣ Run Playwright tests
print_section "5️⃣ Running Playwright E2E Tests"

echo "Executing Playwright tests..."
npx playwright test --reporter=html,json --output-dir=test-results

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Playwright tests completed"
else
    echo -e "${YELLOW}⚠${NC} Some Playwright tests failed"
fi

# 6️⃣ Run Lighthouse Audit
print_section "6️⃣ Running Lighthouse Performance Audit"

echo "Auditing application with Lighthouse..."
echo "This may take a few minutes..."

lighthouse http://localhost:3001 \
    --output html,json,csv \
    --output-path=./reports/lighthouse-report \
    --chrome-flags="--headless --no-sandbox --disable-gpu" \
    --only-categories=performance,accessibility,best-practices,seo \
    --locale=en

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Lighthouse audit completed"
else
    echo -e "${YELLOW}⚠${NC} Lighthouse audit encountered issues"
fi

# 7️⃣ Run Bundle Analyzer
print_section "7️⃣ Analyzing Bundle Size"

echo "Analyzing bundle size (this will generate bundle stats)..."
ANALYZE=true npm run build > reports/bundle-analyzer.log 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Bundle analysis completed"
    echo "Check .next/analyze/ directory for detailed bundle information"
else
    echo -e "${YELLOW}⚠${NC} Bundle analysis encountered issues"
fi

# 8️⃣ Generate Summary Report
print_section "8️⃣ Generating Summary Report"

# Stop the server
echo "Stopping production server..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

# Generate summary
SUMMARY_FILE="reports/quality-audit-summary.txt"
cat > "$SUMMARY_FILE" << EOF
===========================================
HYBRID QUALITY AUDIT SUMMARY
===========================================
Generated: $(date)

🎯 Test Results:
   - Playwright Report: playwright-report/index.html
   - Lighthouse Report: reports/lighthouse-report.html
   - Bundle Analysis: .next/analyze/index.html

📊 Quick Stats:
   - Playwright Tests: Check playwright-report/
   - Lighthouse Scores: Check reports/lighthouse-report.html
   - Bundle Size: Check reports/bundle-analyzer.log

🔍 Next Steps:
   1. Review Playwright test results
   2. Check Lighthouse performance scores
   3. Analyze bundle size for optimization opportunities
   4. Fix any failing tests or performance issues

===========================================
EOF

cat "$SUMMARY_FILE"

print_section "✅ Audit Complete!"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Quality Audit Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📁 Reports generated in:"
echo "   ${GREEN}📄 Playwright:${NC} ./playwright-report/index.html"
echo "   ${GREEN}📊 Lighthouse:${NC} ./reports/lighthouse-report.html"
echo "   ${GREEN}📦 Bundle Analyzer:${NC} .next/analyze/index.html"
echo "   ${GREEN}📝 Summary:${NC} ./reports/quality-audit-summary.txt"
echo ""
echo "To view reports:"
echo "   - Playwright: npx playwright show-report"
echo "   - Lighthouse: open ./reports/lighthouse-report.html"
echo "   - Bundle: open .next/analyze/index.html"
echo ""

