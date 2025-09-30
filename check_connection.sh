#!/bin/bash

echo "=== فحص الاتصال من السيرفر نفسه ==="
echo ""

# الحصول على العنوان الحالي
CURRENT_IP=$(curl -s ifconfig.me)
echo "العنوان الحالي: $CURRENT_IP"
echo ""

# فحص خدمة SSH
echo "فحص خدمة SSH:"
if systemctl is-active --quiet ssh 2>/dev/null || service ssh status >/dev/null 2>&1; then
    echo "✅ خدمة SSH تعمل"
else
    echo "❌ خدمة SSH لا تعمل"
fi

# فحص المنفذ 22
echo ""
echo "فحص المنفذ 22:"
if netstat -tlnp 2>/dev/null | grep :22 >/dev/null; then
    echo "✅ المنفذ 22 مفتوح"
    netstat -tlnp 2>/dev/null | grep :22
elif ss -tlnp 2>/dev/null | grep :22 >/dev/null; then
    echo "✅ المنفذ 22 مفتوح"
    ss -tlnp 2>/dev/null | grep :22
else
    echo "❌ المنفذ 22 غير مفتوح"
fi

# فحص المفاتيح
echo ""
echo "فحص المفاتيح:"
if [ -f ~/.ssh/authorized_keys ]; then
    echo "✅ ملف authorized_keys موجود"
    echo "عدد المفاتيح: $(wc -l < ~/.ssh/authorized_keys)"
    echo "المفاتيح الموجودة:"
    cat ~/.ssh/authorized_keys | while read line; do
        if [ ! -z "$line" ]; then
            echo "  - $(echo $line | cut -d' ' -f3)"
        fi
    done
else
    echo "❌ ملف authorized_keys غير موجود"
fi

# فحص إعدادات SSH
echo ""
echo "فحص إعدادات SSH:"
echo "المنفذ: $(grep -E '^Port' /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}' || echo '22 (افتراضي)')"
echo "السماح بكلمات المرور: $(grep -E '^PasswordAuthentication' /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}' || echo 'نعم (افتراضي)')"
echo "السماح بالمفاتيح: $(grep -E '^PubkeyAuthentication' /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}' || echo 'نعم (افتراضي)')"

echo ""
echo "=== معلومات الاتصال ==="
echo "العنوان: $CURRENT_IP"
echo "المستخدم: ubuntu"
echo "المنفذ: 22"
echo ""
echo "للاختبار من خادم Amazon:"
echo "ssh -i ~/.ssh/amazon_server_key ubuntu@$CURRENT_IP"
