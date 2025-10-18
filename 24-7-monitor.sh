#!/bin/bash

echo "🔄 Starting 24/7 monitoring and keep-alive system..."

# Create log directory
sudo mkdir -p /var/log/24-7-monitor

# Main monitoring script
cat << 'EOF' > /workspace/main-monitor.sh
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
EOF

chmod +x /workspace/main-monitor.sh

# Create Docker monitoring script
cat << 'EOF' > /workspace/docker-monitor.sh
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
EOF

chmod +x /workspace/docker-monitor.sh

# Create SSH tunnel monitoring script
cat << 'EOF' > /workspace/ssh-tunnel-monitor.sh
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
EOF

chmod +x /workspace/ssh-tunnel-monitor.sh

# Start all monitoring services
nohup /workspace/main-monitor.sh > /var/log/24-7-monitor/main-monitor.log 2>&1 &
nohup /workspace/docker-monitor.sh > /var/log/24-7-monitor/docker-monitor.log 2>&1 &
nohup /workspace/ssh-tunnel-monitor.sh > /var/log/24-7-monitor/ssh-tunnel-monitor.log 2>&1 &

echo "✅ 24/7 monitoring system started!"
echo "📊 All services will be monitored and restarted automatically"
echo "📋 Check logs:"
echo "   - Main: tail -f /var/log/24-7-monitor/main.log"
echo "   - Docker: tail -f /var/log/24-7-monitor/docker-monitor.log"
echo "   - SSH: tail -f /var/log/24-7-monitor/ssh-tunnel-monitor.log"
echo ""
echo "🌐 Server IP: $(curl -s ifconfig.me)"
echo "🔌 SSH Port: 22"
echo "📡 All services are now running 24/7!"
