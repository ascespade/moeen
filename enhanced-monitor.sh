#!/bin/bash
# Enhanced service monitoring with connection stability checks

LOG_FILE="/var/log/enhanced-monitor.log"
STATUS_FILE="/tmp/service-status.json"

timestamp() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')]"
}

log() {
    echo "$(timestamp) $1" | sudo tee -a "$LOG_FILE" > /dev/null
}

# Check service health
check_service_health() {
    local service=$1
    local port=$2
    
    # Check if process is running
    if ! pgrep -x "$service" > /dev/null; then
        echo "stopped"
        return 1
    fi
    
    # Check if port is listening
    if [ -n "$port" ]; then
        if ! ss -tlnp 2>/dev/null | grep -q ":$port.*LISTEN"; then
            echo "listening_failed"
            return 2
        fi
    fi
    
    echo "running"
    return 0
}

# Check SSH
check_ssh() {
    status=$(check_service_health "sshd" "22")
    case $status in
        "stopped")
            log "SSH: Process stopped, restarting..."
            sudo mkdir -p /run/sshd
            sudo /usr/sbin/sshd -D 2>&1 &
            sleep 2
            ;;
        "listening_failed")
            log "SSH: Process running but not listening, restarting..."
            sudo pkill sshd
            sleep 1
            sudo /usr/sbin/sshd -D 2>&1 &
            sleep 2
            ;;
        "running")
            log "SSH: ✓ Running and listening on port 22"
            ;;
    esac
}

# Check XRDP
check_xrdp() {
    # Check xrdp process
    xrdp_status=$(check_service_health "xrdp" "3389")
    
    # Check xrdp-sesman
    sesman_running=$(pgrep -x "xrdp-sesman" > /dev/null && echo "yes" || echo "no")
    
    case $xrdp_status in
        "stopped")
            log "XRDP: Process stopped, restarting..."
            sudo mkdir -p /run/xrdp
            [ "$sesman_running" != "yes" ] && sudo /usr/sbin/xrdp-sesman 2>&1 &
            sleep 1
            sudo /usr/sbin/xrdp 2>&1 &
            sleep 2
            ;;
        "listening_failed")
            log "XRDP: Process running but not listening, restarting..."
            sudo pkill xrdp xrdp-sesman
            sleep 1
            sudo mkdir -p /run/xrdp
            sudo /usr/sbin/xrdp-sesman 2>&1 &
            sleep 1
            sudo /usr/sbin/xrdp 2>&1 &
            sleep 2
            ;;
        "running")
            if [ "$sesman_running" != "yes" ]; then
                log "XRDP: Main process running but session manager stopped, restarting..."
                sudo /usr/sbin/xrdp-sesman 2>&1 &
                sleep 2
            else
                log "XRDP: ✓ Running and listening on port 3389"
            fi
            ;;
    esac
}

# Network connectivity check
check_network() {
    if ping -c 1 -W 2 8.8.8.8 > /dev/null 2>&1; then
        log "Network: ✓ Connectivity OK"
    else
        log "Network: ⚠ WARNING - Connectivity issue detected"
    fi
    
    # Check DNS
    if host -W 2 google.com > /dev/null 2>&1; then
        log "Network: ✓ DNS resolution OK"
    else
        log "Network: ⚠ WARNING - DNS resolution issue"
    fi
}

# Connection count
check_connections() {
    ssh_connections=$(ss -tn 2>/dev/null | grep ":22 " | grep ESTAB | wc -l)
    rdp_connections=$(ss -tn 2>/dev/null | grep ":3389 " | grep ESTAB | wc -l)
    
    log "Connections: SSH=$ssh_connections, RDP=$rdp_connections"
}

# Main monitoring function
main() {
    log "=== Enhanced Service Monitoring ==="
    check_ssh
    check_xrdp
    check_network
    check_connections
    log "=== Monitoring Complete ==="
    echo ""
}

main
