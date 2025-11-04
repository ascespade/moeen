#!/bin/bash
# Add this server's SSH public key to a remote server
# Usage: ./add-ssh-key-to-remote.sh user@remote-ip

REMOTE_HOST="${1:-ubuntu@100.121.114.88}"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔑 ADD SSH KEY TO REMOTE SERVER                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Find or generate SSH key
SSH_KEY=""
SSH_KEY_FILE=""

# Check common locations
for key_file in ~/.ssh/id_ed25519.pub /root/.ssh/id_ed25519.pub /home/ubuntu/.ssh/id_ed25519.pub; do
    if [ -f "$key_file" ]; then
        SSH_KEY=$(cat "$key_file")
        SSH_KEY_FILE="$key_file"
        break
    fi
done

# Generate key if not found
if [ -z "$SSH_KEY" ]; then
    echo "📦 Generating new SSH key..."
    KEY_DIR="$HOME/.ssh"
    mkdir -p "$KEY_DIR"
    ssh-keygen -t ed25519 -f "$KEY_DIR/id_ed25519" -N "" -q -C "auto-generated"
    SSH_KEY=$(cat "$KEY_DIR/id_ed25519.pub")
    SSH_KEY_FILE="$KEY_DIR/id_ed25519.pub"
    echo "✅ SSH key generated"
fi

echo "📋 Public Key:"
echo "   $SSH_KEY"
echo ""

# Try to add key to remote server
echo "🔗 Attempting to add key to $REMOTE_HOST..."
echo ""

# Method 1: Try ssh-copy-id (if password authentication is enabled)
if command -v ssh-copy-id &> /dev/null; then
    echo "Method 1: Using ssh-copy-id..."
    if ssh-copy-id -i "$SSH_KEY_FILE" "$REMOTE_HOST" 2>&1; then
        echo "✅ Key added successfully via ssh-copy-id"
        echo ""
        echo "🧪 Testing connection..."
        if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_HOST" "echo '✅ Passwordless SSH connection successful!'" 2>&1; then
            echo ""
            echo "✅ Connection test passed!"
            exit 0
        fi
    else
        echo "⚠️ ssh-copy-id failed, trying manual method..."
    fi
fi

# Method 2: Manual command (requires password)
echo ""
echo "Method 2: Manual command (requires password on remote server)..."
echo ""
echo "Run this command on the REMOTE SERVER ($REMOTE_HOST):"
echo ""
echo "mkdir -p ~/.ssh && echo '$SSH_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
echo ""

# Method 3: If we have password access, try direct SSH
echo "Method 3: If you have password access, run:"
echo ""
echo "ssh $REMOTE_HOST 'mkdir -p ~/.ssh && echo \"$SSH_KEY\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'"
echo ""

# Save key to file for reference
KEY_REF_FILE="/workspace/MY_SSH_PUBLIC_KEY.txt"
echo "$SSH_KEY" > "$KEY_REF_FILE"
echo "💾 Key saved to: $KEY_REF_FILE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "After adding the key, test connection:"
echo "   ssh $REMOTE_HOST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
