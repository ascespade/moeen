#!/bin/bash

# 📥 Project Import System - نظام استيراد المشاريع الذكي
# استيراد وإعداد المشاريع من مختلف المصادر بطريقة ذكية

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
WORKSPACE_DIR="/home/codeserver/workspace"
IMPORT_CONFIG="/home/codeserver/.config/project-import"
TEMPLATES_DIR="/home/codeserver/workspace/templates"

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Detect project type based on files
detect_project_type() {
    local project_dir="$1"
    local project_type="unknown"
    
    cd "$project_dir"
    
    # React/Next.js detection
    if [[ -f "package.json" ]]; then
        if grep -q "react" package.json; then
            if grep -q "next" package.json; then
                project_type="nextjs"
            else
                project_type="react"
            fi
        elif grep -q "vue" package.json; then
            project_type="vue"
        elif grep -q "angular" package.json; then
            project_type="angular"
        elif grep -q "express" package.json; then
            project_type="express"
        elif grep -q "electron" package.json; then
            project_type="electron"
        else
            project_type="nodejs"
        fi
    fi
    
    # Python detection
    if [[ -f "requirements.txt" || -f "pyproject.toml" || -f "setup.py" ]]; then
        if [[ -f "manage.py" ]]; then
            project_type="django"
        elif [[ -f "app.py" || -f "main.py" ]] && grep -q "flask" requirements.txt 2>/dev/null; then
            project_type="flask"
        elif [[ -f "pyproject.toml" ]] && grep -q "fastapi" pyproject.toml 2>/dev/null; then
            project_type="fastapi"
        else
            project_type="python"
        fi
    fi
    
    # PHP detection
    if [[ -f "composer.json" ]]; then
        if [[ -f "artisan" ]]; then
            project_type="laravel"
        elif grep -q "symfony" composer.json; then
            project_type="symfony"
        else
            project_type="php"
        fi
    fi
    
    # Java detection
    if [[ -f "pom.xml" ]]; then
        project_type="maven"
    elif [[ -f "build.gradle" ]]; then
        project_type="gradle"
    fi
    
    # Go detection
    if [[ -f "go.mod" ]]; then
        project_type="go"
    fi
    
    # Rust detection
    if [[ -f "Cargo.toml" ]]; then
        project_type="rust"
    fi
    
    # .NET detection
    if [[ -f "*.csproj" || -f "*.sln" ]]; then
        project_type="dotnet"
    fi
    
    # Docker detection
    if [[ -f "Dockerfile" ]]; then
        project_type="${project_type}-docker"
    fi
    
    # Kubernetes detection
    if [[ -d "k8s" || -d "kubernetes" || -f "*.yaml" ]] && grep -q "apiVersion" *.yaml 2>/dev/null; then
        project_type="${project_type}-k8s"
    fi
    
    echo "$project_type"
}

# Install project dependencies
install_dependencies() {
    local project_dir="$1"
    local project_type="$2"
    
    cd "$project_dir"
    log "📦 تثبيت التبعيات للمشروع من نوع: $project_type"
    
    case "$project_type" in
        "react"|"nextjs"|"vue"|"angular"|"nodejs"|"express"|"electron")
            if [[ -f "package.json" ]]; then
                log "📦 تثبيت Node.js dependencies..."
                if command -v yarn &> /dev/null && [[ -f "yarn.lock" ]]; then
                    yarn install
                elif command -v pnpm &> /dev/null && [[ -f "pnpm-lock.yaml" ]]; then
                    pnpm install
                else
                    npm install
                fi
            fi
            ;;
        "django"|"flask"|"fastapi"|"python")
            if [[ -f "requirements.txt" ]]; then
                log "🐍 تثبيت Python dependencies..."
                python3 -m venv venv
                source venv/bin/activate
                pip install -r requirements.txt
            elif [[ -f "pyproject.toml" ]]; then
                log "🐍 تثبيت Python dependencies with Poetry..."
                if command -v poetry &> /dev/null; then
                    poetry install
                else
                    pip install poetry
                    poetry install
                fi
            fi
            ;;
        "laravel"|"symfony"|"php")
            if [[ -f "composer.json" ]]; then
                log "🐘 تثبيت PHP dependencies..."
                composer install
            fi
            ;;
        "maven")
            log "☕ تثبيت Maven dependencies..."
            mvn clean install
            ;;
        "gradle")
            log "☕ تثبيت Gradle dependencies..."
            ./gradlew build
            ;;
        "go")
            log "🐹 تثبيت Go dependencies..."
            go mod download
            go mod tidy
            ;;
        "rust")
            log "🦀 تثبيت Rust dependencies..."
            cargo build
            ;;
        "dotnet")
            log "🔷 تثبيت .NET dependencies..."
            dotnet restore
            dotnet build
            ;;
    esac
}

# Setup development environment
setup_dev_environment() {
    local project_dir="$1"
    local project_type="$2"
    
    cd "$project_dir"
    log "🔧 إعداد بيئة التطوير..."
    
    # Create .vscode directory with settings
    mkdir -p .vscode
    
    # General VS Code settings
    cat > .vscode/settings.json << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.organizeImports": true
    },
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "git.enableSmartCommit": true,
    "git.autofetch": true,
    "terminal.integrated.defaultProfile.linux": "bash"
}
EOF

    # Project-specific configurations
    case "$project_type" in
        "react"|"nextjs"|"vue"|"angular"|"nodejs"|"express")
            # TypeScript/JavaScript settings
            cat >> .vscode/settings.json << 'EOF'
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "javascript.preferences.importModuleSpecifier": "relative",
    "eslint.enable": true,
    "prettier.enable": true,
    "emmet.includeLanguages": {
        "javascript": "javascriptreact",
        "typescript": "typescriptreact"
    }
}
EOF
            
            # Create launch configuration
            cat > .vscode/launch.json << 'EOF'
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Program",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/src/index.js",
            "console": "integratedTerminal"
        },
        {
            "name": "Debug React App",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/node_modules/.bin/react-scripts",
            "args": ["start"],
            "console": "integratedTerminal"
        }
    ]
}
EOF
            ;;
        "django"|"flask"|"fastapi"|"python")
            # Python settings
            cat >> .vscode/settings.json << 'EOF'
{
    "python.defaultInterpreterPath": "./venv/bin/python",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": true,
    "python.linting.flake8Enabled": true,
    "python.formatting.provider": "black",
    "python.sortImports.args": ["--profile", "black"]
}
EOF
            
            # Python launch configuration
            cat > .vscode/launch.json << 'EOF'
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal"
        },
        {
            "name": "Django",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/manage.py",
            "args": ["runserver"],
            "django": true
        }
    ]
}
EOF
            ;;
    esac
    
    # Create tasks.json for common tasks
    cat > .vscode/tasks.json << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Install Dependencies",
            "type": "shell",
            "command": "npm install",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        },
        {
            "label": "Start Development Server",
            "type": "shell",
            "command": "npm start",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        },
        {
            "label": "Run Tests",
            "type": "shell",
            "command": "npm test",
            "group": "test",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        }
    ]
}
EOF
}

# Create project documentation
create_project_docs() {
    local project_dir="$1"
    local project_type="$2"
    local project_name="$(basename "$project_dir")"
    
    cd "$project_dir"
    
    # Create comprehensive README if doesn't exist
    if [[ ! -f "README.md" ]]; then
        log "📝 إنشاء ملف README..."
        
        cat > README.md << EOF
# $project_name

## 📋 Description
Brief description of your $project_type project.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for JavaScript projects)
- Python 3.8+ (for Python projects)
- Git

### Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd $project_name

# Install dependencies
npm install  # or pip install -r requirements.txt
\`\`\`

### Development
\`\`\`bash
# Start development server
npm start    # or python manage.py runserver
\`\`\`

### Testing
\`\`\`bash
# Run tests
npm test     # or python -m pytest
\`\`\`

### Building
\`\`\`bash
# Build for production
npm run build
\`\`\`

## 📁 Project Structure
\`\`\`
$project_name/
├── src/                 # Source code
├── public/              # Public assets
├── tests/               # Test files
├── docs/                # Documentation
├── .vscode/             # VS Code configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
\`\`\`

## 🛠️ Technologies Used
- **Framework**: $project_type
- **Language**: $(case $project_type in *python*) echo "Python" ;; *node*|*react*|*vue*) echo "JavaScript/TypeScript" ;; *) echo "Multiple" ;; esac)
- **Database**: TBD
- **Deployment**: TBD

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support
- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/username/$project_name/issues)
- 📖 Documentation: [Wiki](https://github.com/username/$project_name/wiki)
EOF
    fi
    
    # Create CONTRIBUTING.md
    cat > CONTRIBUTING.md << 'EOF'
# Contributing Guidelines

## Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature
4. Make your changes
5. Test your changes
6. Submit a pull request

## Code Style
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features

## Commit Messages
- Use clear and descriptive commit messages
- Start with a verb (Add, Fix, Update, etc.)
- Keep the first line under 50 characters
- Add detailed description if needed

## Pull Request Process
1. Update the README.md with details of changes if applicable
2. Update the version numbers following SemVer
3. The PR will be merged once you have approval from maintainers
EOF

    # Create .env.example if project uses environment variables
    if [[ "$project_type" =~ (react|nextjs|django|flask|fastapi|express) ]]; then
        cat > .env.example << 'EOF'
# Environment Variables Template
# Copy this file to .env and fill in your values

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Keys
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here

# Development
DEBUG=true
NODE_ENV=development

# Server
PORT=3000
HOST=localhost
EOF
    fi
}

# Setup CI/CD configuration
setup_cicd() {
    local project_dir="$1"
    local project_type="$2"
    
    cd "$project_dir"
    log "🔄 إعداد CI/CD..."
    
    # GitHub Actions
    mkdir -p .github/workflows
    
    case "$project_type" in
        "react"|"nextjs"|"vue"|"nodejs"|"express")
            cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: echo "Deploy to production server"
EOF
            ;;
        "django"|"flask"|"fastapi"|"python")
            cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: [3.8, 3.9, '3.10']
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest pytest-cov flake8
    
    - name: Lint with flake8
      run: |
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
    
    - name: Test with pytest
      run: |
        pytest --cov=./ --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: echo "Deploy to production server"
EOF
            ;;
    esac
    
    # GitLab CI
    case "$project_type" in
        "react"|"nextjs"|"vue"|"nodejs"|"express")
            cat > .gitlab-ci.yml << 'EOF'
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  script:
    - echo "Deploy to production"
  only:
    - main
EOF
            ;;
    esac
}

# Import project from URL
import_from_url() {
    local repo_url="$1"
    local project_name="$2"
    local target_dir="$WORKSPACE_DIR/$project_name"
    
    log "📥 استيراد المشروع من: $repo_url"
    
    # Clone repository
    if git clone "$repo_url" "$target_dir"; then
        log "✅ تم استنساخ المشروع بنجاح"
    else
        error "فشل في استنساخ المشروع"
        return 1
    fi
    
    # Detect project type
    local project_type=$(detect_project_type "$target_dir")
    log "🔍 نوع المشروع المكتشف: $project_type"
    
    # Setup project
    setup_imported_project "$target_dir" "$project_type" "$project_name"
}

# Import project from archive
import_from_archive() {
    local archive_path="$1"
    local project_name="$2"
    local target_dir="$WORKSPACE_DIR/$project_name"
    
    log "📦 استيراد المشروع من الأرشيف: $archive_path"
    
    mkdir -p "$target_dir"
    
    # Extract archive based on type
    case "$archive_path" in
        *.tar.gz|*.tgz)
            tar -xzf "$archive_path" -C "$target_dir" --strip-components=1
            ;;
        *.tar.bz2)
            tar -xjf "$archive_path" -C "$target_dir" --strip-components=1
            ;;
        *.zip)
            unzip -q "$archive_path" -d "$target_dir"
            # Move files up if they're in a subdirectory
            if [ $(ls -1 "$target_dir" | wc -l) -eq 1 ] && [ -d "$target_dir/$(ls -1 "$target_dir")" ]; then
                mv "$target_dir"/*/. "$target_dir"
                rmdir "$target_dir"/*/
            fi
            ;;
        *)
            error "نوع الأرشيف غير مدعوم: $archive_path"
            return 1
            ;;
    esac
    
    # Detect project type
    local project_type=$(detect_project_type "$target_dir")
    log "🔍 نوع المشروع المكتشف: $project_type"
    
    # Setup project
    setup_imported_project "$target_dir" "$project_type" "$project_name"
}

# Setup imported project
setup_imported_project() {
    local project_dir="$1"
    local project_type="$2"
    local project_name="$3"
    
    log "🔧 إعداد المشروع المستورد..."
    
    # Change ownership
    chown -R codeserver:codeserver "$project_dir"
    
    # Install dependencies
    install_dependencies "$project_dir" "$project_type"
    
    # Setup development environment
    setup_dev_environment "$project_dir" "$project_type"
    
    # Create documentation
    create_project_docs "$project_dir" "$project_type"
    
    # Setup CI/CD
    setup_cicd "$project_dir" "$project_type"
    
    # Initialize Git if not already initialized
    cd "$project_dir"
    if [[ ! -d ".git" ]]; then
        log "🔄 تهيئة Git repository..."
        sudo -u codeserver git init
        sudo -u codeserver git add .
        sudo -u codeserver git commit -m "Initial import of $project_name"
    fi
    
    log "✅ تم إعداد المشروع بنجاح: $project_name"
    log "📁 المسار: $project_dir"
    log "🔧 النوع: $project_type"
}

# Create import configuration
create_import_config() {
    mkdir -p "$IMPORT_CONFIG"
    
    cat > "$IMPORT_CONFIG/config.json" << 'EOF'
{
    "default_workspace": "/home/codeserver/workspace",
    "auto_install_deps": true,
    "auto_setup_vscode": true,
    "auto_create_docs": true,
    "auto_setup_cicd": true,
    "supported_archives": [".zip", ".tar.gz", ".tar.bz2", ".tgz"],
    "project_templates": {
        "react": "react-typescript",
        "vue": "vue3-typescript",
        "angular": "angular-latest",
        "django": "django-project",
        "flask": "flask-api",
        "express": "express-api"
    }
}
EOF

    chown -R codeserver:codeserver "$IMPORT_CONFIG"
}

# Main import function
import_project() {
    local source="$1"
    local project_name="$2"
    
    if [[ -z "$source" || -z "$project_name" ]]; then
        echo "Usage: import-project <source> <project-name>"
        echo "Source can be:"
        echo "  - Git URL (https://github.com/user/repo.git)"
        echo "  - Archive file (.zip, .tar.gz, .tar.bz2)"
        echo "  - Directory path"
        exit 1
    fi
    
    # Check if project already exists
    if [[ -d "$WORKSPACE_DIR/$project_name" ]]; then
        error "المشروع موجود بالفعل: $project_name"
        read -p "هل تريد الكتابة فوقه؟ (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        rm -rf "$WORKSPACE_DIR/$project_name"
    fi
    
    # Determine source type and import
    if [[ "$source" =~ ^https?:// ]] || [[ "$source" =~ \.git$ ]]; then
        import_from_url "$source" "$project_name"
    elif [[ -f "$source" ]]; then
        import_from_archive "$source" "$project_name"
    elif [[ -d "$source" ]]; then
        log "📁 نسخ المشروع من المجلد: $source"
        cp -r "$source" "$WORKSPACE_DIR/$project_name"
        local project_type=$(detect_project_type "$WORKSPACE_DIR/$project_name")
        setup_imported_project "$WORKSPACE_DIR/$project_name" "$project_type" "$project_name"
    else
        error "مصدر غير صالح: $source"
        exit 1
    fi
}

# Setup function
setup_import_system() {
    log "📥 إعداد نظام استيراد المشاريع..."
    
    # Create necessary directories
    mkdir -p "$WORKSPACE_DIR" "$IMPORT_CONFIG" "$TEMPLATES_DIR"
    
    # Create import configuration
    create_import_config
    
    # Create import script
    cat > /usr/local/bin/import-project << 'EOF'
#!/bin/bash
/home/codeserver/workspace/scripts/project-import-system.sh import_project "$@"
EOF
    chmod +x /usr/local/bin/import-project
    
    # Create project listing script
    cat > /usr/local/bin/list-projects << 'EOF'
#!/bin/bash
echo "📁 المشاريع المتاحة:"
echo "===================="
for dir in /home/codeserver/workspace/*/; do
    if [[ -d "$dir" && "$dir" != */templates/ ]]; then
        project_name=$(basename "$dir")
        project_type="unknown"
        
        # Detect project type
        if [[ -f "$dir/package.json" ]]; then
            if grep -q "react" "$dir/package.json"; then
                project_type="React"
            elif grep -q "vue" "$dir/package.json"; then
                project_type="Vue"
            elif grep -q "express" "$dir/package.json"; then
                project_type="Express"
            else
                project_type="Node.js"
            fi
        elif [[ -f "$dir/manage.py" ]]; then
            project_type="Django"
        elif [[ -f "$dir/requirements.txt" ]]; then
            project_type="Python"
        elif [[ -f "$dir/composer.json" ]]; then
            project_type="PHP"
        elif [[ -f "$dir/go.mod" ]]; then
            project_type="Go"
        elif [[ -f "$dir/Cargo.toml" ]]; then
            project_type="Rust"
        fi
        
        printf "%-20s %s\n" "$project_name" "($project_type)"
    fi
done
EOF
    chmod +x /usr/local/bin/list-projects
    
    chown -R codeserver:codeserver "$WORKSPACE_DIR" "$IMPORT_CONFIG"
    
    log "✅ تم إعداد نظام استيراد المشاريع"
}

# Main execution
case "${1:-setup}" in
    "setup")
        setup_import_system
        ;;
    "import_project")
        shift
        import_project "$@"
        ;;
    *)
        echo "Usage: $0 [setup|import_project <source> <name>]"
        exit 1
        ;;
esac
