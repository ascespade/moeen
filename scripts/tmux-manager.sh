#!/bin/bash

# TMUX Session Manager for AI Agent
# Alternative to screen for managing persistent sessions

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

# Check if tmux is installed
check_tmux() {
    if ! command -v tmux &> /dev/null; then
        log_error "TMUX is not installed. Installing..."
        sudo apt-get update && sudo apt-get install -y tmux
    fi
}

# Create or attach to tmux session
start_session() {
    check_tmux
    
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        log "Session '$SESSION_NAME' already exists. Attaching..."
        tmux attach-session -t "$SESSION_NAME"
    else
        log "Creating new tmux session '$SESSION_NAME'..."
        tmux new-session -d -s "$SESSION_NAME" -c "$PROJECT_DIR" "$AGENT_SCRIPT monitor"
        sleep 2
        log_success "TMUX session '$SESSION_NAME' created and agent started"
        log "To attach to the session, run: tmux attach -t $SESSION_NAME"
        log "To detach from session, press: Ctrl+B then D"
    fi
}

# Stop the session
stop_session() {
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        log "Stopping session '$SESSION_NAME'..."
        tmux kill-session -t "$SESSION_NAME"
        log_success "Session '$SESSION_NAME' stopped"
    else
        log "Session '$SESSION_NAME' not found"
    fi
}

# Show session status
status() {
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        log_success "Session '$SESSION_NAME' is running"
        tmux list-sessions | grep "$SESSION_NAME"
        
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
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        log "Attaching to session '$SESSION_NAME'..."
        tmux attach-session -t "$SESSION_NAME"
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
            echo "AI Agent TMUX Session Manager"
            echo ""
            echo "Usage: $0 {start|stop|restart|status|attach|logs}"
            echo ""
            echo "Commands:"
            echo "  start   - Create and start tmux session with AI agent"
            echo "  stop    - Stop the tmux session"
            echo "  restart - Restart the tmux session"
            echo "  status  - Show session and agent status"
            echo "  attach  - Attach to existing session"
            echo "  logs    - Show agent logs"
            echo ""
            echo "TMUX shortcuts:"
            echo "  Ctrl+B D  - Detach from session"
            echo "  Ctrl+B C  - Create new window"
            echo "  Ctrl+B N  - Next window"
            echo "  Ctrl+B P  - Previous window"
            echo "  Ctrl+B W  - List windows"
            exit 1
            ;;
    esac
}

main "$@"


