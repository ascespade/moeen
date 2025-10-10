#!/usr/bin/env node

// Cursor Agent Monitor
// This monitors the real Cursor agent activity and displays it in the dashboard

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class CursorAgentMonitor {
    constructor() {
        this.projectName = 'moeen-platform';
        this.projectPath = '/home/ubuntu/workspace/projects/moeen';
        this.logFile = path.join('/home/ubuntu/ai-agent-system/logs/projects/moeen-platform', 'cursor-agent-monitor.log');
        this.statusFile = path.join('/home/ubuntu/ai-agent-system/logs/projects/moeen-platform', 'cursor-agent-status.json');
        this.taskFile = path.join('/home/ubuntu/ai-agent-system/logs/projects/moeen-platform', 'cursor-tasks.json');
        
        this.monitoring = false;
        this.cursorAgentActive = false;
        this.lastActivity = null;
        this.taskCount = 0;
        this.completedTasks = 0;
        
        this.log('🔍 Cursor Agent Monitor initialized');
        this.startMonitoring();
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${this.projectName}: ${message}\n`;
        fs.appendFileSync(this.logFile, logMessage);
        console.log(logMessage.trim());
    }

    async startMonitoring() {
        this.monitoring = true;
        this.log('🚀 Starting Cursor Agent monitoring...');
        this.log('📊 Monitoring real Cursor agent activity');
        
        while (this.monitoring) {
            await this.checkCursorAgentActivity();
            await this.updateStatus();
            await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
        }
    }

    async checkCursorAgentActivity() {
        try {
            // Check for Cursor agent processes
            const { stdout } = await execAsync('ps aux | grep -i cursor | grep -v grep');
            const cursorProcesses = stdout.trim().split('\n').filter(line => line.length > 0);
            
            if (cursorProcesses.length > 0) {
                if (!this.cursorAgentActive) {
                    this.cursorAgentActive = true;
                    this.log('✅ Cursor agent detected and active');
                }
                
                // Monitor file changes (indicating active work)
                await this.monitorFileChanges();
                
                // Monitor git activity
                await this.monitorGitActivity();
                
                // Monitor terminal activity
                await this.monitorTerminalActivity();
                
            } else {
                if (this.cursorAgentActive) {
                    this.cursorAgentActive = false;
                    this.log('⚠️ Cursor agent not detected');
                }
            }
            
        } catch (error) {
            this.log(`Error checking Cursor agent: ${error.message}`);
        }
    }

    async monitorFileChanges() {
        try {
            // Check for recent file modifications (last 10 seconds)
            const { stdout } = await execAsync(`find ${this.projectPath} -type f -newermt "10 seconds ago" -not -path "*/node_modules/*" -not -path "*/.git/*" | head -10`);
            const recentFiles = stdout.trim().split('\n').filter(line => line.length > 0);
            
            if (recentFiles.length > 0) {
                this.log(`📝 Cursor agent modified ${recentFiles.length} files recently`);
                recentFiles.forEach(file => {
                    const fileName = path.basename(file);
                    this.log(`   - ${fileName}`);
                });
                
                this.taskCount++;
                this.lastActivity = new Date().toISOString();
            }
            
        } catch (error) {
            // Ignore errors - this is normal when no recent changes
        }
    }

    async monitorGitActivity() {
        try {
            // Check for recent git commits
            const { stdout } = await execAsync(`cd ${this.projectPath} && git log --oneline -5 --since="1 minute ago"`);
            const recentCommits = stdout.trim().split('\n').filter(line => line.length > 0);
            
            if (recentCommits.length > 0) {
                this.log(`📦 Cursor agent made ${recentCommits.length} recent commits`);
                recentCommits.forEach(commit => {
                    this.log(`   - ${commit}`);
                });
                
                this.completedTasks += recentCommits.length;
                this.lastActivity = new Date().toISOString();
            }
            
        } catch (error) {
            // Ignore errors - this is normal when no recent commits
        }
    }

    async monitorTerminalActivity() {
        try {
            // Check for active terminal sessions
            const { stdout } = await execAsync('ps aux | grep -E "(bash|zsh|sh)" | grep -v grep | wc -l');
            const activeTerminals = parseInt(stdout.trim());
            
            if (activeTerminals > 0) {
                // Check for npm/yarn processes (indicating development work)
                const { stdout: npmProcesses } = await execAsync('ps aux | grep -E "(npm|yarn|node)" | grep -v grep');
                const npmCount = npmProcesses.trim().split('\n').filter(line => line.length > 0).length;
                
                if (npmCount > 0) {
                    this.log(`⚙️ Cursor agent running ${npmCount} development processes`);
                    this.lastActivity = new Date().toISOString();
                }
            }
            
        } catch (error) {
            // Ignore errors
        }
    }

    async updateStatus() {
        const status = {
            monitor: 'cursor_agent_monitor',
            status: this.monitoring ? 'monitoring' : 'stopped',
            cursor_agent_active: this.cursorAgentActive,
            last_activity: this.lastActivity,
            task_count: this.taskCount,
            completed_tasks: this.completedTasks,
            progress_percentage: this.taskCount > 0 ? Math.round((this.completedTasks / this.taskCount) * 100) : 0,
            last_update: new Date().toISOString(),
            monitoring_info: {
                file_changes: 'monitoring',
                git_activity: 'monitoring',
                terminal_activity: 'monitoring',
                development_processes: 'monitoring'
            }
        };
        
        fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
        
        // Also update task file for dashboard compatibility
        const taskData = {
            total_tasks: this.taskCount || 100, // Default to 100 if no tasks detected
            current_task: this.completedTasks + 1,
            completed_tasks: this.completedTasks,
            failed_tasks: 0,
            last_update: new Date().toISOString(),
            status: this.cursorAgentActive ? 'running' : 'idle',
            cursor_agent_status: this.cursorAgentActive ? 'active' : 'inactive',
            real_activity: {
                last_file_change: this.lastActivity,
                active_processes: this.cursorAgentActive,
                monitoring_active: this.monitoring
            }
        };
        
        fs.writeFileSync(this.taskFile, JSON.stringify(taskData, null, 2));
    }

    async getCursorAgentLogs() {
        try {
            // Get recent logs from various sources
            const logs = [];
            
            // Get recent git log
            try {
                const { stdout } = await execAsync(`cd ${this.projectPath} && git log --oneline -10`);
                const gitLogs = stdout.trim().split('\n').filter(line => line.length > 0);
                gitLogs.forEach(log => {
                    logs.push(`[GIT] ${log}`);
                });
            } catch (error) {
                // Ignore git errors
            }
            
            // Get recent file changes
            try {
                const { stdout } = await execAsync(`find ${this.projectPath} -type f -newermt "1 hour ago" -not -path "*/node_modules/*" -not -path "*/.git/*" | head -20`);
                const recentFiles = stdout.trim().split('\n').filter(line => line.length > 0);
                recentFiles.forEach(file => {
                    const fileName = path.basename(file);
                    logs.push(`[FILE] Modified: ${fileName}`);
                });
            } catch (error) {
                // Ignore file errors
            }
            
            // Get active processes
            try {
                const { stdout } = await execAsync('ps aux | grep -E "(npm|yarn|node|cursor)" | grep -v grep | head -5');
                const processes = stdout.trim().split('\n').filter(line => line.length > 0);
                processes.forEach(process => {
                    const parts = process.split(/\s+/);
                    const command = parts.slice(10).join(' ');
                    logs.push(`[PROCESS] ${command}`);
                });
            } catch (error) {
                // Ignore process errors
            }
            
            return logs;
            
        } catch (error) {
            this.log(`Error getting Cursor agent logs: ${error.message}`);
            return [`Error: ${error.message}`];
        }
    }

    stop() {
        this.monitoring = false;
        this.log('🛑 Cursor Agent Monitor stopped');
    }
}

// Start the Cursor agent monitor
const monitor = new CursorAgentMonitor();

// Handle graceful shutdown
process.on('SIGINT', () => {
    monitor.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    monitor.stop();
    process.exit(0);
});


