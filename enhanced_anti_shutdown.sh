#!/bin/bash
# Enhanced Anti-Shutdown Script
# Prevents any shutdown commands from working

LOG_FILE="/var/log/anti_shutdown.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Override shutdown commands with sudo
override_shutdown() {
    log "Overriding shutdown commands..."
    
    # Create wrapper scripts for shutdown commands
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
    
    log "Shutdown commands overridden"
}

# Create force shutdown script (for emergency use)
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

# Main execution
log "Enhanced Anti-Shutdown System starting..."
override_shutdown
create_force_shutdown
log "Enhanced Anti-Shutdown System activated"
