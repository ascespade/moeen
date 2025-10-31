#!/bin/bash
# Tailscale Keep-Alive Script
# Ensures Tailscale stays connected and restarts if needed

LOG_FILE="/var/log/tailscale_keepalive.log"
TAILSCALE_AUTH_KEY="tskey-auth-kQ14kfi9hZ11CNTRL-uVwWkaoS4pbnJ77p4c5tnb9ZzBWV9bE7M"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to check if Tailscale is running
check_tailscale() {
    if ! tailscale status > /dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Function to start Tailscale
start_tailscale() {
    log "Starting Tailscale daemon..."
    sudo tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking &
    sleep 5
    
    log "Authenticating Tailscale..."
    sudo tailscale up --authkey="$TAILSCALE_AUTH_KEY" --accept-routes --accept-dns --hostname=cursor-dev-server
    
    if check_tailscale; then
        log "Tailscale started successfully"
        return 0
    else
        log "Failed to start Tailscale"
        return 1
    fi
}

# Main loop
log "Tailscale Keep-Alive script started"

while true; do
    if ! check_tailscale; then
        log "Tailscale is not running, attempting to restart..."
        start_tailscale
    else
        log "Tailscale is running normally"
    fi
    
    sleep 60  # Check every minute
done
