#!/bin/bash

# Cloud Agent Server - Complete Fix Script
# انسخ هذا السكربت والصقه في Cloud Agent server

set -e

echo "=========================================="
echo "Cloud Agent Server - Complete Fix"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Install required packages
print_step "1. Installing required packages..."
apt-get update -qq
apt-get install -y openssh-client openssh-server rsync curl > /dev/null 2>&1 || {
    apk update -q
    apk add --no-cache openssh-client openssh-server rsync curl > /dev/null 2>&1
}
print_success "Packages installed"

# Step 2: Install Tailscale
print_step "2. Installing Tailscale..."
if ! command -v tailscale > /dev/null 2>&1; then
    curl -fsSL https://tailscale.com/install.sh | sh > /dev/null 2>&1
    print_success "Tailscale installed"
else
    print_success "Tailscale already installed"
fi

# Step 3: Setup SSH directory
print_step "3. Setting up SSH directory..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
mkdir -p ~/.ssh/control
chmod 700 ~/.ssh/control
print_success "SSH directory created"

# Step 4: Generate SSH keys if not exist
print_step "4. Generating SSH keys..."
if [ ! -f ~/.ssh/id_ed25519 ]; then
    ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N '' -C 'cursor-cloud-agent' -q
    print_success "SSH keys generated"
else
    print_success "SSH keys already exist"
fi

# Set correct permissions
chmod 600 ~/.ssh/id_ed25519 2>/dev/null || true
chmod 644 ~/.ssh/id_ed25519.pub 2>/dev/null || true

# Step 5: Add authorized key
print_step "5. Setting up authorized_keys..."
if ! grep -q "AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr" ~/.ssh/authorized_keys 2>/dev/null; then
    echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated' >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    print_success "Authorized key added"
else
    print_success "Authorized key already exists"
fi

# Step 6: Create SSH config
print_step "6. Creating SSH config..."
cat > ~/.ssh/config << 'SSHCONFIG'
Host *
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    ServerAliveInterval 30
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ControlMaster auto
    ControlPath ~/.ssh/control/master-%r@%h:%p
    ControlPersist 10m
    IdentitiesOnly yes
    IdentityFile ~/.ssh/id_ed25519
    PasswordAuthentication no
    PubkeyAuthentication yes
    PreferredAuthentications publickey
    ConnectTimeout 10
    BatchMode yes
    LogLevel ERROR

Host 100.95.198.68
    HostName 100.95.198.68
    User ubuntu
    ServerAliveInterval 30
    ServerAliveCountMax 3
    TCPKeepAlive yes
    ConnectTimeout 10
    ControlMaster auto
    ControlPath ~/.ssh/control/master-%r@%h:%p
    ControlPersist 10m

Host server2
    HostName 100.95.198.68
    User ubuntu
    ServerAliveInterval 30
    ServerAliveCountMax 3
    TCPKeepAlive yes
    ConnectTimeout 10
    ControlMaster auto
    ControlPath ~/.ssh/control/master-%r@%h:%p
    ControlPersist 10m

Host tailscale
    HostName 100.121.114.88
    User ubuntu
    ServerAliveInterval 30
    ServerAliveCountMax 3
    TCPKeepAlive yes
    ConnectTimeout 10
    ControlMaster auto
    ControlPath ~/.ssh/control/master-%r@%h:%p
    ControlPersist 10m
SSHCONFIG

chmod 600 ~/.ssh/config
print_success "SSH config created"

# Step 7: Start SSH service
print_step "7. Starting SSH service..."
if pgrep -x sshd > /dev/null 2>&1; then
    print_success "SSH service already running"
else
    sudo service ssh start > /dev/null 2>&1 || sudo /usr/sbin/sshd -D > /dev/null 2>&1 &
    sleep 2
    if pgrep -x sshd > /dev/null 2>&1; then
        print_success "SSH service started"
    else
        print_error "Failed to start SSH service"
    fi
fi

# Step 8: Start Tailscale
print_step "8. Starting Tailscale..."
sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes > /dev/null 2>&1 || true
sleep 2

if tailscale status > /dev/null 2>&1; then
    TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
    print_success "Tailscale started (IP: $TS_IP)"
else
    print_warning "Tailscale may not be running (will retry in keepalive)"
fi

# Step 9: Create workspace directories
print_step "9. Creating workspace directories..."
mkdir -p /workspace/.cursor 2>/dev/null || mkdir -p ~/.cursor 2>/dev/null || true
print_success "Workspace directories created"

# Step 10: Create environment.json
print_step "10. Creating environment.json..."
WORKSPACE_DIR="/workspace"
if [ ! -d "$WORKSPACE_DIR" ]; then
    WORKSPACE_DIR="$HOME"
fi

cat > "$WORKSPACE_DIR/.cursor/environment.json" << 'ENVJSON'
{
  "build": {
    "dockerfile": "Dockerfile.dev",
    "context": "."
  },
  "install": [
    "curl -fsSL https://tailscale.com/install.sh | sh || echo 'Tailscale already installed'",
    "sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes || echo 'Tailscale already running'",
    "apt-get update && apt-get install -y openssh-client openssh-server rsync || apk add --no-cache openssh-client openssh-server rsync || echo 'SSH and rsync already installed'",
    "mkdir -p ~/.ssh && chmod 700 ~/.ssh",
    "if [ ! -f ~/.ssh/id_ed25519 ]; then ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N '' -C 'cursor-cloud-agent' && echo 'SSH key generated'; else echo 'SSH key already exists'; fi",
    "chmod 600 ~/.ssh/id_ed25519 2>/dev/null || true",
    "chmod 644 ~/.ssh/id_ed25519.pub 2>/dev/null || true",
    "echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys || echo 'SSH key already added'",
    "mkdir -p ~/.ssh/control && chmod 700 ~/.ssh/control",
    "cat > ~/.ssh/config << 'SSHCONFIG'\nHost *\n    StrictHostKeyChecking no\n    UserKnownHostsFile /dev/null\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    Compression yes\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\n    IdentitiesOnly yes\n    IdentityFile ~/.ssh/id_ed25519\n    PasswordAuthentication no\n    PubkeyAuthentication yes\n    PreferredAuthentications publickey\n    ConnectTimeout 10\n    BatchMode yes\n    LogLevel ERROR\n\nHost 100.95.198.68\n    HostName 100.95.198.68\n    User ubuntu\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    ConnectTimeout 10\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\n\nHost server2\n    HostName 100.95.198.68\n    User ubuntu\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    ConnectTimeout 10\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\n\nHost tailscale\n    HostName 100.121.114.88\n    User ubuntu\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    ConnectTimeout 10\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\nSSHCONFIG\n",
    "chmod 600 ~/.ssh/config"
  ],
  "start": [
    "sudo service ssh start || sudo /usr/sbin/sshd -D & || echo 'SSH service start attempted'",
    "sleep 2",
    "sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes || echo 'Tailscale start attempted'",
    "sleep 2",
    "tailscale status || echo 'Tailscale status check'",
    "nohup bash -c 'while true; do tailscale status > /dev/null 2>&1 || sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes; sleep 30; done' > /tmp/tailscale-keepalive.log 2>&1 &",
    "nohup bash -c 'while true; do touch /tmp/.keep-awake; sleep 60; done' > /tmp/prevent-sleep.log 2>&1 &",
    "nohup bash -c 'while true; do ping -c 1 100.121.114.88 > /dev/null 2>&1 || echo \"Keepalive ping\"; sleep 30; done' > /tmp/network-keepalive.log 2>&1 &",
    "nohup bash -c 'while true; do ssh -o ConnectTimeout=5 -o BatchMode=yes tailscale echo \"SSH health check\" > /dev/null 2>&1 || ssh -o ConnectTimeout=5 -o BatchMode=yes ubuntu@100.95.198.68 echo \"SSH health check\" > /dev/null 2>&1; sleep 60; done' > /tmp/ssh-healthcheck.log 2>&1 &",
    "nohup bash -c 'while true; do find ~/.ssh/control -type s -mtime +1 -delete 2>/dev/null; ps aux | grep \"[s]shd.*defunct\" | awk \"{print \\$2}\" | xargs -r kill -9 2>/dev/null; sleep 300; done' > /tmp/ssh-cleanup.log 2>&1 &",
    "nohup bash -c 'WORKSPACE_DIR=\"/workspace\"; if [ ! -d \"$WORKSPACE_DIR\" ]; then WORKSPACE_DIR=\"$(pwd)\"; fi; while true; do rsync -avz --delete --exclude=\"node_modules\" --exclude=\".next\" --exclude=\".git\" --exclude=\".cursor\" -e \"ssh -o ControlMaster=auto -o ControlPath=~/.ssh/control/master-%r@%h:%p -o ControlPersist=10m\" \"$WORKSPACE_DIR/\" ubuntu@100.121.114.88:/home/ubuntu/moeen-sync/ 2>&1 | head -20; sleep 300; done' > /tmp/rsync-sync.log 2>&1 &"
  ],
  "terminals": [
    {
      "name": "SSH Connection via Tailscale (Stable Multiplexed)",
      "command": "ssh -o ControlMaster=auto -o ControlPath=~/.ssh/control/master-%r@%h:%p -o ControlPersist=10m tailscale || ssh -o ControlMaster=auto -o ControlPath=~/.ssh/control/master-%r@%h:%p -o ControlPersist=10m ubuntu@100.95.198.68"
    },
    {
      "name": "Tailscale Status & Monitor",
      "command": "tailscale status && echo '---' && tailscale ip -4 && echo '---' && ps aux | grep tailscale | grep -v grep"
    },
    {
      "name": "SSH Health & Connection Status",
      "command": "echo '=== SSH Control Sockets ===' && ls -la ~/.ssh/control/ 2>/dev/null || echo 'No control sockets'; echo '---'; echo '=== Active SSH Connections ===' && netstat -an | grep :22 | wc -l && echo 'connections'; echo '---'; echo '=== SSH Health Check ===' && ssh -o ConnectTimeout=5 -o BatchMode=yes tailscale echo 'SSH OK' 2>&1 || ssh -o ConnectTimeout=5 -o BatchMode=yes ubuntu@100.95.198.68 echo 'SSH OK' 2>&1; echo '---'; echo '=== Keepalive Processes ===' && ps aux | grep -E '(tailscale|keep-awake|network-keepalive|ssh-healthcheck|ssh-cleanup|rsync-sync)' | grep -v grep"
    },
    {
      "name": "File Sync Status (rsync)",
      "command": "tail -20 /tmp/rsync-sync.log 2>/dev/null || echo 'No sync log yet'; echo '---'; echo 'Last sync check:'; ls -la /tmp/rsync-sync.log 2>/dev/null | awk '{print \"Modified: \" $6 \" \" $7 \" \" $8}'"
    }
  ],
  "env": {
    "TAILSCALE_AUTH_KEY": "tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ",
    "TAILSCALE_HOST": "100.121.114.88",
    "SSH_HOST": "100.95.198.68",
    "SSH_USER": "ubuntu",
    "SSH_KEY_PATH": "~/.ssh/id_ed25519",
    "SSH_OPTS": "-o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o TCPKeepAlive=yes -o ControlMaster=auto -o ControlPath=~/.ssh/control/master-%r@%h:%p -o ControlPersist=10m",
    "RSYNC_OPTS": "-avz --delete --exclude=\"node_modules\" --exclude=\".next\" --exclude=\".git\"",
    "SYNC_INTERVAL": "300"
  }
}
ENVJSON

print_success "environment.json created"

# Step 11: Verify installation
print_step "11. Verifying installation..."
echo ""

# Check SSH keys
if [ -f ~/.ssh/id_ed25519 ] && [ -f ~/.ssh/id_ed25519.pub ]; then
    print_success "SSH keys exist"
else
    print_error "SSH keys missing"
fi

# Check SSH service
if pgrep -x sshd > /dev/null 2>&1; then
    print_success "SSH service is running"
else
    print_error "SSH service is not running"
fi

# Check Tailscale
if command -v tailscale > /dev/null 2>&1; then
    if tailscale status > /dev/null 2>&1; then
        print_success "Tailscale is running"
        TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
        echo "  Tailscale IP: $TS_IP"
    else
        print_warning "Tailscale is installed but not running"
    fi
else
    print_error "Tailscale is not installed"
fi

# Check rsync
if command -v rsync > /dev/null 2>&1; then
    print_success "rsync is installed"
else
    print_error "rsync is not installed"
fi

# Check environment.json
if [ -f "$WORKSPACE_DIR/.cursor/environment.json" ]; then
    if python3 -m json.tool "$WORKSPACE_DIR/.cursor/environment.json" > /dev/null 2>&1; then
        print_success "environment.json exists and is valid"
    else
        print_error "environment.json is invalid JSON"
    fi
else
    print_error "environment.json does not exist"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Fix completed!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Restart Cloud Agent to apply changes"
echo "2. Run verification: bash /workspace/.cursor/verify-configuration.sh"
echo ""
