#!/bin/bash
# Network optimization script for stable connections

echo "Optimizing network settings for stable connections..."

# TCP Keepalive settings (more aggressive for stability)
sudo sysctl -w net.ipv4.tcp_keepalive_time=600 2>/dev/null || true
sudo sysctl -w net.ipv4.tcp_keepalive_intvl=60 2>/dev/null || true
sudo sysctl -w net.ipv4.tcp_keepalive_probes=5 2>/dev/null || true

# TCP connection tracking and timeouts
sudo sysctl -w net.ipv4.tcp_fin_timeout=30 2>/dev/null || true
sudo sysctl -w net.ipv4.tcp_tw_reuse=1 2>/dev/null || true

# Buffer sizes for better throughput
sudo sysctl -w net.core.rmem_max=16777216 2>/dev/null || true
sudo sysctl -w net.core.wmem_max=16777216 2>/dev/null || true
sudo sysctl -w net.ipv4.tcp_rmem="4096 87380 16777216" 2>/dev/null || true
sudo sysctl -w net.ipv4.tcp_wmem="4096 65536 16777216" 2>/dev/null || true

# Make settings persistent
if [ -f /etc/sysctl.conf ]; then
    if ! grep -q "tcp_keepalive_time" /etc/sysctl.conf; then
        echo "" | sudo tee -a /etc/sysctl.conf
        echo "# Network optimization for stable connections" | sudo tee -a /etc/sysctl.conf
        echo "net.ipv4.tcp_keepalive_time=600" | sudo tee -a /etc/sysctl.conf
        echo "net.ipv4.tcp_keepalive_intvl=60" | sudo tee -a /etc/sysctl.conf
        echo "net.ipv4.tcp_keepalive_probes=5" | sudo tee -a /etc/sysctl.conf
        echo "net.ipv4.tcp_fin_timeout=30" | sudo tee -a /etc/sysctl.conf
        echo "net.ipv4.tcp_tw_reuse=1" | sudo tee -a /etc/sysctl.conf
    fi
fi

echo "✓ Network settings optimized"
