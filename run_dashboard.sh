#!/bin/bash

# سكريبت تشغيل مبسط للداشبورد
echo "🚀 تشغيل الداشبورد..."

# تشغيل خادم البيانات
python3 api_server.py &
API_PID=$!

# انتظار قليل
sleep 2

# تشغيل خادم HTTP
python3 http_server.py 5000 &
HTTP_PID=$!

echo "✅ الداشبورد يعمل الآن!"
echo "🌐 رابط الداشبورد: http://localhost:5000/dashboard.html"
echo "📡 API البيانات: http://localhost:5000/api/dashboard-data"
echo ""
echo "لإيقاف الداشبورد: kill $API_PID $HTTP_PID"
echo "أو استخدم: ./stop_dashboard.sh"
