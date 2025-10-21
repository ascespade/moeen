#!/bin/bash

# Tailscale Keep-Alive Script
# This script ensures Tailscale stays connected and restarts if needed

LOG_FILE="/var/log/tailscale_keepalive.log"
TAILSCALE_IP="100.64.64.33"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_tailscale() {
    if ! tailscale status > /dev/null 2>&1; then
        log_message "Tailscale not running, starting..."
        sudo tailscale up --authkey=tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw --accept-routes --accept-dns
        sleep 5
    fi
    
    # Check if we can reach the Tailscale IP
    if ! ping -c 1 "$TAILSCALE_IP" > /dev/null 2>&1; then
        log_message "Tailscale IP not reachable, restarting..."
        sudo tailscale down
        sleep 2
        sudo tailscale up --authkey=tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw --accept-routes --accept-dns
        sleep 5
    fi
}

# Main loop
while true; do
    check_tailscale
    sleep 30
done
