#!/bin/bash

# Smart Git Integration & Optimization Agent Scheduler
# Runs every 6 hours to automatically merge branches and optimize code

# Configuration
SCRIPT_DIR="/workspace"
AGENT_SCRIPT="$SCRIPT_DIR/smart-git-agent.js"
LOG_DIR="$SCRIPT_DIR/logs"
LOCK_FILE="$LOG_DIR/agent.lock"
PID_FILE="$LOG_DIR/agent.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_DIR/scheduler.log"
}

# Error logging function
log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_DIR/scheduler.log"
}

# Success logging function
log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1" | tee -a "$LOG_DIR/scheduler.log"
}

# Warning logging function
log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_DIR/scheduler.log"
}

# Check if agent is already running
check_running() {
    if [ -f "$LOCK_FILE" ]; then
        local pid=$(cat "$LOCK_FILE" 2>/dev/null)
        if ps -p "$pid" > /dev/null 2>&1; then
            log_warning "Agent is already running (PID: $pid)"
            return 1
        else
            log "Removing stale lock file"
            rm -f "$LOCK_FILE"
        fi
    fi
    return 0
}

# Create lock file
create_lock() {
    echo $$ > "$LOCK_FILE"
    echo $$ > "$PID_FILE"
}

# Remove lock file
remove_lock() {
    rm -f "$LOCK_FILE" "$PID_FILE"
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    remove_lock
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution function
run_agent() {
    log "🚀 Starting Smart Git Integration Agent..."
    
    # Check if already running
    if ! check_running; then
        exit 1
    fi
    
    # Create lock
    create_lock
    
    # Change to script directory
    cd "$SCRIPT_DIR" || {
        log_error "Failed to change to script directory: $SCRIPT_DIR"
        exit 1
    }
    
    # Check if agent script exists
    if [ ! -f "$AGENT_SCRIPT" ]; then
        log_error "Agent script not found: $AGENT_SCRIPT"
        exit 1
    fi
    
    # Make sure agent script is executable
    chmod +x "$AGENT_SCRIPT"
    
    # Run the agent
    log "Executing agent script..."
    if node "$AGENT_SCRIPT"; then
        log_success "Agent completed successfully"
    else
        log_error "Agent failed with exit code $?"
    fi
    
    # Cleanup
    remove_lock
    log "Agent execution finished"
}

# Health check function
health_check() {
    log "🔍 Performing health check..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        return 1
    fi
    
    # Check if we have internet connectivity
    if ! ping -c 1 github.com > /dev/null 2>&1; then
        log_warning "No internet connectivity detected"
    fi
    
    # Check disk space
    local available_space=$(df "$SCRIPT_DIR" | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 1000000 ]; then
        log_warning "Low disk space: ${available_space}KB available"
    fi
    
    log_success "Health check completed"
    return 0
}

# Show usage
show_usage() {
    echo "Smart Git Integration & Optimization Agent Scheduler"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  run         Run the agent once"
    echo "  start       Start the agent in background"
    echo "  stop        Stop the running agent"
    echo "  status      Show agent status"
    echo "  health      Run health check"
    echo "  install     Install as systemd service (requires sudo)"
    echo "  uninstall   Remove systemd service (requires sudo)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 run                    # Run agent once"
    echo "  $0 start                  # Start agent in background"
    echo "  $0 install                # Install as systemd service"
}

# Start agent in background
start_agent() {
    if ! check_running; then
        exit 1
    fi
    
    log "Starting agent in background..."
    nohup "$0" run > "$LOG_DIR/agent_background.log" 2>&1 &
    local pid=$!
    echo $pid > "$PID_FILE"
    log_success "Agent started in background (PID: $pid)"
}

# Stop agent
stop_agent() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "Stopping agent (PID: $pid)..."
            kill "$pid"
            sleep 2
            if ps -p "$pid" > /dev/null 2>&1; then
                log_warning "Force killing agent..."
                kill -9 "$pid"
            fi
            log_success "Agent stopped"
        else
            log_warning "Agent not running"
        fi
        remove_lock
    else
        log_warning "No PID file found"
    fi
}

# Show status
show_status() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            log_success "Agent is running (PID: $pid)"
        else
            log_warning "Agent is not running (stale PID file)"
        fi
    else
        log "Agent is not running"
    fi
}

# Install as systemd service
install_service() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This operation requires root privileges"
        exit 1
    fi
    
    log "Installing systemd service..."
    
    cat > /etc/systemd/system/smart-git-agent.service << EOF
[Unit]
Description=Smart Git Integration & Optimization Agent
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$SCRIPT_DIR
ExecStart=$0 run
Restart=always
RestartSec=3600
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable smart-git-agent.service
    log_success "Service installed and enabled"
    log "Use 'systemctl start smart-git-agent' to start the service"
}

# Uninstall systemd service
uninstall_service() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This operation requires root privileges"
        exit 1
    fi
    
    log "Uninstalling systemd service..."
    systemctl stop smart-git-agent.service 2>/dev/null || true
    systemctl disable smart-git-agent.service 2>/dev/null || true
    rm -f /etc/systemd/system/smart-git-agent.service
    systemctl daemon-reload
    log_success "Service uninstalled"
}

# Main script logic
case "${1:-run}" in
    run)
        health_check && run_agent
        ;;
    start)
        start_agent
        ;;
    stop)
        stop_agent
        ;;
    status)
        show_status
        ;;
    health)
        health_check
        ;;
    install)
        install_service
        ;;
    uninstall)
        uninstall_service
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        log_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac