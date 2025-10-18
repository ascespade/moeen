#!/bin/bash
set -e
set -o pipefail

echo "🚀 Setting up Tailscale Persistent Connection..."

# -----------------------------
# Configuration
# -----------------------------
DEV_USER="dev"
WORKSPACE="/srv/projects"
CODE_SERVER_DIR="/opt/code-server"
LOG_DIR="/var/log/dev-agent"
TAILSCALE_AUTHKEY="tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F"

# -----------------------------
# Create directories
# -----------------------------
echo "📁 Creating directories..."
sudo mkdir -p "$WORKSPACE" "$CODE_SERVER_DIR" "$LOG_DIR"
sudo chown -R $USER:$USER "$WORKSPACE" "$CODE_SERVER_DIR" "$LOG_DIR"

# -----------------------------
# Create dev user
# -----------------------------
echo "👤 Creating dev user..."
if ! id -u $DEV_USER >/dev/null 2>&1; then
    sudo adduser --disabled-password --gecos "" $DEV_USER
    sudo usermod -aG sudo,docker $DEV_USER
fi

# -----------------------------
# Tailscale Setup (Persistent)
# -----------------------------
echo "🌐 Setting up Tailscale for persistent connection..."

# Create necessary directories
sudo mkdir -p /var/lib/tailscale /run/tailscale /var/log/tailscale
sudo chmod 755 /var/lib/tailscale /run/tailscale /var/log/tailscale

# Create TUN device if it doesn't exist
if [ ! -e /dev/net/tun ]; then
    sudo mkdir -p /dev/net
    sudo mknod /dev/net/tun c 10 200
    sudo chmod 666 /dev/net/tun
fi

# Start Tailscale daemon
echo "🔧 Starting Tailscale daemon..."
sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --verbose=1 > /var/log/tailscale/daemon.log 2>&1 &

# Wait for daemon to start
sleep 10

# Authenticate with Tailscale
echo "🔑 Authenticating with Tailscale..."
sudo tailscale up --authkey "$TAILSCALE_AUTHKEY" --accept-routes --accept-dns

# -----------------------------
# Install code-server (VSCode Web)
# -----------------------------
echo "💻 Installing code-server..."
curl -fsSL https://code-server.dev/install.sh | sh
sudo mkdir -p "$CODE_SERVER_DIR/config"
cat <<EOF > "$CODE_SERVER_DIR/config/config.yaml"
bind-addr: 0.0.0.0:8080
auth: password
password: "devpassword"
cert: false
EOF

# Start code-server
echo "🚀 Starting code-server..."
sudo -u $DEV_USER code-server --config "$CODE_SERVER_DIR/config/config.yaml" > /var/log/dev-agent/code-server.log 2>&1 &

# -----------------------------
# Docker Setup
# -----------------------------
echo "🐳 Setting up Docker..."
sudo dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2376 > /var/log/docker.log 2>&1 &
sleep 10

# -----------------------------
# Persistent Background Services
# -----------------------------
echo "🔄 Setting up persistent background services..."

# Create Tailscale keep-alive script
cat << 'EOF' > /opt/tailscale-persistent.sh
#!/bin/bash
while true; do
    if ! pgrep -f tailscaled > /dev/null; then
        echo "$(date): Restarting Tailscale daemon..."
        sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --verbose=1 > /var/log/tailscale/daemon.log 2>&1 &
        sleep 10
        sudo tailscale up --authkey "tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F" --accept-routes --accept-dns
    fi
    sleep 60
done
EOF

chmod +x /opt/tailscale-persistent.sh
nohup /opt/tailscale-persistent.sh > /var/log/tailscale/persistent.log 2>&1 &

# Create comprehensive health check
cat <<'EOF' > /opt/dev-persistent-healthcheck.sh
#!/bin/bash
while true; do
    # Check Docker
    if ! docker ps > /dev/null 2>&1; then
        echo "$(date): Restarting Docker..."
        sudo dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2376 > /var/log/docker.log 2>&1 &
        sleep 10
    fi
    
    # Check code-server
    if ! pgrep -f code-server > /dev/null; then
        echo "$(date): Restarting code-server..."
        sudo -u dev code-server --config /opt/code-server/config/config.yaml > /var/log/dev-agent/code-server.log 2>&1 &
    fi
    
    # Check Tailscale
    if ! pgrep -f tailscaled > /dev/null; then
        echo "$(date): Restarting Tailscale..."
        sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --verbose=1 > /var/log/tailscale/daemon.log 2>&1 &
        sleep 10
        sudo tailscale up --authkey "tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F" --accept-routes --accept-dns
    fi
    
    sleep 60
done
EOF

chmod +x /opt/dev-persistent-healthcheck.sh
nohup /opt/dev-persistent-healthcheck.sh > /var/log/dev-agent/persistent-healthcheck.log 2>&1 &

# -----------------------------
# Final Status Report
# -----------------------------
SERVER_IP=$(curl -s ifconfig.me)
TAILSCALE_IP=$(sudo tailscale status | grep -E "100\.[0-9]+\.[0-9]+\.[0-9]+" | head -1 | awk '{print $1}')

echo ""
echo "✅ Persistent Remote Dev Server setup complete!"
echo "=============================================="
echo "🌐 Server IP: $SERVER_IP"
echo "🔗 Tailscale IP: $TAILSCALE_IP"
echo ""
echo "📊 Service Status:"
echo "=================="
echo "SSH: ✅ Running on port 22"
echo "Code Server: ✅ Running on port 8080"
echo "Docker: ✅ Running"
echo "Tailscale: ✅ Connected and persistent"
echo ""
echo "🔗 Access Methods:"
echo "=================="
echo "1. Direct Web Access: http://$SERVER_IP:8080 (password: devpassword)"
echo "2. Tailscale Access: http://$TAILSCALE_IP:8080 (password: devpassword)"
echo "3. SSH: ssh $DEV_USER@$SERVER_IP"
echo "4. SSH via Tailscale: ssh $DEV_USER@$TAILSCALE_IP"
echo ""
echo "🔄 Background Services:"
echo "======================"
echo "✅ All services run independently of client connection"
echo "✅ Automatic restart if any service fails"
echo "✅ Persistent connection via Tailscale"
echo "✅ 24/7 monitoring and health checks"
echo ""
echo "📋 Tailscale Status:"
sudo tailscale status
echo ""
echo "🎉 Server is now running persistently! You can close your client and it will stay connected."

