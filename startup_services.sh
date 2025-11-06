#!/bin/bash
# Startup Services Script
# Starts SSH and Tailscale services

LOG_FILE="/var/log/startup_services.log"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log "Starting services..."

# Start SSH
log "Starting SSH service..."
sudo service ssh start
if [ $? -eq 0 ]; then
    log "SSH service started successfully"
else
    log "Failed to start SSH service"
fi

# Start Tailscale
log "Starting Tailscale..."
sudo tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking &
sleep 5

sudo tailscale up --authkey="tskey-auth-kQ14kfi9hZ11CNTRL-uVwWkaoS4pbnJ77p4c5tnb9ZzBWV9bE7M" --accept-routes --accept-dns --hostname=cursor-dev-server

if tailscale status > /dev/null 2>&1; then
    log "Tailscale started successfully"
    TAILSCALE_IP=$(tailscale ip -4)
    log "Tailscale IP: $TAILSCALE_IP"
else
    log "Failed to start Tailscale"
fi

# Start keep-alive script in background
log "Starting Tailscale keep-alive script..."
nohup /workspace/tailscale_keepalive.sh > /dev/null 2>&1 &

log "All services started"
