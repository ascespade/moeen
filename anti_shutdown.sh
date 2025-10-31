#!/bin/bash
# Anti-Shutdown Script
# Prevents any shutdown commands from working

LOG_FILE="/var/log/anti_shutdown.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Override shutdown commands
override_shutdown() {
    log "Overriding shutdown commands..."
    
    # Create wrapper scripts for shutdown commands
    cat > /usr/local/bin/shutdown << 'SHUTDOWN_EOF'
#!/bin/bash
echo "Shutdown blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
SHUTDOWN_EOF
    
    cat > /usr/local/bin/poweroff << 'POWEROFF_EOF'
#!/bin/bash
echo "Poweroff blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
POWEROFF_EOF
    
    cat > /usr/local/bin/reboot << 'REBOOT_EOF'
#!/bin/bash
echo "Reboot blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
REBOOT_EOF
    
    cat > /usr/local/bin/halt << 'HALT_EOF'
#!/bin/bash
echo "Halt blocked by keep-alive system" >&2
echo "Use 'sudo /workspace/force_shutdown.sh' to force shutdown" >&2
exit 1
HALT_EOF
    
    # Make them executable
    chmod +x /usr/local/bin/shutdown
    chmod +x /usr/local/bin/poweroff
    chmod +x /usr/local/bin/reboot
    chmod +x /usr/local/bin/halt
    
    # Add to PATH
    echo 'export PATH="/usr/local/bin:$PATH"' >> /etc/environment
    
    log "Shutdown commands overridden"
}

# Create force shutdown script (for emergency use)
create_force_shutdown() {
    cat > /workspace/force_shutdown.sh << 'FORCE_EOF'
#!/bin/bash
# Force Shutdown Script (Emergency use only)
echo "WARNING: This will force shutdown the server!"
echo "Press Ctrl+C to cancel, or wait 10 seconds to continue..."
sleep 10

# Restore original commands
rm -f /usr/local/bin/shutdown
rm -f /usr/local/bin/poweroff
rm -f /usr/local/bin/reboot
rm -f /usr/local/bin/halt

# Execute shutdown
/sbin/shutdown -h now
FORCE_EOF
    
    chmod +x /workspace/force_shutdown.sh
    log "Force shutdown script created"
}

# Main execution
log "Anti-Shutdown System starting..."
override_shutdown
create_force_shutdown
log "Anti-Shutdown System activated"
