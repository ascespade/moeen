#!/bin/bash
# Tailscale Health Check

LOG_FILE="/workspace/tailscale-health.log"

check_health() {
    if ! ps aux | grep -q "[t]ailscaled"; then
        echo "CRITICAL: tailscaled not running"
        return 1
    fi

    if ! tailscale status > /dev/null 2>&1; then
        echo "CRITICAL: Tailscale not responding"
        return 1
    fi

    IP=$(tailscale ip -4 2>/dev/null)
    if [ -z "$IP" ]; then
        echo "WARNING: No Tailscale IP"
        return 2
    fi

    echo "OK: Tailscale healthy (IP: $IP)"
    return 0
}

HEALTH=$(check_health)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $HEALTH" >> "$LOG_FILE"
    if [ $EXIT_CODE -eq 1 ]; then
        pkill tailscaled 2>/dev/null
        sleep 2
        tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
        sleep 5
        if ! tailscale status > /dev/null 2>&1; then
            warning "Tailscale needs authentication. Run: sudo tailscale up"
        fi
    fi
fi

exit $EXIT_CODE
