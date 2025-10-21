#!/bin/bash

# =============================================================================
# Tailscale Container Persistent Service Setup
# =============================================================================
# This script sets up Tailscale as a persistent service in a container environment
# that automatically restarts and maintains connection to ensure it never goes offline.
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
WORK_DIR="/opt/tailscale-persistent"
LOG_DIR="/var/log/tailscale-persistent"
PID_DIR="/var/run/tailscale-persistent"

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
    sudo mkdir -p "$PID_DIR"
    sudo mkdir -p "/var/lib/tailscale"
    sudo mkdir -p "/run/tailscale"
    
    log_success "Directories created"
}

# Function to create Tailscale daemon script
create_daemon_script() {
    log_step "Creating Tailscale daemon script..."
    
    sudo tee "$WORK_DIR/tailscale-daemon.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Daemon Script
# This script runs Tailscale daemon with auto-restart

set -e

# Configuration
AUTH_KEY="tskey-auth-kFEtPR39ny11CNTRL-AduuSw1cQM4THVQgka5qM44YrADhn8Dw"
STATE_DIR="/var/lib/tailscale"
SOCKET="/run/tailscale/tailscaled.sock"
PORT="41641"
PID_FILE="/var/run/tailscale-persistent/tailscaled.pid"
LOG_FILE="/var/log/tailscale-persistent/daemon.log"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to start Tailscale daemon
start_daemon() {
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
    
    if [ -f "$PID_FILE" ] && kill -0 "$(cat $PID_FILE)" 2>/dev/null; then
        log "Tailscale daemon started successfully (PID: $(cat $PID_FILE))"
        return 0
    else
        log "ERROR: Failed to start Tailscale daemon"
        return 1
    fi
}

# Function to authenticate with Tailscale
authenticate() {
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
    if tailscale status >/dev/null 2>&1; then
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
    log "=== Tailscale Daemon Starting ==="
    
    # Start daemon
    start_daemon
    
    # Authenticate
    authenticate
    
    # Get status
    get_status
    
    log "=== Tailscale Daemon Ready ==="
    
    # Keep daemon running
    while true; do
        if [ -f "$PID_FILE" ] && kill -0 "$(cat $PID_FILE)" 2>/dev/null; then
            sleep 30
        else
            log "Daemon process died, restarting..."
            start_daemon
            authenticate
        fi
    done
}

# Run main function
main "$@"
EOF

    sudo chmod +x "$WORK_DIR/tailscale-daemon.sh"
    log_success "Daemon script created"
}

# Function to create monitoring script
create_monitoring_script() {
    log_step "Creating monitoring script..."
    
    sudo tee "$WORK_DIR/tailscale-monitor.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Monitor Script
# This script continuously monitors Tailscale connection and restarts if needed

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

    sudo chmod +x "$WORK_DIR/tailscale-monitor.sh"
    log_success "Monitoring script created"
}

# Function to create startup script
create_startup_script() {
    log_step "Creating startup script..."
    
    sudo tee "$WORK_DIR/start-tailscale.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Startup Script
# This script starts both daemon and monitor

set -e

# Configuration
WORK_DIR="/opt/tailscale-persistent"
LOG_DIR="/var/log/tailscale-persistent"
PID_DIR="/var/run/tailscale-persistent"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to start daemon
start_daemon() {
    log "Starting Tailscale daemon..."
    
    # Kill any existing processes
    pkill -f "tailscale-daemon.sh" 2>/dev/null || true
    pkill -f "tailscale-monitor.sh" 2>/dev/null || true
    sleep 2
    
    # Start daemon in background
    nohup "$WORK_DIR/tailscale-daemon.sh" > "$LOG_DIR/daemon.out" 2>&1 &
    echo $! > "$PID_DIR/daemon.pid"
    
    sleep 5
    
    if [ -f "$PID_DIR/daemon.pid" ] && kill -0 "$(cat $PID_DIR/daemon.pid)" 2>/dev/null; then
        log "Daemon started successfully (PID: $(cat $PID_DIR/daemon.pid))"
        return 0
    else
        log "ERROR: Failed to start daemon"
        return 1
    fi
}

# Function to start monitor
start_monitor() {
    log "Starting Tailscale monitor..."
    
    # Start monitor in background
    nohup "$WORK_DIR/tailscale-monitor.sh" > "$LOG_DIR/monitor.out" 2>&1 &
    echo $! > "$PID_DIR/monitor.pid"
    
    sleep 2
    
    if [ -f "$PID_DIR/monitor.pid" ] && kill -0 "$(cat $PID_DIR/monitor.pid)" 2>/dev/null; then
        log "Monitor started successfully (PID: $(cat $PID_DIR/monitor.pid))"
        return 0
    else
        log "ERROR: Failed to start monitor"
        return 1
    fi
}

# Function to check status
check_status() {
    log "Checking Tailscale status..."
    
    if tailscale status >/dev/null 2>&1; then
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
    log "=== Starting Tailscale Persistent Service ==="
    
    # Start daemon
    start_daemon
    
    # Start monitor
    start_monitor
    
    # Check status
    check_status
    
    log "=== Tailscale Persistent Service Started ==="
}

# Run main function
main "$@"
EOF

    sudo chmod +x "$WORK_DIR/start-tailscale.sh"
    log_success "Startup script created"
}

# Function to create management scripts
create_management_scripts() {
    log_step "Creating management scripts..."
    
    # Stop script
    sudo tee "$WORK_DIR/stop-tailscale.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Stop Script
# This script stops all Tailscale processes

set -e

# Configuration
PID_DIR="/var/run/tailscale-persistent"
LOG_DIR="/var/log/tailscale-persistent"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to stop processes
stop_processes() {
    log "Stopping Tailscale processes..."
    
    # Stop monitor
    if [ -f "$PID_DIR/monitor.pid" ]; then
        local monitor_pid=$(cat "$PID_DIR/monitor.pid")
        if kill -0 "$monitor_pid" 2>/dev/null; then
            kill "$monitor_pid"
            log "Monitor stopped (PID: $monitor_pid)"
        fi
        rm -f "$PID_DIR/monitor.pid"
    fi
    
    # Stop daemon
    if [ -f "$PID_DIR/daemon.pid" ]; then
        local daemon_pid=$(cat "$PID_DIR/daemon.pid")
        if kill -0 "$daemon_pid" 2>/dev/null; then
            kill "$daemon_pid"
            log "Daemon stopped (PID: $daemon_pid)"
        fi
        rm -f "$PID_DIR/daemon.pid"
    fi
    
    # Stop all Tailscale processes
    pkill -f "tailscale" 2>/dev/null || true
    
    log "All Tailscale processes stopped"
}

# Main execution
main() {
    log "=== Stopping Tailscale Persistent Service ==="
    stop_processes
    log "=== Tailscale Persistent Service Stopped ==="
}

# Run main function
main "$@"
EOF

    # Status script
    sudo tee "$WORK_DIR/status-tailscale.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Status Script
# This script shows the status of all Tailscale processes

set -e

# Configuration
PID_DIR="/var/run/tailscale-persistent"
LOG_DIR="/var/log/tailscale-persistent"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to check process status
check_process() {
    local name="$1"
    local pid_file="$2"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "✅ $name: Running (PID: $pid)"
            return 0
        else
            echo "❌ $name: Stopped (stale PID file)"
            return 1
        fi
    else
        echo "❌ $name: Not running (no PID file)"
        return 1
    fi
}

# Function to show Tailscale status
show_tailscale_status() {
    echo ""
    echo "=== Tailscale Network Status ==="
    if tailscale status >/dev/null 2>&1; then
        local ip=$(tailscale ip -4 2>/dev/null || echo "Unknown")
        echo "✅ Connected (IP: $ip)"
        echo ""
        tailscale status
    else
        echo "❌ Disconnected"
    fi
    echo ""
}

# Function to show logs
show_logs() {
    echo "=== Recent Logs ==="
    echo ""
    echo "--- Daemon Logs (last 10 lines) ---"
    tail -n 10 "$LOG_DIR/daemon.log" 2>/dev/null || echo "No daemon logs found"
    echo ""
    echo "--- Monitor Logs (last 10 lines) ---"
    tail -n 10 "$LOG_DIR/monitor.log" 2>/dev/null || echo "No monitor logs found"
    echo ""
}

# Main execution
main() {
    log "=== Tailscale Persistent Service Status ==="
    echo ""
    
    # Check processes
    echo "=== Process Status ==="
    check_process "Daemon" "$PID_DIR/daemon.pid"
    check_process "Monitor" "$PID_DIR/monitor.pid"
    
    # Show Tailscale status
    show_tailscale_status
    
    # Show logs
    show_logs
}

# Run main function
main "$@"
EOF

    # Restart script
    sudo tee "$WORK_DIR/restart-tailscale.sh" > /dev/null << 'EOF'
#!/bin/bash

# Tailscale Restart Script
# This script restarts all Tailscale processes

set -e

# Configuration
WORK_DIR="/opt/tailscale-persistent"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Main execution
main() {
    log "=== Restarting Tailscale Persistent Service ==="
    
    # Stop all processes
    "$WORK_DIR/stop-tailscale.sh"
    
    # Wait a bit
    sleep 3
    
    # Start all processes
    "$WORK_DIR/start-tailscale.sh"
    
    log "=== Tailscale Persistent Service Restarted ==="
}

# Run main function
main "$@"
EOF

    sudo chmod +x "$WORK_DIR"/*.sh
    log_success "Management scripts created"
}

# Function to create symlinks for easy access
create_symlinks() {
    log_step "Creating symlinks for easy access..."
    
    sudo ln -sf "$WORK_DIR/start-tailscale.sh" /usr/local/bin/tailscale-start
    sudo ln -sf "$WORK_DIR/stop-tailscale.sh" /usr/local/bin/tailscale-stop
    sudo ln -sf "$WORK_DIR/status-tailscale.sh" /usr/local/bin/tailscale-status
    sudo ln -sf "$WORK_DIR/restart-tailscale.sh" /usr/local/bin/tailscale-restart
    
    log_success "Symlinks created"
}

# Function to start the service
start_service() {
    log_step "Starting Tailscale persistent service..."
    
    # Start the service
    "$WORK_DIR/start-tailscale.sh"
    
    log_success "Service started"
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
    echo -e "${GREEN}                    TAILSCALE CONTAINER PERSISTENT SERVICE${NC}"
    echo -e "${GREEN}================================================================================${NC}"
    echo ""
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run with sudo privileges"
        exit 1
    fi
    
    # Execute setup steps
    create_directories
    create_daemon_script
    create_monitoring_script
    create_startup_script
    create_management_scripts
    create_symlinks
    start_service
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
    echo -e "  • Daemon Logs: $LOG_DIR/daemon.log"
    echo -e "  • Monitor Logs: $LOG_DIR/monitor.log"
    echo -e "  • Daemon Output: $LOG_DIR/daemon.out"
    echo -e "  • Monitor Output: $LOG_DIR/monitor.out"
    echo ""
    echo -e "${GREEN}================================================================================${NC}"
}

# Run main function
main "$@"