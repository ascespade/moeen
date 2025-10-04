#!/bin/bash

# 🔗 Git Integration System - تكامل Git الشامل
# نظام متكامل لإدارة Git مع GitHub/GitLab/Bitbucket

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
GIT_CONFIG_DIR="/home/codeserver/.config/git"
SSH_CONFIG_DIR="/home/codeserver/.ssh"
WORKSPACE_DIR="/home/codeserver/workspace"

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Install Git and related tools
install_git_tools() {
    log "🔧 تثبيت أدوات Git..."
    
    apt update
    apt install -y \
        git \
        git-lfs \
        git-flow \
        gh \
        hub \
        gitk \
        git-gui \
        tig \
        gitg \
        meld \
        curl \
        jq
    
    # Install GitLab CLI
    curl -fsSL https://gitlab.com/gitlab-org/cli/-/releases/v1.32.0/downloads/glab_1.32.0_Linux_x86_64.tar.gz | tar -xz -C /tmp
    mv /tmp/bin/glab /usr/local/bin/
    chmod +x /usr/local/bin/glab
    
    # Install additional Git tools
    pip3 install git-review gitpython
    
    log "✅ تم تثبيت أدوات Git"
}

# Configure Git globally
configure_git_global() {
    log "⚙️ إعداد Git العام..."
    
    # Create directories
    mkdir -p "$GIT_CONFIG_DIR" "$SSH_CONFIG_DIR"
    chown -R codeserver:codeserver "$GIT_CONFIG_DIR" "$SSH_CONFIG_DIR"
    
    # Global Git configuration
    sudo -u codeserver git config --global init.defaultBranch main
    sudo -u codeserver git config --global pull.rebase true
    sudo -u codeserver git config --global push.autoSetupRemote true
    sudo -u codeserver git config --global fetch.prune true
    sudo -u codeserver git config --global rebase.autoStash true
    sudo -u codeserver git config --global merge.tool meld
    sudo -u codeserver git config --global diff.tool meld
    sudo -u codeserver git config --global core.autocrlf input
    sudo -u codeserver git config --global core.fileMode false
    sudo -u codeserver git config --global core.ignorecase false
    
    # Advanced Git settings
    sudo -u codeserver git config --global credential.helper 'cache --timeout=3600'
    sudo -u codeserver git config --global rerere.enabled true
    sudo -u codeserver git config --global log.date relative
    sudo -u codeserver git config --global format.pretty "format:%C(yellow)%h%C(reset) %C(blue)%an%C(reset) %C(cyan)%cr%C(reset) %s"
    
    # Git aliases
    sudo -u codeserver git config --global alias.st status
    sudo -u codeserver git config --global alias.co checkout
    sudo -u codeserver git config --global alias.br branch
    sudo -u codeserver git config --global alias.ci commit
    sudo -u codeserver git config --global alias.df diff
    sudo -u codeserver git config --global alias.lg "log --oneline --graph --decorate --all"
    sudo -u codeserver git config --global alias.lga "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all"
    sudo -u codeserver git config --global alias.unstage "reset HEAD --"
    sudo -u codeserver git config --global alias.last "log -1 HEAD"
    sudo -u codeserver git config --global alias.visual "!gitk"
    sudo -u codeserver git config --global alias.pushf "push --force-with-lease"
    sudo -u codeserver git config --global alias.amend "commit --amend --no-edit"
    sudo -u codeserver git config --global alias.fix "commit --fixup"
    sudo -u codeserver git config --global alias.squash "commit --squash"
    sudo -u codeserver git config --global alias.wip "commit -am 'WIP: work in progress'"
    sudo -u codeserver git config --global alias.unwip "reset HEAD~1"
    
    log "✅ تم إعداد Git العام"
}

# Setup SSH keys for different providers
setup_ssh_keys() {
    log "🔑 إعداد مفاتيح SSH..."
    
    # SSH config template
    cat > "$SSH_CONFIG_DIR/config" << 'EOF'
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github
    IdentitiesOnly yes

# GitLab
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_rsa_gitlab
    IdentitiesOnly yes

# Bitbucket
Host bitbucket.org
    HostName bitbucket.org
    User git
    IdentityFile ~/.ssh/id_rsa_bitbucket
    IdentitiesOnly yes

# Custom GitLab instance
Host gitlab.company.com
    HostName gitlab.company.com
    User git
    IdentityFile ~/.ssh/id_rsa_company
    IdentitiesOnly yes
    Port 22

# General settings
Host *
    AddKeysToAgent yes
    UseKeychain yes
    ServerAliveInterval 60
    ServerAliveCountMax 30
EOF

    # Generate SSH keys for different providers
    providers=("github" "gitlab" "bitbucket" "company")
    
    for provider in "${providers[@]}"; do
        key_file="$SSH_CONFIG_DIR/id_rsa_$provider"
        if [ ! -f "$key_file" ]; then
            log "🔐 إنشاء مفتاح SSH لـ $provider..."
            sudo -u codeserver ssh-keygen -t rsa -b 4096 -f "$key_file" -N "" -C "cursor-dev-$provider@$(hostname)"
        fi
    done
    
    # Set proper permissions
    chmod 700 "$SSH_CONFIG_DIR"
    chmod 600 "$SSH_CONFIG_DIR"/*
    chown -R codeserver:codeserver "$SSH_CONFIG_DIR"
    
    log "✅ تم إعداد مفاتيح SSH"
}

# Create Git hooks
create_git_hooks() {
    log "🪝 إنشاء Git Hooks..."
    
    # Global hooks directory
    HOOKS_DIR="/home/codeserver/.config/git/hooks"
    mkdir -p "$HOOKS_DIR"
    
    # Pre-commit hook
    cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash
# Pre-commit hook for code quality

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Running pre-commit checks...${NC}"

# Check for merge conflict markers
if grep -r "<<<<<<< HEAD" . --exclude-dir=.git; then
    echo -e "${RED}❌ Merge conflict markers found!${NC}"
    exit 1
fi

# Check for TODO/FIXME comments in staged files
staged_files=$(git diff --cached --name-only)
if echo "$staged_files" | xargs grep -l "TODO\|FIXME\|XXX" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  TODO/FIXME comments found in staged files${NC}"
fi

# Run ESLint if available
if command -v eslint &> /dev/null && [ -f .eslintrc.js ] || [ -f .eslintrc.json ]; then
    echo -e "${YELLOW}🔍 Running ESLint...${NC}"
    if ! eslint $staged_files --ext .js,.jsx,.ts,.tsx; then
        echo -e "${RED}❌ ESLint failed!${NC}"
        exit 1
    fi
fi

# Run Prettier if available
if command -v prettier &> /dev/null && [ -f .prettierrc ]; then
    echo -e "${YELLOW}💅 Running Prettier...${NC}"
    prettier --check $staged_files || {
        echo -e "${YELLOW}⚠️  Some files need formatting. Run: prettier --write .${NC}"
    }
fi

# Check Python files with flake8
if command -v flake8 &> /dev/null; then
    python_files=$(echo "$staged_files" | grep '\.py$' || true)
    if [ ! -z "$python_files" ]; then
        echo -e "${YELLOW}🐍 Running flake8...${NC}"
        if ! flake8 $python_files; then
            echo -e "${RED}❌ flake8 failed!${NC}"
            exit 1
        fi
    fi
fi

echo -e "${GREEN}✅ Pre-commit checks passed!${NC}"
EOF

    # Post-commit hook
    cat > "$HOOKS_DIR/post-commit" << 'EOF'
#!/bin/bash
# Post-commit hook for notifications

echo "✅ Commit successful: $(git log -1 --pretty=format:'%h - %s')"

# Optional: Send notification to Slack/Discord
# if [ -f .git/hooks/notify-commit ]; then
#     .git/hooks/notify-commit
# fi
EOF

    # Pre-push hook
    cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash
# Pre-push hook for final checks

echo "🚀 Running pre-push checks..."

# Run tests if available
if [ -f package.json ] && grep -q '"test"' package.json; then
    echo "🧪 Running tests..."
    npm test
fi

if [ -f requirements.txt ] && [ -f manage.py ]; then
    echo "🧪 Running Django tests..."
    python manage.py test
fi

echo "✅ Pre-push checks completed!"
EOF

    # Make hooks executable
    chmod +x "$HOOKS_DIR"/*
    
    # Set global hooks path
    sudo -u codeserver git config --global core.hooksPath "$HOOKS_DIR"
    
    chown -R codeserver:codeserver "$HOOKS_DIR"
    
    log "✅ تم إنشاء Git Hooks"
}

# Create project templates
create_project_templates() {
    log "📋 إنشاء قوالب المشاريع..."
    
    TEMPLATES_DIR="/home/codeserver/workspace/templates"
    mkdir -p "$TEMPLATES_DIR"
    
    # React TypeScript template
    mkdir -p "$TEMPLATES_DIR/react-typescript"
    cat > "$TEMPLATES_DIR/react-typescript/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity
EOF

    # Python Django template
    mkdir -p "$TEMPLATES_DIR/django-project"
    cat > "$TEMPLATES_DIR/django-project/.gitignore" << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
media/

# Environment
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Static files
staticfiles/
static/

# Celery
celerybeat-schedule
celerybeat.pid

# Coverage
htmlcov/
.coverage
.coverage.*
coverage.xml
*.cover
.hypothesis/
.pytest_cache/
EOF

    # Node.js Express template
    mkdir -p "$TEMPLATES_DIR/express-api"
    cat > "$TEMPLATES_DIR/express-api/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Environment variables
.env
.env.test

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
EOF

    chown -R codeserver:codeserver "$TEMPLATES_DIR"
    
    log "✅ تم إنشاء قوالب المشاريع"
}

# Setup Git workflow scripts
create_git_workflows() {
    log "🔄 إنشاء سكريبتات Git Workflow..."
    
    SCRIPTS_DIR="/usr/local/bin"
    
    # Git project initialization script
    cat > "$SCRIPTS_DIR/git-init-project" << 'EOF'
#!/bin/bash
# Initialize a new Git project with best practices

PROJECT_NAME="$1"
PROJECT_TYPE="${2:-general}"
REMOTE_URL="$3"

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: git-init-project <project-name> [project-type] [remote-url]"
    echo "Project types: react, django, express, general"
    exit 1
fi

echo "🚀 Initializing project: $PROJECT_NAME"

# Create project directory
mkdir -p "/home/codeserver/workspace/$PROJECT_NAME"
cd "/home/codeserver/workspace/$PROJECT_NAME"

# Initialize Git
git init
git branch -M main

# Copy appropriate template
TEMPLATE_DIR="/home/codeserver/workspace/templates/$PROJECT_TYPE"
if [ -d "$TEMPLATE_DIR" ]; then
    cp -r "$TEMPLATE_DIR"/* .
    cp -r "$TEMPLATE_DIR"/.[^.]* . 2>/dev/null || true
fi

# Create initial README
cat > README.md << EOL
# $PROJECT_NAME

## Description
Brief description of your project.

## Installation
\`\`\`bash
# Add installation instructions
\`\`\`

## Usage
\`\`\`bash
# Add usage examples
\`\`\`

## Contributing
1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
EOL

# Initial commit
git add .
git commit -m "Initial commit: Setup $PROJECT_NAME project"

# Add remote if provided
if [ ! -z "$REMOTE_URL" ]; then
    git remote add origin "$REMOTE_URL"
    echo "📡 Remote added: $REMOTE_URL"
fi

echo "✅ Project $PROJECT_NAME initialized successfully!"
echo "📁 Location: /home/codeserver/workspace/$PROJECT_NAME"
EOF

    # Git cleanup script
    cat > "$SCRIPTS_DIR/git-cleanup" << 'EOF'
#!/bin/bash
# Clean up Git repository

echo "🧹 Cleaning up Git repository..."

# Remove merged branches
git branch --merged | grep -v "\*\|main\|master\|develop" | xargs -n 1 git branch -d

# Clean up remote tracking branches
git remote prune origin

# Garbage collection
git gc --prune=now

# Clean up untracked files (with confirmation)
read -p "Remove untracked files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git clean -fd
fi

echo "✅ Repository cleaned up!"
EOF

    # Git sync script
    cat > "$SCRIPTS_DIR/git-sync" << 'EOF'
#!/bin/bash
# Sync with remote repository

BRANCH=$(git branch --show-current)

echo "🔄 Syncing branch '$BRANCH' with remote..."

# Stash any uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "💾 Stashing uncommitted changes..."
    git stash push -m "Auto-stash before sync $(date)"
    STASHED=true
fi

# Fetch latest changes
git fetch origin

# Rebase current branch
if git rebase origin/$BRANCH; then
    echo "✅ Successfully synced with remote"
else
    echo "❌ Rebase failed. Resolving conflicts..."
    echo "After resolving conflicts, run: git rebase --continue"
    exit 1
fi

# Pop stash if we stashed changes
if [ "$STASHED" = true ]; then
    echo "📤 Restoring stashed changes..."
    git stash pop
fi

echo "🎉 Sync completed!"
EOF

    # Make scripts executable
    chmod +x "$SCRIPTS_DIR"/git-*
    
    log "✅ تم إنشاء سكريبتات Git Workflow"
}

# Setup Git GUI tools
setup_git_gui() {
    log "🖥️ إعداد أدوات Git الرسومية..."
    
    # Install GitKraken (if license available)
    # wget https://release.gitkraken.com/linux/gitkraken-amd64.deb
    # dpkg -i gitkraken-amd64.deb || apt-get install -f
    
    # Configure Git GUI tools
    sudo -u codeserver git config --global gui.recentrepo "/home/codeserver/workspace"
    sudo -u codeserver git config --global gui.fontui "-family \"DejaVu Sans\" -size 9"
    sudo -u codeserver git config --global gui.fontdiff "-family \"DejaVu Sans Mono\" -size 9"
    
    log "✅ تم إعداد أدوات Git الرسومية"
}

# Create Git integration with Code Server
integrate_with_code_server() {
    log "🔗 تكامل Git مع Code Server..."
    
    # Create Code Server Git extension configuration
    EXTENSIONS_DIR="/home/codeserver/extensions"
    mkdir -p "$EXTENSIONS_DIR"
    
    # Git extension settings
    cat > "/home/codeserver/.local/share/code-server/User/settings.json" << 'EOF'
{
    "git.enableSmartCommit": true,
    "git.autofetch": true,
    "git.autofetchPeriod": 180,
    "git.confirmSync": false,
    "git.enableStatusBarSync": true,
    "git.postCommitCommand": "sync",
    "git.showPushSuccessNotification": true,
    "git.suggestSmartCommit": true,
    "git.enableCommitSigning": false,
    "git.defaultCloneDirectory": "/home/codeserver/workspace",
    "git.openRepositoryInParentFolders": "always",
    "git.scanRepositories": [
        "/home/codeserver/workspace"
    ],
    "git.decorations.enabled": true,
    "git.branchProtection": true,
    "git.branchProtectionPrompt": "alwaysCommit",
    "gitHistory.showTags": true,
    "gitHistory.showBranches": true,
    "gitlens.advanced.messages": {
        "suppressCommitHasNoPreviousCommitWarning": false,
        "suppressCommitNotFoundWarning": false,
        "suppressFileNotUnderSourceControlWarning": false,
        "suppressGitVersionWarning": false,
        "suppressLineUncommittedWarning": false,
        "suppressNoRepositoryWarning": false
    },
    "gitlens.currentLine.enabled": true,
    "gitlens.hovers.currentLine.over": "line",
    "gitlens.statusBar.enabled": true,
    "gitlens.views.repositories.files.layout": "tree"
}
EOF

    chown -R codeserver:codeserver "/home/codeserver/.local"
    
    log "✅ تم تكامل Git مع Code Server"
}

# Main installation function
main() {
    echo -e "${PURPLE}🔗 Git Integration System Setup${NC}"
    echo -e "${CYAN}=================================${NC}"
    
    install_git_tools
    configure_git_global
    setup_ssh_keys
    create_git_hooks
    create_project_templates
    create_git_workflows
    setup_git_gui
    integrate_with_code_server
    
    echo ""
    echo -e "${GREEN}🎉 Git Integration Setup Complete!${NC}"
    echo -e "${CYAN}=================================${NC}"
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo -e "${YELLOW}  1. Add your Git credentials:${NC}"
    echo -e "${GREEN}     git config --global user.name 'Your Name'${NC}"
    echo -e "${GREEN}     git config --global user.email 'your@email.com'${NC}"
    echo ""
    echo -e "${YELLOW}  2. Add SSH keys to your Git providers:${NC}"
    echo -e "${GREEN}     cat ~/.ssh/id_rsa_github.pub${NC}"
    echo -e "${GREEN}     cat ~/.ssh/id_rsa_gitlab.pub${NC}"
    echo ""
    echo -e "${YELLOW}  3. Test SSH connections:${NC}"
    echo -e "${GREEN}     ssh -T git@github.com${NC}"
    echo -e "${GREEN}     ssh -T git@gitlab.com${NC}"
    echo ""
    echo -e "${YELLOW}  4. Initialize a new project:${NC}"
    echo -e "${GREEN}     git-init-project my-project react${NC}"
    echo ""
    echo -e "${BLUE}🔧 Available Commands:${NC}"
    echo -e "${GREEN}  git-init-project  - Initialize new project${NC}"
    echo -e "${GREEN}  git-cleanup       - Clean up repository${NC}"
    echo -e "${GREEN}  git-sync          - Sync with remote${NC}"
    echo ""
}

# Execute main function
main "$@"
