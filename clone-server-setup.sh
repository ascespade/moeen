#!/bin/bash
# Complete Server Clone Setup Script
# Clones this server's configuration with Tailscale + Protection from shutdown
# إنشاء نسخة طبق الأصل من السيرفر مع Tailscale والحماية من الإيقاف

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🚀 SERVER CLONE SETUP - TAILSCALE + PROTECTION     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    error "Please run as root or with sudo"
    exit 1
fi

# ============================================
# STEP 1: Install Tailscale
# ============================================
log "Step 1: Installing Tailscale..."

if ! command -v tailscale &> /dev/null; then
    curl -fsSL https://tailscale.com/install.sh | sh
    log "✅ Tailscale installed"
else
    log "✅ Tailscale already installed"
fi

# ============================================
# STEP 2: Create Directories
# ============================================
log "Step 2: Creating directories..."

mkdir -p /workspace
mkdir -p /var/lib/tailscale
mkdir -p /var/run/tailscale
chmod 755 /var/lib/tailscale /var/run/tailscale

log "✅ Directories created"

# ============================================
# STEP 3: Setup Protection Scripts
# ============================================
log "Step 3: Setting up protection scripts..."

# Keep-Alive Script
cat > /workspace/keep-tailscale-alive.sh << 'KEEPALIVE_EOF'
#!/bin/bash
# Keep Tailscale Always Alive - منع إيقاف Tailscale

LOG_FILE="/workspace/tailscale-keepalive.log"
LOCK_FILE="/tmp/tailscale-keepalive.lock"

if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        exit 0
    fi
    rm -f "$LOCK_FILE"
fi

echo $$ > "$LOCK_FILE"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

start_tailscale() {
    log "🚀 Starting Tailscale..."
    pkill tailscaled 2>/dev/null
    sleep 1
    mkdir -p /var/lib/tailscale /var/run/tailscale
    chmod 755 /var/lib/tailscale /var/run/tailscale
    tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
    sleep 5
    if ps aux | grep -q "[t]ailscaled"; then
        log "✅ Tailscale started"
        return 0
    else
        log "❌ Failed to start"
        return 1
    fi
}

while true; do
    if ! ps aux | grep -q "[t]ailscaled"; then
        log "⚠️  tailscaled not running, restarting..."
        start_tailscale
        sleep 10
        continue
    fi

    if ! tailscale status > /dev/null 2>&1; then
        log "⚠️  Connection lost, restarting..."
        pkill tailscaled 2>/dev/null
        sleep 2
        start_tailscale
        sleep 10
        continue
    fi

    TS_PID=$(ps aux | grep "[t]ailscaled" | awk '{print $2}' | head -1)
    if [ ! -z "$TS_PID" ]; then
        renice -n -20 -p $TS_PID 2>/dev/null
    fi

    sleep 30
done
KEEPALIVE_EOF

chmod +x /workspace/keep-tailscale-alive.sh

# Health Check Script
cat > /workspace/tailscale-health-check.sh << 'HEALTH_EOF'
#!/bin/bash
# Tailscale Health Check

LOG_FILE="/workspace/tailscale-health.log"

check_health() {
    if ! ps aux | grep -q "[t]ailscaled"; then
        echo "CRITICAL: tailscaled not running"
        return 1
    fi

    if ! tailscale status > /dev/null 2>&1; then
        echo "CRITICAL: Tailscale not responding"
        return 1
    fi

    IP=$(tailscale ip -4 2>/dev/null)
    if [ -z "$IP" ]; then
        echo "WARNING: No Tailscale IP"
        return 2
    fi

    echo "OK: Tailscale healthy (IP: $IP)"
    return 0
}

HEALTH=$(check_health)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $HEALTH" >> "$LOG_FILE"
    if [ $EXIT_CODE -eq 1 ]; then
        pkill tailscaled 2>/dev/null
        sleep 2
        tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
        sleep 5
        if ! tailscale status > /dev/null 2>&1; then
            warning "Tailscale needs authentication. Run: sudo tailscale up"
        fi
    fi
fi

exit $EXIT_CODE
HEALTH_EOF

chmod +x /workspace/tailscale-health-check.sh

# Monitor Script
cat > /workspace/tailscale-monitor.sh << 'MONITOR_EOF'
#!/bin/bash
# Tailscale Monitor & Auto-Restart

LOG_FILE="/workspace/tailscale-monitor.log"
LOCK_FILE="/tmp/tailscale-monitor.lock"

if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        exit 0
    fi
    rm -f "$LOCK_FILE"
fi

echo $$ > "$LOCK_FILE"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_tailscale() {
    if ! ps aux | grep -q "[t]ailscaled"; then
        return 1
    fi
    if ! tailscale status > /dev/null 2>&1; then
        return 1
    fi
    STATUS=$(tailscale status 2>/dev/null | head -1)
    if [ -z "$STATUS" ] || echo "$STATUS" | grep -q "Logged out"; then
        return 1
    fi
    return 0
}

restart_tailscale() {
    log "🔄 Restarting Tailscale..."
    pkill tailscaled 2>/dev/null
    sleep 2
    if systemctl is-system-running > /dev/null 2>&1; then
        systemctl start tailscaled 2>/dev/null
    else
        tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
    fi
    sleep 3
    if ps aux | grep -q "[t]ailscaled"; then
        log "✅ Restarted successfully"
        return 0
    else
        log "❌ Failed to restart"
        return 1
    fi
}

prevent_shutdown() {
    if systemctl is-system-running > /dev/null 2>&1; then
        systemctl unmask tailscaled 2>/dev/null
        systemctl enable tailscaled 2>/dev/null
    fi
}

prevent_shutdown
log "🚀 Monitor started (PID: $$)"

while true; do
    if ! check_tailscale; then
        log "❌ Check failed, restarting..."
        restart_tailscale
        if ! check_tailscale; then
            log "⚠️  Retrying in 30 seconds..."
            sleep 30
            restart_tailscale
        fi
    else
        STATUS=$(tailscale status 2>/dev/null | head -1)
        log "✅ Running: $(echo "$STATUS" | head -1)"
    fi
    sleep 60
done
MONITOR_EOF

chmod +x /workspace/tailscale-monitor.sh

log "✅ Protection scripts created"

# ============================================
# STEP 4: Prevent Shutdown
# ============================================
log "Step 4: Configuring shutdown prevention..."

if systemctl is-system-running > /dev/null 2>&1; then
    # Disable suspend/hibernate
    systemctl mask systemd-hibernate.service 2>/dev/null || true
    systemctl mask systemd-suspend.service 2>/dev/null || true

    # Enable Tailscale
    systemctl unmask tailscaled 2>/dev/null || true
    systemctl enable tailscaled 2>/dev/null || true

    # Create systemd service for keep-alive
    cat > /etc/systemd/system/tailscale-keepalive.service << 'SERVICE_EOF'
[Unit]
Description=Tailscale Keep-Alive Protection
After=network.target

[Service]
Type=simple
ExecStart=/workspace/keep-tailscale-alive.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE_EOF

    systemctl daemon-reload
    systemctl enable tailscale-keepalive.service 2>/dev/null || true

    log "✅ Systemd protection configured"
else
    warning "Systemd not available, using direct monitoring"
fi

# ============================================
# STEP 5: Setup Cron Jobs
# ============================================
log "Step 5: Setting up cron jobs..."

# Health check every 5 minutes
(crontab -l 2>/dev/null | grep -v "tailscale-health-check"; echo "*/5 * * * * /workspace/tailscale-health-check.sh > /dev/null 2>&1") | crontab -

log "✅ Cron jobs configured"

# ============================================
# STEP 6: Start Services
# ============================================
log "Step 6: Starting protection services..."

# Start keep-alive
nohup /workspace/keep-tailscale-alive.sh > /dev/null 2>&1 &
KEEPALIVE_PID=$!

# Start monitor
nohup /workspace/tailscale-monitor.sh > /dev/null 2>&1 &
MONITOR_PID=$!

log "✅ Keep-alive started (PID: $KEEPALIVE_PID)"
log "✅ Monitor started (PID: $MONITOR_PID)"

# ============================================
# STEP 7: SSH Server Configuration
# ============================================
log "Step 7: Configuring SSH server..."

# Backup current SSH config
if [ -f /etc/ssh/sshd_config ]; then
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
    log "✅ SSH config backed up"
fi

# Create optimized SSH config
cat > /etc/ssh/sshd_config << 'SSH_EOF'
# SSH Server Configuration - Optimized for Stability
# Port
Port 22
Protocol 2

# Authentication
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication yes
PermitRootLogin no

# Connection Stability
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 6
MaxStartups 10:30:100
LoginGraceTime 120

# Performance
MaxSessions 20
MaxAuthTries 6
Compression no

# Security
X11Forwarding no
AllowTcpForwarding yes
PermitTunnel yes

# Logging
SyslogFacility AUTH
LogLevel INFO
SSH_EOF

# Validate SSH config
if sshd -t 2>/dev/null; then
    log "✅ SSH config is valid"

    # Restart SSH service
    if systemctl is-system-running > /dev/null 2>&1; then
        systemctl restart sshd 2>/dev/null || systemctl restart ssh 2>/dev/null
        systemctl enable sshd 2>/dev/null || systemctl enable ssh 2>/dev/null
    else
        pkill sshd 2>/dev/null
        sleep 1
        /usr/sbin/sshd -D &
    fi

    sleep 2
    if ps aux | grep -q "[s]shd"; then
        log "✅ SSH server restarted"
    else
        warning "SSH server may need manual restart"
    fi
else
    error "SSH config has errors, using backup"
    if [ -f /etc/ssh/sshd_config.backup.* ]; then
        cp /etc/ssh/sshd_config.backup.* /etc/ssh/sshd_config
    fi
fi

# Setup SSH client config
log "Step 7.1: Setting up SSH client config..."

mkdir -p /root/.ssh /home/*/.ssh 2>/dev/null
chmod 700 /root/.ssh /home/*/.ssh 2>/dev/null

# SSH client config for stability
for SSH_DIR in /root/.ssh /home/*/.ssh; do
    if [ -d "$SSH_DIR" ]; then
        cat > "$SSH_DIR/config" << 'CLIENT_EOF'
# Stable SSH Connection Settings
Host *
    ServerAliveInterval 30
    ServerAliveCountMax 6
    Compression no
    ConnectTimeout 10
    ControlMaster auto
    ControlPath ~/.ssh/control-%h-%p-%r
    ControlPersist 600
    TCPKeepAlive yes
    ExitOnForwardFailure yes
    Cipher aes256-gcm@openssh.com
    GSSAPIAuthentication no
    IPQoS throughput
CLIENT_EOF
        chmod 600 "$SSH_DIR/config" 2>/dev/null
    fi
done

log "✅ SSH client config created"

# Setup passwordless SSH
log "Step 7.2: Setting up passwordless SSH..."

# Generate SSH key if not exists
if [ ! -f /root/.ssh/id_ed25519 ]; then
    ssh-keygen -t ed25519 -f /root/.ssh/id_ed25519 -N "" -q
    log "✅ SSH key generated"
fi

# Add to authorized_keys
PUBLIC_KEY=$(cat /root/.ssh/id_ed25519.pub 2>/dev/null)
if [ -n "$PUBLIC_KEY" ]; then
    mkdir -p /root/.ssh
    echo "$PUBLIC_KEY" >> /root/.ssh/authorized_keys
    chmod 600 /root/.ssh/authorized_keys
    chmod 700 /root/.ssh

    # Also add to ubuntu user if exists
    if id ubuntu &>/dev/null; then
        mkdir -p /home/ubuntu/.ssh
        echo "$PUBLIC_KEY" >> /home/ubuntu/.ssh/authorized_keys
        chown -R ubuntu:ubuntu /home/ubuntu/.ssh 2>/dev/null
        chmod 600 /home/ubuntu/.ssh/authorized_keys
        chmod 700 /home/ubuntu/.ssh
        log "✅ Passwordless SSH configured for ubuntu user"
    fi

    log "✅ Passwordless SSH configured"
    echo ""
    echo "📋 Your SSH Public Key:"
    echo "   $PUBLIC_KEY"
    echo ""
    echo "💡 Copy this key to other servers for passwordless access"
fi

# ============================================
# STEP 8: Initial Tailscale Setup
# ============================================
log "Step 8: Initial Tailscale setup..."

# Start tailscaled if not running
if ! ps aux | grep -q "[t]ailscaled"; then
    tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking > /tmp/tailscaled.log 2>&1 &
    sleep 5
fi

# Check status
if tailscale status > /dev/null 2>&1; then
    log "✅ Tailscale is running"
    tailscale status | head -5
else
    warning "Tailscale needs authentication"
    echo ""
    echo "📋 To authenticate, run:"
    echo "   sudo tailscale up"
    echo ""
    echo "Or visit: https://login.tailscale.com/admin/machines"
fi

# ============================================
# SUMMARY
# ============================================
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ SERVER CLONE SETUP COMPLETE                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Installed Components:"
echo "   ✅ Tailscale"
echo "   ✅ SSH Server (optimized)"
echo "   ✅ SSH Passwordless Authentication"
echo "   ✅ Keep-Alive Protection"
echo "   ✅ Health Check Monitor"
echo "   ✅ Auto-Restart Monitor"
echo "   ✅ Shutdown Prevention"
echo "   ✅ Cron Jobs"
echo ""
echo "📊 Protection Status:"
echo "   Keep-Alive PID: $KEEPALIVE_PID"
echo "   Monitor PID: $MONITOR_PID"
echo ""
echo "🔐 SSH Configuration:"
if [ -n "$PUBLIC_KEY" ]; then
    echo "   ✅ SSH Key Generated"
    echo "   ✅ Passwordless Auth Enabled"
    echo "   Public Key: ${PUBLIC_KEY:0:50}..."
else
    echo "   ⚠️  SSH Key generation skipped"
fi
echo ""
echo "📝 Next Steps:"
echo "   1. Authenticate Tailscale: sudo tailscale up"
echo "   2. Check SSH: ssh localhost (should work without password)"
echo "   3. Check status: tailscale status"
echo "   4. View logs: tail -f /workspace/tailscale-keepalive.log"
echo ""
echo "🛡️  Protection Features:"
echo "   ✅ Auto-restart if Tailscale stops"
echo "   ✅ Health check every 5 minutes"
echo "   ✅ Prevents shutdown/suspend"
echo "   ✅ Auto-start on boot"
echo ""
echo "══════════════════════════════════════════════════════════"
