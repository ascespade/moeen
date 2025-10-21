#!/bin/bash

# Tailscale Auto-Authentication Script
# This script ensures Tailscale is authenticated and running

AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
LOG_FILE="/var/log/tailscale_auto_auth.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a "$LOG_FILE"
}

# Check if Tailscale is already authenticated
if tailscale status > /dev/null 2>&1; then
    log_message "Tailscale is already running and authenticated"
    exit 0
fi

log_message "Starting Tailscale authentication..."

# Start Tailscale with authentication
sudo tailscale up --accept-dns --accept-routes --auth-key="$AUTH_KEY" --advertise-exit-node --advertise-routes=172.30.0.0/24 --hostname=cursor-dev-server

if [ $? -eq 0 ]; then
    log_message "Tailscale authentication successful"
    tailscale status >> "$LOG_FILE" 2>&1
else
    log_message "Tailscale authentication failed"
    exit 1
fi
