#!/bin/bash

# سكريبت تحليل بيانات المراقبة
LOG_FILE="/home/ubuntu/moeen/resource_log.txt"

if [ ! -f "$LOG_FILE" ]; then
    echo "ملف السجل غير موجود: $LOG_FILE"
    echo "قم بتشغيل continuous_monitor.sh أولاً"
    exit 1
fi

echo "=== تحليل بيانات المراقبة ==="
echo "ملف السجل: $LOG_FILE"
echo ""

# إحصائيات عامة
total_entries=$(grep -c "CPU Usage:" "$LOG_FILE")
echo "📊 إجمالي عدد التسجيلات: $total_entries"
echo ""

# متوسط استخدام المعالج
echo "⚙️ إحصائيات المعالج:"
avg_cpu=$(grep "CPU Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | awk '{sum+=$1} END {printf "%.1f", sum/NR}')
max_cpu=$(grep "CPU Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | sort -n | tail -1)
min_cpu=$(grep "CPU Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | sort -n | head -1)

echo "  متوسط الاستخدام: ${avg_cpu}%"
echo "  الحد الأقصى: ${max_cpu}%"
echo "  الحد الأدنى: ${min_cpu}%"
echo ""

# إحصائيات الذاكرة
echo "💾 إحصائيات الذاكرة:"
avg_mem=$(grep "Memory Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | awk '{sum+=$1} END {printf "%.1f", sum/NR}')
max_mem=$(grep "Memory Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | sort -n | tail -1)
min_mem=$(grep "Memory Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | sort -n | head -1)

echo "  متوسط الاستخدام: ${avg_mem}%"
echo "  الحد الأقصى: ${max_mem}%"
echo "  الحد الأدنى: ${min_mem}%"
echo ""

# إحصائيات القرص
echo "💿 إحصائيات القرص:"
avg_disk=$(grep "Disk Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | awk '{sum+=$1} END {printf "%.1f", sum/NR}')
max_disk=$(grep "Disk Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | sort -n | tail -1)
min_disk=$(grep "Disk Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | sort -n | head -1)

echo "  متوسط الاستخدام: ${avg_disk}%"
echo "  الحد الأقصى: ${max_disk}%"
echo "  الحد الأدنى: ${min_disk}%"
echo ""

# تحليل الإنذارات
echo "⚠️ تحليل الإنذارات:"
high_cpu_count=$(grep "CPU Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | awk '$1 > 80' | wc -l)
high_mem_count=$(grep "Memory Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | awk '$1 > 80' | wc -l)
high_disk_count=$(grep "Disk Usage:" "$LOG_FILE" | awk -F': ' '{print $2}' | sed 's/%//' | awk '$1 > 80' | wc -l)

echo "  مرات تجاوز المعالج 80%: $high_cpu_count"
echo "  مرات تجاوز الذاكرة 80%: $high_mem_count"
echo "  مرات تجاوز القرص 80%: $high_disk_count"
echo ""

# آخر 5 تسجيلات
echo "📋 آخر 5 تسجيلات:"
tail -20 "$LOG_FILE" | grep -A4 "===" | tail -20
