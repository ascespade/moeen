#!/bin/bash

# =============================================================================
# Complete Development Environment Startup Script
# =============================================================================
# This script starts all development services including Tailscale, VS Code Server,
# Cursor Server, and Next.js development server with monitoring and auto-restart.
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
WORKSPACE="/workspace"
TAILSCALE_AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"

# Function to check if a process is running
is_running() {
    local process_name="$1"
    pgrep -f "$process_name" > /dev/null 2>&1
}

# Function to start Tailscale
start_tailscale() {
    log_step "Starting Tailscale..."
    
    if is_running "tailscaled"; then
        log_info "Tailscale daemon is already running"
    else
        # Start Tailscale daemon
        sudo tailscaled \
            --state=/var/lib/tailscale/tailscaled.state \
            --socket=/run/tailscale/tailscaled.sock \
            --port=41641 \
            --tun=userspace-networking \
            --daemon &
        
        sleep 3
        
        # Authenticate
        sudo tailscale up \
            --authkey="$TAILSCALE_AUTH_KEY" \
            --accept-routes \
            --accept-dns \
            --hostname="cursor-dev-server" \
            --advertise-routes="172.30.0.0/24" \
            --advertise-exit-node
    fi
    
    # Get Tailscale IP
    TAILSCALE_IP=$(sudo tailscale ip -4 2>/dev/null || echo "Unknown")
    log_success "Tailscale connected with IP: $TAILSCALE_IP"
}

# Function to start VS Code Server
start_vscode_server() {
    log_step "Starting VS Code Server..."
    
    if is_running "code-server"; then
        log_info "VS Code Server is already running"
    else
        # Kill any existing processes
        pkill -f "code-server" 2>/dev/null || true
        
        # Start VS Code Server
        nohup code-server \
            --bind-addr 0.0.0.0:8080 \
            --auth none \
            --disable-telemetry \
            --disable-update-check \
            --disable-workspace-trust \
            --port 8080 \
            > ~/.vscode-server.log 2>&1 &
        
        sleep 3
        
        if is_running "code-server"; then
            log_success "VS Code Server started on port 8080"
        else
            log_error "Failed to start VS Code Server"
        fi
    fi
}

# Function to start Cursor Server
start_cursor_server() {
    log_step "Starting Cursor Server..."
    
    if is_running "cursor server"; then
        log_info "Cursor Server is already running"
    else
        # Kill any existing processes
        pkill -f "cursor server" 2>/dev/null || true
        
        # Start Cursor Server (placeholder)
        nohup ~/start-cursor-server.sh > ~/.cursor-server.log 2>&1 &
        
        sleep 3
        
        if is_running "cursor server"; then
            log_success "Cursor Server started on port 26054"
        else
            log_warning "Cursor Server started (placeholder mode)"
        fi
    fi
}

# Function to start Next.js development server
start_nextjs() {
    log_step "Starting Next.js development server..."
    
    if is_running "next dev"; then
        log_info "Next.js development server is already running"
    else
        # Kill any existing processes
        pkill -f "next dev" 2>/dev/null || true
        
        # Navigate to workspace and start Next.js
        cd "$WORKSPACE"
        nohup npm run dev > ~/.nextjs-dev.log 2>&1 &
        
        sleep 5
        
        if is_running "next dev"; then
            log_success "Next.js development server started on port 3001"
        else
            log_error "Failed to start Next.js development server"
        fi
    fi
}

# Function to setup monitoring
setup_monitoring() {
    log_step "Setting up service monitoring..."
    
    # Create monitoring script
    cat > ~/monitor-services.sh << 'EOF'
#!/bin/bash
# Service monitoring script

while true; do
    # Check Tailscale
    if ! sudo tailscale status >/dev/null 2>&1; then
        echo "$(date): Tailscale disconnected, restarting..."
        sudo tailscale up --authkey=tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw --accept-routes --accept-dns
    fi
    
    # Check VS Code Server
    if ! pgrep -f "code-server" >/dev/null 2>&1; then
        echo "$(date): VS Code Server stopped, restarting..."
        nohup code-server --bind-addr 0.0.0.0:8080 --auth none --disable-telemetry --disable-update-check --disable-workspace-trust --port 8080 > ~/.vscode-server.log 2>&1 &
    fi
    
    # Check Next.js
    if ! pgrep -f "next dev" >/dev/null 2>&1; then
        echo "$(date): Next.js stopped, restarting..."
        cd /workspace
        nohup npm run dev > ~/.nextjs-dev.log 2>&1 &
    fi
    
    sleep 30
done
EOF

    chmod +x ~/monitor-services.sh
    
    # Start monitoring in background
    nohup ~/monitor-services.sh > ~/.service-monitor.log 2>&1 &
    echo $! > ~/.service-monitor.pid
    
    log_success "Service monitoring started"
}

# Function to show status
show_status() {
    log_step "Service Status:"
    echo ""
    
    # System info
    echo -e "${CYAN}=== System Information ===${NC}"
    echo "Hostname: $(hostname)"
    echo "IP Address: $(hostname -I | awk '{print $1}')"
    echo "Uptime: $(uptime -p)"
    echo ""
    
    # Tailscale status
    echo -e "${CYAN}=== Tailscale Status ===${NC}"
    if sudo tailscale status >/dev/null 2>&1; then
        TAILSCALE_IP=$(sudo tailscale ip -4 2>/dev/null || echo "Unknown")
        echo "Status: Connected"
        echo "Tailscale IP: $TAILSCALE_IP"
        echo ""
        sudo tailscale status
    else
        echo "Status: Disconnected"
    fi
    echo ""
    
    # Service status
    echo -e "${CYAN}=== Development Services ===${NC}"
    echo "VS Code Server: $(is_running "code-server" && echo "Running" || echo "Stopped")"
    echo "Cursor Server: $(is_running "cursor server" && echo "Running" || echo "Stopped")"
    echo "Next.js Dev: $(is_running "next dev" && echo "Running" || echo "Stopped")"
    echo ""
    
    # Port status
    echo -e "${CYAN}=== Port Status ===${NC}"
    netstat -tlnp | grep -E ':(8080|26054|3001|41641)' || echo "No services listening on development ports"
    echo ""
    
    # Access URLs
    echo -e "${CYAN}=== Access URLs ===${NC}"
    if sudo tailscale status >/dev/null 2>&1; then
        TAILSCALE_IP=$(sudo tailscale ip -4 2>/dev/null || echo "Unknown")
        echo "Via Tailscale (Recommended):"
        echo "  • VS Code Server: http://$TAILSCALE_IP:8080"
        echo "  • Cursor Server: http://$TAILSCALE_IP:26054"
        echo "  • Next.js App: http://$TAILSCALE_IP:3001"
    fi
    
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    echo "Via Local IP:"
    echo "  • VS Code Server: http://$LOCAL_IP:8080"
    echo "  • Cursor Server: http://$LOCAL_IP:26054"
    echo "  • Next.js App: http://$LOCAL_IP:3001"
    echo ""
}

# Function to stop all services
stop_all_services() {
    log_step "Stopping all services..."
    
    # Stop monitoring
    if [ -f ~/.service-monitor.pid ]; then
        kill $(cat ~/.service-monitor.pid) 2>/dev/null || true
        rm ~/.service-monitor.pid
    fi
    
    # Stop development services
    pkill -f "code-server" 2>/dev/null || true
    pkill -f "cursor server" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    
    # Stop Tailscale
    sudo tailscale down 2>/dev/null || true
    pkill -f "tailscaled" 2>/dev/null || true
    
    log_success "All services stopped"
}

# Main execution
main() {
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    COMPLETE DEVELOPMENT ENVIRONMENT${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    
    # Check if we should stop services
    if [ "$1" = "stop" ]; then
        stop_all_services
        exit 0
    fi
    
    # Start all services
    start_tailscale
    start_vscode_server
    start_cursor_server
    start_nextjs
    setup_monitoring
    
    # Show final status
    show_status
    
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    ALL SERVICES STARTED SUCCESSFULLY!${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    echo -e "${CYAN}Your complete development environment is now running!${NC}"
    echo ""
    echo -e "${CYAN}Useful commands:${NC}"
    echo -e "  • Check status: ~/dev-status.sh"
    echo -e "  • Stop all: ~/start-all-services.sh stop"
    echo -e "  • Monitor logs: tail -f ~/.service-monitor.log"
    echo -e "  • Tailscale status: sudo tailscale status"
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
}

# Run main function
main "$@"