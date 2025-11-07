#!/bin/bash

# Smart Cloud Agent Setup Script
# This script intelligently handles and configures everything

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
TAILSCALE_AUTH_KEY="tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ"
TAILSCALE_IP="100.121.114.88"
SSH_HOST="100.95.198.68"
SSH_USER="ubuntu"
WORKSPACE_DIR="/workspace"
SSH_PUBLIC_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated"

# Logging
LOG_FILE="/tmp/smart-setup.log"
exec > >(tee -a "$LOG_FILE") 2>&1

# Functions
print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

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

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1
    print_error "Error at line $line_number (exit code: $exit_code)"
    return $exit_code
}

trap 'handle_error $LINENO' ERR

# Check if running as root or with sudo
check_sudo() {
    if ! sudo -n true 2>/dev/null; then
        print_warning "This script may need sudo permissions for some operations"
    fi
}

# Detect OS and package manager
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
    else
        OS="unknown"
    fi
    
    if command -v apt-get > /dev/null 2>&1; then
        PKG_MANAGER="apt"
    elif command -v apk > /dev/null 2>&1; then
        PKG_MANAGER="apk"
    elif command -v yum > /dev/null 2>&1; then
        PKG_MANAGER="yum"
    else
        PKG_MANAGER="unknown"
    fi
    
    print_info "Detected OS: $OS ($OS_VERSION)"
    print_info "Package manager: $PKG_MANAGER"
}

# Install packages
install_packages() {
    print_step "Installing required packages..."
    
    case $PKG_MANAGER in
        apt)
            sudo apt-get update -qq
            sudo apt-get install -y openssh-client openssh-server rsync curl sudo net-tools iputils-ping > /dev/null 2>&1 || {
                print_warning "Some packages may already be installed"
            }
            ;;
        apk)
            sudo apk update -q
            sudo apk add --no-cache openssh-client openssh-server rsync curl sudo net-tools iputils-ping > /dev/null 2>&1 || {
                print_warning "Some packages may already be installed"
            }
            ;;
        yum)
            sudo yum install -y openssh-clients openssh-server rsync curl sudo net-tools iputils > /dev/null 2>&1 || {
                print_warning "Some packages may already be installed"
            }
            ;;
        *)
            print_error "Unknown package manager. Please install manually: openssh-client openssh-server rsync curl sudo"
            return 1
            ;;
    esac
    
    print_success "Packages installed"
}

# Install Tailscale
install_tailscale() {
    print_step "Installing Tailscale..."
    
    if command -v tailscale > /dev/null 2>&1; then
        print_success "Tailscale already installed"
        tailscale version | head -1
        return 0
    fi
    
    print_info "Downloading and installing Tailscale..."
    if curl -fsSL https://tailscale.com/install.sh | sh 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Tailscale installed successfully"
    else
        print_error "Tailscale installation failed"
        return 1
    fi
}

# Setup SSH
setup_ssh() {
    print_step "Setting up SSH..."
    
    # Create SSH directory
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    mkdir -p ~/.ssh/control
    chmod 700 ~/.ssh/control
    print_success "SSH directories created"
    
    # Generate SSH keys if not exist
    if [ ! -f ~/.ssh/id_ed25519 ]; then
        print_info "Generating SSH keys..."
        ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N '' -C 'cursor-cloud-agent' -q
        print_success "SSH keys generated"
    else
        print_success "SSH keys already exist"
    fi
    
    # Set correct permissions
    chmod 600 ~/.ssh/id_ed25519 2>/dev/null || true
    chmod 644 ~/.ssh/id_ed25519.pub 2>/dev/null || true
    
    # Add authorized key
    if ! grep -q "$SSH_PUBLIC_KEY" ~/.ssh/authorized_keys 2>/dev/null; then
        echo "$SSH_PUBLIC_KEY" >> ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys
        print_success "Authorized key added"
    else
        print_success "Authorized key already exists"
    fi
    
    # Create SSH config
    print_info "Creating SSH config..."
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
}

# Start SSH service
start_ssh() {
    print_step "Starting SSH service..."
    
    if pgrep -x sshd > /dev/null 2>&1; then
        print_success "SSH service already running"
        return 0
    fi
    
    # Try multiple methods to start SSH
    if sudo service ssh start > /dev/null 2>&1; then
        sleep 2
        if pgrep -x sshd > /dev/null 2>&1; then
            print_success "SSH service started via service command"
            return 0
        fi
    fi
    
    # Create required directories
    sudo mkdir -p /var/run/sshd /run/sshd 2>/dev/null || true
    
    # Try direct start
    if sudo /usr/sbin/sshd -D > /dev/null 2>&1 & then
        sleep 2
        if pgrep -x sshd > /dev/null 2>&1; then
            print_success "SSH service started directly"
            return 0
        fi
    fi
    
    print_error "Failed to start SSH service"
    return 1
}

# Start Tailscale
start_tailscale() {
    print_step "Starting Tailscale..."
    
    if ! command -v tailscale > /dev/null 2>&1; then
        print_error "Tailscale not installed"
        return 1
    fi
    
    # Check if already running
    if tailscale status > /dev/null 2>&1; then
        TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
        print_success "Tailscale already running (IP: $TS_IP)"
        return 0
    fi
    
    # Start Tailscale
    print_info "Starting Tailscale with auth key..."
    if sudo tailscale up --authkey="$TAILSCALE_AUTH_KEY" --ssh --accept-routes 2>&1 | tee -a "$LOG_FILE"; then
        sleep 5
        
        # Verify it's running
        if tailscale status > /dev/null 2>&1; then
            TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
            print_success "Tailscale started successfully (IP: $TS_IP)"
            return 0
        else
            print_warning "Tailscale command executed but status check failed"
            
            # Try with reset flag
            print_info "Retrying with --reset flag..."
            sudo tailscale up --authkey="$TAILSCALE_AUTH_KEY" --ssh --accept-routes --reset 2>&1 | tee -a "$LOG_FILE" || true
            sleep 5
            
            if tailscale status > /dev/null 2>&1; then
                TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
                print_success "Tailscale started after reset (IP: $TS_IP)"
                return 0
            else
                print_error "Tailscale failed to start. Check logs: $LOG_FILE"
                return 1
            fi
        fi
    else
        print_error "Tailscale start command failed"
        return 1
    fi
}

# Create workspace directories
create_workspace() {
    print_step "Creating workspace directories..."
    
    if [ ! -d "$WORKSPACE_DIR" ]; then
        WORKSPACE_DIR="$(pwd)"
        print_info "Using current directory as workspace: $WORKSPACE_DIR"
    fi
    
    mkdir -p "$WORKSPACE_DIR/.cursor" 2>/dev/null || mkdir -p ~/.cursor 2>/dev/null || true
    print_success "Workspace directories created"
}

# Create environment.json
create_environment_json() {
    print_step "Creating environment.json..."
    
    ENV_JSON_PATH="$WORKSPACE_DIR/.cursor/environment.json"
    if [ ! -d "$WORKSPACE_DIR" ]; then
        ENV_JSON_PATH="$HOME/.cursor/environment.json"
    fi
    
    # Backup existing file
    if [ -f "$ENV_JSON_PATH" ]; then
        cp "$ENV_JSON_PATH" "$ENV_JSON_PATH.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
        print_info "Backed up existing environment.json"
    fi
    
    # Create environment.json
    cat > "$ENV_JSON_PATH" << 'ENVJSON'
{
  "build": {
    "dockerfile": "Dockerfile.dev",
    "context": "."
  },
  "install": [
    "curl -fsSL https://tailscale.com/install.sh | sh || echo 'Tailscale already installed'",
    "apt-get update && apt-get install -y openssh-client openssh-server rsync curl sudo || apk add --no-cache openssh-client openssh-server rsync curl sudo || echo 'Packages already installed'",
    "mkdir -p ~/.ssh && chmod 700 ~/.ssh",
    "if [ ! -f ~/.ssh/id_ed25519 ]; then ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N '' -C 'cursor-cloud-agent' && echo 'SSH key generated'; else echo 'SSH key already exists'; fi",
    "chmod 600 ~/.ssh/id_ed25519 2>/dev/null || true",
    "chmod 644 ~/.ssh/id_ed25519.pub 2>/dev/null || true",
    "echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys || echo 'SSH key already added'",
    "mkdir -p ~/.ssh/control && chmod 700 ~/.ssh/control",
    "cat > ~/.ssh/config << 'SSHCONFIG'\nHost *\n    StrictHostKeyChecking no\n    UserKnownHostsFile /dev/null\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    Compression yes\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\n    IdentitiesOnly yes\n    IdentityFile ~/.ssh/id_ed25519\n    PasswordAuthentication no\n    PubkeyAuthentication yes\n    PreferredAuthentications publickey\n    ConnectTimeout 10\n    BatchMode yes\n    LogLevel ERROR\n\nHost 100.95.198.68\n    HostName 100.95.198.68\n    User ubuntu\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    ConnectTimeout 10\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\n\nHost server2\n    HostName 100.95.198.68\n    User ubuntu\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    ConnectTimeout 10\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\n\nHost tailscale\n    HostName 100.121.114.88\n    User ubuntu\n    ServerAliveInterval 30\n    ServerAliveCountMax 3\n    TCPKeepAlive yes\n    ConnectTimeout 10\n    ControlMaster auto\n    ControlPath ~/.ssh/control/master-%r@%h:%p\n    ControlPersist 10m\nSSHCONFIG\n",
    "chmod 600 ~/.ssh/config",
    "mkdir -p /workspace/.cursor 2>/dev/null || mkdir -p ~/.cursor 2>/dev/null || true"
  ],
  "start": [
    "echo '=== Starting SSH Service ==='",
    "sudo service ssh start 2>&1 || sudo /usr/sbin/sshd -D 2>&1 & || (sudo mkdir -p /var/run/sshd && sudo /usr/sbin/sshd -D 2>&1 &) || echo 'SSH service start attempted'",
    "sleep 3",
    "if pgrep -x sshd > /dev/null 2>&1; then echo 'SSH service is running'; else echo 'SSH service failed to start'; fi",
    "echo '=== Starting Tailscale ==='",
    "if command -v tailscale > /dev/null 2>&1; then",
    "  echo 'Tailscale is installed, attempting to start...'",
    "  sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes 2>&1 || echo 'Tailscale up command executed'",
    "  sleep 5",
    "  if tailscale status > /dev/null 2>&1; then",
    "    TS_IP=$(tailscale ip -4 2>/dev/null | head -1)",
    "    echo 'Tailscale is running with IP: $TS_IP'",
    "  else",
    "    echo 'Tailscale status check failed, retrying...'",
    "    sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes --reset 2>&1 || true",
    "    sleep 5",
    "    tailscale status || echo 'Tailscale may need manual setup'",
    "  fi",
    "else",
    "  echo 'Tailscale not installed, installing now...'",
    "  curl -fsSL https://tailscale.com/install.sh | sh 2>&1 || echo 'Tailscale install failed'",
    "  sleep 3",
    "  sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes 2>&1 || echo 'Tailscale start failed'",
    "fi",
    "echo '=== Starting Keepalive Processes ==='",
    "nohup bash -c 'while true; do if ! tailscale status > /dev/null 2>&1; then echo \"$(date): Tailscale down, restarting...\" >> /tmp/tailscale-keepalive.log; sudo tailscale up --authkey=tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ --ssh --accept-routes 2>&1 >> /tmp/tailscale-keepalive.log; sleep 5; tailscale status >> /tmp/tailscale-keepalive.log 2>&1; fi; sleep 30; done' > /tmp/tailscale-keepalive.log 2>&1 &",
    "echo 'Tailscale keepalive started (PID: $!)'",
    "nohup bash -c 'while true; do touch /tmp/.keep-awake; sleep 60; done' > /tmp/prevent-sleep.log 2>&1 &",
    "echo 'System keepalive started (PID: $!)'",
    "nohup bash -c 'while true; do ping -c 1 100.121.114.88 > /dev/null 2>&1 || echo \"$(date): Keepalive ping failed\" >> /tmp/network-keepalive.log; sleep 30; done' > /tmp/network-keepalive.log 2>&1 &",
    "echo 'Network keepalive started (PID: $!)'",
    "nohup bash -c 'while true; do if ssh -o ConnectTimeout=5 -o BatchMode=yes tailscale echo \"SSH OK\" > /dev/null 2>&1; then echo \"$(date): SSH OK via Tailscale\" >> /tmp/ssh-healthcheck.log; elif ssh -o ConnectTimeout=5 -o BatchMode=yes ubuntu@100.95.198.68 echo \"SSH OK\" > /dev/null 2>&1; then echo \"$(date): SSH OK via direct IP\" >> /tmp/ssh-healthcheck.log; else echo \"$(date): SSH connection failed\" >> /tmp/ssh-healthcheck.log; fi; sleep 60; done' > /tmp/ssh-healthcheck.log 2>&1 &",
    "echo 'SSH healthcheck started (PID: $!)'",
    "nohup bash -c 'while true; do find ~/.ssh/control -type s -mtime +1 -delete 2>/dev/null; ps aux | grep \"[s]shd.*defunct\" | awk \"{print \\$2}\" | xargs -r kill -9 2>/dev/null; sleep 300; done' > /tmp/ssh-cleanup.log 2>&1 &",
    "echo 'SSH cleanup started (PID: $!)'",
    "nohup bash -c 'WORKSPACE_DIR=\"/workspace\"; if [ ! -d \"$WORKSPACE_DIR\" ]; then WORKSPACE_DIR=\"$(pwd)\"; fi; while true; do if rsync -avz --delete --exclude=\"node_modules\" --exclude=\".next\" --exclude=\".git\" --exclude=\".cursor\" -e \"ssh -o ControlMaster=auto -o ControlPath=~/.ssh/control/master-%r@%h:%p -o ControlPersist=10m -o ConnectTimeout=10\" \"$WORKSPACE_DIR/\" ubuntu@100.121.114.88:/home/ubuntu/moeen-sync/ 2>&1 | tee -a /tmp/rsync-sync.log | head -20; then echo \"$(date): Sync successful\" >> /tmp/rsync-sync.log; else echo \"$(date): Sync failed\" >> /tmp/rsync-sync.log; fi; sleep 300; done' > /tmp/rsync-sync.log 2>&1 &",
    "echo 'File sync (rsync) started (PID: $!)'",
    "echo '=== All services started ==='",
    "echo 'Checking status...'",
    "sleep 2",
    "pgrep -x sshd > /dev/null && echo 'SSH: Running' || echo 'SSH: Not running'",
    "tailscale status > /dev/null 2>&1 && echo 'Tailscale: Running' || echo 'Tailscale: Not running'",
    "ps aux | grep -E '(tailscale|keep-awake|network-keepalive|ssh-healthcheck|ssh-cleanup|rsync-sync)' | grep -v grep | wc -l | xargs -I {} echo 'Keepalive processes: {}'"
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
    },
    {
      "name": "Tailscale Debug & Logs",
      "command": "echo '=== Tailscale Status ===' && tailscale status 2>&1 || echo 'Tailscale not running'; echo '---'; echo '=== Tailscale IP ===' && tailscale ip -4 2>&1 || echo 'No IP assigned'; echo '---'; echo '=== Tailscale Keepalive Log ===' && tail -20 /tmp/tailscale-keepalive.log 2>/dev/null || echo 'No keepalive log'; echo '---'; echo '=== Tailscale Process ===' && ps aux | grep tailscale | grep -v grep || echo 'No Tailscale process'"
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
    
    # Validate JSON
    if python3 -m json.tool "$ENV_JSON_PATH" > /dev/null 2>&1; then
        print_success "environment.json created and validated"
        print_info "Location: $ENV_JSON_PATH"
    else
        print_error "environment.json is invalid JSON"
        return 1
    fi
}

# Verify installation
verify_installation() {
    print_step "Verifying installation..."
    
    local errors=0
    
    # Check SSH keys
    if [ -f ~/.ssh/id_ed25519 ] && [ -f ~/.ssh/id_ed25519.pub ]; then
        print_success "SSH keys exist"
    else
        print_error "SSH keys missing"
        ((errors++))
    fi
    
    # Check SSH service
    if pgrep -x sshd > /dev/null 2>&1; then
        print_success "SSH service is running"
    else
        print_error "SSH service is not running"
        ((errors++))
    fi
    
    # Check Tailscale
    if command -v tailscale > /dev/null 2>&1; then
        if tailscale status > /dev/null 2>&1; then
            TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
            print_success "Tailscale is running (IP: $TS_IP)"
        else
            print_warning "Tailscale is installed but not running"
        fi
    else
        print_error "Tailscale is not installed"
        ((errors++))
    fi
    
    # Check rsync
    if command -v rsync > /dev/null 2>&1; then
        print_success "rsync is installed"
    else
        print_error "rsync is not installed"
        ((errors++))
    fi
    
    # Check environment.json
    ENV_JSON_PATH="$WORKSPACE_DIR/.cursor/environment.json"
    if [ ! -d "$WORKSPACE_DIR" ]; then
        ENV_JSON_PATH="$HOME/.cursor/environment.json"
    fi
    
    if [ -f "$ENV_JSON_PATH" ]; then
        if python3 -m json.tool "$ENV_JSON_PATH" > /dev/null 2>&1; then
            print_success "environment.json exists and is valid"
        else
            print_error "environment.json is invalid JSON"
            ((errors++))
        fi
    else
        print_error "environment.json does not exist"
        ((errors++))
    fi
    
    return $errors
}

# Main execution
main() {
    print_header "Smart Cloud Agent Setup"
    print_info "Log file: $LOG_FILE"
    print_info "Started at: $(date)"
    
    check_sudo
    detect_os
    install_packages
    install_tailscale
    setup_ssh
    start_ssh
    start_tailscale
    create_workspace
    create_environment_json
    
    print_header "Verification"
    if verify_installation; then
        print_header "Setup Complete!"
        print_success "All components configured successfully"
        print_info "Next steps:"
        print_info "1. Restart Cloud Agent to apply changes"
        print_info "2. Check logs: tail -f $LOG_FILE"
        print_info "3. Monitor Tailscale: tail -f /tmp/tailscale-keepalive.log"
        return 0
    else
        print_header "Setup Complete with Warnings"
        print_warning "Some components may need manual configuration"
        print_info "Check logs: $LOG_FILE"
        return 1
    fi
}

# Run main function
main "$@"
