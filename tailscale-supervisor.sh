#!/bin/bash
# Tailscale Supervisor - Master Controller
# Coordinates all protection layers

LOG_FILE="/workspace/tailscale-supervisor.log"
TAILSCALE_API_KEY="tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🛡️ Tailscale Supervisor started"

# Ensure Tailscale is authenticated
ensure_tailscale_auth() {
    if ! tailscale status &>/dev/null; then
        log "⚠️ Tailscale not authenticated, attempting to authenticate..."
        echo "$TAILSCALE_API_KEY" | tailscale up --authkey - 2>&1 | tee -a "$LOG_FILE"
        if [ $? -eq 0 ]; then
            log "✅ Tailscale authenticated successfully"
        else
            log "❌ Failed to authenticate Tailscale"
        fi
    fi
}

# Start Layer 1: Watchdog
start_watchdog() {
    if ! ps aux | grep -q "[t]ailscale-watchdog.sh"; then
        log "Starting Layer 1: Watchdog..."
        nohup /workspace/tailscale-watchdog.sh >> /workspace/tailscale-watchdog.log 2>&1 &
        sleep 2
        if ps aux | grep -q "[t]ailscale-watchdog.sh"; then
            log "✅ Watchdog started"
        else
            log "❌ Failed to start Watchdog"
        fi
    fi
}

# Start Layer 2: Keep-alive
start_keepalive() {
    if ! ps aux | grep -q "[k]eep-tailscale-alive.sh"; then
        log "Starting Layer 2: Keep-alive..."
        nohup /workspace/keep-tailscale-alive.sh >> /workspace/tailscale-health.log 2>&1 &
        sleep 2
        if ps aux | grep -q "[k]eep-tailscale-alive.sh"; then
            log "✅ Keep-alive started"
        else
            log "❌ Failed to start Keep-alive"
        fi
    fi
}

# Start Layer 2: Monitor
start_monitor() {
    if ! ps aux | grep -q "[t]ailscale-monitor.sh"; then
        log "Starting Layer 2: Monitor..."
        nohup /workspace/tailscale-monitor.sh >> /workspace/tailscale-monitor.log 2>&1 &
        sleep 2
        if ps aux | grep -q "[t]ailscale-monitor.sh"; then
            log "✅ Monitor started"
        else
            log "❌ Failed to start Monitor"
        fi
    fi
}

# Main supervisor loop
while true; do
    ensure_tailscale_auth
    start_watchdog
    start_keepalive
    start_monitor
    
    # Check if Tailscale daemon is running
    if ! ps aux | grep -q "[t]ailscaled"; then
        log "⚠️ Tailscale daemon not running, attempting to start..."
        tailscale up --authkey "$TAILSCALE_API_KEY" 2>&1 | tee -a "$LOG_FILE"
    fi
    
    sleep 60  # Check every minute
done
