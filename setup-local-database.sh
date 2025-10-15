#!/bin/bash

# Setup Local Database for Moeen Healthcare System
echo "🚀 Setting up local PostgreSQL database..."

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="moeen_healthcare"
DB_USER="moeen_user"
DB_PASSWORD="moeen_password"

# Test connection
echo "🔍 Testing database connection..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 'Database connection successful!' as status;"

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    
    # Create environment file
    echo "📝 Creating local environment configuration..."
    cat > .env.local.backup << EOF
# Local Database Configuration
# Use this when Supabase is down or for local development

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Mu3een
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000
BASE_URL=http://localhost:3000

# Local PostgreSQL Database
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Auth (using local JWT)
JWT_SECRET=your-jwt-secret-key-here-local-dev
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Email (optional for local dev)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Webhooks
WEBHOOK_SECRET=your-webhook-secret-here

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_AI=true

# Development
USE_WEB_SERVER=1

# Redis (optional)
REDIS_URL=redis://localhost:6379
EOF

    echo "✅ Environment file created: .env.local.backup"
    echo ""
    echo "🔧 To use local database:"
    echo "1. Copy .env.local.backup to .env.local"
    echo "2. Run: cp .env.local.backup .env.local"
    echo "3. Start your app: npm run dev"
    echo ""
    echo "📊 Database Details:"
    echo "   Host: $DB_HOST"
    echo "   Port: $DB_PORT"
    echo "   Database: $DB_NAME"
    echo "   User: $DB_USER"
    echo "   Connection String: postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    
else
    echo "❌ Database connection failed!"
    echo "Please check if PostgreSQL is running: sudo service postgresql status"
fi
