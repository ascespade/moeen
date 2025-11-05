#!/bin/bash
# Tailscale Monitor & Auto-Restart

LOG_FILE="/workspace/tailscale-monitor.log"
LOCK_FILE="/tmp/tailscale-monitor.lock"

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

check_tailscale() {
    if ! ps aux | grep -q "[t]ailscaled"; then
        return 1
    fi
    if ! tailscale status > /dev/null 2>&1; then
        return 1
    fi
    STATUS=$(tailscale status 2>/dev/null | head -1)
    if [ -z "$STATUS" ] || echo "$STATUS" | grep -q "Logged out"; then
        return 1
    fi
    return 0
}

restart_tailscale() {
    log "🔄 Restarting Tailscale..."
    pkill tailscaled 2>/dev/null
    sleep 2
    if systemctl is-system-running > /dev/null 2>&1; then
        systemctl start tailscaled 2>/dev/null
    else
        tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
    fi
    sleep 3
    if ps aux | grep -q "[t]ailscaled"; then
        log "✅ Restarted successfully"
        return 0
    else
        log "❌ Failed to restart"
        return 1
    fi
}

prevent_shutdown() {
    if systemctl is-system-running > /dev/null 2>&1; then
        systemctl unmask tailscaled 2>/dev/null
        systemctl enable tailscaled 2>/dev/null
    fi
}

prevent_shutdown
log "🚀 Monitor started (PID: $$)"

while true; do
    if ! check_tailscale; then
        log "❌ Check failed, restarting..."
        restart_tailscale
        if ! check_tailscale; then
            log "⚠️  Retrying in 30 seconds..."
            sleep 30
            restart_tailscale
        fi
    else
        STATUS=$(tailscale status 2>/dev/null | head -1)
        log "✅ Running: $(echo "$STATUS" | head -1)"
    fi
    sleep 60
done
