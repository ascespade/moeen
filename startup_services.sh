#!/bin/bash

# Startup Services Script
# Ensures Tailscale and SSH are running properly

LOG_FILE="/var/log/startup_services.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a "$LOG_FILE"
}

log_message "Starting system services..."

# Start SSH service
sudo service ssh start
if [ $? -eq 0 ]; then
    log_message "SSH service started successfully"
else
    log_message "Failed to start SSH service"
fi

# Start Tailscale authentication
/workspace/tailscale_auto_auth.sh

# Check Tailscale status
if tailscale status > /dev/null 2>&1; then
    TAILSCALE_IP=$(tailscale ip -4)
    log_message "Tailscale is running with IP: $TAILSCALE_IP"
    log_message "You can SSH to this server using: ssh ubuntu@$TAILSCALE_IP"
else
    log_message "Tailscale is not running properly"
fi

log_message "Startup services script completed"
