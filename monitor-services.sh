#!/bin/bash
# Script to monitor and restart critical services

LOG_FILE="/var/log/service-monitor.log"
timestamp() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')]"
}

log() {
    echo "$(timestamp) $1" | sudo tee -a "$LOG_FILE" > /dev/null
}

# Check SSH service
check_ssh() {
    if ! pgrep -x "sshd" > /dev/null; then
        log "SSH daemon not running, starting..."
        sudo /usr/sbin/sshd -D 2>&1 &
        sleep 2
        if pgrep -x "sshd" > /dev/null; then
            log "SSH daemon started successfully"
        else
            log "ERROR: Failed to start SSH daemon"
        fi
    else
        # Check if SSH is listening on port 22
        if ! ss -tlnp 2>/dev/null | grep -q ":22"; then
            log "WARNING: SSH process running but not listening on port 22"
        fi
    fi
}

# Check XRDP service
check_xrdp() {
    if ! pgrep -x "xrdp" > /dev/null; then
        log "XRDP service not running, starting..."
        sudo mkdir -p /run/xrdp
        sudo /usr/sbin/xrdp 2>&1 &
        sleep 2
        if pgrep -x "xrdp" > /dev/null; then
            log "XRDP service started successfully"
        else
            log "ERROR: Failed to start XRDP service"
        fi
    fi
    
    if ! pgrep -x "xrdp-sesman" > /dev/null; then
        log "XRDP session manager not running, starting..."
        sudo mkdir -p /run/xrdp
        sudo /usr/sbin/xrdp-sesman 2>&1 &
        sleep 2
        if pgrep -x "xrdp-sesman" > /dev/null; then
            log "XRDP session manager started successfully"
        else
            log "ERROR: Failed to start XRDP session manager"
        fi
    fi
}

# Check Tailscale (if applicable)
check_tailscale() {
    if command -v tailscale &> /dev/null; then
        if ! pgrep -x "tailscaled" > /dev/null; then
            log "Tailscale daemon not running (may need privileged mode or TUN device)"
        else
            # Check Tailscale status
            if tailscale status &> /dev/null; then
                log "Tailscale is running"
            else
                log "WARNING: Tailscale daemon running but not connected"
            fi
        fi
    fi
}

# Main monitoring loop
main() {
    log "Starting service monitoring check"
    check_ssh
    check_xrdp
    check_tailscale
    log "Service monitoring check completed"
}

main
