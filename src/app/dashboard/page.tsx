// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Database, 
  Zap, 
  Shield, 
  BarChart3, 
  Settings, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Monitor
} from 'lucide-react';

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
}

interface ModuleStats {
  name: string;
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export default function Dashboard() {
  const [stats, setStats] = useState<TestStats>({
    total: 560,
    passed: 448,
    failed: 112,
    skipped: 0,
    passRate: 80
  });

  const [modules] = useState<ModuleStats[]>([
    { name: 'app', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'components', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'config', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'constants', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'context', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'core', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'design-system', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'hooks', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'lib', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'middleware', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'scripts', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'services', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'styles', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'theme', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'types', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' },
    { name: 'utils', total: 35, passed: 28, failed: 7, passRate: 80, status: 'good' }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500 bg-green-100';
      case 'good': return 'text-blue-500 bg-blue-100';
      case 'warning': return 'text-yellow-500 bg-yellow-100';
      case 'critical': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const runTests = () => {
    setIsRunning(true);
    // Simulate test running
    setTimeout(() => {
      setIsRunning(false);
      setLastRun(new Date());
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Ultimate E2E Self-Healing Runner</h1>
                <p className="text-white/70">Comprehensive Testing & Auto-Healing System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isRunning ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Tests</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Passed</p>
                <p className="text-3xl font-bold text-green-400">{stats.passed}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Failed</p>
                <p className="text-3xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-purple-400">{stats.passRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Status</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Cpu className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white/70 text-sm">CPU</p>
                <p className="text-white font-semibold">45%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MemoryStick className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white/70 text-sm">Memory</p>
                <p className="text-white font-semibold">62%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <HardDrive className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-white/70 text-sm">Storage</p>
                <p className="text-white font-semibold">38%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Wifi className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-white/70 text-sm">Network</p>
                <p className="text-white font-semibold">98%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Last Run</span>
            </h3>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-10 h-10 text-white" />
              </div>
              <p className="text-white/70 text-sm">Last Test Run</p>
              <p className="text-white font-semibold">{lastRun.toLocaleTimeString()}</p>
              <p className="text-white/50 text-xs">{lastRun.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Module Status</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module) => (
              <div
                key={module.name}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white capitalize">{module.name}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                    {getStatusIcon(module.status)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Passed</span>
                    <span className="text-green-400 font-semibold">{module.passed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Failed</span>
                    <span className="text-red-400 font-semibold">{module.failed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Total</span>
                    <span className="text-white font-semibold">{module.total}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.passRate}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-xs text-white/70">{module.passRate}% Success</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Playwright</h4>
                <p className="text-white/70 text-sm">UI Tests</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">16 modules tested with comprehensive UI and interaction testing</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Supawright</h4>
                <p className="text-white/70 text-sm">DB Tests</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">Database and API testing with comprehensive data validation</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Integration</h4>
                <p className="text-white/70 text-sm">E2E Tests</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">End-to-end workflow testing with full system integration</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Edge Cases</h4>
                <p className="text-white/70 text-sm">Boundary Tests</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">Boundary and error condition testing for robustness</p>
          </div>
        </div>
      </div>
    </div>
  );
}