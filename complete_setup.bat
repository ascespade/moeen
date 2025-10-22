@echo off
echo 🔑 Complete SSH Setup
echo ====================

echo.
echo 📋 Step 1: Connect to server and setup SSH keys
echo Please run these commands manually:
echo.
echo ssh ubuntu@100.64.64.33
echo Password: root
echo.
echo Then on the server, run:
echo mkdir -p ~/.ssh
echo chmod 700 ~/.ssh
echo cat ~/my_public_key.txt ^>^> ~/.ssh/authorized_keys
echo chmod 600 ~/.ssh/authorized_keys
echo rm ~/my_public_key.txt
echo.
echo 📋 Step 2: Setup Tailscale for background service
echo sudo tailscale down
echo sudo tailscale up --accept-routes --accept-dns=false
echo sudo systemctl enable tailscaled
echo sudo systemctl start tailscaled
echo.
echo 📋 Step 3: Test the setup
echo exit
echo ssh ubuntu@100.64.64.33
echo.
echo ✅ After completing these steps:
echo    - SSH will work without password
echo    - Tailscale will run in background
echo    - No password needed when closing Cursor
echo.
echo Press any key to continue...
pause >nul

echo.
echo 🧪 Testing current setup...
python test_ssh_connection.py

echo.
echo Press any key to exit...
pause >nul
