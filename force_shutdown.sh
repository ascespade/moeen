#!/bin/bash
# Force Shutdown Script (Emergency use only)
echo "WARNING: This will force shutdown the server!"
echo "Press Ctrl+C to cancel, or wait 10 seconds to continue..."
sleep 10

# Restore original commands
sudo rm -f /usr/local/bin/shutdown
sudo rm -f /usr/local/bin/poweroff
sudo rm -f /usr/local/bin/reboot
sudo rm -f /usr/local/bin/halt

# Execute shutdown
sudo /sbin/shutdown -h now
