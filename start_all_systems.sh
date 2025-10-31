#!/bin/bash
# Start All Systems Script
# Starts all keep-alive and protection systems

LOG_FILE="/var/log/start_all_systems.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log "Starting all protection systems..."

# Start anti-shutdown system
log "Starting anti-shutdown system..."
/workspace/anti_shutdown.sh

# Start keep-alive system
log "Starting keep-alive system..."
nohup /workspace/keep_alive_system.sh > /dev/null 2>&1 &

# Start Tailscale keep-alive
log "Starting Tailscale keep-alive..."
nohup /workspace/tailscale_keepalive.sh > /dev/null 2>&1 &

# Start startup services
log "Starting startup services..."
/workspace/startup_services.sh

log "All systems started successfully!"
log "Server is now protected from shutdown and Tailscale will stay online"

# Show status
echo "=== System Status ==="
echo "Date: $(date)"
echo "Tailscale IP: $(tailscale ip -4 2>/dev/null || echo 'Not connected')"
echo "SSH Status: $(ss -tlnp | grep -q :22 && echo 'Running' || echo 'Not running')"
echo ""
echo "Protection systems active:"
echo "- Anti-shutdown system"
echo "- Keep-alive system"
echo "- Tailscale keep-alive"
echo "- Auto-restart on boot"
echo ""
echo "To check status: /workspace/dev_status.sh"
echo "To force shutdown (emergency): sudo /workspace/force_shutdown.sh"
