"use client";

import { useAtom } from "jotai";

import { langAtom, themeAtom } from "@/components/providers/UIProvider";

export default function ProfilePage() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [lang, setLang] = useAtom(langAtom);

  return (
    <main className="p-6 grid gap-4 max-w-2xl">
      <h1 className="text-2xl font-semibold">الملف الشخصي</h1>
      <div className="rounded-xl border p-4 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <div className="text-sm">الثيم</div>
          <div className="flex items-center gap-2">
            <button
              className={`h-9 rounded-md border px-3 ${theme === "light" ? "bg-gray-900 text-white" : ""}`}
              onClick={() => setTheme("light")}
            >
              فاتح
            </button>
            <button
              className={`h-9 rounded-md border px-3 ${theme === "dark" ? "bg-gray-900 text-white" : ""}`}
              onClick={() => setTheme("dark")}
            >
              داكن
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <div className="text-sm">اللغة</div>
          <div className="flex items-center gap-2">
            <button
              className={`h-9 rounded-md border px-3 ${lang === "ar" ? "bg-gray-900 text-white" : ""}`}
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
            <button
              className={`h-9 rounded-md border px-3 ${lang === "en" ? "bg-gray-900 text-white" : ""}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-xl border p-4 grid gap-2">
        <div className="text-sm text-gray-500">معلومات الحساب</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500">الاسم</div>
            <div className="font-medium">مستخدم تجريبي</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">البريد</div>
            <div className="font-medium">user@example.com</div>
          </div>
        </div>
      </div>
    </main>
  );
