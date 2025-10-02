# Tailscale Network Connection Tests
# اختبارات شاملة لشبكة Tailscale
# Comprehensive tests for Tailscale network connectivity

param(
    [string]$ConfigFile = "tailscale_test_config.json",
    [switch]$SkipPerformance,
    [switch]$Verbose,
    [int]$TimeoutSeconds = 30
)

# Test configuration based on your Tailscale network
$DefaultConfig = @{
    machines = @(
        @{
            name = "cursor"
            ip = "100.87.127.117"
            os = "Linux"
            version = "1.88.3"
            services = @("ssh", "http", "https")
            ports = @(22, 80, 443, 3000, 8080)
        },
        @{
            name = "desktop-p6jvl92"
            ip = "100.90.100.116"
            os = "Windows"
            version = "1.88.3"
            services = @("ssh", "rdp", "http")
            ports = @(22, 3389, 80, 8080)
        },
        @{
            name = "ec2-jump-server"
            ip = "100.97.57.53"
            os = "Linux"
            version = "1.88.3"
            services = @("ssh", "http")
            ports = @(22, 80, 443)
        }
    )
    tests = @{
        basic_connectivity = $true
        service_availability = $true
        performance_tests = $true
        security_tests = $true
        application_tests = $true
    }
}

# Utility functions
function Write-TestResult {
    param(
        [string]$Message,
        [string]$Status = "Info",
        [string]$Details = ""
    )
    
    $colors = @{
        "Success" = "Green"
        "Error" = "Red"
        "Warning" = "Yellow"
        "Info" = "Cyan"
        "Header" = "Magenta"
    }
    
    $icons = @{
        "Success" = "✅"
        "Error" = "❌"
        "Warning" = "⚠️"
        "Info" = "ℹ️"
        "Header" = "🔧"
    }
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $($icons[$Status]) $Message" -ForegroundColor $colors[$Status]
    
    if ($Details -and $Verbose) {
        Write-Host "    📝 $Details" -ForegroundColor Gray
    }
}

function Test-TailscaleStatus {
    Write-TestResult "Checking Tailscale status..." "Header"
    
    try {
        $status = & tailscale status --json 2>$null | ConvertFrom-Json
        if ($status) {
            Write-TestResult "Tailscale is running" "Success"
            Write-TestResult "Current user: $($status.Self.UserID)" "Info"
            Write-TestResult "Node key: $($status.Self.NodeKey.Substring(0,20))..." "Info"
            return $status
        }
    }
    catch {
        Write-TestResult "Tailscale CLI not found or not running" "Error" $_.Exception.Message
        return $null
    }
}

function Test-BasicConnectivity {
    param([array]$Machines)
    
    Write-TestResult "Testing basic connectivity between machines..." "Header"
    $results = @()
    
    foreach ($machine in $Machines) {
        Write-TestResult "Testing connectivity to $($machine.name) ($($machine.ip))" "Info"
        
        # Ping test
        try {
            $ping = Test-NetConnection -ComputerName $machine.ip -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($ping) {
                Write-TestResult "✅ Ping to $($machine.name) successful" "Success"
                $results += @{machine = $machine.name; test = "ping"; status = "success"}
            } else {
                Write-TestResult "❌ Ping to $($machine.name) failed" "Error"
                $results += @{machine = $machine.name; test = "ping"; status = "failed"}
            }
        }
        catch {
            Write-TestResult "❌ Ping test error for $($machine.name)" "Error" $_.Exception.Message
            $results += @{machine = $machine.name; test = "ping"; status = "error"}
        }
        
        # Traceroute test
        if ($Verbose) {
            Write-TestResult "Running traceroute to $($machine.name)..." "Info"
            try {
                $tracert = & tracert -h 5 $machine.ip 2>$null
                if ($tracert) {
                    Write-TestResult "Traceroute completed" "Success"
                }
            }
            catch {
                Write-TestResult "Traceroute failed" "Warning"
            }
        }
    }
    
    return $results
}

function Test-ServiceAvailability {
    param([array]$Machines)
    
    Write-TestResult "Testing service availability..." "Header"
    $results = @()
    
    foreach ($machine in $Machines) {
        Write-TestResult "Testing services on $($machine.name)" "Info"
        
        foreach ($port in $machine.ports) {
            try {
                $connection = Test-NetConnection -ComputerName $machine.ip -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
                if ($connection) {
                    Write-TestResult "✅ Port $port open on $($machine.name)" "Success"
                    $results += @{machine = $machine.name; port = $port; status = "open"}
                } else {
                    Write-TestResult "❌ Port $port closed on $($machine.name)" "Warning"
                    $results += @{machine = $machine.name; port = $port; status = "closed"}
                }
            }
            catch {
                Write-TestResult "❌ Error testing port $port on $($machine.name)" "Error"
                $results += @{machine = $machine.name; port = $port; status = "error"}
            }
        }
    }
    
    return $results
}

function Test-Performance {
    param([array]$Machines)
    
    if ($SkipPerformance) {
        Write-TestResult "Skipping performance tests (--SkipPerformance specified)" "Warning"
        return @()
    }
    
    Write-TestResult "Running performance tests..." "Header"
    $results = @()
    
    foreach ($machine in $Machines) {
        Write-TestResult "Testing latency to $($machine.name)" "Info"
        
        try {
            # Multiple ping test for average latency
            $pings = @()
            for ($i = 1; $i -le 5; $i++) {
                $ping = Test-NetConnection -ComputerName $machine.ip -InformationLevel Detailed -WarningAction SilentlyContinue
                if ($ping.PingSucceeded) {
                    $pings += $ping.PingReplyDetails.RoundtripTime
                }
            }
            
            if ($pings.Count -gt 0) {
                $avgLatency = ($pings | Measure-Object -Average).Average
                Write-TestResult "Average latency to $($machine.name): $([math]::Round($avgLatency, 2))ms" "Success"
                $results += @{machine = $machine.name; test = "latency"; value = $avgLatency; unit = "ms"}
                
                # Latency quality assessment
                if ($avgLatency -lt 50) {
                    Write-TestResult "Excellent latency" "Success"
                } elseif ($avgLatency -lt 100) {
                    Write-TestResult "Good latency" "Success"
                } elseif ($avgLatency -lt 200) {
                    Write-TestResult "Acceptable latency" "Warning"
                } else {
                    Write-TestResult "High latency - may affect performance" "Warning"
                }
            }
        }
        catch {
            Write-TestResult "Performance test failed for $($machine.name)" "Error"
        }
    }
    
    return $results
}

function Test-SSHConnectivity {
    param([array]$Machines)
    
    Write-TestResult "Testing SSH connectivity..." "Header"
    $results = @()
    
    foreach ($machine in $Machines) {
        if ($machine.services -contains "ssh") {
            Write-TestResult "Testing SSH to $($machine.name)" "Info"
            
            try {
                # Test SSH port
                $sshTest = Test-NetConnection -ComputerName $machine.ip -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
                if ($sshTest) {
                    Write-TestResult "✅ SSH port accessible on $($machine.name)" "Success"
                    $results += @{machine = $machine.name; service = "ssh"; status = "accessible"}
                    
                    # Try to get SSH banner (if verbose)
                    if ($Verbose) {
                        try {
                            $banner = & ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o BatchMode=yes $machine.ip "exit" 2>&1
                            Write-TestResult "SSH service responding" "Success"
                        }
                        catch {
                            Write-TestResult "SSH port open but service may not be responding" "Warning"
                        }
                    }
                } else {
                    Write-TestResult "❌ SSH not accessible on $($machine.name)" "Error"
                    $results += @{machine = $machine.name; service = "ssh"; status = "not_accessible"}
                }
            }
            catch {
                Write-TestResult "SSH test error for $($machine.name)" "Error"
                $results += @{machine = $machine.name; service = "ssh"; status = "error"}
            }
        }
    }
    
    return $results
}

function Test-HTTPServices {
    param([array]$Machines)
    
    Write-TestResult "Testing HTTP services..." "Header"
    $results = @()
    
    foreach ($machine in $Machines) {
        if ($machine.services -contains "http" -or $machine.services -contains "https") {
            Write-TestResult "Testing HTTP services on $($machine.name)" "Info"
            
            # Test common web ports
            $webPorts = @(80, 443, 3000, 8080) | Where-Object { $_ -in $machine.ports }
            
            foreach ($port in $webPorts) {
                try {
                    $protocol = if ($port -eq 443) { "https" } else { "http" }
                    $url = "${protocol}://$($machine.ip):$port"
                    
                    $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
                    Write-TestResult "✅ HTTP service responding on $($machine.name):$port" "Success"
                    $results += @{machine = $machine.name; port = $port; status = "responding"; code = $response.StatusCode}
                }
                catch {
                    if ($_.Exception.Message -match "timeout") {
                        Write-TestResult "⏱️ HTTP service timeout on $($machine.name):$port" "Warning"
                    } else {
                        Write-TestResult "❌ HTTP service not responding on $($machine.name):$port" "Warning"
                    }
                    $results += @{machine = $machine.name; port = $port; status = "not_responding"}
                }
            }
        }
    }
    
    return $results
}

function Test-ApplicationSpecific {
    param([array]$Machines)
    
    Write-TestResult "Testing application-specific services..." "Header"
    $results = @()
    
    # Test Next.js development server (typically on port 3000)
    $nextjsMachine = $Machines | Where-Object { $_.ports -contains 3000 }
    if ($nextjsMachine) {
        Write-TestResult "Testing Next.js application on $($nextjsMachine.name)" "Info"
        
        try {
            $response = Invoke-WebRequest -Uri "http://$($nextjsMachine.ip):3000" -Method Get -TimeoutSec 15 -ErrorAction Stop
            Write-TestResult "✅ Next.js application is accessible" "Success"
            $results += @{machine = $nextjsMachine.name; service = "nextjs"; status = "accessible"}
        }
        catch {
            Write-TestResult "❌ Next.js application not accessible" "Warning" $_.Exception.Message
            $results += @{machine = $nextjsMachine.name; service = "nextjs"; status = "not_accessible"}
        }
    }
    
    # Test RDP on Windows machine
    $windowsMachine = $Machines | Where-Object { $_.os -eq "Windows" }
    if ($windowsMachine -and $windowsMachine.services -contains "rdp") {
        Write-TestResult "Testing RDP on $($windowsMachine.name)" "Info"
        
        try {
            $rdpTest = Test-NetConnection -ComputerName $windowsMachine.ip -Port 3389 -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($rdpTest) {
                Write-TestResult "✅ RDP accessible on $($windowsMachine.name)" "Success"
                $results += @{machine = $windowsMachine.name; service = "rdp"; status = "accessible"}
            } else {
                Write-TestResult "❌ RDP not accessible on $($windowsMachine.name)" "Warning"
                $results += @{machine = $windowsMachine.name; service = "rdp"; status = "not_accessible"}
            }
        }
        catch {
            Write-TestResult "RDP test error" "Error"
        }
    }
    
    return $results
}

function Generate-TestReport {
    param([hashtable]$AllResults)
    
    $reportPath = "tailscale_test_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
    $report = @{
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        summary = @{
            total_machines = $AllResults.machines.Count
            tests_run = $AllResults.Keys.Count
            overall_status = "completed"
        }
        results = $AllResults
        recommendations = @()
    }
    
    # Add recommendations based on results
    if ($AllResults.connectivity) {
        $failedConnections = $AllResults.connectivity | Where-Object { $_.status -ne "success" }
        if ($failedConnections) {
            $report.recommendations += "Some machines are not reachable. Check Tailscale status and network configuration."
        }
    }
    
    if ($AllResults.performance) {
        $highLatency = $AllResults.performance | Where-Object { $_.value -gt 200 }
        if ($highLatency) {
            $report.recommendations += "High latency detected on some connections. Consider optimizing network routes."
        }
    }
    
    $report | ConvertTo-Json -Depth 5 | Out-File -FilePath $reportPath -Encoding UTF8
    Write-TestResult "Test report saved to: $reportPath" "Success"
    
    return $report
}

# Main execution
Clear-Host
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                🌐 Tailscale Network Tests                    ║" -ForegroundColor Cyan
Write-Host "║              اختبارات شبكة Tailscale الشاملة                 ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host

# Load configuration
$config = $DefaultConfig
if (Test-Path $ConfigFile) {
    try {
        $config = Get-Content $ConfigFile | ConvertFrom-Json -AsHashtable
        Write-TestResult "Loaded configuration from $ConfigFile" "Success"
    }
    catch {
        Write-TestResult "Failed to load config file, using defaults" "Warning"
    }
}

# Initialize results
$allResults = @{}

# Test 1: Tailscale Status
$tailscaleStatus = Test-TailscaleStatus
if (-not $tailscaleStatus) {
    Write-TestResult "Cannot proceed without Tailscale running" "Error"
    exit 1
}

# Test 2: Basic Connectivity
if ($config.tests.basic_connectivity) {
    $allResults.connectivity = Test-BasicConnectivity -Machines $config.machines
}

# Test 3: Service Availability
if ($config.tests.service_availability) {
    $allResults.services = Test-ServiceAvailability -Machines $config.machines
}

# Test 4: Performance Tests
if ($config.tests.performance_tests) {
    $allResults.performance = Test-Performance -Machines $config.machines
}

# Test 5: SSH Connectivity
$allResults.ssh = Test-SSHConnectivity -Machines $config.machines

# Test 6: HTTP Services
$allResults.http = Test-HTTPServices -Machines $config.machines

# Test 7: Application-Specific Tests
if ($config.tests.application_tests) {
    $allResults.applications = Test-ApplicationSpecific -Machines $config.machines
}

# Generate comprehensive report
Write-Host
Write-TestResult "Generating test report..." "Header"
$report = Generate-TestReport -AllResults $allResults

# Display summary
Write-Host
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                        📊 Test Summary                       ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host

Write-TestResult "Tailscale Network Test Completed!" "Success"
Write-TestResult "Machines tested: $($config.machines.Count)" "Info"
Write-TestResult "Test categories: $($allResults.Keys.Count)" "Info"

if ($report.recommendations.Count -gt 0) {
    Write-TestResult "Recommendations:" "Warning"
    foreach ($rec in $report.recommendations) {
        Write-Host "  • $rec" -ForegroundColor Yellow
    }
}

Write-Host
Write-TestResult "All tests completed! 🚀" "Success"
Write-TestResult "Check the generated report for detailed results." "Info"
