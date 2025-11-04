#!/bin/bash
# Tailscale Health Check - Layer 3 (Cron)
# Comprehensive health check run by cron every 2 minutes

LOG_FILE="/workspace/tailscale-health.log"
TAILSCALE_API_KEY="tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Health-Check] $1" | tee -a "$LOG_FILE"
}

log "🏥 Running comprehensive health check..."

# Check 1: Daemon running
if ! ps aux | grep -q "[t]ailscaled"; then
    log "❌ FAIL: Tailscale daemon not running"
    log "🔧 Attempting to start daemon..."
    tailscale up --authkey "$TAILSCALE_API_KEY" 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi
log "✅ PASS: Tailscale daemon running"

# Check 2: Connected
if ! tailscale status &>/dev/null; then
    log "❌ FAIL: Tailscale not connected"
    log "🔧 Attempting to re-authenticate..."
    echo "$TAILSCALE_API_KEY" | tailscale up --authkey - 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi
log "✅ PASS: Tailscale connected"

# Check 3: IP assigned
TS_IP=$(tailscale ip -4 2>/dev/null)
if [ -z "$TS_IP" ]; then
    log "⚠️ WARN: No Tailscale IP assigned"
else
    log "✅ PASS: Tailscale IP: $TS_IP"
fi

# Check 4: Protection layers running
LAYERS_OK=true

if ! ps aux | grep -q "[t]ailscale-watchdog.sh"; then
    log "⚠️ WARN: Watchdog not running"
    LAYERS_OK=false
fi

if ! ps aux | grep -q "[k]eep-tailscale-alive.sh"; then
    log "⚠️ WARN: Keep-alive not running"
    LAYERS_OK=false
fi

if ! ps aux | grep -q "[t]ailscale-monitor.sh"; then
    log "⚠️ WARN: Monitor not running"
    LAYERS_OK=false
fi

if ! ps aux | grep -q "[t]ailscale-supervisor.sh"; then
    log "⚠️ WARN: Supervisor not running"
    LAYERS_OK=false
fi

if [ "$LAYERS_OK" = true ]; then
    log "✅ PASS: All protection layers running"
else
    log "⚠️ WARN: Some protection layers not running"
    log "🔧 Attempting to restart supervisor..."
    nohup /workspace/tailscale-supervisor.sh >> /workspace/tailscale-supervisor.log 2>&1 &
fi

log "✅ Health check complete"
exit 0
