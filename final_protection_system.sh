#!/bin/bash
# Final Protection System
# Comprehensive protection against shutdown and ensures Tailscale stays online

LOG_FILE="/var/log/final_protection.log"

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
    sudo tailscale up --authkey="tskey-auth-kQ14kfi9hZ11CNTRL-uVwWkaoS4pbnJ77p4c5tnb9ZzBWV9bE7M" --accept-routes --accept-dns --hostname=cursor-dev-server
    
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
    sudo systemctl mask poweroff.target 2>/dev/null || true
    sudo systemctl mask reboot.target 2>/dev/null || true
    sudo systemctl mask halt.target 2>/dev/null || true
    
    # Override shutdown commands
    sudo tee /usr/local/bin/shutdown > /dev/null << 'SHUTDOWN_EOF'
#!/bin/bash
echo "Shutdown blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
SHUTDOWN_EOF
    
    sudo tee /usr/local/bin/poweroff > /dev/null << 'POWEROFF_EOF'
#!/bin/bash
echo "Poweroff blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
POWEROFF_EOF
    
    sudo tee /usr/local/bin/reboot > /dev/null << 'REBOOT_EOF'
#!/bin/bash
echo "Reboot blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
REBOOT_EOF
    
    sudo tee /usr/local/bin/halt > /dev/null << 'HALT_EOF'
#!/bin/bash
echo "Halt blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
HALT_EOF
    
    # Make them executable
    sudo chmod +x /usr/local/bin/shutdown
    sudo chmod +x /usr/local/bin/poweroff
    sudo chmod +x /usr/local/bin/reboot
    sudo chmod +x /usr/local/bin/halt
    
    # Add to PATH
    echo 'export PATH="/usr/local/bin:$PATH"' | sudo tee -a /etc/environment > /dev/null
    
    log "Shutdown prevention activated"
}

# Function to create force shutdown script
create_force_shutdown() {
    sudo tee /workspace/force_shutdown.sh > /dev/null << 'FORCE_EOF'
#!/bin/bash
# Force Shutdown Script (Emergency use only)
echo "WARNING: This will force shutdown the server!"
echo "Press Ctrl+C to cancel, or wait 10 seconds to continue..."
sleep 10

# Restore original commands
sudo rm -f /usr/local/bin/shutdown
sudo rm -f /usr/local/bin/poweroff
sudo rm -f /usr/local/bin/reboot
sudo rm -f /usr/local/bin/halt

# Execute shutdown
sudo /sbin/shutdown -h now
FORCE_EOF
    
    sudo chmod +x /workspace/force_shutdown.sh
    log "Force shutdown script created"
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
    sudo tee /etc/rc.local > /dev/null << 'RC_EOF'
#!/bin/bash
# Auto-start protection system on boot

# Start protection system
nohup /workspace/final_protection_system.sh > /dev/null 2>&1 &

exit 0
RC_EOF
    
    sudo chmod +x /etc/rc.local
    
    log "Auto-start configured"
}

# Main execution
log "Final Protection System starting..."

# Prevent shutdown
prevent_shutdown

# Create force shutdown script
create_force_shutdown

# Set up auto-start
setup_autostart

# Start monitoring
monitor_services
