#!/bin/bash

# Screen Session Manager for AI Agent
# This script manages persistent screen sessions for your AI agent

set -euo pipefail

PROJECT_DIR="/home/ubuntu/workspace/projects/moeen"
SESSION_NAME="ai-agent"
AGENT_SCRIPT="$PROJECT_DIR/scripts/persistent-agent.sh"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗${NC} $1"
}

# Check if screen is installed
check_screen() {
    if ! command -v screen &> /dev/null; then
        log_error "Screen is not installed. Installing..."
        sudo apt-get update && sudo apt-get install -y screen
    fi
}

# Create or attach to screen session
start_session() {
    check_screen
    
    if screen -list | grep -q "$SESSION_NAME"; then
        log "Session '$SESSION_NAME' already exists. Attaching..."
        screen -r "$SESSION_NAME"
    else
        log "Creating new screen session '$SESSION_NAME'..."
        screen -S "$SESSION_NAME" -d -m bash -c "cd '$PROJECT_DIR' && '$AGENT_SCRIPT' monitor"
        sleep 2
        log_success "Screen session '$SESSION_NAME' created and agent started"
        log "To attach to the session, run: screen -r $SESSION_NAME"
        log "To detach from session, press: Ctrl+A then D"
    fi
}

# Stop the session
stop_session() {
    if screen -list | grep -q "$SESSION_NAME"; then
        log "Stopping session '$SESSION_NAME'..."
        screen -S "$SESSION_NAME" -X quit
        log_success "Session '$SESSION_NAME' stopped"
    else
        log "Session '$SESSION_NAME' not found"
    fi
}

# Show session status
status() {
    if screen -list | grep -q "$SESSION_NAME"; then
        log_success "Session '$SESSION_NAME' is running"
        screen -list | grep "$SESSION_NAME"
        
        # Show agent status
        if [ -f "$PROJECT_DIR/logs/agent-status.json" ]; then
            echo ""
            echo "Agent Status:"
            cat "$PROJECT_DIR/logs/agent-status.json"
        fi
    else
        log_error "Session '$SESSION_NAME' is not running"
    fi
}

# Attach to session
attach() {
    if screen -list | grep -q "$SESSION_NAME"; then
        log "Attaching to session '$SESSION_NAME'..."
        screen -r "$SESSION_NAME"
    else
        log_error "Session '$SESSION_NAME' not found. Starting new session..."
        start_session
    fi
}

# Show logs
logs() {
    if [ -f "$PROJECT_DIR/logs/agent.log" ]; then
        tail -f "$PROJECT_DIR/logs/agent.log"
    else
        log_error "No logs found"
    fi
}

# Main function
main() {
    case "${1:-start}" in
        "start")
            start_session
            ;;
        "stop")
            stop_session
            ;;
        "restart")
            stop_session
            sleep 2
            start_session
            ;;
        "status")
            status
            ;;
        "attach")
            attach
            ;;
        "logs")
            logs
            ;;
        *)
            echo "AI Agent Screen Session Manager"
            echo ""
            echo "Usage: $0 {start|stop|restart|status|attach|logs}"
            echo ""
            echo "Commands:"
            echo "  start   - Create and start screen session with AI agent"
            echo "  stop    - Stop the screen session"
            echo "  restart - Restart the screen session"
            echo "  status  - Show session and agent status"
            echo "  attach  - Attach to existing session"
            echo "  logs    - Show agent logs"
            echo ""
            echo "Screen shortcuts:"
            echo "  Ctrl+A D  - Detach from session"
            echo "  Ctrl+A C  - Create new window"
            echo "  Ctrl+A N  - Next window"
            echo "  Ctrl+A P  - Previous window"
            echo "  Ctrl+A \"  - List windows"
            exit 1
            ;;
    esac
}

main "$@"


