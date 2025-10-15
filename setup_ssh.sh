#!/bin/bash

# سكريبت لإعداد SSH بدون كلمة مرور
# الاستخدام: ./setup_ssh.sh user@hostname

if [ $# -eq 0 ]; then
    echo "الاستخدام: $0 user@hostname"
    echo "مثال: $0 ubuntu@192.168.1.100"
    exit 1
fi

REMOTE_HOST=$1
PUBLIC_KEY=$(cat ~/.ssh/id_rsa.pub)

echo "نسخ المفتاح العام إلى $REMOTE_HOST..."

# نسخ المفتاح إلى الخادم البعيد
ssh-copy-id -i ~/.ssh/id_rsa.pub $REMOTE_HOST

if [ $? -eq 0 ]; then
    echo "تم إعداد SSH بنجاح! يمكنك الآن الاتصال بدون كلمة مرور:"
    echo "ssh $REMOTE_HOST"
else
    echo "فشل في إعداد SSH. تأكد من:"
    echo "1. أن الخادم البعيد متاح"
    echo "2. أن لديك صلاحيات الاتصال"
    echo "3. أن خدمة SSH تعمل على الخادم البعيد"
fi
