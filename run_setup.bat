@echo off
echo 🚀 Starting SSH setup...
echo.

echo 📋 Copying public key to server...
echo root | scp my_public_key.txt ubuntu@100.64.64.33:~/

echo.
echo ✅ Public key copied!
echo.
echo Now please run these commands manually:
echo.
echo 1. Connect to server:
echo    ssh ubuntu@100.64.64.33
echo    Password: root
echo.
echo 2. On the server, run these commands:
echo    mkdir -p ~/.ssh
echo    chmod 700 ~/.ssh
echo    cat ~/my_public_key.txt >> ~/.ssh/authorized_keys
echo    chmod 600 ~/.ssh/authorized_keys
echo    rm ~/my_public_key.txt
echo.
echo 3. Setup Tailscale for background service:
echo    sudo tailscale down
echo    sudo tailscale up --accept-routes --accept-dns=false
echo    sudo systemctl enable tailscaled
echo    sudo systemctl start tailscaled
echo.
echo 4. Test connection:
echo    exit
echo    ssh ubuntu@100.64.64.33
echo.
echo After completing these steps, you'll have:
echo ✅ SSH without password
echo ✅ Tailscale running in background
echo.
pause
