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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container-app px-4 py-12">
        <div className="card card-pad shadow-soft">
          <h1 className="text-2xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">يسعدنا تواصلكم واقتراحاتكم.</p>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">الاسم</label>
              <input className="input" required placeholder="اسمك الكامل" />
            </div>
            <div>
              <label className="block text-sm mb-1">البريد الإلكتروني</label>
              <input type="email" className="input" required placeholder="name@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الموضوع</label>
              <input className="input" required placeholder="موضوع الرسالة" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الرسالة</label>
              <textarea className="input" rows={5} required placeholder="نص الرسالة" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary" disabled={isSending}>
                {isSending ? "جارٍ الإرسال..." : "إرسال"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

