#!/bin/bash
while true; do
    if ! pgrep -f "ssh.*-R" > /dev/null; then
        echo "$(date): No active SSH tunnels found"
    fi
    sleep 30
done
