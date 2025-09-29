export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white/60 dark:bg-white/5 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">تسجيل الدخول</h1>
        <p className="text-sm text-gray-500 mb-6">ادخل بريدك وكلمة المرور للمتابعة</p>
        <form className="grid gap-4">
          <div>
            <label className="block mb-1 text-sm">البريد الإلكتروني</label>
            <input className="w-full h-10 rounded-md border px-3" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block mb-1 text-sm">كلمة المرور</label>
            <input className="w-full h-10 rounded-md border px-3" type="password" placeholder="••••••••" />
          </div>
          <button className="h-10 rounded-md bg-gray-900 text-white hover:bg-black">دخول</button>
        </form>
      </div>
    </main>
  );
}

