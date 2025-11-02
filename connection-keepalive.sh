#!/bin/bash
# Connection keepalive script - maintains active connections

LOG_FILE="/var/log/connection-keepalive.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | sudo tee -a "$LOG_FILE" > /dev/null
}

# Keep SSH connections alive by touching authorized_keys (triggers file access)
touch ~/.ssh/authorized_keys 2>/dev/null

# Keep XRDP active (if sessions exist)
if pgrep -x "xrdp" > /dev/null; then
    # Touch XRDP session directory
    touch /tmp/.xrdp-keepalive 2>/dev/null
fi

# Network connectivity test
ping -c 1 8.8.8.8 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log "Network connectivity OK"
else
    log "WARNING: Network connectivity issue detected"
fi

# Check and maintain services
if ! pgrep -x "sshd" > /dev/null; then
    log "SSH daemon not running, attempting restart..."
    bash /workspace/start-services.sh > /dev/null 2>&1
fi

if ! pgrep -x "xrdp" > /dev/null; then
    log "XRDP not running, attempting restart..."
    bash /workspace/start-services.sh > /dev/null 2>&1
fi
