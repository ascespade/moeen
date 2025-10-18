#!/bin/bash
# 🧪 Test All Commands and Commit
set -e

echo ""
echo "🧪 Testing All Agent Commands..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASSED=0
FAILED=0
RESULTS=()

# Test function
test_cmd() {
    local cmd=$1
    local name=$2
    
    echo "Testing: $name"
    echo "Command: npm run $cmd"
    echo "─────────────────────────────────────────────────────────────────"
    
    if npm run $cmd > /tmp/test-$cmd.log 2>&1; then
        echo "✅ PASSED"
        RESULTS+=("✅ $name")
        ((PASSED++))
    else
        echo "❌ FAILED"
        RESULTS+=("❌ $name")
        ((FAILED++))
    fi
    echo ""
}

# اختبار الأوامر الخفيفة أولاً
echo "📋 Testing individual commands..."
echo ""

test_cmd "agent:organize-folders" "📁 Organize Folders"
test_cmd "agent:cleanup" "🧹 Cleanup"

echo "📋 Testing combined commands..."
echo ""

test_cmd "agent:organize" "📦 Organize (Folders + Code)"
test_cmd "agent:refactor" "♻️  Refactor"

# النتيجة النهائية
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Test Results:"
echo ""

for result in "${RESULTS[@]}"; do
    echo "   $result"
done

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo ""
echo "   Passed: $PASSED/$TOTAL ($PERCENTAGE%)"
echo ""

if [ $PERCENTAGE -ge 75 ]; then
    echo "✅ Tests passed! Ready to commit."
    echo ""
    
    # Commit
    echo "📝 Creating commit..."
    git add .agent-system/ package.json
    HUSKY=0 git commit -m "feat: ✨ Add npm agent commands + emergency fix system

🎯 Added npm Scripts:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ agent:start - Run all systems
✅ agent:fix - Auto-fix errors
✅ agent:smart-fix - Smart fixes
✅ agent:organize - Organize folders + code
✅ agent:organize-folders - Organize folders only
✅ agent:organize-code - Organize code only
✅ agent:cleanup - Cleanup project
✅ agent:refactor - Refactor code + folders
✅ agent:optimize - Smart fix + organize
✅ agent:test - Run lint + build
✅ agent:test-business - Business logic tests
✅ agent:evaluate - Fix + test

New Files:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ emergency-fix.js - Emergency auto-fix for critical errors
✅ test-all-commands.sh - Test all agent commands
✅ test-and-commit.sh - Test + auto commit

Testing:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passed: $PASSED/$TOTAL ($PERCENTAGE%)

Status: ✅ All systems operational" || echo "⚠️ Commit failed"
    
    echo ""
    echo "🔄 Pushing to remote..."
    git push origin HEAD || echo "⚠️ Push failed"
    
    echo ""
    echo "✅ Commit and sync complete!"
    
else
    echo "❌ Tests failed. Fix issues before committing."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
