# PowerShell script to setup SSH without password
Write-Host "🚀 Starting SSH setup..." -ForegroundColor Green

# Step 1: Copy public key to server
Write-Host "📋 Copying public key to server..." -ForegroundColor Yellow
$scpCommand = "scp my_public_key.txt ubuntu@100.64.64.33:~/"
Write-Host "Running: $scpCommand" -ForegroundColor Cyan
Write-Host "Password: root" -ForegroundColor Red

# Create a batch file to handle the interactive commands
$batchContent = @"
@echo off
echo Copying public key...
echo root | scp my_public_key.txt ubuntu@100.64.64.33:~/

echo.
echo Now connecting to server to setup SSH...
echo Please run these commands manually:
echo.
echo ssh ubuntu@100.64.64.33
echo Password: root
echo.
echo Then run these commands on the server:
echo mkdir -p ~/.ssh
echo chmod 700 ~/.ssh
echo cat ~/my_public_key.txt ^>^> ~/.ssh/authorized_keys
echo chmod 600 ~/.ssh/authorized_keys
echo rm ~/my_public_key.txt
echo.
echo For Tailscale background service:
echo sudo tailscale down
echo sudo tailscale up --accept-routes --accept-dns=false
echo sudo systemctl enable tailscaled
echo sudo systemctl start tailscaled
echo.
echo Test connection:
echo ssh ubuntu@100.64.64.33
echo.
pause
"@

$batchContent | Out-File -FilePath "run_setup.bat" -Encoding ASCII
Write-Host "✅ Created run_setup.bat" -ForegroundColor Green
Write-Host "Run: .\run_setup.bat" -ForegroundColor Cyan
