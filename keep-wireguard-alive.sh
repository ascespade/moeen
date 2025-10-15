#!/bin/bash
while true; do
    if ! sudo wg show > /dev/null 2>&1; then
        echo "$(date): Restarting WireGuard..."
        sudo wg-quick down wg0 2>/dev/null || true
        sudo wg-quick up wg0
    fi
    sleep 30
done
