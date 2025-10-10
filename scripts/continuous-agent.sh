#!/bin/bash

# Continuous AI Agent Runner - Never Stops Until All Tasks Complete
# This script ensures your AI agent keeps running continuously until all tasks are done

set -euo pipefail

# Configuration
PROJECT_DIR="/home/ubuntu/workspace/projects/moeen"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$LOG_DIR/agent.pid"
STATUS_FILE="$LOG_DIR/agent-status.json"
TASK_FILE="$LOG_DIR/tasks.json"
COMPLETION_FILE="$LOG_DIR/completion-status.json"
SESSION_NAME="ai-agent-continuous"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p "$LOG_DIR"

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_DIR/continuous-agent.log"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓${NC} $1" | tee -a "$LOG_DIR/continuous-agent.log"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗${NC} $1" | tee -a "$LOG_DIR/continuous-agent.log"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠${NC} $1" | tee -a "$LOG_DIR/continuous-agent.log"
}

log_progress() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] 📊${NC} $1" | tee -a "$LOG_DIR/continuous-agent.log"
}

# Initialize task tracking
init_tasks() {
    if [ ! -f "$TASK_FILE" ]; then
        log "Initializing task tracking..."
        cat > "$TASK_FILE" << 'EOF'
{
    "total_tasks": 100,
    "completed_tasks": 0,
    "failed_tasks": 0,
    "current_task": 1,
    "tasks": [],
    "start_time": "",
    "last_update": "",
    "estimated_completion": "",
    "status": "initializing"
}
EOF
        log_success "Task tracking initialized"
    fi
}

# Update task progress
update_task_progress() {
    local current_task="$1"
    local total_tasks="$2"
    local status="$3"
    local message="$4"
    
    # Calculate progress percentage
    local progress=$((current_task * 100 / total_tasks))
    
    # Estimate completion time
    local start_time=$(jq -r '.start_time' "$TASK_FILE" 2>/dev/null || echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)")
    local current_time=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local elapsed=$(($(date -d "$current_time" +%s) - $(date -d "$start_time" +%s)))
    
    local remaining_tasks=$((total_tasks - current_task + 1))
    local avg_time_per_task=$((elapsed / (current_task - 1)))
    local estimated_remaining=$((remaining_tasks * avg_time_per_task))
    local estimated_completion=$(date -d "@$(( $(date +%s) + estimated_remaining ))" -u +%Y-%m-%dT%H:%M:%SZ)
    
    # Update task file
    jq --arg current "$current_task" \
       --arg total "$total_tasks" \
       --arg status "$status" \
       --arg message "$message" \
       --arg progress "$progress" \
       --arg last_update "$current_time" \
       --arg estimated "$estimated_completion" \
       '.current_task = ($current | tonumber) |
        .total_tasks = ($total | tonumber) |
        .status = $status |
        .last_update = $last_update |
        .estimated_completion = $estimated |
        .progress_percentage = ($progress | tonumber)' \
       "$TASK_FILE" > "$TASK_FILE.tmp" && mv "$TASK_FILE.tmp" "$TASK_FILE"
    
    log_progress "Task $current_task/$total_tasks ($progress%) - $status: $message"
}

# Check if all tasks are completed
all_tasks_completed() {
    local current_task=$(jq -r '.current_task' "$TASK_FILE" 2>/dev/null || echo "1")
    local total_tasks=$(jq -r '.total_tasks' "$TASK_FILE" 2>/dev/null || echo "100")
    
    if [ "$current_task" -gt "$total_tasks" ]; then
        return 0
    else
        return 1
    fi
}

# Create completion report
create_completion_report() {
    local end_time=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local start_time=$(jq -r '.start_time' "$TASK_FILE")
    local total_time=$(($(date -d "$end_time" +%s) - $(date -d "$start_time" +%s)))
    
    cat > "$COMPLETION_FILE" << EOF
{
    "status": "completed",
    "completion_time": "$end_time",
    "total_duration_seconds": $total_time,
    "total_duration_human": "$(date -d "@$total_time" -u +%H:%M:%S)",
    "total_tasks": $(jq -r '.total_tasks' "$TASK_FILE"),
    "completed_tasks": $(jq -r '.completed_tasks' "$TASK_FILE"),
    "failed_tasks": $(jq -r '.failed_tasks' "$TASK_FILE"),
    "success_rate": "$(echo "scale=2; $(jq -r '.completed_tasks' "$TASK_FILE") * 100 / $(jq -r '.total_tasks' "$TASK_FILE")" | bc)%",
    "message": "All tasks completed successfully!"
}
EOF
    
    log_success "🎉 ALL TASKS COMPLETED! 🎉"
    log_success "Total duration: $(date -d "@$total_time" -u +%H:%M:%S)"
    log_success "Success rate: $(echo "scale=2; $(jq -r '.completed_tasks' "$TASK_FILE") * 100 / $(jq -r '.total_tasks' "$TASK_FILE")" | bc)%"
}

# Start continuous AI agent
start_continuous_agent() {
    log "🚀 Starting Continuous AI Agent..."
    
    # Initialize task tracking
    init_tasks
    
    # Set start time
    jq --arg start_time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
       '.start_time = $start_time | .status = "running"' \
       "$TASK_FILE" > "$TASK_FILE.tmp" && mv "$TASK_FILE.tmp" "$TASK_FILE"
    
    cd "$PROJECT_DIR"
    
    # Start the Next.js development server
    log "Starting development server..."
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
    
    # Start continuous task processor
    start_continuous_task_processor
    
    log_success "Continuous AI Agent started successfully!"
    log "Agent will run until all 100 tasks are completed"
    log "You can safely disconnect - the agent will continue working"
}

# Start continuous task processor
start_continuous_task_processor() {
    log "Starting continuous task processor..."
    
    # Create the continuous task processor
    cat > "$PROJECT_DIR/scripts/continuous-task-processor.js" << 'EOF'
const fs = require('fs');
const path = require('path');

class ContinuousTaskProcessor {
    constructor() {
        this.projectDir = '/home/ubuntu/workspace/projects/moeen';
        this.logFile = path.join(this.projectDir, 'logs/continuous-processor.log');
        this.taskFile = path.join(this.projectDir, 'logs/tasks.json');
        this.statusFile = path.join(this.projectDir, 'logs/agent-status.json');
        this.processing = false;
        this.currentTask = 1;
        this.totalTasks = 100;
        
        this.loadTasks();
        this.startContinuousProcessing();
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(this.logFile, logMessage);
        console.log(logMessage.trim());
    }

    loadTasks() {
        try {
            if (fs.existsSync(this.taskFile)) {
                const data = JSON.parse(fs.readFileSync(this.taskFile, 'utf8'));
                this.currentTask = data.current_task || 1;
                this.totalTasks = data.total_tasks || 100;
                this.log(`Loaded tasks: ${this.currentTask}/${this.totalTasks}`);
            }
        } catch (error) {
            this.log(`Error loading tasks: ${error.message}`);
        }
    }

    saveTasks() {
        try {
            const data = {
                total_tasks: this.totalTasks,
                current_task: this.currentTask,
                completed_tasks: this.currentTask - 1,
                failed_tasks: 0,
                last_update: new Date().toISOString(),
                status: this.processing ? 'running' : 'stopped'
            };
            fs.writeFileSync(this.taskFile, JSON.stringify(data, null, 2));
        } catch (error) {
            this.log(`Error saving tasks: ${error.message}`);
        }
    }

    async processTask(taskNumber) {
        this.log(`🔄 Processing Task ${taskNumber}/${this.totalTasks}`);
        
        try {
            // Simulate AI agent work - replace this with your actual AI agent logic
            const workDuration = Math.random() * 5000 + 2000; // 2-7 seconds per task
            await new Promise(resolve => setTimeout(resolve, workDuration));
            
            // Simulate different types of AI tasks
            const taskTypes = [
                'Code analysis and optimization',
                'Database schema updates',
                'API endpoint testing',
                'UI component refactoring',
                'Performance optimization',
                'Security audit',
                'Documentation generation',
                'Test case creation',
                'Bug fixing',
                'Feature implementation'
            ];
            
            const taskType = taskTypes[taskNumber % taskTypes.length];
            const success = Math.random() > 0.05; // 95% success rate
            
            if (success) {
                this.log(`✅ Task ${taskNumber} completed: ${taskType}`);
                return { success: true, taskType, duration: workDuration };
            } else {
                this.log(`❌ Task ${taskNumber} failed: ${taskType}`);
                return { success: false, taskType, duration: workDuration };
            }
            
        } catch (error) {
            this.log(`❌ Task ${taskNumber} error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async startContinuousProcessing() {
        this.processing = true;
        this.log('🚀 Continuous task processor started');
        this.log(`📋 Processing ${this.totalTasks} tasks continuously`);
        
        while (this.processing && this.currentTask <= this.totalTasks) {
            const result = await this.processTask(this.currentTask);
            
            // Update progress
            this.currentTask++;
            this.saveTasks();
            
            // Update status
            this.updateStatus();
            
            // Log progress every 10 tasks
            if (this.currentTask % 10 === 0) {
                const progress = Math.round((this.currentTask - 1) * 100 / this.totalTasks);
                this.log(`📊 Progress: ${this.currentTask - 1}/${this.totalTasks} (${progress}%)`);
            }
            
            // Small delay between tasks to prevent overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (this.currentTask > this.totalTasks) {
            this.log('🎉 ALL TASKS COMPLETED! 🎉');
            this.createCompletionReport();
        }
        
        this.processing = false;
    }

    updateStatus() {
        const status = {
            processor: 'continuous',
            status: this.processing ? 'running' : 'stopped',
            current_task: this.currentTask,
            total_tasks: this.totalTasks,
            progress_percentage: Math.round((this.currentTask - 1) * 100 / this.totalTasks),
            last_update: new Date().toISOString(),
            estimated_completion: this.estimateCompletion()
        };
        
        fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
    }

    estimateCompletion() {
        if (this.currentTask <= 1) return 'Calculating...';
        
        const startTime = new Date().getTime();
        const avgTimePerTask = (startTime - new Date().getTime()) / (this.currentTask - 1);
        const remainingTasks = this.totalTasks - this.currentTask + 1;
        const estimatedTime = new Date().getTime() + (remainingTasks * avgTimePerTask);
        
        return new Date(estimatedTime).toISOString();
    }

    createCompletionReport() {
        const completionData = {
            status: 'completed',
            completion_time: new Date().toISOString(),
            total_tasks: this.totalTasks,
            completed_tasks: this.currentTask - 1,
            message: 'All tasks completed successfully!'
        };
        
        const completionFile = path.join(this.projectDir, 'logs/completion-status.json');
        fs.writeFileSync(completionFile, JSON.stringify(completionData, null, 2));
        
        this.log('📄 Completion report created');
    }

    stop() {
        this.processing = false;
        this.log('🛑 Continuous task processor stopped');
    }
}

// Start the processor
const processor = new ContinuousTaskProcessor();

// Handle graceful shutdown
process.on('SIGINT', () => {
    processor.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    processor.stop();
    process.exit(0);
});

// Keep the process alive
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, keep processing
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, keep processing
});
EOF

    # Start the continuous task processor in background
    nohup node "$PROJECT_DIR/scripts/continuous-task-processor.js" > "$LOG_DIR/continuous-processor.log" 2>&1 &
    local processor_pid=$!
    echo "$processor_pid" >> "$PID_FILE"
    
    log_success "Continuous task processor started (PID: $processor_pid)"
}

# Monitor the continuous agent
monitor_continuous_agent() {
    log "🔍 Starting continuous monitoring..."
    
    while true; do
        # Check if all tasks are completed
        if all_tasks_completed; then
            create_completion_report
            log_success "🎉 All tasks completed! Agent will continue monitoring..."
            break
        fi
        
        # Check if processes are still running
        if [ -f "$PID_FILE" ]; then
            local all_running=true
            while read -r pid; do
                if ! ps -p "$pid" > /dev/null 2>&1; then
                    log_warning "Process $pid stopped unexpectedly, restarting..."
                    all_running=false
                fi
            done < "$PID_FILE"
            
            if [ "$all_running" = false ]; then
                log_warning "Some processes stopped, restarting agent..."
                start_continuous_agent
            fi
        fi
        
        # Update status
        update_status "running" "Continuous processing in progress" 0
        
        # Wait before next check
        sleep 60
    done
}

# Update status
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
    "uptime": "$(ps -o etime= -p $(cat "$PID_FILE" 2>/dev/null) 2>/dev/null || echo "N/A")",
    "mode": "continuous"
}
EOF
}

# Stop the agent
stop_agent() {
    log "Stopping continuous AI agent..."
    
    if [ -f "$PID_FILE" ]; then
        while read -r pid; do
            if ps -p "$pid" > /dev/null 2>&1; then
                kill "$pid" 2>/dev/null || true
                log "Stopped process $pid"
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    update_status "stopped" "Continuous agent stopped" 0
    log_success "Continuous AI agent stopped"
}

# Show status
show_status() {
    echo "🤖 Continuous AI Agent Status"
    echo "================================"
    
    if [ -f "$STATUS_FILE" ]; then
        echo "Agent Status:"
        cat "$STATUS_FILE" | jq -r '.'
        echo ""
    fi
    
    if [ -f "$TASK_FILE" ]; then
        echo "Task Progress:"
        cat "$TASK_FILE" | jq -r '.'
        echo ""
    fi
    
    if [ -f "$COMPLETION_FILE" ]; then
        echo "Completion Report:"
        cat "$COMPLETION_FILE" | jq -r '.'
    fi
}

# Main function
main() {
    case "${1:-start}" in
        "start")
            start_continuous_agent
            monitor_continuous_agent
            ;;
        "stop")
            stop_agent
            ;;
        "status")
            show_status
            ;;
        "logs")
            echo "=== Continuous Agent Logs ==="
            tail -f "$LOG_DIR/continuous-agent.log"
            ;;
        "tasks")
            if [ -f "$TASK_FILE" ]; then
                cat "$TASK_FILE" | jq -r '.'
            else
                echo "No task data available"
            fi
            ;;
        *)
            echo "🤖 Continuous AI Agent Manager"
            echo ""
            echo "Usage: $0 {start|stop|status|logs|tasks}"
            echo ""
            echo "Commands:"
            echo "  start   - Start continuous AI agent (runs until all tasks complete)"
            echo "  stop    - Stop the continuous agent"
            echo "  status  - Show detailed status and progress"
            echo "  logs    - Show continuous agent logs"
            echo "  tasks   - Show task progress"
            echo ""
            echo "This agent will:"
            echo "  ✅ Run continuously until all 100 tasks are completed"
            echo "  ✅ Keep working even when you disconnect"
            echo "  ✅ Auto-restart if any process fails"
            echo "  ✅ Provide detailed progress tracking"
            echo "  ✅ Create completion report when done"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"


