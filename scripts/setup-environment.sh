#!/bin/bash

echo "🔧 إعداد متغيرات البيئة للنظام..."

# إنشاء مجلدات مطلوبة
mkdir -p logs
mkdir -p reports
mkdir -p reports/backups

# نسخ ملف البيئة إذا لم يكن موجوداً
if [ ! -f .env ]; then
    echo "📝 إنشاء ملف .env من env.example..."
    cp env.example .env
    echo "⚠️ يرجى تعديل ملف .env وإضافة المفاتيح الصحيحة"
else
    echo "✅ ملف .env موجود بالفعل"
fi

# فحص المتغيرات المطلوبة
echo "🔍 فحص المتغيرات المطلوبة..."

required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "CURSOR_API_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ جميع المتغيرات المطلوبة موجودة"
else
    echo "❌ المتغيرات المفقودة:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo "⚠️ يرجى إضافة هذه المتغيرات إلى ملف .env أو متغيرات البيئة"
fi

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install

# تثبيت Playwright
echo "🎭 تثبيت Playwright..."
npx playwright install --with-deps
npx playwright install chromium

echo "✅ تم إعداد البيئة بنجاح!"
echo ""
echo "🚀 لتشغيل النظام:"
echo "  npm run agent:auto"
echo "  npm run agent:background"
echo "  npm run agent:heal"
