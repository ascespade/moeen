# PowerShell script to setup SSH keys
Write-Host "🔑 Setting up SSH keys for passwordless access..." -ForegroundColor Green

# Function to run SSH command with password
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Password = "root"
    )
    
    $tempFile = [System.IO.Path]::GetTempFileName()
    $expectScript = @"
spawn ssh ubuntu@100.64.64.33 "$Command"
expect "password:"
send "$Password\r"
expect eof
"@
    
    $expectScript | Out-File -FilePath $tempFile -Encoding ASCII
    
    try {
        $result = & expect $tempFile 2>&1
        Remove-Item $tempFile -Force
        return $result
    }
    catch {
        Remove-Item $tempFile -Force
        return $_.Exception.Message
    }
}

# Step 1: Setup SSH directory and permissions
Write-Host "📁 Setting up SSH directory..." -ForegroundColor Yellow
$commands = @(
    "mkdir -p ~/.ssh",
    "chmod 700 ~/.ssh",
    "cat ~/my_public_key.txt >> ~/.ssh/authorized_keys",
    "chmod 600 ~/.ssh/authorized_keys",
    "rm ~/my_public_key.txt"
)

foreach ($cmd in $commands) {
    Write-Host "🔧 Running: $cmd" -ForegroundColor Cyan
    $result = Invoke-SSHCommand $cmd
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Success: $cmd" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed: $cmd" -ForegroundColor Red
    }
}

# Step 2: Setup Tailscale
Write-Host "🌐 Setting up Tailscale..." -ForegroundColor Yellow
$tailscaleCommands = @(
    "sudo tailscale down",
    "sudo tailscale up --accept-routes --accept-dns=false",
    "sudo systemctl enable tailscaled",
    "sudo systemctl start tailscaled"
)

foreach ($cmd in $tailscaleCommands) {
    Write-Host "🔧 Running: $cmd" -ForegroundColor Cyan
    $result = Invoke-SSHCommand $cmd
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Success: $cmd" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed: $cmd" -ForegroundColor Red
    }
}

# Step 3: Test connection
Write-Host "🧪 Testing passwordless connection..." -ForegroundColor Yellow
$testResult = ssh -o ConnectTimeout=10 ubuntu@100.64.64.33 "echo SSH_SUCCESS" 2>&1

if ($testResult -match "SSH_SUCCESS") {
    Write-Host "🎉 SUCCESS! SSH works without password!" -ForegroundColor Green
    Write-Host "✅ You can now connect with: ssh ubuntu@100.64.64.33" -ForegroundColor Green
    Write-Host "✅ Tailscale is running in background" -ForegroundColor Green
} else {
    Write-Host "❌ Connection test failed. Manual setup may be needed." -ForegroundColor Red
    Write-Host "Test result: $testResult" -ForegroundColor Yellow
}

Write-Host "`n📋 Manual steps if needed:" -ForegroundColor Cyan
Write-Host "1. ssh ubuntu@100.64.64.33" -ForegroundColor White
Write-Host "2. Password: root" -ForegroundColor White
Write-Host "3. Run the commands shown above" -ForegroundColor White
