#!/bin/bash

# ================================
#  🛡️ Tailscale Guardian Script
#  Advanced + Auto Reconnect
# ================================

STATE_FILE="/var/lib/tailscale/tailscaled.state"
SOCKET_FILE="/var/run/tailscale/tailscaled.sock"
LOG_FILE="/var/log/tailscale-guardian.log"
HOSTNAME="server-node"
AUTH_KEY="<YOUR_AUTH_KEY>"

USE_USERSPACE_NETWORKING=true
SKIP_IPTABLES=false
SKIP_TUN_CHECK=false

sudo mkdir -p /var/lib/tailscale
sudo mkdir -p /var/run/tailscale
sudo mkdir -p /var/log
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"

check_environment() {
  echo "$(date) 🔍 فحص البيئة..." >> "$LOG_FILE"

  if [ -f /.dockerenv ] || [ -n "${CONTAINER:-}" ]; then
    echo "$(date) ⚠️ Container/Docker detected" >> "$LOG_FILE"
    USE_USERSPACE_NETWORKING=true
    SKIP_IPTABLES=true
  fi

  if ! modprobe tun 2>/dev/null; then
    echo "$(date) ⚠️ TUN module غير متاح" >> "$LOG_FILE"
    USE_USERSPACE_NETWORKING=true
  else
    echo "$(date) ✅ TUN module متاح" >> "$LOG_FILE"
  fi

  if ! iptables -L >/dev/null 2>&1; then
    echo "$(date) ⚠️ iptables غير متاح" >> "$LOG_FILE"
    SKIP_IPTABLES=true
  else
    echo "$(date) ✅ iptables متاح" >> "$LOG_FILE"
  fi

  if [ "$EUID" -ne 0 ]; then
    echo "$(date) ⚠️ السكربت لا يعمل كـ root" >> "$LOG_FILE"
  fi
}

start_tailscaled() {
  if ! pgrep -x "tailscaled" > /dev/null; then
    echo "$(date) 🔸 تشغيل tailscaled..." >> "$LOG_FILE"
    CMD="tailscaled --state=$STATE_FILE --socket=$SOCKET_FILE"
    [ "$USE_USERSPACE_NETWORKING" = true ] && CMD="$CMD --tun=userspace-networking"
    [ "$SKIP_IPTABLES" = true ] && CMD="$CMD --netfilter-mode=off"
    if sudo $CMD >> "$LOG_FILE" 2>&1 & then
      echo "$(date) ✅ تم تشغيل tailscaled بنجاح" >> "$LOG_FILE"
      sleep 5
    else
      echo "$(date) ❌ فشل في تشغيل tailscaled" >> "$LOG_FILE"
    fi
  else
    echo "$(date) ✅ tailscaled شغال" >> "$LOG_FILE"
  fi
}

check_and_up() {
  if ! tailscale status > /dev/null 2>&1; then
    echo "$(date) 🚀 تفعيل الاتصال عبر Tailscale..." >> "$LOG_FILE"
    if [ "$AUTH_KEY" = "<YOUR_AUTH_KEY>" ]; then
      echo "$(date) ⚠️ لم يتم تعيين AUTH_KEY" >> "$LOG_FILE"
      return 1
    fi
    if sudo tailscale up --authkey="$AUTH_KEY" --hostname="$HOSTNAME" --ssh >> "$LOG_FILE" 2>&1; then
      echo "$(date) ✅ تم تفعيل الاتصال بنجاح" >> "$LOG_FILE"
    else
      echo "$(date) ❌ فشل في تفعيل الاتصال" >> "$LOG_FILE"
    fi
    sleep 5
  else
    echo "$(date) 🟢 الاتصال فعال" >> "$LOG_FILE"
  fi
}

# 💡 دالة إعادة الاتصال التلقائية إذا فقد الاتصال بالخادم
auto_reconnect_if_lost() {
  if tailscale status 2>&1 | grep -q "Unable to connect to the Tailscale coordination server"; then
    echo "$(date) ⚠️ تم اكتشاف فقدان الاتصال بالخادم — إعادة الاتصال..." | tee -a "$LOG_FILE"
    sudo tailscale logout >> "$LOG_FILE" 2>&1
    sudo tailscale up --authkey="$AUTH_KEY" --hostname="$HOSTNAME" --ssh >> "$LOG_FILE" 2>&1
    echo "$(date) 🔄 تم تنفيذ عملية إعادة الاتصال" >> "$LOG_FILE"
  fi
}

show_status() {
  echo "$(date) 📊 فحص حالة Tailscale..." >> "$LOG_FILE"
  if tailscale status > /dev/null 2>&1; then
    echo "$(date) ✅ Tailscale متصل بنجاح" >> "$LOG_FILE"
    tailscale status >> "$LOG_FILE" 2>&1
  else
    echo "$(date) ❌ Tailscale غير متصل" >> "$LOG_FILE"
  fi
}

cleanup() {
  echo "$(date) 🛑 إيقاف Tailscale Guardian..." >> "$LOG_FILE"
  exit 0
}

trap cleanup SIGTERM SIGINT

show_help() {
  echo "🛡️ Tailscale Guardian Script - Advanced + Auto Reconnect"
  echo "  --help, -h          عرض هذه المساعدة"
  echo "  --userspace         فرض userspace networking"
  echo "  --skip-iptables     تخطي iptables"
  echo "  --check-only        فحص الحالة فقط"
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --help|-h) show_help; exit 0 ;;
    --userspace) USE_USERSPACE_NETWORKING=true; shift ;;
    --skip-iptables) SKIP_IPTABLES=true; shift ;;
    --check-only) check_environment; show_status; exit 0 ;;
    *) echo "خيار غير معروف: $1"; show_help; exit 1 ;;
  esac
done

echo "$(date) 🛡️ بدء مراقبة Tailscale..." >> "$LOG_FILE"
check_environment

LAST_REFRESH=$(date +%s)

while true
do
  start_tailscaled
  check_and_up
  auto_reconnect_if_lost
  show_status

  # ⏳ إعادة الاتصال كل ساعتين حتى لو ما في مشكلة
  NOW=$(date +%s)
  if (( NOW - LAST_REFRESH > 7200 )); then
    echo "$(date) 🕒 إعادة الاتصال الدورية للحفاظ على الجلسة" >> "$LOG_FILE"
    sudo tailscale logout >> "$LOG_FILE" 2>&1
    sudo tailscale up --authkey="$AUTH_KEY" --hostname="$HOSTNAME" --ssh >> "$LOG_FILE" 2>&1
    LAST_REFRESH=$NOW
  fi

  sleep 60
done
