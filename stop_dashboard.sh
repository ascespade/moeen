#!/bin/bash

# سكريبت إيقاف الداشبورد
echo "🛑 إيقاف الداشبورد..."

# إيقاف خادم البيانات
if [ -f dashboard_api.pid ]; then
    API_PID=$(cat dashboard_api.pid)
    kill $API_PID 2>/dev/null
    rm dashboard_api.pid
    echo "✅ تم إيقاف خادم البيانات"
fi

# إيقاف خادم HTTP
if [ -f dashboard_http.pid ]; then
    HTTP_PID=$(cat dashboard_http.pid)
    kill $HTTP_PID 2>/dev/null
    rm dashboard_http.pid
    echo "✅ تم إيقاف خادم HTTP"
fi

# إيقاف جميع عمليات Python المتعلقة بالداشبورد
pkill -f "api_server.py" 2>/dev/null
pkill -f "http.server.*8080" 2>/dev/null

echo "🎉 تم إيقاف الداشبورد بالكامل"
