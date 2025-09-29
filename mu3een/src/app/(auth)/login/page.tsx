"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Placeholder: simulate magic link send
      await new Promise((r) => setTimeout(r, 600));
      if (!email.includes("@")) throw new Error("Email not registered or not authorized");
      setSuccess("تم إرسال الرابط بنجاح، فضلاً تحقق من بريدك.");
    } catch (err: any) {
      setError("البريد غير مسجل أو غير مخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white/60 dark:bg-white/5 p-6 shadow-sm text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-200" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">مرحبًا بك في لوحة تحكم مُعين</h1>
        <p className="text-sm text-gray-500 mb-6">أدخل بريدك لإرسال رابط دخول سحري</p>
        {success && <div className="mb-4 rounded-md border border-green-200 bg-green-50 text-green-800 p-3 text-sm">{success}</div>}
        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-800 p-3 text-sm">{error}</div>}
        <form className="grid gap-4 text-start" onSubmit={submit}>
          <div>
            <label className="block mb-1 text-sm">البريد الإلكتروني</label>
            <div className="relative">
              <input className="w-full h-10 rounded-md border pl-9 pr-3" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <span className="absolute inset-y-0 start-2 grid place-items-center">✉️</span>
            </div>
          </div>
          <button disabled={loading} className="h-10 rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-60">
            {loading ? "جاري الإرسال..." : "إرسال رابط دخول سحري"}
          </button>
        </form>
      </div>
    </main>
  );
}

