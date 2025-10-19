// src/app/analytics/page.tsx
'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  Zap,
  Shield,
  Database,
  Play,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const performanceData = [
    { name: 'Mon', tests: 45, passed: 38, failed: 7 },
    { name: 'Tue', tests: 52, passed: 44, failed: 8 },
    { name: 'Wed', tests: 48, passed: 42, failed: 6 },
    { name: 'Thu', tests: 61, passed: 52, failed: 9 },
    { name: 'Fri', tests: 55, passed: 48, failed: 7 },
    { name: 'Sat', tests: 38, passed: 32, failed: 6 },
    { name: 'Sun', tests: 42, passed: 36, failed: 6 },
  ];

  const modulePerformance = [
    { name: 'app', efficiency: 85, speed: 92, reliability: 88 },
    { name: 'components', efficiency: 90, speed: 87, reliability: 91 },
    { name: 'config', efficiency: 78, speed: 95, reliability: 82 },
    { name: 'constants', efficiency: 92, speed: 89, reliability: 94 },
    { name: 'context', efficiency: 86, speed: 91, reliability: 87 },
    { name: 'core', efficiency: 88, speed: 88, reliability: 89 },
    { name: 'design-system', efficiency: 91, speed: 85, reliability: 93 },
    { name: 'hooks', efficiency: 84, speed: 90, reliability: 86 },
  ];

  const testTypes = [
    { name: 'Playwright UI', count: 140, success: 112, color: 'bg-blue-500' },
    { name: 'Supawright DB', count: 140, success: 98, color: 'bg-green-500' },
    { name: 'Integration', count: 140, success: 119, color: 'bg-purple-500' },
    { name: 'Edge Cases', count: 140, success: 119, color: 'bg-yellow-500' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <div className='bg-white/10 backdrop-blur-md border-b border-white/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center'>
                <BarChart3 className='w-7 h-7 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>
                  Advanced Analytics
                </h1>
                <p className='text-white/70'>
                  Deep insights into test performance and system health
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className='px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
              >
                <option value='24h'>Last 24 Hours</option>
                <option value='7d'>Last 7 Days</option>
                <option value='30d'>Last 30 Days</option>
                <option value='90d'>Last 90 Days</option>
              </select>
              <button className='px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2'>
                <RefreshCw className='w-4 h-4' />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-white/70 text-sm font-medium'>
                  Test Efficiency
                </p>
                <p className='text-3xl font-bold text-green-400'>87%</p>
                <div className='flex items-center mt-1'>
                  <TrendingUp className='w-4 h-4 text-green-400 mr-1' />
                  <span className='text-green-400 text-sm'>+5.2%</span>
                </div>
              </div>
              <div className='w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center'>
                <Target className='w-6 h-6 text-green-400' />
              </div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-white/70 text-sm font-medium'>
                  Avg Response Time
                </p>
                <p className='text-3xl font-bold text-blue-400'>1.2s</p>
                <div className='flex items-center mt-1'>
                  <TrendingDown className='w-4 h-4 text-blue-400 mr-1' />
                  <span className='text-blue-400 text-sm'>-0.3s</span>
                </div>
              </div>
              <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center'>
                <Clock className='w-6 h-6 text-blue-400' />
              </div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-white/70 text-sm font-medium'>
                  Auto-Fixes Applied
                </p>
                <p className='text-3xl font-bold text-purple-400'>156</p>
                <div className='flex items-center mt-1'>
                  <TrendingUp className='w-4 h-4 text-purple-400 mr-1' />
                  <span className='text-purple-400 text-sm'>+12</span>
                </div>
              </div>
              <div className='w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center'>
                <Zap className='w-6 h-6 text-purple-400' />
              </div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-white/70 text-sm font-medium'>
                  System Health
                </p>
                <p className='text-3xl font-bold text-yellow-400'>94%</p>
                <div className='flex items-center mt-1'>
                  <Activity className='w-4 h-4 text-yellow-400 mr-1' />
                  <span className='text-yellow-400 text-sm'>Stable</span>
                </div>
              </div>
              <div className='w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center'>
                <Shield className='w-6 h-6 text-yellow-400' />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-6'>
              Test Performance Over Time
            </h3>
            <div className='space-y-4'>
              {performanceData.map((day, index) => (
                <div key={day.name} className='flex items-center space-x-4'>
                  <div className='w-12 text-white/70 font-medium'>
                    {day.name}
                  </div>
                  <div className='flex-1 bg-white/10 rounded-full h-3 relative'>
                    <div
                      className='bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full'
                      style={{ width: `${(day.passed / day.tests) * 100}%` }}
                    ></div>
                  </div>
                  <div className='w-20 text-right'>
                    <div className='text-green-400 text-sm font-semibold'>
                      {day.passed}
                    </div>
                    <div className='text-red-400 text-xs'>{day.failed}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-6'>
              Test Type Distribution
            </h3>
            <div className='space-y-4'>
              {testTypes.map((type, index) => (
                <div key={type.name} className='flex items-center space-x-4'>
                  <div className='w-32 text-white/70 font-medium'>
                    {type.name}
                  </div>
                  <div className='flex-1 bg-white/10 rounded-full h-3 relative'>
                    <div
                      className={`${type.color} h-3 rounded-full`}
                      style={{ width: `${(type.success / type.count) * 100}%` }}
                    ></div>
                  </div>
                  <div className='w-20 text-right'>
                    <div className='text-white text-sm font-semibold'>
                      {type.success}/{type.count}
                    </div>
                    <div className='text-white/50 text-xs'>
                      {Math.round((type.success / type.count) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module Performance */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8'>
          <h3 className='text-xl font-semibold text-white mb-6'>
            Module Performance Analysis
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {modulePerformance.map(module => (
              <div
                key={module.name}
                className='bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors'
              >
                <h4 className='font-semibold text-white capitalize mb-4'>
                  {module.name}
                </h4>
                <div className='space-y-3'>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-white/70'>Efficiency</span>
                      <span className='text-white'>{module.efficiency}%</span>
                    </div>
                    <div className='w-full bg-white/20 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full'
                        style={{ width: `${module.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-white/70'>Speed</span>
                      <span className='text-white'>{module.speed}%</span>
                    </div>
                    <div className='w-full bg-white/20 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full'
                        style={{ width: `${module.speed}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-white/70'>Reliability</span>
                      <span className='text-white'>{module.reliability}%</span>
                    </div>
                    <div className='w-full bg-white/20 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full'
                        style={{ width: `${module.reliability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-6'>
              Recent Test Runs
            </h3>
            <div className='space-y-4'>
              {[
                {
                  time: '2 minutes ago',
                  module: 'app',
                  status: 'passed',
                  duration: '1.2s',
                },
                {
                  time: '5 minutes ago',
                  module: 'components',
                  status: 'failed',
                  duration: '2.1s',
                },
                {
                  time: '8 minutes ago',
                  module: 'config',
                  status: 'passed',
                  duration: '0.9s',
                },
                {
                  time: '12 minutes ago',
                  module: 'constants',
                  status: 'passed',
                  duration: '1.5s',
                },
                {
                  time: '15 minutes ago',
                  module: 'context',
                  status: 'passed',
                  duration: '1.8s',
                },
              ].map((run, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-4 p-3 bg-white/5 rounded-xl'
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      run.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <div className='flex-1'>
                    <div className='text-white font-medium capitalize'>
                      {run.module}
                    </div>
                    <div className='text-white/70 text-sm'>{run.time}</div>
                  </div>
                  <div className='text-right'>
                    <div
                      className={`text-sm font-medium ${
                        run.status === 'passed'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {run.status === 'passed' ? (
                        <CheckCircle className='w-4 h-4' />
                      ) : (
                        <XCircle className='w-4 h-4' />
                      )}
                    </div>
                    <div className='text-white/50 text-xs'>{run.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-6'>
              System Alerts
            </h3>
            <div className='space-y-4'>
              {[
                {
                  type: 'warning',
                  message: 'High memory usage detected in app module',
                  time: '5 min ago',
                },
                {
                  type: 'info',
                  message: 'Auto-fix applied to components module',
                  time: '12 min ago',
                },
                {
                  type: 'success',
                  message: 'All tests passed for constants module',
                  time: '18 min ago',
                },
                {
                  type: 'warning',
                  message: 'Slow response time in config module',
                  time: '25 min ago',
                },
                {
                  type: 'info',
                  message: 'Database connection optimized',
                  time: '32 min ago',
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-3 p-3 bg-white/5 rounded-xl'
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'success'
                        ? 'bg-green-500'
                        : alert.type === 'warning'
                          ? 'bg-yellow-500'
                          : alert.type === 'error'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className='flex-1'>
                    <div className='text-white text-sm'>{alert.message}</div>
                    <div className='text-white/50 text-xs mt-1'>
                      {alert.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
