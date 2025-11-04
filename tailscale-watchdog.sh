#!/bin/bash
# Tailscale Watchdog - Layer 1
# Checks Tailscale status every 15 seconds and restarts if needed

LOG_FILE="/workspace/tailscale-watchdog.log"
TAILSCALE_API_KEY="tskey-auth-kFuUJFx7bG11CNTRL-ybDF8REWMNiicmkBXKCANijy4fW1FQ74"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Watchdog] $1" | tee -a "$LOG_FILE"
}

log "🐕 Tailscale Watchdog started (Layer 1)"

while true; do
    # Check if Tailscale daemon is running
    if ! ps aux | grep -q "[t]ailscaled"; then
        log "⚠️ Tailscale daemon not running, restarting..."
        tailscale up --authkey "$TAILSCALE_API_KEY" 2>&1 | tee -a "$LOG_FILE"
        sleep 5
    fi
    
    # Check if Tailscale is connected
    if ! tailscale status &>/dev/null; then
        log "⚠️ Tailscale not connected, re-authenticating..."
        echo "$TAILSCALE_API_KEY" | tailscale up --authkey - 2>&1 | tee -a "$LOG_FILE"
        sleep 5
    else
        TS_IP=$(tailscale ip -4 2>/dev/null || echo "N/A")
        log "✅ Tailscale healthy (IP: $TS_IP)"
    fi
    
    sleep 15  # Check every 15 seconds
done
