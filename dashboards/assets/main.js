/**
 * Professional Testing Dashboard
 * Main JavaScript
 */

// ========== State Management ==========
const AppState = {
    currentView: 'modules',
    data: {
        modules: [],
        tests: [],
        stats: {}
    },
    refreshInterval: null
};

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadView('modules');
    startAutoRefresh();
});

function initializeApp() {
    console.log('🚀 Professional Testing Dashboard initialized');
    showToast('System initialized successfully', 'success');
}

function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            if (view) {
                loadView(view);
                updateActiveNav(item);
            }
        });
    });
}

function updateActiveNav(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// ========== View Management ==========
async function loadView(viewName) {
    AppState.currentView = viewName;
    
    const titleMap = {
        'modules': 'Modules Testing Dashboard',
        'development': 'Development Dashboard',
        'system': 'System Monitor',
        'analytics': 'Analytics Dashboard',
        'tests': 'Test Explorer',
        'logs': 'Live Logs',
        'database': 'Database Monitor',
        'config': 'Configuration'
    };
    
    document.getElementById('pageTitle').textContent = titleMap[viewName] || 'Dashboard';
    document.getElementById('currentPage').textContent = titleMap[viewName] || 'Dashboard';
    
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
    
    // Load view content
    switch (viewName) {
        case 'modules':
            await loadModulesView();
            break;
        case 'development':
            await loadDevelopmentView();
            break;
        case 'system':
            await loadSystemView();
            break;
        case 'analytics':
            await loadAnalyticsView();
            break;
        case 'tests':
            await loadTestsView();
            break;
        case 'logs':
            await loadLogsView();
            break;
        default:
            contentView.innerHTML = '<div class="placeholder">View coming soon...</div>';
    }
}

// ========== Modules View ==========
async function loadModulesView() {
    try {
        // Load REAL test data - NO FAKE MODULES
        const response = await fetch('/real-test-status.json');
        const realData = await response.json();
        
        // Show REAL test files as cards
        renderRealTestsView(realData);
        updateStats();
    } catch (error) {
        console.error('Error loading real test data:', error);
        showToast('Error loading test data - Please run "Scan Tests" first', 'error');
        document.getElementById('contentView').innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--text-tertiary);">
                <h2>No test data available</h2>
                <p style="margin: 1rem 0;">Click "Scan Tests" to discover real test files</p>
                <button class="btn btn-primary" onclick="discoverTests()">
                    <span>🔍</span>
                    <span>Scan Tests Now</span>
                </button>
            </div>
        `;
    }
}

function renderRealTestsView(realData) {
    const contentView = document.getElementById('contentView');
    
    if (!realData.testFiles || realData.testFiles.length === 0) {
        contentView.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--text-tertiary);">
                <h2>No test files found</h2>
                <p style="margin: 1rem 0;">Run "Scan Tests" to discover test files in your project</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="real-tests-header" style="margin-bottom: 2rem;">
            <h2>Real Test Files</h2>
            <p style="color: var(--text-tertiary); margin-top: 0.5rem;">
                Last scan: ${realData.lastRun ? new Date(realData.lastRun).toLocaleString('ar-SA') : 'Never'}
            </p>
        </div>
        
        <div class="modules-grid">
            ${realData.testFiles.map((file, index) => `
                <div class="module-card" style="border-left-color: ${getColorForIndex(index)}">
                    <div class="module-header">
                        <div class="module-title">
                            <h3>📄 ${file.path.split('/').pop()}</h3>
                            <span class="module-status status-passing">${file.testCount} tests</span>
                        </div>
                    </div>
                    
                    <div class="module-stats">
                        <div class="stat-item">
                            <span class="stat-label">Tests</span>
                            <span class="stat-value">${file.testCount || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Describes</span>
                            <span class="stat-value">${file.describeBlocks || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Size</span>
                            <span class="stat-value">${(file.size / 1024).toFixed(1)}KB</span>
                        </div>
                    </div>
                    
                    <div class="module-footer">
                        <span style="font-size: 0.75rem; color: var(--text-tertiary); font-family: monospace;">
                            ${file.path}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    contentView.innerHTML = html;
    addModulesViewStyles();
}

function getColorForIndex(index) {
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6'
    ];
    return colors[index % colors.length];
}

// REMOVED: Old fake modules rendering - using REAL test data only

function addModulesViewStyles() {
    if (document.getElementById('modules-view-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modules-view-styles';
    style.textContent = `
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 1.5rem;
        }
        
        .module-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-left-width: 4px;
            border-radius: var(--border-radius);
            padding: 1.5rem;
            transition: var(--transition);
        }
        
        .module-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }
        
        .module-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.25rem;
        }
        
        .module-title h3 {
            font-size: 1.125rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .module-status {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            text-transform: uppercase;
        }
        
        .module-status.status-testing {
            background: rgba(59, 130, 246, 0.2);
            color: var(--primary-500);
        }
        
        .module-status.status-passing {
            background: rgba(16, 185, 129, 0.2);
            color: var(--success-500);
        }
        
        .module-status.status-fixing {
            background: rgba(245, 158, 11, 0.2);
            color: var(--warning-500);
        }
        
        .module-status.status-error {
            background: rgba(239, 68, 68, 0.2);
            color: var(--danger-500);
        }
        
        .module-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .icon-btn {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition);
            color: var(--text-secondary);
        }
        
        .icon-btn:hover {
            background: var(--primary-600);
            border-color: var(--primary-600);
            color: white;
        }
        
        .module-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 1.25rem;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-label {
            display: block;
            font-size: 0.75rem;
            color: var(--text-tertiary);
            margin-bottom: 0.25rem;
        }
        
        .stat-value {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .stat-value.success {
            color: var(--success-500);
        }
        
        .stat-value.danger {
            color: var(--danger-500);
        }
        
        .stat-value.warning {
            color: var(--warning-500);
        }
        
        .module-progress {
            margin-bottom: 1.25rem;
        }
        
        .progress-bar {
            height: 8px;
            background: var(--bg-tertiary);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            transition: width 0.5s ease;
        }
        
        .progress-label {
            font-size: 0.8125rem;
            color: var(--text-tertiary);
        }
        
        .module-tests {
            margin-bottom: 1.25rem;
        }
        
        .tests-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .btn-link {
            background: none;
            border: none;
            color: var(--primary-500);
            cursor: pointer;
            font-size: 0.8125rem;
            font-weight: 600;
        }
        
        .btn-link:hover {
            text-decoration: underline;
        }
        
        .tests-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .test-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: var(--bg-tertiary);
            border-radius: 6px;
            border-left: 3px solid transparent;
        }
        
        .test-item.status-passed {
            border-left-color: var(--success-500);
        }
        
        .test-item.status-failed {
            border-left-color: var(--danger-500);
        }
        
        .test-item.status-running {
            border-left-color: var(--primary-500);
        }
        
        .test-item.status-fixed {
            border-left-color: var(--warning-500);
        }
        
        .test-icon {
            font-size: 1.125rem;
        }
        
        .test-name {
            flex: 1;
            font-size: 0.875rem;
            color: var(--text-primary);
        }
        
        .test-badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
            background: var(--bg-primary);
            border-radius: 4px;
            color: var(--text-tertiary);
        }
        
        .module-footer {
            display: flex;
            justify-content: space-between;
            font-size: 0.8125rem;
            color: var(--text-tertiary);
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
    `;
    
    document.head.appendChild(style);
}

// ========== Test Discovery ==========
async function discoverTests() {
    openModal('testDiscoveryModal');
    
    try {
        const TestDiscovery = require('./test-discovery-api');
        const discovery = new TestDiscovery();
        const results = await discovery.discoverTests();
        
        renderTestDiscoveryResults(results);
    } catch (error) {
        // Fallback to API call
        try {
            const response = await fetch('/api/discover-tests');
            const results = await response.json();
            renderTestDiscoveryResults(results);
        } catch (apiError) {
            document.getElementById('testDiscoveryResults').innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--danger-500);">
                    <p>❌ Error discovering tests</p>
                    <p style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: 0.5rem;">
                        ${apiError.message}
                    </p>
                </div>
            `;
        }
    }
}

function renderTestDiscoveryResults(results) {
    const html = `
        <div class="discovery-summary">
            <h3>📊 Summary</h3>
            <div class="summary-grid">
                <div><strong>${results.totalFiles || 0}</strong> Test Files</div>
                <div><strong>${results.summary?.totalTests || 0}</strong> Total Tests</div>
                <div><strong>${(results.summary?.totalSize / 1024).toFixed(2) || 0}</strong> KB</div>
            </div>
        </div>
        
        <div class="test-files-list">
            ${(results.testFiles || []).map(file => `
                <div class="test-file-card">
                    <div class="file-path">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <code>${file.path}</code>
                    </div>
                    <div class="file-meta">
                        <span>${file.testCount || 0} tests</span>
                        <span>${file.framework || 'Unknown'}</span>
                        <span>${(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('testDiscoveryResults').innerHTML = html;
    showToast('Test discovery completed', 'success');
}

// ========== Data Refresh ==========
async function refreshData() {
    showToast('Refreshing data...', 'info');
    
    try {
        await loadView(AppState.currentView);
        showToast('Data refreshed successfully', 'success');
    } catch (error) {
        showToast('Error refreshing data', 'error');
    }
}

function startAutoRefresh() {
    AppState.refreshInterval = setInterval(() => {
        if (AppState.currentView === 'modules') {
            updateStats();
        }
    }, 3000);
}

async function updateStats(data) {
    try {
        // ONLY REAL DATA - NO SIMULATION, NO MOCK
        const realResponse = await fetch('/real-test-status.json');
        const realData = await realResponse.json();
        
        // Display ACTUAL numbers from REAL test files
        document.getElementById('totalTests').textContent = realData.totalTests || 0;
        document.getElementById('passedTests').textContent = realData.passedTests || 0;
        document.getElementById('failedTests').textContent = realData.failedTests || 0;
        document.getElementById('testFiles').textContent = realData.testFiles?.length || 0;
        
    } catch (error) {
        console.error('Error loading real test data:', error);
        // Show zeros instead of fake data
        document.getElementById('totalTests').textContent = '0';
        document.getElementById('passedTests').textContent = '0';
        document.getElementById('failedTests').textContent = '0';
        document.getElementById('testFiles').textContent = '0';
    }
}

// ========== Export Functions ==========
function exportData() {
    openModal('exportModal');
}

async function exportAs(format) {
    const data = AppState.data.modules;
    
    switch (format) {
        case 'json':
            downloadJSON(data);
            break;
        case 'csv':
            downloadCSV(data);
            break;
        case 'html':
            downloadHTML(data);
            break;
    }
    
    closeModal('exportModal');
    showToast(`Exported as ${format.toUpperCase()}`, 'success');
}

function downloadJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `test-data-${Date.now()}.json`);
}

function downloadCSV(data) {
    // Implementation
    showToast('CSV export coming soon', 'info');
}

function downloadHTML(data) {
    // Implementation
    showToast('HTML export coming soon', 'info');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ========== Modal Management ==========
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ========== Toast Notifications ==========
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <span>${icons[type]}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== Utility Functions ==========
function calculateSuccessRate(module) {
    const total = module.testsRun || 0;
    const passed = module.testsPassed || 0;
    return total > 0 ? Math.round((passed / total) * 100) : 0;
}

function getTestIcon(status) {
    const icons = {
        'passed': '✅',
        'failed': '❌',
        'running': '⚡',
        'fixed': '🔧',
        'pending': '⭕'
    };
    return icons[status] || '○';
}

function formatTime(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

function formatUptime(ms) {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// Placeholder functions
function viewModuleDetails(id) {
    showToast(`Viewing details for module ${id}`, 'info');
}

function restartModule(id) {
    showToast(`Restarting module ${id}`, 'info');
}

function viewAllTests(id) {
    showToast(`Viewing all tests for module ${id}`, 'info');
}

async function loadDevelopmentView() {
    document.getElementById('contentView').innerHTML = '<iframe src="/dev" style="width:100%;height:calc(100vh - 250px);border:none;border-radius:12px;"></iframe>';
}

async function loadSystemView() {
    await loadViewFromFile('system-monitor');
}

async function loadAnalyticsView() {
    await loadViewFromFile('analytics');
}

async function loadTestsView() {
    await loadViewFromFile('test-explorer');
}

async function loadLogsView() {
    await loadViewFromFile('live-logs');
}

async function loadViewFromFile(viewName) {
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
    
    try {
        const response = await fetch(`/dashboards/views/${viewName}.html`);
        if (!response.ok) throw new Error('View not found');
        
        const html = await response.text();
        contentView.innerHTML = html;
        
        // Execute scripts in the loaded content
        const scripts = contentView.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        
    } catch (error) {
        console.error(`Error loading ${viewName}:`, error);
        contentView.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--text-tertiary);">
                <h2>View not available</h2>
                <p style="margin: 1rem 0;">The ${viewName} view is currently unavailable.</p>
            </div>
        `;
    }
}

function stopAllTests() {
    if (confirm('Are you sure you want to stop all running tests?')) {
        showToast('Stopping all tests...', 'warning');
    }
}

