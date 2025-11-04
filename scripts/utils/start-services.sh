#!/bin/bash
# Script to start all required services

echo "Starting all services..."

# Create required directories
sudo mkdir -p /run/sshd /run/xrdp /var/lib/tailscale /var/log

# Start SSH
if ! pgrep -x "sshd" > /dev/null; then
    echo "Starting SSH daemon..."
    sudo /usr/sbin/sshd -D 2>&1 &
    sleep 2
    if pgrep -x "sshd" > /dev/null; then
        echo "✓ SSH daemon started"
    else
        echo "✗ Failed to start SSH daemon"
    fi
else
    echo "✓ SSH daemon already running"
fi

# Start XRDP Session Manager
if ! pgrep -x "xrdp-sesman" > /dev/null; then
    echo "Starting XRDP session manager..."
    sudo /usr/sbin/xrdp-sesman 2>&1 &
    sleep 2
    if pgrep -x "xrdp-sesman" > /dev/null; then
        echo "✓ XRDP session manager started"
    else
        echo "✗ Failed to start XRDP session manager"
    fi
else
    echo "✓ XRDP session manager already running"
fi

# Start XRDP
if ! pgrep -x "xrdp" > /dev/null; then
    echo "Starting XRDP service..."
    sudo /usr/sbin/xrdp 2>&1 &
    sleep 2
    if pgrep -x "xrdp" > /dev/null; then
        echo "✓ XRDP service started"
    else
        echo "✗ Failed to start XRDP service"
    fi
else
    echo "✓ XRDP service already running"
fi

# Try to start Tailscale (may fail if TUN device not available)
if command -v tailscale &> /dev/null; then
    if ! pgrep -x "tailscaled" > /dev/null; then
        echo "Attempting to start Tailscale..."
        # Try to create TUN device if it doesn't exist
        if [ ! -e /dev/net/tun ]; then
            sudo mkdir -p /dev/net
            sudo mknod /dev/net/tun c 10 200 2>/dev/null
            sudo chmod 666 /dev/net/tun 2>/dev/null
        fi
        
        sudo tailscaled --state=/var/lib/tailscale/tailscaled.state 2>&1 &
        sleep 3
        if pgrep -x "tailscaled" > /dev/null; then
            echo "✓ Tailscale daemon started"
            echo "  Run: sudo tailscale up --authkey=YOUR_KEY"
        else
            echo "✗ Tailscale daemon failed to start (may need privileged mode)"
        fi
    else
        echo "✓ Tailscale daemon already running"
    fi
fi

echo ""
echo "Service Status:"
echo "==============="
ss -tlnp 2>/dev/null | grep -E "(:22|:3389)" | grep LISTEN || echo "Checking ports..."
echo ""
ps aux | grep -E "(sshd|xrdp|tailscaled)" | grep -v grep | awk '{print "  " $11 " (PID: " $2 ")"}'
