# Jump Server to Cursor Connection Test
# Tests connectivity between Jump Server and Cursor environment

param(
    [string]$JumpServerIP,
    [string]$JumpServerUser = "ubuntu",
    [string]$JumpServerKey,
    [string]$CursorTargetIP,
    [int]$SSHPort = 22
)

# Colors and formatting
function Write-TestOutput {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $colors = @{
        "Info" = "Cyan"
        "Success" = "Green" 
        "Error" = "Red"
        "Warning" = "Yellow"
        "Header" = "Magenta"
    }
    
    $icons = @{
        "Info" = "ℹ️"
        "Success" = "✅"
        "Error" = "❌" 
        "Warning" = "⚠️"
        "Header" = "🔧"
    }
    
    Write-Host "$($icons[$Type]) $Message" -ForegroundColor $colors[$Type]
}

Clear-Host
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🔗 Jump Server ↔ Cursor Connection Test       ║" -ForegroundColor Cyan  
Write-Host "║              Testing SSH Tunnel Connectivity          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host

# Get connection details if not provided
Write-TestOutput "Step 1: Gathering Connection Details" "Header"

if (-not $JumpServerIP) {
    $JumpServerIP = Read-Host "Enter Jump Server IP/DNS"
}
Write-TestOutput "Jump Server: $JumpServerIP" "Info"

if (-not $JumpServerUser) {
    $inputUser = Read-Host "Enter Jump Server username [default: ubuntu]"
    if ($inputUser) { $JumpServerUser = $inputUser }
}
Write-TestOutput "Jump Server User: $JumpServerUser" "Info"

if (-not $JumpServerKey) {
    $JumpServerKey = Read-Host "Enter path to Jump Server SSH key (.pem file)"
}
Write-TestOutput "SSH Key: $JumpServerKey" "Info"

if (-not $CursorTargetIP) {
    $CursorTargetIP = Read-Host "Enter Cursor target IP (where you want to connect from Jump)"
}
Write-TestOutput "Cursor Target: $CursorTargetIP" "Info"

Write-Host

# Test 1: Validate SSH key file
Write-TestOutput "Step 2: Validating SSH Key File" "Header"
if (Test-Path $JumpServerKey) {
    Write-TestOutput "SSH key file found" "Success"
    
    # Check file permissions and content
    $keyContent = Get-Content $JumpServerKey -Raw -ErrorAction SilentlyContinue
    if ($keyContent -match "BEGIN.*PRIVATE KEY") {
        Write-TestOutput "SSH key file appears valid" "Success"
    } else {
        Write-TestOutput "SSH key file format may be invalid" "Warning"
    }
} else {
    Write-TestOutput "SSH key file not found: $JumpServerKey" "Error"
    exit 1
}

# Test 2: Test direct connection to Jump Server
Write-TestOutput "Step 3: Testing Direct Connection to Jump Server" "Header"
Write-TestOutput "Connecting to $JumpServerUser@$JumpServerIP..." "Info"

$jumpTestArgs = @(
    "-i", $JumpServerKey,
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=10",
    "-o", "BatchMode=yes",
    "$JumpServerUser@$JumpServerIP",
    "echo 'Jump server connection successful' && whoami && hostname"
)

try {
    $jumpResult = & ssh @jumpTestArgs 2>&1
    if ($jumpResult -match "Jump server connection successful") {
        Write-TestOutput "✅ Successfully connected to Jump Server" "Success"
        Write-TestOutput "Jump Server Details: $($jumpResult -join ' | ')" "Info"
    } else {
        Write-TestOutput "❌ Failed to connect to Jump Server" "Error"
        Write-TestOutput "Error: $jumpResult" "Error"
        exit 1
    }
} catch {
    Write-TestOutput "❌ Jump Server connection failed: $($_.Exception.Message)" "Error"
    exit 1
}

# Test 3: Test network connectivity from Jump Server to Cursor target
Write-TestOutput "Step 4: Testing Network Path from Jump Server to Cursor Target" "Header"
Write-TestOutput "Testing connectivity from Jump Server to $CursorTargetIP..." "Info"

$networkTestCommand = @"
echo 'Testing network connectivity from Jump Server...' &&
ping -c 3 $CursorTargetIP 2>/dev/null | tail -2 &&
echo 'Testing SSH port accessibility...' &&
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/$CursorTargetIP/$SSHPort' 2>/dev/null && echo 'SSH port $SSHPort is open' || echo 'SSH port $SSHPort is not accessible' &&
echo 'Network test completed'
"@

$networkTestArgs = @(
    "-i", $JumpServerKey,
    "-o", "StrictHostKeyChecking=no",
    "$JumpServerUser@$JumpServerIP",
    $networkTestCommand
)

try {
    $networkResult = & ssh @networkTestArgs 2>&1
    Write-TestOutput "Network Test Results:" "Info"
    $networkResult | ForEach-Object { 
        if ($_ -match "SSH port.*open") {
            Write-TestOutput "  $_" "Success"
        } elseif ($_ -match "not accessible") {
            Write-TestOutput "  $_" "Error"
        } else {
            Write-Host "  📊 $_" -ForegroundColor Gray
        }
    }
} catch {
    Write-TestOutput "Network test failed: $($_.Exception.Message)" "Error"
}

# Test 4: Test SSH tunnel creation
Write-TestOutput "Step 5: Testing SSH Tunnel Creation" "Header"
Write-TestOutput "Creating test SSH tunnel through Jump Server..." "Info"

$localPort = Get-Random -Minimum 8000 -Maximum 9000
Write-TestOutput "Using local port: $localPort" "Info"

# Create SSH tunnel command
$tunnelArgs = @(
    "-i", $JumpServerKey,
    "-o", "StrictHostKeyChecking=no",
    "-L", "$localPort`:$CursorTargetIP`:$SSHPort",
    "-N", "-f",
    "$JumpServerUser@$JumpServerIP"
)

Write-TestOutput "Creating tunnel: localhost:$localPort -> $JumpServerIP -> ${CursorTargetIP}:$SSHPort" "Info"

try {
    # Start tunnel in background
    $tunnelProcess = Start-Process -FilePath "ssh" -ArgumentList $tunnelArgs -PassThru -WindowStyle Hidden
    Start-Sleep 3
    
    if ($tunnelProcess -and !$tunnelProcess.HasExited) {
        Write-TestOutput "✅ SSH tunnel created successfully (PID: $($tunnelProcess.Id))" "Success"
        
        # Test the tunnel
        Write-TestOutput "Testing tunnel connectivity..." "Info"
        try {
            $tunnelTest = Test-NetConnection -ComputerName "localhost" -Port $localPort -WarningAction SilentlyContinue
            if ($tunnelTest.TcpTestSucceeded) {
                Write-TestOutput "✅ Tunnel is working! Can reach target through Jump Server" "Success"
            } else {
                Write-TestOutput "❌ Tunnel created but not responding" "Error"
            }
        } catch {
            Write-TestOutput "❌ Tunnel test failed: $($_.Exception.Message)" "Error"
        }
        
        # Clean up tunnel
        Write-TestOutput "Cleaning up test tunnel..." "Info"
        Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
        Write-TestOutput "Test tunnel closed" "Info"
        
    } else {
        Write-TestOutput "❌ Failed to create SSH tunnel" "Error"
    }
} catch {
    Write-TestOutput "❌ Tunnel creation failed: $($_.Exception.Message)" "Error"
}

# Test 5: Test ProxyJump functionality
Write-TestOutput "Step 6: Testing ProxyJump Functionality" "Header"
Write-TestOutput "Testing direct ProxyJump connection..." "Info"

$proxyJumpArgs = @(
    "-i", $JumpServerKey,
    "-o", "StrictHostKeyChecking=no",
    "-o", "ProxyJump=$JumpServerUser@$JumpServerIP",
    "-o", "ConnectTimeout=15",
    "ubuntu@$CursorTargetIP",
    "echo 'ProxyJump connection successful' && hostname && whoami"
)

try {
    $proxyResult = & ssh @proxyJumpArgs 2>&1
    if ($proxyResult -match "ProxyJump connection successful") {
        Write-TestOutput "✅ ProxyJump connection successful!" "Success"
        Write-TestOutput "Target server details: $($proxyResult -join ' | ')" "Info"
    } else {
        Write-TestOutput "❌ ProxyJump connection failed" "Error"
        Write-TestOutput "This might be normal if target server requires specific keys" "Warning"
    }
} catch {
    Write-TestOutput "ProxyJump test failed: $($_.Exception.Message)" "Warning"
}

# Summary and recommendations
Write-Host
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    📋 Test Summary                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host

Write-TestOutput "Connection Test Results:" "Header"
Write-Host "🔗 Jump Server: $JumpServerIP" -ForegroundColor Cyan
Write-Host "🎯 Target: $CursorTargetIP" -ForegroundColor Cyan
Write-Host

Write-TestOutput "Recommended SSH Commands:" "Header"
Write-Host
Write-Host "📌 Direct tunnel:" -ForegroundColor Yellow
Write-Host "   ssh -i `"$JumpServerKey`" -L 8080:$CursorTargetIP`:22 $JumpServerUser@$JumpServerIP" -ForegroundColor Green
Write-Host
Write-Host "📌 ProxyJump connection:" -ForegroundColor Yellow  
Write-Host "   ssh -i `"$JumpServerKey`" -o ProxyJump=$JumpServerUser@$JumpServerIP ubuntu@$CursorTargetIP" -ForegroundColor Green
Write-Host
Write-Host "📌 SSH Config entry:" -ForegroundColor Yellow
Write-Host @"
   Host cursor-via-jump
       HostName $CursorTargetIP
       User ubuntu
       ProxyJump $JumpServerUser@$JumpServerIP
       IdentityFile $JumpServerKey
       StrictHostKeyChecking no
"@ -ForegroundColor Green

Write-Host
Write-TestOutput "Test completed! 🚀" "Success"
