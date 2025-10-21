#!/bin/bash

# Service Monitor Script
# This script monitors all development services and restarts them if needed

set -e

# Configuration
LOG_DIR="/var/log/persistent-dev"
PID_DIR="/var/run/persistent-dev"
CHECK_INTERVAL=30

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_DIR/monitor.log"
}

# Function to check if a process is running
is_running() {
    local process_name="$1"
    pgrep -f "$process_name" > /dev/null 2>&1
}

# Function to restart VS Code Server
restart_vscode() {
    log "Restarting VS Code Server..."
    pkill -f "code-server" 2>/dev/null || true
    sleep 2
    
    nohup code-server \
        --bind-addr 0.0.0.0:8080 \
        --auth none \
        --disable-telemetry \
        --disable-update-check \
        --disable-workspace-trust \
        --port 8080 \
        > "$LOG_DIR/vscode-server.log" 2>&1 &
    
    echo $! > "$PID_DIR/vscode-server.pid"
    log "VS Code Server restarted"
}

# Function to restart Next.js
restart_nextjs() {
    log "Restarting Next.js development server..."
    pkill -f "next dev" 2>/dev/null || true
    sleep 2
    
    cd /workspace
    nohup npm run dev > "$LOG_DIR/nextjs-dev.log" 2>&1 &
    
    echo $! > "$PID_DIR/nextjs-dev.pid"
    log "Next.js development server restarted"
}

# Function to check Tailscale
check_tailscale() {
    if ! sudo tailscale status >/dev/null 2>&1; then
        log "Tailscale disconnected, restarting..."
        sudo /workspace/tailscale-persistent-simple.sh restart
    fi
}

# Main monitoring loop
main() {
    log "=== Service Monitor Starting ==="
    
    while true; do
        # Check VS Code Server
        if ! is_running "code-server"; then
            log "VS Code Server stopped, restarting..."
            restart_vscode
        fi
        
        # Check Next.js
        if ! is_running "next dev"; then
            log "Next.js stopped, restarting..."
            restart_nextjs
        fi
        
        # Check Tailscale
        check_tailscale
        
        sleep $CHECK_INTERVAL
    done
}

# Run main function
main "$@"
