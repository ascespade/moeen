#!/bin/bash

# SSH Key Setup Wizard for EC2 - Enhanced Version
# Author: Moeen's Smart Assistant
# Description: Automatically generates SSH keys and sets up secure access to EC2 instances

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() { echo -e "${BLUE}[ℹ]${NC} $1"; }
print_success() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_header() { echo -e "${PURPLE}[🔧]${NC} $1"; }

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate IP or DNS
validate_host() {
    local host="$1"
    if [[ -z "$host" ]]; then
        return 1
    fi
    # Basic validation for IP or domain
    if [[ "$host" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]] || [[ "$host" =~ ^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]] || [[ "$host" =~ ^ec2-[0-9-]+\..*\.amazonaws\.com$ ]]; then
        return 0
    fi
    return 1
}

# Function to validate file exists and is readable
validate_pem_file() {
    local pem_file="$1"
    if [[ ! -f "$pem_file" ]]; then
        print_error "PEM file not found: $pem_file"
        return 1
    fi
    if [[ ! -r "$pem_file" ]]; then
        print_error "Cannot read PEM file: $pem_file"
        return 1
    fi
    # Check if it's likely a PEM file
    if ! grep -q "BEGIN.*PRIVATE KEY" "$pem_file" 2>/dev/null; then
        print_warning "File doesn't appear to be a valid PEM key file"
        read -p "Continue anyway? (y/N): " continue_anyway
        if [[ ! "$continue_anyway" =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
    return 0
}

# Main script starts here
clear
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                🔐 SSH Key Setup Wizard 🔐                ║"
echo "║              Smart EC2 Access Configuration              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check required commands
print_info "Checking required tools..."
for cmd in ssh ssh-keygen; do
    if ! command_exists "$cmd"; then
        print_error "Required command not found: $cmd"
        print_error "Please install OpenSSH client tools"
        exit 1
    fi
done
print_success "All required tools are available"

# 1. Get EC2 connection details
echo
print_header "Step 1: EC2 Connection Details"
while true; do
    read -p "$(echo -e ${CYAN}Enter EC2 public DNS or IP${NC}): " EC2_HOST
    if validate_host "$EC2_HOST"; then
        print_success "Valid host: $EC2_HOST"
        break
    else
        print_error "Invalid host format. Please enter a valid IP address or DNS name"
    fi
done

read -p "$(echo -e ${CYAN}Enter EC2 username${NC}) [default: ubuntu]: " EC2_USER
EC2_USER=${EC2_USER:-ubuntu}
print_info "Using username: $EC2_USER"

while true; do
    read -p "$(echo -e ${CYAN}Enter path to EC2 .pem key${NC}) (e.g. /d/vm/my-dev-key.pem): " EC2_KEY
    if validate_pem_file "$EC2_KEY"; then
        print_success "PEM file validated: $EC2_KEY"
        break
    else
        print_error "Please provide a valid PEM file path"
    fi
done

# 2. Setup SSH directory and generate key
echo
print_header "Step 2: SSH Key Generation"
SSH_DIR="$HOME/.ssh"
KEY_NAME="id_ed25519_cursor_$(date +%Y%m%d_%H%M%S)"
KEY_PATH="$SSH_DIR/$KEY_NAME"

print_info "Creating SSH directory if needed..."
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

print_info "Generating new SSH key at $KEY_PATH"
if ssh-keygen -t ed25519 -f "$KEY_PATH" -N "" -q -C "cursor-ec2-access-$(date +%Y%m%d)"; then
    print_success "SSH key pair generated successfully"
    chmod 600 "$KEY_PATH"
    chmod 644 "$KEY_PATH.pub"
else
    print_error "Failed to generate SSH key"
    exit 1
fi

# 3. Test initial connection to EC2
echo
print_header "Step 3: Testing EC2 Connection"
print_info "Testing connection to $EC2_USER@$EC2_HOST using PEM key..."
if ssh -i "$EC2_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 -o BatchMode=yes "$EC2_USER@$EC2_HOST" "echo 'Connection test successful'" >/dev/null 2>&1; then
    print_success "EC2 connection verified"
else
    print_error "Cannot connect to EC2 instance. Please check:"
    print_error "  - Host address: $EC2_HOST"
    print_error "  - Username: $EC2_USER"
    print_error "  - PEM key: $EC2_KEY"
    print_error "  - Security groups allow SSH (port 22)"
    exit 1
fi

# 4. Copy public key to EC2
echo
print_header "Step 4: Installing Public Key on EC2"
PUB_KEY=$(cat "$KEY_PATH.pub")
print_info "Copying public key to $EC2_USER@$EC2_HOST"

if ssh -i "$EC2_KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "
    mkdir -p ~/.ssh && 
    chmod 700 ~/.ssh && 
    echo '$PUB_KEY' >> ~/.ssh/authorized_keys && 
    chmod 600 ~/.ssh/authorized_keys &&
    # Remove duplicates if any
    sort ~/.ssh/authorized_keys | uniq > ~/.ssh/authorized_keys.tmp &&
    mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys &&
    echo 'Public key installed successfully'
"; then
    print_success "Public key copied to EC2 instance"
else
    print_error "Failed to copy public key to EC2"
    exit 1
fi

# 5. Test new SSH connection
echo
print_header "Step 5: Testing New SSH Key"
print_info "Testing connection with new SSH key..."
if ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$EC2_USER@$EC2_HOST" "echo '🎉 New SSH key works perfectly! Connected successfully.'" 2>/dev/null; then
    print_success "New SSH key authentication successful!"
else
    print_error "New SSH key authentication failed"
    print_warning "The key was copied but authentication isn't working"
    exit 1
fi

# 6. Create SSH config entry (optional)
echo
print_header "Step 6: SSH Configuration (Optional)"
read -p "$(echo -e ${CYAN}Create SSH config entry for easy access?${NC}) (Y/n): " create_config
if [[ ! "$create_config" =~ ^[Nn]$ ]]; then
    read -p "$(echo -e ${CYAN}Enter a short name for this connection${NC}) [default: ec2-cursor]: " ssh_alias
    ssh_alias=${ssh_alias:-ec2-cursor}
    
    SSH_CONFIG="$SSH_DIR/config"
    print_info "Adding entry to SSH config: $SSH_CONFIG"
    
    cat >> "$SSH_CONFIG" << EOF

# Generated by SSH Setup Wizard - $(date)
Host $ssh_alias
    HostName $EC2_HOST
    User $EC2_USER
    IdentityFile $KEY_PATH
    StrictHostKeyChecking no
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF
    
    chmod 600 "$SSH_CONFIG"
    print_success "SSH config entry created"
    print_info "You can now connect using: ${GREEN}ssh $ssh_alias${NC}"
fi

# 7. Final summary
echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    🎉 Setup Complete! 🎉                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo
print_success "SSH key setup completed successfully!"
echo
echo -e "${YELLOW}📁 Key Files:${NC}"
echo -e "   Private key: ${CYAN}$KEY_PATH${NC}"
echo -e "   Public key:  ${CYAN}$KEY_PATH.pub${NC}"
echo
echo -e "${YELLOW}🔗 Connection Commands:${NC}"
echo -e "   Direct:      ${GREEN}ssh -i $KEY_PATH $EC2_USER@$EC2_HOST${NC}"
if [[ ! "$create_config" =~ ^[Nn]$ ]]; then
    echo -e "   Via config:  ${GREEN}ssh $ssh_alias${NC}"
fi
echo
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   • Keep your private key secure and never share it"
echo -e "   • The old PEM key is still valid if you need it"
echo -e "   • You can add this key to multiple EC2 instances"
echo -e "   • Use ${CYAN}ssh-add $KEY_PATH${NC} to add key to SSH agent"
echo

print_success "Happy coding! 🚀"
