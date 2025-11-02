#!/bin/bash
# Auto-reconnect script for SSH and XRDP connections

LOG_FILE="/var/log/auto-reconnect.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | sudo tee -a "$LOG_FILE" > /dev/null
}

# Function to check and restart SSH
check_restart_ssh() {
    if ! ss -tlnp 2>/dev/null | grep -q ":22.*LISTEN"; then
        log "SSH not listening on port 22, restarting..."
        sudo pkill sshd 2>/dev/null
        sleep 1
        sudo mkdir -p /run/sshd
        sudo /usr/sbin/sshd -D 2>&1 &
        sleep 3
        if ss -tlnp 2>/dev/null | grep -q ":22.*LISTEN"; then
            log "SSH restarted successfully"
        else
            log "ERROR: Failed to restart SSH"
        fi
    fi
}

# Function to check and restart XRDP
check_restart_xrdp() {
    if ! ss -tlnp 2>/dev/null | grep -q ":3389.*LISTEN"; then
        log "XRDP not listening on port 3389, restarting..."
        sudo pkill xrdp xrdp-sesman 2>/dev/null
        sleep 1
        sudo mkdir -p /run/xrdp
        sudo /usr/sbin/xrdp-sesman 2>&1 &
        sleep 2
        sudo /usr/sbin/xrdp 2>&1 &
        sleep 3
        if ss -tlnp 2>/dev/null | grep -q ":3389.*LISTEN"; then
            log "XRDP restarted successfully"
        else
            log "ERROR: Failed to restart XRDP"
        fi
    fi
}

# Main function
main() {
    log "Starting connection health check..."
    check_restart_ssh
    check_restart_xrdp
    log "Connection health check completed"
}

main
