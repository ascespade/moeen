#!/bin/bash

# ================================
#  Tailscale Guardian Script 🧠
#  Advanced Version for Containers
# ================================

# إعدادات عامة
STATE_FILE="/var/lib/tailscale/tailscaled.state"
SOCKET_FILE="/var/run/tailscale/tailscaled.sock"
LOG_FILE="/var/log/tailscale-guardian.log"
HOSTNAME="server-node"     # غيره لو تبغى اسم مخصص
AUTH_KEY="<YOUR_AUTH_KEY>" # ضع مفتاح التوثيق من Tailscale

# إعدادات متقدمة للبيئات المقيدة
USE_USERSPACE_NETWORKING=true
SKIP_IPTABLES=false
SKIP_TUN_CHECK=false

# تأكد أن الملفات والمجلدات موجودة
sudo mkdir -p /var/lib/tailscale
sudo mkdir -p /var/run/tailscale
sudo mkdir -p /var/log
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"

# دالة للتحقق من البيئة
check_environment() {
  echo "$(date) 🔍 فحص البيئة..." >> "$LOG_FILE"
  
  # فحص إذا كان في Docker/Container
  if [ -f /.dockerenv ] || [ -n "${CONTAINER:-}" ]; then
    echo "$(date) ⚠️ تم اكتشاف بيئة Container/Docker" >> "$LOG_FILE"
    echo "$(date) 💡 قد تحتاج لتشغيل Container مع --privileged --cap-add=NET_ADMIN" >> "$LOG_FILE"
    USE_USERSPACE_NETWORKING=true
    SKIP_IPTABLES=true
  fi
  
  # فحص TUN module
  if ! modprobe tun 2>/dev/null; then
    echo "$(date) ⚠️ TUN module غير متاح - سيتم استخدام userspace networking" >> "$LOG_FILE"
    USE_USERSPACE_NETWORKING=true
  else
    echo "$(date) ✅ TUN module متاح" >> "$LOG_FILE"
  fi
  
  # فحص iptables
  if ! iptables -L >/dev/null 2>&1; then
    echo "$(date) ⚠️ iptables غير متاح - سيتم تخطي إعدادات الجدار الناري" >> "$LOG_FILE"
    SKIP_IPTABLES=true
  else
    echo "$(date) ✅ iptables متاح" >> "$LOG_FILE"
  fi
  
  # فحص صلاحيات root
  if [ "$EUID" -ne 0 ]; then
    echo "$(date) ⚠️ السكربت لا يعمل كـ root - قد تحتاج لصلاحيات إضافية" >> "$LOG_FILE"
  fi
}

# دالة لتشغيل tailscaled إذا لم يكن شغال
start_tailscaled() {
  if ! pgrep -x "tailscaled" > /dev/null; then
    echo "$(date) 🔸 تشغيل tailscaled..." >> "$LOG_FILE"
    
    # بناء أمر tailscaled
    TAILSCALED_CMD="tailscaled --state=$STATE_FILE --socket=$SOCKET_FILE"
    
    if [ "$USE_USERSPACE_NETWORKING" = true ]; then
      TAILSCALED_CMD="$TAILSCALED_CMD --tun=userspace-networking"
      echo "$(date) 🔧 استخدام userspace networking" >> "$LOG_FILE"
    fi
    
    if [ "$SKIP_IPTABLES" = true ]; then
      TAILSCALED_CMD="$TAILSCALED_CMD --netfilter-mode=off"
      echo "$(date) 🔧 تعطيل netfilter mode" >> "$LOG_FILE"
    fi
    
    # محاولة تشغيل tailscaled
    if sudo $TAILSCALED_CMD >> "$LOG_FILE" 2>&1 & then
      echo "$(date) ✅ تم تشغيل tailscaled بنجاح" >> "$LOG_FILE"
      sleep 5
    else
      echo "$(date) ❌ فشل في تشغيل tailscaled - محاولة أخرى..." >> "$LOG_FILE"
      # محاولة ثانية مع خيارات أقل
      if sudo tailscaled --state="$STATE_FILE" --socket="$SOCKET_FILE" >> "$LOG_FILE" 2>&1 & then
        echo "$(date) ✅ تم تشغيل tailscaled في المحاولة الثانية" >> "$LOG_FILE"
        sleep 5
      else
        echo "$(date) ❌ فشل في تشغيل tailscaled - تحقق من الصلاحيات والبيئة" >> "$LOG_FILE"
        echo "$(date) 💡 جرب: docker run --privileged --cap-add=NET_ADMIN ..." >> "$LOG_FILE"
      fi
    fi
  else
    echo "$(date) ✅ tailscaled شغال" >> "$LOG_FILE"
  fi
}

# دالة للتأكد من الاتصال بالشبكة
check_and_up() {
  if ! tailscale status > /dev/null 2>&1; then
    echo "$(date) 🚀 تفعيل الاتصال عبر Tailscale..." >> "$LOG_FILE"
    
    # فحص إذا كان AUTH_KEY محدد
    if [ "$AUTH_KEY" = "<YOUR_AUTH_KEY>" ]; then
      echo "$(date) ⚠️ لم يتم تعيين AUTH_KEY - استخدم tailscale up يدوياً" >> "$LOG_FILE"
      echo "$(date) 💡 قم بتعديل AUTH_KEY في السكربت أو استخدم: tailscale up" >> "$LOG_FILE"
      return 1
    fi
    
    # محاولة الاتصال
    if sudo tailscale up --authkey="$AUTH_KEY" --hostname="$HOSTNAME" --ssh >> "$LOG_FILE" 2>&1; then
      echo "$(date) ✅ تم تفعيل الاتصال بنجاح" >> "$LOG_FILE"
    else
      echo "$(date) ❌ فشل في تفعيل الاتصال - تحقق من AUTH_KEY" >> "$LOG_FILE"
    fi
    sleep 5
  else
    echo "$(date) 🟢 الاتصال فعال" >> "$LOG_FILE"
  fi
}

# دالة لعرض حالة الاتصال
show_status() {
  echo "$(date) 📊 فحص حالة Tailscale..." >> "$LOG_FILE"
  if tailscale status > /dev/null 2>&1; then
    echo "$(date) ✅ Tailscale متصل بنجاح" >> "$LOG_FILE"
    tailscale status >> "$LOG_FILE" 2>&1
  else
    echo "$(date) ❌ Tailscale غير متصل" >> "$LOG_FILE"
  fi
}

# دالة لمعالجة الإشارات (للإغلاق النظيف)
cleanup() {
  echo "$(date) 🛑 إيقاف Tailscale Guardian..." >> "$LOG_FILE"
  exit 0
}

# تعيين معالجات الإشارات
trap cleanup SIGTERM SIGINT

# دالة لعرض المساعدة
show_help() {
  echo "🛡️ Tailscale Guardian Script - Advanced Version"
  echo ""
  echo "الاستخدام:"
  echo "  $0 [خيارات]"
  echo ""
  echo "الخيارات:"
  echo "  --help, -h          عرض هذه المساعدة"
  echo "  --userspace         فرض استخدام userspace networking"
  echo "  --skip-iptables     تخطي إعدادات iptables"
  echo "  --check-only        فحص الحالة فقط بدون تشغيل"
  echo ""
  echo "أمثلة:"
  echo "  $0                  # تشغيل عادي"
  echo "  $0 --userspace      # مع userspace networking"
  echo "  $0 --check-only     # فحص فقط"
}

# معالجة المعاملات
while [[ $# -gt 0 ]]; do
  case $1 in
    --help|-h)
      show_help
      exit 0
      ;;
    --userspace)
      USE_USERSPACE_NETWORKING=true
      shift
      ;;
    --skip-iptables)
      SKIP_IPTABLES=true
      shift
      ;;
    --check-only)
      check_environment
      show_status
      exit 0
      ;;
    *)
      echo "خيار غير معروف: $1"
      show_help
      exit 1
      ;;
  esac
done

# حلقة مراقبة مستمرة
echo "$(date) 🛡️ بدء مراقبة Tailscale..." >> "$LOG_FILE"

# فحص البيئة أولاً
check_environment

while true
do
  start_tailscaled
  check_and_up
  show_status
  sleep 60  # يتحقق كل دقيقة
done
