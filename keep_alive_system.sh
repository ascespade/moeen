#!/bin/bash
# Comprehensive Keep-Alive System
# Prevents server shutdown and ensures Tailscale stays online

LOG_FILE="/var/log/keep_alive_system.log"
TAILSCALE_AUTH_KEY="tskey-auth-kQ14kfi9hZ11CNTRL-uVwWkaoS4pbnJ77p4c5tnb9ZzBWV9bE7M"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to check if Tailscale is running
check_tailscale() {
    if ! tailscale status > /dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Function to check if SSH is running
check_ssh() {
    if ! ss -tlnp | grep -q :22; then
        return 1
    fi
    return 0
}

# Function to start Tailscale
start_tailscale() {
    log "Starting Tailscale daemon..."
    sudo tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking &
    sleep 5
    
    log "Authenticating Tailscale..."
    sudo tailscale up --authkey="$TAILSCALE_AUTH_KEY" --accept-routes --accept-dns --hostname=cursor-dev-server
    
    if check_tailscale; then
        log "Tailscale started successfully"
        return 0
    else
        log "Failed to start Tailscale"
        return 1
    fi
}

# Function to start SSH
start_ssh() {
    log "Starting SSH service..."
    sudo service ssh start
    if check_ssh; then
        log "SSH started successfully"
        return 0
    else
        log "Failed to start SSH"
        return 1
    fi
}

# Function to prevent system shutdown
prevent_shutdown() {
    log "Preventing system shutdown..."
    
    # Disable systemd shutdown
    sudo systemctl mask poweroff.target
    sudo systemctl mask reboot.target
    sudo systemctl mask halt.target
    
    # Set up watchdog to prevent shutdown
    echo '#!/bin/bash' > /tmp/prevent_shutdown.sh
    echo 'while true; do' >> /tmp/prevent_shutdown.sh
    echo '    if [ -f /tmp/shutdown_requested ]; then' >> /tmp/prevent_shutdown.sh
    echo '        rm -f /tmp/shutdown_requested' >> /tmp/prevent_shutdown.sh
    echo '        echo "Shutdown prevented by keep-alive system"' >> /tmp/prevent_shutdown.sh
    echo '    fi' >> /tmp/prevent_shutdown.sh
    echo '    sleep 1' >> /tmp/prevent_shutdown.sh
    echo 'done' >> /tmp/prevent_shutdown.sh
    
    chmod +x /tmp/prevent_shutdown.sh
    nohup /tmp/prevent_shutdown.sh > /dev/null 2>&1 &
    
    log "Shutdown prevention activated"
}

# Function to monitor and restart services
monitor_services() {
    log "Starting service monitoring..."
    
    while true; do
        # Check Tailscale
        if ! check_tailscale; then
            log "Tailscale is down, restarting..."
            start_tailscale
        fi
        
        # Check SSH
        if ! check_ssh; then
            log "SSH is down, restarting..."
            start_ssh
        fi
        
        # Log status every 5 minutes
        if [ $(($(date +%s) % 300)) -eq 0 ]; then
            log "System status check - Tailscale: $(check_tailscale && echo 'UP' || echo 'DOWN'), SSH: $(check_ssh && echo 'UP' || echo 'DOWN')"
        fi
        
        sleep 30  # Check every 30 seconds
    done
}

# Function to set up auto-start on boot
setup_autostart() {
    log "Setting up auto-start on boot..."
    
    # Create startup script
    cat > /etc/rc.local << 'RC_EOF'
#!/bin/bash
# Auto-start keep-alive system on boot

# Start keep-alive system
nohup /workspace/keep_alive_system.sh > /dev/null 2>&1 &

exit 0
RC_EOF
    
    chmod +x /etc/rc.local
    
    # Create systemd service for keep-alive
    cat > /etc/systemd/system/keep-alive.service << 'SERVICE_EOF'
[Unit]
Description=Keep-Alive System
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/workspace
ExecStart=/workspace/keep_alive_system.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE_EOF
    
    # Enable the service
    sudo systemctl daemon-reload
    sudo systemctl enable keep-alive.service
    
    log "Auto-start configured"
}

# Main execution
log "Keep-Alive System starting..."

# Prevent shutdown
prevent_shutdown

# Set up auto-start
setup_autostart

# Start monitoring
monitor_services
