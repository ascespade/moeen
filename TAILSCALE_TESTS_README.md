# Tailscale Network Connection Tests
# اختبارات شبكة Tailscale الشاملة

This repository contains comprehensive connection tests for your Tailscale network. The tests are designed to verify connectivity, performance, and service availability across all your Tailscale-connected machines.

## 🌐 Your Tailscale Network

Based on your current setup, these tests will verify connectivity between:

- **cursor** (100.87.127.117) - Linux 6.1.47 - Main development machine
- **desktop-p6jvl92** (100.90.100.116) - Windows 10 22H2 - Desktop workstation  
- **ec2-jump-server** (100.97.57.53) - Linux 6.12.43 - AWS EC2 jump server

## 📁 Test Files Overview

### 1. PowerShell Tests (Windows)
- `tailscale_connection_tests.ps1` - Comprehensive PowerShell test suite
- `tailscale_test_config.json` - Configuration file for all tests

### 2. Python Tests (Cross-platform)
- `tailscale_tests.py` - Full-featured Python test suite with parallel execution
- Requires: `requests` library (`pip install requests`)

### 3. Bash Tests (Linux/macOS)
- `tailscale_quick_test.sh` - Quick bash script for basic testing
- No additional dependencies required

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
# Run comprehensive tests
.\tailscale_connection_tests.ps1

# Run with verbose output
.\tailscale_connection_tests.ps1 -Verbose

# Skip performance tests
.\tailscale_connection_tests.ps1 -SkipPerformance
```

### Linux/macOS (Python)
```bash
# Install dependencies
pip install requests

# Run all tests
python3 tailscale_tests.py

# Run with verbose output
python3 tailscale_tests.py --verbose

# Use custom config
python3 tailscale_tests.py --config my_config.json
```

### Linux/macOS (Bash - Quick Tests)
```bash
# Make executable
chmod +x tailscale_quick_test.sh

# Run all tests
./tailscale_quick_test.sh

# Run specific test categories
./tailscale_quick_test.sh --connectivity
./tailscale_quick_test.sh --services
./tailscale_quick_test.sh --ssh
./tailscale_quick_test.sh --http
./tailscale_quick_test.sh --performance
```

## 🔧 Test Categories

### 1. Basic Connectivity Tests
- **Ping tests** - Verify basic network reachability
- **Traceroute** - Network path analysis (verbose mode)
- **DNS resolution** - Tailscale hostname resolution

### 2. Service Availability Tests
- **Port scanning** - Check if services are listening
- **SSH connectivity** - Verify SSH access
- **HTTP/HTTPS services** - Web service availability
- **RDP connectivity** - Remote Desktop (Windows machines)

### 3. Performance Tests
- **Latency measurement** - Round-trip time analysis
- **Bandwidth testing** - Network throughput (where supported)
- **Connection quality** - Stability and reliability metrics

### 4. Application-Specific Tests
- **Next.js development server** - Port 3000 accessibility
- **Custom application ports** - Your specific service ports
- **Database connections** - If configured

### 5. Security Tests
- **Open port analysis** - Security posture assessment
- **Service fingerprinting** - Identify running services
- **SSL/TLS verification** - Certificate validation

## ⚙️ Configuration

### Customizing Machine List

Edit `tailscale_test_config.json` to match your network:

```json
{
  "machines": [
    {
      "name": "your-machine-name",
      "ip": "100.x.x.x",
      "os": "Linux|Windows|macOS",
      "services": ["ssh", "http", "https", "rdp"],
      "ports": [22, 80, 443, 3000, 8080]
    }
  ],
  "tests": {
    "basic_connectivity": true,
    "service_availability": true,
    "performance_tests": true,
    "application_tests": true
  }
}
```

### Test Thresholds

Adjust performance thresholds in the config:

```json
{
  "thresholds": {
    "max_latency_ms": 200,
    "min_bandwidth_mbps": 10,
    "timeout_seconds": 30
  }
}
```

## 📊 Understanding Results

### Status Indicators
- ✅ **Success** - Test passed, service is working
- ❌ **Error** - Test failed, issue detected
- ⚠️ **Warning** - Test passed with concerns
- ℹ️ **Info** - Informational message

### Latency Quality Guide
- **< 50ms** - Excellent (local network quality)
- **50-100ms** - Good (suitable for most applications)
- **100-200ms** - Acceptable (may notice slight delays)
- **> 200ms** - High (may affect real-time applications)

### Common Port Meanings
- **22** - SSH (Secure Shell)
- **80** - HTTP (Web traffic)
- **443** - HTTPS (Secure web traffic)
- **3000** - Next.js development server
- **3389** - RDP (Remote Desktop Protocol)
- **8080** - Alternative HTTP port

## 🔍 Troubleshooting

### Tailscale Not Running
```bash
# Check Tailscale status
tailscale status

# Start Tailscale (if stopped)
sudo tailscale up

# Re-authenticate if needed
tailscale login
```

### Connection Issues
1. **Ping fails** - Check Tailscale connectivity and firewall rules
2. **Port closed** - Verify service is running and firewall allows traffic
3. **High latency** - Check network path and Tailscale relay usage
4. **Timeout errors** - Increase timeout values in configuration

### Permission Issues
```bash
# Linux/macOS - Make scripts executable
chmod +x tailscale_quick_test.sh

# Windows - Run PowerShell as Administrator if needed
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📈 Automated Testing

### Scheduled Testing (Windows)
```powershell
# Create scheduled task for daily tests
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\path\to\tailscale_connection_tests.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "TailscaleTests"
```

### Cron Job (Linux/macOS)
```bash
# Add to crontab for daily 9 AM tests
echo "0 9 * * * /path/to/tailscale_quick_test.sh > /tmp/tailscale_test.log 2>&1" | crontab -
```

## 📋 Report Generation

All test suites generate detailed reports:

- **JSON reports** - Machine-readable results with timestamps
- **Text summaries** - Human-readable test outcomes
- **Performance metrics** - Latency, throughput, and quality data
- **Recommendations** - Suggested actions based on results

### Sample Report Structure
```json
{
  "timestamp": "2024-10-02T15:30:00",
  "summary": {
    "total_machines": 3,
    "tests_completed": 5,
    "overall_status": "completed"
  },
  "results": {
    "connectivity": [...],
    "services": [...],
    "performance": [...]
  },
  "recommendations": [
    "All systems are healthy",
    "Consider optimizing high-latency connections"
  ]
}
```

## 🔐 Security Considerations

- Tests use **read-only operations** - no system changes
- **No credentials stored** - authentication handled by Tailscale
- **Minimal network footprint** - only necessary test traffic
- **Configurable timeouts** - prevents hanging connections

## 🆘 Support

### Getting Help
1. Check Tailscale status: `tailscale status`
2. Review test logs and error messages
3. Verify network connectivity outside Tailscale
4. Check firewall and security group settings

### Common Solutions
- **Restart Tailscale service** if connectivity issues persist
- **Update Tailscale client** to latest version
- **Check ACL rules** in Tailscale admin console
- **Verify machine authentication** status

## 📚 Additional Resources

- [Tailscale Documentation](https://tailscale.com/kb/)
- [Tailscale Admin Console](https://login.tailscale.com/admin/)
- [Network Troubleshooting Guide](https://tailscale.com/kb/1023/troubleshooting/)

---

**Happy Testing! 🚀**

*These tests help ensure your Tailscale network is performing optimally and all services are accessible across your connected machines.*
