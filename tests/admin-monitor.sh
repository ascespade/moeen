#!/bin/bash

# Admin Auto-Test Monitor
# مراقبة واختبار تلقائي للادمن

BASE_URL="http://localhost:3000"
LOG_FILE="/tmp/admin-test-monitor.log"

echo "🤖 Admin Auto-Test Monitor Started"
echo "===================================="
echo "Monitoring: $BASE_URL"
echo "Log file: $LOG_FILE"
echo ""

# Function to run tests
run_tests() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Running admin tests..." | tee -a "$LOG_FILE"
    
    cd /home/ubuntu/moeen
    
    # Run tests and capture output
    npx playwright test tests/admin.spec.ts tests/admin-comprehensive.spec.ts \
        --reporter=list,json \
        --output-dir=test-results/admin \
        2>&1 | tee -a "$LOG_FILE"
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ All tests passed!" | tee -a "$LOG_FILE"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Tests failed! Exit code: $exit_code" | tee -a "$LOG_FILE"
    fi
    
    return $exit_code
}

# Function to check server health
check_server() {
    if curl -s "$BASE_URL" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Main monitoring loop
MONITOR_INTERVAL=${MONITOR_INTERVAL:-300}  # Default: 5 minutes

echo "Starting monitoring loop (interval: ${MONITOR_INTERVAL}s)"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    # Check if server is running
    if ! check_server; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  Server is not responding!" | tee -a "$LOG_FILE"
        sleep 60
        continue
    fi
    
    # Run tests
    run_tests
    
    # Wait before next run
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Waiting ${MONITOR_INTERVAL}s before next test run..." | tee -a "$LOG_FILE"
    sleep "$MONITOR_INTERVAL"
done
