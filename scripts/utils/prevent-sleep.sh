#!/bin/bash
# Script to prevent sleep/suspend on the system

# Disable sleep/suspend if running in a systemd-less environment
# This script should be run periodically via cron

# Set keepalive for network connections
if command -v setterm &> /dev/null; then
    setterm -blank 0 -powerdown 0 2>/dev/null || true
fi

# Prevent screen blanking via X (if X server is available)
if command -v xset &> /dev/null; then
    export DISPLAY=:0 2>/dev/null || true
    xset s off 2>/dev/null || true
    xset -dpms 2>/dev/null || true
    xset s noblank 2>/dev/null || true
fi

# Keep system awake by touching a file (triggers filesystem activity)
touch /tmp/.keep-awake

# Log the execution
echo "$(date): Keepalive script executed" >> /var/log/keepalive.log 2>/dev/null || true
