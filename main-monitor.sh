#!/bin/bash

LOG_FILE="/var/log/24-7-monitor/main.log"
SERVICES=("ssh" "docker")

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a "$LOG_FILE"
}

check_and_restart_service() {
    local service=$1
    if ! pgrep -f "$service" > /dev/null; then
        log_message "⚠️  Service $service is down, restarting..."
        case $service in
            "ssh")
                sudo service ssh restart
                ;;
            "docker")
                sudo service docker restart
                ;;
        esac
        sleep 5
        if pgrep -f "$service" > /dev/null; then
            log_message "✅ Service $service restarted successfully"
        else
            log_message "❌ Failed to restart service $service"
        fi
    else
        log_message "✅ Service $service is running"
    fi
}

# Main monitoring loop
while true; do
    log_message "🔍 Checking all services..."
    
    for service in "${SERVICES[@]}"; do
        check_and_restart_service "$service"
    done
    
    # Check system resources
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    log_message "📊 Memory usage: ${MEMORY_USAGE}%, Disk usage: ${DISK_USAGE}%"
    
    # Restart if memory usage is too high
    if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
        log_message "⚠️  High memory usage detected, cleaning up..."
        sudo sync
        echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null
    fi
    
    sleep 60
done
