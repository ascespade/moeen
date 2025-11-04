#!/bin/bash
# Quick Setup: Connect Tailscale and Setup SSH Key Access
# Sets up Tailscale connection and prepares SSH key for remote server

set -e

TAILSCALE_API_KEY="tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX"
REMOTE_HOST="ubuntu@100.121.114.88"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🚀 QUICK CONNECT SETUP                                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Ensure SSH key exists
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1/3: Setting up SSH key..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SSH_KEY=""
SSH_KEY_FILE="$HOME/.ssh/id_ed25519.pub"

# Check if key exists
if [ -f "$SSH_KEY_FILE" ]; then
    SSH_KEY=$(cat "$SSH_KEY_FILE")
    echo "✅ SSH key found: $SSH_KEY_FILE"
else
    # Generate new key
    echo "📝 Generating new SSH key..."
    mkdir -p "$HOME/.ssh"
    ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519" -N "" -q -C "auto-generated"
    SSH_KEY=$(cat "$SSH_KEY_FILE")
    echo "✅ SSH key generated"
fi

echo ""
echo "📋 Your Public SSH Key:"
echo "   $SSH_KEY"
echo ""

# Save to reference file
echo "$SSH_KEY" > /workspace/MY_SSH_PUBLIC_KEY.txt
echo "💾 Saved to: /workspace/MY_SSH_PUBLIC_KEY.txt"

# Step 2: Setup Tailscale
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 2/3: Setting up Tailscale..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Tailscale is installed
if ! command -v tailscale &> /dev/null; then
    echo "📦 Installing Tailscale..."
    curl -fsSL https://tailscale.com/install.sh | sh
fi

# Authenticate Tailscale
if ! tailscale status &>/dev/null; then
    echo "🔑 Authenticating Tailscale..."
    echo "$TAILSCALE_API_KEY" | tailscale up --authkey -
    echo "✅ Tailscale authenticated"
else
    echo "✅ Tailscale already connected"
    TS_IP=$(tailscale ip -4 2>/dev/null || echo "N/A")
    echo "   Tailscale IP: $TS_IP"
fi

# Wait a moment for connection
sleep 3

# Step 3: Setup SSH key on remote server
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 3/3: Adding SSH key to remote server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔗 Target: $REMOTE_HOST"
echo ""

# Try to connect and add key
echo "Attempting to add key (may require password)..."
echo ""

# Method 1: Try ssh-copy-id
if command -v ssh-copy-id &> /dev/null; then
    if ssh-copy-id -i "$SSH_KEY_FILE" "$REMOTE_HOST" 2>&1; then
        echo "✅ Key added successfully!"
    else
        echo "⚠️ ssh-copy-id failed or requires password"
        echo ""
        echo "📋 Manual Method:"
        echo "Run this on the REMOTE SERVER:"
        echo ""
        echo "mkdir -p ~/.ssh && echo '$SSH_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
        echo ""
        echo "Or run this command (requires password):"
        echo ""
        echo "ssh $REMOTE_HOST 'mkdir -p ~/.ssh && echo \"$SSH_KEY\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'"
    fi
else
    echo "📋 Manual Method:"
    echo "Run this on the REMOTE SERVER ($REMOTE_HOST):"
    echo ""
    echo "mkdir -p ~/.ssh && echo '$SSH_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
    echo ""
    echo "Or run this command (requires password):"
    echo ""
    echo "ssh $REMOTE_HOST 'mkdir -p ~/.ssh && echo \"$SSH_KEY\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing connection..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 2

if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_HOST" "echo '✅ Passwordless SSH connection successful!'; hostname" 2>&1; then
    echo ""
    echo "✅ Connection test successful!"
else
    echo ""
    echo "⚠️ Connection test failed. Make sure:"
    echo "   1. The key has been added to the remote server"
    echo "   2. Tailscale is connected on both servers"
    echo "   3. SSH service is running on the remote server"
    echo ""
    echo "Try manually: ssh $REMOTE_HOST"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ SETUP COMPLETE!                                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo "   1. Ensure key is added to remote server"
echo "   2. Test connection: ssh $REMOTE_HOST"
echo "   3. Setup Tailscale protection: sudo /workspace/setup-tailscale-triple-protection.sh"
echo ""
