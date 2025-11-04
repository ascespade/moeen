#!/bin/bash
# SSH Server Setup Script - Standalone
# Configure SSH server with stability and security

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🔐 SSH SERVER SETUP                                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root or with sudo"
    exit 1
fi

# Backup current config
if [ -f /etc/ssh/sshd_config ]; then
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ SSH config backed up"
fi

# Create optimized SSH config
cat > /etc/ssh/sshd_config << 'EOF'
# SSH Server Configuration - Optimized for Stability
# Port
Port 22
Protocol 2

# Authentication
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication yes
PermitRootLogin no

# Connection Stability
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 6
MaxStartups 10:30:100
LoginGraceTime 120

# Performance
MaxSessions 20
MaxAuthTries 6
Compression no

# Security
X11Forwarding no
AllowTcpForwarding yes
PermitTunnel yes

# Logging
SyslogFacility AUTH
LogLevel INFO
EOF

# Validate
if sshd -t 2>/dev/null; then
    echo "✅ SSH config is valid"

    # Restart SSH
    if systemctl is-system-running > /dev/null 2>&1; then
        systemctl restart sshd 2>/dev/null || systemctl restart ssh 2>/dev/null
        systemctl enable sshd 2>/dev/null || systemctl enable ssh 2>/dev/null
        echo "✅ SSH service restarted"
    else
        pkill sshd 2>/dev/null
        sleep 1
        /usr/sbin/sshd -D &
        echo "✅ SSH daemon started"
    fi
else
    echo "❌ SSH config has errors"
    exit 1
fi

# Setup passwordless SSH
echo ""
echo "Setting up passwordless SSH..."

# Generate key if needed
if [ ! -f /root/.ssh/id_ed25519 ]; then
    ssh-keygen -t ed25519 -f /root/.ssh/id_ed25519 -N "" -q
    echo "✅ SSH key generated"
fi

# Add to authorized_keys
PUBLIC_KEY=$(cat /root/.ssh/id_ed25519.pub 2>/dev/null)
if [ -n "$PUBLIC_KEY" ]; then
    mkdir -p /root/.ssh
    if ! grep -q "$PUBLIC_KEY" /root/.ssh/authorized_keys 2>/dev/null; then
        echo "$PUBLIC_KEY" >> /root/.ssh/authorized_keys
    fi
    chmod 600 /root/.ssh/authorized_keys
    chmod 700 /root/.ssh

    # For ubuntu user
    if id ubuntu &>/dev/null; then
        mkdir -p /home/ubuntu/.ssh
        if ! grep -q "$PUBLIC_KEY" /home/ubuntu/.ssh/authorized_keys 2>/dev/null; then
            echo "$PUBLIC_KEY" >> /home/ubuntu/.ssh/authorized_keys
        fi
        chown -R ubuntu:ubuntu /home/ubuntu/.ssh 2>/dev/null
        chmod 600 /home/ubuntu/.ssh/authorized_keys
        chmod 700 /home/ubuntu/.ssh
        echo "✅ Passwordless SSH configured for ubuntu"
    fi

    echo ""
    echo "📋 Your SSH Public Key:"
    echo "   $PUBLIC_KEY"
    
    # Save to reference file
    echo "$PUBLIC_KEY" > /workspace/MY_SSH_PUBLIC_KEY.txt
    echo "💾 Saved to: /workspace/MY_SSH_PUBLIC_KEY.txt"
fi

echo ""
echo "✅ SSH Server Setup Complete!"
echo ""
echo "Test connection: ssh localhost"
