#!/bin/bash
set -e

# Create dev user
DEV_USER="dev"
if ! id -u $DEV_USER >/dev/null 2>&1; then
    sudo adduser --disabled-password --gecos "" $DEV_USER
    sudo usermod -aG sudo,docker $DEV_USER
    echo "✅ Dev user created"
else
    echo "✅ Dev user already exists"
fi

# Create directories
WORKSPACE="/srv/projects"
sudo mkdir -p "$WORKSPACE"
sudo chown -R $DEV_USER:$DEV_USER "$WORKSPACE"

# Copy current project to workspace
if [ -d "/workspace" ]; then
    sudo cp -r /workspace/* "$WORKSPACE/" 2>/dev/null || true
    sudo chown -R $DEV_USER:$DEV_USER "$WORKSPACE"
    echo "✅ Project copied to workspace"
fi

echo "✅ Basic setup complete"