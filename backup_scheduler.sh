#!/bin/bash

# سكريبت النسخ الاحتياطية الدورية
echo "⏰ بدء النسخ الاحتياطية الدورية..."

# إنشاء مجلد النسخ الاحتياطية
mkdir -p /home/ubuntu/moeen/backups

# نسخة احتياطية كل ساعة
while true; do
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="/home/ubuntu/moeen/backups/moeen_hourly_$TIMESTAMP.tar.gz"
    
    echo "💾 إنشاء نسخة احتياطية: $BACKUP_FILE"
    tar -czf "$BACKUP_FILE" mu3een/ > /dev/null 2>&1
    
    # حذف النسخ القديمة (أكثر من 24 ساعة)
    find /home/ubuntu/moeen/backups -name "moeen_hourly_*.tar.gz" -mtime +1 -delete
    
    echo "✅ تم إنشاء النسخة الاحتياطية: $TIMESTAMP"
    
    # انتظار ساعة واحدة
    sleep 3600
done
