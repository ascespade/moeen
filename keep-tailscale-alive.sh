#!/bin/bash
# Keep Tailscale Alive - Layer 2
# Continuous keep-alive mechanism

LOG_FILE="/workspace/tailscale-health.log"
TAILSCALE_API_KEY="tskey-auth-kFuUJFx7bG11CNTRL-ybDF8REWMNiicmkBXKCANijy4fW1FQ74"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Keep-alive] $1" >> "$LOG_FILE"
}

log "💓 Keep-alive started (Layer 2)"

while true; do
    # Send keep-alive ping
    if tailscale ping "$(tailscale ip -4 2>/dev/null | head -1)" &>/dev/null; then
        log "✅ Keep-alive ping successful"
    else
        log "⚠️ Keep-alive ping failed, checking connection..."
        
        # Verify connection
        if ! tailscale status &>/dev/null; then
            log "🔧 Re-authenticating Tailscale..."
            echo "$TAILSCALE_API_KEY" | tailscale up --authkey - 2>&1 >> "$LOG_FILE"
        fi
    fi
    
    sleep 30  # Keep-alive every 30 seconds
done
