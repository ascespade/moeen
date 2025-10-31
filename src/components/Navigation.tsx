// src/components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Settings,
  Zap,
  Database,
  Play,
  Activity,
  Shield,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const quickActions = [
  { name: 'Run All Tests', icon: Play, action: 'run-tests' },
  { name: 'Auto-Fix Issues', icon: Zap, action: 'auto-fix' },
  { name: 'Check Status', icon: Activity, action: 'check-status' },
  { name: 'Security Scan', icon: Shield, action: 'security-scan' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    // Quick action handler - implement as needed
    // Handle quick actions here
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className='lg:hidden fixed top-4 left-4 z-50'>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-colors'
        >
          {isMobileMenuOpen ? (
            <X className='w-6 h-6' />
          ) : (
            <Menu className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className='lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-md border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='flex items-center space-x-3 p-6 border-b border-white/20'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
              <Zap className='w-6 h-6 text-white' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-white'>E2E Runner</h2>
              <p className='text-white/70 text-xs'>Self-Healing System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-6 space-y-2'>
            {navigation.map(item => {
              const Sun = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Sun className='w-5 h-5' />
                  <span className='font-medium'>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className='p-6 border-t border-white/20'>
            <h3 className='text-white/70 text-sm font-medium mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-2'>
              {quickActions.map(action => {
                const Sun = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => handleQuickAction(action.action)}
                    className='w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors'
                  >
                    <Sun className='w-4 h-4' />
                    <span className='text-sm'>{action.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Indicator */}
          <div className='p-6 border-t border-white/20'>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-white/70 text-sm'>System Online</span>
            </div>
            <div className='flex items-center space-x-3 mt-2'>
              <Database className='w-4 h-4 text-white/50' />
              <span className='text-white/50 text-xs'>DB Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content offset for desktop */}
      <div className='hidden lg:block w-64 flex-shrink-0' />
    </>
  );
}
