#!/bin/bash

# Cursor Cloud Agent Configuration Verification Script
# Updated to work in Cloud Agent workspace (/workspace)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print status
print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $2"
        FAILED=$((FAILED + 1))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Determine workspace directory
WORKSPACE_DIR="/workspace"
if [ ! -d "$WORKSPACE_DIR" ]; then
    WORKSPACE_DIR="$(pwd)"
fi

ENV_JSON_PATH="$WORKSPACE_DIR/.cursor/environment.json"
if [ ! -f "$ENV_JSON_PATH" ]; then
    ENV_JSON_PATH="$HOME/.cursor/environment.json"
fi

echo "=========================================="
echo "Cursor Cloud Agent Configuration Verification"
echo "=========================================="
echo ""
print_info "Workspace: $WORKSPACE_DIR"
print_info "Checking: $ENV_JSON_PATH"
echo ""

echo "1. Checking environment.json file..."
echo "-----------------------------------"
if [ -f "$ENV_JSON_PATH" ]; then
    print_check 0 "environment.json file exists"
    
    # Validate JSON
    if python3 -m json.tool "$ENV_JSON_PATH" > /dev/null 2>&1; then
        print_check 0 "environment.json is valid JSON"
    else
        print_check 1 "environment.json is NOT valid JSON"
    fi
    
    # Check for required keys
    if grep -q "TAILSCALE_AUTH_KEY" "$ENV_JSON_PATH"; then
        print_check 0 "Tailscale auth key is configured"
    else
        print_check 1 "Tailscale auth key is MISSING"
    fi
    
    if grep -q "ControlMaster" "$ENV_JSON_PATH"; then
        print_check 0 "SSH ControlMaster (multiplexing) is configured"
    else
        print_check 1 "SSH ControlMaster is MISSING"
    fi
    
    if grep -q "rsync" "$ENV_JSON_PATH"; then
        print_check 0 "File sync (rsync) is configured"
    else
        print_check 1 "File sync (rsync) is MISSING"
    fi
    
    if grep -q "Dockerfile.dev" "$ENV_JSON_PATH"; then
        print_check 0 "Dockerfile.dev is configured"
    else
        print_check 1 "Dockerfile.dev is MISSING"
    fi
else
    print_check 1 "environment.json file does NOT exist at $ENV_JSON_PATH"
fi
echo ""

echo "2. Checking Tailscale installation and status..."
echo "------------------------------------------------"
if command -v tailscale > /dev/null 2>&1; then
    print_check 0 "Tailscale is installed"
    
    # Check Tailscale status
    if tailscale status > /dev/null 2>&1; then
        print_check 0 "Tailscale is running"
        
        # Get Tailscale IP
        TS_IP=$(tailscale ip -4 2>/dev/null | head -1)
        if [ -n "$TS_IP" ]; then
            print_info "Tailscale IP: $TS_IP"
            if [ "$TS_IP" = "100.121.114.88" ]; then
                print_check 0 "Tailscale IP matches expected (100.121.114.88)"
            else
                print_warning "Tailscale IP is different: $TS_IP (expected: 100.121.114.88)"
            fi
        else
            print_check 1 "Could not get Tailscale IP"
        fi
    else
        print_check 1 "Tailscale is NOT running"
    fi
else
    print_check 1 "Tailscale is NOT installed"
fi
echo ""

echo "3. Checking SSH configuration..."
echo "--------------------------------"
if [ -f ~/.ssh/config ]; then
    print_check 0 "SSH config file exists"
    
    if grep -q "ControlMaster" ~/.ssh/config; then
        print_check 0 "SSH ControlMaster is configured in config"
    else
        print_check 1 "SSH ControlMaster is NOT in config"
    fi
    
    if grep -q "ServerAliveInterval" ~/.ssh/config; then
        print_check 0 "SSH ServerAliveInterval is configured"
    else
        print_check 1 "SSH ServerAliveInterval is MISSING"
    fi
    
    if grep -q "TCPKeepAlive" ~/.ssh/config; then
        print_check 0 "SSH TCPKeepAlive is configured"
    else
        print_check 1 "SSH TCPKeepAlive is MISSING"
    fi
    
    if grep -q "tailscale" ~/.ssh/config; then
        print_check 0 "Tailscale host alias is configured"
    else
        print_check 1 "Tailscale host alias is MISSING"
    fi
else
    print_check 1 "SSH config file does NOT exist"
fi

# Check SSH control directory
if [ -d ~/.ssh/control ]; then
    print_check 0 "SSH control directory exists"
else
    print_warning "SSH control directory does not exist (will be created on first connection)"
fi
echo ""

echo "4. Checking SSH keys..."
echo "----------------------"
if [ -f ~/.ssh/id_ed25519 ]; then
    print_check 0 "SSH private key (id_ed25519) exists"
    
    # Check permissions
    PERMS=$(stat -c "%a" ~/.ssh/id_ed25519 2>/dev/null || stat -f "%OLp" ~/.ssh/id_ed25519 2>/dev/null || echo "unknown")
    if [ "$PERMS" = "600" ] || [ "$PERMS" = "0600" ]; then
        print_check 0 "SSH private key has correct permissions (600)"
    else
        print_warning "SSH private key permissions: $PERMS (should be 600)"
    fi
else
    print_check 1 "SSH private key (id_ed25519) does NOT exist"
fi

if [ -f ~/.ssh/id_ed25519.pub ]; then
    print_check 0 "SSH public key (id_ed25519.pub) exists"
    PUB_KEY=$(cat ~/.ssh/id_ed25519.pub)
    print_info "Public key: ${PUB_KEY:0:50}..."
else
    print_check 1 "SSH public key (id_ed25519.pub) does NOT exist"
fi

if [ -f ~/.ssh/authorized_keys ]; then
    print_check 0 "authorized_keys file exists"
    KEY_COUNT=$(wc -l < ~/.ssh/authorized_keys)
    print_info "Number of authorized keys: $KEY_COUNT"
    
    if grep -q "AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr" ~/.ssh/authorized_keys; then
        print_check 0 "Expected SSH key is in authorized_keys"
    else
        print_warning "Expected SSH key not found in authorized_keys"
    fi
else
    print_check 1 "authorized_keys file does NOT exist"
fi
echo ""

echo "5. Checking SSH service..."
echo "-------------------------"
if pgrep -x sshd > /dev/null 2>&1; then
    print_check 0 "SSH daemon (sshd) is running"
else
    print_check 1 "SSH daemon (sshd) is NOT running"
fi

# Check for defunct processes
DEFUNCT_COUNT=$(ps aux | grep "[s]shd.*defunct" | wc -l)
if [ "$DEFUNCT_COUNT" -gt 0 ]; then
    print_warning "Found $DEFUNCT_COUNT defunct SSH processes (cleanup should handle this)"
else
    print_check 0 "No defunct SSH processes found"
fi
echo ""

echo "6. Checking SSH connectivity..."
echo "-------------------------------"
# Test SSH connection via Tailscale
if ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no tailscale echo "SSH OK" > /dev/null 2>&1; then
    print_check 0 "SSH connection via Tailscale (tailscale host) works"
elif ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no ubuntu@100.121.114.88 echo "SSH OK" > /dev/null 2>&1; then
    print_check 0 "SSH connection via Tailscale IP (100.121.114.88) works"
else
    print_check 1 "SSH connection via Tailscale FAILED"
fi

# Test SSH connection via direct IP
if ssh -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no ubuntu@100.95.198.68 echo "SSH OK" > /dev/null 2>&1; then
    print_check 0 "SSH connection via direct IP (100.95.198.68) works"
else
    print_warning "SSH connection via direct IP (100.95.198.68) failed (may be expected if only Tailscale is available)"
fi
echo ""

echo "7. Checking keepalive processes..."
echo "----------------------------------"
# Check Tailscale keepalive
if pgrep -f "tailscale.*keepalive\|tailscale.*up" > /dev/null 2>&1; then
    print_check 0 "Tailscale keepalive process is running"
else
    print_warning "Tailscale keepalive process not found (may not be started yet)"
fi

# Check system keepalive
if pgrep -f "keep-awake\|prevent-sleep" > /dev/null 2>&1; then
    print_check 0 "System keepalive process is running"
else
    print_warning "System keepalive process not found (may not be started yet)"
fi

# Check network keepalive
if pgrep -f "network-keepalive\|ping.*100.121.114.88" > /dev/null 2>&1; then
    print_check 0 "Network keepalive process is running"
else
    print_warning "Network keepalive process not found (may not be started yet)"
fi

# Check SSH healthcheck
if pgrep -f "ssh-healthcheck\|ssh.*health" > /dev/null 2>&1; then
    print_check 0 "SSH healthcheck process is running"
else
    print_warning "SSH healthcheck process not found (may not be started yet)"
fi

# Check SSH cleanup
if pgrep -f "ssh-cleanup" > /dev/null 2>&1; then
    print_check 0 "SSH cleanup process is running"
else
    print_warning "SSH cleanup process not found (may not be started yet)"
fi

# Check rsync sync
if pgrep -f "rsync.*sync\|rsync-sync" > /dev/null 2>&1; then
    print_check 0 "File sync (rsync) process is running"
else
    print_warning "File sync (rsync) process not found (may not be started yet)"
fi
echo ""

echo "8. Checking log files..."
echo "------------------------"
LOG_FILES=(
    "/tmp/tailscale-keepalive.log"
    "/tmp/prevent-sleep.log"
    "/tmp/network-keepalive.log"
    "/tmp/ssh-healthcheck.log"
    "/tmp/ssh-cleanup.log"
    "/tmp/rsync-sync.log"
)

for LOG_FILE in "${LOG_FILES[@]}"; do
    if [ -f "$LOG_FILE" ]; then
        print_check 0 "Log file exists: $(basename $LOG_FILE)"
        SIZE=$(stat -c%s "$LOG_FILE" 2>/dev/null || stat -f%z "$LOG_FILE" 2>/dev/null || echo "0")
        if [ "$SIZE" -gt 0 ]; then
            print_info "  Size: $SIZE bytes"
            MODIFIED=$(stat -c "%y" "$LOG_FILE" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1 || stat -f "%Sm" "$LOG_FILE" 2>/dev/null || echo "unknown")
            print_info "  Last modified: $MODIFIED"
        else
            print_warning "  Log file is empty"
        fi
    else
        print_warning "Log file does not exist: $(basename $LOG_FILE) (will be created when process starts)"
    fi
done
echo ""

echo "9. Checking rsync installation..."
echo "---------------------------------"
if command -v rsync > /dev/null 2>&1; then
    print_check 0 "rsync is installed"
    RSYNC_VERSION=$(rsync --version | head -1)
    print_info "  $RSYNC_VERSION"
else
    print_check 1 "rsync is NOT installed"
fi
echo ""

echo "10. Checking environment variables..."
echo "-----------------------------------"
if [ -n "$TAILSCALE_AUTH_KEY" ]; then
    print_check 0 "TAILSCALE_AUTH_KEY environment variable is set"
else
    print_warning "TAILSCALE_AUTH_KEY environment variable is not set (may be in environment.json only)"
fi

if [ -n "$TAILSCALE_HOST" ]; then
    print_check 0 "TAILSCALE_HOST environment variable is set: $TAILSCALE_HOST"
else
    print_warning "TAILSCALE_HOST environment variable is not set"
fi

if [ -n "$SSH_HOST" ]; then
    print_check 0 "SSH_HOST environment variable is set: $SSH_HOST"
else
    print_warning "SSH_HOST environment variable is not set"
fi
echo ""

echo "11. Testing SSH connection multiplexing..."
echo "------------------------------------------"
# Try to create a control socket
TEST_HOST="tailscale"
if ssh -o ControlMaster=yes -o ControlPath=~/.ssh/control/test-%r@%h:%p -o ControlPersist=10m -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no "$TEST_HOST" echo "Multiplex test" > /dev/null 2>&1; then
    print_check 0 "SSH connection multiplexing works"
    
    # Check if control socket was created
    if ls ~/.ssh/control/test-* > /dev/null 2>&1; then
        print_check 0 "SSH control socket was created"
        # Clean up test socket
        rm -f ~/.ssh/control/test-* 2>/dev/null
    else
        print_warning "SSH control socket was not created (may be using existing connection)"
    fi
else
    print_warning "SSH connection multiplexing test failed (connection may not be available)"
fi
echo ""

echo "12. Checking system resources..."
echo "--------------------------------"
# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ -n "$DISK_USAGE" ] && [ "$DISK_USAGE" -lt 80 ]; then
    print_check 0 "Disk space is adequate (${DISK_USAGE}% used)"
else
    print_warning "Disk space check: ${DISK_USAGE}% used"
fi

# Check memory
if command -v free > /dev/null 2>&1; then
    MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}' 2>/dev/null || echo "unknown")
    if [ "$MEM_USAGE" != "unknown" ] && [ "$MEM_USAGE" -lt 80 ]; then
        print_check 0 "Memory usage is acceptable (${MEM_USAGE}% used)"
    else
        print_warning "Memory usage: ${MEM_USAGE}% used"
    fi
fi
echo ""

echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ All checks passed! Configuration is complete and working.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ Configuration is mostly correct, but there are some warnings.${NC}"
        echo -e "${YELLOW}  Some processes may not be running yet (they start when Cloud Agent runs).${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ Some checks failed. Please review the configuration.${NC}"
    exit 1
fi
