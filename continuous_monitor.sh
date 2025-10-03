#!/bin/bash

# سكريبت المراقبة المستمرة مع التسجيل
LOG_FILE="/home/ubuntu/moeen/resource_log.txt"
INTERVAL=5  # ثواني

echo "بدء المراقبة المستمرة للموارد..."
echo "البيانات تُحفظ في: $LOG_FILE"
echo "اضغط Ctrl+C للإيقاف"
echo ""

# إنشاء ملف السجل إذا لم يكن موجوداً
touch "$LOG_FILE"

# دالة لتسجيل البيانات
log_resources() {
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "=== $timestamp ===" >> "$LOG_FILE"
    
    # معلومات المعالج
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    echo "CPU Usage: $cpu_usage%" >> "$LOG_FILE"
    
    # معلومات الذاكرة
    memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    echo "Memory Usage: $memory_usage%" >> "$LOG_FILE"
    
    # معلومات القرص
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    echo "Disk Usage: $disk_usage%" >> "$LOG_FILE"
    
    # عدد العمليات
    process_count=$(ps aux | wc -l)
    echo "Process Count: $process_count" >> "$LOG_FILE"
    
    echo "---" >> "$LOG_FILE"
}

# دالة لعرض الإحصائيات الحالية
show_current_stats() {
    clear
    echo "=== مراقب الموارد المستمر ==="
    echo "الوقت: $(date)"
    echo "الملف: $LOG_FILE"
    echo ""
    
    # عرض الإحصائيات الحالية
    echo "💾 الذاكرة:"
    free -h | grep Mem
    echo ""
    
    echo "⚙️ المعالج:"
    top -bn1 | grep "Cpu(s)"
    echo ""
    
    echo "💿 القرص:"
    df -h | grep "/dev/root"
    echo ""
    
    echo "📊 العمليات النشطة:"
    ps aux --sort=-%cpu | head -5
    echo ""
    
    echo "التحديث التالي خلال $INTERVAL ثوان..."
}

# المراقبة المستمرة
while true; do
    show_current_stats
    log_resources
    sleep $INTERVAL
done
