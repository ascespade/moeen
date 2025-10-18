#!/bin/bash
# 🧪 Test All Agent Commands
# يختبر كل أوامر الـ npm agent

echo ""
echo "🧪 Testing All Agent Commands..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESULTS=()
FAILED=0
PASSED=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test command
test_command() {
    local cmd=$1
    local name=$2
    local timeout=${3:-60}
    
    echo ""
    echo -e "${BLUE}Testing: ${NC}$name"
    echo -e "${BLUE}Command: ${NC}npm run $cmd"
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    # Run command with timeout
    if timeout $timeout npm run $cmd > /tmp/agent-test-$cmd.log 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC} - $name"
        RESULTS+=("✅ $name")
        ((PASSED++))
    else
        EXIT_CODE=$?
        echo -e "${RED}❌ FAILED${NC} - $name (exit code: $EXIT_CODE)"
        echo "Last 10 lines of output:"
        tail -10 /tmp/agent-test-$cmd.log
        RESULTS+=("❌ $name")
        ((FAILED++))
    fi
}

# Test commands (من الأخف للأثقل)
echo "📋 Starting tests..."
echo ""

# 1. Lightweight tests first
test_command "agent:organize-folders" "📁 Organize Folders" 30
test_command "agent:organize-code" "🎨 Organize Code" 60
test_command "agent:cleanup" "🧹 Cleanup Project" 30

# 2. Fix commands
test_command "agent:smart-fix" "🧠 Smart Fix" 60
test_command "agent:fix" "🤖 Auto Fix" 120

# 3. Combined commands
test_command "agent:organize" "📁🎨 Organize (Folders + Code)" 90
test_command "agent:refactor" "♻️  Refactor" 90
test_command "agent:optimize" "⚡ Optimize" 120

# 4. Heavy tests (skip build to save time)
# test_command "agent:test" "🧪 Test" 300
# test_command "agent:evaluate" "📊 Evaluate" 360

# 5. Full system (skip in quick test)
# test_command "agent:start" "🚀 Start (All Systems)" 300

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Test Summary:"
echo ""

for result in "${RESULTS[@]}"; do
    echo "   $result"
done

echo ""
echo "   Total: $((PASSED + FAILED)) tests"
echo -e "   ${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "   ${RED}Failed: $FAILED${NC}"
else
    echo -e "   ${GREEN}Failed: $FAILED${NC}"
fi

PERCENTAGE=$((PASSED * 100 / (PASSED + FAILED)))
echo ""
echo "   Success Rate: $PERCENTAGE%"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check logs in /tmp/agent-test-*.log${NC}"
    echo ""
    exit 1
fi
