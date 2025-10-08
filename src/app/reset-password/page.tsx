"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string| null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-surface)] p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-brand p-6">
        <h1 className="text-2xl font-bold text-brand mb-6 text-center">إعادة تعيين كلمة المرور</h1>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">كلمة المرور الجديدة</label>
            <input type="password" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">تأكيد كلمة المرور</label>
            <input type="password" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
          </div>
          <button type="submit" className="w-full btn-brand px-4 py-2 rounded">تعيين كلمة المرور</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          العودة إلى {" "}
          <Link href={ROUTES.AUTH.LOGIN} className="text-brand hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}


