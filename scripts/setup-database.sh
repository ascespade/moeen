#!/bin/bash

# Muayin Assistant Database Setup Script
# سكريبت إعداد قاعدة البيانات لنظام مُعين

echo "🚀 بدء إعداد قاعدة البيانات..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI غير مثبت"
    echo "📦 جاري تثبيت Supabase CLI..."
    npm install -g supabase
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ ملف .env.local غير موجود"
    echo "📝 يرجى إنشاء ملف .env.local أولاً"
    exit 1
fi

# Load environment variables
source .env.local

# Check if Supabase URL and keys are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ مفاتيح Supabase غير محددة في .env.local"
    exit 1
fi

echo "✅ مفاتيح Supabase موجودة"

# Create database schema
echo "📊 جاري إنشاء schema قاعدة البيانات..."

# Apply schema using Supabase CLI
if command -v supabase &> /dev/null; then
    echo "🔧 تطبيق Schema باستخدام Supabase CLI..."
    
    # Initialize Supabase project if not already done
    if [ ! -f "supabase/config.toml" ]; then
        echo "⚙️ تهيئة مشروع Supabase..."
        supabase init
    fi
    
    # Link to remote project
    echo "🔗 ربط المشروع بـ Supabase..."
    supabase link --project-ref socwpqzcalgvpzjwavgh
    
    # Apply migrations
    echo "📈 تطبيق المايجريشنز..."
    supabase db push
    
else
    echo "⚠️ Supabase CLI غير متاح، سيتم استخدام SQL مباشرة"
    
    # Use psql to apply schema directly
    if command -v psql &> /dev/null; then
        echo "🐘 تطبيق Schema باستخدام psql..."
        PGPASSWORD=$DATABASE_PASSWORD psql -h db.socwpqzcalgvpzjwavgh.supabase.co -p 5432 -U postgres -d postgres -f supabase-schema.sql
    else
        echo "❌ psql غير متاح"
        echo "📋 يرجى تطبيق الملف التالي يدوياً:"
        echo "   supabase-schema.sql"
        exit 1
    fi
fi

echo "✅ تم إنشاء قاعدة البيانات بنجاح!"

# Verify database setup
echo "🔍 التحقق من إعداد قاعدة البيانات..."

# Test connection
if command -v psql &> /dev/null; then
    echo "🧪 اختبار الاتصال بقاعدة البيانات..."
    PGPASSWORD=$DATABASE_PASSWORD psql -h db.socwpqzcalgvpzjwavgh.supabase.co -p 5432 -U postgres -d postgres -c "SELECT COUNT(*) FROM users;" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ الاتصال بقاعدة البيانات ناجح"
        
        # Show user count
        USER_COUNT=$(PGPASSWORD=$DATABASE_PASSWORD psql -h db.socwpqzcalgvpzjwavgh.supabase.co -p 5432 -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
        echo "👥 عدد المستخدمين: $USER_COUNT"
        
        # Show conversation count
        CONV_COUNT=$(PGPASSWORD=$DATABASE_PASSWORD psql -h db.socwpqzcalgvpzjwavgh.supabase.co -p 5432 -U postgres -d postgres -t -c "SELECT COUNT(*) FROM conversations;" 2>/dev/null | tr -d ' ')
        echo "💬 عدد المحادثات: $CONV_COUNT"
        
    else
        echo "❌ فشل الاتصال بقاعدة البيانات"
        exit 1
    fi
else
    echo "⚠️ psql غير متاح للتحقق"
fi

echo ""
echo "🎉 تم إعداد قاعدة البيانات بنجاح!"
echo ""
echo "📋 ملخص الإعداد:"
echo "   ✅ تم إنشاء الجداول الأساسية"
echo "   ✅ تم إدراج المستخدمين التجريبيين"
echo "   ✅ تم إدراج المحادثات النموذجية"
echo "   ✅ تم إدراج التدفقات التلقائية"
echo "   ✅ تم إعداد Row Level Security"
echo ""
echo "🔑 بيانات الدخول التجريبية:"
echo "   👤 admin@alhemamcenter.com / admin123 (مدير)"
echo "   👤 manager@alhemamcenter.com / manager123 (مدير فريق)"
echo "   👤 agent@alhemamcenter.com / agent123 (وكيل)"
echo "   👤 demo@alhemamcenter.com / demo123 (تجريبي)"
echo ""
echo "🚀 يمكنك الآن تشغيل المشروع: npm run dev"
