#!/bin/bash

LOG_FILE="/var/log/24-7-monitor/docker.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a "$LOG_FILE"
}

while true; do
    if ! docker ps > /dev/null 2>&1; then
        log_message "⚠️  Docker is not running, starting..."
        sudo service docker start
        sleep 10
    fi
    
    # Check if main container is running
    if ! docker ps | grep -q "main_project"; then
        log_message "⚠️  Main project container is down, restarting..."
        cd /opt
        docker-compose -f dev-docker-compose.yml up -d
    fi
    
    log_message "✅ Docker services are running"
    sleep 30
done
