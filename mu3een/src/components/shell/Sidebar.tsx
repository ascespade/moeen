"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminItems = [
  { href: "/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/conversations", label: "المحادثات", icon: "💬" },
  { href: "/flow", label: "منشئ التدفق", icon: "🔄" },
  { href: "/review", label: "مركز المراجعة", icon: "✨" },
  { href: "/settings", label: "الإعدادات", icon: "⚙️" },
  { href: "/users", label: "إدارة الفريق", icon: "👥" },
];
const staffItems = [
  { href: "/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/conversations", label: "المحادثات", icon: "💬" },
];
const viewerItems = [
  { href: "/dashboard", label: "داشبورد", icon: "📊" },
  { href: "/conversations", label: "المحادثات", icon: "💬" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = "admin";
  const items = role === "admin" ? adminItems : role === "staff" ? staffItems : viewerItems;

  return (
    <>
      {/* Overlay sidebar for mobile */}
      <div id="app-sidebar" className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full fixed top-0 start-0 bottom-0 z-50 w-72 bg-[var(--background)] border-e border-[var(--brand-border)] transition-all duration-300 lg:hidden">
        <div className="h-14 flex items-center px-4 border-b border-[var(--brand-border)]">
          <div className="inline-flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--brand-primary)] text-white grid place-items-center">م</div>
            <span className="text-lg font-bold text-[var(--foreground)]">مركز الهمم</span>
          </div>
        </div>
        <nav className="p-3 grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 h-11 rounded-lg inline-flex items-center gap-3 border transition-colors ${
                  active
                    ? "bg-[var(--brand-primary)] text-white border-transparent"
                    : "border-[var(--brand-border)] hover:bg-slate-100 dark:hover:bg-gray-800"
                }`}
                data-hs-overlay="#app-sidebar"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <aside className="hidden lg:block w-64 shrink-0 border-e border-[var(--brand-border)] min-h-dvh p-4 grid grid-rows-[auto_1fr_auto] bg-[var(--background)]">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-[var(--brand-primary)] text-white grid place-items-center">م</div>
            <span className="text-xl font-bold text-[var(--foreground)]">مركز الهمم</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block">Mu'ayin</div>
        </div>
        <nav className="grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 h-11 rounded-lg inline-flex items-center gap-3 border transition-colors ${
                  active
                    ? "bg-[var(--brand-primary)] text-white border-transparent"
                    : "border-[var(--brand-border)] hover:bg-slate-100 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 pt-6 border-t border-[var(--brand-border)] mt-6">
          <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] text-white grid place-items-center">م</div>
          <div className="text-sm">
            <div className="font-semibold text-[var(--foreground)]">مستخدم تجريبي</div>
            <button className="text-gray-500 hover:text-[var(--brand-primary)] transition-colors">تسجيل الخروج</button>
          </div>
        </div>
      </aside>
    </>
  );
}
