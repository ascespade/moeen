#!/bin/bash

# إعداد SSH بدون كلمة مرور وضمان بقاء Tailscale يعمل
echo "🚀 بدء إعداد SSH بدون كلمة مرور و Tailscale..."

# 1. نسخ المفتاح العام إلى الخادم
echo "📋 نسخ المفتاح العام إلى الخادم..."
scp public_key.txt ubuntu@100.64.64.33:~/

# 2. إعداد المفتاح على الخادم
echo "🔑 إعداد المفتاح على الخادم..."
ssh ubuntu@100.64.64.33 << 'EOF'
# إنشاء مجلد .ssh إذا لم يكن موجوداً
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# إضافة المفتاح العام إلى authorized_keys
cat ~/public_key.txt >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# تنظيف الملف المؤقت
rm ~/public_key.txt

echo "✅ تم إعداد SSH بدون كلمة مرور بنجاح!"
EOF

# 3. إعداد Tailscale ليعمل كخدمة في الخلفية
echo "🌐 إعداد Tailscale كخدمة في الخلفية..."
ssh ubuntu@100.64.64.33 << 'EOF'
# إيقاف Tailscale الحالي
sudo tailscale down

# تشغيل Tailscale كخدمة
sudo tailscale up --accept-routes --accept-dns=false

# إعداد Tailscale ليعمل عند بدء التشغيل
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# التحقق من حالة Tailscale
tailscale status

echo "✅ تم إعداد Tailscale ليعمل في الخلفية!"
EOF

echo "🎉 تم إكمال الإعداد بنجاح!"
echo "الآن يمكنك الاتصال بـ: ssh ubuntu@100.64.64.33"
echo "و Tailscale سيبقى يعمل حتى لو أغلقت Cursor!"
