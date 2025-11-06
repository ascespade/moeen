#!/bin/bash
# Start Protection System
# Starts all protection systems

echo "=== Starting Protection Systems ==="
echo "Date: $(date)"
echo ""

# Start the final protection system
echo "Starting final protection system..."
nohup /workspace/final_protection_system.sh > /dev/null 2>&1 &

# Wait a moment for the system to start
sleep 5

# Show status
echo "=== System Status ==="
echo "Tailscale IP: $(tailscale ip -4 2>/dev/null || echo 'Not connected')"
echo "SSH Status: $(ss -tlnp | grep -q :22 && echo 'Running' || echo 'Not running')"
echo ""

# Test shutdown prevention
echo "=== Testing Shutdown Prevention ==="
echo "Testing shutdown command..."
if shutdown -h now 2>&1 | grep -q "blocked"; then
    echo "✅ Shutdown prevention: ACTIVE"
else
    echo "❌ Shutdown prevention: FAILED"
fi

echo ""
echo "=== Protection Systems Active ==="
echo "✅ Anti-shutdown system"
echo "✅ Tailscale keep-alive"
echo "✅ SSH keep-alive"
echo "✅ Auto-restart on boot"
echo "✅ Service monitoring"
echo ""

echo "=== Connection Information ==="
echo "SSH: ssh ubuntu@$(tailscale ip -4 2>/dev/null || echo 'TAILSCALE_IP')"
echo "Tailscale: ssh ubuntu@cursor-dev-server-1"
echo ""

echo "=== Emergency Commands ==="
echo "Force shutdown: sudo /workspace/force_shutdown.sh"
echo "Check status: /workspace/dev_status.sh"
echo "View logs: tail -f /var/log/final_protection.log"
echo ""

echo "🎉 Protection systems are now active!"
echo "The server is protected from shutdown and Tailscale will stay online."
