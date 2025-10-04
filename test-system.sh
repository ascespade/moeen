#!/bin/bash

# اختبار نظام مُعين - محمي من التعديل
echo "🧪 بدء اختبار نظام مُعين..."

# اختبار 1: فحص الصفحة الرئيسية
echo "📄 اختبار الصفحة الرئيسية..."
if curl -s http://localhost:3004/ | grep -q "مُعين"; then
    echo "✅ الصفحة الرئيسية تعمل"
else
    echo "❌ الصفحة الرئيسية لا تعمل"
fi

# اختبار 2: فحص صفحة تسجيل الدخول
echo "🔐 اختبار صفحة تسجيل الدخول..."
if curl -s http://localhost:3004/login | grep -q "تسجيل الدخول"; then
    echo "✅ صفحة تسجيل الدخول تعمل"
else
    echo "❌ صفحة تسجيل الدخول لا تعمل"
fi

# اختبار 3: فحص API تسجيل الدخول
echo "🔑 اختبار API تسجيل الدخول..."
response=$(curl -s -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alhemamcenter.com","password":"admin123"}')

if echo "$response" | grep -q "success"; then
    echo "✅ API تسجيل الدخول يعمل"
else
    echo "❌ API تسجيل الدخول لا يعمل"
    echo "Response: $response"
fi

# اختبار 4: فحص اللوجو
echo "🖼️ اختبار اللوجو..."
if curl -s -I http://localhost:3004/logo.jpg | grep -q "200 OK"; then
    echo "✅ اللوجو يعمل"
else
    echo "❌ اللوجو لا يعمل"
fi

# اختبار 5: فحص CSS
echo "🎨 اختبار CSS..."
if curl -s http://localhost:3004/login | grep -q "tailwind"; then
    echo "✅ CSS يعمل"
else
    echo "❌ CSS لا يعمل"
fi

echo "🏁 انتهى الاختبار"
