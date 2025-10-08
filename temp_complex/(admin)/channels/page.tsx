export default function ChannelsAdminPage() {
  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        القنوات (واتساب)
      </h1>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Webhook URL
            </span>
            <input
              className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 px-3 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com/webhook"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              API Token
            </span>
            <input
              className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 px-3 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="px-4 h-10 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            حفظ
          </button>
          <button className="px-4 h-10 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
            اختبار الاتصال
          </button>
        </div>
      </div>
    </main>
  );
}
