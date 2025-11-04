#!/bin/bash
# اختبار اتصال Tailscale مع API key

TAILSCALE_API_KEY="tskey-auth-kFuUJFx7bG11CNTRL-ybDF8REWMNiicmkBXKCANijy4fW1FQ74"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔗 اختبار اتصال Tailscale                              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# التحقق من أن tailscaled يعمل
if ! ps aux | grep -q "[t]ailscaled"; then
    echo "⚠️ tailscaled غير قيد التشغيل، بدء التشغيل..."
    sudo tailscaled --tun=userspace-networking --state=/var/lib/tailscale/tailscaled.state > /tmp/tailscaled.log 2>&1 &
    sleep 10
fi

echo "📋 حالة Tailscale الحالية:"
tailscale status 2>&1 | head -5
echo ""

echo "🔑 محاولة الاتصال باستخدام API key..."
echo "$TAILSCALE_API_KEY" | sudo tailscale up --authkey - --accept-routes 2>&1

sleep 5

echo ""
echo "📊 النتيجة:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if tailscale status 2>&1 | grep -q "Logged in"; then
    echo "✅ تم الاتصال بنجاح!"
    echo ""
    echo "📍 عنوان IP:"
    tailscale ip -4 2>&1
    echo ""
    echo "📋 الحالة الكاملة:"
    tailscale status 2>&1 | head -10
else
    echo "❌ فشل الاتصال"
    echo ""
    echo "📝 الحالة الحالية:"
    tailscale status 2>&1 | head -5
    echo ""
    echo "⚠️ ملاحظة: قد يكون الـ API key:"
    echo "   - منتهي الصلاحية"
    echo "   - غير صحيح"
    echo "   - يحتاج صلاحيات خاصة"
    echo ""
    echo "💡 بديل: استخدم هذا الأمر للحصول على رابط تسجيل الدخول:"
    echo "   sudo tailscale up"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
