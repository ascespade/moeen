#!/bin/bash
# Setup Triple Protection for Tailscale
# إعداد الحماية الثلاثية لـ Tailscale

echo "═══════════════════════════════════════════════════════════"
echo "🛡️  TAILSCALE TRIPLE PROTECTION SETUP"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Tailscale API Key
TAILSCALE_API_KEY="tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX"

# Check if Tailscale is installed
if ! command -v tailscale &> /dev/null; then
    echo "📦 Installing Tailscale..."
    
    # Detect OS and install
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        echo "❌ Cannot detect OS"
        exit 1
    fi
    
    case $OS in
        ubuntu|debian)
            curl -fsSL https://tailscale.com/install.sh | sh
            ;;
        *)
            echo "❌ Unsupported OS: $OS"
            echo "Please install Tailscale manually from https://tailscale.com/download"
            exit 1
            ;;
    esac
fi

# Authenticate Tailscale with API key
echo "🔑 Authenticating Tailscale..."
if ! tailscale status &>/dev/null; then
    echo "$TAILSCALE_API_KEY" | tailscale up --authkey - || {
        echo "❌ Failed to authenticate Tailscale"
        exit 1
    }
    echo "✅ Tailscale authenticated"
else
    echo "✅ Tailscale already authenticated"
fi

# Stop all existing processes
echo "1️⃣ Stopping existing processes..."
pkill tailscale-watchdog 2>/dev/null || true
pkill tailscale-monitor 2>/dev/null || true
pkill keep-tailscale-alive 2>/dev/null || true
pkill tailscale-supervisor 2>/dev/null || true
sleep 2

# Start Supervisor (which starts all layers)
echo "2️⃣ Starting Supervisor (Master Controller)..."
nohup /workspace/tailscale-supervisor.sh > /dev/null 2>&1 &
SUPERVISOR_PID=$!
echo "   ✅ Supervisor started (PID: $SUPERVISOR_PID)"

sleep 5

# Setup Cron job for health check (every 2 minutes)
echo ""
echo "3️⃣ Setting up Cron health check..."
(crontab -l 2>/dev/null | grep -v "tailscale-health-check"; echo "*/2 * * * * /workspace/tailscale-health-check.sh > /dev/null 2>&1") | crontab -
echo "   ✅ Cron job added (runs every 2 minutes)"

# Verify all processes
echo ""
echo "4️⃣ Verifying all protection layers..."
sleep 3

echo ""
echo "📊 Status Check:"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Supervisor
if ps aux | grep -q "[t]ailscale-supervisor.sh"; then
    echo "   ✅ Layer 3: Supervisor - RUNNING"
else
    echo "   ❌ Layer 3: Supervisor - NOT RUNNING"
fi

# Check Watchdog
if ps aux | grep -q "[t]ailscale-watchdog.sh"; then
    echo "   ✅ Layer 1: Watchdog - RUNNING"
else
    echo "   ❌ Layer 1: Watchdog - NOT RUNNING"
fi

# Check Keep-alive
if ps aux | grep -q "[k]eep-tailscale-alive.sh"; then
    echo "   ✅ Layer 2: Keep-alive - RUNNING"
else
    echo "   ❌ Layer 2: Keep-alive - NOT RUNNING"
fi

# Check Monitor
if ps aux | grep -q "[t]ailscale-monitor.sh"; then
    echo "   ✅ Layer 2: Monitor - RUNNING"
else
    echo "   ❌ Layer 2: Monitor - NOT RUNNING"
fi

# Check Tailscale
if ps aux | grep -q "[t]ailscaled"; then
    TS_IP=$(tailscale ip -4 2>/dev/null || echo "N/A")
    echo "   ✅ Tailscale daemon - RUNNING (IP: $TS_IP)"
else
    echo "   ❌ Tailscale daemon - NOT RUNNING"
fi

# Check Cron
if crontab -l 2>/dev/null | grep -q "tailscale-health-check"; then
    echo "   ✅ Layer 3: Cron Health Check - ACTIVE"
else
    echo "   ❌ Layer 3: Cron Health Check - NOT ACTIVE"
fi

echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ TRIPLE PROTECTION SETUP COMPLETE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Protection Layers:"
echo "   Layer 1: Watchdog (checks every 15s)"
echo "   Layer 2: Keep-alive + Monitor (continuous)"
echo "   Layer 3: Supervisor + Cron (checks every 2min)"
echo ""
echo "📝 Logs:"
echo "   /workspace/tailscale-watchdog.log"
echo "   /workspace/tailscale-health.log"
echo "   /workspace/tailscale-supervisor.log"
echo "   /workspace/tailscale-monitor.log"
echo ""
echo "🔍 Check status:"
echo "   ps aux | grep tailscale"
echo "   tailscale status"
echo ""
echo "═══════════════════════════════════════════════════════════"
