#!/bin/bash

# =============================================================================
# Tailscale Startup Script
# =============================================================================
# This script ensures Tailscale is always running and connected to your network
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Configuration
TAILSCALE_AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
TAILSCALE_STATE_DIR="/var/lib/tailscale"
TAILSCALE_SOCKET="/run/tailscale/tailscaled.sock"
TAILSCALE_PORT="41641"
PID_FILE="/var/run/tailscaled.pid"

# Function to check if Tailscale daemon is running
check_tailscaled() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat $PID_FILE)" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to start Tailscale daemon
start_tailscaled() {
    log_step "Starting Tailscale daemon..."
    
    # Create necessary directories
    sudo mkdir -p "$TAILSCALE_STATE_DIR"
    sudo mkdir -p "$(dirname $TAILSCALE_SOCKET)"
    sudo mkdir -p "$(dirname $PID_FILE)"
    
    # Start Tailscale daemon in userspace networking mode
    sudo tailscaled \
        --state="$TAILSCALE_STATE_DIR/tailscaled.state" \
        --socket="$TAILSCALE_SOCKET" \
        --port="$TAILSCALE_PORT" \
        --tun=userspace-networking \
        --pidfile="$PID_FILE" \
        --daemon
    
    # Wait for daemon to start
    sleep 3
    
    if check_tailscaled; then
        log_success "Tailscale daemon started successfully"
        return 0
    else
        log_error "Failed to start Tailscale daemon"
        return 1
    fi
}

# Function to authenticate with Tailscale
authenticate_tailscale() {
    log_step "Authenticating with Tailscale..."
    
    # Check if already authenticated
    if sudo tailscale status >/dev/null 2>&1; then
        log_info "Already authenticated with Tailscale"
        return 0
    fi
    
    # Authenticate with auth key
    if sudo tailscale up \
        --authkey="$TAILSCALE_AUTH_KEY" \
        --accept-routes \
        --accept-dns \
        --hostname="cursor-dev-server" \
        --advertise-routes="172.30.0.0/24" \
        --advertise-exit-node; then
        log_success "Successfully authenticated with Tailscale"
        return 0
    else
        log_error "Failed to authenticate with Tailscale"
        return 1
    fi
}

# Function to check Tailscale connection
check_tailscale_connection() {
    log_step "Checking Tailscale connection..."
    
    if sudo tailscale status >/dev/null 2>&1; then
        log_success "Tailscale is connected"
        
        # Get Tailscale IP
        TAILSCALE_IP=$(sudo tailscale ip -4 2>/dev/null || echo "Unknown")
        log_info "Tailscale IP: $TAILSCALE_IP"
        
        # Show network status
        echo ""
        echo -e "${CYAN}=== Tailscale Network Status ===${NC}"
        sudo tailscale status
        echo ""
        
        return 0
    else
        log_error "Tailscale is not connected"
        return 1
    fi
}

# Function to setup monitoring
setup_monitoring() {
    log_step "Setting up Tailscale monitoring..."
    
    # Create monitoring script
    cat > ~/monitor-tailscale.sh << 'EOF'
#!/bin/bash
# Tailscale monitoring script

while true; do
    if ! sudo tailscale status >/dev/null 2>&1; then
        echo "$(date): Tailscale disconnected, attempting to reconnect..."
        ~/start-tailscale.sh
    fi
    sleep 30
done
EOF

    chmod +x ~/monitor-tailscale.sh
    
    # Start monitoring in background
    nohup ~/monitor-tailscale.sh > ~/.tailscale-monitor.log 2>&1 &
    echo $! > ~/.tailscale-monitor.pid
    
    log_success "Tailscale monitoring started"
}

# Function to create systemd service (for non-container environments)
create_systemd_service() {
    log_step "Creating systemd service for Tailscale..."
    
    sudo tee /etc/systemd/system/tailscale-custom.service > /dev/null << EOF
[Unit]
Description=Tailscale Custom Service
After=network.target

[Service]
Type=forking
User=root
ExecStart=$HOME/start-tailscale.sh
Restart=always
RestartSec=10
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF

    # Try to enable service (will fail in container, that's ok)
    sudo systemctl daemon-reload 2>/dev/null || true
    sudo systemctl enable tailscale-custom.service 2>/dev/null || true
    
    log_success "Systemd service created"
}

# Main execution
main() {
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    TAILSCALE STARTUP SCRIPT${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    
    # Check if running as root or with sudo
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run with sudo privileges"
        exit 1
    fi
    
    # Start Tailscale daemon if not running
    if ! check_tailscaled; then
        start_tailscaled
    else
        log_info "Tailscale daemon is already running"
    fi
    
    # Authenticate with Tailscale
    authenticate_tailscale
    
    # Check connection
    check_tailscale_connection
    
    # Setup monitoring
    setup_monitoring
    
    # Create systemd service
    create_systemd_service
    
    # Final status
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    TAILSCALE SETUP COMPLETE!${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    echo -e "${CYAN}Your server is now connected to your Tailscale network!${NC}"
    echo ""
    echo -e "${CYAN}Access your development services via Tailscale:${NC}"
    echo -e "  • VS Code Server: http://$(sudo tailscale ip -4):8080"
    echo -e "  • Cursor Server: http://$(sudo tailscale ip -4):26054"
    echo -e "  • Next.js App: http://$(sudo tailscale ip -4):3001"
    echo ""
    echo -e "${CYAN}Useful commands:${NC}"
    echo -e "  • Check status: sudo tailscale status"
    echo -e "  • Get IP: sudo tailscale ip -4"
    echo -e "  • Restart: ~/start-tailscale.sh"
    echo -e "  • Monitor logs: tail -f ~/.tailscale-monitor.log"
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
}

# Run main function
main "$@"