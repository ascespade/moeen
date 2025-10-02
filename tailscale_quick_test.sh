#!/bin/bash
# Tailscale Quick Connection Tests
# اختبار سريع لاتصالات Tailscale
# Simple bash script for quick Tailscale network testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Machine configurations (update these with your actual IPs)
MACHINES=(
    "cursor:100.87.127.117:Linux"
    "desktop-p6jvl92:100.90.100.116:Windows"
    "ec2-jump-server:100.97.57.53:Linux"
)

# Common ports to test
COMMON_PORTS=(22 80 443 3000 8080)

# Utility functions
log_info() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

log_header() {
    echo -e "${MAGENTA}[$(date +'%H:%M:%S')] 🔧 $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Test if port is open
test_port() {
    local host=$1
    local port=$2
    local timeout=${3:-5}
    
    if command_exists nc; then
        nc -z -w$timeout "$host" "$port" 2>/dev/null
    elif command_exists telnet; then
        timeout $timeout bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null
    else
        # Fallback using /dev/tcp
        timeout $timeout bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null
    fi
}

# Ping test with statistics
ping_test() {
    local host=$1
    local name=$2
    
    log_info "Pinging $name ($host)..."
    
    if ping -c 4 -W 5 "$host" >/dev/null 2>&1; then
        # Get ping statistics
        local stats=$(ping -c 4 -W 5 "$host" 2>/dev/null | tail -1)
        log_success "Ping to $name successful"
        if [[ -n "$stats" ]]; then
            log_info "Stats: $stats"
        fi
        return 0
    else
        log_error "Ping to $name failed"
        return 1
    fi
}

# Test Tailscale status
test_tailscale_status() {
    log_header "Checking Tailscale Status"
    
    if ! command_exists tailscale; then
        log_error "Tailscale CLI not found"
        return 1
    fi
    
    if tailscale status >/dev/null 2>&1; then
        log_success "Tailscale is running"
        
        # Get current status info
        local current_ip=$(tailscale ip -4 2>/dev/null | head -1)
        if [[ -n "$current_ip" ]]; then
            log_info "Current Tailscale IP: $current_ip"
        fi
        
        # Show connected peers count
        local peer_count=$(tailscale status --json 2>/dev/null | jq -r '.Peer | length' 2>/dev/null || echo "unknown")
        log_info "Connected peers: $peer_count"
        
        return 0
    else
        log_error "Tailscale is not running or not authenticated"
        return 1
    fi
}

# Test basic connectivity
test_connectivity() {
    log_header "Testing Basic Connectivity"
    
    local success_count=0
    local total_count=${#MACHINES[@]}
    
    for machine_info in "${MACHINES[@]}"; do
        IFS=':' read -r name ip os <<< "$machine_info"
        
        if ping_test "$ip" "$name"; then
            ((success_count++))
        fi
    done
    
    log_info "Connectivity: $success_count/$total_count machines reachable"
    
    if [[ $success_count -eq $total_count ]]; then
        log_success "All machines are reachable"
        return 0
    elif [[ $success_count -gt 0 ]]; then
        log_warning "Some machines are not reachable"
        return 1
    else
        log_error "No machines are reachable"
        return 2
    fi
}

# Test service availability
test_services() {
    log_header "Testing Service Availability"
    
    for machine_info in "${MACHINES[@]}"; do
        IFS=':' read -r name ip os <<< "$machine_info"
        
        log_info "Testing services on $name ($ip)"
        
        for port in "${COMMON_PORTS[@]}"; do
            if test_port "$ip" "$port" 3; then
                log_success "Port $port open on $name"
            else
                log_warning "Port $port closed on $name"
            fi
        done
        echo
    done
}

# Test SSH connectivity
test_ssh() {
    log_header "Testing SSH Connectivity"
    
    for machine_info in "${MACHINES[@]}"; do
        IFS=':' read -r name ip os <<< "$machine_info"
        
        log_info "Testing SSH to $name ($ip)"
        
        if test_port "$ip" 22 5; then
            log_success "SSH port accessible on $name"
            
            # Try to get SSH banner (optional)
            if command_exists ssh; then
                local banner=$(timeout 5 ssh -o ConnectTimeout=3 -o StrictHostKeyChecking=no -o BatchMode=yes "$ip" "exit" 2>&1 | head -1)
                if [[ $? -eq 255 ]] && [[ "$banner" == *"Permission denied"* ]]; then
                    log_info "SSH service responding (authentication required)"
                elif [[ $? -eq 0 ]]; then
                    log_success "SSH connection successful"
                fi
            fi
        else
            log_error "SSH not accessible on $name"
        fi
    done
}

# Test HTTP services
test_http() {
    log_header "Testing HTTP Services"
    
    for machine_info in "${MACHINES[@]}"; do
        IFS=':' read -r name ip os <<< "$machine_info"
        
        log_info "Testing HTTP services on $name"
        
        # Test common web ports
        for port in 80 443 3000 8080; do
            if test_port "$ip" "$port" 3; then
                local protocol="http"
                [[ $port -eq 443 ]] && protocol="https"
                
                # Try to get HTTP response
                if command_exists curl; then
                    local status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$protocol://$ip:$port" 2>/dev/null)
                    if [[ -n "$status" ]] && [[ "$status" != "000" ]]; then
                        log_success "HTTP service responding on $name:$port (Status: $status)"
                    else
                        log_info "Port $port open on $name but no HTTP response"
                    fi
                elif command_exists wget; then
                    if timeout 10 wget -q --spider --timeout=5 "$protocol://$ip:$port" 2>/dev/null; then
                        log_success "HTTP service responding on $name:$port"
                    else
                        log_info "Port $port open on $name but no HTTP response"
                    fi
                else
                    log_info "Port $port open on $name (HTTP test tools not available)"
                fi
            fi
        done
    done
}

# Performance test (simple latency measurement)
test_performance() {
    log_header "Testing Network Performance"
    
    for machine_info in "${MACHINES[@]}"; do
        IFS=':' read -r name ip os <<< "$machine_info"
        
        log_info "Measuring latency to $name"
        
        # Use ping for latency measurement
        local ping_output=$(ping -c 5 -W 5 "$ip" 2>/dev/null)
        if [[ $? -eq 0 ]]; then
            # Extract average latency (works on most systems)
            local avg_latency=$(echo "$ping_output" | grep -E "(avg|rtt)" | grep -oE "[0-9]+\.[0-9]+" | tail -1)
            
            if [[ -n "$avg_latency" ]]; then
                log_success "Average latency to $name: ${avg_latency}ms"
                
                # Quality assessment
                if (( $(echo "$avg_latency < 50" | bc -l 2>/dev/null || echo "0") )); then
                    log_success "Excellent latency"
                elif (( $(echo "$avg_latency < 100" | bc -l 2>/dev/null || echo "0") )); then
                    log_success "Good latency"
                elif (( $(echo "$avg_latency < 200" | bc -l 2>/dev/null || echo "0") )); then
                    log_warning "Acceptable latency"
                else
                    log_warning "High latency - may affect performance"
                fi
            else
                log_info "Could not extract latency statistics"
            fi
        else
            log_error "Performance test failed for $name"
        fi
    done
}

# Generate simple report
generate_report() {
    local report_file="tailscale_test_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Tailscale Network Test Report"
        echo "Generated: $(date)"
        echo "================================"
        echo
        echo "Machines tested:"
        for machine_info in "${MACHINES[@]}"; do
            IFS=':' read -r name ip os <<< "$machine_info"
            echo "  - $name ($ip) - $os"
        done
        echo
        echo "Test completed at: $(date)"
    } > "$report_file"
    
    log_success "Report saved to: $report_file"
}

# Main execution
main() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                🌐 Tailscale Quick Tests                      ║${NC}"
    echo -e "${CYAN}║              اختبار سريع لشبكة Tailscale                     ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    # Check prerequisites
    if ! command_exists ping; then
        log_error "ping command not found"
        exit 1
    fi
    
    # Run tests
    local overall_status=0
    
    if ! test_tailscale_status; then
        log_error "Cannot proceed without Tailscale running"
        exit 1
    fi
    
    echo
    test_connectivity || ((overall_status++))
    
    echo
    test_services
    
    echo
    test_ssh
    
    echo
    test_http
    
    echo
    test_performance
    
    echo
    generate_report
    
    # Summary
    echo
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                        📊 Test Summary                       ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    log_success "Tailscale Quick Tests Completed!"
    log_info "Machines tested: ${#MACHINES[@]}"
    
    if [[ $overall_status -eq 0 ]]; then
        log_success "All basic tests passed! 🚀"
    else
        log_warning "Some tests had issues. Check the output above."
    fi
    
    echo
    log_info "For more detailed tests, use: python3 tailscale_tests.py"
    log_info "For Windows PowerShell tests, use: .\\tailscale_connection_tests.ps1"
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Tailscale Quick Connection Tests"
        echo "Usage: $0 [options]"
        echo
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --connectivity Test only basic connectivity"
        echo "  --services     Test only service availability"
        echo "  --ssh          Test only SSH connectivity"
        echo "  --http         Test only HTTP services"
        echo "  --performance  Test only network performance"
        echo
        exit 0
        ;;
    --connectivity)
        test_tailscale_status && test_connectivity
        ;;
    --services)
        test_services
        ;;
    --ssh)
        test_ssh
        ;;
    --http)
        test_http
        ;;
    --performance)
        test_performance
        ;;
    *)
        main
        ;;
esac
