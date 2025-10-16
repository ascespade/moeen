export default function ChannelsAdminPage() {
  return (
    <main className="mx-auto max-w-screen-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        القنوات (واتساب)
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
              Webhook URL
            </span>
            <input
              className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900"
              placeholder="https://example.com/webhook"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
              API Token
            </span>
            <input
              className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900"
              placeholder="••••••••"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="h-10 rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            حفظ
          </button>
          <button className="h-10 rounded-md border border-gray-200 px-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            اختبار الاتصال
          </button>
        </div>
      </div>
    </main>
  );
}
