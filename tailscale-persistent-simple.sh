#!/bin/bash

# =============================================================================
# Tailscale Persistent Service - Simple Version
# =============================================================================
# This script ensures Tailscale is always running and connected
# =============================================================================

set -e

# Configuration
AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
LOG_FILE="/var/log/tailscale-persistent.log"
PID_FILE="/var/run/tailscale-persistent.pid"
CHECK_INTERVAL=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check if Tailscale is connected
is_connected() {
    if tailscale status >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start Tailscale daemon
start_daemon() {
    log "Starting Tailscale daemon..."
    
    # Kill any existing processes
    pkill -f "tailscaled" 2>/dev/null || true
    sleep 2
    
    # Start Tailscale daemon
    nohup tailscaled \
        --state=/var/lib/tailscale/tailscaled.state \
        --socket=/run/tailscale/tailscaled.sock \
        --port=41641 \
        --tun=userspace-networking \
        > /var/log/tailscaled.log 2>&1 &
    
    # Wait for daemon to start
    sleep 5
    
    log "Tailscale daemon started"
}

# Function to authenticate with Tailscale
authenticate() {
    log "Authenticating with Tailscale..."
    
    # Wait for daemon to be ready
    local retries=0
    while [ $retries -lt 10 ]; do
        if tailscale status >/dev/null 2>&1; then
            log "Already authenticated with Tailscale"
            return 0
        fi
        
        # Try to authenticate
        if tailscale up \
            --authkey="$AUTH_KEY" \
            --accept-routes \
            --accept-dns \
            --hostname="cursor-dev-server" \
            --advertise-routes="172.30.0.0/24" \
            --advertise-exit-node \
            >> "$LOG_FILE" 2>&1; then
            log "Successfully authenticated with Tailscale"
            return 0
        fi
        
        log "Authentication attempt $((retries + 1)) failed, retrying..."
        sleep 5
        retries=$((retries + 1))
    done
    
    log "ERROR: Failed to authenticate with Tailscale after 10 attempts"
    return 1
}

# Function to get Tailscale IP
get_ip() {
    tailscale ip -4 2>/dev/null || echo "Unknown"
}

# Function to show status
show_status() {
    if is_connected; then
        local ip=$(get_ip)
        log "✅ Tailscale Status: Connected (IP: $ip)"
        return 0
    else
        log "❌ Tailscale Status: Disconnected"
        return 1
    fi
}

# Function to restart Tailscale
restart_tailscale() {
    log "Restarting Tailscale..."
    
    # Stop Tailscale
    tailscale down 2>/dev/null || true
    pkill -f "tailscaled" 2>/dev/null || true
    sleep 5
    
    # Start daemon
    start_daemon
    
    # Authenticate
    authenticate
    
    # Show status
    show_status
}

# Main monitoring loop
monitor_loop() {
    log "=== Tailscale Persistent Monitor Starting ==="
    
    local consecutive_failures=0
    local max_failures=3
    
    while true; do
        if is_connected; then
            if [ $consecutive_failures -gt 0 ]; then
                log "✅ Tailscale reconnected successfully"
                consecutive_failures=0
            fi
            
            local ip=$(get_ip)
            log "✅ Tailscale Status: Connected (IP: $ip)"
        else
            consecutive_failures=$((consecutive_failures + 1))
            log "❌ Tailscale disconnected (failure #$consecutive_failures)"
            
            if [ $consecutive_failures -ge $max_failures ]; then
                log "🔄 Maximum retries reached, restarting Tailscale..."
                restart_tailscale
                consecutive_failures=0
            fi
        fi
        
        sleep $CHECK_INTERVAL
    done
}

# Function to start the service
start_service() {
    log "=== Starting Tailscale Persistent Service ==="
    
    # Start daemon
    start_daemon
    
    # Authenticate
    authenticate
    
    # Show initial status
    show_status
    
    # Start monitoring loop
    monitor_loop
}

# Function to stop the service
stop_service() {
    log "=== Stopping Tailscale Persistent Service ==="
    
    # Kill this script
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            log "Monitor process stopped (PID: $pid)"
        fi
        rm -f "$PID_FILE"
    fi
    
    # Stop Tailscale
    tailscale down 2>/dev/null || true
    pkill -f "tailscaled" 2>/dev/null || true
    
    log "Tailscale stopped"
}

# Function to show status
show_service_status() {
    echo -e "${CYAN}=== Tailscale Persistent Service Status ===${NC}"
    echo ""
    
    # Check if monitor is running
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "✅ Monitor: Running (PID: $pid)"
        else
            echo -e "❌ Monitor: Stopped (stale PID file)"
        fi
    else
        echo -e "❌ Monitor: Not running"
    fi
    
    # Check Tailscale status
    if is_connected; then
        local ip=$(get_ip)
        echo -e "✅ Tailscale: Connected (IP: $ip)"
        echo ""
        echo -e "${CYAN}=== Tailscale Network Status ===${NC}"
        tailscale status
    else
        echo -e "❌ Tailscale: Disconnected"
    fi
    
    echo ""
    echo -e "${CYAN}=== Recent Logs ===${NC}"
    tail -n 10 "$LOG_FILE" 2>/dev/null || echo "No logs found"
}

# Main execution
main() {
    case "${1:-start}" in
        "start")
            # Start the service
            start_service &
            echo $! > "$PID_FILE"
            log "Service started with PID: $(cat $PID_FILE)"
            ;;
        "stop")
            stop_service
            ;;
        "status")
            show_service_status
            ;;
        "restart")
            stop_service
            sleep 2
            start_service &
            echo $! > "$PID_FILE"
            log "Service restarted with PID: $(cat $PID_FILE)"
            ;;
        *)
            echo "Usage: $0 {start|stop|status|restart}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"