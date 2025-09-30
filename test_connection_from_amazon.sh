#!/bin/bash

# سكريبت لاختبار الاتصال من خادم Amazon إلى هذا الخادم
# يجب تشغيل هذا السكريبت على خادم Amazon

echo "=== اختبار الاتصال من خادم Amazon ==="
echo ""

# معلومات الخادم المستهدف
TARGET_IP="3.228.249.171"
TARGET_USER="ubuntu"
KEY_PATH="~/.ssh/amazon_server_key"

echo "الخادم المستهدف: $TARGET_IP"
echo "المستخدم: $TARGET_USER"
echo "مفتاح SSH: $KEY_PATH"
echo ""

# فحص وجود المفتاح
if [ ! -f ~/.ssh/amazon_server_key ]; then
    echo "❌ خطأ: المفتاح غير موجود في ~/.ssh/amazon_server_key"
    echo "يرجى نسخ المفتاح الخاص إلى خادم Amazon أولاً"
    exit 1
fi

# فحص صلاحيات المفتاح
if [ ! -r ~/.ssh/amazon_server_key ]; then
    echo "❌ خطأ: لا يمكن قراءة المفتاح"
    echo "يرجى تعديل صلاحيات المفتاح: chmod 600 ~/.ssh/amazon_server_key"
    exit 1
fi

echo "✅ المفتاح موجود ويمكن قراءته"
echo ""

# اختبار الاتصال
echo "محاولة الاتصال..."
ssh -i ~/.ssh/amazon_server_key -o ConnectTimeout=10 -o StrictHostKeyChecking=no $TARGET_USER@$TARGET_IP "echo '✅ الاتصال ناجح!'; echo 'معلومات الخادم:'; uname -a; echo 'المستخدم الحالي:'; whoami; echo 'المجلد الحالي:'; pwd"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 تم الاتصال بنجاح!"
    echo ""
    echo "يمكنك الآن استخدام الأوامر التالية للاتصال:"
    echo "ssh -i ~/.ssh/amazon_server_key $TARGET_USER@$TARGET_IP"
    echo ""
    echo "أو باستخدام SSH config:"
    echo "ssh cursor-server"
else
    echo ""
    echo "❌ فشل الاتصال!"
    echo ""
    echo "يرجى التحقق من:"
    echo "1. عنوان IP صحيح: $TARGET_IP"
    echo "2. المفتاح صحيح ومضاف إلى authorized_keys"
    echo "3. Security Group يسمح بالاتصال الصادر"
    echo "4. الخادم المستهدف متاح"
fi
