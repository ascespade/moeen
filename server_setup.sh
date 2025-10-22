#!/bin/bash
echo "🔧 Setting up SSH keys on server..."

# Create SSH directory
mkdir -p ~/.ssh
echo "✅ Created ~/.ssh directory"

# Set proper permissions
chmod 700 ~/.ssh
echo "✅ Set permissions for ~/.ssh"

# Add public key to authorized_keys
cat ~/my_public_key.txt >> ~/.ssh/authorized_keys
echo "✅ Added public key to authorized_keys"

# Set proper permissions for authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "✅ Set permissions for authorized_keys"

# Remove the public key file
rm ~/my_public_key.txt
echo "✅ Removed public key file"

# Setup Tailscale for background service
echo "🌐 Setting up Tailscale..."
sudo tailscale down
sudo tailscale up --accept-routes --accept-dns=false
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
echo "✅ Tailscale configured for background service"

echo "🎉 Setup complete!"
echo "You can now exit and test: ssh ubuntu@100.64.64.33"