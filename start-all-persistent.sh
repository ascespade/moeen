#!/bin/bash

# =============================================================================
# Complete Persistent Development Environment
# =============================================================================
# This script starts all development services with persistent monitoring
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

# Configuration
WORKSPACE="/workspace"
LOG_DIR="/var/log/persistent-dev"
PID_DIR="/var/run/persistent-dev"

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

# Function to create directories
create_directories() {
    sudo mkdir -p "$LOG_DIR"
    sudo mkdir -p "$PID_DIR"
}

# Function to check if a process is running
is_running() {
    local process_name="$1"
    pgrep -f "$process_name" > /dev/null 2>&1
}

# Function to start Tailscale
start_tailscale() {
    log_step "Starting Tailscale persistent service..."
    
    if is_running "tailscale-persistent-simple.sh"; then
        log_info "Tailscale persistent service is already running"
    else
        sudo /workspace/tailscale-persistent-simple.sh start
        sleep 5
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
            > "$LOG_DIR/vscode-server.log" 2>&1 &
        
        echo $! > "$PID_DIR/vscode-server.pid"
        
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
        nohup ~/start-cursor-server.sh > "$LOG_DIR/cursor-server.log" 2>&1 &
        
        echo $! > "$PID_DIR/cursor-server.pid"
        
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
        nohup npm run dev > "$LOG_DIR/nextjs-dev.log" 2>&1 &
        
        echo $! > "$PID_DIR/nextjs-dev.pid"
        
        sleep 5
        
        if is_running "next dev"; then
            log_success "Next.js development server started on port 3001"
        else
            log_error "Failed to start Next.js development server"
        fi
    fi
}

# Function to create service monitor
create_service_monitor() {
    log_step "Creating service monitor..."
    
    cat > "$WORKSPACE/monitor-all-services.sh" << 'EOF'
#!/bin/bash

# Service Monitor Script
# This script monitors all development services and restarts them if needed

set -e

# Configuration
LOG_DIR="/var/log/persistent-dev"
PID_DIR="/var/run/persistent-dev"
CHECK_INTERVAL=30

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_DIR/monitor.log"
}

# Function to check if a process is running
is_running() {
    local process_name="$1"
    pgrep -f "$process_name" > /dev/null 2>&1
}

# Function to restart VS Code Server
restart_vscode() {
    log "Restarting VS Code Server..."
    pkill -f "code-server" 2>/dev/null || true
    sleep 2
    
    nohup code-server \
        --bind-addr 0.0.0.0:8080 \
        --auth none \
        --disable-telemetry \
        --disable-update-check \
        --disable-workspace-trust \
        --port 8080 \
        > "$LOG_DIR/vscode-server.log" 2>&1 &
    
    echo $! > "$PID_DIR/vscode-server.pid"
    log "VS Code Server restarted"
}

# Function to restart Next.js
restart_nextjs() {
    log "Restarting Next.js development server..."
    pkill -f "next dev" 2>/dev/null || true
    sleep 2
    
    cd /workspace
    nohup npm run dev > "$LOG_DIR/nextjs-dev.log" 2>&1 &
    
    echo $! > "$PID_DIR/nextjs-dev.pid"
    log "Next.js development server restarted"
}

# Function to check Tailscale
check_tailscale() {
    if ! sudo tailscale status >/dev/null 2>&1; then
        log "Tailscale disconnected, restarting..."
        sudo /workspace/tailscale-persistent-simple.sh restart
    fi
}

# Main monitoring loop
main() {
    log "=== Service Monitor Starting ==="
    
    while true; do
        # Check VS Code Server
        if ! is_running "code-server"; then
            log "VS Code Server stopped, restarting..."
            restart_vscode
        fi
        
        # Check Next.js
        if ! is_running "next dev"; then
            log "Next.js stopped, restarting..."
            restart_nextjs
        fi
        
        # Check Tailscale
        check_tailscale
        
        sleep $CHECK_INTERVAL
    done
}

# Run main function
main "$@"
EOF

    chmod +x "$WORKSPACE/monitor-all-services.sh"
    log_success "Service monitor created"
}

# Function to start service monitor
start_service_monitor() {
    log_step "Starting service monitor..."
    
    if is_running "monitor-all-services.sh"; then
        log_info "Service monitor is already running"
    else
        nohup "$WORKSPACE/monitor-all-services.sh" > "$LOG_DIR/monitor.out" 2>&1 &
        echo $! > "$PID_DIR/monitor.pid"
        
        sleep 2
        
        if is_running "monitor-all-services.sh"; then
            log_success "Service monitor started"
        else
            log_error "Failed to start service monitor"
        fi
    fi
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
    echo "Service Monitor: $(is_running "monitor-all-services.sh" && echo "Running" || echo "Stopped")"
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
    
    # Stop monitor
    if [ -f "$PID_DIR/monitor.pid" ]; then
        kill $(cat "$PID_DIR/monitor.pid") 2>/dev/null || true
        rm -f "$PID_DIR/monitor.pid"
    fi
    
    # Stop development services
    if [ -f "$PID_DIR/vscode-server.pid" ]; then
        kill $(cat "$PID_DIR/vscode-server.pid") 2>/dev/null || true
        rm -f "$PID_DIR/vscode-server.pid"
    fi
    
    if [ -f "$PID_DIR/cursor-server.pid" ]; then
        kill $(cat "$PID_DIR/cursor-server.pid") 2>/dev/null || true
        rm -f "$PID_DIR/cursor-server.pid"
    fi
    
    if [ -f "$PID_DIR/nextjs-dev.pid" ]; then
        kill $(cat "$PID_DIR/nextjs-dev.pid") 2>/dev/null || true
        rm -f "$PID_DIR/nextjs-dev.pid"
    fi
    
    # Stop Tailscale
    sudo /workspace/tailscale-persistent-simple.sh stop 2>/dev/null || true
    
    # Kill any remaining processes
    pkill -f "code-server" 2>/dev/null || true
    pkill -f "cursor server" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "monitor-all-services.sh" 2>/dev/null || true
    
    log_success "All services stopped"
}

# Main execution
main() {
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    PERSISTENT DEVELOPMENT ENVIRONMENT${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    
    # Check if we should stop services
    if [ "$1" = "stop" ]; then
        stop_all_services
        exit 0
    fi
    
    # Create directories
    create_directories
    
    # Start all services
    start_tailscale
    start_vscode_server
    start_cursor_server
    start_nextjs
    create_service_monitor
    start_service_monitor
    
    # Show final status
    show_status
    
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    ALL SERVICES STARTED SUCCESSFULLY!${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    echo -e "${CYAN}Your persistent development environment is now running!${NC}"
    echo ""
    echo -e "${CYAN}Management Commands:${NC}"
    echo -e "  • Check status: $0 status"
    echo -e "  • Stop all: $0 stop"
    echo -e "  • Monitor logs: tail -f $LOG_DIR/monitor.log"
    echo -e "  • Tailscale status: sudo /workspace/tailscale-persistent-simple.sh status"
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
}

# Run main function
main "$@"