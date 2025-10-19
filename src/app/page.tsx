// src/app/page.tsx
import Navigation from '@/components/Navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="lg:ml-64">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ultimate E2E
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Self-Healing Runner
                </span>
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
                Comprehensive testing system with Playwright and Supawright. 
                Automatically detect, fix, and prevent issues with AI-powered healing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Start Testing
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-white/70 text-lg">Everything you need for comprehensive testing and auto-healing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Auto-Healing</h3>
              <p className="text-white/70 mb-6">
                Automatically detect and fix issues using AI-powered analysis and smart suggestions.
              </p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Parallel Testing</h3>
              <p className="text-white/70 mb-6">
                Run multiple test suites in parallel with intelligent resource management and load balancing.
              </p>
              <div className="flex items-center text-green-400 text-sm font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Advanced Analytics</h3>
              <p className="text-white/70 mb-6">
                Get deep insights into test performance, system health, and optimization opportunities.
              </p>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Security First</h3>
              <p className="text-white/70 mb-6">
                Built-in security scanning, vulnerability detection, and compliance checking.
              </p>
              <div className="flex items-center text-yellow-400 text-sm font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Notifications</h3>
              <p className="text-white/70 mb-6">
                Real-time alerts and notifications for test failures, system issues, and performance metrics.
              </p>
              <div className="flex items-center text-red-400 text-sm font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Customizable</h3>
              <p className="text-white/70 mb-6">
                Highly configurable system with custom rules, workflows, and integration options.
              </p>
              <div className="flex items-center text-indigo-400 text-sm font-medium">
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">System Statistics</h2>
              <p className="text-white/70 text-lg">Real-time performance metrics and insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">560</div>
                <div className="text-white/70">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">448</div>
                <div className="text-white/70">Passed Tests</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">80%</div>
                <div className="text-white/70">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">16</div>
                <div className="text-white/70">Modules Tested</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}