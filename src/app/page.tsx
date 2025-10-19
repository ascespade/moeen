// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ultimate E2E Self-Healing Runner
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive testing system with Playwright and Supawright
          </p>
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ System Status: Active
            </div>
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              🧪 Tests: Generated and Ready
            </div>
            <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
              🔧 Auto-Fixes: Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}