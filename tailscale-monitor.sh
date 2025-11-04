#!/bin/bash
# Tailscale Monitor - Layer 2
# Monitors Tailscale connection quality and metrics

LOG_FILE="/workspace/tailscale-monitor.log"
TAILSCALE_API_KEY="tskey-auth-kFuUJFx7bG11CNTRL-ybDF8REWMNiicmkBXKCANijy4fW1FQ74"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Monitor] $1" >> "$LOG_FILE"
}

log "📊 Tailscale Monitor started (Layer 2)"

check_connection_quality() {
    local status=$(tailscale status 2>/dev/null)
    if [ -z "$status" ]; then
        log "❌ Connection check failed - no status"
        return 1
    fi
    
    # Check if we have peers
    local peer_count=$(echo "$status" | grep -c "^[0-9]" || echo "0")
    log "📈 Connected peers: $peer_count"
    
    # Check IP address
    local ip=$(tailscale ip -4 2>/dev/null)
    if [ -z "$ip" ]; then
        log "⚠️ No Tailscale IP assigned"
        return 1
    fi
    
    log "✅ Tailscale IP: $ip"
    return 0
}

while true; do
    if ! check_connection_quality; then
        log "⚠️ Connection quality check failed, attempting recovery..."
        
        # Try to re-authenticate
        if ! tailscale status &>/dev/null; then
            log "🔧 Re-authenticating..."
            echo "$TAILSCALE_API_KEY" | tailscale up --authkey - 2>&1 >> "$LOG_FILE"
        fi
    fi
    
    sleep 45  # Monitor every 45 seconds
done
