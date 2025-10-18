#!/bin/bash

echo "🔧 Setting up WireGuard as Tailscale alternative..."

# Install WireGuard
sudo apt update
sudo apt install -y wireguard wireguard-tools

# Create WireGuard directory
sudo mkdir -p /etc/wireguard
sudo chmod 700 /etc/wireguard

# Generate private key
sudo wg genkey | sudo tee /etc/wireguard/privatekey | sudo wg pubkey | sudo tee /etc/wireguard/publickey

# Create WireGuard configuration
sudo cat << 'EOF' > /etc/wireguard/wg0.conf
[Interface]
PrivateKey = $(cat /etc/wireguard/privatekey)
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

# Replace the private key in the config
sudo sed -i "s/\$(cat \/etc\/wireguard\/privatekey)/$(sudo cat /etc/wireguard/privatekey)/" /etc/wireguard/wg0.conf

# Start WireGuard
sudo wg-quick up wg0

# Enable WireGuard to start on boot
echo "#!/bin/bash" | sudo tee /etc/init.d/wireguard
echo "sudo wg-quick up wg0" | sudo tee -a /etc/init.d/wireguard
sudo chmod +x /etc/init.d/wireguard

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
echo "🔗 Add this server as a peer in your other devices"
echo "📊 Status: $(sudo wg show)"
