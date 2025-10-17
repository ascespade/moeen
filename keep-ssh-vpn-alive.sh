#!/bin/bash
while true; do
    if ! pgrep -f "sshd" > /dev/null; then
        echo "$(date): Restarting SSH service..."
        sudo service ssh restart
    fi
    sleep 30
done
