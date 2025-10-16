#!/bin/bash

# Comprehensive Testing Script for Hemam Center
# This script runs all tests and validates the system

set -e

# Configuration
TEST_DIR="./src/__tests__"
COVERAGE_DIR="./coverage"
LOG_DIR="./logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
        exit 1
    fi
    
    # Check if Jest is available
    if ! npm list jest &> /dev/null; then
        error "Jest is not installed"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    npm install
    
    success "Dependencies installed"
}

# Run unit tests
run_unit_tests() {
    log "Running unit tests..."
    
    # Create coverage directory
    mkdir -p $COVERAGE_DIR
    
    # Run Jest tests
    npm test -- --coverage --coverageDirectory=$COVERAGE_DIR --verbose
    
    success "Unit tests completed"
}

# Run integration tests
run_integration_tests() {
    log "Running integration tests..."
    
    # Run API tests
    npm run test:api
    
    success "Integration tests completed"
}

# Run end-to-end tests
run_e2e_tests() {
    log "Running end-to-end tests..."
    
    # Run E2E tests
    npm run test:e2e
    
    success "End-to-end tests completed"
}

# Run performance tests
run_performance_tests() {
    log "Running performance tests..."
    
    # Run performance tests
    npm run test:performance
    
    success "Performance tests completed"
}

# Run security tests
run_security_tests() {
    log "Running security tests..."
    
    # Run security tests
    npm run test:security
    
    success "Security tests completed"
}

# Run accessibility tests
run_accessibility_tests() {
    log "Running accessibility tests..."
    
    # Run accessibility tests
    npm run test:accessibility
    
    success "Accessibility tests completed"
}

# Run linting
run_linting() {
    log "Running linting..."
    
    # Run ESLint
    npm run lint
    
    # Run Prettier
    npm run format:check
    
    success "Linting completed"
}

# Run type checking
run_type_checking() {
    log "Running type checking..."
    
    # Run TypeScript compiler
    npm run type-check
    
    success "Type checking completed"
}

# Run build test
run_build_test() {
    log "Running build test..."
    
    # Clean previous build
    rm -rf .next
    
    # Run build
    npm run build
    
    success "Build test completed"
}

# Generate test report
generate_test_report() {
    log "Generating test report..."
    
    # Create logs directory
    mkdir -p $LOG_DIR
    
    # Generate HTML coverage report
    if [[ -d "$COVERAGE_DIR" ]]; then
        npx nyc report --reporter=html --report-dir=$COVERAGE_DIR/html
        success "HTML coverage report generated: $COVERAGE_DIR/html/index.html"
    fi
    
    # Generate JSON report
    if [[ -d "$COVERAGE_DIR" ]]; then
        npx nyc report --reporter=json --report-dir=$COVERAGE_DIR
        success "JSON coverage report generated: $COVERAGE_DIR/coverage-final.json"
    fi
    
    # Generate summary
    if [[ -f "$COVERAGE_DIR/coverage-final.json" ]]; then
        node -e "
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('$COVERAGE_DIR/coverage-final.json', 'utf8'));
            const summary = coverage.total;
            console.log('Coverage Summary:');
            console.log('Lines:', summary.lines.pct + '%');
            console.log('Functions:', summary.functions.pct + '%');
            console.log('Branches:', summary.branches.pct + '%');
            console.log('Statements:', summary.statements.pct + '%');
        " > $LOG_DIR/coverage-summary.txt
        success "Coverage summary generated: $LOG_DIR/coverage-summary.txt"
    fi
}

# Clean up test artifacts
cleanup() {
    log "Cleaning up test artifacts..."
    
    # Remove coverage directory
    rm -rf $COVERAGE_DIR
    
    # Remove test logs
    rm -rf $LOG_DIR/test-*.log
    
    success "Cleanup completed"
}

# Show test results
show_results() {
    log "Test Results:"
    
    echo "Coverage Report:"
    if [[ -f "$LOG_DIR/coverage-summary.txt" ]]; then
        cat $LOG_DIR/coverage-summary.txt
    else
        echo "No coverage report available"
    fi
    
    echo ""
    echo "Test Logs:"
    if [[ -d "$LOG_DIR" ]]; then
        ls -la $LOG_DIR/
    else
        echo "No test logs available"
    fi
}

# Main testing function
main() {
    log "Starting comprehensive testing of Hemam Center..."
    
    # Parse command line arguments
    RUN_UNIT=true
    RUN_INTEGRATION=true
    RUN_E2E=false
    RUN_PERFORMANCE=false
    RUN_SECURITY=false
    RUN_ACCESSIBILITY=false
    RUN_LINT=true
    RUN_TYPE_CHECK=true
    RUN_BUILD=true
    GENERATE_REPORT=true
    CLEANUP_AFTER=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --unit-only)
                RUN_INTEGRATION=false
                RUN_E2E=false
                RUN_PERFORMANCE=false
                RUN_SECURITY=false
                RUN_ACCESSIBILITY=false
                shift
                ;;
            --integration-only)
                RUN_UNIT=false
                RUN_E2E=false
                RUN_PERFORMANCE=false
                RUN_SECURITY=false
                RUN_ACCESSIBILITY=false
                shift
                ;;
            --e2e-only)
                RUN_UNIT=false
                RUN_INTEGRATION=false
                RUN_PERFORMANCE=false
                RUN_SECURITY=false
                RUN_ACCESSIBILITY=false
                shift
                ;;
            --performance)
                RUN_PERFORMANCE=true
                shift
                ;;
            --security)
                RUN_SECURITY=true
                shift
                ;;
            --accessibility)
                RUN_ACCESSIBILITY=true
                shift
                ;;
            --no-lint)
                RUN_LINT=false
                shift
                ;;
            --no-type-check)
                RUN_TYPE_CHECK=false
                shift
                ;;
            --no-build)
                RUN_BUILD=false
                shift
                ;;
            --no-report)
                GENERATE_REPORT=false
                shift
                ;;
            --cleanup)
                CLEANUP_AFTER=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --unit-only         Run only unit tests"
                echo "  --integration-only  Run only integration tests"
                echo "  --e2e-only         Run only end-to-end tests"
                echo "  --performance      Run performance tests"
                echo "  --security         Run security tests"
                echo "  --accessibility    Run accessibility tests"
                echo "  --no-lint          Skip linting"
                echo "  --no-type-check    Skip type checking"
                echo "  --no-build         Skip build test"
                echo "  --no-report        Skip report generation"
                echo "  --cleanup          Clean up after tests"
                echo "  --help             Show this help"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run testing steps
    check_prerequisites
    install_dependencies
    
    if [[ "$RUN_LINT" == true ]]; then
        run_linting
    fi
    
    if [[ "$RUN_TYPE_CHECK" == true ]]; then
        run_type_checking
    fi
    
    if [[ "$RUN_UNIT" == true ]]; then
        run_unit_tests
    fi
    
    if [[ "$RUN_INTEGRATION" == true ]]; then
        run_integration_tests
    fi
    
    if [[ "$RUN_E2E" == true ]]; then
        run_e2e_tests
    fi
    
    if [[ "$RUN_PERFORMANCE" == true ]]; then
        run_performance_tests
    fi
    
    if [[ "$RUN_SECURITY" == true ]]; then
        run_security_tests
    fi
    
    if [[ "$RUN_ACCESSIBILITY" == true ]]; then
        run_accessibility_tests
    fi
    
    if [[ "$RUN_BUILD" == true ]]; then
        run_build_test
    fi
    
    if [[ "$GENERATE_REPORT" == true ]]; then
        generate_test_report
    fi
    
    if [[ "$CLEANUP_AFTER" == true ]]; then
        cleanup
    fi
    
    show_results
    
    success "Testing completed successfully!"
}

# Run main function
main "$@"