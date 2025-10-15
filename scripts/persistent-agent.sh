#!/bin/bash

# Persistent AI Agent Runner
# This script ensures your AI agent keeps running even when you disconnect

set -euo pipefail

# Configuration
PROJECT_DIR="/home/ubuntu/workspace/projects/moeen"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$LOG_DIR/agent.pid"
STATUS_FILE="$LOG_DIR/agent-status.json"
SESSION_NAME="ai-agent-session"
MAX_RESTARTS=10
RESTART_DELAY=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p "$LOG_DIR"

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_DIR/agent.log"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓${NC} $1" | tee -a "$LOG_DIR/agent.log"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗${NC} $1" | tee -a "$LOG_DIR/agent.log"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠${NC} $1" | tee -a "$LOG_DIR/agent.log"
}

# Status management
update_status() {
    local status="$1"
    local message="$2"
    local restart_count="${3:-0}"
    
    cat > "$STATUS_FILE" << EOF
{
    "status": "$status",
    "message": "$message",
    "last_update": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "restart_count": $restart_count,
    "pid": $(cat "$PID_FILE" 2>/dev/null || echo "null"),
    "uptime": "$(ps -o etime= -p $(cat "$PID_FILE" 2>/dev/null) 2>/dev/null || echo "N/A")"
}
EOF
}

# Check if agent is already running
is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Start the AI agent
start_agent() {
    log "Starting AI Agent..."
    
    cd "$PROJECT_DIR"
    
    # Start the Next.js development server
    nohup npm run dev > "$LOG_DIR/dev-server.log" 2>&1 &
    local dev_pid=$!
    echo "$dev_pid" > "$PID_FILE"
    
    # Wait for server to start
    log "Waiting for development server to start..."
    local attempts=0
    while [ $attempts -lt 30 ]; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            log_success "Development server started successfully (PID: $dev_pid)"
            break
        fi
        sleep 2
        attempts=$((attempts + 1))
    done
    
    if [ $attempts -eq 30 ]; then
        log_error "Failed to start development server"
        return 1
    fi
    
    # Start background task processor
    start_task_processor
    
    update_status "running" "AI Agent is running" 0
    log_success "AI Agent started successfully!"
}

# Start background task processor
start_task_processor() {
    log "Starting background task processor..."
    
    # Create a background task processor script
    cat > "$PROJECT_DIR/scripts/task-processor.js" << 'EOF'
const fs = require('fs');
const path = require('path');

class TaskProcessor {
    constructor() {
        this.taskQueue = [];
        this.processing = false;
        this.logFile = path.join(__dirname, '../logs/task-processor.log');
        this.statusFile = path.join(__dirname, '../logs/task-status.json');
        this.loadTasks();
        this.startProcessing();
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(this.logFile, logMessage);
        console.log(logMessage.trim());
    }

    loadTasks() {
        try {
            const tasksFile = path.join(__dirname, '../logs/pending-tasks.json');
            if (fs.existsSync(tasksFile)) {
                this.taskQueue = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
                this.log(`Loaded ${this.taskQueue.length} pending tasks`);
            }
        } catch (error) {
            this.log(`Error loading tasks: ${error.message}`);
        }
    }

    saveTasks() {
        try {
            const tasksFile = path.join(__dirname, '../logs/pending-tasks.json');
            fs.writeFileSync(tasksFile, JSON.stringify(this.taskQueue, null, 2));
        } catch (error) {
            this.log(`Error saving tasks: ${error.message}`);
        }
    }

    addTask(task) {
        this.taskQueue.push({
            id: Date.now() + Math.random(),
            ...task,
            createdAt: new Date().toISOString(),
            status: 'pending'
        });
        this.saveTasks();
        this.log(`Added new task: ${task.name || 'Unnamed task'}`);
    }

    async processTask(task) {
        this.log(`Processing task: ${task.name || task.id}`);
        task.status = 'processing';
        task.startedAt = new Date().toISOString();
        
        try {
            // Simulate AI agent task processing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Here you would integrate with your actual AI agent
            // For now, we'll simulate task completion
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            task.result = { success: true, message: 'Task completed successfully' };
            
            this.log(`Task completed: ${task.name || task.id}`);
        } catch (error) {
            task.status = 'failed';
            task.error = error.message;
            task.failedAt = new Date().toISOString();
            this.log(`Task failed: ${task.name || task.id} - ${error.message}`);
        }
        
        this.saveTasks();
        this.updateStatus();
    }

    async startProcessing() {
        this.processing = true;
        this.log('Task processor started');
        
        while (this.processing) {
            if (this.taskQueue.length > 0) {
                const task = this.taskQueue.find(t => t.status === 'pending');
                if (task) {
                    await this.processTask(task);
                }
            }
            
            // Check for new tasks every 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    updateStatus() {
        const status = {
            processor: 'running',
            lastUpdate: new Date().toISOString(),
            totalTasks: this.taskQueue.length,
            pendingTasks: this.taskQueue.filter(t => t.status === 'pending').length,
            completedTasks: this.taskQueue.filter(t => t.status === 'completed').length,
            failedTasks: this.taskQueue.filter(t => t.status === 'failed').length,
            processingTasks: this.taskQueue.filter(t => t.status === 'processing').length
        };
        
        fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
    }

    stop() {
        this.processing = false;
        this.log('Task processor stopped');
    }
}

// Start the processor
const processor = new TaskProcessor();

// Handle graceful shutdown
process.on('SIGINT', () => {
    processor.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    processor.stop();
    process.exit(0);
});
EOF

    # Start the task processor in background
    nohup node "$PROJECT_DIR/scripts/task-processor.js" > "$LOG_DIR/task-processor.log" 2>&1 &
    local processor_pid=$!
    echo "$processor_pid" >> "$PID_FILE"
    
    log_success "Task processor started (PID: $processor_pid)"
}

# Stop the agent
stop_agent() {
    log "Stopping AI Agent..."
    
    if [ -f "$PID_FILE" ]; then
        while read -r pid; do
            if ps -p "$pid" > /dev/null 2>&1; then
                kill "$pid" 2>/dev/null || true
                log "Stopped process $pid"
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    update_status "stopped" "AI Agent stopped" 0
    log_success "AI Agent stopped"
}

# Restart the agent
restart_agent() {
    log_warning "Restarting AI Agent..."
    stop_agent
    sleep 2
    start_agent
}

# Monitor and auto-restart
monitor_agent() {
    local restart_count=0
    
    while [ $restart_count -lt $MAX_RESTARTS ]; do
        if ! is_running; then
            restart_count=$((restart_count + 1))
            log_warning "Agent not running, restarting... (attempt $restart_count/$MAX_RESTARTS)"
            start_agent
            update_status "running" "AI Agent restarted" $restart_count
        fi
        
        sleep 30
    done
    
    log_error "Maximum restart attempts reached. Agent monitoring stopped."
    update_status "failed" "Maximum restart attempts reached" $restart_count
}

# Main function
main() {
    case "${1:-start}" in
        "start")
            if is_running; then
                log_warning "AI Agent is already running"
                exit 0
            fi
            start_agent
            ;;
        "stop")
            stop_agent
            ;;
        "restart")
            restart_agent
            ;;
        "status")
            if is_running; then
                log_success "AI Agent is running"
                if [ -f "$STATUS_FILE" ]; then
                    cat "$STATUS_FILE"
                fi
            else
                log_error "AI Agent is not running"
            fi
            ;;
        "monitor")
            log "Starting agent monitor..."
            monitor_agent
            ;;
        "logs")
            echo "=== Agent Logs ==="
            tail -f "$LOG_DIR/agent.log"
            ;;
        "tasks")
            if [ -f "$LOG_DIR/task-status.json" ]; then
                cat "$LOG_DIR/task-status.json"
            else
                echo "No task status available"
            fi
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|monitor|logs|tasks}"
            echo ""
            echo "Commands:"
            echo "  start   - Start the AI agent"
            echo "  stop    - Stop the AI agent"
            echo "  restart - Restart the AI agent"
            echo "  status  - Check agent status"
            echo "  monitor - Monitor and auto-restart agent"
            echo "  logs    - Show agent logs"
            echo "  tasks   - Show task status"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"


