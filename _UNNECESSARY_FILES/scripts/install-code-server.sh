#!/bin/bash

# 🚀 Cursor Dev Platform - Code Server Installation Script
# المنصة المتكاملة لتطوير البرمجيات مع أفضل أداء ممكن

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
CODE_SERVER_VERSION="4.19.1"
DOMAIN="${1:-cursor-dev.local}"
EMAIL="${2:-admin@cursor-dev.local}"
SERVER_PORT="8080"
HTTPS_PORT="443"
HTTP_PORT="80"

# System info
TOTAL_RAM=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
CPU_CORES=$(nproc)

echo -e "${PURPLE}🚀 Cursor Dev Platform Installation${NC}"
echo -e "${CYAN}=================================${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}System: ${CPU_CORES} cores, ${TOTAL_RAM}GB RAM${NC}"
echo ""

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo -e "${YELLOW}🔧 Installing essential packages...${NC}"
sudo apt install -y \
    curl wget git unzip \
    nginx certbot python3-certbot-nginx \
    htop iotop nethogs \
    build-essential \
    nodejs npm \
    docker.io docker-compose \
    fail2ban ufw \
    redis-server \
    postgresql postgresql-contrib

# Install code-server
echo -e "${YELLOW}💻 Installing code-server v${CODE_SERVER_VERSION}...${NC}"
curl -fsSL https://code-server.dev/install.sh | sh -s -- --version=${CODE_SERVER_VERSION}

# Create code-server user
echo -e "${YELLOW}👤 Creating code-server user...${NC}"
sudo useradd -m -s /bin/bash codeserver || true
sudo usermod -aG docker codeserver

# Create directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
sudo mkdir -p /home/codeserver/{.config/code-server,workspace,extensions,backups}
sudo mkdir -p /var/log/code-server
sudo mkdir -p /etc/nginx/ssl

# Generate strong password
CODE_SERVER_PASSWORD=$(openssl rand -base64 32)
echo -e "${GREEN}🔐 Generated password: ${CODE_SERVER_PASSWORD}${NC}"

# Configure code-server
echo -e "${YELLOW}⚙️ Configuring code-server...${NC}"
sudo tee /home/codeserver/.config/code-server/config.yaml > /dev/null <<EOF
bind-addr: 127.0.0.1:${SERVER_PORT}
auth: password
password: ${CODE_SERVER_PASSWORD}
cert: false
disable-telemetry: true
disable-update-check: true
log: info
verbose: false
user-data-dir: /home/codeserver/.local/share/code-server
extensions-dir: /home/codeserver/extensions
EOF

# Performance optimizations
echo -e "${YELLOW}⚡ Applying performance optimizations...${NC}"

# Increase file watchers
echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf

# Optimize for development workloads
sudo tee -a /etc/sysctl.conf > /dev/null <<EOF
# Network optimizations
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 65536 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.core.netdev_max_backlog = 5000

# File system optimizations
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
vm.swappiness = 10
EOF

sudo sysctl -p

# Create systemd service
echo -e "${YELLOW}🔄 Creating systemd service...${NC}"
sudo tee /etc/systemd/system/code-server.service > /dev/null <<EOF
[Unit]
Description=Code Server - Cursor Dev Platform
Documentation=https://github.com/coder/code-server
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=codeserver
Group=codeserver
Environment=PASSWORD=${CODE_SERVER_PASSWORD}
ExecStart=/usr/bin/code-server --config /home/codeserver/.config/code-server/config.yaml
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
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
EOF

# Configure Nginx with SSL
echo -e "${YELLOW}🌐 Configuring Nginx with SSL...${NC}"
sudo tee /etc/nginx/sites-available/code-server > /dev/null <<EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=login:10m rate=10r/m;
limit_req_zone \$binary_remote_addr zone=api:10m rate=100r/m;

# Upstream
upstream code-server {
    server 127.0.0.1:${SERVER_PORT};
    keepalive 32;
}

server {
    listen ${HTTP_PORT};
    server_name ${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen ${HTTPS_PORT} ssl http2;
    server_name ${DOMAIN};

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Client settings
    client_max_body_size 100M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Proxy settings
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection upgrade;
    proxy_set_header Accept-Encoding gzip;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;

    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    location / {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://code-server;
    }

    location /login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://code-server;
    }

    # WebSocket support
    location ~* \.(ws|wss)$ {
        proxy_pass http://code-server;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://code-server;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/code-server /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow ${HTTP_PORT}
sudo ufw allow ${HTTPS_PORT}

# Configure fail2ban
echo -e "${YELLOW}🛡️ Configuring fail2ban...${NC}"
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

# Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
sudo chown -R codeserver:codeserver /home/codeserver
sudo chmod 700 /home/codeserver/.config
sudo chmod 600 /home/codeserver/.config/code-server/config.yaml

# Get SSL certificate
echo -e "${YELLOW}🔒 Obtaining SSL certificate...${NC}"
sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} --redirect

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable --now code-server
sudo systemctl enable --now nginx
sudo systemctl enable --now fail2ban
sudo systemctl restart redis-server
sudo systemctl restart postgresql

# Create monitoring script
echo -e "${YELLOW}📊 Creating monitoring script...${NC}"
sudo tee /usr/local/bin/cursor-monitor > /dev/null <<'EOF'
#!/bin/bash
echo "=== Cursor Dev Platform Status ==="
echo "Date: $(date)"
echo ""
echo "=== System Resources ==="
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory: $(free -h | awk 'NR==2{printf "%.1f/%.1fGB (%.2f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')"
echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"
echo ""
echo "=== Services Status ==="
systemctl is-active --quiet code-server && echo "✅ Code Server: Running" || echo "❌ Code Server: Stopped"
systemctl is-active --quiet nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
systemctl is-active --quiet fail2ban && echo "✅ Fail2ban: Running" || echo "❌ Fail2ban: Stopped"
echo ""
echo "=== Network ==="
echo "Active connections: $(ss -tuln | wc -l)"
echo "Nginx access logs (last hour): $(journalctl -u nginx --since="1 hour ago" | wc -l)"
echo ""
echo "=== Code Server ==="
echo "Process: $(pgrep -f code-server | wc -l) instances"
echo "Memory usage: $(ps -o pid,vsz,rss,comm -p $(pgrep -f code-server) 2>/dev/null | tail -n +2 | awk '{sum+=$3} END {printf "%.1fMB", sum/1024}')"
EOF

sudo chmod +x /usr/local/bin/cursor-monitor

# Create backup script
echo -e "${YELLOW}💾 Creating backup script...${NC}"
sudo tee /usr/local/bin/cursor-backup > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/codeserver/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cursor-backup-${DATE}.tar.gz"

echo "Creating backup: ${BACKUP_FILE}"
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" \
    -C /home/codeserver \
    workspace \
    .config/code-server \
    extensions \
    --exclude='workspace/node_modules' \
    --exclude='workspace/.git' \
    --exclude='workspace/dist' \
    --exclude='workspace/build'

# Keep only last 7 backups
find "${BACKUP_DIR}" -name "cursor-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}"
ls -lh "${BACKUP_DIR}/${BACKUP_FILE}"
EOF

sudo chmod +x /usr/local/bin/cursor-backup

# Create daily backup cron
echo "0 2 * * * /usr/local/bin/cursor-backup" | sudo crontab -u codeserver -

# Final status check
echo -e "${GREEN}✅ Installation completed successfully!${NC}"
echo ""
echo -e "${PURPLE}🎉 Cursor Dev Platform is ready!${NC}"
echo -e "${CYAN}=================================${NC}"
echo -e "${BLUE}🌐 URL: https://${DOMAIN}${NC}"
echo -e "${BLUE}🔐 Password: ${CODE_SERVER_PASSWORD}${NC}"
echo -e "${BLUE}📁 Workspace: /home/codeserver/workspace${NC}"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "${GREEN}  Monitor: sudo /usr/local/bin/cursor-monitor${NC}"
echo -e "${GREEN}  Backup: sudo /usr/local/bin/cursor-backup${NC}"
echo -e "${GREEN}  Logs: journalctl -u code-server -f${NC}"
echo -e "${GREEN}  Restart: sudo systemctl restart code-server${NC}"
echo ""
echo -e "${YELLOW}🔧 Next steps:${NC}"
echo -e "${GREEN}  1. Save the password above${NC}"
echo -e "${GREEN}  2. Visit https://${DOMAIN}${NC}"
echo -e "${GREEN}  3. Install your favorite extensions${NC}"
echo -e "${GREEN}  4. Start coding!${NC}"

# Save credentials
echo "DOMAIN=${DOMAIN}" | sudo tee /home/codeserver/.cursor-credentials
echo "PASSWORD=${CODE_SERVER_PASSWORD}" | sudo tee -a /home/codeserver/.cursor-credentials
sudo chown codeserver:codeserver /home/codeserver/.cursor-credentials
sudo chmod 600 /home/codeserver/.cursor-credentials

echo -e "${GREEN}💾 Credentials saved to: /home/codeserver/.cursor-credentials${NC}"
