#!/bin/bash

LOG_FILE="/var/log/24-7-monitor/ssh-tunnel.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a "$LOG_FILE"
}

while true; do
    # Check if SSH is running
    if ! pgrep -f "sshd" > /dev/null; then
        log_message "⚠️  SSH is not running, restarting..."
        sudo service ssh restart
        sleep 5
    fi
    
    # Check if tunnel server is running
    if ! pgrep -f "ssh-tunnel-server" > /dev/null; then
        log_message "⚠️  SSH tunnel server is down, restarting..."
        nohup /workspace/ssh-tunnel-server.sh > /var/log/ssh-tunnel.log 2>&1 &
    fi
    
    log_message "✅ SSH tunnel services are running"
    sleep 30
done
