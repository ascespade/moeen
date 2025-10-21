#!/bin/bash

# =============================================================================
# Tailscale Persistent Service Setup
# =============================================================================
# This script sets up Tailscale as a persistent service that automatically
# restarts and maintains connection to ensure it never goes offline.
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
TAILSCALE_AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
SERVICE_NAME="tailscale-persistent"
SERVICE_USER="root"
WORK_DIR="/opt/tailscale-persistent"
LOG_DIR="/var/log/tailscale-persistent"

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
    log_step "Creating necessary directories..."
    
    sudo mkdir -p "$WORK_DIR"
    sudo mkdir -p "$LOG_DIR"
    sudo mkdir -p "/var/lib/tailscale"
    sudo mkdir -p "/run/tailscale"
    
    log_success "Directories created"
}

# Function to create Tailscale startup script
create_startup_script() {
    log_step "Creating Tailscale startup script..."
    
    sudo tee "$WORK_DIR/start-tailscale.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Persistent Startup Script
# This script ensures Tailscale is always running and connected

set -e

# Configuration
AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
STATE_DIR="/var/lib/tailscale"
SOCKET="/run/tailscale/tailscaled.sock"
PORT="41641"
PID_FILE="/var/run/tailscaled.pid"
LOG_FILE="/var/log/tailscale-persistent/tailscale.log"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check if Tailscale daemon is running
is_tailscaled_running() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat $PID_FILE)" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check if Tailscale is authenticated
is_tailscale_authenticated() {
    if tailscale status >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start Tailscale daemon
start_tailscaled() {
    log "Starting Tailscale daemon..."
    
    # Kill any existing processes
    pkill -f "tailscaled" 2>/dev/null || true
    sleep 2
    
    # Start Tailscale daemon
    tailscaled \
        --state="$STATE_DIR/tailscaled.state" \
        --socket="$SOCKET" \
        --port="$PORT" \
        --tun=userspace-networking \
        --pidfile="$PID_FILE" \
        --daemon \
        >> "$LOG_FILE" 2>&1
    
    # Wait for daemon to start
    sleep 5
    
    if is_tailscaled_running; then
        log "Tailscale daemon started successfully"
        return 0
    else
        log "ERROR: Failed to start Tailscale daemon"
        return 1
    fi
}

# Function to authenticate with Tailscale
authenticate_tailscale() {
    log "Authenticating with Tailscale..."
    
    # Wait for daemon to be ready
    local retries=0
    while [ $retries -lt 10 ]; do
        if tailscale status >/dev/null 2>&1; then
            log "Already authenticated with Tailscale"
            return 0
        fi
        
        # Try to authenticate
        if tailscale up \
            --authkey="$AUTH_KEY" \
            --accept-routes \
            --accept-dns \
            --hostname="cursor-dev-server" \
            --advertise-routes="172.30.0.0/24" \
            --advertise-exit-node \
            >> "$LOG_FILE" 2>&1; then
            log "Successfully authenticated with Tailscale"
            return 0
        fi
        
        log "Authentication attempt $((retries + 1)) failed, retrying..."
        sleep 5
        retries=$((retries + 1))
    done
    
    log "ERROR: Failed to authenticate with Tailscale after 10 attempts"
    return 1
}

# Function to get Tailscale status
get_status() {
    if is_tailscale_authenticated; then
        local ip=$(tailscale ip -4 2>/dev/null || echo "Unknown")
        log "Tailscale Status: Connected (IP: $ip)"
        return 0
    else
        log "Tailscale Status: Disconnected"
        return 1
    fi
}

# Main execution
main() {
    log "=== Tailscale Persistent Service Starting ==="
    
    # Start daemon if not running
    if ! is_tailscaled_running; then
        start_tailscaled
    else
        log "Tailscale daemon is already running"
    fi
    
    # Authenticate if not authenticated
    if ! is_tailscale_authenticated; then
        authenticate_tailscale
    else
        log "Already authenticated with Tailscale"
    fi
    
    # Get final status
    get_status
    
    log "=== Tailscale Persistent Service Ready ==="
}

# Run main function
main "$@"
EOF

    sudo chmod +x "$WORK_DIR/start-tailscale.sh"
    log_success "Startup script created"
}

# Function to create monitoring script
create_monitoring_script() {
    log_step "Creating monitoring script..."
    
    sudo tee "$WORK_DIR/monitor-tailscale.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Monitoring Script
# This script continuously monitors Tailscale and restarts if needed

set -e

# Configuration
AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
LOG_FILE="/var/log/tailscale-persistent/monitor.log"
CHECK_INTERVAL=30
MAX_RETRIES=3

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check Tailscale status
check_tailscale() {
    if tailscale status >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to restart Tailscale
restart_tailscale() {
    log "Restarting Tailscale..."
    
    # Stop Tailscale
    tailscale down 2>/dev/null || true
    pkill -f "tailscaled" 2>/dev/null || true
    sleep 5
    
    # Start Tailscale daemon
    tailscaled \
        --state=/var/lib/tailscale/tailscaled.state \
        --socket=/run/tailscale/tailscaled.sock \
        --port=41641 \
        --tun=userspace-networking \
        --daemon \
        >> "$LOG_FILE" 2>&1
    
    sleep 5
    
    # Authenticate
    tailscale up \
        --authkey="$AUTH_KEY" \
        --accept-routes \
        --accept-dns \
        --hostname="cursor-dev-server" \
        --advertise-routes="172.30.0.0/24" \
        --advertise-exit-node \
        >> "$LOG_FILE" 2>&1
    
    sleep 5
}

# Function to get Tailscale IP
get_tailscale_ip() {
    tailscale ip -4 2>/dev/null || echo "Unknown"
}

# Main monitoring loop
main() {
    log "=== Tailscale Monitor Starting ==="
    
    local consecutive_failures=0
    
    while true; do
        if check_tailscale; then
            if [ $consecutive_failures -gt 0 ]; then
                log "Tailscale reconnected successfully"
                consecutive_failures=0
            fi
            
            local ip=$(get_tailscale_ip)
            log "Tailscale Status: Connected (IP: $ip)"
        else
            consecutive_failures=$((consecutive_failures + 1))
            log "Tailscale disconnected (failure #$consecutive_failures)"
            
            if [ $consecutive_failures -ge $MAX_RETRIES ]; then
                log "Maximum retries reached, restarting Tailscale..."
                restart_tailscale
                consecutive_failures=0
            fi
        fi
        
        sleep $CHECK_INTERVAL
    done
}

# Run main function
main "$@"
EOF

    sudo chmod +x "$WORK_DIR/monitor-tailscale.sh"
    log_success "Monitoring script created"
}

# Function to create systemd service
create_systemd_service() {
    log_step "Creating systemd service..."
    
    sudo tee "/etc/systemd/system/$SERVICE_NAME.service" > /dev/null << EOF
[Unit]
Description=Tailscale Persistent Service
After=network.target
Wants=network.target

[Service]
Type=forking
User=$SERVICE_USER
WorkingDirectory=$WORK_DIR
ExecStart=$WORK_DIR/start-tailscale.sh
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10
TimeoutStartSec=60
TimeoutStopSec=30
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$WORK_DIR $LOG_DIR /var/lib/tailscale /run/tailscale

[Install]
WantedBy=multi-user.target
EOF

    log_success "Systemd service created"
}

# Function to create monitoring service
create_monitoring_service() {
    log_step "Creating monitoring service..."
    
    sudo tee "/etc/systemd/system/tailscale-monitor.service" > /dev/null << EOF
[Unit]
Description=Tailscale Monitor Service
After=$SERVICE_NAME.service
Wants=$SERVICE_NAME.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$WORK_DIR
ExecStart=$WORK_DIR/monitor-tailscale.sh
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=tailscale-monitor

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$WORK_DIR $LOG_DIR /var/lib/tailscale /run/tailscale

[Install]
WantedBy=multi-user.target
EOF

    log_success "Monitoring service created"
}

# Function to create management scripts
create_management_scripts() {
    log_step "Creating management scripts..."
    
    # Start script
    sudo tee "$WORK_DIR/start-service.sh" > /dev/null << 'EOF'
#!/bin/bash
# Start Tailscale persistent service

echo "Starting Tailscale persistent service..."
sudo systemctl start tailscale-persistent
sudo systemctl start tailscale-monitor
echo "Service started!"
EOF

    # Stop script
    sudo tee "$WORK_DIR/stop-service.sh" > /dev/null << 'EOF'
#!/bin/bash
# Stop Tailscale persistent service

echo "Stopping Tailscale persistent service..."
sudo systemctl stop tailscale-monitor
sudo systemctl stop tailscale-persistent
echo "Service stopped!"
EOF

    # Status script
    sudo tee "$WORK_DIR/status-service.sh" > /dev/null << 'EOF'
#!/bin/bash
# Check Tailscale persistent service status

echo "=== Tailscale Persistent Service Status ==="
echo ""
echo "Service Status:"
sudo systemctl status tailscale-persistent --no-pager
echo ""
echo "Monitor Status:"
sudo systemctl status tailscale-monitor --no-pager
echo ""
echo "Tailscale Status:"
sudo tailscale status
echo ""
echo "Tailscale IP:"
sudo tailscale ip -4
echo ""
echo "Recent Logs:"
sudo journalctl -u tailscale-persistent -n 10 --no-pager
EOF

    # Restart script
    sudo tee "$WORK_DIR/restart-service.sh" > /dev/null << 'EOF'
#!/bin/bash
# Restart Tailscale persistent service

echo "Restarting Tailscale persistent service..."
sudo systemctl restart tailscale-persistent
sudo systemctl restart tailscale-monitor
echo "Service restarted!"
EOF

    sudo chmod +x "$WORK_DIR"/*.sh
    log_success "Management scripts created"
}

# Function to enable and start services
enable_services() {
    log_step "Enabling and starting services..."
    
    # Reload systemd
    sudo systemctl daemon-reload
    
    # Enable services
    sudo systemctl enable "$SERVICE_NAME.service"
    sudo systemctl enable "tailscale-monitor.service"
    
    # Start services
    sudo systemctl start "$SERVICE_NAME.service"
    sudo systemctl start "tailscale-monitor.service"
    
    log_success "Services enabled and started"
}

# Function to create symlinks for easy access
create_symlinks() {
    log_step "Creating symlinks for easy access..."
    
    sudo ln -sf "$WORK_DIR/start-service.sh" /usr/local/bin/tailscale-start
    sudo ln -sf "$WORK_DIR/stop-service.sh" /usr/local/bin/tailscale-stop
    sudo ln -sf "$WORK_DIR/status-service.sh" /usr/local/bin/tailscale-status
    sudo ln -sf "$WORK_DIR/restart-service.sh" /usr/local/bin/tailscale-restart
    
    log_success "Symlinks created"
}

# Function to test the setup
test_setup() {
    log_step "Testing Tailscale setup..."
    
    sleep 10
    
    if tailscale status >/dev/null 2>&1; then
        local ip=$(tailscale ip -4 2>/dev/null || echo "Unknown")
        log_success "Tailscale is connected with IP: $ip"
        
        echo ""
        echo -e "${CYAN}=== Tailscale Network Status ===${NC}"
        tailscale status
        echo ""
        
        return 0
    else
        log_error "Tailscale is not connected"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    TAILSCALE PERSISTENT SERVICE SETUP${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run with sudo privileges"
        exit 1
    fi
    
    # Execute setup steps
    create_directories
    create_startup_script
    create_monitoring_script
    create_systemd_service
    create_monitoring_service
    create_management_scripts
    enable_services
    create_symlinks
    test_setup
    
    # Final status
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
    echo -e "${GREEN}                    TAILSCALE PERSISTENT SERVICE READY!${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    echo -e "${CYAN}Your Tailscale service is now persistent and will auto-restart!${NC}"
    echo ""
    echo -e "${CYAN}Management Commands:${NC}"
    echo -e "  • Start: tailscale-start"
    echo -e "  • Stop: tailscale-stop"
    echo -e "  • Status: tailscale-status"
    echo -e "  • Restart: tailscale-restart"
    echo ""
    echo -e "${CYAN}Log Files:${NC}"
    echo -e "  • Service Logs: $LOG_DIR/tailscale.log"
    echo -e "  • Monitor Logs: $LOG_DIR/monitor.log"
    echo -e "  • System Logs: journalctl -u tailscale-persistent"
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
}

# Run main function
main "$@"