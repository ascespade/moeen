#!/bin/bash

# سكريبت مراقبة سريع للموارد
echo "=== مراقب الموارد السريع ==="
echo ""

echo "💾 الذاكرة:"
free -h
echo ""

echo "💿 القرص:"
df -h | grep -E '^/dev/'
echo ""

echo "⚙️ المعالج (أعلى 5 عمليات):"
ps aux --sort=-%cpu | head -6
echo ""

echo "📊 استخدام المعالج:"
top -bn1 | grep "Cpu(s)"
echo ""

echo "🌐 الاتصالات النشطة:"
netstat -tuln | head -5
