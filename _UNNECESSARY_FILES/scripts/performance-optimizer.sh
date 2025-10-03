#!/bin/bash

# 🚀 Cursor Dev Platform - Advanced Performance Optimizer
# تحسين شامل لأداء السيرفر والمنصة

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# System Information
TOTAL_RAM=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
CPU_CORES=$(nproc)
TOTAL_DISK=$(df -BG / | awk 'NR==2{print $2}' | sed 's/G//')

echo -e "${PURPLE}🚀 Cursor Dev Platform Performance Optimizer${NC}"
echo -e "${CYAN}=============================================${NC}"
echo -e "${BLUE}System: ${CPU_CORES} cores, ${TOTAL_RAM}GB RAM, ${TOTAL_DISK}GB disk${NC}"
echo ""

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# 1. System-level optimizations
optimize_system() {
    log "🔧 تحسين إعدادات النظام..."
    
    # Kernel parameters for development workloads
    cat > /tmp/99-cursor-dev.conf << EOF
# Network optimizations
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 65536 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_congestion_control = bbr
net.ipv4.tcp_slow_start_after_idle = 0

# File system optimizations
fs.file-max = 2097152
fs.inotify.max_user_watches = 1048576
fs.inotify.max_user_instances = 1024
fs.inotify.max_queued_events = 32768

# Memory management
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
vm.swappiness = 10
vm.vfs_cache_pressure = 50
vm.overcommit_memory = 1

# Process limits
kernel.pid_max = 4194304
kernel.threads-max = 4194304

# Security
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
EOF

    sudo cp /tmp/99-cursor-dev.conf /etc/sysctl.d/
    sudo sysctl -p /etc/sysctl.d/99-cursor-dev.conf
    
    log "✅ تم تحسين إعدادات النظام"
}

# 2. Code Server optimizations
optimize_code_server() {
    log "💻 تحسين Code Server..."
    
    # Calculate optimal settings based on system resources
    local max_memory=$((TOTAL_RAM * 1024 * 70 / 100)) # 70% of total RAM
    local max_old_space=$((max_memory / 2))
    
    # Create optimized systemd service
    sudo tee /etc/systemd/system/code-server.service > /dev/null <<EOF
[Unit]
Description=Code Server - Cursor Dev Platform (Optimized)
Documentation=https://github.com/coder/code-server
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=codeserver
Group=codeserver
Environment=NODE_ENV=production
Environment=NODE_OPTIONS="--max-old-space-size=${max_old_space} --max-semi-space-size=128"
Environment=PASSWORD_FROM_FILE=/home/codeserver/.config/code-server/password
ExecStart=/usr/bin/code-server \\
    --config /home/codeserver/.config/code-server/config.yaml \\
    --disable-telemetry \\
    --disable-update-check \\
    --log info
WorkingDirectory=/home/codeserver/workspace
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=code-server
KillMode=mixed
TimeoutStopSec=5

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/codeserver
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes

# Resource limits
LimitNOFILE=65536
LimitNPROC=8192
LimitMEMLOCK=infinity

# CPU and Memory limits
CPUQuota=80%
MemoryMax=${max_memory}M
MemorySwapMax=0

[Install]
WantedBy=multi-user.target
EOF

    # Optimize code-server config
    sudo tee /home/codeserver/.config/code-server/config.yaml > /dev/null <<EOF
bind-addr: 127.0.0.1:8080
auth: password
password: \$(cat /home/codeserver/.config/code-server/password)
cert: false
disable-telemetry: true
disable-update-check: true
log: info
verbose: false
user-data-dir: /home/codeserver/.local/share/code-server
extensions-dir: /home/codeserver/extensions

# Performance settings
disable-workspace-trust: true
disable-getting-started-override: true
EOF

    # Create performance monitoring script for code-server
    sudo tee /usr/local/bin/code-server-monitor > /dev/null <<'EOF'
#!/bin/bash
LOGFILE="/var/log/code-server/performance.log"
mkdir -p /var/log/code-server

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    PID=$(pgrep -f "code-server")
    
    if [ ! -z "$PID" ]; then
        CPU=$(ps -p $PID -o %cpu --no-headers | tr -d ' ')
        MEM=$(ps -p $PID -o %mem --no-headers | tr -d ' ')
        RSS=$(ps -p $PID -o rss --no-headers | tr -d ' ')
        VSZ=$(ps -p $PID -o vsz --no-headers | tr -d ' ')
        
        echo "[$TIMESTAMP] CPU: ${CPU}% MEM: ${MEM}% RSS: ${RSS}KB VSZ: ${VSZ}KB" >> $LOGFILE
        
        # Alert if high resource usage
        if (( $(echo "$CPU > 90" | bc -l) )); then
            echo "[$TIMESTAMP] HIGH CPU USAGE: ${CPU}%" >> $LOGFILE
        fi
        
        if (( $(echo "$MEM > 80" | bc -l) )); then
            echo "[$TIMESTAMP] HIGH MEMORY USAGE: ${MEM}%" >> $LOGFILE
        fi
    fi
    
    sleep 60
done
EOF

    sudo chmod +x /usr/local/bin/code-server-monitor
    
    # Create systemd service for monitoring
    sudo tee /etc/systemd/system/code-server-monitor.service > /dev/null <<EOF
[Unit]
Description=Code Server Performance Monitor
After=code-server.service

[Service]
Type=simple
ExecStart=/usr/local/bin/code-server-monitor
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable code-server-monitor
    
    log "✅ تم تحسين Code Server"
}

# 3. Nginx optimizations
optimize_nginx() {
    log "🌐 تحسين Nginx..."
    
    # Calculate worker processes and connections
    local worker_processes=$CPU_CORES
    local worker_connections=2048
    
    # Backup original config
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # Create optimized nginx.conf
    sudo tee /etc/nginx/nginx.conf > /dev/null <<EOF
user www-data;
worker_processes ${worker_processes};
worker_rlimit_nofile 65535;
pid /run/nginx.pid;

events {
    worker_connections ${worker_connections};
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 1000;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 100M;
    
    # Buffer settings
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
    
    # Timeout settings
    client_body_timeout 60s;
    client_header_timeout 60s;
    send_timeout 60s;
    
    # MIME
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for" '
                    'rt=\$request_time uct="\$upstream_connect_time" '
                    'uht="\$upstream_header_time" urt="\$upstream_response_time"';
    
    access_log /var/log/nginx/access.log main buffer=16k flush=2m;
    error_log /var/log/nginx/error.log warn;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        application/atom+xml
        application/geo+json
        application/javascript
        application/x-javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rdf+xml
        application/rss+xml
        application/xhtml+xml
        application/xml
        font/eot
        font/otf
        font/ttf
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml;
    
    # Rate Limiting
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone \$binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone \$binary_remote_addr zone=static:10m rate=200r/m;
    
    # Connection limiting
    limit_conn_zone \$binary_remote_addr zone=conn_limit_per_ip:10m;
    limit_conn_zone \$server_name zone=conn_limit_per_server:10m;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Cache settings
    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Include configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

    # Create cache directory
    sudo mkdir -p /var/cache/nginx/code-server
    sudo chown -R www-data:www-data /var/cache/nginx
    
    log "✅ تم تحسين Nginx"
}

# 4. Database optimizations
optimize_database() {
    log "🗄️ تحسين قاعدة البيانات..."
    
    # PostgreSQL optimizations
    local shared_buffers=$((TOTAL_RAM * 1024 / 4)) # 25% of RAM
    local effective_cache_size=$((TOTAL_RAM * 1024 * 3 / 4)) # 75% of RAM
    local work_mem=$((TOTAL_RAM * 1024 / 100)) # 1% of RAM
    
    sudo tee -a /etc/postgresql/*/main/postgresql.conf > /dev/null <<EOF

# Cursor Dev Platform Optimizations
shared_buffers = ${shared_buffers}MB
effective_cache_size = ${effective_cache_size}MB
work_mem = ${work_mem}MB
maintenance_work_mem = 256MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = ${CPU_CORES}
max_parallel_workers_per_gather = $((CPU_CORES / 2))
max_parallel_workers = ${CPU_CORES}
max_parallel_maintenance_workers = $((CPU_CORES / 2))
EOF

    # Redis optimizations
    sudo tee -a /etc/redis/redis.conf > /dev/null <<EOF

# Cursor Dev Platform Optimizations
maxmemory $((TOTAL_RAM * 1024 * 1024 * 1024 / 8))
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
tcp-keepalive 300
timeout 0
tcp-backlog 511
databases 16
EOF

    log "✅ تم تحسين قواعد البيانات"
}

# 5. File system optimizations
optimize_filesystem() {
    log "📁 تحسين نظام الملفات..."
    
    # Create optimized fstab entry for workspace
    if ! grep -q "/home/codeserver/workspace" /etc/fstab; then
        echo "tmpfs /home/codeserver/workspace/tmp tmpfs defaults,noatime,nosuid,nodev,noexec,mode=1777,size=1G 0 0" | sudo tee -a /etc/fstab
    fi
    
    # Set optimal mount options for development
    sudo mkdir -p /home/codeserver/workspace/tmp
    sudo mount -t tmpfs -o defaults,noatime,nosuid,nodev,noexec,mode=1777,size=1G tmpfs /home/codeserver/workspace/tmp
    
    # Optimize directory structure
    sudo mkdir -p /home/codeserver/{workspace,cache,logs,backups}
    sudo mkdir -p /home/codeserver/workspace/{projects,temp,node_modules_cache}
    
    # Set up npm cache optimization
    sudo -u codeserver npm config set cache /home/codeserver/cache/npm
    sudo -u codeserver npm config set tmp /home/codeserver/workspace/tmp
    
    # Create .bashrc optimizations for codeserver user
    sudo tee -a /home/codeserver/.bashrc > /dev/null <<'EOF'

# Cursor Dev Platform optimizations
export NODE_OPTIONS="--max-old-space-size=4096"
export NPM_CONFIG_CACHE="/home/codeserver/cache/npm"
export TMPDIR="/home/codeserver/workspace/tmp"
export HISTSIZE=10000
export HISTFILESIZE=20000

# Aliases for development
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git optimizations
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# Development shortcuts
alias serve='python3 -m http.server'
alias myip='curl -s https://ipinfo.io/ip'
alias ports='netstat -tulanp'
EOF

    log "✅ تم تحسين نظام الملفات"
}

# 6. Security optimizations
optimize_security() {
    log "🔒 تحسين الأمان..."
    
    # Enhanced fail2ban configuration
    sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd
destemail = admin@cursor-dev.local
sendername = Cursor-Dev-Security
mta = sendmail

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 600

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400

[code-server]
enabled = true
filter = code-server
logpath = /var/log/code-server/access.log
maxretry = 5
bantime = 1800
EOF

    # Create custom fail2ban filter for code-server
    sudo tee /etc/fail2ban/filter.d/code-server.conf > /dev/null <<EOF
[Definition]
failregex = ^.*\[.*\] .*"POST /login HTTP/.*" 401 .* ".*" ".*".*$
            ^.*\[.*\] .*"POST /login HTTP/.*" 403 .* ".*" ".*".*$
ignoreregex =
EOF

    # Configure automatic security updates
    sudo tee /etc/apt/apt.conf.d/20auto-upgrades > /dev/null <<EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

    log "✅ تم تحسين الأمان"
}

# 7. Monitoring and logging optimizations
optimize_monitoring() {
    log "📊 تحسين المراقبة والسجلات..."
    
    # Create comprehensive monitoring script
    sudo tee /usr/local/bin/cursor-performance-monitor > /dev/null <<'EOF'
#!/bin/bash

LOGDIR="/var/log/cursor-dev"
mkdir -p $LOGDIR

# System metrics
{
    echo "=== System Performance Report - $(date) ==="
    echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
    echo "Memory: $(free -h | awk 'NR==2{printf "%.1f/%.1fGB (%.2f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')"
    echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"
    echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
    echo "Active Connections: $(ss -tuln | wc -l)"
    echo ""
    
    # Service status
    echo "=== Service Status ==="
    systemctl is-active code-server && echo "✅ Code Server: Running" || echo "❌ Code Server: Stopped"
    systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
    systemctl is-active postgresql && echo "✅ PostgreSQL: Running" || echo "❌ PostgreSQL: Stopped"
    systemctl is-active redis-server && echo "✅ Redis: Running" || echo "❌ Redis: Stopped"
    systemctl is-active fail2ban && echo "✅ Fail2ban: Running" || echo "❌ Fail2ban: Stopped"
    echo ""
    
    # Code Server specific metrics
    if pgrep -f code-server > /dev/null; then
        PID=$(pgrep -f code-server)
        echo "=== Code Server Metrics ==="
        echo "PID: $PID"
        echo "CPU: $(ps -p $PID -o %cpu --no-headers)%"
        echo "Memory: $(ps -p $PID -o %mem --no-headers)%"
        echo "RSS: $(ps -p $PID -o rss --no-headers | awk '{printf "%.1fMB", $1/1024}') "
        echo "Connections: $(ss -tuln | grep :8080 | wc -l)"
        echo ""
    fi
    
    # Security metrics
    echo "=== Security Status ==="
    echo "Blocked IPs: $(fail2ban-client status | grep "Jail list" | awk -F: '{print $2}' | wc -w)"
    echo "Failed logins (last hour): $(journalctl --since="1 hour ago" | grep "Failed password" | wc -l)"
    echo "SSL Certificate: $(openssl x509 -in /etc/letsencrypt/live/*/fullchain.pem -noout -dates 2>/dev/null | grep "notAfter" || echo "Not configured")"
    echo ""
    
} >> "$LOGDIR/performance-$(date +%Y%m%d).log"
EOF

    sudo chmod +x /usr/local/bin/cursor-performance-monitor
    
    # Add to crontab for regular monitoring
    echo "*/5 * * * * /usr/local/bin/cursor-performance-monitor" | sudo crontab -u root -
    
    # Configure log rotation
    sudo tee /etc/logrotate.d/cursor-dev > /dev/null <<EOF
/var/log/cursor-dev/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}

/var/log/code-server/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 codeserver codeserver
}
EOF

    log "✅ تم تحسين المراقبة والسجلات"
}

# 8. Backup optimization
optimize_backup() {
    log "💾 تحسين النسخ الاحتياطي..."
    
    # Enhanced backup script
    sudo tee /usr/local/bin/cursor-smart-backup > /dev/null <<'EOF'
#!/bin/bash

BACKUP_DIR="/home/codeserver/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cursor-backup-${DATE}.tar.gz"
LOG_FILE="/var/log/cursor-dev/backup.log"

mkdir -p "$BACKUP_DIR" "/var/log/cursor-dev"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "Starting backup: $BACKUP_FILE"

# Create incremental backup
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" \
    -C /home/codeserver \
    --exclude='workspace/node_modules' \
    --exclude='workspace/.git' \
    --exclude='workspace/dist' \
    --exclude='workspace/build' \
    --exclude='workspace/tmp' \
    --exclude='cache' \
    --exclude='.npm' \
    --exclude='.cache' \
    workspace \
    .config/code-server \
    extensions \
    .bashrc \
    .gitconfig 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
    log_message "Backup completed successfully: $BACKUP_FILE ($SIZE)"
    
    # Keep only last 7 daily backups and 4 weekly backups
    find "$BACKUP_DIR" -name "cursor-backup-*.tar.gz" -mtime +7 -delete
    
    # Create weekly backup (every Sunday)
    if [ $(date +%u) -eq 7 ]; then
        WEEKLY_BACKUP="cursor-weekly-backup-$(date +%Y%W).tar.gz"
        cp "${BACKUP_DIR}/${BACKUP_FILE}" "${BACKUP_DIR}/${WEEKLY_BACKUP}"
        log_message "Weekly backup created: $WEEKLY_BACKUP"
        
        # Keep only last 4 weekly backups
        find "$BACKUP_DIR" -name "cursor-weekly-backup-*.tar.gz" -mtime +28 -delete
    fi
    
    # Verify backup integrity
    if tar -tzf "${BACKUP_DIR}/${BACKUP_FILE}" > /dev/null 2>&1; then
        log_message "Backup integrity verified: $BACKUP_FILE"
    else
        log_message "ERROR: Backup integrity check failed: $BACKUP_FILE"
        exit 1
    fi
    
else
    log_message "ERROR: Backup failed"
    exit 1
fi

# Cleanup old logs
find "/var/log/cursor-dev" -name "*.log" -mtime +30 -delete

log_message "Backup process completed"
EOF

    sudo chmod +x /usr/local/bin/cursor-smart-backup
    
    # Schedule smart backups
    echo "0 2 * * * /usr/local/bin/cursor-smart-backup" | sudo crontab -u codeserver -
    
    log "✅ تم تحسين النسخ الاحتياطي"
}

# 9. Apply all optimizations
apply_optimizations() {
    log "🚀 تطبيق جميع التحسينات..."
    
    optimize_system
    optimize_code_server
    optimize_nginx
    optimize_database
    optimize_filesystem
    optimize_security
    optimize_monitoring
    optimize_backup
    
    # Restart services to apply changes
    log "🔄 إعادة تشغيل الخدمات..."
    sudo systemctl daemon-reload
    sudo systemctl restart code-server
    sudo systemctl restart nginx
    sudo systemctl restart postgresql
    sudo systemctl restart redis-server
    sudo systemctl restart fail2ban
    
    # Start new services
    sudo systemctl enable --now code-server-monitor
    
    log "✅ تم تطبيق جميع التحسينات بنجاح!"
}

# 10. Performance test
run_performance_test() {
    log "🧪 تشغيل اختبار الأداء..."
    
    # System performance test
    echo -e "${YELLOW}=== System Performance Test ===${NC}"
    
    # CPU test
    echo -n "CPU Performance: "
    cpu_score=$(timeout 10s yes > /dev/null & sleep 1; ps -p $! -o %cpu --no-headers 2>/dev/null || echo "0")
    echo "${cpu_score}% utilization"
    
    # Memory test
    echo -n "Memory Performance: "
    mem_available=$(free -m | awk 'NR==2{printf "%.1f", $7/1024}')
    echo "${mem_available}GB available"
    
    # Disk I/O test
    echo -n "Disk I/O Performance: "
    disk_speed=$(dd if=/dev/zero of=/tmp/test bs=1M count=100 2>&1 | grep -o '[0-9.]* MB/s' | tail -1)
    rm -f /tmp/test
    echo "$disk_speed"
    
    # Network test
    echo -n "Network Performance: "
    if command -v curl > /dev/null; then
        network_speed=$(curl -o /dev/null -s -w '%{speed_download}' http://speedtest.wdc01.softlayer.com/downloads/test10.zip | awk '{printf "%.1f MB/s", $1/1024/1024}')
        echo "$network_speed"
    else
        echo "curl not available"
    fi
    
    # Service response test
    echo -e "${YELLOW}=== Service Response Test ===${NC}"
    
    # Code Server response
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|302"; then
        response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:8080)
        echo "Code Server: ✅ (${response_time}s response time)"
    else
        echo "Code Server: ❌ Not responding"
    fi
    
    # Nginx response
    if systemctl is-active --quiet nginx; then
        echo "Nginx: ✅ Running"
    else
        echo "Nginx: ❌ Not running"
    fi
    
    # Database response
    if systemctl is-active --quiet postgresql; then
        echo "PostgreSQL: ✅ Running"
    else
        echo "PostgreSQL: ❌ Not running"
    fi
    
    log "✅ اختبار الأداء مكتمل"
}

# Main execution
case "${1:-all}" in
    "system")
        optimize_system
        ;;
    "code-server")
        optimize_code_server
        ;;
    "nginx")
        optimize_nginx
        ;;
    "database")
        optimize_database
        ;;
    "filesystem")
        optimize_filesystem
        ;;
    "security")
        optimize_security
        ;;
    "monitoring")
        optimize_monitoring
        ;;
    "backup")
        optimize_backup
        ;;
    "test")
        run_performance_test
        ;;
    "all"|*)
        apply_optimizations
        run_performance_test
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Cursor Dev Platform Optimization Complete!${NC}"
echo -e "${CYAN}=============================================${NC}"
echo -e "${BLUE}System optimized for maximum development performance${NC}"
echo -e "${BLUE}Monitor performance: /usr/local/bin/cursor-performance-monitor${NC}"
echo -e "${BLUE}View logs: tail -f /var/log/cursor-dev/performance-$(date +%Y%m%d).log${NC}"
echo ""
