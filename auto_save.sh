#!/bin/bash

# سكريبت الحفظ التلقائي
# Auto Save Script for Cursor Server

echo "🔄 بدء الحفظ التلقائي..."

# الانتقال إلى مجلد المشروع
cd /home/ubuntu/moeen/mu3een

# التحقق من وجود تغييرات
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 تم العثور على تغييرات جديدة..."
    
    # إضافة جميع الملفات
    git add .
    
    # إنشاء commit مع timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "Auto-save: $TIMESTAMP"
    
    # رفع التغييرات
    git push origin main
    
    echo "✅ تم الحفظ بنجاح في: $TIMESTAMP"
else
    echo "ℹ️ لا توجد تغييرات جديدة"
fi

# إنشاء نسخة احتياطية إضافية
cd /home/ubuntu/moeen
BACKUP_FILE="moeen_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" mu3een/ > /dev/null 2>&1

echo "💾 تم إنشاء نسخة احتياطية: $BACKUP_FILE"
echo "🎉 انتهى الحفظ التلقائي"
