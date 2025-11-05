#!/bin/bash
# Keep Tailscale Always Alive - منع إيقاف Tailscale

LOG_FILE="/workspace/tailscale-keepalive.log"
LOCK_FILE="/tmp/tailscale-keepalive.lock"

if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        exit 0
    fi
    rm -f "$LOCK_FILE"
fi

echo $$ > "$LOCK_FILE"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

start_tailscale() {
    log "🚀 Starting Tailscale..."
    pkill tailscaled 2>/dev/null
    sleep 1
    mkdir -p /var/lib/tailscale /var/run/tailscale
    chmod 755 /var/lib/tailscale /var/run/tailscale
    tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
    sleep 5
    if ps aux | grep -q "[t]ailscaled"; then
        log "✅ Tailscale started"
        return 0
    else
        log "❌ Failed to start"
        return 1
    fi
}

while true; do
    if ! ps aux | grep -q "[t]ailscaled"; then
        log "⚠️  tailscaled not running, restarting..."
        start_tailscale
        sleep 10
        continue
    fi

    if ! tailscale status > /dev/null 2>&1; then
        log "⚠️  Connection lost, restarting..."
        pkill tailscaled 2>/dev/null
        sleep 2
        start_tailscale
        sleep 10
        continue
    fi

    TS_PID=$(ps aux | grep "[t]ailscaled" | awk '{print $2}' | head -1)
    if [ ! -z "$TS_PID" ]; then
        renice -n -20 -p $TS_PID 2>/dev/null
    fi

    sleep 30
done
