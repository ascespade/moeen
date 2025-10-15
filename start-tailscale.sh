#!/bin/bash

# Create necessary directories
sudo mkdir -p /var/lib/tailscale
sudo mkdir -p /run/tailscale
sudo mkdir -p /var/log/tailscale

# Start tailscaled daemon
echo "Starting Tailscale daemon..."
sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 > /var/log/tailscale/daemon.log 2>&1 &

# Wait for daemon to start
sleep 5

# Check if daemon is running
if pgrep -f tailscaled > /dev/null; then
    echo "✅ Tailscale daemon started successfully"
    
    # Start Tailscale up (this will prompt for authentication)
    echo "Starting Tailscale up..."
    sudo tailscale up --accept-routes --accept-dns=false
    
    # Check status
    echo "Tailscale status:"
    sudo tailscale status
    
    # Create a keep-alive script
    cat << 'EOF' > /workspace/keep-tailscale-alive.sh
#!/bin/bash
while true; do
    if ! pgrep -f tailscaled > /dev/null; then
        echo "$(date): Restarting Tailscale daemon..."
        sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 > /var/log/tailscale/daemon.log 2>&1 &
        sleep 5
    fi
    sleep 30
done
EOF
    
    chmod +x /workspace/keep-tailscale-alive.sh
    nohup /workspace/keep-tailscale-alive.sh > /var/log/tailscale/keepalive.log 2>&1 &
    
    echo "✅ Tailscale keep-alive script started"
    echo "✅ Tailscale is now running and will stay active 24/7"
    
else
    echo "❌ Failed to start Tailscale daemon"
    exit 1
fi
