#!/bin/bash

# سكريبت مراقبة التغييرات والحفظ التلقائي
echo "👀 بدء مراقبة التغييرات..."

# مراقبة مجلد المشروع
inotifywait -m -r -e modify,create,delete,move /home/ubuntu/moeen/mu3een/src/ |
while read path action file; do
    echo "📝 تم اكتشاف تغيير: $action في $file"
    
    # انتظار 5 ثوان للتأكد من انتهاء التغييرات
    sleep 5
    
    # تشغيل الحفظ التلقائي
    /home/ubuntu/moeen/auto_save.sh
done
