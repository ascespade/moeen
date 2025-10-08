#!/bin/bash

# Production Deployment Script for Hemam Center
# This script handles the complete deployment process

set -e

# Configuration
APP_NAME="hemam-center"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
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

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if environment file exists
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file $ENV_FILE not found"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p $BACKUP_DIR
    mkdir -p $LOG_DIR
    mkdir -p ./uploads
    mkdir -p ./temp
    mkdir -p ./nginx/ssl
    mkdir -p ./nginx/logs
    mkdir -p ./monitoring
    mkdir -p ./redis
    
    success "Directories created"
}

# Backup existing data
backup_data() {
    log "Creating backup of existing data..."
    
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    mkdir -p $BACKUP_PATH
    
    # Backup database if exists
    if docker-compose -f $DOCKER_COMPOSE_FILE ps postgres | grep -q "Up"; then
        log "Backing up database..."
        docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres pg_dump -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-hemam_center} > $BACKUP_PATH/database.sql
    fi
    
    # Backup uploads
    if [[ -d "./uploads" ]]; then
        log "Backing up uploads..."
        cp -r ./uploads $BACKUP_PATH/
    fi
    
    # Backup configuration files
    log "Backing up configuration files..."
    cp $ENV_FILE $BACKUP_PATH/
    cp $DOCKER_COMPOSE_FILE $BACKUP_PATH/
    cp -r ./nginx $BACKUP_PATH/
    
    success "Backup created: $BACKUP_PATH"
}

# Build and deploy application
deploy_application() {
    log "Building and deploying application..."
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose -f $DOCKER_COMPOSE_FILE pull
    
    # Build application
    log "Building application..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    
    # Stop existing services
    log "Stopping existing services..."
    docker-compose -f $DOCKER_COMPOSE_FILE down
    
    # Start services
    log "Starting services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    success "Application deployed"
}

# Wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for database
    log "Waiting for database..."
    timeout 60 bash -c 'until docker-compose -f $DOCKER_COMPOSE_FILE exec postgres pg_isready -U ${POSTGRES_USER:-postgres}; do sleep 2; done'
    
    # Wait for application
    log "Waiting for application..."
    timeout 120 bash -c 'until curl -f http://localhost:3000/api/health; do sleep 5; done'
    
    # Wait for Redis
    log "Waiting for Redis..."
    timeout 30 bash -c 'until docker-compose -f $DOCKER_COMPOSE_FILE exec redis redis-cli ping; do sleep 2; done'
    
    success "All services are ready"
}

# Run health checks
run_health_checks() {
    log "Running health checks..."
    
    # Check application health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        success "Application health check passed"
    else
        error "Application health check failed"
        return 1
    fi
    
    # Check database connectivity
    if docker-compose -f $DOCKER_COMPOSE_FILE exec postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
        success "Database health check passed"
    else
        error "Database health check failed"
        return 1
    fi
    
    # Check Redis connectivity
    if docker-compose -f $DOCKER_COMPOSE_FILE exec redis redis-cli ping > /dev/null 2>&1; then
        success "Redis health check passed"
    else
        error "Redis health check failed"
        return 1
    fi
    
    success "All health checks passed"
}

# Setup SSL certificates
setup_ssl() {
    log "Setting up SSL certificates..."
    
    if [[ ! -f "./nginx/ssl/cert.pem" ]] || [[ ! -f "./nginx/ssl/key.pem" ]]; then
        warning "SSL certificates not found. Generating self-signed certificates..."
        
        # Generate self-signed certificate
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ./nginx/ssl/key.pem \
            -out ./nginx/ssl/cert.pem \
            -subj "/C=SA/ST=Riyadh/L=Riyadh/O=Hemam Center/CN=hemam-center.com"
        
        success "Self-signed SSL certificates generated"
    else
        success "SSL certificates found"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create Prometheus configuration
    cat > ./monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'hemam-center'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 5s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
    scrape_interval: 10s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 10s
EOF

    # Create Grafana provisioning
    mkdir -p ./monitoring/grafana/provisioning/datasources
    cat > ./monitoring/grafana/provisioning/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

    success "Monitoring setup completed"
}

# Cleanup old resources
cleanup() {
    log "Cleaning up old resources..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove old backups (keep last 7 days)
    find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    
    success "Cleanup completed"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    
    echo "Services:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    
    echo ""
    echo "Application Health:"
    curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || echo "Health check not available"
    
    echo ""
    echo "Logs (last 10 lines):"
    docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=10 app
}

# Main deployment function
main() {
    log "Starting deployment of $APP_NAME..."
    
    # Parse command line arguments
    SKIP_BACKUP=false
    SKIP_HEALTH_CHECK=false
    CLEANUP_OLD=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-health-check)
                SKIP_HEALTH_CHECK=true
                shift
                ;;
            --cleanup)
                CLEANUP_OLD=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --skip-backup        Skip creating backup"
                echo "  --skip-health-check  Skip health checks"
                echo "  --cleanup           Clean up old resources"
                echo "  --help              Show this help"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_root
    check_prerequisites
    create_directories
    
    if [[ "$SKIP_BACKUP" == false ]]; then
        backup_data
    fi
    
    setup_ssl
    setup_monitoring
    deploy_application
    wait_for_services
    
    if [[ "$SKIP_HEALTH_CHECK" == false ]]; then
        run_health_checks
    fi
    
    if [[ "$CLEANUP_OLD" == true ]]; then
        cleanup
    fi
    
    show_status
    
    success "Deployment completed successfully!"
    log "Application is available at: http://localhost:3000"
    log "Monitoring is available at: http://localhost:3001"
    log "Metrics are available at: http://localhost:9090"
}

# Run main function
main "$@"