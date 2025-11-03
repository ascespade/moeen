#!/bin/bash
# Script to help set up SSH keys for passwordless authentication

echo "==================================="
echo "SSH Key Setup Helper"
echo "==================================="
echo ""
echo "This script will help you set up SSH keys for passwordless authentication."
echo ""
echo "To set up SSH keys:"
echo "1. On your Windows machine, open PowerShell or Command Prompt"
echo "2. Generate an SSH key pair (if you don't have one):"
echo "   ssh-keygen -t ed25519 -C \"your_email@example.com\""
echo "   (Press Enter to accept default location, set a passphrase if desired)"
echo ""
echo "3. Display your public key:"
echo "   cat ~/.ssh/id_ed25519.pub"
echo "   (or type \"type %USERPROFILE%\\.ssh\\id_ed25519.pub\" on Windows CMD)"
echo ""
echo "4. Copy the output and paste it below when prompted,"
echo "   or manually add it to ~/.ssh/authorized_keys on this server"
echo ""
echo "5. Add your public key to this server:"
echo "   echo 'YOUR_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys"
echo ""
echo "Current authorized_keys file (if any):"
echo "--------------------------------------"
cat ~/.ssh/authorized_keys 2>/dev/null || echo "(No authorized keys found)"
echo "--------------------------------------"
echo ""
echo "SSH server is configured to accept only key-based authentication."
echo "Password authentication has been disabled for security."
echo ""

# Interactive mode if run directly
if [ -t 0 ]; then
    read -p "Enter your public SSH key (or press Ctrl+C to exit): " pubkey
    if [ -n "$pubkey" ]; then
        echo "$pubkey" >> ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys
        echo "Public key added successfully!"
        echo ""
        echo "Current authorized keys:"
        cat ~/.ssh/authorized_keys
    fi
fi
