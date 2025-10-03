"use client";

import { useState } from "react";

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => setIsSending(false), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">يسعدنا تواصلكم واقتراحاتكم.</p>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">الاسم</label>
              <input className="block w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 px-3 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" required placeholder="اسمك الكامل" />
            </div>
            <div>
              <label className="block text-sm mb-1">البريد الإلكتروني</label>
              <input type="email" className="block w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 px-3 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" required placeholder="name@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الموضوع</label>
              <input className="block w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 px-3 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" required placeholder="موضوع الرسالة" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الرسالة</label>
              <textarea className="block w-full rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={5} required placeholder="نص الرسالة" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="h-10 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={isSending}>
                {isSending ? "جارٍ الإرسال..." : "إرسال"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

