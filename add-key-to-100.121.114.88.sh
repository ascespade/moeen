#!/bin/bash
# Quick script to add SSH key to remote server 100.121.114.88
# Uses the provided public key

REMOTE_HOST="ubuntu@100.121.114.88"
PUBLIC_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔑 ADD SSH KEY TO REMOTE SERVER                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Target: $REMOTE_HOST"
echo ""

# Ensure we have the key locally first
KEY_FILE="$HOME/.ssh/id_ed25519.pub"
if [ ! -f "$KEY_FILE" ]; then
    echo "📝 Creating SSH key pair locally..."
    mkdir -p "$HOME/.ssh"
    ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519" -N "" -q -C "auto-generated"
    echo "✅ Key created"
fi

echo "📋 Public Key:"
echo "   $PUBLIC_KEY"
echo ""

# Method 1: Try ssh-copy-id
echo "Method 1: Attempting ssh-copy-id..."
if command -v ssh-copy-id &> /dev/null; then
    if ssh-copy-id -i "$KEY_FILE" "$REMOTE_HOST" 2>&1; then
        echo "✅ Key added successfully!"
        echo ""
        echo "🧪 Testing connection..."
        if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_HOST" "echo '✅ Connection successful!'; hostname" 2>&1; then
            echo ""
            echo "✅✅ Passwordless SSH is working!"
            exit 0
        fi
    else
        echo "⚠️ ssh-copy-id requires password or failed"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Method 2: Manual command (run on REMOTE SERVER)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "SSH to the remote server and run:"
echo ""
echo "mkdir -p ~/.ssh && echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
echo ""
echo "Or run this one-liner (requires password):"
echo ""
echo "ssh $REMOTE_HOST 'mkdir -p ~/.ssh && echo \"$PUBLIC_KEY\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tip: If Tailscale is not connected, run:"
echo "   sudo /workspace/quick-connect-setup.sh"
echo ""
