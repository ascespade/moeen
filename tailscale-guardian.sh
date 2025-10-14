#!/bin/bash

# ================================
#  Tailscale Guardian Script 🧠
# ================================

# إعدادات عامة
STATE_FILE="/var/lib/tailscale/tailscaled.state"
SOCKET_FILE="/var/run/tailscale/tailscaled.sock"
LOG_FILE="/var/log/tailscale-guardian.log"
HOSTNAME="server-node"     # غيره لو تبغى اسم مخصص
AUTH_KEY="<YOUR_AUTH_KEY>" # ضع مفتاح التوثيق من Tailscale

# تأكد أن الملفات والمجلدات موجودة
mkdir -p /var/lib/tailscale
mkdir -p /var/run/tailscale
mkdir -p /var/log
touch "$LOG_FILE"

# دالة لتشغيل tailscaled إذا لم يكن شغال
start_tailscaled() {
  if ! pgrep -x "tailscaled" > /dev/null; then
    echo "$(date) 🔸 تشغيل tailscaled..." >> "$LOG_FILE"
    nohup tailscaled --state="$STATE_FILE" --socket="$SOCKET_FILE" >> "$LOG_FILE" 2>&1 &
    sleep 3
  else
    echo "$(date) ✅ tailscaled شغال" >> "$LOG_FILE"
  fi
}

# دالة للتأكد من الاتصال بالشبكة
check_and_up() {
  if ! tailscale status > /dev/null 2>&1; then
    echo "$(date) 🚀 تفعيل الاتصال عبر Tailscale..." >> "$LOG_FILE"
    nohup tailscale up --authkey="$AUTH_KEY" --hostname="$HOSTNAME" --ssh >> "$LOG_FILE" 2>&1 &
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

# حلقة مراقبة مستمرة
echo "$(date) 🛡️ بدء مراقبة Tailscale..." >> "$LOG_FILE"

while true
do
  start_tailscaled
  check_and_up
  show_status
  sleep 60  # يتحقق كل دقيقة
done
