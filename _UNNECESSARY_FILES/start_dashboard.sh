#!/bin/bash

# سكريبت تشغيل الداشبورد
echo "🚀 بدء تشغيل الداشبورد..."

# الانتقال إلى مجلد المشروع
cd /home/ubuntu/moeen

# تشغيل خادم البيانات في الخلفية
python3 api_server.py &
API_PID=$!

# انتظار قليل لبدء الخادم
sleep 2

# تشغيل خادم HTTP مخصص للداشبورد
echo "📊 بدء خادم الداشبورد على المنفذ 3000..."
python3 http_server.py 3000 &
HTTP_PID=$!

# حفظ معرفات العمليات
echo $API_PID > dashboard_api.pid
echo $HTTP_PID > dashboard_http.pid

echo "✅ تم بدء الداشبورد بنجاح!"
echo "🌐 رابط الداشبورد: http://localhost:3000/dashboard.html"
echo "📡 API البيانات: http://localhost:3000/api/dashboard-data"
echo ""
echo "لإيقاف الداشبورد: ./stop_dashboard.sh"
echo "للمراقبة: tail -f dashboard.log"
