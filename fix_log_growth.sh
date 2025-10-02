#!/bin/bash
# إصلاح مشكلة نمو ملفات Log بسرعة
# Fix rapid log file growth problem

echo "🚨 إصلاح مشكلة نمو ملفات Log (50GB/hour)"
echo "========================================"

# 1. إيقاف جميع العمليات المشكوك فيها
echo "⏹️ إيقاف العمليات المشكوك فيها..."
pkill -f cloudflared 2>/dev/null || echo "cloudflared غير نشط"
pkill -f tunnel 2>/dev/null || echo "tunnel غير نشط"  
pkill -f cursor-nightly 2>/dev/null || echo "cursor-nightly غير نشط"
pkill -f node 2>/dev/null || echo "node غير نشط"

# 2. البحث عن ملفات Log الكبيرة
echo ""
echo "🔍 البحث عن ملفات Log الكبيرة..."
find /home/ubuntu -name "*.log" -type f -exec ls -lah {} \; 2>/dev/null
find /tmp -name "*.log" -type f -exec ls -lah {} \; 2>/dev/null
find /var/log -name "*.log" -type f -size +100M -exec ls -lah {} \; 2>/dev/null

# 3. تنظيف ملفات Log الكبيرة
echo ""
echo "🧹 تنظيف ملفات Log..."

# تفريغ ملفات Log بدلاً من حذفها (للحفاظ على العمليات)
for logfile in /home/ubuntu/*.log /tmp/*.log; do
    if [ -f "$logfile" ] && [ $(stat -f%z "$logfile" 2>/dev/null || stat -c%s "$logfile" 2>/dev/null) -gt 104857600 ]; then
        echo "تفريغ: $logfile"
        > "$logfile"
    fi
done

# 4. إعداد logrotate لمنع نمو الملفات
echo ""
echo "⚙️ إعداد logrotate..."
cat > /tmp/custom-logrotate.conf << 'EOF'
/home/ubuntu/*.log {
    daily
    rotate 3
    compress
    delaycompress
    missingok
    notifempty
    maxsize 100M
    copytruncate
}

/tmp/*.log {
    hourly
    rotate 1
    compress
    maxsize 50M
    copytruncate
    missingok
}
EOF

# 5. إنشاء مراقب للملفات الكبيرة
echo ""
echo "👁️ إنشاء مراقب الملفات..."
cat > /home/ubuntu/log-monitor.sh << 'EOF'
#!/bin/bash
# مراقب ملفات Log

while true; do
    # فحص كل دقيقة
    sleep 60
    
    # البحث عن ملفات أكبر من 1GB
    large_files=$(find /home/ubuntu /tmp -name "*.log" -type f -size +1G 2>/dev/null)
    
    if [ ! -z "$large_files" ]; then
        echo "$(date): ملفات كبيرة وُجدت!" >> /home/ubuntu/log-monitor.log
        echo "$large_files" >> /home/ubuntu/log-monitor.log
        
        # تفريغ الملفات الكبيرة
        echo "$large_files" | while read file; do
            if [ -f "$file" ]; then
                echo "$(date): تفريغ $file" >> /home/ubuntu/log-monitor.log
                > "$file"
            fi
        done
    fi
    
    # فحص مساحة القرص
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 95 ]; then
        echo "$(date): تحذير! مساحة القرص: ${disk_usage}%" >> /home/ubuntu/log-monitor.log
        # تنظيف طارئ
        find /tmp -type f -name "*.log" -delete 2>/dev/null
        find /home/ubuntu -name "*.log" -size +100M -exec truncate -s 0 {} \; 2>/dev/null
    fi
done
EOF

chmod +x /home/ubuntu/log-monitor.sh

# 6. إيقاف العمليات التي تكتب logs كثيراً
echo ""
echo "🔧 فحص العمليات النشطة..."

# البحث عن العمليات التي تستهلك CPU كثيراً (قد تكون تكتب logs)
high_cpu_processes=$(ps aux | awk '$3 > 5.0 {print $2, $11}' | grep -v PID)
if [ ! -z "$high_cpu_processes" ]; then
    echo "عمليات تستهلك CPU كثيراً:"
    echo "$high_cpu_processes"
fi

# 7. إعداد crontab للمراقبة
echo ""
echo "⏰ إعداد مراقبة دورية..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /bin/bash -c 'find /home/ubuntu /tmp -name \"*.log\" -size +500M -exec truncate -s 0 {} \;' 2>/dev/null") | crontab -

# 8. فحص النتائج
echo ""
echo "📊 النتائج:"
echo "مساحة القرص:"
df -h /
echo ""
echo "ملفات Log الحالية:"
find /home/ubuntu -name "*.log" -exec ls -lah {} \; 2>/dev/null

echo ""
echo "✅ تم الانتهاء من الإصلاح!"
echo ""
echo "🔍 للمراقبة المستمرة:"
echo "  tail -f /home/ubuntu/log-monitor.log"
echo ""
echo "⚠️ إذا استمرت المشكلة:"
echo "  1. فحص العمليات: ps aux | grep -E 'log|tunnel|cloudflare'"
echo "  2. مراقبة الملفات: watch 'ls -lah /home/ubuntu/*.log'"
echo "  3. فحص مساحة القرص: watch 'df -h /'"
EOF
