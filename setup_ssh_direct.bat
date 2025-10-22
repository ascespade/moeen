@echo off
echo 🔑 Setting up SSH keys for passwordless access...

echo.
echo 📁 Setting up SSH directory and permissions...
echo root | ssh ubuntu@100.64.64.33 "mkdir -p ~/.ssh"
echo root | ssh ubuntu@100.64.64.33 "chmod 700 ~/.ssh"
echo root | ssh ubuntu@100.64.64.33 "cat ~/my_public_key.txt >> ~/.ssh/authorized_keys"
echo root | ssh ubuntu@100.64.64.33 "chmod 600 ~/.ssh/authorized_keys"
echo root | ssh ubuntu@100.64.64.33 "rm ~/my_public_key.txt"

echo.
echo 🌐 Setting up Tailscale for background service...
echo root | ssh ubuntu@100.64.64.33 "sudo tailscale down"
echo root | ssh ubuntu@100.64.64.33 "sudo tailscale up --accept-routes --accept-dns=false"
echo root | ssh ubuntu@100.64.64.33 "sudo systemctl enable tailscaled"
echo root | ssh ubuntu@100.64.64.33 "sudo systemctl start tailscaled"

echo.
echo 🧪 Testing passwordless connection...
ssh -o ConnectTimeout=10 ubuntu@100.64.64.33 "echo SSH_SUCCESS"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 SUCCESS! SSH works without password!
    echo ✅ You can now connect with: ssh ubuntu@100.64.64.33
    echo ✅ Tailscale is running in background
) else (
    echo.
    echo ❌ Connection test failed. Manual setup may be needed.
    echo.
    echo Manual steps:
    echo 1. ssh ubuntu@100.64.64.33
    echo 2. Password: root
    echo 3. Run the commands shown above
)

echo.
pause
