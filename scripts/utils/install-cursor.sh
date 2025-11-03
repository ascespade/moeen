#!/bin/bash
# Script to install Cursor IDE
# Note: This requires manual download as automated downloads are not available

echo "==================================="
echo "Cursor IDE Installation Script"
echo "==================================="
echo ""

CURSOR_DEB="/tmp/cursor.deb"

if [ -f "$CURSOR_DEB" ] && [ -s "$CURSOR_DEB" ]; then
    echo "Found Cursor package: $CURSOR_DEB"
    echo "Installing Cursor IDE..."
    sudo dpkg -i "$CURSOR_DEB" 2>&1 || sudo apt-get install -f -y
    echo ""
    echo "Cursor IDE installation completed!"
    echo "You can now launch it with: cursor"
else
    echo "Cursor package not found at $CURSOR_DEB"
    echo ""
    echo "Manual Installation Instructions:"
    echo "================================="
    echo "1. On your local Windows machine, visit: https://cursor.sh"
    echo "2. Download the Linux .deb package (64-bit)"
    echo "3. Transfer the file to this server using one of these methods:"
    echo ""
    echo "   Option A - Using SCP (from Windows PowerShell/CMD):"
    echo "   scp cursor.deb ubuntu@SERVER_IP:/tmp/cursor.deb"
    echo ""
    echo "   Option B - Using SFTP or file transfer tool"
    echo ""
    echo "4. Once the file is on the server, run this script again:"
    echo "   bash /workspace/install-cursor.sh"
    echo ""
    echo "   Or install manually:"
    echo "   sudo dpkg -i /tmp/cursor.deb"
    echo "   sudo apt-get install -f -y"
    echo ""
    echo "5. Launch Cursor:"
    echo "   cursor"
    echo ""
fi
