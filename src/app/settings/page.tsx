// src/app/settings/page.tsx
'use client';

import { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Zap, 
  Shield, 
  Database, 
  Play, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Monitor,
  Bell,
  Lock,
  Key,
  Globe,
  Code,
  TestTube
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    autoRun: true,
    parallelWorkers: 2,
    timeout: 60,
    retries: 3,
    
    // Test Settings
    playwrightEnabled: true,
    supawrightEnabled: true,
    integrationEnabled: true,
    edgeCasesEnabled: true,
    
    // Auto-Fix Settings
    eslintAutoFix: true,
    prettierAutoFix: true,
    typescriptAutoFix: true,
    codeFormatting: true,
    
    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    webhookNotifications: false,
    
    // Performance Settings
    maxMemoryUsage: 80,
    cpuThreshold: 70,
    diskSpaceThreshold: 85,
    
    // Security Settings
    enableSecurityScan: true,
    enableDependencyCheck: true,
    enableVulnerabilityScan: true,
    
    // Database Settings
    dbConnectionPool: 10,
    dbTimeout: 30,
    dbRetries: 3
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'tests', name: 'Tests', icon: TestTube },
    { id: 'autofix', name: 'Auto-Fix', icon: Zap },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'performance', name: 'Performance', icon: Cpu },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    // Here you would typically save to a backend or local storage
  };

  const resetSettings = () => {
    // Reset to default settings
    setSettings({
      autoRun: true,
      parallelWorkers: 2,
      timeout: 60,
      retries: 3,
      playwrightEnabled: true,
      supawrightEnabled: true,
      integrationEnabled: true,
      edgeCasesEnabled: true,
      eslintAutoFix: true,
      prettierAutoFix: true,
      typescriptAutoFix: true,
      codeFormatting: true,
      emailNotifications: true,
      slackNotifications: false,
      webhookNotifications: false,
      maxMemoryUsage: 80,
      cpuThreshold: 70,
      diskSpaceThreshold: 85,
      enableSecurityScan: true,
      enableDependencyCheck: true,
      enableVulnerabilityScan: true,
      dbConnectionPool: 10,
      dbTimeout: 30,
      dbRetries: 3
    });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Execution Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Auto Run Tests</label>
              <p className="text-white/70 text-sm">Automatically run tests when changes are detected</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoRun}
                onChange={(e) => handleSettingChange('autoRun', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="text-white font-medium">Parallel Workers</label>
            <p className="text-white/70 text-sm mb-2">Number of parallel test workers (1-8)</p>
            <input
              type="range"
              min="1"
              max="8"
              value={settings.parallelWorkers}
              onChange={(e) => handleSettingChange('parallelWorkers', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-white/70 text-sm mt-1">
              <span>1</span>
              <span className="text-white font-semibold">{settings.parallelWorkers}</span>
              <span>8</span>
            </div>
          </div>

          <div>
            <label className="text-white font-medium">Test Timeout (seconds)</label>
            <p className="text-white/70 text-sm mb-2">Maximum time for each test to complete</p>
            <input
              type="number"
              min="10"
              max="300"
              value={settings.timeout}
              onChange={(e) => handleSettingChange('timeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-white font-medium">Retry Attempts</label>
            <p className="text-white/70 text-sm mb-2">Number of retry attempts for failed tests</p>
            <input
              type="number"
              min="0"
              max="10"
              value={settings.retries}
              onChange={(e) => handleSettingChange('retries', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Test Types</h3>
        <div className="space-y-4">
          {[
            { key: 'playwrightEnabled', name: 'Playwright UI Tests', description: 'User interface and interaction testing' },
            { key: 'supawrightEnabled', name: 'Supawright DB Tests', description: 'Database and API testing' },
            { key: 'integrationEnabled', name: 'Integration Tests', description: 'End-to-end workflow testing' },
            { key: 'edgeCasesEnabled', name: 'Edge Case Tests', description: 'Boundary and error condition testing' }
          ].map((test) => (
            <div key={test.key} className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">{test.name}</label>
                <p className="text-white/70 text-sm">{test.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[test.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleSettingChange(test.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAutoFixSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Auto-Fix Options</h3>
        <div className="space-y-4">
          {[
            { key: 'eslintAutoFix', name: 'ESLint Auto-Fix', description: 'Automatically fix ESLint errors' },
            { key: 'prettierAutoFix', name: 'Prettier Auto-Fix', description: 'Automatically format code with Prettier' },
            { key: 'typescriptAutoFix', name: 'TypeScript Auto-Fix', description: 'Automatically fix TypeScript errors' },
            { key: 'codeFormatting', name: 'Code Formatting', description: 'Apply consistent code formatting' }
          ].map((fix) => (
            <div key={fix.key} className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">{fix.name}</label>
                <p className="text-white/70 text-sm">{fix.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[fix.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleSettingChange(fix.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Thresholds</h3>
        <div className="space-y-6">
          <div>
            <label className="text-white font-medium">Maximum Memory Usage (%)</label>
            <p className="text-white/70 text-sm mb-2">Alert when memory usage exceeds this threshold</p>
            <input
              type="range"
              min="50"
              max="95"
              value={settings.maxMemoryUsage}
              onChange={(e) => handleSettingChange('maxMemoryUsage', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-white/70 text-sm mt-1">
              <span>50%</span>
              <span className="text-white font-semibold">{settings.maxMemoryUsage}%</span>
              <span>95%</span>
            </div>
          </div>

          <div>
            <label className="text-white font-medium">CPU Threshold (%)</label>
            <p className="text-white/70 text-sm mb-2">Alert when CPU usage exceeds this threshold</p>
            <input
              type="range"
              min="50"
              max="95"
              value={settings.cpuThreshold}
              onChange={(e) => handleSettingChange('cpuThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-white/70 text-sm mt-1">
              <span>50%</span>
              <span className="text-white font-semibold">{settings.cpuThreshold}%</span>
              <span>95%</span>
            </div>
          </div>

          <div>
            <label className="text-white font-medium">Disk Space Threshold (%)</label>
            <p className="text-white/70 text-sm mb-2">Alert when disk space usage exceeds this threshold</p>
            <input
              type="range"
              min="50"
              max="95"
              value={settings.diskSpaceThreshold}
              onChange={(e) => handleSettingChange('diskSpaceThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-white/70 text-sm mt-1">
              <span>50%</span>
              <span className="text-white font-semibold">{settings.diskSpaceThreshold}%</span>
              <span>95%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'tests': return renderTestSettings();
      case 'autofix': return renderAutoFixSettings();
      case 'performance': return renderPerformanceSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">System Settings</h1>
                <p className="text-white/70">Configure your Ultimate E2E Self-Healing Runner</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetSettings}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={saveSettings}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}