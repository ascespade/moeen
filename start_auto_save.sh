#!/bin/bash

# سكريبت بدء النظام التلقائي
echo "🚀 بدء النظام التلقائي للحفظ..."

# تشغيل مراقبة التغييرات في الخلفية
nohup /home/ubuntu/moeen/watch_changes.sh > /home/ubuntu/moeen/watch.log 2>&1 &

# حفظ PID للمراقبة
echo $! > /home/ubuntu/moeen/watch.pid

echo "✅ تم بدء النظام التلقائي"
echo "📊 PID المراقبة: $(cat /home/ubuntu/moeen/watch.pid)"
echo "📝 ملف السجل: /home/ubuntu/moeen/watch.log"

# تشغيل حفظ أولي
/home/ubuntu/moeen/auto_save.sh
