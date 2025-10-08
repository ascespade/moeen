"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-surface)] p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-brand p-6">
        <h1 className="text-2xl font-bold text-brand mb-6 text-center">نسيت كلمة المرور</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">البريد الإلكتروني</label>
            <input type="email" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="w-full btn-brand px-4 py-2 rounded">إرسال رابط الاستعادة</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          تذكرت كلمة المرور؟ {" "}
          <Link href={ROUTES.AUTH.LOGIN} className="text-brand hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}


