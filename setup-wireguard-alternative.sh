#!/bin/bash
set -e
set -o pipefail

echo "🔧 Setting up WireGuard as Tailscale alternative..."

# Install WireGuard
sudo apt update
sudo apt install -y wireguard wireguard-tools

# Create WireGuard directory
sudo mkdir -p /etc/wireguard
sudo chmod 700 /etc/wireguard

# Generate private key
sudo wg genkey | sudo tee /etc/wireguard/privatekey | sudo wg pubkey | sudo tee /etc/wireguard/publickey

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

# Create WireGuard configuration
sudo cat << EOF > /etc/wireguard/wg0.conf
[Interface]
PrivateKey = $(sudo cat /etc/wireguard/privatekey)
Address = 10.0.0.2/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Add your peer configurations here
# [Peer]
# PublicKey = <peer-public-key>
# Endpoint = <peer-ip>:51820
# AllowedIPs = 10.0.0.0/24
EOF

# Start WireGuard
sudo wg-quick up wg0

# Create keep-alive script
cat << 'EOF' > /workspace/keep-wireguard-alive.sh
#!/bin/bash
while true; do
    if ! sudo wg show > /dev/null 2>&1; then
        echo "$(date): Restarting WireGuard..."
        sudo wg-quick down wg0 2>/dev/null || true
        sudo wg-quick up wg0
    fi
    sleep 30
done
EOF

chmod +x /workspace/keep-wireguard-alive.sh
nohup /workspace/keep-wireguard-alive.sh > /var/log/wireguard-keepalive.log 2>&1 &

echo "✅ WireGuard setup complete!"
echo "📋 Your public key: $(sudo cat /etc/wireguard/publickey)"
echo "🌐 Server IP: $SERVER_IP"
echo "🔌 WireGuard Port: 51820"
echo "📊 Status: $(sudo wg show)"
