#!/usr/bin/env bash
# verify-full-suite-setup.sh - Verification script for full test suite setup

set -e

echo "🔍 Verifying Full Test Suite Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass() {
  echo -e "${GREEN}✅ $1${NC}"
}

fail() {
  echo -e "${RED}❌ $1${NC}"
}

warn() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check main script
echo "📝 Checking main script..."
if [[ -f "run-full-suite.sh" ]] && [[ -x "run-full-suite.sh" ]]; then
  pass "run-full-suite.sh exists and is executable"
else
  fail "run-full-suite.sh missing or not executable"
  exit 1
fi

# Check syntax
echo ""
echo "🔤 Checking bash syntax..."
if bash -n run-full-suite.sh; then
  pass "Bash syntax is valid"
else
  fail "Syntax errors found"
  exit 1
fi

# Check dependencies
echo ""
echo "🔧 Checking dependencies..."

check_tool() {
  if command -v "$1" >/dev/null 2>&1; then
    local version=$($1 --version 2>&1 | head -1)
    pass "$1 installed: $version"
    return 0
  else
    fail "$1 not found"
    return 1
  fi
}

check_tool node
check_tool npm
check_tool npx
check_tool jq
check_tool psql
check_tool pg_dump

# Check directories
echo ""
echo "📁 Checking directories..."

check_dir() {
  if [[ -d "$1" ]]; then
    pass "Directory exists: $1"
    return 0
  else
    warn "Directory missing: $1 (will be created on first run)"
    return 1
  fi
}

check_dir "scripts/ci"
check_dir "test-results"
check_dir "test-reports"
check_dir "tmp"

# Check package.json
echo ""
echo "📦 Checking package.json..."
if grep -q "test:full-suite" package.json; then
  pass "NPM script 'test:full-suite' added to package.json"
else
  warn "NPM script not found in package.json"
fi

# Check Playwright configs
echo ""
echo "🎭 Checking Playwright configs..."
if [[ -f "playwright.config.ts" ]]; then
  pass "playwright.config.ts exists"
else
  warn "playwright.config.ts not found"
fi

if [[ -f "playwright-auto.config.ts" ]]; then
  pass "playwright-auto.config.ts exists"
else
  warn "playwright-auto.config.ts not found"
fi

# Check documentation
echo ""
echo "📚 Checking documentation..."
if [[ -f "RUN_FULL_SUITE_README.md" ]]; then
  pass "RUN_FULL_SUITE_README.md exists"
else
  warn "Documentation file not found"
fi

if [[ -f "FULL_SUITE_SETUP_COMPLETE.md" ]]; then
  pass "FULL_SUITE_SETUP_COMPLETE.md exists"
else
  warn "Setup completion file not found"
fi

# Test database connection (optional)
echo ""
echo "🔌 Testing database connection (optional)..."
export SUPABASE_DB_URL="postgresql://postgres:password@socwpqzcalgvpzjwavgh.supabase.co:5432/postgres"
if psql "${SUPABASE_DB_URL}" -c "SELECT 1" >/dev/null 2>&1; then
  pass "Database connection successful"
else
  warn "Database connection failed (this may be expected if credentials need updating)"
fi

# Check Node modules
echo ""
echo "📦 Checking Node.js dependencies..."
if [[ -d "node_modules" ]]; then
  pass "node_modules directory exists"
  if [[ -d "node_modules/@playwright/test" ]]; then
    pass "@playwright/test is installed"
  else
    warn "@playwright/test not found (run: npm install)"
  fi
else
  warn "node_modules not found (run: npm install)"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Core components are set up correctly!"
echo ""
echo "📝 To run the full test suite:"
echo "   ./run-full-suite.sh"
echo "   OR"
echo "   npm run test:full-suite"
echo ""
echo "📚 Read the documentation:"
echo "   cat RUN_FULL_SUITE_README.md"
echo ""
echo "🎯 Quick test (syntax check only):"
echo "   bash -n run-full-suite.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
